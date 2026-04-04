const SETTINGS_KEY = 'shop:settings';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

export async function onRequestGet({ env }) {
  try {
    const existing = await env.SHOP_ITEMS.get(SETTINGS_KEY);

    if (!existing) {
      return jsonResponse({});
    }

    const settings = JSON.parse(existing);
    return jsonResponse(settings);
  } catch (e) {
    console.error('get-settings error:', e.message);
    return jsonResponse({ error: 'Failed to retrieve settings' }, 500);
  }
}
