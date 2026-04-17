const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export async function onRequestGet({ env, request }) {
  const auth = request.headers.get('Authorization');
  // Simple check against bot key (you should use a proper secret here)
  if (!auth) return new Response('Unauthorized', { status: 401 });

  const list = await env.SHOP_ORDERS.list({ prefix: 'order:' });
  const pendingOrders = [];

  for (const key of list.keys) {
    const val = await env.SHOP_ORDERS.get(key.name);
    if (val) {
      const order = JSON.parse(val);
      if (order.status === 'queued') {
        // Extract ID from key (order:XXXXXX)
        order.id = key.name.split(':')[1];
        pendingOrders.push(order);
      }
    }
  }

  return new Response(JSON.stringify({ orders: pendingOrders }), {
    headers: JSON_HEADERS
  });
}
