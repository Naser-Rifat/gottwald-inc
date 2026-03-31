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

    // Extract a valid replyTo email from the string safely
    const replyToEmail = fields.email ? extractEmail(fields.email) : (fields.contact ? extractEmail(fields.contact) : undefined);

    // ─── Resend Implementation ────────────────────────────────────────────────
    
    const response = await sendVarificationEmail({
      type: type as "partnership" | "careers" | "contact",
      fields,
      replyToEmail,
      attachments
    });

    if (!response.success) {
      return NextResponse.json({ error: "Failed to send email via Resend." }, { status: 500 });
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
