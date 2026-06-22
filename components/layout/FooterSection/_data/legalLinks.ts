/**
 * Legal links shown in the footer's bottom bar. Labels resolved via
 * the `footer.legal.*` translation namespace.
 */

export interface LegalLink {
  key: "imprint" | "privacyPolicy" | "termsOfUse";
  href: string;
}

export const legalLinks: ReadonlyArray<LegalLink> = [
  { key: "imprint", href: "/imprint" },
  { key: "privacyPolicy", href: "/privacy-policy" },
  { key: "termsOfUse", href: "/terms-of-use" },
];
