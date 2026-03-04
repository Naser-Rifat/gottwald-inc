import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lusion.co Recreation - Three.js WebGL Experience",
  description:
    "A recreation of lusion.co featuring WebGL, Three.js, physics sandbox, animated tube, video panel, and interactive project tiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
