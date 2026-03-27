"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";

export default function CookieManager() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already set cookie preferences
    const hasConsented = localStorage.getItem("gottwald_cookie_consent");
    if (!hasConsented) {
      // Auto-open on first visit with a slight delay
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cookie-manager", handleOpen);
    return () => window.removeEventListener("open-cookie-manager", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".cookie-manager-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        ".cookie-manager-modal",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(".cookie-manager-modal", {
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(".cookie-manager-overlay", {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => setIsOpen(false),
    });
  };

  const handleAcceptAll = () => {
    localStorage.setItem("gottwald_cookie_consent", "all");
    handleClose();
  };

  const handleRejectOptional = () => {
    localStorage.setItem("gottwald_cookie_consent", "essential");
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cookie-manager-overlay fixed inset-0 z-[9999] bg-[#030303]/90 backdrop-blur-md flex items-center justify-center px-4 py-12 overflow-y-auto">
      <div className="cookie-manager-modal w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-8 md:p-12 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
          aria-label="Close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className="text-2xl md:text-3xl font-light text-white tracking-widest uppercase mb-4">
          Cookie Preferences
        </h2>
        <p className="text-white/60 font-light text-lg mb-8 leading-relaxed max-w-xl">
          At GOTT WALD Holding, we prioritize precision and discretion. We use
          cookies strictly to ensure platform security, verify interactions, and
          maintain structural integrity.
        </p>

        <div className="space-y-6 mb-12">
          {/* Strictly Necessary */}
          <div className="flex items-start justify-between border-b border-white/5 pb-6">
            <div className="pr-4">
              <h3 className="text-white text-lg font-medium tracking-wide mb-2">
                Essential Operations
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-md">
                Required to enable core site functionality such as security,
                network management, and accessibility. These cannot be disabled.
              </p>
            </div>
            <div className="text-gold border border-gold/30 px-3 py-1 flex-shrink-0 text-xs tracking-widest uppercase mt-1">
              Always Active
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between border-b border-white/5 pb-6">
            <div className="pr-4">
              <h3 className="text-white text-lg font-medium tracking-wide mb-2">
                Performance Analytics
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-md">
                Helps us understand how visitors interact with the infrastructure
                to improve structural efficiency and navigation.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 flex-shrink-0">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold/80"></div>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={handleRejectOptional}
            className="px-6 py-3 border border-white/20 text-white hover:bg-white/5 transition-colors tracking-widest uppercase text-sm font-medium"
          >
            Reject Optional
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-6 py-3 bg-white text-black hover:bg-white/90 transition-colors tracking-widest uppercase text-sm font-medium"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
