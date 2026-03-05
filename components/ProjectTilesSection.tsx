export default function ProjectTilesSection() {
  return (
    <section
      id="project-tiles-section"
      className="flex flex-col px-[5vw] w-screen min-h-screen py-[10vh]"
    >
      <h1 className="text-[9vw] mb-10 text-white">Featured Work</h1>
      <div className="grid grid-cols-2 gap-x-10 gap-y-14">
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-1" />
          <h3 className="text-base font-semibold text-white">Tag line</h3>
          <h4 className="text-sm text-white/40 mt-1">Tag line 2</h4>
        </div>
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-2" />
          <h3 className="text-base font-semibold text-white">Tag line</h3>
          <h4 className="text-sm text-white/40 mt-1">Tag line 2</h4>
        </div>
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-3" />
          <h3 className="text-base font-semibold text-white">Tag line</h3>
          <h4 className="text-sm text-white/40 mt-1">Tag line 2</h4>
        </div>
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-4" />
          <h3 className="text-base font-semibold text-white">Tag line</h3>
          <h4 className="text-sm text-white/40 mt-1">Tag line 2</h4>
        </div>
      </div>
    </section>
  );
}
