const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export async function onRequestPost({ env, request }) {
  try {
    // 1. Verify Bot API Key for security (You will set this in Cloudflare ENV)
    const authHeader = request.headers.get('Authorization');
    if (!env.BOT_API_KEY || authHeader !== `Bearer ${env.BOT_API_KEY}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: JSON_HEADERS });
    }

    const { discordName, code } = await request.json();

    if (!discordName || !code) {
      return new Response(JSON.stringify({ error: 'Missing discordName or code' }), { status: 400, headers: JSON_HEADERS });
    }

    // 2. Store in KV (Binding must be SHOP_USERS)
    await env.SHOP_USERS.put(`user:${discordName.toLowerCase()}`, String(code));

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: JSON_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: JSON_HEADERS });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
