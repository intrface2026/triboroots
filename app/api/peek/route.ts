import { NextResponse } from "next/server";
import { PEEK_COOKIE_NAME, signPeekToken } from "@/lib/peekAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface PeekPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  plan?: unknown;
  offersOptIn?: unknown;
  locale?: unknown;
}

export async function POST(request: Request) {
  let body: PeekPayload;
  try {
    body = (await request.json()) as PeekPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email =
    typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
  const phone =
    typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const plan =
    typeof body.plan === "string" ? body.plan.trim().slice(0, 120) : "";
  const offersOptIn = body.offersOptIn !== false;
  const locale = body.locale === "hi" ? "hi" : "en";

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone number are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const recipient = process.env.PEEK_RECIPIENT_EMAIL || "teams@intrface.in";
  const fromAddress =
    process.env.NOREPLY_FROM_EMAIL || "TriboRoots <noreply@triboroots.com>";
  const resendApiKey = process.env.RESEND_API_KEY;
  const submittedAt = new Date().toISOString();

  const subject = `[TriboRoots Sneak Peek] New visitor lead: ${name}`;
  const textContent = [
    "New TriboRoots Sneak-Peek Visitor",
    "----------------------------------",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone / WhatsApp: ${phone}`,
    `Trip Vibe: ${plan || "Not specified"}`,
    `Wants Hostel Offers: ${offersOptIn ? "Yes" : "No"}`,
    `Language: ${locale.toUpperCase()}`,
    `Submitted At: ${submittedAt}`,
    "",
    "(Automated no-reply notification from triboroots.com)",
  ].join("\n");

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0e9d7; color: #2c1d14; padding: 24px; border-radius: 14px; border: 1px solid #d86a34;">
      <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #b85222; font-weight: 700;">
        TriboRoots Hostel • No-Reply Lead Alert
      </p>
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #2c1d14;">
        New Visitor Unlocked the Sneak Peek
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; font-weight: 700; width: 150px;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Phone / WhatsApp</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Trip Vibe</td><td>${escapeHtml(plan || "Not specified")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Early Offers Opt-in</td><td>${offersOptIn ? "Yes" : "No"}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Locale</td><td>${locale.toUpperCase()}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Timestamp (UTC)</td><td>${submittedAt}</td></tr>
      </table>
      <p style="margin: 18px 0 0; font-size: 12px; color: rgba(44,29,20,0.68);">
        Sent via noreply from TriboRoots preview gate. Do not reply directly to this automated message.
      </p>
    </div>
  `;

  if (resendApiKey) {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        subject,
        text: textContent,
        html: htmlContent,
        headers: {
          "Auto-Submitted": "auto-generated",
          "X-Auto-Response-Suppress": "All",
        },
      }),
    });

    if (!emailRes.ok) {
      const details = await emailRes.text().catch(() => "");
      console.error("[/api/peek] Email provider error:", emailRes.status, details);
      return NextResponse.json(
        { error: "Unable to record your request right now. Please try again." },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error(
      "[/api/peek] RESEND_API_KEY is missing in production; cannot deliver noreply lead email to",
      recipient,
    );
    return NextResponse.json(
      {
        error:
          "Preview registration email relay is not configured yet. Please set RESEND_API_KEY.",
      },
      { status: 503 },
    );
  } else {
    console.info(
      `[/api/peek dev preview] Would send noreply email\nFrom: ${fromAddress}\nTo: ${recipient}\n${textContent}`,
    );
  }

  const token = signPeekToken(email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PEEK_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

