import { resend } from "./index";
import SubmitterAcknowledgement from "@/emails/submitterAcknowledgement";

interface AcknowledgementInput {
  type: "partnership" | "careers" | "contact";
  /** Resolved email address of the person who submitted the form */
  toEmail: string;
  /** Optional — personalises the opening line */
  senderName?: string;
}

const SUBJECTS: Record<AcknowledgementInput["type"], string> = {
  partnership: "Your partnership application — GOTT WALD",
  careers: "Your application — GOTT WALD",
  contact: "We've received your message — GOTT WALD",
};

/**
 * Best-effort auto-acknowledgement to the form submitter.
 *
 * Never throws — callers can fire-and-forget. The primary office-notification
 * email is the source of truth; if the acknowledgement fails (invalid sender
 * email, Resend outage, rate limit), the submission is still considered
 * successful and we only log the failure.
 */
export const sendAcknowledgementEmail = async ({
  type,
  toEmail,
  senderName,
}: AcknowledgementInput): Promise<{ success: boolean; error?: unknown }> => {
  try {
    const fromAddress = process.env.RESEND_FROM;
    if (!fromAddress) {
      return { success: false, error: "RESEND_FROM is not configured" };
    }
    if (!toEmail) {
      return { success: false, error: "No submitter email to acknowledge" };
    }

    const data = await resend.emails.send({
      from: `GOTT WALD <${fromAddress}>`,
      to: [toEmail],
      // Replies to this auto-ack go to the real inbox, not a noreply black hole.
      replyTo: "office@gottwald.world",
      subject: SUBJECTS[type],
      react: SubmitterAcknowledgement({ type, senderName }),
    });

    return { success: true, ...(data ? {} : {}) };
  } catch (error) {
    console.error("[sendAcknowledgement] failed:", error);
    return { success: false, error };
  }
};
