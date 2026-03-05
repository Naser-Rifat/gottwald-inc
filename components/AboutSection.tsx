export default function AboutSection() {
  return (
    <section className="flex flex-col px-[5vw] w-screen min-h-screen justify-center">
      <h1 className="text-[9vw] mb-10 text-white">About</h1>
      <div className="max-w-2xl flex flex-col gap-4">
        <p className="text-sm leading-[1.8] text-white/50">
          This was a recreation of the{" "}
          <a
            href="https://lusion.co"
            className="text-white/70 hover:text-white underline underline-offset-2 transition-colors"
          >
            lusion.co
          </a>{" "}
          website by Mark Nguyen, as an education exercise.
        </p>
        <p className="text-sm leading-[1.8] text-white/50">
          I&apos;m on a journey to learn how to build 3D, immersive websites. By
          imitating websites I like, I learn how to build them myself.
        </p>
        <p className="text-sm leading-[1.8] text-white/50">
          Through this journey, I learned the basics of WebGL, Three.js, shaders
          and 3D modelling.
        </p>
        <p className="text-sm leading-[1.8] text-white/50">
          No source assets or code was referenced or taken from the original.
        </p>
      </div>
    </section>
  );
}
