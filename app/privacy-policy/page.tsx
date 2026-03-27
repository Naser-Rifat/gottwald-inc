import type { Metadata } from "next";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import CustomScrollbar from "@/components/CustomScrollbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and data protection guidelines for GOTT WALD Holding LLC.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#030303] flex flex-col min-h-screen text-white/80 font-sans selection:bg-gold/20 selection:text-white">
      <div className="fixed top-0 left-0 w-full z-100 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main className="flex-1 pt-48 lg:pt-56 pb-32 px-gutter max-w-4xl mx-auto w-full">
        <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-light leading-none tracking-tighter text-white mb-6 uppercase">
          PRIVACY POLICY
        </h1>
        <p className="text-sm tracking-widest uppercase text-white/40 mb-20 drop-shadow-sm">
          Last updated: <span className="text-white/80">March 27, 2026</span>
        </p>

        <div className="space-y-16 lg:space-y-20 text-lg font-light text-white/70 leading-relaxed">
          
          {/* Introduction */}
          <section>
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md">
              INTRODUCTION
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>GOTT WALD Holding LLC (“we”, “us”, or “our”) is committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, process, and protect your information when you visit and interact with our website.</p>
              <p>Because we prioritize precision, structural integrity, and discretion, this platform operates with minimal invasive tracking and severe data minimization principles.</p>
            </div>
          </section>

          {/* 1. General Info & Controller */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/ text-md tracking-widest">01</span> CONTROLLER IDENTITY
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>The controller responsible for data processing on this website is:</p>
              <address className="not-italic opacity-90 border-l border-gold/30 pl-5 py-2 leading-loose">
                GOTT WALD Holding LLC<br />
                Georgia, Tbilisi<br />
                Gldani district, Maseli Street N2a<br />
                Entrance N2, Office N201<br />
                Reference 35.64, Block G
              </address>
              <p>For any privacy-related inquiries, you may contact us securely at <a href="mailto:office@gottwald.world" className="text-white hover:text-gold transition-colors">office@gottwald.world</a>.</p>
            </div>
          </section>

          {/* 2. Hosting & Infrastructure */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">02</span> HOSTING & TECHNICAL INFRASTRUCTURE
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>This website is architected for maximum security and performance. The frontend application is deployed via <strong>Vercel Inc.</strong>, utilizing their global Edge Network (CDN). Our core backend infrastructure is securely hosted on <strong>Amazon Web Services (AWS)</strong> servers.</p>
              <p>Our operational systems operate on a robust <strong>Django</strong> architecture, and all relational data is strictly encrypted and maintained within a highly secure <strong>PostgreSQL</strong> database layer. Routine, encrypted backups of server and application data are strictly maintained to ensure operational continuity and data integrity.</p>
              <p>During a visit, our servers (and Vercel&apos;s edge network) automatically collect standard technical logs, including IP addresses, timestamps, HTTP status codes, and browser versions. These logs are strictly utilized to prevent DDoS attacks and maintain the platform&apos;s structural stability.</p>
            </div>
          </section>

          {/* 3. Forms & Data Processing */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">03</span> FORMS & DATA SUBMISSION
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>When you submit information via our Contact form, Strategic Inquiry form, Careers form, or the GOTT WALD Application form, the data is transmitted directly to our secure Django backend framework and permanently stored within our strict-clearance PostgreSQL database.</p>
              <p>This data is processed exclusively to evaluate alignments, establish contact, or assess professional capabilities. We categorically <strong>do not</strong> route submissions through third-party interconnected CRMs, automation systems, or newsletter tools (such as Salesforce or HubSpot). Access to this deeply encrypted database and applicant data is reserved solely for authorized internal personnel.</p>
            </div>
          </section>

          {/* 4. Analytics & Tracking */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">04</span> ANALYTICS & TRACKING PIXELS
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>In adherence to our strict privacy doctrine, we do not employ invasive third-party analytics or behavioral tracking suites. <strong>This platform does not utilize Google Analytics, Google Tag Manager, Meta Pixel, Hotjar, or LinkedIn Insight Tags.</strong></p>
              <p>We believe your navigation of our infrastructure remains your private prerogative.</p>
            </div>
          </section>

          {/* 5. Cookie Management */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">05</span> COOKIES & CONSENT
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>We deploy a proprietary, self-contained Cookie Manager. We issue only strictly necessary operational cookies required for platform security and navigation. Optional performance cookies are only utilized upon your explicit opt-in.</p>
              <p>Your exact consent parameters are saved directly to your Browser&apos;s local storage (identified as <code>gottwald_cookie_consent</code>). This architecture ensures no consent data is broadcasted to external ad networks. You maintain the absolute right to revoke or modify your choices at any given moment via the &quot;Cookie Settings&quot; trigger permanently accessible in the footer of this website.</p>
            </div>
          </section>

          {/* 6. Communication & Emails */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-sm font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">06</span> EMAIL COMMUNICATION
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>Direct email communications to our corporate addresses are processed securely. Any systemic or transactional email (e.g., inquiry confirmations) originates strictly from our Django backend infrastructure. We do not utilize external bulk newsletter automation tools.</p>
            </div>
          </section>

          {/* 7. International Data Transfers */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">07</span> INTERNATIONAL DATA TRANSFERS
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>Because our architecture utilizes AWS and Vercel&apos;s global Edge Networks, personal data may technically be processed or stored on servers outside the European Economic Area (EEA), including the United States.</p>
              <p>In all such instances, we mandate that our infrastructure partners adhere to rigorous data protection standards, relying on Standard Contractual Clauses (SCCs) and recognizing adequacy decisions where legally required to ensure your data remains deeply secured.</p>
            </div>
          </section>

          {/* 8. Retention Periods */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">08</span> RETENTION & DELETION PERIODS
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>We govern data lifecycle through strict minimization rules:</p>
              <ul className="list-disc pl-6 space-y-3 text-white/80 marker:text-gold/50">
                <li><strong>Contact inquiries & applications:</strong> Retained only as long as necessary to facilitate ongoing business dialog or statutory limitations, after which they are thoroughly purged from our PostgreSQL database.</li>
                <li><strong>Server logs:</strong> Automatically rotated and erased within standard operational AWS/Vercel cycle timelines (typically 14 to 30 days).</li>
                <li><strong>Consent records:</strong> Maintained solely on your local device until you manually clear your browser cache.</li>
              </ul>
            </div>
          </section>

          {/* 9. Your Rights */}
          <section className="border-t border-white/10 pt-16 pb-12">
            <h2 className="text-md font-medium text-gold tracking-widest uppercase mb-6 drop-shadow-md flex items-center gap-4">
              <span className="text-white/70 text-md tracking-widest">09</span> YOUR LEGAL RIGHTS
            </h2>
            <div className="space-y-6 opacity-90 text-[19px]">
              <p>Subject to the applicable provisions of the GDPR or commensurate jurisdictional legislation, you unequivocally maintain the following rights:</p>
              <ul className="list-disc pl-6 space-y-3 text-white/80 marker:text-gold/50">
                <li><strong>Access:</strong> The right to demand a complete account of your processed data.</li>
                <li><strong>Rectification:</strong> The right to correct inaccurate or incomplete data profiles.</li>
                <li><strong>Erasure:</strong> The right to demand the total deletion of your records (&quot;Right to be Forgotten&quot;).</li>
                <li><strong>Restriction:</strong> The right to pause data processing.</li>
                <li><strong>Portability:</strong> The right to receive your data in a machine-readable format.</li>
              </ul>
              <p className="mt-6">To exercise your rights, please submit a formal declaration to <a href="mailto:office@gottwald.world" className="text-white hover:text-gold transition-colors">office@gottwald.world</a>.</p>
            </div>
          </section>

        </div>
      </main>

      <FooterSection />
      <CustomScrollbar />
    </div>
  );
}
