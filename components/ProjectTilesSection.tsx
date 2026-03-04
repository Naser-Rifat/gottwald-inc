export default function ProjectTilesSection() {
  return (
    <section
      id="project-tiles-section"
      className="flex flex-col px-[4vw] w-screen min-h-screen"
    >
      <h1 className="text-[9vw] mb-8">Featured Work</h1>
      <div className="grid grid-cols-2 gap-16">
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-1" />
          <h3 className="text-base font-semibold">Tag line</h3>
          <h4 className="text-sm text-gray-500">Tag line 2</h4>
        </div>
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-2" />
          <h3 className="text-base font-semibold">Tag line</h3>
          <h4 className="text-sm text-gray-500">Tag line 2</h4>
        </div>
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-3" />
          <h3 className="text-base font-semibold">Tag line</h3>
          <h4 className="text-sm text-gray-500">Tag line 2</h4>
        </div>
        <div className="project-tile flex flex-col rounded-md cursor-pointer aspect-video">
          <div className="project-tile-thumb w-full h-full mb-4" id="tile-4" />
          <h3 className="text-base font-semibold">Tag line</h3>
          <h4 className="text-sm text-gray-500">Tag line 2</h4>
        </div>
      </div>
    </section>
  );
}
