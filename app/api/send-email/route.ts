import { NextRequest, NextResponse } from "next/server";
// import nodemailer from "nodemailer";

// type FormType = "partnership" | "careers" | "contact";

// ─── Rate Limiting (simple in-memory) ───────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

/* ─── LEGACY HTML BUILDERS ────────────────────────────────────
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function linkifyAndSanitize(text: string): string {
  const sanitized = sanitize(text);
  // Auto-link URLs and aggressively enforce the Gold color inline to defeat email client defaults (like Gmail's blue links)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return sanitized.replace(urlRegex, '<a href="$1" style="color: #d4af37 !important; text-decoration: underline;">$1</a>');
}
*/

function extractEmail(text: string): string | undefined {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : undefined;
}

/**
 * Strict email validator — matches the ENTIRE input against a
 * conservative RFC 5322 subset. Independent audit (2026-07-16)
 * found the previous flow accepted syntactically invalid addresses
 * (e.g. `not-an-email`) with HTTP 200 because it relied on the
 * browser's built-in `type=email` check. Server-side enforcement
 * is now mandatory.
 */
const EMAIL_STRICT_RE =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isValidEmail(input: string | undefined): input is string {
  if (!input) return false;
  const trimmed = input.trim();
  // RFC 5321: local-part ≤ 64, domain ≤ 255, total ≤ 254 in practice
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  return EMAIL_STRICT_RE.test(trimmed);
}

// Per-field length caps — enforced server-side so the form can't be
// abused to fill Resend logs or mailbox with megabytes of text.
// Audit rating: "Maximum text lengths — 1/10, No effective server-side
// limits found." These caps are generous but prevent abuse.
const FIELD_LIMITS: Record<string, number> = {
  name: 120,
  contact: 254,
  email: 254,
  organization: 200,
  company: 200,
  website: 500,
  country: 100,
  message: 5000,
  values_fit: 3000,
  why_gott_wald: 3000,
  proof: 2000,
  references: 2000,
  capabilities: 2000,
  capacity: 500,
  project_range: 500,
  partnership_type: 100,
  pillars: 300,
  nda_readiness: 100,
  position: 200,
};

/** Fields REQUIRED per form type. Additional fields are optional. */
const REQUIRED_FIELDS: Record<string, string[]> = {
  contact: ["name", "email", "message"],
  partnership: ["name", "email", "company"],
  careers: ["name", "email"],
};

interface ValidationError {
  field: string;
  reason: string;
}

/**
 * Validate an incoming form submission. Returns list of problems; empty
 * list means the submission is safe to forward to Resend.
 */
function validateSubmission(
  type: string,
  fields: Record<string, string>,
): ValidationError[] {
  const errors: ValidationError[] = [];

  // 1. Required-field check (per form type). Unknown types fall back to
  //    the contact form requirements as a safe default.
  const required = REQUIRED_FIELDS[type] ?? REQUIRED_FIELDS.contact;
  for (const key of required) {
    const val = fields[key]?.trim();
    if (!val) errors.push({ field: key, reason: "required" });
  }

  // 2. Email format check. If a canonical `email` field is present it
  //    must parse as a valid address. The legacy `contact` field can
  //    hold either an email or a phone number — only reject if it looks
  //    like a bad email attempt (contains @ but doesn't parse).
  if (fields.email !== undefined && !isValidEmail(fields.email)) {
    errors.push({ field: "email", reason: "invalid_format" });
  }
  if (
    fields.contact !== undefined &&
    fields.contact.includes("@") &&
    !isValidEmail(fields.contact)
  ) {
    errors.push({ field: "contact", reason: "invalid_format" });
  }

  // 3. Per-field length caps (defense against payload abuse).
  for (const [key, value] of Object.entries(fields)) {
    const cap = FIELD_LIMITS[key];
    if (cap && value.length > cap) {
      errors.push({ field: key, reason: `too_long_max_${cap}` });
    }
  }

  return errors;
}

/* ─── LEGACY HTML BUILDERS ────────────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  // Partnership
  company: "Company Name",
  website: "Website",
...
}

function getLabel(...) ...
function formatValue(...) ...
function getSubject(...) ...
function getTypeLabel(...) ...

function buildHtml(type: string, fields: Record<string, string>): string {
...
}
───────────────────────────────────────────────────────────────── */

import { sendVarificationEmail } from "@/lib/resend/sendVarificationEmail";
import { sendAcknowledgementEmail } from "@/lib/resend/sendAcknowledgement";

// ─── POST Handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
    }

    // 2. Parse FormData (supports file uploads out of the box)
    const formData = await req.formData();
    const type = formData.get("type")?.toString() || "contact";

    // Honeypot: a hidden `company_fax` field lives in each form. Humans never
    // see it; blind form-filling bots populate it. Return a fake 200 so the
    // bot records the submission as successful and doesn't retry under a new
    // signature.
    const honeypot = formData.get("company_fax")?.toString();
    if (honeypot && honeypot.trim().length > 0) {
      console.warn("[send-email] honeypot triggered", { ip, type, value: honeypot.slice(0, 64) });
      return NextResponse.json({ success: true });
    }

    const fields: Record<string, string> = {};
    interface Attachment {
      filename: string;
      content: Buffer;
      contentType: string;
    }
    const attachments: Attachment[] = [];

    // Separate text fields from file fields
    for (const [key, value] of formData.entries()) {
      if (key === "type") continue;
      
      if (value instanceof File) {
        if (value.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
        }
        if (value.size > 0 && value.name !== "undefined") {
          const buffer = Buffer.from(await value.arrayBuffer());
          attachments.push({
            filename: value.name,
            content: buffer,
            contentType: value.type
          });
        }
      } else {
        fields[key] = value.toString();
      }
    }

    if (Object.keys(fields).length === 0 && attachments.length === 0) {
      return NextResponse.json({ error: "No form data provided." }, { status: 400 });
    }

    // ─── Server-side validation ─────────────────────────────────────────────
    // The client (browser) MAY validate with `required` + `type=email`, but
    // those are trivially bypassable via curl / disabled JS / crafted POST.
    // The audit dated 2026-07-16 flagged this exact bypass: a request with
    // `email=not-an-email` was previously accepted with HTTP 200. Every
    // submission is now re-validated here before it can reach Resend.
    const validationErrors = validateSubmission(type, fields);
    if (validationErrors.length > 0) {
      console.warn("[send-email] validation rejected", { ip, type, errors: validationErrors });
      return NextResponse.json(
        {
          error: "Please check the form and try again.",
          fields: validationErrors,
        },
        { status: 400 },
      );
    }

    // Extract a valid replyTo email from the string safely
    const replyToEmail = fields.email ? extractEmail(fields.email) : (fields.contact ? extractEmail(fields.contact) : undefined);

    // ─── Resend Implementation ────────────────────────────────────────────────

    const formType = type as "partnership" | "careers" | "contact";

    const response = await sendVarificationEmail({
      type: formType,
      fields,
      replyToEmail,
      attachments
    });

    if (!response.success) {
      return NextResponse.json({ error: "Failed to send email via Resend." }, { status: 500 });
    }

    // Best-effort auto-acknowledgement to the submitter. If it fails (invalid
    // address, Resend outage), the submission is still successful — the office
    // has already received the primary notification above.
    if (replyToEmail) {
      const senderName = fields.name || fields.contact;
      sendAcknowledgementEmail({
        type: formType,
        toEmail: replyToEmail,
        senderName,
      }).catch((err) => {
        console.error("[send-email] acknowledgement dispatch rejected:", err);
      });
    }

    return NextResponse.json({ success: true, data: response });

    /* ─── LEGACY NODEMAILER CODE COMMENTED OUT ───────────────────────────────
    
    if (!process.env.SMTP_PASS) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
    }

    // 3. Lazy initializing transporter (ensures fresh env vars)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });

    // 4. Send Email
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || "";
    await transporter.sendMail({
      from: { name: "GOTT WALD", address: fromAddress },
      to: process.env.SMTP_TO || "office@gottwald.world",
      replyTo: replyToEmail,
      subject: getSubject(type as FormType),
      html: buildHtml(type, fields),
      attachments: attachments.length > 0 ? attachments : undefined
    });

    return NextResponse.json({ success: true });
    ───────────────────────────────────────────────────────────────────────── */

  } catch (error) {
    console.error("Email API processing error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
