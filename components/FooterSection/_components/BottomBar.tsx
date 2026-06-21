"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import CookieSettingsTrigger from "@/components/CookieSettingsTrigger";
import { legalLinks } from "../_data/legalLinks";

const LEGAL_LINK_CLASS =
  "notranslate text-white/90 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-wider font-light text-[13px]";

export default function BottomBar() {
  const tLegal = useTranslations("footer.legal");
  const year = new Date().getFullYear();

  return (
    <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 xl:gap-4 pt-8 border-t border-white/10">
      <p className="text-white/80 tracking-wide font-light text-[13px] leading-relaxed max-w-xl">
        © {year} GOTT WALD HOLDING LLC. Security-led operations · Confidential
        by default.
      </p>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-4 gap-y-4 w-full xl:w-auto mt-2 xl:mt-0">
        {legalLinks.map((link, idx) => (
          <span key={link.key} className="contents">
            {idx > 0 && (
              <span className="text-white/10 hidden sm:inline text-[13px]">
                ·
              </span>
            )}
            <Link href={link.href} translate="no" className={LEGAL_LINK_CLASS}>
              {tLegal(link.key)}
            </Link>
            {/* Cookie trigger sits between privacy-policy and terms-of-use */}
            {link.key === "privacyPolicy" && (
              <>
                <span className="text-white/10 hidden sm:inline text-[13px]">
                  ·
                </span>
                <CookieSettingsTrigger />
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
