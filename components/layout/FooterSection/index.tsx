"use client";

import { useTranslations } from "next-intl";

import { directoryLinks, protocolItems } from "./_data/nav";

import BrandColumn from "./_components/BrandColumn";
import NavColumn from "./_components/NavColumn";
import MetadataColumn from "./_components/MetadataColumn";
import BottomBar from "./_components/BottomBar";

const FOOTER_BACKGROUND =
  "linear-gradient(180deg, rgba(5,10,18,1) 0%, rgba(3,8,14,1) 100%)";

const TOP_GLOW_BACKGROUND =
  "radial-gradient(ellipse at 10% 0%, rgba(0,109,132,0.08) 0%, transparent 60%)";

/**
 * FooterSection — 4-column footer used across every page.
 * Column 1: brand identity + ecosystem portals + YouTube.
 * Column 2: directory (with arrow reveal).
 * Column 3: protocols (no arrow).
 * Column 4: registration / build / signature / address.
 * Bottom: copyright + legal + cookie settings.
 */
export default function FooterSection() {
  const tDirectory = useTranslations("footer.directory");
  const tProtocols = useTranslations("footer.protocols");

  return (
    <footer
      className="relative w-full text-white pt-16 lg:pt-24 pb-28 md:pb-12 px-gutter z-10 overflow-hidden"
      style={{
        background: FOOTER_BACKGROUND,
        borderTop: "1px solid rgba(18,168,172,0.15)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-[50vw] h-[30vh] pointer-events-none"
        style={{ background: TOP_GLOW_BACKGROUND }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8 lg:gap-6 pb-16 lg:pb-20">
        <BrandColumn />
        <NavColumn
          title="Directory"
          links={directoryLinks}
          translateLabel={tDirectory}
          showArrow
        />
        <NavColumn
          title="Protocols"
          links={protocolItems}
          translateLabel={tProtocols}
          className="lg:col-span-3 min-w-0"
        />
        <MetadataColumn />
      </div>

      <BottomBar />
    </footer>
  );
}
