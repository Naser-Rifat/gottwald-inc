// "use client";

// import { useEffect, useRef } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import gsap from "gsap";

// export default function TransitionProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const inkRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Enter Animation (runs on mount/route change)
//   useEffect(() => {
//     const ink = inkRef.current;
//     const container = containerRef.current;
//     if (!ink || !container) return;

//     // Reset ink to cover the screen
//     gsap.set(ink, {
//       yPercent: 0,
//       borderBottomLeftRadius: "0%",
//       borderBottomRightRadius: "0%",
//       borderTopLeftRadius: "0%",
//       borderTopRightRadius: "0%",
//     });
//     gsap.set(container, { opacity: 0, y: 30 });

//     const tl = gsap.timeline();

//     // Ink sweeps UP and OUT
//     tl.to(ink, {
//       yPercent: -100,
//       duration: 1.2,
//       ease: "power4.inOut",
//       onUpdate: function () {
//         const progress = this.progress();
//         // Give it a fluid, drooping bottom edge as it lifts
//         if (progress > 0.1 && progress < 0.9) {
//           const curve = Math.sin(progress * Math.PI) * 20;
//           gsap.set(ink, {
//             borderBottomLeftRadius: `${50}% ${curve}%`,
//             borderBottomRightRadius: `${50}% ${curve}%`,
//           });
//         } else {
//           gsap.set(ink, {
//             borderBottomLeftRadius: "0%",
//             borderBottomRightRadius: "0%",
//           });
//         }
//       },
//     }).to(
//       container,
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.8,
//         ease: "power3.out",
//       },
//       "-=0.8",
//     );

//     // Click Interceptor for Exit Animations
//     const handleLinkClick = (e: MouseEvent) => {
//       const target = (e.target as HTMLElement).closest("a");
//       if (!target) return;

//       const href = target.getAttribute("href");

//       // If it's a cross-origin link, an anchor link, or opens in new tab, let browser handle it normally.
//       if (
//         !href ||
//         href.startsWith("http") ||
//         href.startsWith("#") ||
//         target.target === "_blank"
//       )
//         return;

//       // If it's the current page, do nothing
//       if (href === pathname) return;

//       e.preventDefault();

//       // Run Exit Animation (Ink sweeps DOWN and IN)
//       gsap.set(ink, { yPercent: -100 });

//       const exitTl = gsap.timeline({
//         onComplete: () => {
//           // Push router only after ink fully covers screen
//           router.push(href);
//         },
//       });

//       exitTl
//         .to(
//           container,
//           {
//             opacity: 0,
//             y: -30,
//             duration: 0.6,
//             ease: "power3.in",
//           },
//           0,
//         )
//         .to(
//           ink,
//           {
//             yPercent: 0,
//             duration: 1.0,
//             ease: "power4.inOut",
//             onUpdate: function () {
//               const progress = this.progress();
//               // Drooping bottom edge as it falls
//               if (progress > 0.1 && progress < 0.9) {
//                 const curve = Math.sin(progress * Math.PI) * 20;
//                 gsap.set(ink, {
//                   borderBottomLeftRadius: `${50}% ${curve}%`,
//                   borderBottomRightRadius: `${50}% ${curve}%`,
//                 });
//               } else {
//                 gsap.set(ink, {
//                   borderBottomLeftRadius: "0%",
//                   borderBottomRightRadius: "0%",
//                 });
//               }
//             },
//           },
//           0,
//         );
//     };

//     document.addEventListener("click", handleLinkClick);

//     return () => {
//       document.removeEventListener("click", handleLinkClick);
//     };
//   }, [pathname, router]);

//   return (
//     <>
//       <div
//         ref={inkRef}
//         className="fixed inset-0 z-[9990] pointer-events-none bg-petrol shadow-[0_0_100px_rgba(0,0,0,0.8)]"
//       />
//       <div ref={containerRef}>{children}</div>
//     </>
//   );
// }
