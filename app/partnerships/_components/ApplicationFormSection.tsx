"use client";

import type { FormEvent, Ref } from "react";
import { useTranslations } from "next-intl";

import Honeypot from "@/components/form/Honeypot";

import MagneticButton from "./MagneticButton";

const NOISE_BG_URL =
  "url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuODUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIi8+PC9zdmc+')";

interface ApplicationFormSectionProps {
  formRef: Ref<HTMLFormElement>;
  onSubmit: (e: FormEvent) => void | Promise<void>;
  isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
}

/**
 * Partnership application form at `#apply`. 14-field application with
 * a turquoise focus accent, glassmorphic wrapper, magnetic submit
 * button, and NDA-ready checkbox.
 *
 * Field grouping intentionally reflects how the back office reads the
 * submission: identity (company + website + country + contact), nature
 * of work (type + pillars + description), proof (capabilities + proof
 * links + references), commercials (capacity + budget), and values
 * fit (values + why + constraints).
 */
export default function ApplicationFormSection({
  formRef,
  onSubmit,
  isSubmitting,
  submitStatus,
}: ApplicationFormSectionProps) {
  const tCtas = useTranslations("partnerships.ctas");

  return (
    <section
      id="apply"
      className="form-section px-gutter py-[20vh] bg-transparent relative z-10 border-t border-white/10 overflow-hidden"
    >
      {/* Parallax watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[20%] right-[-5vw] z-0 select-none opacity-50"
      >
        <span
          className="about-parallax-target block italic font-light text-white/[0.035] leading-[0.78] tracking-[-0.06em] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(6rem, 20vw, 24rem)",
          }}
        >
          apply.
        </span>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="form-reveal mb-20">
          <p className="text-sm tracking-[0.45em] uppercase text-gold/80 font-bold mb-6">
            Partnership Application
          </p>
          <h2 className="text-[clamp(3rem,6.5vw,7rem)] font-black tracking-tighter uppercase mb-8 leading-[0.9]">
            GOTT WALD
            <br />
            <span className="text-white/60">APPLICATION</span>
          </h2>
          <p className="text-xl lg:text-2xl text-white/80 font-light leading-relaxed max-w-2xl">
            If foundation and proof are real — you&apos;re welcome. If not —
            honesty is better.{" "}
            <em className="text-white/80 font-serif">
              That&apos;s how we operate.
            </em>
          </p>
          <p className="mt-4 text-white/70 text-lg font-light">
            Please keep it clear and proof-based. We review every serious
            application.
          </p>
        </div>

        <form
          ref={formRef}
          className="form-reveal flex flex-col gap-12 relative bg-[#0a0c12]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 md:p-16 lg:p-20 hover:border-white/20 transition-all duration-700 shadow-2xl"
          onSubmit={onSubmit}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(18,168,172,0.05),_transparent_60%)] pointer-events-none rounded-3xl" />
          {/* Film grain */}
          <div
            className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-soft-light rounded-3xl overflow-hidden"
            style={{ backgroundImage: NOISE_BG_URL }}
          />
          <div className="relative z-10 flex flex-col gap-12">
            <Honeypot />

            {/* Group 1: Company + Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <PeerField id="company" label="Company Name" required />
              <PeerField id="website" type="url" label="Website" placeholder="Website URL" required />
            </div>

            {/* Group 2: Country + Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <PeerField id="country" label="Country / Region" required />
              <PeerField id="contact" label="Main Contact" placeholder="Main Contact (Name, Email, Phone)" required />
            </div>

            {/* Group 3: Type + Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative mt-2">
                <label
                  htmlFor="partnership_type"
                  className="absolute left-0 -top-4 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/90"
                >
                  Partnership Type
                </label>
                <select
                  required
                  id="partnership_type"
                  name="partnership_type"
                  className="peer w-full bg-transparent border-b border-white/40 pt-8 pb-4 text-xl md:text-2xl font-light text-white/80 focus:text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled className="text-black">Select Partnership Type</option>
                  <option value="strategic" className="text-black">Strategic PARTNERSHIP</option>
                  <option value="delivery" className="text-black">Delivery PARTNERSHIP</option>
                  <option value="tech" className="text-black">Technology PARTNERSHIP</option>
                  <option value="creative" className="text-black">Creative &amp; Media PARTNERSHIP</option>
                  <option value="local" className="text-black">Local Operations PARTNERSHIP</option>
                </select>
                <div className="absolute right-0 bottom-6 pointer-events-none transition-transform duration-500 peer-focus:-rotate-180 peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)]">
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path
                      d="M1 1L7 7L13 1"
                      stroke="currentColor"
                      strokeOpacity="0.5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="peer-focus:stroke-turquoise transition-colors"
                    />
                  </svg>
                </div>
              </div>
              <PeerField id="pillars" label="Relevant Pillars" placeholder="Relevant Pillars (A, B, C...)" />
            </div>

            {/* Group 4: What you do */}
            <PeerArea id="description" label="What you do ?" placeholder="What you do  (1–3 sentences)" required />

            {/* Group 5: Capabilities + Proof */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <PeerArea id="capabilities" label="Top 3 capabilities" placeholder="Top 3 capabilities (bullet points)" required />
              <PeerArea id="proof" label="Proof of work" placeholder="Proof of work (links / portfolio / cases)" required />
            </div>

            {/* Group 5.1: References, Capacity, Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <PeerField id="references" label="References (optional)" placeholder="References (optional)" small />
              <PeerField id="capacity" label="Capacity" placeholder="Capacity (project slots / hours)" small required />
              <PeerField id="budget" label="Typical project range" placeholder="Typical project range (budget/scope)" small required />
            </div>

            {/* Group 6: Values Fit */}
            <PeerArea id="values" label="Values Fit (Required)" placeholder="Values Fit (required): 2–3 sentences on responsibility, integrity, excellence, discretion" required />

            {/* Group 7: Why + Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <PeerArea id="why" label="Why GOTT WALD?" placeholder="Why GOTT WALD? (short)" />
              <PeerArea id="constraints" label="Anything we must know?" placeholder="Anything we must know? (timing, constraints, risks)" />
            </div>

            {/* NDA Checkbox */}
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex items-center shrink-0">
                <input
                  type="checkbox"
                  id="nda"
                  name="nda"
                  className="peer w-6 h-6 appearance-none border border-white/30 rounded-sm checked:bg-turquoise checked:border-turquoise cursor-pointer transition-colors"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label
                htmlFor="nda"
                className="text-white/70 cursor-pointer text-lg md:text-xl font-light hover:text-white transition-colors"
              >
                We are NDA-ready and operate with strict discretion.
              </label>
            </div>

            <MagneticButton
              type="submit"
              disabled={isSubmitting}
              className="group relative flex items-center justify-center gap-4 bg-white px-12 py-6 overflow-hidden w-full md:w-max mt-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-full border border-transparent hover:border-turquoise/50 hover:shadow-[0_0_20px_rgba(18,168,172,0.3)] transition-all duration-500"
            >
              <span className="relative z-10 font-bold uppercase tracking-[0.15em] text-sm text-black group-hover:text-white transition-colors duration-300 pointer-events-none">
                {isSubmitting ? tCtas("submitting") : tCtas("submitApplication")}
              </span>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-turquoise group-hover:scale-[60] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none" />
            </MagneticButton>

            {submitStatus === "success" && (
              <p className="text-green-500/90 text-lg font-light mt-2 border border-green-500/20 bg-green-500/10 p-4 rounded-sm">
                Application submitted successfully. If there&apos;s a fit, we&apos;ll reach out with next steps.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-500/90 text-lg font-light mt-2 border border-red-500/20 bg-red-500/10 p-4 rounded-sm">
                Failed to submit application. Please try again later or contact us directly.
              </p>
            )}
            {submitStatus === "idle" && (
              <p className="text-white text-md font-light mt-2">
                All transmissions are secured and treated with strict confidentiality.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

/* ── Inline helpers ─────────────────────────────────────────────────────── */
// The peer-style label dance below is identical across 10+ fields. Keeping
// PeerField / PeerArea inside this file makes the form body readable
// without forcing every consumer to learn the floating-label markup.

interface PeerFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  /** Smaller font in the 3-column row so the trio doesn't dwarf the rest. */
  small?: boolean;
}

function PeerField({ id, label, placeholder, type = "text", required, small }: PeerFieldProps) {
  const fontSize = small ? "text-xl md:text-xl" : "text-xl md:text-2xl";
  return (
    <div className="relative">
      <input
        required={required}
        type={type}
        id={id}
        name={id}
        className={`peer w-full bg-transparent border-b border-white/40 pt-8 pb-4 ${fontSize} font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent`}
        placeholder={placeholder ?? label}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:${fontSize} peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none`}
      >
        {label}
      </label>
    </div>
  );
}

interface PeerAreaProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

function PeerArea({ id, label, placeholder, required }: PeerAreaProps) {
  return (
    <div className="relative">
      <textarea
        required={required}
        id={id}
        name={id}
        rows={2}
        className="peer w-full bg-transparent border-b border-white/40 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent resize-none leading-relaxed"
        placeholder={placeholder ?? label}
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}
