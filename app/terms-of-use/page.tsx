import type { Metadata } from "next";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import CustomScrollbar from "@/components/CustomScrollbar";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions governing access to and use of the GOTT WALD Holding LLC website.",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUsePage() {
  return (
    <div className="bg-[#030303] flex flex-col min-h-screen text-white/80 font-sans selection:bg-gold/20 selection:text-white">
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/terms-of-use",
            name: "Terms of Use — GOTT WALD Holding",
            description:
              "Terms and conditions governing access to and use of the GOTT WALD Holding LLC website, including acceptable use, IP, and liability.",
          }),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Terms of Use", url: "/terms-of-use" },
          ]),
        ]}
      />
      <div className="fixed top-0 left-0 w-full z-100 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="flex-1 pt-48 lg:pt-56 pb-32 px-gutter max-w-4xl mx-auto w-full">
        <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-light leading-none tracking-tighter text-white mb-6 uppercase">
          TERMS OF USE
        </h1>
        <p className=" tracking-widest uppercase text-white/70 mb-20 drop-shadow-sm">
          Last updated: <span className="text-white/80">March 27, 2026</span>
        </p>

        <div className="space-y-16 lg:space-y-20 text-lg font-light text-white/70 leading-relaxed">
          
          {/* Introduction */}
          <section>
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md">
              INTRODUCTION
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>Welcome to the website of GOTT WALD Holding LLC (“GOTT WALD”, “we”, “us”, or “our”).</p>
              <p>These Terms of Use govern access to and use of this website. By accessing or using this website, you acknowledge these Terms of Use and agree to use the website in a lawful and appropriate manner.</p>
              <p>If you do not agree with these Terms of Use, please do not use this website.</p>
            </div>
          </section>

          {/* 1. Scope */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">01</span> SCOPE
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>These Terms of Use apply to all visitors, users, and other persons accessing this website and its content.</p>
            </div>
          </section>

          {/* 2. Purpose of the website */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">02</span> PURPOSE OF THE WEBSITE
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>This website is provided for general information about GOTT WALD Holding LLC, its activities, services, ventures, projects, and related areas of interest.</p>
              <p>Nothing on this website constitutes legal, tax, investment, financial, medical, or other regulated professional advice unless expressly stated otherwise.</p>
            </div>
          </section>

          {/* 3. No offer / no binding commitment */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">03</span> NO OFFER / NO BINDING COMMITMENT
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>The information provided on this website does not constitute a binding offer, guarantee, promise of availability, or invitation to enter into a contract unless expressly stated otherwise in writing.</p>
              <p>Any strategic inquiry, contact, discussion, or exchange initiated through this website remains non-binding unless and until formal written agreements are concluded.</p>
            </div>
          </section>

          {/* 4. Acceptable use */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">04</span> ACCEPTABLE USE
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others, restrict access, interfere with operations, or compromise the security or integrity of the website.</p>
              <p>In particular, you must not:</p>
              <ul className="list-disc pl-6 space-y-3 text-white/80 marker:text-gold/50">
                <li>misuse the website or attempt unauthorized access</li>
                <li>disrupt, damage, overload, or impair the website or its infrastructure</li>
                <li>use automated means to scrape, extract, monitor, or reproduce website content without prior written permission, except where legally permitted</li>
                <li>submit false, misleading, unlawful, abusive, or harmful content through any form or communication channel</li>
                <li>use the website in connection with unlawful, fraudulent, or infringing activity</li>
              </ul>
            </div>
          </section>

          {/* 5. Intellectual property */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">05</span> INTELLECTUAL PROPERTY
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>Unless otherwise stated, all content on this website, including text, structure, design elements, graphics, branding, logos, layouts, concepts, and other materials, is owned by or licensed to GOTT WALD Holding LLC and is protected by applicable intellectual property laws.</p>
              <p>No part of this website may be copied, reproduced, distributed, modified, published, transmitted, displayed, or otherwise used without prior written permission, unless such use is legally permitted.</p>
            </div>
          </section>

          {/* 6. Third-party links and external content */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">06</span> THIRD-PARTY LINKS AND EXTERNAL CONTENT
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>This website may contain links to third-party websites, platforms, or services for convenience or reference.</p>
              <p>We do not control such third-party content and accept no responsibility or liability for its accuracy, legality, availability, security, or practices. Access to third-party websites is at your own risk and subject to their own terms and policies.</p>
            </div>
          </section>

          {/* 7. Disclaimer */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">07</span> DISCLAIMER
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>We aim to keep the information on this website accurate, current, and useful. However, we make no representation or warranty, express or implied, that the website or its content is complete, accurate, reliable, suitable, available, or up to date at all times.</p>
              <p>The use of this website and reliance on its content is at your own risk.</p>
            </div>
          </section>

          {/* 8. Limitation of liability */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">08</span> LIMITATION OF LIABILITY
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>To the fullest extent permitted by applicable law, GOTT WALD Holding LLC shall not be liable for any direct, indirect, incidental, consequential, special, or other damages arising out of or in connection with access to, use of, inability to use, or reliance on this website or its content.</p>
              <p>Nothing in these Terms of Use excludes or limits liability where such exclusion or limitation is not permitted by law.</p>
            </div>
          </section>

          {/* 9. Privacy and cookies */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">09</span> PRIVACY AND COOKIES
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>The processing of personal data is governed by our Privacy Policy.</p>
              <p>The use of cookies and similar technologies is governed by our cookie settings and, where applicable, our Cookie Policy.</p>
            </div>
          </section>

          {/* 10. Availability and changes */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">10</span> AVAILABILITY AND CHANGES
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>We may modify, suspend, restrict, or discontinue any part of this website at any time and without notice.</p>
              <p>We may also update these Terms of Use from time to time. The current version will always be published on this page with the relevant “Last updated” date.</p>
            </div>
          </section>

          {/* 11. Governing law */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">11</span> GOVERNING LAW
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>These Terms of Use shall be governed by the applicable laws relevant to the operation of GOTT WALD Holding LLC, unless mandatory legal provisions require otherwise.</p>
            </div>
          </section>

          {/* 12. Contact */}
          <section className="border-t border-white/10 pt-16 pb-12">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white text-md tracking-widest">12</span> CONTACT
            </h2>
            <div className="space-y-8 opacity-90 text-[19px]">
              <p>If you have any questions regarding these Terms of Use, please contact:</p>
              <div>
                <p className="font-medium text-white mb-2">GOTT WALD Holding LLC</p>
                <div className="flex gap-4">
                  <span className="text-white uppercase tracking-widest text-sm w-20 shrink-0 mt-1.5">Email</span>
                  <a href="mailto:office@gottwald.world" className="hover:text-gold transition-colors block font-medium">office@gottwald.world</a>
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="text-white uppercase tracking-widest text-sm  w-20 shrink-0 mt-1.5 ">Phone</span>
                  <span className="font-medium">+995 591 086 578</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="text-white uppercase tracking-widest text-sm w-20 shrink-0 mt-1.5">Website</span>
                  <a href="https://www.gottwald.world" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors block font-medium">www.gottwald.world</a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
      <CustomScrollbar />
    </div>
  );
}
