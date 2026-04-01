export async function onRequestPost({ env, request }) {
  try {
    const order = await request.json();
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();

    // Save to Cloudflare KV — simple key/value, no external API needed
    await env.ARK_ORDERS.put(`order:${id}`, JSON.stringify(order));

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    console.error('save-order error:', e.message);
    return new Response(JSON.stringify({ error: e.message || 'Failed to save order' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
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
