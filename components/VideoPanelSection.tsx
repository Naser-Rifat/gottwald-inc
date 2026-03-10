import Link from "next/link";

export default function VideoPanelSection() {
  return (
    <section
      id="video-panel-section"
      className="flex flex-col px-[5vw] w-full min-h-screen py-[15vh]"
    >
      {/* Animated headings */}
      <div className="about-headers pb-[8vh]">
        <div className="animated-h1-container overflow-hidden w-full whitespace-nowrap">
          <h1
            id="h1-topline"
            className="text-[5vw] lg:text-[6vw] mb-0 inline-block invisible text-white uppercase tracking-tight"
          >
            Peace. Love. Harmony
          </h1>
        </div>
        <div className="animated-h1-container overflow-hidden w-full whitespace-nowrap">
          <h1
            id="h1-tagline"
            className="text-[5vw] lg:text-[6vw] mb-0 inline-block invisible text-white tracking-tight uppercase"
          >
            for more Humanity.
          </h1>
        </div>
      </div>

      {/* About paragraphs */}
      <div className="flex flex-col items-end pb-[10vh]">
        <p className="w-[40%] mb-8 text-xl leading-relaxed text-white/50 font-serif italic">
          GOTT WALD is not a collection of services. It is a unified
          architecture: modular components, one standard, one language of
          delivery—built to turn complexity into clarity, clarity into
          decisions, and decisions into measurable impact.
        </p>
        <div className="w-[40%] mb-8 text-xl leading-relaxed text-white/50 font-serif italic">
          <Link href="/about">
            <button className="h-[46px] rounded-full bg-white text-black flex items-center gap-3 px-6 hover:bg-white/90 transition-colors mt-4">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
              <span className="text-sm font-bold tracking-[0.02em] uppercase">
                About Us
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Video panel anchors */}
      <div id="video-panel-start" className="w-1/2 aspect-video" />
      <div
        id="video-panel-end-parent"
        className="relative w-full my-[20vh_auto_10vh_auto] aspect-video
                           3xl:h-[70vh] 3xl:aspect-auto"
      >
        <div
          id="video-panel-end"
          className="absolute -top-[70%] w-full h-full"
        />
      </div>
    </section>
  );
}
