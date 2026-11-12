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
  note?: unknown;
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
  const note =
    typeof body.note === "string" ? body.note.trim().slice(0, 280) : "";
  const locale = body.locale === "hi" ? "hi" : "en";

  if (!name || !email || !phone || !note) {
    return NextResponse.json(
      { error: "Please fill in all fields before stepping inside." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look quite right." },
      { status: 400 },
    );
  }

  const recipient = process.env.PEEK_RECIPIENT_EMAIL || "teams@intrface.in";
  const fromAddress =
    process.env.NOREPLY_FROM_EMAIL || "TriboRoots <noreply@triboroots.com>";
  const resendApiKey = process.env.RESEND_API_KEY;
  const submittedAt = new Date().toISOString();

  const subject = `[TriboRoots] Visitor knock: ${name}`;
  const textContent = [
    "TriboRoots Sneak-Peek Visitor",
    "-----------------------------",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone / WhatsApp: ${phone}`,
    `Note: ${note}`,
    `Language: ${locale.toUpperCase()}`,
    `Submitted At: ${submittedAt}`,
    "",
    "(Automated no-reply notification from triboroots.com)",
  ].join("\n");

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0e9d7; color: #2c1d14; padding: 24px; border-radius: 14px; border: 1px solid #d86a34;">
      <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #b85222; font-weight: 700;">
        TriboRoots • No-Reply Lead Alert
      </p>
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #2c1d14;">
        ${escapeHtml(name)} unlocked the preview
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; font-weight: 700; width: 140px;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Phone</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Brings them here</td><td>${escapeHtml(note)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Language</td><td>${locale.toUpperCase()}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 700;">Time (UTC)</td><td>${submittedAt}</td></tr>
      </table>
    </div>
  `;

  if (resendApiKey) {
    try {
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
        console.error(
          "[/api/peek] Email provider responded with error:",
          emailRes.status,
          details,
        );
      }
    } catch (err) {
      console.error("[/api/peek] Email dispatch error:", err);
    }
  } else {
    console.info(
      `[/api/peek trial pass] From: ${fromAddress} | To: ${recipient}\n${textContent}`,
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
