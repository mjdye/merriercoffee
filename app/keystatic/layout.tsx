import KeystaticApp from "./keystatic";

export const metadata = { title: "Edit site · Merrier Coffee", robots: { index: false } };

export default function Layout({ children }: LayoutProps<"/keystatic">) {
  return (
    <>
      <KeystaticApp />
      {/* The page only renders a request-time marker (no UI); it must be rendered so Next.js sees it. */}
      {children}
    </>
  );
}
