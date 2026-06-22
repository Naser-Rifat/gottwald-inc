"use client";

import { useLayoutEffect, useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap-bootstrap";

import Header from "@/components/layout/Header";
import FooterSection from "@/components/layout/FooterSection";
import NextChapterTransition from "@/components/layout/NextChapterTransition";
import { usePageColorShift } from "@/lib/usePageColorShift";

import HeroSection from "./_components/HeroSection";
import ProofSection from "./_components/ProofSection";
import ManifestoSection from "./_components/ManifestoSection";
import PrincipleSection from "./_components/PrincipleSection";
import WhoWereLookingForSection from "./_components/WhoWereLookingForSection";
import NonNegotiablesSection from "./_components/NonNegotiablesSection";
import EquilibriumSection from "./_components/EquilibriumSection";
import DomainsAccordionSection from "./_components/DomainsAccordionSection";
import SelectionProcessSection from "./_components/SelectionProcessSection";
import ApplicationFormSection from "./_components/ApplicationFormSection";
/**
 * PartnershipsClient — orchestrator for /partnerships.
 *
 * Owns:
 *   - the page-wide GSAP entrance choreography (hero kinetic chars,
 *     `.reveal-up` batches, scroll-fill text, horizontal pin for the
 *     standards section, manifesto line cascade, archetype card grid,
 *     benefit/expectation list, accordion cascade, process step
 *     cascade, application form reveal, and background mouse parallax),
 *   - the hero cursor-following glow (scoped to the hero section,
 *     skipped on touch devices),
 *   - hash-scroll handling so deep links to #manifesto / #apply land at
 *     the right position after the GSAP layout settles,
 *   - the accordion's `activeAccordion` state and the application
 *     form's submit handler + status toast.
 *
 * Data lives in `@/lib/partnershipData`; section markup lives in
 * `_components/`.
 */
export default function PartnershipsClient() {
  const tNav = useTranslations("nav");

  const pageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const accordionWrapperRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // Partnerships page tints the GlobalCanvas to Deep Obsidian Petrol.
  usePageColorShift("#020508");

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData(formRef.current);
      formData.append("type", "partnership");

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
      console.error("Partnership form submission failed:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    let parallaxHandler: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // 1. Hero entrance — `.hero-reveal` staggered fade-up + kinetic chars.
      if (heroTextRef.current) {
        const heroChildren =
          heroTextRef.current.querySelectorAll(".hero-reveal");
        gsap.set(heroChildren, { opacity: 0, y: 30 });

        const heroTl = gsap.timeline({ delay: 0.2 });
        heroTl.to(heroChildren, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          force3D: true,
        });

        // Kinetic letter choreography on the headline. Each character of
        // both display lines arrives scattered (offset / rotated / faded)
        // and animates into its aligned position with elastic ease.
        // Deterministic pseudo-random offsets keep SSR/hydration stable.
        const kineticChars =
          heroTextRef.current.querySelectorAll<HTMLElement>(".kinetic-char");
        kineticChars.forEach((el, i) => {
          const seed = i + 7;
          const dx = (((seed * 73) % 100) - 50) * 1.4;
          const dy = (((seed * 137) % 80) - 40) * 1.6;
          const rot = (((seed * 211) % 40) - 20) * 0.7;
          el.dataset.dx = String(dx);
          el.dataset.dy = String(dy);
          el.dataset.rot = String(rot);
        });

        if (reducedMotion) {
          gsap.set(kineticChars, { x: 0, y: 0, rotate: 0, opacity: 1 });
        } else {
          gsap.set(kineticChars, {
            x: (i, target) => Number(target.dataset.dx),
            y: (i, target) => Number(target.dataset.dy),
            rotate: (i, target) => Number(target.dataset.rot),
            opacity: 0,
          });
          gsap.to(kineticChars, {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 1.5,
            stagger: 0.022,
            ease: "elastic.out(1, 0.7)",
            delay: 0.35,
          });
        }

        // Hero decoupled parallax typography
        const heroParent = heroTextRef.current?.parentElement;
        gsap.to(gsap.utils.toArray(".parallax-fast", pageRef.current!), {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: heroParent,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(gsap.utils.toArray(".parallax-slow", pageRef.current!), {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: heroParent,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Scroll indicator loop
        gsap.fromTo(
          gsap.utils.toArray(".scroll-indicator-line", pageRef.current!),
          { yPercent: -100 },
          { yPercent: 400, duration: 2, repeat: -1, ease: "none" },
        );

        // Hero container fade/scale on scroll out
        gsap.to(heroTextRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: heroTextRef.current?.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 2. Reveal-up batched.
      ScrollTrigger.batch(".reveal-up", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.1,
              force3D: true,
              clearProps: "transform",
            },
          );
        },
        once: true,
      });

      // Scroll-fill text
      gsap.utils
        .toArray<HTMLElement>(".scroll-fill-text", pageRef.current!)
        .forEach((el) => {
          gsap.to(el, {
            backgroundPosition: "0% 0",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 40%",
              scrub: true,
            },
          });
        });

      // 3. Horizontal-scroll pin for the standards section.
      const scrollWrapper = gsap.utils.toArray(
        ".standards-scroll-wrapper",
        pageRef.current!,
      )[0] as HTMLElement;
      if (scrollWrapper && window.innerWidth >= 768) {
        gsap.to(scrollWrapper, {
          x: () => -(scrollWrapper.scrollWidth - window.innerWidth),
          force3D: true,
          ease: "none",
          scrollTrigger: {
            trigger: "#standards-section",
            start: "top top",
            end: () => `+=${scrollWrapper.scrollWidth - window.innerWidth}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              window.dispatchEvent(
                new CustomEvent("updateStandardsPagination"),
              );
            },
          },
        });
      }

      // 4. Manifesto lines — staggered cascade.
      const manifestoLines = gsap.utils.toArray(
        ".manifesto-line",
        pageRef.current!,
      ) as HTMLElement[];
      manifestoLines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            delay: i * 0.06,
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // 5. Archetype cards — staggered grid entrance.
      const archCards = gsap.utils.toArray(
        ".arch-card",
        pageRef.current!,
      ) as HTMLElement[];
      gsap.fromTo(
        archCards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: archCards[0]?.parentElement,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // 6. Partner benefits/expectations — list cascade.
      const benefitItems = gsap.utils.toArray(
        ".benefit-item",
        pageRef.current!,
      ) as HTMLElement[];
      benefitItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // 7. Accordion items — sequential slide-in.
      const accordionItems = gsap.utils.toArray(
        ".accordion-item",
        pageRef.current!,
      ) as HTMLElement[];
      accordionItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // 8. Selection process steps — cascade with scale.
      const processSteps = gsap.utils.toArray(
        ".process-step",
        pageRef.current!,
      ) as HTMLElement[];
      gsap.fromTo(
        processSteps,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: processSteps[0]?.parentElement,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // 9. Application form — cinematic entrance.
      const formSection = pageRef.current!.querySelector(".form-section");
      if (formSection) {
        const formElements = formSection.querySelectorAll(".form-reveal");
        gsap.fromTo(
          formElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "expo.out",
            force3D: true,
            clearProps: "transform",
            scrollTrigger: {
              trigger: formSection,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // 10. Background mouse parallax — watermark + liquid aurora.
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

  // Cursor-following atmospheric glow scoped to the hero. Touch / no-hover
  // devices skip entirely (cursor-following ambient on touch is meaningless
  // and degrades perf).
  useEffect(() => {
    const section = heroSectionRef.current;
    const glow = heroGlowRef.current;
    if (!section || !glow) return;

    if (typeof window === "undefined") return;
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!canHover) return;

    const quickX = gsap.quickTo(glow, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    const quickY = gsap.quickTo(glow, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    let idleTimer: number | null = null;

    const setIdle = (idle: boolean) => {
      if (idle) glow.classList.add("hero-cursor-glow--idle");
      else glow.classList.remove("hero-cursor-glow--idle");
    };

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      quickX(x);
      quickY(y);
      gsap.to(glow, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      setIdle(false);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIdle(true), 400);
    };

    const handleEnter = () => {
      gsap.to(glow, { opacity: 1, duration: 0.6, ease: "power2.out" });
    };

    const handleLeave = () => {
      gsap.to(glow, { opacity: 0, duration: 0.7, ease: "power2.out" });
      setIdle(false);
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    section.addEventListener("mousemove", handleMove, { passive: true });
    section.addEventListener("mouseenter", handleEnter);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseenter", handleEnter);
      section.removeEventListener("mouseleave", handleLeave);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
    };
  }, []);

  // Hash-scroll handler so deep links land at the right position once
  // GSAP and the rest of the layout have settled.
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100;
          const y =
            element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 600);
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-transparent min-h-screen text-white font-sans overflow-x-hidden selection:bg-turquoise selection:text-black"
    >
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        <HeroSection
          sectionRef={heroSectionRef}
          glowRef={heroGlowRef}
          textRef={heroTextRef}
        />
        <ProofSection />
        <ManifestoSection />
        <PrincipleSection />
        <WhoWereLookingForSection />
        <NonNegotiablesSection />
        <EquilibriumSection />
        <DomainsAccordionSection
          activeAccordion={activeAccordion}
          setActiveAccordion={setActiveAccordion}
          wrapperRef={accordionWrapperRef}
        />
        <SelectionProcessSection />
        <ApplicationFormSection
          formRef={formRef}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
        />

        {/* Footer + next chapter */}
        <section className="relative z-10 bg-[#0a0a0a]">
          <FooterSection />
        </section>
        <NextChapterTransition
          nextTitle={tNav("careers")}
          nextHref="/careers"
          prevHref="/about"
          narrativeLine="Standards aligned. One more door remains."
          accentColor="#c07840"
        />
      </main>
    </div>
  );
}
