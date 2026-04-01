const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const OPTIONS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id')?.trim().toUpperCase();

    if (!id) {
      return jsonResponse({ error: 'No order ID provided' }, 400);
    }

    const value = await env.SHOP_ORDERS.get(`order:${id}`);

    if (!value) {
      return jsonResponse({ error: 'Order not found' }, 404);
    }

    const order = JSON.parse(value);
    return jsonResponse(order, 200);
  } catch (e) {
    console.error('get-order error:', e.message);
    return jsonResponse({ error: 'Failed to retrieve order' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: OPTIONS_HEADERS
  });
}
