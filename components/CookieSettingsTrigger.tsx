"use client";

import React from "react";

export default function CookieSettingsTrigger() {
  const openCookieManager = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("open-cookie-manager"));
  };

  return (
    <button
      onClick={openCookieManager}
      className="text-white/90 hover:text-white transition-colors tracking-wider font-light text-[13px] bg-transparent outline-none border-none p-0 cursor-pointer text-left"
    >
      Cookie Settings
    </button>
  );
}
