import Header from "./Header";

export default function PhysicsSandboxSection() {
  return (
    <section className="flex flex-col px-[4vw] w-screen min-h-screen">
      <Header />
      <div id="physics-sandbox-div" className="w-full flex-1 mb-[30px]" />
    </section>
  );
}
