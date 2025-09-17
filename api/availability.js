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
    const { item, date } = req.query;
    if (!item || !date) {
      return res.status(400).json({ error: "Missing required query params: item, date" });
    }

    const shortname = process.env.FH_SHORTNAME;
    const apiKey    = process.env.FH_API_KEY;
    if (!shortname || !apiKey) {
      return res.status(500).json({ error: "Server misconfigured: missing FH_SHORTNAME or FH_API_KEY" });
    }

    const url = `https://fareharbor.com/api/v1/companies/${shortname}/calendar/availability/?item=${item}&start_date=${date}&end_date=${date}`;
    const r = await fetch(url, {
      headers: {
        "X-FareHarbor-API-Key": apiKey,
        Accept: "application/json",
      },
    });

    // CORS headers on every response
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({
        error: "FareHarbor error",
        status: r.status,
        detail: text,
      });
    }

    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
