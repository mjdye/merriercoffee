import type { Metadata } from "next";
import { Lato, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["400", "700"] });
const sourceSerif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"], style: ["normal", "italic"] });

const description =
  "Merrier Coffee is a mobile espresso bar for weddings, corporate events, churches and private parties. Request a personalized quote for your event.";

export const metadata: Metadata = {
  metadataBase: new URL("https://merrier.coffee"),
  title: "Merrier Coffee · Mobile Espresso Bar for Events",
  description,
  openGraph: {
    title: "Merrier Coffee",
    description,
    url: "https://merrier.coffee",
    siteName: "Merrier Coffee",
    images: [{ url: "/photos/cart-front.jpg", width: 1500, height: 2000, alt: "The Merrier Coffee cart" }],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lato.variable} ${sourceSerif.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
