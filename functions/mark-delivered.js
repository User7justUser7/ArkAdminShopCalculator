const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export async function onRequestPost({ env, request }) {
  try {
    const { orderId, status, deliveryMessage } = await request.json();
    if (!orderId) return new Response('Missing ID', { status: 400 });

    const key = `order:${orderId}`;
    const existing = await env.SHOP_ORDERS.get(key);
    if (!existing) return new Response('Not found', { status: 404 });

    const order = JSON.parse(existing);
    order.status = status;
    order.deliveryMessage = deliveryMessage;
    order.deliveredAt = new Date().toISOString();

    await env.SHOP_ORDERS.put(key, JSON.stringify(order));

    return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });

  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
