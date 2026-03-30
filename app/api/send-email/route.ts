import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type FormType = "partnership" | "careers" | "contact";

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

// ─── Sanitization & Helpers ──────────────────────────────────────────
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

function extractEmail(text: string): string | undefined {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : undefined;
}

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

function getLabel(key: string): string {
  return FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function formatValue(key: string, value: string): string {
  // Checkbox fields send "on" — convert to readable
  if (value === "on") return "✓ Yes";
  return value.trim();
}

function getSubject(type: string): string {
  if (type === "partnership") return "New Partnership Application — GOTT WALD";
  if (type === "careers") return "New Career Application — GOTT WALD";
  return "New Inquiry — GOTT WALD";
}

function getTypeLabel(type: string): string {
  if (type === "partnership") return "PARTNERSHIP APPLICATION";
  if (type === "careers") return "CAREER APPLICATION";
  return "WEBSITE INQUIRY";
}

function buildHtml(type: string, fields: Record<string, string>): string {
  const rows = Object.entries(fields)
    .filter(([, value]) => value && value.trim() !== "")
    .map(([key, value]) => {
      const label = getLabel(key);
      const formatted = formatValue(key, value);
      return `
      <tr>
        <td style="padding: 20px 0; border-bottom: 1px solid #1a1a1a; vertical-align: top; text-align: left;">
          <div style="color: #d4af37; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; margin-bottom: 6px;">${sanitize(label)}</div>
          <div style="color: #e8e8e8; font-size: 15px; line-height: 1.6; font-weight: 300;">${linkifyAndSanitize(formatted)}</div>
        </td>
      </tr>`;
    }).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    a, a:link, a:visited { color: #d4af37 !important; text-decoration: underline !important; }
  </style>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 0;">

    <!-- Gold Accent Bar -->
    <div style="height: 3px; background: linear-gradient(90deg, #d4af37 0%, #b8962e 50%, #d4af37 100%);"></div>

    <div style="padding: 48px 32px;">

      <!-- Header -->
      <table style="width: 100%; margin-bottom: 40px;">
        <tr>
          <td>
            <div style="font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #d4af37; font-weight: 600; margin-bottom: 10px;">GOTT WALD HOLDING</div>
            <div style="font-size: 26px; font-weight: 200; color: #ffffff; letter-spacing: -0.02em;">${getTypeLabel(type)}</div>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <div style="height: 1px; background: linear-gradient(90deg, #d4af37, transparent); margin-bottom: 8px;"></div>

      <!-- Field Data -->
      <table style="width: 100%; border-collapse: collapse;">
        ${rows}
      </table>

      <!-- Footer -->
      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #1a1a1a;">
        <table style="width: 100%;">
          <tr>
            <td style="font-size: 10px; color: #444; letter-spacing: 0.1em; text-transform: uppercase;">
              SECURE TRANSMISSION
            </td>
            <td style="font-size: 10px; color: #444; letter-spacing: 0.1em; text-transform: uppercase; text-align: right;">
              ${new Date().toISOString().split("T")[0]}
            </td>
          </tr>
        </table>
      </div>

    </div>
  </div>
</body>
</html>`;
}

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

    // Extract a valid replyTo email from the string safely
    const replyToEmail = fields.email ? extractEmail(fields.email) : (fields.contact ? extractEmail(fields.contact) : undefined);

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
  } catch (error) {
    console.error("Email API processing error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
