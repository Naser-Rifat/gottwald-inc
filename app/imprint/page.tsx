import type { Metadata } from "next";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import CustomScrollbar from "@/components/CustomScrollbar";

export const metadata: Metadata = {
  title: "Imprint / Legal Notice",
  description: "Legal and corporate information for GOTT WALD Holding LLC.",
};

export default function ImprintPage() {
  return (
    <div className="bg-[#030303] flex flex-col min-h-screen text-white/80 font-sans selection:bg-gold/20 selection:text-white">
      <div className="fixed top-0 left-0 w-full z-[100] px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="flex-1 pt-48 lg:pt-56 pb-32 px-gutter max-w-4xl mx-auto w-full">
        <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-light leading-none tracking-tighter text-white mb-6 uppercase">
          IMPRINT / LEGAL NOTICE
        </h1>
        <p className=" tracking-widest uppercase text-white/70 mb-20 drop-shadow-sm">
          Last updated: <span className="text-white/80">March 27, 2026</span>
        </p>

        <div className="space-y-16 lg:space-y-20 text-lg font-light text-white/70 leading-relaxed">
          {/* Company Details */}
          <section>
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-4 drop-shadow-md">
              COMPANY NAME
            </h2>
            <p className="text-2xl font-light text-white mb-10">
              GOTT WALD Holding LLC
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              <div>
                <h3 className="text-md font-medium text-gold tracking-widest uppercase mb-4 drop-shadow-md">
                  REGISTERED OFFICE
                </h3>
                <address className="not-italic text-white/80 border-l border-gold/30 pl-5 py-2 leading-loose">
                  Georgia, Tbilisi<br />
                  Gldani district<br />
                  Maseli Street N2a<br />
                  Entrance N2<br />
                  Office N201<br />
                  Reference 35.64, Block G
                </address>
              </div>

              <div>
                <h3 className="text-md font-medium text-gold tracking-widest uppercase mb-4 drop-shadow-md">
                  HEAD OFFICE
                </h3>
                <p className="opacity-90 mb-8">
                  <a href="mailto:office@gottwald.world" className="hover:text-white transition-colors text-white/80">
                    office@gottwald.world
                  </a>
                </p>

                <h3 className="text-md font-medium text-gold tracking-widest uppercase mb-4 drop-shadow-md">
                  PHONE
                </h3>
                <p className="opacity-90 mb-8 text-white/80">+995 591 086 578</p>

                <h3 className="text-md font-medium text-gold tracking-widest uppercase mb-4 drop-shadow-md">
                  WEBSITE
                </h3>
                <p className="opacity-90 text-white/80">
                  <a href="https://www.gottwald.world" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    www.gottwald.world
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md">
              COMPANY INFORMATION
            </h2>
            <ul className="space-y-4 opacity-90">
              <li className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-white/80 w-full sm:w-64 uppercase tracking-widest text-sm  mb-1 sm:mb-0 block shrink-0">
                  Legal form
                </span>
                <span className="text-white font-medium">Limited Liability Company (LLC)</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-white/80 w-full sm:w-64 uppercase tracking-widest text-sm mb-1 sm:mb-0 block shrink-0">
                  Registered company name
                </span>
                <span className="text-white font-medium">GOTT WALD Holding LLC</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-white/80 w-full sm:w-64 uppercase tracking-widest text-sm  mb-1 sm:mb-0 block shrink-0">
                  Company ID
                </span>
                <span className="text-white font-medium">400415421</span>
              </li>
            </ul>
          </section>

          {/* Direct Representation block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 border-t border-white/10 pt-16">
            <section>
              <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md">
                REPRESENTED BY
              </h2>
              <p className="opacity-90 text-[19px]">Mathias Gottwald, Patron</p>
            </section>

            <section>
              <h2 className="text-sm font-medium text-gold/80 tracking-widest uppercase mb-6 drop-shadow-md">
                RESPONSIBLE FOR CONTENT
              </h2>
              <p className="opacity-90 text-[19px]">Mathias Gottwald</p>
            </section>
          </div>

          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md">
              BUSINESS PURPOSE
            </h2>
            <p className="opacity-90 text-[19px] leading-relaxed max-w-3xl">
              Strategic holding structure, consulting, solution management, digital systems, executive advisory, and related project development.
            </p>
          </section>

          {/* Media Owner and Publisher */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md">
              MEDIA OWNER AND PUBLISHER
            </h2>
            <p className="opacity-90 text-[19px] font-medium text-white mb-4">GOTT WALD Holding LLC</p>
            <address className="not-italic text-white/80 border-l border-gold/30 pl-5 py-2 leading-loose">
              Georgia, Tbilisi<br />
              Gldani district<br />
              Maseli Street N2a<br />
              Entrance N2<br />
              Office N201<br />
              Reference 35.64, Block G
            </address>
          </section>

          {/* Editorial Direction */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-sm font-medium text-gold/80 tracking-widest uppercase mb-6 drop-shadow-md">
              BASIC EDITORIAL DIRECTION
            </h2>
            <p className="opacity-90 text-[19px] leading-relaxed max-w-3xl">
              This website provides information about GOTT WALD Holding LLC, its strategic activities, services, ventures, and related projects.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-sm font-medium text-gold/80 tracking-widest uppercase mb-6 drop-shadow-md">
              DISCLAIMER
            </h2>
            <p className="opacity-90 text-[19px] leading-relaxed max-w-3xl">
              The contents of this website are created with great care. However, no guarantee is given for the accuracy, completeness, or current validity of the information provided. Liability for external links or third-party content is excluded to the extent permitted by law.
            </p>
          </section>

          {/* Copyright Notice */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-sm font-medium text-gold/80 tracking-widest uppercase mb-6 drop-shadow-md">
              COPYRIGHT NOTICE
            </h2>
            <p className="opacity-90 text-[19px] leading-relaxed max-w-3xl">
              All content on this website, including text, structure, design elements, graphics, branding, and other materials, is protected by applicable intellectual property laws unless stated otherwise. Any use, reproduction, or distribution requires prior written permission unless legally permitted.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-white/10 pt-16 pb-12">
            <h2 className="text-sm font-medium text-gold/80 tracking-widest uppercase mb-4 drop-shadow-md">
              CONTACT FOR LEGAL INQUIRIES
            </h2>
            <p className="text-xl">
              <a href="mailto:office@gottwald.world" className="text-white hover:text-gold transition-colors">
                office@gottwald.world
              </a>
            </p>
          </section>

        </div>
      </main>

      <FooterSection />
      <CustomScrollbar />
    </div>
  );
}
