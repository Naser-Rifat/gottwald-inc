import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import GlobalCanvas from "@/components/GlobalCanvas";
// import CustomCursor from "@/components/CustomCursor";
import NoiseOverlay from "@/components/NoiseOverlay";
import RouteCleanup from "@/components/RouteCleanup";
import DomSafetyPatch from "@/components/DomSafetyPatch";
import PageLoader from "@/components/PageLoader";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gottwald Holding LLC",
  description: "A consciously created frequency space.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-black text-text-primary font-sans antialiased"
        suppressHydrationWarning
      >
        <DomSafetyPatch />
        <RouteCleanup />
        <PageLoader />
        <GlobalCanvas />
        <NoiseOverlay />
        {/* <CustomCursor /> */}
        {children}
      </body>
    </html>
  );
}
