export default function AboutSection() {
  return (
    <section className="flex flex-col px-[4vw] w-screen min-h-screen justify-center">
      <h1 className="text-[9vw] mb-8">About</h1>
      <p className="mb-4 text-sm leading-relaxed text-gray-700 max-w-2xl">
        This was a recreation of the{" "}
        <a href="https://lusion.co" className="text-blue-600 hover:underline">
          https://lusion.co
        </a>{" "}
        website by Mark Nguyen, as an education exercise
      </p>
      <p className="mb-4 text-sm leading-relaxed text-gray-700 max-w-2xl">
        I&apos;m on a journey to learn how to build 3D, immersive websites. By
        imitating websites I like, I learn how to build them myself.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-gray-700 max-w-2xl">
        Through this journey, I learned the basics of WebGL, Three.js, shaders
        and 3D modelling.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-gray-700 max-w-2xl">
        No source assets or code was referenced or taken from the original.
      </p>
    </section>
  );
}
