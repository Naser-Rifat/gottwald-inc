export type MetricVariant = "white" | "turquoise" | "copper" | "silver";

export interface AuthorityMetric {
  label: string;
  value: string;
  /** Optional small raised suffix rendered next to the value (e.g. "+"). */
  suffix?: string;
  unit: string;
  variant: MetricVariant;
}

export const authorityMetrics: AuthorityMetric[] = [
  {
    label: "— COVERAGE",
    value: "26",
    unit: "COUNTRIES",
    variant: "white",
  },
  {
    label: "— PARTNERS",
    value: "71",
    unit: "ORIGINS",
    variant: "turquoise",
  },
  {
    label: "— NETWORK",
    value: "888",
    suffix: "+",
    unit: "SIGNATURE",
    variant: "copper",
  },
  {
    label: "— LANGUAGE",
    value: "17",
    unit: "SPOKEN",
    variant: "silver",
  },
];
