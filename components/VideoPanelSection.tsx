export default function VideoPanelSection() {
  return (
    <section
      id="video-panel-section"
      className="flex flex-col px-[5vw] w-screen min-h-screen pt-[15vh] pb-[10vh]"
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
        <p className="w-[40%] mb-5 text-sm leading-relaxed text-white/50">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Neque senectus
          sapien cras pharetra orci lorem quam arcu senectus.
        </p>
        <p className="w-[40%] mb-5 text-sm leading-relaxed text-white/50">
          Aliquam at risus; odio curabitur justo commodo aliquam tristique
          aenean. Aptent orci aliquam auctor eu metus. Ridiculus risus luctus
          varius elementum elementum. Nulla massa magnis urna malesuada orci
          parturient.
        </p>
        <p className="w-[40%] mb-5 text-sm leading-relaxed text-white/50">
          Nisi finibus magna pellentesque sapien conubia ante consequat morbi
          at. Ante turpis auctor posuere aptent nostra.
        </p>
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
