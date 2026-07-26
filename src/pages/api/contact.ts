import type { APIRoute } from "astro";

export const prerender = false;

const PIPEDRIVE_BASE = "https://api.pipedrive.com/v1";
// Same "webform" lead label as /api/lead; the lead title marks these as contact-form messages.
const LEAD_LABEL_ID = "3041fd30-7bc9-11f1-b64c-b3729d261594";
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
// reCAPTCHA v3 returns a 0.0–1.0 score; 0.5 is Google's suggested default threshold.
const MIN_RECAPTCHA_SCORE = 0.5;

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const POST: APIRoute = async ({ request }) => {
  // Names match the Vercel env vars exactly (case-sensitive). Read at runtime
  // from process.env on Vercel; fall back to import.meta.env for local dev.
  const PIPEDRIVE_API_TOKEN = process.env.Pipedrive_API ?? import.meta.env.Pipedrive_API;
  const RECAPTCHA_SECRET_KEY = process.env.reCAPTCHA_secret_key ?? import.meta.env.reCAPTCHA_secret_key;

  if (!PIPEDRIVE_API_TOKEN || !RECAPTCHA_SECRET_KEY) {
    return json({ error: "Server configuration error" }, 500);
  }

  let body: {
    name?: string;
    email?: string;
    topic?: string;
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
  // it's a bot — accept silently so the bot gets no signal, but create nothing.
  if (body.company) {
    return json({ success: true }, 200);
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim() || "";
  const topic = body.topic?.trim() || "";
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

  // 2. Create the Pipedrive Person, then a Lead, then attach the message as a
  //    Note on the lead so the full text is readable in the Leads Inbox.
  try {
    const personRes = await fetch(`${PIPEDRIVE_BASE}/persons?api_token=${PIPEDRIVE_API_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || email,
        email: [{ value: email, primary: true, label: "work" }],
      }),
    });
    if (!personRes.ok) {
      console.error("Pipedrive person create failed:", personRes.status, await personRes.text());
      return json({ error: "Submission failed" }, 502);
    }
    const person: { data?: { id?: number } } = await personRes.json();
    const personId = person?.data?.id;

    const leadRes = await fetch(`${PIPEDRIVE_BASE}/leads?api_token=${PIPEDRIVE_API_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${name || email} — website contact`,
        person_id: personId,
        label_ids: [LEAD_LABEL_ID],
      }),
    });
    if (!leadRes.ok) {
      console.error("Pipedrive lead create failed:", leadRes.status, await leadRes.text());
      return json({ error: "Submission failed" }, 502);
    }
    const lead: { data?: { id?: string } } = await leadRes.json();
    const leadId = lead?.data?.id;

    const noteContent = [
      topic ? `<p><b>Topic:</b> ${escapeHtml(topic)}</p>` : "",
      `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    ].join("");

    const noteRes = await fetch(`${PIPEDRIVE_BASE}/notes?api_token=${PIPEDRIVE_API_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteContent, lead_id: leadId }),
    });
    if (!noteRes.ok) {
      // The lead exists; losing the note is bad but not worth failing the user over.
      console.error("Pipedrive note create failed:", noteRes.status, await noteRes.text());
    }

    return json({ success: true }, 200);
  } catch (err) {
    console.error("Pipedrive API error:", err);
    return json({ error: "Submission failed" }, 502);
  }
};
