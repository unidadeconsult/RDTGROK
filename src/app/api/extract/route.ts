export async function POST(req: Request) {
  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { url } = data;
  if (!url || typeof url !== 'string') {
    return Response.json({ error: 'Missing url' }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl, {
      headers: {
        Accept: 'text/plain',
        'X-Return-Format': 'text',
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Failed to extract content (${response.status})` },
        { status: 502 }
      );
    }

    const text = await response.text();
    const trimmed = text.slice(0, 8000);

    return Response.json({ content: trimmed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Extraction error';
    return Response.json({ error: message }, { status: 502 });
  }
}
