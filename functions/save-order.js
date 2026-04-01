const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const OPTIONS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

async function createOrderId(namespace) {
  for (let i = 0; i < 5; i++) {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
    const existing = await namespace.get(`order:${id}`);
    if (!existing) return id;
  }
  throw new Error('Could not create a unique order ID');
}

export async function onRequestPost({ env, request }) {
  try {
    const rawOrder = await request.json();

    const order = {
      characterName: String(rawOrder.characterName || '').trim(),
      psnUsername: String(rawOrder.psnUsername || '').trim(),
      discordUsername: String(rawOrder.discordUsername || '').trim(),
      timestamp: rawOrder.timestamp || new Date().toISOString(),
      items: Array.isArray(rawOrder.items)
        ? rawOrder.items
            .map(item => ({
              id: String(item?.id || '').trim(),
              qty: Math.floor(Number(item?.qty || 0))
            }))
            .filter(item => item.id && item.qty > 0)
        : []
    };

    if (!order.characterName || !order.psnUsername || !order.discordUsername || order.items.length === 0) {
      return jsonResponse({ error: 'Missing required order fields' }, 400);
    }

    const id = await createOrderId(env.SHOP_ORDERS);

    await env.SHOP_ORDERS.put(`order:${id}`, JSON.stringify(order));

    return jsonResponse({ id }, 200);
  } catch (e) {
    console.error('save-order error:', e.message);
    return jsonResponse({ error: e.message || 'Failed to save order' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: OPTIONS_HEADERS
  });
}
