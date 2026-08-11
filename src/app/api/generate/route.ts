export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { apiUrl, apiKey, body, provider } = data;

  if (!apiUrl || !apiKey || !body) {
    return Response.json({ error: 'Missing apiUrl, apiKey, or body' }, { status: 400 });
  }

  const allowedHosts = ['api.groq.com', 'api.deepseek.com', 'api.openai.com', 'api.anthropic.com', 'r.jina.ai'];
  try {
    const url = new URL(apiUrl);
    if (!allowedHosts.includes(url.hostname)) {
      return Response.json({ error: 'Host not allowed' }, { status: 403 });
    }
  } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (body.stream && response.ok) {
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const responseData = await response.text();
    return new Response(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Proxy error';
    return Response.json(
      { error: message },
      { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
