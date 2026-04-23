import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SubmitterAcknowledgementProps {
  type: "partnership" | "careers" | "contact";
  /** Optional — personalises the opening line if the sender provided a name */
  senderName?: string;
}

const TYPE_META: Record<
  SubmitterAcknowledgementProps["type"],
  { heading: string; body: string; followUp: string }
> = {
  partnership: {
    heading: "Your partnership application has been received.",
    body: "Your submission has been logged for review by the GOTT WALD partnership desk. Applications are evaluated against our standards of delivery, values alignment, and ecosystem fit — not on response time.",
    followUp:
      "If your application aligns with a current or upcoming initiative, a member of the partnership desk will reach out directly. Submissions we are not actively engaging are archived for future rounds.",
  },
  careers: {
    heading: "Your application has been received.",
    body: "Your application has been logged for review. GOTT WALD recruits across nine structural pillars — each evaluation is handled by the pillar closest to the role you applied for.",
    followUp:
      "If there is a fit with an active search, a member of the pillar team will be in touch. Other applications are retained for future openings.",
  },
  contact: {
    heading: "Your message has been received.",
    body: "Your inquiry has been logged and will be reviewed by the relevant desk at GOTT WALD Holding.",
    followUp:
      "If your inquiry calls for a direct response, a member of the team will be in touch. For time-sensitive matters, you can reach us at office@gottwald.world or +995 591 086 578.",
  },
};

export const SubmitterAcknowledgement = ({
  type = "contact",
  senderName,
}: SubmitterAcknowledgementProps) => {
  const meta = TYPE_META[type];
  const greeting = senderName?.trim()
    ? `Hello ${senderName.trim().split(/\s+/)[0]},`
    : "Hello,";

  return (
    <Html>
      <Head>
        <style>
          {`
            a, a:link, a:visited { color: #d4af37 !important; text-decoration: underline !important; }
          `}
        </style>
      </Head>
      <Preview>{meta.heading}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={goldBar}></Section>

          <Section style={contentSection}>
            <Section style={headerSection}>
              <Text style={brandLabel}>GOTT WALD HOLDING</Text>
              <Text style={typeHeading}>{meta.heading}</Text>
            </Section>

            <Hr style={divider} />

            <Section>
              <Text style={greetingStyle}>{greeting}</Text>
              <Text style={bodyText}>{meta.body}</Text>
              <Text style={bodyText}>{meta.followUp}</Text>
              <Text style={signoff}>— GOTT WALD Holding LLC</Text>
            </Section>

            <Section style={footer}>
              <Text style={footerLine}>
                This is an automated confirmation. Please do not reply to this
                message. For direct correspondence, write to{" "}
                <a href="mailto:office@gottwald.world">office@gottwald.world</a>.
              </Text>
              <Text style={footerMeta}>
                GOTT WALD Holding LLC · Tbilisi, Georgia ·{" "}
                {new Date().toISOString().split("T")[0]}
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SubmitterAcknowledgement;

const main = {
  backgroundColor: "#111111",
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
  overflow: "hidden",
};

const goldBar = {
  height: "4px",
  backgroundColor: "#d4af37",
  backgroundImage:
    "linear-gradient(90deg, #d4af37 0%, #b8962e 50%, #d4af37 100%)",
  width: "100%",
};

const contentSection = {
  padding: "40px 48px",
};

const headerSection = {
  marginTop: "0",
  marginBottom: "24px",
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
  fontSize: "22px",
  fontWeight: "300",
  color: "#ffffff",
  letterSpacing: "-0.02em",
  lineHeight: "1.3",
  margin: "0",
};

const divider = {
  borderColor: "#333333",
  borderWidth: "1px 0 0 0",
  margin: "0 0 24px 0",
};

const greetingStyle = {
  color: "#f4f4f4",
  fontSize: "15px",
  fontWeight: "400",
  margin: "0 0 18px 0",
};

const bodyText = {
  color: "#cccccc",
  fontSize: "14px",
  lineHeight: "1.7",
  fontWeight: "300",
  margin: "0 0 16px 0",
};

const signoff = {
  color: "#f4f4f4",
  fontSize: "14px",
  fontWeight: "400",
  marginTop: "28px",
  marginBottom: "0",
};

const footer = {
  marginTop: "40px",
  paddingTop: "24px",
  borderTop: "1px solid #1a1a1a",
};

const footerLine = {
  color: "#888888",
  fontSize: "11px",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const footerMeta = {
  color: "#555555",
  fontSize: "10px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  margin: "0",
};
