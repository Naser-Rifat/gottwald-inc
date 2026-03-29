import Link from "next/link";
import Image from "next/image";
import CookieSettingsTrigger from "./CookieSettingsTrigger";
import logo from "@/public/logo.png";

const directoryLinks = [
  { label: "Entity Grid", href: "/entity-grid" },
  { label: "Manifesto", href: "/partnerships#manifesto" },
  { label: "Cooperation Hub", href: "/cooperation-hub" },
  { label: "Strategic Assets", href: "/strategic-assets" },
  { label: "Strategic Inquiry.", href: "/contact" },
  { label: "Press / Media Kit", href: "/press-media-kit" },
  { label: "Careers", href: "/careers" },
];

const protocolItems = [
  { label: "Confidential by default", href: "/protocols#confidential-by-default" },
  { label: "Values-first selection", href: "/protocols#values-first-selection" },
  { label: "Standards-led governance", href: "/protocols#standards-led-governance" },
  { label: "Execution over exposure", href: "/protocols#execution-over-exposure" },
];

export default function FooterSection() {
  return (
    <footer className="relative w-full bg-black text-white pt-16 lg:pt-24 pb-28 md:pb-12 px-gutter z-10 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
           MAIN GRID: 4-column layout
         ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8 lg:gap-6 pb-16 lg:pb-20">
        {/* ── COL 1: BRAND IDENTITY ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="w-max">
            <Image
              src={logo}
              alt="Gott Wald"
              width={56}
              height={56}
              className="rounded-full"
              suppressHydrationWarning
            />
          </Link>

          {/* Company name */}
          <h3 className="text-2xl font-bold tracking-[0.04em] uppercase leading-tight text-white/90">
            GOTT WALD HOLDING LLC
          </h3>

          {/* Tagline */}
          <p className="text-xl text-white/70 leading-relaxed max-w-sm">
            Georgia&apos;s strategic anchor for governance, standards-led
            execution, and industrial portfolio scaling.
          </p>

          {/* Ecosystem Portals */}
          <div className="mt-6">
            <h4 className="text-md uppercase tracking-[0.3em] font-bold text-white/90 mb-3">
              Ecosystem Portals
            </h4>
            <p className="text-lg text-white/70 leading-relaxed">
              <a
                href="https://gottwald.world"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors duration-300"
              >
                gottwald.world
              </a>
              {" · "}
              <a
                href="https://plhh.world"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors duration-300"
              >
                plhh.world
              </a>
              {" · "}
              <a
                href="https://yig.care"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors duration-300"
              >
                yig.care
              </a>
            </p>
          </div>

          {/* Public Signal */}
          <div className="mt-2">
            <h4 className="text-md uppercase tracking-[0.3em] font-bold text-white/90 mb-3">
              Public Signal
            </h4>
            <a
              href="https://www.youtube.com/channel/UCvcWaJx2dcqiLAfrPkspYiw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-md text-white/70 hover:text-gold transition-colors duration-300 group/yt"
            >
              <svg
                className="w-5 h-5 shrink-0 opacity-70 group-hover/yt:opacity-100 transition-opacity duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>@GOTT_WALD</span>
            </a>
          </div>
        </div>

        {/* ── COL 2: DIRECTORY ── */}
        <div className="lg:col-span-2">
          <h4 className=" uppercase tracking-[0.3em] font-light text-white/90 mb-8">
            Directory
          </h4>
          <nav className="flex flex-col gap-1 w-max">
            {directoryLinks.map((link, i) => (
              <Link
                href={link.href}
                key={i}
                className="group flex flex-row items-center py-2 text-left cursor-pointer w-max"
              >
                {/* Left Side Arrow Reveal */}
                <span className="text-gold font-light transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-lg w-0 opacity-0 overflow-hidden group-hover:w-6 group-hover:opacity-100 group-hover:mr-2">
                  ↗
                </span>

                {/* Masking Text Scroller */}
                <div className="relative overflow-hidden flex items-center h-[1.5em]">
                  {/* Invisible spacer to define intrinsic width */}
                  <span className="block text-base font-medium uppercase tracking-[0.15em] opacity-0 pointer-events-none">
                    {link.label}
                  </span>
                  
                  {/* Visible text layers */}
                  <span className="absolute top-1/2 -translate-y-1/2 left-0 block text-base font-medium uppercase tracking-[0.15em] text-white/80 group-hover:-translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] whitespace-nowrap">
                    {link.label}
                  </span>
                  <span className="absolute top-1/2 translate-y-[150%] left-0 block text-base font-medium uppercase tracking-[0.15em] text-gold group-hover:-translate-y-1/2 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] whitespace-nowrap">
                    {link.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* ── COL 3: PROTOCOLS ── */}
        <div className="lg:col-span-3">
          <h4 className=" uppercase tracking-[0.3em] font-light text-white/90 mb-8">
            Protocols
          </h4>
          <div className="flex flex-col gap-1 w-max">
            {protocolItems.map((item, i) => (
              <Link
                href={item.href}
                key={i}
                className="group flex flex-row items-center py-2 text-left cursor-pointer w-max"
              >
                {/* Masking Text Scroller */}
                <div className="relative overflow-hidden flex items-center h-[1.5em]">
                  {/* Invisible spacer to define intrinsic width */}
                  <span className="block text-base font-medium uppercase tracking-[0.15em] opacity-0 pointer-events-none">
                    {item.label}
                  </span>
                  
                  {/* Visible text layers */}
                  <span className="absolute top-1/2 -translate-y-1/2 left-0 block text-base font-medium uppercase tracking-[0.15em] text-white/80 group-hover:-translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] whitespace-nowrap">
                    {item.label}
                  </span>
                  <span className="absolute top-1/2 translate-y-[150%] left-0 block text-base font-medium uppercase tracking-[0.15em] text-gold group-hover:-translate-y-1/2 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── COL 4: REGISTRATION / BUILD / NETWORK ── */}
        <div className="lg:col-span-3 flex flex-col gap-8 lg:items-end lg:text-right">
          {/* Registration Code */}
          <div>
            <h4 className=" uppercase tracking-[0.3em] font-light text-white/80 mb-2">
              Registration Code
            </h4>
            <span className="text-white tracking-[0.1em] tabular-nums font-mono">
              4OO415421
            </span>
          </div>

          {/* Build Version */}
          <div>
            <h4 className=" uppercase tracking-[0.3em] font-light text-white/80 mb-2">
              Build Version
            </h4>
            <span className="text-white tracking-[0.1em] font-mono">
              GOTT_WALD_INFRA_1.0
            </span>
          </div>

          {/* Network Signature */}
          <div>
            <h4 className=" uppercase tracking-[0.3em] font-light text-white/80 mb-2">
              Network Signature
            </h4>
            <span className=" font-bold tracking-widest text-gold font-mono drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]">
              888±
            </span>
          </div>

          {/* Address */}
          <div>
            <h4 className=" uppercase tracking-[0.3em] font-light text-white/80 mb-4">
              Address
            </h4>
            <address className="text-white tracking-[0.1em] font-medium text-[13px] uppercase not-italic leading-[1.7]">
              Georgia, Tbilisi,<br />
              Gldani district<br />
              Maseli Street N2a<br />
              Entrance N2,<br />
              Office N201<br />
              Reference 35.64,<br />
              Block G
            </address>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
           BOTTOM BAR: Copyright + Legal
         ═══════════════════════════════════════════════════════════ */}
      <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 xl:gap-4 pt-8 border-t border-white/10">
        <p className="text-white/60 tracking-wide font-light text-[13px] leading-relaxed max-w-xl">
          © {new Date().getFullYear()} GOTTWALD HOLDING LLC. Security-led
          operations · Confidential by default.
        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-4 gap-y-4 w-full xl:w-auto mt-2 xl:mt-0">
          <Link
            href="/imprint"
            className="text-white/90 hover:text-white transition-colors tracking-wider font-light text-[13px]"
          >
            Imprint / Legal Notice
          </Link>
          <span className="text-white/10 hidden sm:inline text-[13px]">·</span>
          <Link
            href="/privacy-policy"
            className="text-white/90 hover:text-white transition-colors tracking-wider font-light text-[13px]"
          >
            Privacy Policy
          </Link>
          <span className="text-white/10 hidden sm:inline text-[13px]">·</span>
          <CookieSettingsTrigger />
          <span className="text-white/10 hidden sm:inline text-[13px]">·</span>
          <Link
            href="/terms-of-use"
            className="text-white/90 hover:text-white transition-colors tracking-wider font-light text-[13px]"
          >
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
