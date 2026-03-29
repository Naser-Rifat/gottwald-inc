"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";

interface BrutalistContactFormProps {
  /** Optional subject injected into the hidden field to identify the source */
  subject?: string;
  /** Label for the submit button */
  submitLabel?: string;
  /** Optional custom success message */
  successMessage?: string;
  /** Optional custom template ID for EmailJS (defaults to the contact template) */
  templateId?: string;
}

export default function BrutalistContactForm({
  subject = "Website Inquiry",
  submitLabel = "Submit Inquiry",
  successMessage = "Message securely transmitted. We will review and follow up shortly.",
  templateId,
}: BrutalistContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
      console.warn("EmailJS keys are missing. Please add them to .env.local");
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const activeTemplateId =
        templateId ||
        process.env.NEXT_PUBLIC_EMAILJS_CONTACTUS_TEMPLATE_ID ||
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
        "";

      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        activeTemplateId,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      );
      setSubmitStatus("success");
      formRef.current.reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("EmailJS submission failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Focus animations
    const inputs = formRef.current?.querySelectorAll(
      "input:not([type='hidden']), textarea"
    ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;

    if (!inputs) return;

    const ctx = gsap.context(() => {
      inputs.forEach((input) => {
        const label = input.nextElementSibling as HTMLElement | null;
        const line = input.parentElement?.querySelector(".focus-line") as HTMLElement | null;

        if (!label || !line) return;

        input.addEventListener("focus", () => {
          gsap.to(label, {
            y: -24,
            scale: 0.8,
            color: "#d4af37",
            duration: 0.3,
            ease: "power2.out",
            transformOrigin: "left bottom",
          });
          gsap.to(line, { scaleX: 1, duration: 0.4, ease: "expo.out" });
        });

        input.addEventListener("blur", () => {
          if (!input.value) {
            gsap.to(label, {
              y: 0,
              scale: 1,
              color: "rgba(255,255,255,0.5)",
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            // Keep label up, but revert color
            gsap.to(label, { color: "rgba(255,255,255,0.5)", duration: 0.3 });
          }
          gsap.to(line, { scaleX: 0, duration: 0.4, ease: "expo.out" });
        });
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  return (
    <form
      ref={formRef}
      className="fade-up-element flex flex-col gap-12"
      onSubmit={handleFormSubmit}
    >
      <input type="hidden" name="subject" value={subject} />

      <div className="relative group/input">
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer focus:border-transparent transition-colors disabled:opacity-50 text-white"
          placeholder="Your Name"
        />
        <label
          htmlFor="name"
          className="absolute left-0 bottom-4 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:bottom-4 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gold origin-left"
        >
          Your Name
        </label>
        <div className="focus-line absolute bottom-0 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
      </div>

      <div className="relative group/input">
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer focus:border-transparent transition-colors disabled:opacity-50 text-white"
          placeholder="Email Address"
        />
        <label
          htmlFor="email"
          className="absolute left-0 bottom-4 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:bottom-4 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gold origin-left"
        >
          Email Address
        </label>
        <div className="focus-line absolute bottom-0 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
      </div>

      <div className="relative group/input">
        <input
          type="text"
          id="organization"
          name="organization"
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer focus:border-transparent transition-colors disabled:opacity-50 text-white"
          placeholder="Organization (Optional)"
        />
        <label
          htmlFor="organization"
          className="absolute left-0 bottom-4 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:bottom-4 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gold origin-left"
        >
          Organization (Optional)
        </label>
        <div className="focus-line absolute bottom-0 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
      </div>

      <div className="relative group/input">
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-white/20 pb-4 pt-6 outline-none text-xl lg:text-2xl font-medium placeholder-transparent relative z-10 peer resize-none focus:border-transparent transition-colors disabled:opacity-50 text-white"
          placeholder="Message Details"
        />
        <label
          htmlFor="message"
          className="absolute left-0 top-6 text-white/50 text-xl lg:text-2xl font-medium pointer-events-none transition-all z-0 peer-placeholder-shown:top-6 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-gold origin-top-left"
        >
          Message Details
        </label>
        <div className="focus-line absolute bottom-1 left-0 w-full h-0.5 bg-gold scale-x-0 origin-left pointer-events-none z-20" />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          data-magnetic
          className="group relative flex items-center gap-4 bg-white px-10 py-5 rounded-full overflow-hidden w-max disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 font-bold uppercase tracking-widest text-sm text-black group-hover:text-white transition-colors duration-300 pointer-events-none">
            {isSubmitting ? "Sending..." : submitLabel}
          </span>
          <span className="relative z-0 w-2 h-2 rounded-full bg-black group-hover:scale-[60] transition-transform duration-500 ease-out origin-center pointer-events-none " />
        </button>

        {submitStatus === "success" && (
          <p className="text-green-500/90 text-lg font-light mt-2 border border-green-500/20 bg-green-500/10 p-4 rounded-sm">
            {successMessage}
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-500/90 text-lg font-light mt-2 border border-red-500/20 bg-red-500/10 p-4 rounded-sm">
            Transmission failed. Please attempt again.
          </p>
        )}
      </div>
    </form>
  );
}
