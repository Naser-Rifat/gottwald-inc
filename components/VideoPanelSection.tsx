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
            className="text-[9vw] mb-0 inline-block invisible text-white"
          >
            BEYOND VISIONS
          </h1>
        </div>
        <div className="animated-h1-container overflow-hidden w-full whitespace-nowrap">
          <h1
            id="h1-tagline"
            className="text-[9vw] mb-0 inline-block invisible text-white"
          >
            WITHIN REACH
          </h1>
        </div>
      </div>

      {/* About paragraphs */}
      <div className="flex flex-col items-end pb-[10vh]">
        <p className="w-[40%] mb-8 text-xl leading-relaxed text-white/50 font-serif italic">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Neque senectus
          sapien cras pharetra orci lorem quam arcu senectus.
        </p>
        <p className="w-[40%] mb-8 text-xl leading-relaxed text-white/50 font-serif italic">
          Aliquam at risus; odio curabitur justo commodo aliquam tristique
          aenean. Aptent orci aliquam auctor eu metus. Ridiculus risus luctus
          varius elementum elementum. Nulla massa magnis urna malesuada orci
          parturient.
        </p>
        <p className="w-[40%] mb-8 text-xl leading-relaxed text-white/50 font-serif italic">
          Nisi finibus magna pellentesque sapien conubia ante consequat morbi
          at. Ante turpis auctor posuere aptent nostra.
        </p>
        <button className="h-[46px] rounded-full bg-white text-black flex items-center gap-3 px-6 hover:bg-white/90 transition-colors mt-4">
          <span className="w-1.5 h-1.5 bg-black rounded-full" />
          <span className="text-sm font-bold tracking-[0.02em] uppercase">
            About Us
          </span>
        </button>
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
