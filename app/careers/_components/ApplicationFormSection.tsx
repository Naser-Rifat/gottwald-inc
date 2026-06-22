"use client";

import type { FormEvent, Ref } from "react";
import { useTranslations } from "next-intl";

import Honeypot from "@/components/form/Honeypot";

import MagneticButton from "./MagneticButton";

const NOISE_BG_URL =
  "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')";

interface ApplicationFormSectionProps {
  /** Form node ref — used by the parent to call FormData() and reset()
   *  inside the submit handler. */
  formRef: Ref<HTMLFormElement>;
  /** Submit handler — keeps the network call + status side-effects on
   *  the parent so the section component stays presentational. */
  onSubmit: (e: FormEvent) => void | Promise<void>;
  /** Submitting flag controls the button label + disabled state. */
  isSubmitting: boolean;
  /** Submission outcome — drives the success/error toast under the
   *  button (or the confidentiality note when idle). */
  submitStatus: "idle" | "success" | "error";
}

/**
 * The application form section at `#apply`.
 *
 * Premium "frosted glass" wrapper with copper edge glow and the full
 * 15-field application form (name, contact, location, languages, work
 * model, travel readiness, entry path, role interest, links, CV upload,
 * availability, salary, foundation fit, message). The submit button is
 * a magnetic spring-physics CTA.
 *
 * State + the actual fetch live in the parent so this component is
 * trivially reusable in storybook / preview mode by passing a stub
 * handler.
 */
export default function ApplicationFormSection({
  formRef,
  onSubmit,
  isSubmitting,
  submitStatus,
}: ApplicationFormSectionProps) {
  const tCtas = useTranslations("careers.ctas");

  return (
    <section
      id="apply"
      className="px-gutter py-[15vh] relative border-t border-copper/20 overflow-hidden bg-[#020304]"
    >
      {/* Background parallax watermark */}
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

      {/* Ambient glow above form */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[20vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(192,120,64,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto reveal-text relative z-10">
        <div className="mb-16 text-center">
          <span className="text-sm tracking-[0.5em] uppercase text-copper font-medium block mb-4">
            INITIATE
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6 text-white drop-shadow-xl">
            APPLICATION
          </h2>
          <p className="text-white/70 font-light text-xl">
            Keep it clear and proof-based. If there&apos;s a fit, we&apos;ll
            reach out.
          </p>
        </div>

        <div className="relative p-10 md:p-16 rounded-[2rem] border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Premium frosted glass background */}
          <div className="absolute inset-0 bg-white/[0.015] backdrop-blur-2xl z-0" />
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(192,120,64,0.05),_transparent_60%)] pointer-events-none rounded-[2rem]" />
          {/* Ultra-subtle film grain */}
          <div
            className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-soft-light rounded-[2rem] overflow-hidden"
            style={{ backgroundImage: NOISE_BG_URL }}
          />

          <form
            ref={formRef}
            className="flex flex-col gap-10 relative z-10 form-section"
            onSubmit={onSubmit}
          >
            <Honeypot />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative pt-6">
                <input
                  required
                  id="name"
                  name="name"
                  type="text"
                  placeholder="First & Last Name *"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  First &amp; Last Name *
                </label>
              </div>
              <div className="relative pt-6">
                <input
                  required
                  id="contact"
                  name="contact"
                  type="text"
                  placeholder="Email / Phone *"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="contact"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  Email / Phone *
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative pt-6">
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Country / City / Time Zone"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="location"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  Country / City / Time Zone
                </label>
              </div>
              <div className="relative pt-6">
                <input
                  id="region"
                  name="region"
                  type="text"
                  placeholder="Continent / Region"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="region"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  Continent / Region
                </label>
              </div>
            </div>

            <div className="relative pt-6">
              <input
                id="languages"
                name="languages"
                type="text"
                placeholder="Languages (Select / Free text) e.g. English (Native), German (Fluent)"
                className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
              />
              <label
                htmlFor="languages"
                className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
              >
                Languages (Select / Free text)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="work_model"
                  className="text-md uppercase tracking-wider text-white/70 font-medium"
                >
                  Work Model
                </label>
                <select
                  id="work_model"
                  name="work_model"
                  className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors appearance-none cursor-pointer"
                  defaultValue="remote"
                >
                  <option value="remote" className="text-black">Remote</option>
                  <option value="hybrid" className="text-black">Hybrid</option>
                  <option value="onsite" className="text-black">On-site</option>
                  <option value="travel" className="text-black">Travel-ready</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="travel"
                  className="text-md uppercase tracking-wider text-white/70 font-medium"
                >
                  Travel Readiness
                </label>
                <select
                  id="travel"
                  name="travel"
                  className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors appearance-none cursor-pointer"
                  defaultValue="project"
                >
                  <option value="yes" className="text-black">Yes</option>
                  <option value="no" className="text-black">No</option>
                  <option value="project" className="text-black">Project-dependent</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="entry_path"
                  className="text-md uppercase tracking-wider text-white/70 font-medium"
                >
                  Entry Path
                </label>
                <select
                  id="entry_path"
                  name="entry_path"
                  className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors appearance-none cursor-pointer"
                  defaultValue="employee"
                >
                  <option value="employee" className="text-black">Employee</option>
                  <option value="freelancer" className="text-black">Freelancer / Interim</option>
                  <option value="specialist" className="text-black">Specialist Pool</option>
                </select>
              </div>
            </div>

            <div className="relative pt-6">
              <input
                id="roles"
                name="roles"
                type="text"
                placeholder="Pillars of Interest (Multi-select) & Desired Role(s)"
                className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
              />
              <label
                htmlFor="roles"
                className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
              >
                Pillars of Interest &amp; Desired Role(s)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative pt-6">
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="LinkedIn / Website"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="linkedin"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  LinkedIn / Website
                </label>
              </div>
              <div className="relative pt-6">
                <input
                  id="portfolio"
                  name="portfolio"
                  type="text"
                  placeholder="Portfolio / Proof Links (Max 3)"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="portfolio"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  Portfolio / Proof Links (Max 3)
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="cv"
                className="text-md uppercase tracking-wider text-white/70 font-medium"
              >
                CV / Resume Upload (PDF, DOC — max 5MB)
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-lg font-medium text-white/80 file:mr-4 file:py-2 file:px-6 file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-white/10 file:text-white/80 file:cursor-pointer file:rounded-none hover:file:bg-copper/20 hover:file:text-copper transition-colors focus:border-copper"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative pt-6">
                <input
                  id="availability"
                  name="availability"
                  type="text"
                  placeholder="Availability (Start date / Hrs per week)"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="availability"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  Availability (Start date / Hrs per week)
                </label>
              </div>
              <div className="relative pt-6">
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  placeholder="Salary range or Day rate (Optional)"
                  className="peer w-full bg-transparent border-b border-white/40 pb-4 outline-none text-xl font-medium text-white placeholder-transparent focus:border-silver focus:shadow-[0_1px_0_0_rgba(184,192,204,1)] transition-all"
                />
                <label
                  htmlFor="salary"
                  className="absolute left-0 top-0 text-md uppercase tracking-wider text-white/50 font-medium transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/30 peer-focus:top-0 peer-focus:text-md peer-focus:text-silver cursor-text"
                >
                  Salary range or Day rate (Optional)
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="foundation"
                className="text-md uppercase tracking-widest text-copper font-bold"
              >
                Foundation Fit (Required) *
              </label>
              <p className="text-md text-white/80 mb-2">
                2–3 sentences on truth, responsibility, justice, compassion,
                discretion, and excellence.
              </p>
              <textarea
                required
                id="foundation"
                name="foundation"
                rows={4}
                className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="message"
                className="text-md uppercase tracking-wider text-white/70 font-medium"
              >
                Short Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={2}
                className="w-full bg-transparent border-b border-white/40 pb-4 pt-6 outline-none text-xl font-medium focus:border-copper transition-colors resize-none"
              />
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center sm:items-start gap-6">
              <div className="relative w-full md:w-max mt-8">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-copper/20 blur-[30px] pointer-events-none rounded-full" />
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className="notranslate group relative flex items-center justify-center gap-4 bg-white px-10 py-5 overflow-hidden w-full disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(184,192,204,0.4)] transition-shadow duration-300"
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-md text-black group-hover:text-white transition-colors duration-300 pointer-events-none">
                    {isSubmitting
                      ? tCtas("submitting")
                      : tCtas("submitApplication")}
                  </span>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-2 h-2 rounded-full bg-silver group-hover:scale-[60] transition-transform duration-500 ease-out pointer-events-none" />
                </MagneticButton>
              </div>

              {submitStatus === "success" && (
                <p className="text-green-500/90 text-lg font-light mt-2 border border-green-500/20 bg-green-500/10 p-4 rounded-sm w-full">
                  Application submitted successfully. We&apos;ll reach out with
                  next steps if there is a fit.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-500/90 text-lg font-light mt-2 border border-red-500/20 bg-red-500/10 p-4 rounded-sm w-full">
                  Failed to submit application. Please try again later.
                </p>
              )}
              {submitStatus === "idle" && (
                <span className="text-md text-white/70 tracking-widest uppercase text-center sm:text-left">
                  Your submission is confidential.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
