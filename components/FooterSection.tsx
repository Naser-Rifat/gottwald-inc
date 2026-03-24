import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";

const directoryLinks = [
  { label: "Entity Grid", href: "/our-work" },
  { label: "Manifesto", href: "/about" },
  { label: "Cooperation Hub", href: "/partnerships" },
  { label: "Strategic Assets", href: "/our-work#pillars" },
  { label: "Strategic Inquiry.", href: "/contact" },
  { label: "Press / Media Kit", href: "/contact#media" },
  { label: "Careers", href: "/careers" },
];

const protocolItems = [
  "Confidential by default",
  "Values-first selection",
  "Standards-led governance",
  "Execution over exposure",
];

export default function FooterSection() {
  return (
    <footer
      className="relative w-full bg-black text-white pt-16 lg:pt-24 pb-8 px-gutter z-10 overflow-hidden"
    >
      {/* ═══════════════════════════════════════════════════════════
           MAIN GRID: 4-column layout matching reference
         ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-6 pb-16 lg:pb-20">
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
              <a href="https://gottwald.world" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-300">gottwald.world</a>
              {" · "}
              <a href="https://plhh.world" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-300">plhh.world</a>
              {" · "}
              <a href="https://yig.care" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-300">yig.care</a>
            </p>
          </div>

          {/* Public Signal */}
          <div className="mt-2">
            <h4 className="text-md uppercase tracking-[0.3em] font-bold text-white/90 mb-3">
              Public Signal
            </h4>
            <a href="https://www.youtube.com/channel/UCvcWaJx2dcqiLAfrPkspYiw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-md text-white/70 hover:text-gold transition-colors duration-300 group/yt">
              <svg className="w-5 h-5 shrink-0 opacity-70 group-hover/yt:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
          <nav className="flex flex-col">
            {directoryLinks.map((link, i) => (
              <Link
                href={link.href}
                key={i}
                className="group flex items-center py-3 relative overflow-hidden"
              >
                {/* ↗ Arrow reveal on hover (Left side) */}
                <span className="text-gold text-base font-light transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] w-0 opacity-0 overflow-hidden group-hover:w-6 group-hover:opacity-100 group-hover:-translate-y-0.5">
                  ↗
                </span>

                {/* PRESERVED: Masking reveal hover effect Text */}
                <div className="relative overflow-hidden w-full h-[1.5em] flex items-center">
                  <span className="absolute top-1/2 -translate-y-1/2 left-0 block text-base font-medium uppercase tracking-[0.15em] text-white group-hover:-translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    {link.label}
                  </span>
                  <span className="absolute top-1/2 translate-y-[150%] left-0 block text-base font-medium uppercase tracking-[0.15em] text-white group-hover:-translate-y-1/2 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
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
          <div className="flex flex-col">
            {protocolItems.map((item, i) => (
              <div
                key={i}
                className="group flex items-center py-3 border-l-2 border-transparent hover:border-gold/40 pl-0 hover:pl-4 transition-all duration-500 cursor-default"
              >
                <span className="text-base font-medium uppercase tracking-[0.15em] text-white/90 group-hover:text-white transition-colors duration-500">
                  {item}
                </span>
              </div>
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
              GOTTWALD_INFRA_1.0
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
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
        <p className=" text-white/90 tracking-wide font-light">
          © {new Date().getFullYear()} GOTTWALD HOLDING LLC. Security-led
          operations · Confidential by default.
        </p>

        <div className="flex flex-wrap items-center gap-6 mt-4 md:mt-0">
          <Link
            href="/imprint"
            className="text-white/90 hover:text-white transition-colors tracking-wider font-light text-[13px]"
          >
            Imprint / Legal Notice
          </Link>
          <span className="text-white/10 hidden md:inline text-[13px]">·</span>
          <Link
            href="/privacy-policy"
            className="text-white/90 hover:text-white transition-colors tracking-wider font-light text-[13px]"
          >
            Privacy Policy
          </Link>
          <span className="text-white/10 hidden md:inline text-[13px]">·</span>
          <Link
            href="/cookie-settings"
            className="text-white/90 hover:text-white transition-colors tracking-wider font-light text-[13px]"
          >
            Cookie Settings
          </Link>
          <span className="text-white/10 hidden md:inline text-[13px]">·</span>
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
