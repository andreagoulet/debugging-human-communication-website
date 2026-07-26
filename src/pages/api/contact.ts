import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

// For now the contact form simply forwards to Andrea's inbox via Gmail SMTP.
// The original Pipedrive integration (Person + Lead + Note) lives in git
// history (94bf395) if we revive it later.
const CONTACT_TO = "andrea@andreagoulet.com";
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
// reCAPTCHA v3 returns a 0.0–1.0 score; 0.5 is Google's suggested default threshold.
const MIN_RECAPTCHA_SCORE = 0.5;

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // Names match the Vercel env vars exactly (case-sensitive). Read at runtime
  // from process.env on Vercel; fall back to import.meta.env for local dev.
  const RECAPTCHA_SECRET_KEY = process.env.reCAPTCHA_secret_key ?? import.meta.env.reCAPTCHA_secret_key;
  const SMTP_USER = process.env.CONTACT_SMTP_USER ?? import.meta.env.CONTACT_SMTP_USER;
  const SMTP_PASS = process.env.CONTACT_SMTP_PASS ?? import.meta.env.CONTACT_SMTP_PASS;

  if (!RECAPTCHA_SECRET_KEY || !SMTP_USER || !SMTP_PASS) {
    console.error("Contact form misconfigured: missing env vars", {
      recaptcha: !!RECAPTCHA_SECRET_KEY,
      smtpUser: !!SMTP_USER,
      smtpPass: !!SMTP_PASS,
    });
    return json({ error: "Server configuration error" }, 500);
  }

  let body: {
    name?: string;
    email?: string;
    message?: string;
    token?: string;
    company?: string;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  // Honeypot: the hidden "company" field is invisible to humans. If it's filled,
  // it's a bot — accept silently so the bot gets no signal, but send nothing.
  if (body.company) {
    return json({ success: true }, 200);
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim() || "";
  const message = body.message?.trim() || "";
  const token = body.token;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Valid email is required" }, 400);
  }
  if (!message) {
    return json({ error: "Please include a message" }, 400);
  }
  if (message.length > 5000) {
    return json({ error: "Message is too long" }, 400);
  }
  if (!token) {
    return json({ error: "Verification failed. Please try again." }, 400);
  }

  // 1. Verify the reCAPTCHA v3 token with Google.
  try {
    const verifyRes = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET_KEY, response: token }),
    });
    const verify: { success?: boolean; score?: number; action?: string } = await verifyRes.json();
    if (!verify.success || (typeof verify.score === "number" && verify.score < MIN_RECAPTCHA_SCORE)) {
      console.warn("reCAPTCHA rejected:", verify);
      return json({ error: "We couldn't verify you're human. Please try again." }, 400);
    }
  } catch (err) {
    console.error("reCAPTCHA verify error:", err);
    return json({ error: "Submission failed" }, 502);
  }

  // 2. Forward the message to Andrea's inbox. Reply-To is the visitor, so
  //    replying in Gmail goes straight back to them.
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Website Contact Form" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: name ? `"${name.replace(/"/g, "")}" <${email}>` : email,
      subject: `Website contact from ${name || email}`,
      text: `Name: ${name || "(not given)"}\nEmail: ${email}\n\n${message}`,
    });

    return json({ success: true }, 200);
  } catch (err) {
    console.error("Contact email send failed:", err);
    return json({ error: "Submission failed" }, 502);
  }
};
