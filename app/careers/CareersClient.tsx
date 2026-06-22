"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "@/components/layout/Header";
import FooterSection from "@/components/layout/FooterSection";
import NextChapterTransition from "@/components/layout/NextChapterTransition";
import { usePageColorShift } from "@/lib/usePageColorShift";

import HeroSection from "./_components/HeroSection";
import WaysToJoinSection from "./_components/WaysToJoinSection";
import WhoWereLookingForSection from "./_components/WhoWereLookingForSection";
import RolesByPillarSection from "./_components/RolesByPillarSection";
import ProcessSection from "./_components/ProcessSection";
import ApplicationFormSection from "./_components/ApplicationFormSection";
import ConclusionSection from "./_components/ConclusionSection";

gsap.registerPlugin(ScrollTrigger);

/**
 * CareersClient — orchestrator for /careers.
 *
 * Owns:
 *   - the page-wide GSAP choreography (`.reveal-text` batches with a
 *     re-fire guard, `.stagger-group` cascades, hero breathing pulse,
 *     animated separator scaleX, eyebrow reveal, mouse parallax for the
 *     watermark + liquid aurora layers),
 *   - the page-tint shift toward Turquoise,
 *   - the accordion's `openPillar` state (lifted so a deep link could
 *     drive it from the URL later without a structural change),
 *   - the application form's submit handler (FormData → /api/send-email)
 *     plus the `submitStatus` toast.
 *
 * Static content lives in `_data/`; section markup lives in
 * `_components/`.
 */
export default function CareersClient() {
  const tNav = useTranslations("nav");

  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  const [openPillar, setOpenPillar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // Careers page tints the GlobalCanvas to Turquoise.
  usePageColorShift("#0f8b8d");

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData(formRef.current);
      formData.append("type", "careers");

      const res = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setSubmitStatus("success");
      formRef.current.reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Careers form submission failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let parallaxHandler: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      // WeakSet guards against re-firing: Google Translate mutates text
      // nodes when the user switches language, which can trigger
      // ScrollTrigger re-evaluation and re-run `onEnter` for elements
      // already animated, snapping them back to opacity:0 and causing a
      // flicker.
      const animated = new WeakSet<Element>();
      ScrollTrigger.batch(".reveal-text", {
        start: "top 85%",
        onEnter: (batch) => {
          const fresh = batch.filter((el) => !animated.has(el));
          if (fresh.length === 0) return;
          fresh.forEach((el) => animated.add(el));
          gsap.fromTo(
            fresh,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.1,
              force3D: true,
            },
          );
        },
      });

      const staggerGroups = gsap.utils.toArray(
        ".stagger-group",
        pageRef.current!,
      ) as HTMLElement[];
      staggerGroups.forEach((group) => {
        const items = group.querySelectorAll(".stagger-item");
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Hero breathing pulse
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scale: 1.008,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "left center",
        });
      }

      // Animated separator line
      if (separatorRef.current) {
        gsap.fromTo(
          separatorRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: separatorRef.current,
              start: "top 85%",
            },
          },
        );
      }

      // Scroll-fill Typography (kept warm in case .scroll-fill-text
      // markup returns later; harmless no-op if no element matches).
      gsap.to(".scroll-fill-text", {
        backgroundPosition: "0% 0",
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-fill-text",
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
        },
      });

      // Eyebrow reveal (same defensive treatment).
      gsap.fromTo(
        ".careers-eyebrow",
        { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          duration: 1,
          ease: "power4.inOut",
          delay: 0.3,
        },
      );

      // Premium mouse parallax for the watermark + liquid aurora layers.
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!reducedMotion) {
        parallaxHandler = (e: MouseEvent) => {
          const px = e.clientX / window.innerWidth - 0.5;
          const py = e.clientY / window.innerHeight - 0.5;

          gsap.to(".about-parallax-target", {
            x: px * 160,
            y: py * 160,
            duration: 1.5,
            ease: "power2.out",
            overwrite: "auto",
          });

          gsap.to(".about-liquid-aurora", {
            x: px * -250,
            y: py * -250,
            duration: 2.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        window.addEventListener("mousemove", parallaxHandler);
      }
    }, pageRef);

    return () => {
      ctx.revert();
      if (parallaxHandler)
        window.removeEventListener("mousemove", parallaxHandler);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black relative bg-[#050505]"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        <HeroSection heroRef={heroRef} />

        {/* Animated separator between hero and the next block. */}
        <div className="px-gutter mb-4">
          <div
            ref={separatorRef}
            className="h-px w-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(184,192,204,0.4) 0%, rgba(192,120,64,0.3) 50%, rgba(184,192,204,0.1) 100%)",
            }}
          />
        </div>

        <WaysToJoinSection />
        <WhoWereLookingForSection />
        <RolesByPillarSection
          openPillar={openPillar}
          setOpenPillar={setOpenPillar}
        />
        <ProcessSection />
        <ApplicationFormSection
          formRef={formRef}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
        />
      </main>

      <ConclusionSection />

      <FooterSection />

      <NextChapterTransition
        nextTitle={tNav("contact")}
        nextHref="/contact"
        prevHref="/partnerships"
        narrativeLine="If you've read this far — you already understand us."
        accentColor="#c07840"
      />
    </div>
  );
}
