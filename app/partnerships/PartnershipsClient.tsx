"use client";

import { useLayoutEffect, useEffect, useRef, useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";
import Honeypot from "@/components/Honeypot";
import {
  NON_NEGOTIABLES,
  PARTNERSHIP_DOMAINS,
  PARTNERSHIP_ARCHETYPES,
  PARTNER_BENEFITS,
  PARTNER_EXPECTATIONS,
  MANIFESTO_LINES,
  PARTNERSHIP_PRINCIPLES,
  PARTNERSHIP_SELECTION_STEPS,
} from "@/lib/partnershipData";

gsap.registerPlugin(ScrollTrigger);

function MagneticButton({ children, className = "", onClick, disabled, type = "button" }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-10 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(18,168,172,0.12)] stagger-item ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(18,168,172,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">{children}</div>
    </div>
  );
}
function ParallaxShard({ principle, index }: { principle: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 50 : 100, index % 2 === 0 ? -50 : -100]
  );

  return (
    <motion.div ref={ref} style={{ y: yOffset }} className="group/shard relative h-full">
      <SpotlightCard className="p-8 h-full flex items-center border border-white/5 bg-[#0a0c12]/80 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/shards:opacity-20 group-hover/shards:blur-sm hover:!opacity-100 hover:!blur-none hover:scale-[1.02] hover:z-10 hover:border-turquoise/30">
        <div className="flex items-center gap-6">
          <span className="w-1.5 h-1.5 bg-turquoise rounded-full shrink-0 group-hover/shard:scale-[3] transition-transform duration-500 shadow-[0_0_15px_rgba(18,168,172,0.8)]" />
          <p className="text-xl lg:text-2xl font-light text-white/70 group-hover/shard:text-white group-hover/shard:translate-x-2 transition-all duration-500">
            {principle}
          </p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}


function ArchetypeCard({ arch, index, flexValue, onHover, onLeave }: any) {
  return (
    <motion.div
      layout
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{ flex: flexValue }}
      initial={{ flex: flexValue }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="group relative bg-[#0a0c12] p-8 lg:p-10 rounded-2xl border border-white/8 hover:border-[var(--color-petrol)]/40 overflow-hidden flex flex-col justify-between cursor-default transition-[border-color,box-shadow] duration-700 w-full min-h-[320px] md:min-h-0 md:w-auto"
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (x - centerX) * -0.05;
        const moveY = (y - centerY) * -0.05;

        requestAnimationFrame(() => {
          el.style.setProperty("--x", `${x}px`);
          el.style.setProperty("--y", `${y}px`);
          el.style.setProperty("--mx", `${moveX}px`);
          el.style.setProperty("--my", `${moveY}px`);
        });
      }}
    >
      {/* 3D Abstract Asset */}
      {arch.image && (
        <div
          className="absolute -right-10 -bottom-10 w-full h-full md:w-[120%] md:h-[120%] z-0 opacity-[0.15] group-hover:opacity-[0.35] transition-opacity duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none mix-blend-screen"
          style={{
            transform: "translate(calc(var(--mx, 0) * 0.8), calc(var(--my, 0) * 0.8)) scale(1.05)",
            maskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)"
          }}
        >
          <Image
            src={arch.image}
            alt={arch.title}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-[2000ms] ease-out will-change-transform"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-0 transition-opacity duration-700 group-hover:opacity-100 mix-blend-overlay"
        style={{ background: `radial-gradient(600px circle at var(--x) var(--y), rgba(212,175,55,0.07), transparent 50%)` }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-2 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 ring-1 ring-inset ring-gold/50"
        style={{
          maskImage: `radial-gradient(350px circle at var(--x) var(--y), black, transparent 55%)`,
          WebkitMaskImage: `radial-gradient(350px circle at var(--x) var(--y), black, transparent 55%)`,
        }}
      />
      <div 
        className="absolute -bottom-8 -right-4 text-[10rem] lg:text-[13rem] font-black leading-none text-white/2 transition-[transform,color] duration-300 ease-out select-none pointer-events-none z-3 group-hover:text-gold/4"
        style={{ transform: "translate(var(--mx, 0), var(--my, 0))" }}
      >
        0{index + 1}
      </div>
      <motion.div layout className="relative z-10 flex flex-col h-full justify-between">
        <motion.div layout className="flex items-center justify-between mb-auto">
          <span className="text-gold/80 font-mono text-sm tracking-[0.4em] font-medium">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-12 h-px bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-turquoise origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </div>
        </motion.div>
        <motion.div layout className="mt-8 pt-4 border-t border-white/5 group-hover:border-gold/15 transition-colors duration-700">
          <h3 className={`font-black text-white/80 group-hover:text-white transition-colors duration-500 leading-[0.9] mb-3 tracking-tighter uppercase ${index === 0 ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"}`}>
            {arch.title}
          </h3>
          <p className="text-white/80 text-base font-light leading-relaxed group-hover:text-white/80 transition-colors duration-700 max-w-[20ch] sm:max-w-none">
            {arch.desc}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ArchetypeBentoGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isAnyHovered = hoveredIndex !== null;

  return (
    <div className="flex flex-col gap-4 mt-12 w-full group/bento">
      <div className="flex flex-col md:flex-row gap-4 w-full h-auto md:h-[380px] lg:h-[440px]">
        {PARTNERSHIP_ARCHETYPES.slice(0, 2).map((arch, localIndex) => {
          const i = localIndex;
          const isHovered = hoveredIndex === i;
          const defaultFlex = i === 0 ? 1.4 : 1;
          const flexValue = isHovered ? defaultFlex * 1.5 : (isAnyHovered ? defaultFlex * 0.8 : defaultFlex);
          return <ArchetypeCard key={i} arch={arch} index={i} flexValue={flexValue} onHover={() => setHoveredIndex(i)} onLeave={() => setHoveredIndex(null)} />;
        })}
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full h-auto md:h-[320px] lg:h-[360px]">
        {PARTNERSHIP_ARCHETYPES.slice(2, 5).map((arch, localIndex) => {
          const i = localIndex + 2;
          const isHovered = hoveredIndex === i;
          const flexValue = isHovered ? 1.5 : (isAnyHovered ? 0.8 : 1);
          return <ArchetypeCard key={i} arch={arch} index={i} flexValue={flexValue} onHover={() => setHoveredIndex(i)} onLeave={() => setHoveredIndex(null)} />;
        })}
      </div>
    </div>
  );
}

function ScrambleText({ text, isActive }: { text: string; isActive: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\\\/[]{}—=+*^?#";
  
  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((old) =>
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
    return () => clearInterval(interval);
  }, [text, isActive]);

  return <>{displayText}</>;
}

function VerticalSpineStep({
  step,
  i,
  total,
  scrollYProgress,
}: {
  step: any;
  i: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isEven = i % 2 === 0;
  const progressStart = i / total;

  const opacity = useTransform(
    scrollYProgress,
    [progressStart, progressStart + 0.15],
    [0.15, 1],
  );
  const yOffset = useTransform(
    scrollYProgress,
    [progressStart, progressStart + 0.15],
    [80, 0],
  );
  const nodeColor = useTransform(
    scrollYProgress,
    [progressStart, progressStart + 0.05],
    ["rgba(255,255,255,0.05)", "rgba(18,168,172,1)"],
  );

  return (
    <motion.div
      style={{ opacity, y: yOffset }}
      className="relative w-full flex flex-col lg:flex-row items-center mb-32 lg:mb-52 last:mb-0 group"
    >
      <motion.div
        className="absolute left-8 lg:left-1/2 w-8 h-8 rounded-full border-2 bg-[#050505] -translate-x-1/2 z-20 transition-transform duration-700 group-hover:scale-[1.8] flex items-center justify-center"
        style={{ borderColor: nodeColor }}
      >
        <div className="w-2 h-2 rounded-full bg-turquoise opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_rgba(18,168,172,0.8)]" />
      </motion.div>

      <div
        className={`w-full lg:w-1/2 flex pl-24 lg:pl-0 ${isEven ? "lg:justify-end lg:pr-24" : "lg:order-2 lg:justify-start lg:pl-24"}`}
      >
        <div className="relative">
          <span className="absolute -top-10 lg:-top-24 -left-6 lg:-left-12 text-[7rem] lg:text-[14rem] font-black text-white/[0.015] select-none pointer-events-none group-hover:text-white/[0.04] transition-colors duration-1000 -z-10">
            0{i + 1}
          </span>
          <h3 className="text-3xl lg:text-5xl font-black text-white relative z-10 group-hover:text-gold transition-colors duration-500 tracking-tighter">
            {step.title}
          </h3>
        </div>
      </div>

      <div
        className={`w-full lg:w-1/2 flex pl-24 lg:pl-0 mt-8 lg:mt-0 ${isEven ? "lg:order-2 lg:justify-start lg:pl-24" : "lg:justify-end lg:pr-24"}`}
      >
        <div className="bg-white/[0.01] border border-white/5 p-8 lg:p-10 rounded-3xl backdrop-blur-md w-full max-w-lg group-hover:bg-white/[0.03] group-hover:border-turquoise/30 transition-all duration-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-turquoise/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <p className="text-white/60 text-base lg:text-lg font-light leading-relaxed">
            {step.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function VerticalSpineTimeline({ steps }: { steps: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const laserHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto py-20 lg:py-40 overflow-hidden">
      <div className="absolute top-0 bottom-0 left-8 lg:left-1/2 w-[1px] bg-white/5 -translate-x-1/2 z-0" />
      <motion.div
        style={{ height: laserHeight }}
        className="absolute top-0 left-8 lg:left-1/2 w-[2px] bg-gradient-to-b from-turquoise to-petrol shadow-[0_0_30px_6px_rgba(18,168,172,0.7)] z-10 -translate-x-1/2"
      />

      {steps.map((step, i) => (
        <VerticalSpineStep
          key={i}
          step={step}
          i={i}
          total={steps.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function EquilibriumSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={containerRef} className="px-gutter py-[20vh] bg-[#020202] relative z-10 border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-turquoise/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 relative">
          
          {/* Central Divider & Core (Desktop Only) */}
          <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-center w-24 z-20 pointer-events-none">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <motion.div 
              style={{ y: yTransform }}
              className="absolute w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0a] flex items-center justify-center shadow-[0_0_30px_rgba(18,168,172,0.2)] backdrop-blur-md"
            >
              <div className="w-3 h-3 bg-turquoise rounded-full shadow-[0_0_15px_rgba(18,168,172,1)]" />
            </motion.div>
          </div>

          {/* Left Column: What Partners Get */}
          <div className="lg:w-1/2 lg:pr-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full flex flex-col justify-between p-10 lg:p-14 bg-[#06080a]/80 border border-white/5 rounded-3xl backdrop-blur-2xl hover:border-turquoise/30 transition-colors duration-700 relative overflow-hidden group"
            >
              {/* Turquoise Corner Glow */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-turquoise/10 blur-[80px] rounded-full group-hover:bg-turquoise/20 transition-colors duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-8 h-px bg-turquoise" />
                  <h3 className="text-sm uppercase tracking-[0.3em] text-turquoise/90 font-bold">
                    What Partners Get
                  </h3>
                </div>
                
                <h4 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12 leading-[1.1] text-white">
                  A premium ecosystem.<br />
                  <span className="text-white/40 font-light">Clean projects.</span>
                </h4>
                
                <ul className="flex flex-col gap-6 mb-16">
                  {PARTNER_BENEFITS.map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex gap-5 items-start text-white/70 text-lg lg:text-xl font-light"
                    >
                      <span className="mt-3 w-1.5 h-1.5 bg-turquoise shadow-[0_0_10px_rgba(18,168,172,0.8)] rounded-full shrink-0" />
                      <span className="leading-relaxed">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="relative z-10 border-l-2 border-turquoise pl-8 mt-auto group-hover:translate-x-2 transition-transform duration-500">
                <p className="text-xl font-medium tracking-tight text-white/90 leading-tight">
                  We keep the frame stable.<br />
                  <span className="text-white/60 font-light">You deliver excellence.</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: What We Expect */}
          <div className="lg:w-1/2 lg:pl-24 mt-10 lg:mt-32">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full flex flex-col justify-between p-10 lg:p-14 bg-[#0a0806]/80 border border-white/5 rounded-3xl backdrop-blur-2xl hover:border-gold/30 transition-colors duration-700 relative overflow-hidden group"
            >
              {/* Gold Corner Glow */}
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gold/10 blur-[80px] rounded-full group-hover:bg-gold/15 transition-colors duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-8 h-px bg-gold" />
                  <h3 className="text-sm uppercase tracking-[0.3em] text-gold/90 font-bold">
                    What We Expect
                  </h3>
                </div>
                
                <h4 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12 leading-[1.1] text-white">
                  Professionalism that<br />
                  <span className="text-white/40 font-light">doesn&apos;t require supervision.</span>
                </h4>
                
                <ul className="flex flex-col gap-6">
                  {PARTNER_EXPECTATIONS.map((expectation, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex gap-5 items-start text-white/70 text-lg lg:text-xl font-light"
                    >
                      <span className="mt-3 w-1.5 h-1.5 bg-gold/80 shadow-[0_0_10px_rgba(212,175,55,0.4)] rounded-full shrink-0" />
                      <span className="leading-relaxed">{expectation}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function PartnershipsClient() {
  const t = useTranslations("partnerships.hero");
  const tCtas = useTranslations("partnerships.ctas");
  const tNav = useTranslations("nav");
  const pageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const accordionWrapperRef = useRef<HTMLDivElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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
    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // 1. Hero Entrance
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

        // MOVE 1 — Kinetic letter choreography on the headline. Each
        // character of "PARTNERSHIPS" + "AT GOTT WALD" arrives scattered
        // (offset / rotated / faded) and animates into its aligned
        // position with elastic ease. Brand metaphor literalized:
        // chaotic possibilities → aligned partnerships. Deterministic
        // pseudo-random offsets keep SSR/hydration stable.
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

        // Setup Scroll Indicator Loop
        gsap.fromTo(
          gsap.utils.toArray(".scroll-indicator-line", pageRef.current!),
          { yPercent: -100 },
          { yPercent: 400, duration: 2, repeat: -1, ease: "none" },
        );

        // Complete Hero section container fade/scale
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

      // 2. Reveal Up animations — Grouped Batching for High Performance
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
            }
          );
        },
        once: true,
      });

      // Scroll-Fill Text Animation
      gsap.utils.toArray('.scroll-fill-text').forEach((el: any) => {
        gsap.to(el, {
          backgroundPosition: "0% 0",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 40%",
            scrub: true,
          }
        });
      });

      // 3. Standards Horizontal Scroll
      const scrollWrapper = gsap.utils.toArray(
        ".standards-scroll-wrapper",
        pageRef.current!,
      )[0] as HTMLElement;
      if (scrollWrapper && window.innerWidth >= 768) {
        const xOffset = -(scrollWrapper.scrollWidth - window.innerWidth);

        gsap.to(scrollWrapper, {
          x: xOffset,
          force3D: true,
          ease: "none",
          scrollTrigger: {
            trigger: "#standards-section",
            start: "top top",
            end: () => `+=${scrollWrapper.scrollWidth - window.innerWidth}`,
            scrub: 1.2, // Smoother scrub value for Awwwards-level fluidity
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // 4. Manifesto Lines — staggered cascade with counter fade
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

      // 5. Archetype Cards — staggered grid entrance
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

      // 6. Partner Benefits/Expectations — list item cascade
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

      // 7. Accordion sections — sequential slide-in
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

      // 8. Selection Process Steps — cascade with scale
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

      // 9. Application Form — cinematic entrance (scoped to pageRef)
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
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // MOVE 2 (handler) — cursor-follow glow with GSAP quickTo. The glow
  // fades in on mouse-enter, follows with smooth lag while moving, and
  // fades out / breathes via CSS keyframes when idle. Touch / no-hover
  // devices skip the glow entirely (cursor-following ambient on touch
  // is meaningless and degrades perf).
  useEffect(() => {
    const section = heroSectionRef.current;
    const glow = heroGlowRef.current;
    if (!section || !glow) return;

    if (typeof window === "undefined") return;
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!canHover) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 0.55, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 0.55, ease: "power3.out" });

    let idleTimer: number | null = null;

    const setIdle = (idle: boolean) => {
      if (idle) {
        glow.classList.add("hero-cursor-glow--idle");
      } else {
        glow.classList.remove("hero-cursor-glow--idle");
      }
    };

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      quickX(x);
      quickY(y);
      gsap.to(glow, { opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
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

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // Calculate a slight offset for fixed header
          const yOffset = -100;
          const y =
            element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 600); // Wait for GSAP and layout
    };

    // Run on initial load
    handleHashScroll();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div
      ref={pageRef}
      className="bg-transparent min-h-screen text-white font-sans overflow-x-hidden selection:bg-turquoise selection:text-black"
    >
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full z-50 px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        <section
          ref={heroSectionRef}
          className="min-h-screen w-full flex flex-col justify-end relative bg-transparent overflow-hidden pt-32 lg:pt-40"
        >
          <div
            className="absolute inset-0 pointer-events-none z-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div className="absolute top-0 left-0 w-full h-px bg-white/5 z-2" />

          {/* MOVE 2 — Cursor-following atmospheric glow. A soft turquoise
              radial halo follows the cursor across the hero with GSAP
              quickTo for buttery-smooth lag. When the cursor is idle the
              halo gently breathes (CSS animation subscribing to the
              LivingEnvironment's --orchestration-pace). Centered at the
              cursor position via translate(-50%, -50%); soft blur sells
              the depth; mix-blend-mode screen makes it read through the
              liquid background without flattening it. */}
          <div
            ref={heroGlowRef}
            aria-hidden="true"
            className="hero-cursor-glow pointer-events-none absolute z-2 will-change-transform opacity-0"
            style={{
              left: 0,
              top: 0,
              width: "min(70vw, 900px)",
              height: "min(70vw, 900px)",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle at center, rgba(18,168,172,0.18) 0%, rgba(18,168,172,0.08) 35%, transparent 65%)",
              filter: "blur(60px)",
              mixBlendMode: "screen",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Ghost echo — massive italic "partners." floats behind the
              headline as the section's atmospheric anchor. Editorial
              wallpaper-magazine signature, not a dashboard backdrop. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[14%] -left-[5vw] z-2 select-none hidden lg:block"
          >
            <span
              className="block italic font-light text-white/[0.025] leading-[0.78] tracking-[-0.06em] whitespace-nowrap"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(12rem, 24vw, 30rem)",
              }}
            >
              partners.
            </span>
          </div>

          {/* Brand signal-language anchor — subtle frequency wave at the
              bottom of the hero subscribes to LivingEnvironment's
              --orchestration-pace + --rand-phase-signal so it drifts in
              step with the site's scroll-velocity-driven breath. Connects
              this hero to the brand's frequency/signal vocabulary
              (PILLARS imagery, TuningInstrument HUD, Strategic Inquiry
              wave) without becoming dashboard decoration. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] lg:h-[24vh] z-2 overflow-hidden"
          >
            <div
              className="strategic-signal-drift absolute bottom-0 left-0 w-[200%] h-full will-change-transform"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
              }}
            >
              <svg
                viewBox="0 0 1600 200"
                preserveAspectRatio="none"
                className="block w-full h-full"
                aria-hidden="true"
              >
                <path
                  d="M0,100 Q100,40 200,100 T400,100 T600,100 T800,100 T1000,100 T1200,100 T1400,100 T1600,100"
                  fill="none"
                  stroke="rgba(18, 168, 172, 0.18)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0,130 Q100,90 200,130 T400,130 T600,130 T800,130 T1000,130 T1200,130 T1400,130 T1600,130"
                  fill="none"
                  stroke="rgba(18, 168, 172, 0.09)"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>

          {/* ALIGNED-PAIR — atmospheric centerpiece. Two cyan wireframe
              profiles flank the entire hero composition; the frequency
              wave between their eyes runs across the page BEHIND the
              headline at roughly its baseline. Headline, tagline, and
              stats live INSIDE the image's frequency field, not next
              to it. Heavy vignette mask removes all rectangular boundary;
              low opacity (~32%) lets content read on top. The image is
              the brand's concept made atmosphere — partnership as the
              ground, not the decoration. */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[52%] w-[68vw] max-w-[1180px] aspect-square z-[2] pointer-events-none"
            style={{
              opacity: 0.32,
              maskImage:
                "radial-gradient(ellipse 75% 60% at center, #000 30%, rgba(0,0,0,0.45) 60%, transparent 88%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 60% at center, #000 30%, rgba(0,0,0,0.45) 60%, transparent 88%)",
              mixBlendMode: "screen",
            }}
          >
            <Image
              src="/partnerships/partnerships-hero-aligned-pair.png"
              alt=""
              fill
              sizes="(min-width: 1280px) 1180px, 68vw"
              className="object-contain"
              unoptimized
              priority={false}
            />
          </div>

          <div
            ref={heroTextRef}
            className="relative w-full px-gutter pb-32 md:pb-40 lg:pb-48 xl:pb-56 will-change-transform z-5 mt-auto"
          >
            {/* Single optical axis — headline carries the moment, all
                supporting content flows below in a narrow editorial
                column. The previous two-column spread (massive headline
                left, boxed HUD metric strip right with stats grid + two
                stacked rectangular CTAs) was the strongest AI-template
                tell on the entire site; stripped wholesale.
                Variable gap rhythm replaces uniform spacing: large gap
                after headline (breathing room), medium after tagline,
                small between CTA row and the colophon strip. */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-12 lg:gap-16 xl:gap-24 items-end">
              {/* LEFT — power-statement (eyebrow + headline + tagline +
                  trust line). Restores the OLD two-column composition
                  the user asked to keep; AI-template signals stripped
                  per-element rather than wholesale. */}
              <div className="hero-reveal w-full max-w-[850px]">
                {/* Eyebrow — 02/ Partnerships. Restored. Thinner
                    typographic weight + Playfair italic for the label
                    reads as editorial chapter marker, not AI luxury
                    template (no bold uppercase, no symmetric bracket). */}
                {/* <div className="flex items-center gap-3 mb-8 lg:mb-10">
                  <span className="text-gold text-xs lg:text-sm tracking-[0.4em] uppercase font-light">
                    02 /
                  </span>
                  <span className="w-12 h-px bg-white/20" />
                  <span
                    className="text-xs lg:text-sm tracking-[0.35em] text-white/65 uppercase font-light"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Partnerships
                  </span>
                </div> */}

              {/* Hero text owned by next-intl. translate="no" keeps GT
                  out so the parallax + scroll-trigger animations don't
                  fight <font> wrapping during language change.
                  Editorial spread: "PARTNERSHIPS" massive sans uppercase
                  on line 1, "at Gott Wald" Playfair italic gold accent
                  on line 2 (Playfair italic carries the brand's
                  signature accent voice). */}
              <h1
                translate="no"
                className="notranslate flex flex-col max-w-full"
              >
                <span className="parallax-fast block whitespace-nowrap text-[clamp(2.2rem,7.4vw,7rem)] leading-[0.88] font-black tracking-[-0.045em] uppercase text-white">
                  {Array.from(t("line1")).map((ch, idx) => (
                    <span
                      key={`l1-${idx}`}
                      className="kinetic-char inline-block will-change-transform"
                      aria-hidden={ch === " " ? "true" : undefined}
                    >
                      {ch === " " ? " " : ch}
                    </span>
                  ))}
                </span>
                <span
                  className="parallax-slow block whitespace-nowrap text-[clamp(1.8rem,5.6vw,5.4rem)] leading-[0.92] tracking-[-0.035em] text-gold pt-1 lg:pt-2 normal-case"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {Array.from(t("line2")).map((ch, idx) => (
                    <span
                      key={`l2-${idx}`}
                      className="kinetic-char inline-block will-change-transform"
                      aria-hidden={ch === " " ? "true" : undefined}
                    >
                      {ch === " " ? " " : ch}
                    </span>
                  ))}
                </span>
              </h1>

              {/* Tagline — editorial Playfair italic, sentence case. */}
              <p
                className="hero-reveal mt-10 lg:mt-12 text-[clamp(1.2rem,1.8vw,1.8rem)] font-light leading-[1.35] text-white/85 max-w-[42ch]"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                }}
              >
                We don&apos;t buy vendors. We select{" "}
                <span className="text-turquoise">partners.</span>
              </p>

              {/* Trust line — sentence-case Playfair italic colophon
                  closes the LEFT column. The previous tracked-caps
                  treatment was AI luxury template; this is editorial. */}
              <p
                className="hero-reveal mt-10 lg:mt-12 text-[clamp(0.9rem,1.05vw,1.1rem)] text-white/55 italic font-light"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Confidential by default. NDA-ready on request.
              </p>
            </div>

            {/* RIGHT — converging frequency waves image (visual anchor)
                + open editorial stats column + dual CTAs. The bespoke
                "two waves merging into one" image literalizes the
                partnership / alignment metaphor — two distinct
                frequencies resonating into a shared signal. Replaces
                the old dashboard panel as the right column's visual
                weight. Brand-aesthetic family-matched with the 5 Pillar
                images (turquoise scan-line + particle dust) but a
                completely different subject so it doesn't echo Pillar
                05's single profile. */}

            <div className="hero-reveal hidden lg:flex flex-col self-end gap-8 lg:gap-10">

              {/* Section label — single italic Playfair line, sits
                  beneath the image as a caption to the visual moment. */}
              <p
                className="text-[clamp(0.95rem,1.1vw,1.15rem)] text-gold/85 italic font-light tracking-[-0.012em]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Our reach.
              </p>

              {/* Stats — editorial 2-column grid. Label column is
                  auto-sized so the wider labels ("Partner Origins" /
                  "Network Size") set the column width; numeral column
                  is auto-sized too. Small fixed gap keeps the pairs
                  tight together (no justify-between extreme spread).
                  Reads as publication index, not metric badges. */}
              <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-4 lg:gap-y-5 items-baseline">
                {[
                  { label: "Countries", value: "26" },
                  { label: "Partner Origins", value: "71" },
                  { label: "Network Size", value: "888+" },
                  { label: "Languages", value: "17" },
                ].flatMap(({ label, value }) => [
                  <span
                    key={`label-${label}`}
                    className="text-[10px] lg:text-[11px] tracking-[0.3em] uppercase text-white/55 font-light"
                  >
                    {label}
                  </span>,
                  <span
                    key={`value-${label}`}
                    className="text-[clamp(1.8rem,2.4vw,2.4rem)] font-light text-white tabular-nums leading-[1] tracking-[-0.025em] text-right"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {value}
                  </span>,
                ])}
              </div>

              {/* Editorial CTAs — text-as-affordance, NOT rectangular
                  outlined pills. Apply (primary, gold accent) + Intro
                  call (secondary, italic). Magnetic preserved via
                  data-magnetic attribute. */}
              <div className="flex flex-col gap-5 mt-2">
                <a
                  href="#apply"
                  data-magnetic
                  translate="no"
                  className="notranslate group inline-flex items-baseline gap-4 text-white hover:text-gold transition-colors duration-500 self-start"
                >
                  <span className="font-light tracking-[-0.018em] leading-[1] text-[clamp(1.1rem,1.4vw,1.45rem)]">
                    {tCtas("applyForPartnership")}
                  </span>
                  <span className="inline-block w-10 h-px bg-current opacity-60 translate-y-[-0.3em] group-hover:w-20 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="text-current translate-y-[-0.05em] text-[clamp(1rem,1.2vw,1.25rem)] leading-[1] group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </a>
                <a
                  href="#apply"
                  data-magnetic
                  translate="no"
                  className="notranslate group inline-flex items-baseline gap-3 text-white/60 hover:text-white transition-colors duration-500 self-start"
                >
                  <span
                    className="font-light italic tracking-[-0.012em] text-[clamp(0.95rem,1.1vw,1.15rem)]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {tCtas("requestIntroCall")}
                  </span>
                  <span className="text-current text-sm group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* SECTION 2 — Standard, not marketplace. Centered monumental
            composition: declaration carved like an inscription. Atmospheric
            turquoise glow blooms behind the type (depth, breath). Italic
            Playfair question → bold sans monumental answer (brand voice
            change carries the rhetorical pivot). 5-frequency hairline
            below ties this beat to the hero's orchestra. */}
        <section
          data-journey="proof"
          className="px-gutter py-[26vh] lg:py-[32vh] bg-[#0c0e14] relative z-10 border-t border-white/5 overflow-hidden"
        >
          {/* Atmospheric glow — turquoise breath behind the statement.
              Manifesto-coded "frequency space" rendered as ambient depth
              so the section isn't flat type-on-black. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vw] max-w-[1000px] aspect-square"
            style={{
              background:
                "radial-gradient(circle at center, rgba(18,168,172,0.10) 0%, rgba(18,168,172,0.04) 35%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative max-w-[88rem] mx-auto text-center reveal-up">
            <p
              className="text-[clamp(1.7rem,3.8vw,4.4rem)] font-light leading-[1.18] tracking-[-0.018em] text-white/72 mb-8 lg:mb-12"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              GOTT WALD is not a marketplace.
            </p>

            <p 
              className="scroll-fill-text text-[clamp(2.8rem,8vw,11rem)] font-black leading-[0.92] tracking-[-0.045em] uppercase text-transparent"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
                backgroundImage: "linear-gradient(90deg, #fff 50%, transparent 50%)",
                backgroundSize: "200% 100%",
                backgroundPosition: "100% 0",
                WebkitBackgroundClip: "text",
              }}
            >
              GOTT WALD is a standard.
            </p>

            {/* 5-frequency hairline — gold→silver→petrol→turquoise→copper,
                same gradient as the hero accent line. Section's
                signature line to the brand orchestra. */}
            <span
              aria-hidden="true"
              className="block mx-auto h-px w-24 mt-16 lg:mt-20"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0.55) 0%, rgba(184,192,204,0.42) 28%, rgba(0,109,132,0.55) 52%, rgba(18,168,172,0.70) 76%, rgba(192,120,64,0.45) 100%)",
              }}
            />

            <p
              className="mt-10 lg:mt-14 text-[clamp(1.05rem,1.35vw,1.5rem)] font-light leading-[1.65] text-white/65 max-w-[44ch] mx-auto"
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              We only work with companies that have principle — and can
              deliver. When both are true, partnership becomes inevitable.
            </p>
          </div>
        </section>

        {/* ── SECTION 3: 7-LINE MANIFESTO ── */}
        <section
          id="manifesto"
          className="px-gutter py-[18vh] bg-transparent relative z-10 border-t border-white/5"
        >
          <div className="max-w-6xl mx-auto">
            <div className="reveal-up mb-20">
              <p className="text-sm tracking-[0.45em] uppercase text-gold/90 font-bold mb-4">
                Our Foundation
              </p>
              <h2 className="text-[clamp(3rem,6vw,7rem)] font-black tracking-tighter leading-[0.85] uppercase text-white">
                A 7-LINE
                <br />
                <span className="text-white/60">MANIFESTO</span>
              </h2>
            </div>
            <div className="flex flex-col border-t border-white/10 group/manifesto">
              {MANIFESTO_LINES.map((line, i) => (
                <div
                  key={i}
                  className="manifesto-line group/line relative flex items-center gap-8 py-8 border-b border-white/5 hover:bg-white/[0.02] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] px-4 -mx-4 group-hover/manifesto:opacity-20 group-hover/manifesto:blur-sm hover:!opacity-100 hover:!blur-none"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-turquoise opacity-0 group-hover/line:opacity-100 transition-opacity duration-700 shadow-[0_0_20px_rgba(18,168,172,0.8)]" />
                  <span className="text-gold font-mono text-sm shrink-0 w-8 text-right opacity-90 transition-all duration-700 group-hover/line:opacity-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/80 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] leading-tight group-hover/line:text-white group-hover/line:translate-x-6 group-hover/line:scale-[1.02] origin-left">
                    {i === 5 ? (
                      <>
                        We build for{" "}
                        <span className="font-black text-gold group-hover/line:drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all duration-700">
                          NATURE — ANIMALS — HUMANS
                        </span>
                        .
                      </>
                    ) : (
                      line
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: PARTNERSHIP PRINCIPLE ── */}
        <section className="px-gutter py-[18vh] bg-[#020202] relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto space-y-24">
            {/* TOP: The Principle Statement */}
            <div className="reveal-up space-y-10">
              <div>
                <p className="text-sm tracking-[0.45em] uppercase text-gold/90 font-bold mb-6">
                  The Principle
                </p>
                <h2 className="text-[clamp(3rem,5vw,5.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white">
                  PARTNERSHIP IS
                  <br />
                  ALIGNMENT
                </h2>
                <div className="w-16 h-1 bg-white mt-8 mb-6" />
                <h2 className="text-[clamp(3rem,5vw,5.5rem)] font-black tracking-tighter leading-[0.85] uppercase text-white/70">
                  NOT
                  <br />
                  PROCUREMENT.
                </h2>
              </div>
              <p className="text-2xl text-white leading-relaxed font-light max-w-2xl">
                We don&apos;t &quot;source services.&quot; We select partners
                who can carry our foundation and protect our standard.
              </p>
            </div>

            {/* BOTTOM: Partner Qualities */}
            <div className="reveal-up">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-10 font-semibold">
                We work with partners who:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 group/shards relative z-10 pt-10 pb-20">
                {PARTNERSHIP_PRINCIPLES.map((principle, i) => (
                  <ParallaxShard key={i} principle={principle} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: WHO WE'RE LOOKING FOR ── */}
        <section className="px-gutter py-[18vh] bg-transparent relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="reveal-up mb-20">
              <p className="text-sm tracking-[0.45em] uppercase text-gold/90 font-bold mb-6">
                Who We&apos;re Looking For
              </p>
              <h2 className="text-[clamp(2.5rem,5vw,6rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-6">
                OUTSTANDING COMPANIES —<br />
                <span className="font-mono text-turquoise/75 uppercase tracking-[0.12em] text-[clamp(1rem,1.8vw,2rem)]">
                  proven in action, not in slides.
                </span>
              </h2>
              <p className="text-xl text-white/80 font-light max-w-2xl">
                We select five partnership archetypes.
              </p>
            </div>

            <ArchetypeBentoGrid />
          </div>
        </section>

        {/* ── SECTION 6: NON-NEGOTIABLES (HORIZONTAL SCROLL) ── */}
        <section
          id="standards-section"
          className="bg-black relative z-10 isolate"
        >
          <div className="standards-pin-container h-screen flex flex-col overflow-hidden">
            {/* Section Title Row */}
            <div className="flex-none flex justify-between items-center px-gutter pt-20 pb-6 reveal-up shrink-0">
              <div>
                <p className="text-xs tracking-[0.5em] uppercase text-gold font-bold mb-3">Non-Negotiables</p>
                <h2 className="text-[clamp(2rem,max(3.5vw,4.5vh),5.5rem)] font-black tracking-tighter leading-[0.82] uppercase text-white">
                  OUR
                  <br />
                  <span className="text-white/70">PARTNERSHIP</span>
                  <br />
                  STANDARD
                </h2>
              </div>
              <div className="hidden lg:flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-px bg-white/20" />
                  <span className="w-2 h-2 rounded-full bg-turquoise animate-pulse" />
                </div>
                <p className="text-[10px] tracking-[0.45em] text-white/70 uppercase font-semibold text-right">
                  Scroll horizontally
                  <br />
                  to explore
                </p>
              </div>
            </div>

            {/* Scroll Wrapper — Flex-1 to fill remaining screen height entirely */}
            <div className="standards-scroll-wrapper flex-1 min-h-0 flex flex-row items-stretch w-max will-change-transform">
              {NON_NEGOTIABLES.map((item, i) => (
                <div
                  key={i}
                  className="relative group flex flex-col w-[88vw] md:w-[52vw] lg:w-[38vw] xl:w-[34vw] h-full overflow-hidden cursor-pointer shrink-0 border-r border-white/10"
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    requestAnimationFrame(() => {
                      el.style.setProperty("--mx", `${x}px`);
                      el.style.setProperty("--my", `${y}px`);
                    });
                  }}
                >
                  {/* FULL-BLEED Image — always very visible */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 88vw, (max-width: 1200px) 50vw, 35vw"
                      quality={75}
                      loading="lazy"
                      className="object-cover scale-[1.08] group-hover:scale-100 transition-transform duration-2500 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform"
                    />
                  </div>

                  {/* Multi-layer dramatic gradient overlay to ensure text readability */}
                  <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
                  
                  {/* Cinematic vignette */}
                  <div className="absolute inset-0 z-1 opacity-20"
                    style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)' }}
                  />

                  {/* Mouse-follow Gold Spotlight */}
                  <div
                    className="absolute inset-0 z-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(10,147,150,0.12), transparent 60%)`,
                    }}
                  />

                  {/* Content — Positioned relative inside the h-full flex container */}
                  <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-10 border-t-2 border-white/5 group-hover:border-[var(--color-turquoise)]/60 group-hover:-translate-y-[2px] transition-all duration-700 group-hover:shadow-[0_-4px_30px_rgba(10,147,150,0.3),_inset_0_4px_20px_rgba(10,147,150,0.1)]">

                    {/* TOP: Counter + minimal HUD */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-turquoise group-hover:scale-150 transition-transform duration-500" />
                        <span className="font-mono text-gold text-sm tracking-[0.5em] font-bold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Corner bracket decoration */}
                      <div className="w-6 h-6 border-t border-r border-white/20 group-hover:border-gold/60 transition-colors duration-700" />
                    </div>

                    {/* BOTTOM: Title Block */}
                    <div className="flex flex-col gap-3 mt-auto pb-6">
                      {/* Gold accent line — expands on hover */}
                      <div className="w-10 h-0.5 bg-turquoise/60 group-hover:w-20 group-hover:bg-turquoise transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] mb-1" />
                      
                      <h3 className="text-[clamp(1.4rem,2.6vw,2.8rem)] font-black tracking-tighter leading-[0.9] text-white uppercase drop-shadow-2xl break-words hyphens-auto">
                        {item.title}
                      </h3>
                      
                      {/* Description — always visible, high contrast */}
                      <div className="overflow-hidden mb-2">
                        <p className="text-sm lg:text-base text-white/75 font-light leading-relaxed group-hover:text-white/95 transition-colors duration-700 max-w-sm drop-shadow-md">
                          {item.desc}
                        </p>
                      </div>

                      {/* Bottom meta row */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/15 group-hover:border-gold/30 transition-colors duration-700">
                        <span className="text-[9px] tracking-[0.45em] uppercase text-white/70 font-medium">
                          GOTT WALD Standard
                        </span>
                        <span className="text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-sm">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Giant Watermark Number — behind image overlays */}
                  <div className="absolute top-[18%] -right-4 text-[10rem] lg:text-[14rem] font-black leading-none text-white/3 group-hover:text-gold/6 group-hover:-translate-y-3 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] select-none pointer-events-none z-[-1]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}

              {/* CTA End Card */}
              <div className="relative flex flex-col items-center justify-center w-[60vw] md:w-[35vw] lg:w-[22vw] h-full shrink-0 bg-[#0a0a0a] border-t border-white/5 px-10 border-l border-white/10">
                <div className="w-px h-16 bg-linear-to-b from-transparent via-gold to-transparent mb-6" />
                <p className="text-center text-xs tracking-[0.4em] uppercase text-white/70 font-bold mb-3">
                  All of These
                </p>
                <p className="text-center text-xl lg:text-2xl font-black uppercase text-white leading-tight mb-8">
                  Are Non-<br />Negotiable
                </p>
                <a
                  href="#apply"
                  translate="no"
                  className="notranslate inline-flex items-center gap-3 px-6 py-3 rounded-md border border-turquoise/45 bg-[#061018] text-turquoise text-xs tracking-[0.18em] uppercase font-bold hover:bg-turquoise hover:text-[#03080c] transition-all duration-300"
                >
                  {tCtas("applyNow")}
                </a>
                <div className="w-px h-16 bg-linear-to-b from-transparent via-turquoise/30 to-transparent mt-8" />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: WHAT PARTNERS GET + WHAT WE EXPECT ── */}
        <EquilibriumSection />

        {/* ── SECTION 8: DOMAINS ACCORDION ── */}
        <section className="px-gutter py-[20vh] bg-[#000] relative z-10 border-t border-white/5 overflow-hidden">
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} 
          />

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10">
            {/* Left Side: Sticky Data Core */}
            <div className="lg:w-2/5 reveal-up relative">
              <div className="sticky top-[15vh]">
                <p className="text-sm tracking-[0.4em] uppercase text-gold/80 font-bold mb-6">
                  Core Architecture
                </p>
                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9] text-white">
                  PARTNERSHIP
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-white/50">DOMAINS</span>
                </h2>
                <p className="text-white/60 text-xl leading-relaxed font-light mb-12 max-w-sm">
                  Full transparency across all our operating pillars. We integrate
                  partners natively into our architecture.
                </p>

                {/* Massive Interactive Indicator */}
                <div className="hidden lg:flex relative w-64 h-64 border border-white/10 rounded-full items-center justify-center bg-[#050505]">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-turquoise/30"
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAccordion || "none"}
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                      transition={{ duration: 0.5, ease: "backOut" }}
                      className="text-[8rem] font-mono font-black text-white/5 tracking-tighter drop-shadow-[0_0_30px_rgba(18,168,172,0.4)]"
                    >
                      {activeAccordion ? activeAccordion : "X"}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Side: Accordion List */}
            <div
              className="lg:w-3/5 flex flex-col"
              ref={accordionWrapperRef}
            >
              {PARTNERSHIP_DOMAINS.map((domain) => {
                const isActive = activeAccordion === domain.id;
                const isAnotherActive = activeAccordion && !isActive;

                return (
                  <div
                    key={domain.id}
                    className={`accordion-item border-b border-white/10 group relative transition-opacity duration-700 ${isAnotherActive ? "opacity-30 hover:opacity-100" : "opacity-100"}`}
                  >
                    {/* Hover Laser Line */}
                    <div className="absolute bottom-0 left-0 h-[1px] bg-gold w-0 group-hover:w-full transition-all duration-700 ease-out pointer-events-none" />

                    <button
                      onClick={() => setActiveAccordion(isActive ? null : domain.id)}
                      className="w-full py-10 flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-6 lg:gap-8 relative overflow-hidden group/title">
                        <span
                          className={`text-lg font-mono transition-all duration-500 ${isActive ? "text-turquoise scale-125 drop-shadow-[0_0_15px_rgba(18,168,172,0.6)]" : "text-white/30 group-hover/title:text-gold"}`}
                        >
                          <ScrambleText text={domain.id} isActive={isActive} />
                        </span>
                        <h3
                          className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter transition-transform duration-500 ${isActive ? "translate-x-6 text-white" : "text-white/60 group-hover/title:translate-x-4 group-hover/title:text-white"}`}
                        >
                          <ScrambleText text={domain.title} isActive={isActive} />
                        </h3>
                      </div>
                      <div className={`w-12 h-12 border flex items-center justify-center shrink-0 rounded-full transition-all duration-500 ${isActive ? "border-turquoise bg-turquoise text-black shadow-[0_0_20px_rgba(18,168,172,0.6)] -rotate-180 scale-110" : "border-white/10 text-white/50 group-hover:border-gold/60 group-hover:text-gold"}`}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d={isActive ? "M1 7h12" : "M7 1v12M1 7h12"} />
                        </svg>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden relative"
                        >
                          {/* Cyber-Scanner Line */}
                          <motion.div
                            initial={{ top: 0 }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-[1px] bg-turquoise shadow-[0_0_15px_3px_rgba(18,168,172,0.8)] z-20 pointer-events-none"
                          />
                          
                          <div className="pb-12 pl-14 relative z-10 bg-[#050505]/50 border-l border-white/5 ml-4 mt-4">
                            <ul className="flex flex-col gap-6 pt-6 pr-6">
                              {domain.items.map((item, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -20, opacity: 0 }}
                                  transition={{ delay: 0.1 + (idx * 0.05), duration: 0.5, ease: "easeOut" }}
                                  className="text-lg lg:text-xl text-white/70 flex items-start gap-5"
                                >
                                  <span className="text-turquoise mt-3 leading-none shrink-0 w-2 h-2 rounded-full bg-turquoise shadow-[0_0_10px_rgba(18,168,172,0.8)]" />
                                  <span className="leading-relaxed tracking-wide font-light"><ScrambleText text={item} isActive={isActive} /></span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 9: SELECTION PROCESS ── */}
        <section className="px-gutter py-[18vh] bg-[#020202] relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="reveal-up mb-20">
              <p className="text-sm tracking-[0.45em] uppercase text-gold/80 font-bold mb-6">
                How It Works
              </p>
              <h2 className="text-[clamp(3rem,6vw,7rem)] font-black tracking-tighter leading-[0.85] uppercase text-white mb-6">
                SHORT. CLEAR.
                <br />
                <span className="text-white/60">NO THEATRE.</span>
              </h2>
            </div>

            <VerticalSpineTimeline steps={PARTNERSHIP_SELECTION_STEPS} />
          </div>
        </section>

        {/* ── SECTION 10: APPLICATION FORM ── */}
        <section
          id="apply"
          className="form-section px-gutter py-[20vh] bg-[#050505] relative z-10 border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto">
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
              className="form-reveal flex flex-col gap-12"
              onSubmit={handleFormSubmit}
            >
              <Honeypot />

              {/* Group 1: Company + Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="company"
                    name="company"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="Company Name"
                  />
                  <label
                    htmlFor="company"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Company Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="url"
                    id="website"
                    name="website"
                    className="peer w-full bg-transparent border-b border-white/20  pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="Website URL"
                  />
                  <label
                    htmlFor="website"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Website
                  </label>
                </div>
              </div>

              {/* Group 2: Country + Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="country"
                    name="country"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="Country / Region"
                  />
                  <label
                    htmlFor="country"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Country / Region
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="contact"
                    name="contact"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="Main Contact (Name, Email, Phone)"
                  />
                  <label
                    htmlFor="contact"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Main Contact
                  </label>
                </div>
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
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white/80 focus:text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled className="text-black">
                      Select Partnership Type
                    </option>
                    <option value="strategic" className="text-black">
                      Strategic PARTNERSHIP
                    </option>
                    <option value="delivery" className="text-black">
                      Delivery PARTNERSHIP
                    </option>
                    <option value="tech" className="text-black">
                      Technology PARTNERSHIP
                    </option>
                    <option value="creative" className="text-black">
                      Creative &amp; Media PARTNERSHIP
                    </option>
                    <option value="local" className="text-black">
                      Local Operations PARTNERSHIP
                    </option>
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
                <div className="relative">
                  <input
                    type="text"
                    id="pillars"
                    name="pillars"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="Relevant Pillars (A, B, C...)"
                  />
                  <label
                    htmlFor="pillars"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Relevant Pillars
                  </label>
                </div>
              </div>

              {/* Group 4: What you do */}
              <div className="relative">
                <textarea
                  required
                  id="description"
                  name="description"
                  rows={2}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent resize-none leading-relaxed"
                  placeholder="What you do  (1–3 sentences)"
                />
                <label
                  htmlFor="description"
                  className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                >
                  What you do ?
                </label>
              </div>

              {/* Group 5: Capabilities + Proof */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <textarea
                    required
                    id="capabilities"
                    name="capabilities"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent resize-none leading-relaxed"
                    placeholder="Top 3 capabilities (bullet points)"
                  />
                  <label
                    htmlFor="capabilities"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Top 3 capabilities
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    required
                    id="proof"
                    name="proof"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent resize-none leading-relaxed"
                    placeholder="Proof of work (links / portfolio / cases)"
                  />
                  <label
                    htmlFor="proof"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Proof of work
                  </label>
                </div>
              </div>

              {/* Group 5.1: References, Capacity, Budget */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="relative">
                  <input
                    type="text"
                    id="references"
                    name="references"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="References (optional)"
                  />
                  <label
                    htmlFor="references"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    References (optional)
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="capacity"
                    name="capacity"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="Capacity (project slots / hours)"
                  />
                  <label
                    htmlFor="capacity"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Capacity
                  </label>
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="budget"
                    name="budget"
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent"
                    placeholder="Typical project range (budget/scope)"
                  />
                  <label
                    htmlFor="budget"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Typical project range
                  </label>
                </div>
              </div>

              {/* Group 6: Values Fit */}
              <div className="relative">
                <textarea
                  required
                  id="values"
                  name="values"
                  rows={2}
                  className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent resize-none leading-relaxed"
                  placeholder="Values Fit (required): 2–3 sentences on responsibility, integrity, excellence, discretion"
                />
                <label
                  htmlFor="values"
                  className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                >
                  Values Fit (Required)
                </label>
              </div>

              {/* Group 7: Why GOTT WALD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <textarea
                    id="why"
                    name="why"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent resize-none leading-relaxed"
                    placeholder="Why GOTT WALD? (short)"
                  />
                  <label
                    htmlFor="why"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Why GOTT WALD?
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="constraints"
                    name="constraints"
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 pt-8 pb-4 text-xl md:text-2xl font-light text-white focus:outline-none focus:border-turquoise focus:shadow-[0_1px_15px_rgba(18,168,172,0.6)] transition-all duration-500 placeholder-transparent resize-none leading-relaxed"
                    placeholder="Anything we must know? (timing, constraints, risks)"
                  />
                  <label
                    htmlFor="constraints"
                    className="absolute left-0 top-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 peer-focus:text-turquoise peer-focus:drop-shadow-[0_0_8px_rgba(18,168,172,0.8)] peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-7 peer-placeholder-shown:text-xl peer-placeholder-shown:md:text-2xl peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-light peer-placeholder-shown:normal-case peer-placeholder-shown:text-white/90 transition-all duration-300 pointer-events-none"
                  >
                    Anything we must know?
                  </label>
                </div>
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
                  Application submitted successfully. If there&apos;s a fit,
                  we&apos;ll reach out with next steps.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-500/90 text-lg font-light mt-2 border border-red-500/20 bg-red-500/10 p-4 rounded-sm">
                  Failed to submit application. Please try again later or
                  contact us directly.
                </p>
              )}
              {submitStatus === "idle" && (
                <p className="text-white text-md font-light mt-2">
                  All transmissions are secured and treated with strict
                  confidentiality.
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <section className="relative z-10 bg-[#0a0a0a]">
          <FooterSection />
        </section>

        {/* ── NEXT CHAPTER ── */}
        <NextChapterTransition
          nextTitle={tNav("careers")}
          nextHref="/careers"
          prevHref="/about"
        />
      </main>
    </div>
  );
}
