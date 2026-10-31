export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const required = ["name", "company", "email", "phone", "location", "type", "budget", "challenge"];
  const missing = required.find((key) => !String(body[key] || "").trim());
  if (missing) return res.status(400).json({ ok: false, error: "Please complete all required fields." });

  const payload = new URLSearchParams({
    _subject: "New Free Property Lead Audit — JustDigital.Clicks",
    _template: "table",
    _captcha: "false",
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone,
    location: body.location,
    business_type: body.type,
    project: body.project || "Not provided",
    monthly_budget: body.budget,
    challenge: body.challenge,
  });

  try {
    const response = await fetch("https://formsubmit.co/ajax/hello@justdigital.clicks", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: payload.toString(),
    });
    if (!response.ok) {
      console.error("FormSubmit error", response.status, await response.text());
      return res.status(502).json({ ok: false, error: "We could not send the request. Please try again." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Lead audit notification error", error);
    return res.status(502).json({ ok: false, error: "We could not send the request. Please try again." });
  }
}
