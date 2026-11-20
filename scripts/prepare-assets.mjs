// Turns the source files in assets/ into web-ready files in public/.
// Usage: node scripts/prepare-assets.mjs   (needs `brew install potrace` for the logo trace)
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join, parse } from "node:path";
import { tmpdir } from "node:os";

const root = new URL("..", import.meta.url).pathname;
const assets = join(root, "assets");
const pub = join(root, "public");
mkdirSync(join(pub, "photos"), { recursive: true });

// 1. Photos: cap the long edge at 2400px, strip metadata, keep JPEG.
for (const file of readdirSync(join(assets, "photos"))) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  const out = join(pub, "photos", `${parse(file).name}.jpg`);
  await sharp(join(assets, "photos", file))
    .rotate()
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log("photo →", out.replace(root, ""));
}

// 2. Logo: trace the cream-on-charcoal lockup into a one-color SVG (fill = currentColor).
{
  const src = join(assets, "brand", "logo-cream-on-charcoal.jpg");
  const scale = 3;
  const { data, info } = await sharp(src)
    .greyscale()
    .resize({ width: 1254 * scale, kernel: "lanczos3" })
    .blur(1.2)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Bounding box of light (logo) pixels so the SVG is tightly cropped.
  const { width: w, height: h } = info;
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[y * w + x] > 128) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  const pad = 4 * scale;
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const cw = maxX - minX + 1, ch = maxY - minY + 1;

  // Write a P4 (binary) PBM: 1 = black = traced shape, so light logo pixels → 1.
  const rowBytes = Math.ceil(cw / 8);
  const bits = Buffer.alloc(rowBytes * ch);
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++)
      if (data[(y + minY) * w + (x + minX)] > 128)
        bits[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7);
  const tmp = join(tmpdir(), "merrier-logo.pbm");
  writeFileSync(tmp, Buffer.concat([Buffer.from(`P4\n${cw} ${ch}\n`), bits]));

  const svgPath = join(pub, "logo.svg");
  execFileSync("potrace", [tmp, "-s", "-o", svgPath, "--turdsize", "20", "--alphamax", "1.1", "--opttolerance", "0.4"]);
  rmSync(tmp);

  // Make it recolorable and lean: currentColor fill, drop the potrace comment/metadata.
  let svg = readFileSync(svgPath, "utf8")
    .replace(/<\?xml[^>]*>\s*/, "")
    .replace(/<!DOCTYPE[^>]*>\s*/, "")
    .replace(/<metadata>[\s\S]*?<\/metadata>\s*/, "")
    .replace(/fill="#000000"/, 'fill="currentColor"')
    .replace(/width="[^"]*pt" height="[^"]*pt"/, "");
  writeFileSync(svgPath, svg);
  console.log(`logo  → /public/logo.svg (${cw}×${ch} trace, viewBox from potrace)`);
}

// 3. Favicon: the round cart badge (cream lockup on a dark-brown circle), like the sign on the cart.
{
  const logo = readFileSync(join(pub, "logo.svg"), "utf8");
  const vb = logo.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const inner = logo.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/currentColor/g, "#FBF8F1");
  const size = 512, logoW = 400, logoH = (logoW * vb[3]) / vb[2];
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
<circle cx="256" cy="256" r="256" fill="#3A2418"/>
<svg x="${(size - logoW) / 2}" y="${(size - logoH) / 2}" width="${logoW}" height="${logoH}" viewBox="${vb.join(" ")}">${inner}</svg>
</svg>`;
  writeFileSync(join(root, "app", "icon.svg"), icon);
  await sharp(Buffer.from(icon)).resize(180).png().toFile(join(root, "app", "apple-icon.png"));
  console.log("icon  → app/icon.svg, app/apple-icon.png");
}
