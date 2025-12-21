export const onRequestPost = async ({ request, env }) => {
  const wpSiteUrl = env.WP_SITE_URL;
  const wpUser = env.WP_USERNAME;
  const wpPass = env.WP_APP_PASSWORD;
  
  if (!wpSiteUrl || !wpUser || !wpPass) {
    return new Response(JSON.stringify({ error: 'WordPress not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const body = await request.json();
    const { title, content, slug, status = 'draft' } = body;
    
    const base = wpSiteUrl.replace(/\/+$/, '');
    const url = `${base}/wp-json/wp/v2/posts`;
    const auth = btoa(`${wpUser}:${wpPass}`);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, slug, status })
    });
    
    const data = await res.json();
    return new Response(JSON.stringify({ ok: res.ok, post: data }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
