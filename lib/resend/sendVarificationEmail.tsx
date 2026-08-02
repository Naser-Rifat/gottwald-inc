import { getResendClient } from "./index";
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
      process.env.RESEND_FROM || "";
    const toAddress =
      process.env.RESEND_TO || "";

    const { data, error } = await getResendClient().emails.send({
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

    // resend.emails.send() does NOT throw for API-level rejections (invalid
    // from address, unverified domain, bad API key, quota exceeded) — those
    // resolve normally as { data: null, error: {...} }. Without this check,
    // every one of those failure modes was silently reported as success to
    // the caller, which is exactly what made "email delivery" unverifiable
    // in the 2026-07-16 audit (Resend accepted the request, but nothing
    // confirmed the message actually left Resend's servers).
    if (error) {
      console.error("Resend API rejected the send:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Resend API processing error:", error);
    return { success: false, error };
  }
};
