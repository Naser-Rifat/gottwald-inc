export default function ProjectTileModal() {
  return (
    <div id="project-tile-modal" className="project-tile-content">
      <section className="flex flex-col w-[50vw] min-h-screen justify-center px-[4vw]">
        <h1 className="text-[9vw] mb-8">Hello hello</h1>
        <p className="mb-4 text-sm leading-relaxed">
          &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p className="mb-4 text-sm leading-relaxed">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <div>
          <a className="button project-tile-back-button">Go back</a>
        </div>
      </section>
    </div>
  );
}
