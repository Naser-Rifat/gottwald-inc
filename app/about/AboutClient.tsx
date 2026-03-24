"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import NextChapterTransition from "@/components/NextChapterTransition";

gsap.registerPlugin(ScrollTrigger);

export default function AboutClient() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const handleStrategicClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const btn = e.currentTarget;
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          window.scrollTo(0, 0);
          router.push("/contact");
        }, 50);
      },
    });

    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:100vh;left:0;width:100vw;height:100vh;background:#030303;z-index:99999;pointer-events:none;display:flex;align-items:center;justify-content:center;";
    
    const glow = document.createElement("div");
    glow.style.cssText =
      "position:absolute;width:100vw;height:100vw;background:radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 60%);mix-blend-mode:screen;filter:blur(40px);";
    overlay.appendChild(glow);
    document.body.appendChild(overlay);

    tl.to(btn, { opacity: 0, duration: 0.4, ease: "power2.out" })
      .to(overlay, { top: 0, duration: 0.8, ease: "expo.inOut" }, "-=0.2");

    setTimeout(() => {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        },
      });
    }, 1200);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hero Fade In — opacity+y only, NO blur (blur forces GPU repaint)
      gsap.fromTo(
        ".hero-manifest-text",
        { opacity: 0, y: 24 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 2, 
          ease: "power2.out", 
          stagger: 0.5, 
          delay: 0.4, 
          clearProps: "transform",
          onComplete: () => {
            // Re-apply parallax logic if needed, or it works automatically if scrub is tied to trigger
          }
        }
      );

      // Hero Text Parallax (Awwwards effect)
      gsap.to(".parallax-fast", {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
      gsap.to(".parallax-slow", {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // Scroll Indicator Intro & Loop
      gsap.to(".scroll-indicator", { opacity: 1, duration: 1.5, delay: 2, ease: "power2.out" });
      gsap.to(".scroll-indicator-line", {
        yPercent: 200,
        duration: 2,
        repeat: -1,
        ease: "power1.inOut",
      });

      // 1.5 Hero Image Breathing — opacity shift only, NO scale (scale creates new compositor layer)
      gsap.to(".hero-bg-texture", {
        opacity: 0.45,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Ambient Light Breathing — opacity only, reduced frequency
      gsap.to(".ambient-light", {
        opacity: 0.35,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 3, from: "random" }
      });

      // 3. Reveal Elements on Scroll — opacity+y only, NO blur
      const revealElements = gsap.utils.toArray(".reveal-text") as HTMLElement[];
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 65%",
              scrub: false, // fire once, not scrub — scrub on every frame is expensive
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 4. Axis Background Image Reveal — opacity only, NO blur filter animation
      gsap.to(".axis-bg", {
        opacity: 0.55,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".axis-trigger",
          start: "top 90%",
          end: "top 40%",
          scrub: 1,
        }
      });

      // 5. Case Studies Horizontal Scroll Wrapper (Sticky)
      const horizontalContainer = document.querySelector(".cases-container") as HTMLElement;
      if (horizontalContainer) {
        gsap.to(horizontalContainer, {
          xPercent: -100 + (100 / 5), // Scroll through 5 cards
          ease: "none",
          scrollTrigger: {
            trigger: ".cases-wrapper",
            start: "top top",
            end: "+=3000",
            pin: true,
            scrub: 1,
          }
        });
      }

      // 5. Hover Effects for Ecosystem
      const ecoItems = gsap.utils.toArray(".eco-item") as HTMLElement[];
      ecoItems.forEach(item => {
        const line = item.querySelector(".eco-line");
        item.addEventListener("mouseenter", () => gsap.to(line, { width: "100%", duration: 0.5, ease: "power2.out" }));
        item.addEventListener("mouseleave", () => gsap.to(line, { width: "0%", duration: 0.5, ease: "power2.out" }));
      });
      
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-[#030303] min-h-screen text-white/80 font-sans overflow-hidden selection:bg-gold/20 selection:text-white">
      <div className="fixed top-0 left-0 w-full z-[100] px-gutter pointer-events-auto">
        <Header />
      </div>

      <main>
        {/* HERO SECTION */}
        <section className="hero-section min-h-[100vh] w-full flex flex-col justify-center relative bg-[#030303] overflow-hidden px-gutter pt-32 pb-[15vh]">
          {/* Cinematic Background Texture — JPG for smaller GPU texture, no mix-blend-mode */}
          <div className="hero-bg-texture absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ willChange: 'opacity' }}>
            <div className="absolute inset-0 bg-[url('/images/about_hero_abstract.jpg')] bg-cover bg-center bg-no-repeat" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/30 via-[#030303]/70 to-[#030303]" />
          </div>

          {/* Ambient Generative Light — contained layer, no mix-blend-mode to avoid compositing */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="ambient-light absolute top-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full opacity-15 blur-[100px]" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)", willChange: 'opacity' }} />
            <div className="ambient-light absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full opacity-8 blur-[80px]" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)", willChange: 'opacity' }} />
          </div>

          <div className="max-w-6xl mx-auto w-full relative z-10 space-y-12 lg:space-y-16 mt-[-10vh]">
            <div>
              <p className="hero-manifest-text text-gold/40 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold mb-6 lg:mb-8">
                ABOUT US — GOTT WALD HOLDING
              </p>
              <h1 className="hero-manifest-text text-[clamp(2.5rem,6vw,6.5rem)] leading-[1.03] font-light tracking-tighter text-white/90">
                <span className="inline-block parallax-fast">WE TURN COMPLEXITY</span> <br />
                <span className="font-serif italic text-gold/80 px-1 lg:px-4 inline-block parallax-slow">into inevitability.</span>
              </h1>
            </div>

            <div className="hero-manifest-text max-w-2xl text-lg md:text-2xl font-light text-white/60 leading-[1.6]">
              <p>
                If you&apos;re a CEO, founder, executive — or you run an SME that must grow — you know this moment.
              </p>
            </div>
          </div>

          {/* Premium Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 scroll-indicator hidden sm:flex">
            <span className="text-[9px] tracking-[0.4em] uppercase text-gold/50 font-bold">Scroll to tune in</span>
            <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
              <div className="scroll-indicator-line absolute top-0 left-0 w-full h-full bg-gold -translate-y-[101%]" />
            </div>
          </div>
        </section>

        {/* NARRATIVE SCROLL SEQUENCE */}
        <section className="bg-[#030303] relative z-10 -mt-[15vh]">
          <div className="max-w-4xl mx-auto px-gutter space-y-[35vh] pb-[25vh]">
            <p className="reveal-text text-[clamp(1.5rem,3.5vw,3rem)] font-light text-white/60 leading-[1.5] parallax-slow">
              You can feel there&apos;s more possible... yet something in the system keeps draining energy. Too many topics, not enough sequence. Too much noise, not enough truth.
            </p>
            
            <p className="reveal-text text-[clamp(1.5rem,3.5vw,3rem)] font-light text-white/60 leading-[1.5] parallax-fast">
              And even though everyone is smart, it doesn&apos;t get lighter — <span className="text-white font-normal">it just gets fuller.</span>
            </p>
            
            <div className="reveal-text space-y-6">
              <div className="w-12 h-px bg-gold/50" />
              <p className="text-[clamp(2rem,4.5vw,4rem)] font-serif italic text-gold/90 leading-[1.3]">
                That&apos;s where our work begins.
              </p>
            </div>
          </div>
        </section>

        {/* THE DIFFERENCE */}
        <section className="py-[25vh] px-gutter relative bg-[#030303] overflow-hidden">
          {/* Cinematic Axis Background — JPG, opacity-only reveal, no blur filter, no mix-blend-mode */}
          <div className="axis-bg absolute inset-0 z-0 opacity-0 pointer-events-none" style={{ willChange: 'opacity' }}>
            <div className="absolute inset-0 bg-[url('/images/about_axis_nature.jpg')] bg-cover bg-center bg-no-repeat opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#030303]/50 to-[#030303]" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-32 relative z-10">
            <div className="reveal-text space-y-12">
              <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                GOT WALD HOLDING is not a traditional service provider.
              </h2>
              <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
                We are an execution standard: strategy, structure, technology, communication, and human performance — built as one integrated system that reduces complexity and makes outcomes inevitable.
              </p>
            </div>
            
            <div className="axis-trigger reveal-text">
              <p className="text-lg md:text-xl text-white/40 mb-6">And we carry an axis you don&apos;t debate — you feel it:</p>
              <p className="text-3xl md:text-5xl font-black tracking-widest text-gold opacity-90 drop-shadow-2xl">
                NATURE<span className="text-white/20 mx-4">–</span>ANIMALS<span className="text-white/20 mx-4">–</span>HUMANS
              </p>
            </div>

            <div className="reveal-text space-y-8 max-w-3xl mx-auto pt-16 border-t border-white/5">
              <p className="text-sm tracking-[0.3em] uppercase text-gold/50 font-bold mb-4">The difference</p>
              <h3 className="text-4xl md:text-6xl font-light text-white">We don&apos;t optimize parts.</h3>
              <p className="text-2xl md:text-4xl font-serif italic text-white/60">
                We redesign the system — until &quot;solved&quot; is felt in real life.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT WE STAND FOR */}
        <section className="py-[25vh] px-gutter relative bg-[#050505]">
          <div className="max-w-5xl mx-auto">
            <p className="reveal-text text-sm tracking-[0.3em] uppercase text-gold/50 font-bold mb-16">What we stand for</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div className="reveal-text space-y-8">
                <h3 className="text-4xl md:text-5xl font-light leading-tight">
                  We believe in something radical — <span className="font-serif italic text-gold/80 hover:text-gold transition-colors duration-500">and practical:</span>
                </h3>
                <p className="text-2xl text-white/80 leading-relaxed font-light">
                  When structure becomes visible, the right solution becomes inevitable. Not &quot;someday.&quot; Not &quot;when there&apos;s time.&quot;
                </p>
                <div className="space-y-4 pt-8">
                  <p className="text-xl text-white/60">✓ But in a way that lets a CEO breathe again.</p>
                  <p className="text-xl text-white/60">✓ In a way that helps founders know what comes first.</p>
                  <p className="text-xl text-white/60">✓ In a way that lets teams deliver with focus — and systems carry instead of pull.</p>
                </div>
              </div>
              <div className="reveal-text bg-[#080808] p-12 rounded-3xl border border-white/5 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <h4 className="text-5xl font-black text-white mb-6">Solved means solved.</h4>
                <p className="text-2xl font-serif italic text-gold/80 mb-8">&quot;Solved&quot; means you feel it on Monday morning, not in a pitch.</p>
                <p className="text-xl text-white/60 font-light leading-relaxed">
                  Less friction. Clearer decisions. Higher speed. More calm in the system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 PILLARS (WHAT WE DO DIFFERENTLY) */}
        <section className="py-[20vh] px-gutter relative bg-[#030303]">
          <div className="max-w-5xl mx-auto">
            <div className="reveal-text mb-32 max-w-5xl">
              <div className="flex items-center gap-4 mb-10">
                <span className="w-8 md:w-16 h-px bg-gold/40" />
                <p className="text-[12px] md:text-xs tracking-[0.4em] uppercase text-gold/60 font-bold">What we do differently</p>
              </div>

              <h3 className="text-[clamp(2.5rem,5vw,5.5rem)] font-light leading-[1.1] tracking-tight text-white/80">
                The world is full of <span className="text-white">“optimizations.”</span>
                <br />
                <span className="pl-4 md:pl-16 text-white/60">
                  We build <span className="font-serif italic text-gold font-normal">architecture</span> —
                </span>
                <br />
                <span className="pl-12 md:pl-32 text-white/60 text-[clamp(2rem,4vw,4.5rem)]">
                  so growth doesn&apos;t mean “more pressure,”
                </span>
                <br />
                <span className="text-white font-normal drop-shadow-2xl">
                  but more clarity.
                </span>
              </h3>
            </div>

            <div className="space-y-32">
              {[
                {
                  num: "01",
                  title: "We remove noise until only truth remains",
                  desc: "Most problems aren't complex — they're just hidden. We reveal what truly drives the system: root cause, leverage, sequence."
                },
                {
                  num: "02",
                  title: "We make decisions light again",
                  desc: "When a system becomes clear, decisions almost make themselves. Not because it's \"easy,\" but because it is finally ordered."
                },
                {
                  num: "03",
                  title: "We build signal, not volume",
                  desc: "Marketing is not a campaign. It's Trust & Demand Infrastructure: positioning, proof architecture, messaging, conversion — built so premium clients and top talent take you seriously immediately."
                },
                {
                  num: "04",
                  title: "We treat technology as infrastructure",
                  desc: "Websites are not business cards. They are discovery, trust, conversion, scale — including SEO and AI indexing. With IT Solutions 2030, we transform outdated presences into future-ready digital infrastructure."
                },
                {
                  num: "05",
                  title: "We strengthen the human behind the system",
                  desc: "Because the best strategy fails when the person behind it is burning out or drifting. Coaching & Mentoring with us means regulation, focus, clarity, identity — so performance becomes sustainable."
                }
              ].map((pillar, i) => (
                <div key={i} className="reveal-text flex flex-col md:flex-row gap-8 md:gap-16 border-t border-white/5 pt-16">
                  <div className="md:w-1/4">
                    <span className="text-5xl font-black text-white/30">{pillar.num}</span>
                  </div>
                  <div className="md:w-3/4 space-y-6">
                    <h4 className="text-3xl md:text-4xl font-light text-white">{pillar.title}</h4>
                    <p className="text-xl md:text-2xl text-white/50 font-light leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTCOMES & TIME TO VALUE */}
        <section className="py-[20vh] px-gutter relative bg-[#050505]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="reveal-text space-y-12">
              <div>
                <p className="text-sm tracking-[0.3em] uppercase text-gold/50 font-bold mb-6">Proof (without bragging)</p>
                <h3 className="text-4xl font-light leading-tight mb-4">We work discreetly and systematically.</h3>
                <p className="text-2xl font-serif italic text-white/60">Our proof is not loudness — it&apos;s outcomes.</p>
              </div>
              <div className="space-y-2 pt-8">
                <p className="text-sm tracking-[0.2em] uppercase text-white/50 font-bold mb-8">Typical outcomes felt quickly:</p>
                <div className="flex flex-col border-t border-white/5">
                  {[
                    { strong: "Decision gridlock dissolves:", text: "clear priorities, clear ownership, fewer open loops." },
                    { strong: "Execution becomes predictable:", text: "projects are not \"felt,\" they are led — with SSOT, sequence, and standards." },
                    { strong: "Visibility becomes plan-able:", text: "messaging locks in, proof is structured, conversion rises — because trust forms faster." },
                    { strong: "Digital presence becomes powerful:", text: "performance, indexability, structure — website as operating system, not brochure." },
                    { strong: "Leadership state stabilizes:", text: "more calm, more focus, better decisions — without self-loss." }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex items-start gap-6 py-6 border-b border-white/5 cursor-default transition-colors duration-500 hover:bg-white/[0.02]">
                      <span className="text-gold/50 font-mono text-md group-hover:text-gold transition-colors duration-500 pt-1 tracking-widest">{(idx + 1).toString().padStart(2, '0')}</span>
                      <p className="text-xl text-white/60 font-light transition-transform duration-500 group-hover:translate-x-2">
                        <strong className="text-white block mb-1 group-hover:text-gold transition-colors duration-500">{item.strong}</strong> 
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Glass Monolith Box */}
            <div className="reveal-text relative p-10 lg:p-16 rounded-3xl border border-white/5 overflow-hidden group/card text-white">
              {/* Inner Glow / Monolithic effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#111111]/80 to-[#040404]/80 z-0 backdrop-blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_70%)] z-0 transition-opacity duration-1000 group-hover/card:opacity-100 opacity-60" />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                   <p className="text-sm tracking-[0.3em] uppercase text-gold/50 font-bold mb-6">Time-to-value</p>
                   {/* <h3 className="text-3xl font-light mb-16 text-white/80">(Realistic Orientation)</h3> */}
                </div>

                <div className="space-y-16">
                  {[
                    { days: "7–14", title: "DAYS", desc: "Root cause + leverage + sequence become crystal clear (not just opinions)." },
                    { days: "30", title: "DAYS", desc: "Less friction, more line, visible relief across the system." },
                    { days: "60–90", title: "DAYS", desc: "Standards hold, signal stands, infrastructure carries — execution becomes stable." }
                  ].map((phase, idx) => (
                    <div key={idx} className="relative group/item cursor-default flex flex-col">
                      {/* Watermark Number */}
                      <div className="absolute -left-6 -top-10 text-[6rem] lg:text-[8rem] font-black pointer-events-none select-none tracking-tighter overflow-hidden whitespace-nowrap hidden sm:block z-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-1000" style={{ 
                        color: "transparent", 
                        WebkitTextStroke: "1px rgba(212, 175, 55, 0.08)" 
                      }}>
                        {phase.days}
                      </div>
                      
                      <div className="relative z-10 pl-0 sm:pl-8 border-l border-white/5 sm:border-gold/0 group-hover/item:border-gold/30 transition-colors duration-700">
                        <div className="flex items-center gap-4 mb-4">
                          <h4 className="text-3xl md:text-4xl text-white group-hover/item:text-gold font-light tracking-tight transition-colors duration-500">{phase.days}</h4>
                          <span className="text-xs font-mono tracking-widest text-gold/60 mt-2">{phase.title}</span>
                        </div>
                        <p className="text-xl text-white/50 font-light leading-[1.6] group-hover/item:text-white/80 transition-colors duration-500">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-lg text-white/50 italic mt-16 pt-8 border-t border-white/5">
                  Wherever metrics belong (conversion, lead quality, meeting time), we use numbers only when they are measurable and defensible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MINI CASES - HORIZONTAL SCROLL */}
        <section className="cases-wrapper h-screen bg-[#030303] overflow-hidden flex flex-col justify-center relative">
           <div className="absolute top-12 left-gutter z-20">
             <p className="text-xl tracking-[0.3em] uppercase text-gold/80 font-bold">Mini Case Stories</p>
             <p className="text-xl font-serif italic text-white/60">(you&apos;ll recognize yourself)</p>
           </div>
           
           <div className="cases-container flex h-[60vh] w-[500vw] items-center">
              {[
                { tag: "CEO / Founder / Entrepreneur", title: "Case 1 — Too many moving parts", before: "Everything matters, nothing is ordered. Decisions are heavy. Team pressure rises.", intervention: "SolutionFinder → root cause visible → sequence + SSOT → execution standard.", after: "Fewer open loops, a clear line, noticeably more calm. Decision-making becomes light again." },
                { tag: "SME / Premium Offer", title: "Case 2 — We're great — but invisible", before: "High quality, unclear external signal. Inconsistent leads.", intervention: "Messaging architecture + proof structure + trust system + conversion flow.", after: "The market understands you immediately. Trust forms faster. Demand becomes more predictable." },
                { tag: "SME", title: "Case 3 — Old website, slow growth", before: "Website as a brochure. Performance and structure hold you back. Indexing potential is wasted.", intervention: "IT Solutions 2030 → infrastructure upgrade (performance, SEO/AI readability, structure, scalability).", after: "More discoverable, faster, clearer — website becomes a growth engine." },
                { tag: "Executive", title: "Case 4 — High responsibility, inner drift", before: "You function outwardly, but feel restless inside. Focus breaks. Energy drops.", intervention: "Mentoring as a Human Operating System (regulation, focus, identity, daily systems).", after: "Stable state, clearer decisions, stronger impact — without drama." },
                { tag: "Entrepreneur / Holding", title: "Case 5 — Structure Deployment (Georgia)", before: "You want structure, but risk chaos, half-knowledge, wrong sequence.", intervention: "Assessment → defensible setup → clean coordination (compliant, bankable, operational).", after: "Structure stands. Operations are clear. Less stress. More safety." }
              ].map((c, i) => (
                <div key={i} className="w-screen px-gutter flex justify-center shrink-0">
                  <div className="w-full max-w-4xl bg-[#0a0a0a] border border-white/5 p-10 md:p-16 rounded-4xl relative overflow-hidden group">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
                    
                    <p className="text-lg font-mono tracking-wide text-gold/70 mb-10">{c.tag}</p>
                    <h3 className="text-3xl md:text-4xl font-light text-white/95 leading-[1.1] mb-20 max-w-3xl">{c.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                      {/* BEFORE */}
                      <div className="space-y-4">
                        <p className="text-lg tracking-[0.2em] uppercase text-white/40 font-bold">Before</p>
                        <p className="text-xl text-white/90 font-light leading-relaxed pr-4">{c.before}</p>
                      </div>
                      
                      {/* INTERVENTION */}
                      <div className="space-y-4 md:border-l md:border-white/5 md:pl-10">
                        <p className="text-lg tracking-[0.2em] uppercase text-gold/60 font-bold">Intervention</p>
                        <p className="text-xl text-white/90 font-light leading-relaxed pr-4">{c.intervention}</p>
                      </div>
                      
                      {/* AFTER */}
                      <div className="space-y-4 md:border-l md:border-white/5 md:pl-10">
                        <p className="text-lg tracking-[0.2em] uppercase text-white/90 font-bold">After</p>
                        <p className="text-xl text-white/90 font-light leading-relaxed">{c.after}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* ECOSYSTEM */}
        <section className="pt-[10vh] pb-[20vh] px-gutter relative bg-[#050505]">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="reveal-text">
              <h2 className="text-4xl md:text-5xl font-light">Our Ecosystem</h2>
              <p className="text-2xl font-serif italic text-white/50 mt-4">(everything reinforces everything)</p>
            </div>
            <div className="space-y-4">
              {[
                { name: "SolutionFinder / Solution Management", desc: "find the cause, lead the solution, lock stability." },
                { name: "Consulting", desc: "executive-grade structure, strategy, decision systems, growth." },
                { name: "Marketing & Communication", desc: "signal, trust, demand infrastructure." },
                { name: "IT Solutions 2030", desc: "website as high-performance, indexable infrastructure." },
                { name: "Coaching & Mentoring", desc: "human operating system for high responsibility." },
                { name: "Structure Deployment (Georgia)", desc: "defensible setup for entrepreneurs/holdings." },
                { name: "YIG.CARE", desc: "platform & movement. Launch 2026." },
                { name: "PLHH_Coin", desc: "RWA + Governance DAO for real-world regeneration: NATURE – ANIMALS – HUMANS." }
              ].map((eco, i) => (
                <div key={i} className="eco-item  reveal-text group py-8 border-t border-white/5 cursor-default relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 relative z-10">
                    <h3 className="text-2xl md:text-3xl text-white font-light group-hover:text-gold transition-colors duration-500">{eco.name}</h3>
                    <p className="text-xl text-white/70 font-light md:w-1/2 md:text-right">{eco.desc}</p>
                  </div>
                  <div className="eco-line absolute bottom-0 left-0 h-px w-0 bg-gold" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE PATRON OF GOTT WALD */}
        <section className="py-[30vh] px-gutter relative flex items-center justify-center bg-[#030303]">
          {/* Breathing Orb */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="ambient-light w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-20 blur-[150px]"
                 style={{ background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)" }} />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-24">
            <div className="reveal-text space-y-8">
              <h2 className="text-[clamp(3rem,6vw,6rem)] font-light leading-[1.1] uppercase tracking-tighter">
                THE PATRON <br />
                <span className="font-serif italic text-gold/80 block text-[clamp(2rem,4vw,4rem)] lowercase mt-4">of gott wald</span>
              </h2>
              <p className="text-xl md:text-3xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
                In the fabric of GOTT WALD, the PATRON is not the &quot;single maker&quot; — and not the lone specialist. The PATRON is the protective framework.
              </p>
            </div>

            <div className="reveal-text grid grid-cols-1 md:grid-cols-2 text-left border-y border-white/10 py-16 md:py-24 max-w-5xl mx-auto w-full relative">
              
              {/* Vertical divider line for desktop */}
              <div className="hidden md:block absolute top-[10%] bottom-[10%] left-1/2 w-px bg-white/10" />

              {/* LEFT COLUMN: THE DECISION CODE */}
              <div className="md:pr-24 space-y-10 pb-16 md:pb-0">
                <p className="text-xs tracking-[0.25em] uppercase text-gold/90 font-bold">
                  The Decision Code
                </p>
                <p className="text-[17px] text-white/60 font-light leading-relaxed mb-6 max-w-100">
                  GOTT WALD is not built on trends. It is built on principles. Timeless. Durable. Non-negotiable.
                </p>
                <ul className="space-y-6">
                   <li className="flex items-baseline">
                      <span className="font-serif italic text-[22px] text-white/90 mr-2">Love</span>
                      <span className="text-[15px] font-light text-white/50">as the measure</span>
                   </li>
                   <li className="flex items-baseline">
                      <span className="font-serif italic text-[22px] text-white/90 mr-2">Peace</span>
                      <span className="text-[15px] font-light text-white/50">as the direction</span>
                   </li>
                   <li className="flex items-baseline">
                      <span className="font-serif italic text-[22px] text-white/90 mr-2">Harmony</span>
                      <span className="text-[15px] font-light text-white/50">as the outcome</span>
                   </li>
                   <li className="flex items-baseline">
                      <span className="font-serif italic text-[22px] text-white/90 mr-2">Compassion</span>
                      <span className="text-[15px] font-light text-white/50">as the posture</span>
                   </li>
                   <li className="flex items-baseline">
                      <span className="font-serif italic text-[22px] text-white/90 mr-2">Empathy</span>
                      <span className="text-[15px] font-light text-white/50">as the capability</span>
                   </li>
                   <li className="flex items-baseline">
                      <span className="font-serif italic text-[22px] text-white/90 mr-2">Service</span>
                      <span className="text-[15px] font-light text-white/50">as lived responsibility</span>
                   </li>
                </ul>
                <p className="text-[14px] font-bold text-white pt-8">
                  This is not a slogan. This is lived reality.
                </p>
              </div>

              {/* RIGHT COLUMN: A RARE GIFT */}
              <div className="space-y-10 md:pl-24 pt-16 md:pt-0 border-t border-white/10 md:border-t-0">
                <p className="text-xs tracking-[0.25em] uppercase text-gold/90 font-bold">
                  A rare gift
                </p>
                <p className="text-[17px] text-white/60 font-light leading-relaxed max-w-105">
                  The PATRON carries a rare gift: a reader of people. a feeler. a gatherer. The PATRON sees you before you&apos;ve fully organized yourself.
                </p>
                
                <div className="bg-[#0f0f0f] p-10 rounded-2xl border border-white/5 space-y-8 max-w-105">
                  <p className="text-white/90 italic font-serif leading-[1.3] text-[26px]">
                    &quot;nothing here is performed. everything here is held.&quot;
                  </p>
                  <ul className="space-y-3 text-[16px] text-white/50 font-light">
                     <li>Conflict becomes clear.</li>
                     <li>Disorder becomes direction.</li>
                     <li>Pressure becomes purpose.</li>
                  </ul>
                </div>

                <p className="text-[15px] text-white/70 font-light leading-relaxed max-w-105">
                  So specialists can build without systems turning cold. So growth never consumes the soul. A framework that carries. A system that protects. A force that unites.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DECISION / CTA */}
        <section className="h-screen px-gutter relative flex items-center justify-center bg-[#010101] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="reveal-text w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-10 blur-[100px]"
                 style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 50%)" }} />
          </div>

          <div className="reveal-text relative z-10 text-center flex flex-col items-center max-w-3xl space-y-16">
            <div>
              <p className="text-lg tracking-[0.3em] uppercase text-white/90 font-bold mb-6">Who this is for</p>
              <h3 className="text-3xl md:text-5xl font-light leading-[1.3] text-white/90">
                For CEOs, founders, executives, and SMEs who don&apos;t want to &quot;do more&quot; — but to do the right thing, the right way.
              </h3>
            </div>
            
            <p className="text-2xl font-serif italic text-white/50">
              If you want it cleanly solved — we are.
            </p>

            <div className="pt-16">
              <button onClick={handleStrategicClick} className="group relative cursor-pointer px-12 py-6">
                <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-gold/30 transition-colors duration-500" />
                <span className="text-sm tracking-[0.4em] uppercase font-bold text-white/80 group-hover:text-gold transition-colors duration-700">
                  Request a Strategic Conversation
                </span>
              </button>
            </div>
            
            <p className="text-base text-white/40 font-light mt-8">
              We don&apos;t create noise. We create structure.<br/>And structure creates inevitability.
            </p>
          </div>
        </section>
      </main>

      <NextChapterTransition nextTitle="PARTNERSHIP" nextHref="/partnerships" />
      <FooterSection />
    </div>
  );
}
