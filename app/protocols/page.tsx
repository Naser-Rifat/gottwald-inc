import type { Metadata } from "next";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import CustomScrollbar from "@/components/CustomScrollbar";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Protocols",
  description:
    "GOTT WALD Holding LLC Protocols. We treat trust, information, and access with discretion. Values come first.",
  alternates: { canonical: "/protocols" },
};

const protocolsData = [
  {
    id: "confidential-by-default",
    title: "CONFIDENTIAL BY DEFAULT",
    intro: "Trust begins before disclosure.",
    paragraphs: [
      "At GOTT WALD Holding, confidentiality is not an afterthought. It is a starting principle.",
      "We treat conversations, structures, opportunities, and sensitive information with care from the very beginning. Access is granted on the basis of relevance, alignment, and responsibility — not curiosity or visibility.",
      "We do not build through noise, premature exposure, or unnecessary public positioning. We believe that trust grows where discretion is real, consistent, and protected in practice.",
      "For us, confidentiality is part of respect. It protects people, ideas, processes, and the integrity of meaningful work."
    ]
  },
  {
    id: "values-first-selection",
    title: "VALUES-FIRST SELECTION",
    intro: "Alignment comes before expansion.",
    paragraphs: [
      "We do not select people, projects, or partnerships by volume, appearance, or short-term upside alone.",
      "At GOTT WALD Holding, values come first. We look at integrity, responsibility, long-term thinking, and human quality before we look at scale, status, or commercial potential.",
      "This principle shapes how we choose collaborations, opportunities, and strategic directions. We believe the right structure can only grow on the right foundation.",
      "Values-first selection is not a slogan. It is a filter. It helps us protect quality, preserve trust, and build relationships that can endure."
    ]
  },
  {
    id: "standards-led-governance",
    title: "STANDARDS-LED GOVERNANCE",
    intro: "Clarity requires structure.",
    paragraphs: [
      "We believe meaningful execution depends on clear principles, defined standards, and accountable decisions.",
      "At GOTT WALD Holding, governance is not bureaucracy for its own sake. It is the discipline that protects clarity, quality, and continuity across systems, people, and projects.",
      "We work through structured thinking, responsible decision-making, and operational consistency. Standards help us reduce noise, increase trust, and create a framework in which serious work can unfold.",
      "Standards-led governance means that growth is not left to chance. It is guided with intention, responsibility, and a clear internal logic."
    ]
  },
  {
    id: "execution-over-exposure",
    title: "EXECUTION OVER EXPOSURE",
    intro: "Real work comes first.",
    paragraphs: [
      "We place substance above visibility and execution above performance.",
      "At GOTT WALD Holding, we do not measure value by how loud something appears from the outside. We measure it by what is built, what is improved, what is protected, and what actually moves forward.",
      "Visibility can support credibility — but it can never replace real work. That is why we focus on progress, delivery, and outcomes before public attention.",
      "Execution over exposure means that we stay committed to what matters in practice: disciplined work, concrete results, and long-term substance."
    ]
  }
];

export default function ProtocolsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Protocols", url: "/protocols" },
        ])}
      />

      <div className="bg-[#030303] min-h-screen text-white/80 font-sans selection:bg-gold/20 selection:text-white">
        <div className="fixed top-0 left-0 w-full z-[100] px-gutter pointer-events-auto">
          <Header />
        </div>

        <main className="pt-48 lg:pt-56 pb-32">
          {/* HEADER SECTION */}
          <section className="px-gutter max-w-7xl mx-auto mb-32 lg:mb-48">
            <h1 className="text-[clamp(3.5rem,8vw,8rem)] font-light leading-[0.95] tracking-tighter text-white/90">
              PROTOCOLS
            </h1>
            <div className="w-full max-w-sm h-px bg-gold/50 mt-12 origin-left"></div>
          </section>

          {/* PROTOCOLS BLOCKS */}
          <div className="space-y-32 lg:space-y-48">
            {protocolsData.map((item, index) => (
              <section 
                key={item.id} 
                id={item.id} 
                className="px-gutter max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 scroll-mt-32"
              >
                {/* Number Indicator & Title */}
                <div className="lg:w-5/12 shrink-0">
                  <span className="block text-gold/60 font-mono text-xl tracking-[0.2em] mb-6">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <h2 className="text-3xl md:text-5xl lg:text-[54px] font-light leading-[1.1] tracking-tight text-white mb-8">
                    {item.title}
                  </h2>
                  <p className="text-2xl md:text-3xl font-serif italic text-gold/80">
                    &quot;{item.intro}&quot;
                  </p>
                </div>

                {/* Body Text */}
                <div className="lg:w-7/12 pt-0 lg:pt-20">
                  <div className="space-y-8 lg:space-y-10">
                    {item.paragraphs.map((p, pIndex) => (
                      <p 
                        key={pIndex} 
                        className="text-lg lg:text-[22px] font-light text-white/70 leading-[1.65] max-w-3xl"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>

        <FooterSection />
      </div>
      <CustomScrollbar />
    </>
  );
}
