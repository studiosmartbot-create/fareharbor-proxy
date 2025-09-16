// Serverless endpoint for FareHarbor availability
export default async function handler(req, res) {
  try {
    const { item, date } = req.query;
    if (!item || !date) {
      return res.status(400).json({ error: "Missing ?item=ITEM_ID&date=YYYY-MM-DD" });
    }

    // TODO: replace this URL with the correct FareHarbor API path you use
    // Example pattern (placeholder) to illustrate structure:
    const shortname = process.env.FH_SHORTNAME;
    const apiKey    = process.env.FH_API_KEY;

    const url = `https://fareharbor.com/api/v1/companies/${shortname}/items/${item}/availabilities/?date=${date}`;

    const r = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-FareHarbor-API-Key": apiKey
      }
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(r.status).json({ error: "Upstream error", details: txt });
    }

    const data = await r.json();
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
