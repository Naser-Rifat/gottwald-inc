"use client";

import BrutalistContactForm from "@/components/form/BrutalistContactForm";

const NOISE_BG_URL =
  "url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuODUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIi8+PC9zdmc+')";

/**
 * Right column of the content grid: glassmorphic wrapper around the
 * shared <BrutalistContactForm/>. Houses the "encrypted channel" badge,
 * the title block, and the brief intro paragraph.
 */
export default function ContactFormCard() {
  return (
    <div className="lg:col-span-7 lg:col-start-6">
      <div className="fade-up-element p-8 lg:p-12 rounded-3xl border border-white/[0.08] bg-[#0a0c12]/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-700">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(18,168,172,0.05),_transparent_60%)] pointer-events-none rounded-3xl" />
        {/* Ultra-subtle Film Grain */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-soft-light rounded-3xl overflow-hidden"
          style={{ backgroundImage: NOISE_BG_URL }}
        />
        {/* Top edge glow */}
        <div
          className="absolute top-0 left-0 w-full h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
          }}
        />

        {/* Secure Channel Badge */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <svg
            className="w-3 h-3 text-gold opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-[8px] font-mono tracking-widest uppercase text-white/50">
            Encrypted Channel
          </span>
        </div>

        <div className="mb-10 mt-4">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase mb-6">
            Send us a message
          </h2>
          <p className="text-white/70 text-base max-w-md leading-relaxed">
            We review all inquiries. If there is alignment, our team will
            coordinate a secure briefing.
          </p>
        </div>

        <BrutalistContactForm subject="General Inquiry" />
      </div>
    </div>
  );
}
