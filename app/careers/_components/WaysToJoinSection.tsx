import SpotlightCard from "./SpotlightCard";

const PATHS = [
  {
    label: "Path 01",
    title: "Employee",
    body: "For people who want to build long-term and carry responsibility.",
    accent: false,
  },
  {
    label: "Path 02",
    title: "Freelancer / Interim",
    body: "For professionals who deliver at a high level for defined scopes — clean standards, clear ownership.",
    accent: false,
  },
  {
    label: "Path 03",
    title: "Specialist Pool",
    body: "For selected experts we activate on demand (project-based, NDA-ready).",
    accent: true,
  },
] as const;

/**
 * Three-card row introducing how to join: employee, freelancer, or
 * specialist pool. The copper accent on Path 03 differentiates the
 * "on-call expert" track from the two contractual tracks above.
 *
 * Each card uses the shared `<SpotlightCard/>` for the mouse-follow
 * hover gradient.
 */
export default function WaysToJoinSection() {
  return (
    <section className="px-gutter py-[15vh] bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 reveal-text">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            3 WAYS TO JOIN
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-group">
          {PATHS.map((path) => (
            <SpotlightCard key={path.label} className="group backdrop-blur-md">
              <div
                className={`text-md tracking-[0.2em] uppercase mb-6 font-bold transition-colors ${
                  path.accent
                    ? "text-copper/80 group-hover:text-copper"
                    : "text-white/60 group-hover:text-silver"
                }`}
              >
                {path.label}
              </div>
              <h3 className="text-2xl font-bold mb-4">{path.title}</h3>
              <p className="text-white/80 font-light leading-relaxed text-lg">
                {path.body}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
