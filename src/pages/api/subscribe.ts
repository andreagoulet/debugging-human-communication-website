import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const AC_API_URL = import.meta.env.ACTIVECAMPAIGN_API_URL;
  const AC_API_KEY = import.meta.env.ACTIVECAMPAIGN_API_KEY;
  const AC_LIST_ID = import.meta.env.ACTIVECAMPAIGN_LIST_ID;

  if (!AC_API_URL || !AC_API_KEY || !AC_LIST_ID) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { email?: string; firstName?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const firstName = body.firstName?.trim() || "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: "Valid email is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const headers = {
    "Api-Token": AC_API_KEY,
    "Content-Type": "application/json",
  };

  try {
    // Create or update contact
    const syncRes = await fetch(`${AC_API_URL}/api/3/contact/sync`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contact: { email, firstName },
      }),
    });

    if (!syncRes.ok) {
      const err = await syncRes.text();
      console.error("AC contact sync failed:", syncRes.status, err);
      return new Response(
        JSON.stringify({ error: "Subscription failed" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const { contact } = await syncRes.json();

    // Add contact to workbook subscribers list
    const listRes = await fetch(`${AC_API_URL}/api/3/contactLists`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contactList: {
          list: AC_LIST_ID,
          contact: contact.id,
          status: 1,
        },
      }),
    });

    if (!listRes.ok) {
      const err = await listRes.text();
      console.error("AC list subscribe failed:", listRes.status, err);
      return new Response(
        JSON.stringify({ error: "Subscription failed" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("ActiveCampaign API error:", err);
    return new Response(
      JSON.stringify({ error: "Subscription failed" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
