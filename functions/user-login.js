const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export async function onRequestPost({ env, request }) {
  try {
    const { discordName, code } = await request.json();

    if (!discordName || !code) {
      return new Response(JSON.stringify({ error: 'Missing name or code' }), { status: 400, headers: JSON_HEADERS });
    }

    // 1. Get code from KV
    const storedCode = await env.SHOP_USERS.get(`user:${discordName.toLowerCase()}`);

    // 2. Verify
    if (!storedCode || storedCode !== String(code)) {
      return new Response(JSON.stringify({ error: 'Invalid name or 6-digit code' }), { status: 401, headers: JSON_HEADERS });
    }

    const isAdmin = env.ADMIN_DISCORD && discordName.toLowerCase() === env.ADMIN_DISCORD.toLowerCase();

    return new Response(JSON.stringify({ success: true, isAdmin }), { status: 200, headers: JSON_HEADERS });
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
