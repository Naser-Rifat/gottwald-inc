import { resend } from "./index";
import VarificationEmail from "@/emails/varificationEmail";

interface SubmitterData {
  type: "partnership" | "careers" | "contact";
  fields: Record<string, string>;
  replyToEmail?: string;
  attachments?: {
    filename: string;
    content: Buffer;
  }[];
}

const getSubject = (type: string) => {
  if (type === "partnership") return "New Partnership Application — GOTT WALD";
  if (type === "careers") return "New Career Application — GOTT WALD";
  return "New Inquiry — GOTT WALD";
};

export const sendVarificationEmail = async ({
  type,
  fields,
  replyToEmail,
  attachments = [],
}: SubmitterData) => {
  try {
    // RESEND_FROM must be a verified domain on resend.com (e.g. noreply@gottwald.world)
    // Fallback is Resend's own test sender — works without domain verification
    const fromAddress =
      process.env.RESEND_FROM || "onboarding@resend.dev";
    const toAddress =
      process.env.RESEND_TO || process.env.SMTP_TO || "abunaserrifat971@gmail.com";

    const data = await resend.emails.send({
      from: `GOTT WALD <${fromAddress}>`,
      to: [toAddress],
      replyTo: replyToEmail,
      subject: getSubject(type),
      react: <VarificationEmail type={type} fields={fields} />,
      attachments: attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    return { success: true, data };
  } catch (error) {
    console.error("Resend API processing error:", error);
    return { success: false, error };
  }
};
