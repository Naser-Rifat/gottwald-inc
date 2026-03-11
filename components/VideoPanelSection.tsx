import Link from "next/link";

export default function VideoPanelSection() {
  return (
    <section
      id="video-panel-section"
      className="flex flex-col px-gutter w-full min-h-screen py-[15vh]"
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
            <button
              className="h-11.5 w-fit rounded-full flex items-center gap-2.5 uppercase text-sm font-medium
                         tracking-[0.02em] transition-colors mt-4
                         bg-white/10 text-white hover:bg-white/15 border border-white/10"
              style={{ padding: "0 18px 0 22px" }}
            >
              <span>About Us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </button>
          </Link>
        </div>
      </div>

      {/* Video panel anchors */}
      <div id="video-panel-start" className="w-1/2 aspect-video mt-[5vh]" />
      
      {/* 
        Removed the aggressive "-top-[70%]" absolute offset to prevent this anchor from 
        colliding into the PhysicsSandboxSection above it. The GSAP HomeScene shader handles
        the follow speed automatically, so this end anchor can sit natively inside flow. 
      */}
      <div
        id="video-panel-end-parent"
        className="relative w-full mt-[10vh] mb-[15vh] aspect-video 3xl:h-[70vh] 3xl:aspect-auto"
      >
        <div
          id="video-panel-end"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </section>
  );
}
