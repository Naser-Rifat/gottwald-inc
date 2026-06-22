"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { ecosystemPortals } from "../_data/ecosystemPortals";
import { YOUTUBE_HANDLE, YOUTUBE_URL } from "../_data/brandMetadata";

const PORTAL_HOVER_CLASS =
  "hover:text-turquoise transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

export default function BrandColumn() {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <Link href="/" className="w-max">
        <Image
          src={logo}
          alt="Gott Wald"
          width={56}
          height={56}
          className="rounded-full"
          suppressHydrationWarning
        />
      </Link>

      <h3 className="text-2xl font-bold tracking-[0.04em] uppercase leading-tight text-white/90">
        GOTT WALD HOLDING LLC
      </h3>

      <p className="text-xl text-white/70 leading-relaxed max-w-sm">
        Georgia&apos;s strategic anchor for governance, standards-led
        execution, and industrial portfolio scaling.
      </p>

      <div className="mt-6">
        <h4 className="text-md uppercase tracking-[0.3em] font-bold text-white/90 mb-3">
          Ecosystem Portals
        </h4>
        <p className="text-lg text-white/70 leading-relaxed">
          {ecosystemPortals.map((portal, idx) => (
            <span key={portal.href}>
              {idx > 0 && " · "}
              <a
                href={portal.href}
                target="_blank"
                rel="noopener noreferrer me"
                className={PORTAL_HOVER_CLASS}
              >
                {portal.label}
              </a>
            </span>
          ))}
        </p>
      </div>

      <div className="mt-2">
        <h4 className="text-md uppercase tracking-[0.3em] font-bold text-white/90 mb-3">
          Public Signal
        </h4>
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={`GOTT WALD on YouTube (${YOUTUBE_HANDLE})`}
          className="inline-flex items-center gap-2.5 text-md text-white/70 hover:text-turquoise transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group/yt"
        >
          <svg
            className="w-5 h-5 shrink-0 opacity-70 group-hover/yt:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span>{YOUTUBE_HANDLE}</span>
        </a>
      </div>
    </div>
  );
}
