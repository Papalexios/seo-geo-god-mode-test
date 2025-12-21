export const onRequestPost = async ({ request, env }) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  const apiKey = env.SERPER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'SERPER_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const body = await request.json();
    const { query, num = 10, type = 'search' } = body;
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'query required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const endpoint = type === 'news' ? 'news' : type === 'videos' ? 'videos' : 'search';
    const res = await fetch(`https://google.serper.dev/${endpoint}`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num })
    });
    
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
