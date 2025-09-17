export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  try {
    const { item, date } = req.query;
    if (!item || !date) {
      return res.status(400).json({ error: "Missing required query params: item, date (YYYY-MM-DD)" });
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
        "Accept": "application/json"
      }
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const text = await r.text();                 // read body once
    if (!r.ok) {
      return res.status(r.status).json({
        error: "FareHarbor error",
        status: r.status,
        detail: text
      });
    }

    return res.status(200).send(text);           // already JSON
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
