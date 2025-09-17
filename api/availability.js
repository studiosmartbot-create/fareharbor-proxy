// /api/availability.js

export default async function handler(req, res) {
  // Handle preflight quickly
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  try {
    const shortname = process.env.FH_SHORTNAME;
    const apiKey    = process.env.FH_API_KEY;

    if (!shortname || !apiKey) {
      return res.status(500).json({ error: "Server misconfigured: missing FH_SHORTNAME or FH_API_KEY" });
    }

    // 🔽 TEMP TEST — just hit the company endpoint
    const url = `https://fareharbor.com/api/v1/companies/${shortname}/`;
    const r = await fetch(url, {
      headers: { 
        "X-FareHarbor-API-Key": apiKey,
        Accept: "application/json"
      }
    });

    // Always include CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const text = await r.text();
    return res.status(r.status).send(text);
    // 🔼 END TEMP TEST

  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
