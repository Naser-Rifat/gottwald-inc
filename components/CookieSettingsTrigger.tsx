"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function CookieSettingsTrigger() {
  const t = useTranslations("footer.legal");

  const openCookieManager = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("open-cookie-manager"));
  };

  return (
    <button
      onClick={openCookieManager}
      translate="no"
      className="notranslate text-white/90 hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-wider font-light text-[13px] bg-transparent outline-none border-none p-0 cursor-pointer text-left"
    >
      {t("cookieSettings")}
    </button>
  );
}
