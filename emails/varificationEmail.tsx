import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VarificationEmailProps {
  type: string;
  fields: Record<string, string>;
}

export const VarificationEmail = ({
  type = "contact",
  fields = {},
}: VarificationEmailProps) => {
  // ─── Human-Readable Field Labels ────────────────────────────────────
  const FIELD_LABELS: Record<string, string> = {
    // Partnership
    company: "Company Name",
    website: "Website",
    country: "Country / Region",
    contact: "Main Contact",
    partnership_type: "Partnership Type",
    pillars: "Relevant Pillars",
    description: "What They Do",
    capabilities: "Top Capabilities",
    proof: "Proof of Work",
    references: "References",
    capacity: "Capacity",
    budget: "Typical Project Range",
    values: "Values Fit",
    why: "Why GOTT WALD",
    constraints: "Constraints / Notes",
    nda: "NDA Ready",
    // Careers
    name: "Full Name",
    location: "Location",
    region: "Continent / Region",
    languages: "Languages",
    work_model: "Work Model",
    travel: "Travel Readiness",
    entry_path: "Entry Path",
    roles: "Pillars & Desired Roles",
    linkedin: "LinkedIn / Website",
    portfolio: "Portfolio / Proof Links",
    availability: "Availability",
    salary: "Salary / Day Rate",
    foundation: "Foundation Fit",
    // Contact
    subject: "Subject",
    email: "Email Address",
    organization: "Organization",
    message: "Message",
  };

  const getLabel = (key: string): string =>
    FIELD_LABELS[key] ||
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const formatValue = (key: string, value: string): string => {
    if (value === "on") return "✓ Yes";
    return value.trim();
  };

  const getTypeLabel = (docType: string): string => {
    if (docType === "partnership") return "PARTNERSHIP APPLICATION";
    if (docType === "careers") return "CAREER APPLICATION";
    return "WEBSITE INQUIRY";
  };

  const HIDDEN_FIELDS = ["subject"];
  const rows = Object.entries(fields)
    .filter(
      ([key, value]) =>
        value && value.trim() !== "" && !HIDDEN_FIELDS.includes(key)
    )
    .map(([key, value]) => {
      const label = getLabel(key);
      const formatted = formatValue(key, value);
      return { key, label, value: formatted };
    });

  const chunkedRows = [];
  for (let i = 0; i < rows.length; i += 2) {
    chunkedRows.push(rows.slice(i, i + 2));
  }

  return (
    <Html>
      <Head>
        <style>
          {`
            a, a:link, a:visited { color: #d4af37 !important; text-decoration: underline !important; }
          `}
        </style>
      </Head>
      <Preview>New {getTypeLabel(type)} — GOTT WALD</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Gold Accent Bar */}
          <Section style={goldBar}></Section>

          <Section style={contentSection}>
            {/* Header */}
            <Section style={headerSection}>
              <Text style={brandLabel}>GOTT WALD HOLDING</Text>
              <Text style={typeHeading}>{getTypeLabel(type)}</Text>
            </Section>

            {/* Divider */}
            <Hr style={divider} />

            {/* Field Data */}
            <Section style={dataSection}>
              {chunkedRows.map((chunk, chunkIndex) => (
                <Row key={chunkIndex} style={dataRow(chunkIndex === chunkedRows.length - 1)}>
                  {chunk.map((item, index) => (
                    <Column key={item.key} style={gridColumn(index === 0)}>
                      <Text style={fieldLabel}>{item.label}</Text>
                      <Text style={fieldValue}>{item.value}</Text>
                    </Column>
                  ))}
                  {/* If there's an odd number of items, insert an empty column to keep the width balanced */}
                  {chunk.length === 1 && <Column style={gridColumn(false)}></Column>}
                </Row>
              ))}
            </Section>

            {/* Footer */}
            <Section style={footer}>
              <Row>
                <Column style={footerLeft}>SECURE TRANSMISSION</Column>
                <Column style={footerRight}>
                  {new Date().toISOString().split("T")[0]}
                </Column>
              </Row>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VarificationEmail;

// ─── Styles ────────────────────────────────────────────────────────────────
const main = {
  backgroundColor: "#111111", // Dark outer wrapper for contrast
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  color: "#ffffff",
  margin: "0",
  padding: "40px 0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#000000",
  border: "1px solid #222222",
  borderRadius: "8px",
  overflow: "hidden", // Enforce rounded corners on the gold bar
};

const goldBar = {
  height: "4px",
  backgroundColor: "#d4af37", // Solid fallback for poor clients
  backgroundImage: "linear-gradient(90deg, #d4af37 0%, #b8962e 50%, #d4af37 100%)",
  width: "100%",
};

const contentSection = {
  padding: "40px 48px", // Generous inner breathing room
};

const headerSection = {
  marginTop: "0",
  marginBottom: "32px",
};

const brandLabel = {
  fontSize: "10px",
  letterSpacing: "0.35em",
  textTransform: "uppercase" as const,
  color: "#d4af37",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const typeHeading = {
  fontSize: "24px",
  fontWeight: "300",
  color: "#ffffff",
  letterSpacing: "-0.02em",
  margin: "0",
};

const divider = {
  borderColor: "#333333", // Solid, subtle grey line instead of gradient
  borderWidth: "1px 0 0 0",
  margin: "0 0 16px 0",
};

const dataSection = {
  width: "100%",
};

const dataRow = (isLast: boolean) => ({
  borderBottom: isLast ? "none" : "1px solid #1a1a1a",
});

const gridColumn = (isLeft: boolean) => ({
  width: "50%",
  padding: isLeft ? "16px 16px 16px 0" : "16px 0 16px 16px",
  verticalAlign: "top",
});

const fieldLabel = {
  color: "#d4af37",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  fontWeight: "600",
  margin: "0 0 6px 0", // Tight margin keeping it close to its value
};

const fieldValue = {
  color: "#f4f4f4",
  fontSize: "14px",
  lineHeight: "1.5",
  fontWeight: "300",
  margin: "0", // Zero margin
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  marginTop: "40px",
  paddingTop: "24px",
  borderTop: "1px solid #1a1a1a",
  width: "100%",
};

const footerLeft = {
  fontSize: "10px",
  color: "#555555",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  textAlign: "left" as const,
};

const footerRight = {
  fontSize: "10px",
  color: "#555555",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  textAlign: "right" as const,
};
