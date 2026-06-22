/**
 * Labels are resolved at render time via `footer.directory.*` and
 * `footer.protocols.*` translation keys. Hrefs stay route-stable —
 * keep the `key` field in sync with the message namespace.
 */

export interface NavLink {
  key: string;
  href: string;
}

export const directoryLinks: ReadonlyArray<NavLink> = [
  { key: "entityGrid", href: "/entity-grid" },
  { key: "manifesto", href: "/partnerships#manifesto" },
  { key: "cooperationHub", href: "/cooperation-hub" },
  { key: "strategicAssets", href: "/strategic-assets" },
  { key: "strategicInquiry", href: "/contact" },
  { key: "pressMediaKit", href: "/press-media-kit" },
  { key: "careers", href: "/careers" },
];

export const protocolItems: ReadonlyArray<NavLink> = [
  { key: "confidentialByDefault", href: "/protocols#confidential-by-default" },
  { key: "valuesFirstSelection", href: "/protocols#values-first-selection" },
  { key: "standardsLedGovernance", href: "/protocols#standards-led-governance" },
  { key: "executionOverExposure", href: "/protocols#execution-over-exposure" },
];
