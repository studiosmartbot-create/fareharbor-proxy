// /api/availability.js
export default async function handler(req, res) {
  try {
    const { item, date } = req.query;

    if (!item || !date) {
      return res.status(400).json({ error: "Missing item or date" });
    }

    // Your FareHarbor shortname and API key from environment variables
    const shortname = process.env.FH_SHORTNAME;   // e.g. whitsundaystanduppaddle
    const apiKey = process.env.FH_API_KEY;

    // Build the API request
    const url = `https://fareharbor.com/api/external/v1/companies/${shortname}/items/${item}/availability/?date=${date}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
