export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { apiUrl, apiKey, body } = req.body;

  if (!apiUrl || !apiKey || !body) {
    return res.status(400).json({ error: 'Missing apiUrl, apiKey, or body' });
  }

  const allowedHosts = [
    'api.groq.com',
    'api.deepseek.com',
    'api.openai.com'
  ];

  try {
    const url = new URL(apiUrl);
    if (!allowedHosts.includes(url.hostname)) {
      return res.status(403).json({ error: 'Host not allowed' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/event-stream') || body.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } catch (e) {
        // Stream interrupted
      }
      return res.end();
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Proxy error' });
  }
}
