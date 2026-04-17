const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const OPTIONS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

export async function onRequestPost({ env, request }) {
  try {
    const { orderId } = await request.json();
    if (!orderId) return jsonResponse({ error: 'Order ID required' }, 400);

    const key = `order:${orderId}`;
    const existing = await env.SHOP_ORDERS.get(key);
    if (!existing) return jsonResponse({ error: 'Order not found' }, 404);

    const order = JSON.parse(existing);
    
    // 1. Fetch the latest shop items to get current Blueprint paths
    const itemsRaw = await env.SHOP_ITEMS.get('shop:items');
    const shopItems = itemsRaw ? JSON.parse(itemsRaw) : [];

    // 2. Attach Blueprint paths to the order items for the bot
    const hydratedItems = order.items.map(entry => {
      const shopItem = shopItems.find(si => si.id === entry.id);
      return {
        ...entry,
        name: shopItem ? shopItem.name : 'Unknown',
        bp: shopItem ? shopItem.bp : null
      };
    });

    // 3. Update order with status 'queued' and hydrated items
    order.status = 'queued';
    order.items = hydratedItems;
    order.queuedAt = new Date().toISOString();

    await env.SHOP_ORDERS.put(key, JSON.stringify(order));

    return jsonResponse({ ok: true, status: 'queued' });

  } catch (e) {
    return jsonResponse({ error: e.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: OPTIONS_HEADERS });
}
