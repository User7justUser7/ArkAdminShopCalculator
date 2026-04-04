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

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    
    // Validate data structure
    if (!data.currency && !data.materialTiers) {
      return jsonResponse({ error: 'Invalid settings data' }, 400);
    }

    await env.SHOP_ITEMS.put(SETTINGS_KEY, JSON.stringify(data));
    
    return jsonResponse({ success: true, message: 'Settings saved successfully' });
  } catch (e) {
    console.error('save-settings error:', e.message);
    return jsonResponse({ error: 'Failed to save settings' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
