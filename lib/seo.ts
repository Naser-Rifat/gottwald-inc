const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gottwald.world";
const SITE_NAME = "GOTT WALD Holding LLC";
const DEFAULT_DESCRIPTION =
  "Standards-led holding company headquartered in Tbilisi, Georgia. We build operating-grade systems for people and strategic assets — turning complexity into clarity, and decisions into measurable impact.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE };

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tbilisi",
      addressCountry: "GE",
    },
    sameAs: [],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}
