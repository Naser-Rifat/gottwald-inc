"use client";

/**
 * Two invisible spacer anchors used by `lib/videoPanelShader.ts` to
 * tween the WebGL video panel between start (pill) and end (full
 * aspect-video) positions during scroll.
 *
 * IDs must stay exactly as below — they are queried by id in
 * `lib/utils/utils.ts` and `lib/videoPanelShader.ts`.
 */
export default function VideoPanelAnchors() {
  return (
    <>
      {/* Start: smaller on mobile so the video begins as a pill rather
          than a half-screen block. */}
      <div
        id="video-panel-start"
        className="w-full sm:w-3/4 md:w-1/2 aspect-video mt-[3vh] md:mt-[5vh]"
      />

      <div
        id="video-panel-end-parent"
        className="relative w-full mt-[8vh] md:mt-[10vh] mb-[3vh] md:mb-[5vh] aspect-video"
      >
        <div id="video-panel-end" className="absolute inset-0 w-full h-full" />
      </div>
    </>
  );
}
