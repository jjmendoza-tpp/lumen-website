import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;

  if (!portalId || !formId) {
    console.error("HubSpot env vars missing");
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const fields = [
    { name: "firstname", value: body.firstname ?? "" },
    { name: "company", value: body.company ?? "" },
    { name: "jobtitle", value: body.jobtitle ?? "" },
    { name: "email", value: body.email ?? "" },
    { name: "phone", value: body.phone ?? "" },
    { name: "message", value: body.message ?? "" },
  ].filter((f) => f.value.trim() !== "");

  const payload = {
    fields,
    context: {
      pageUri: "ailumen.app",
      pageName: "Lumen Website — Solicitud Demo",
    },
  };

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("HubSpot API error:", res.status, err);
      // Return HubSpot's error detail so we can debug from the browser
      return NextResponse.json(
        { ok: false, error: "hubspot_error", detail: err, status: res.status },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("HubSpot fetch error:", err);
    return NextResponse.json({ ok: false, error: "network" }, { status: 500 });
  }
}
