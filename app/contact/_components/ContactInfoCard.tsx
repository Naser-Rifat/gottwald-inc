"use client";

import HqMap from "./HqMap";

const NOISE_BG_URL =
  "url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuODUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIi8+PC9zdmc+')";

/**
 * Left column of the content grid: glassmorphic contact card with head
 * office details, website, postal address and the stylized HQ map.
 *
 * The `.fade-up-element` class is the parent's GSAP scroll-trigger hook.
 */
export default function ContactInfoCard() {
  return (
    <div className="lg:col-span-4 flex flex-col gap-2">
      <div className="fade-up-element p-8 lg:p-10 rounded-3xl border border-white/10 bg-[#0a0c12]/60 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors duration-700">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04),_transparent_60%)] pointer-events-none rounded-3xl" />
        {/* Ultra-subtle Film Grain */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-soft-light rounded-3xl overflow-hidden"
          style={{ backgroundImage: NOISE_BG_URL }}
        />
        {/* Subtle turquoise edge glow */}
        <div
          className="absolute top-0 left-0 w-full h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(18,168,172,0.3), transparent)",
          }}
        />

        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-turquoise/70 uppercase">
              Head Office
            </h3>
            <div className="flex flex-col gap-2 text-xl font-medium tracking-tight">
              <a
                href="mailto:office@gottwald.world"
                data-magnetic
                className="hover:text-gold transition-colors w-max inline-block px-4 py-2 -mx-4"
              >
                office@gottwald.world
              </a>
              <a
                href="tel:+995800800800"
                data-magnetic
                className="hover:text-gold transition-colors w-max inline-block px-4 py-2 -mx-4"
              >
                +995 800 800 800
              </a>
            </div>
          </div>

          <div className="w-full h-px bg-white/10" />

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-turquoise/70 uppercase">
              Website
            </h3>
            <div className="flex flex-col gap-2 text-xl font-medium tracking-tight">
              <a
                href="https://www.gottwald.world"
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="hover:text-gold transition-colors w-max inline-block px-4 py-2 -mx-4"
              >
                www.gottwald.world
              </a>
            </div>
          </div>

          <div className="w-full h-px bg-white/10" />

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-turquoise/70 uppercase">
              GOTT WALD HOLDING
            </h3>
            <address className="text-xl font-medium tracking-tight not-italic text-white leading-relaxed">
              Company ID: 400415421
              <br />
              <br />
              Georgia, Tbilisi,
              <br />
              Gldani district
              <br />
              Maseli Street N2a
              <br />
              Entrance N2,
              <br />
              Office N201
              <br />
              reference 35.64,
              <br />
              block G
            </address>

            <HqMap />
          </div>
        </div>
      </div>
    </div>
  );
}
