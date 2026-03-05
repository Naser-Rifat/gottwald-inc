import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center pt-6 pb-4 relative z-20 text-white w-full">
      {/* Logo */}
      <div className="shrink-0">
        <Link href="/" className="inline-block group">
          <div className="border border-white/60 px-4 py-2 flex items-center gap-1.5 hover:bg-white/10 transition-colors">
            <span className="text-[12px] font-extrabold tracking-[0.15em] leading-none">
              GOTT
            </span>
            <span className="text-[12px] font-light text-white/30 leading-none">
              :
            </span>
            <span className="text-[12px] font-extrabold tracking-[0.15em] leading-none">
              WALD
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex items-center gap-8">
        <a
          href="#"
          className="text-[11px] tracking-[0.2em] font-normal text-white/70 hover:text-white transition-colors"
        >
          ABOUT
        </a>
        <a
          href="#"
          className="text-[11px] tracking-[0.2em] font-normal text-white/70 hover:text-white transition-colors"
        >
          CONTACT
        </a>
        <a
          href="https://lusion.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[0.2em] font-normal text-white/70 hover:text-white transition-colors flex items-center gap-1"
        >
          LUSION <span className="text-[10px]">↗</span>
        </a>
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-5">
        <div className="flex items-center rounded-full border border-white/30 p-[2px]">
          <button className="px-3.5 py-1 bg-white text-black rounded-full text-[10px] font-bold tracking-[0.12em]">
            GRID
          </button>
          <button className="px-3.5 py-1 text-white/40 text-[10px] font-bold tracking-[0.12em] hover:text-white transition-colors">
            LIST
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">B</span>
          <span className="text-[10px] text-white/50">○</span>
        </div>
      </div>
    </header>
  );
}
