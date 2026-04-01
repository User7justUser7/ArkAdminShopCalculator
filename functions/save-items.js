const ITEMS_KEY = 'shop:items';

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

function normalizeRecipe(recipe) {
  if (!Array.isArray(recipe)) return [];
  return recipe
    .map(row => ({
      material: String(row?.material || '').trim(),
      qty: Number(row?.qty || 0)
    }))
    .filter(row => row.material && row.qty > 0);
}

function normalizeItem(rawItem) {
  return {
    id: String(rawItem?.id || '').trim(),
    name: String(rawItem?.name || '').trim(),
    category: String(rawItem?.category || '').trim(),
    icon: String(rawItem?.icon || '📦').trim(),
    price: Number(rawItem?.price || 0),
    fixed: Boolean(rawItem?.fixed),
    engram: Number(rawItem?.engram || 0),
    recipe: normalizeRecipe(rawItem?.recipe),
    desc: String(rawItem?.desc || '').trim()
  };
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.items)) {
      return jsonResponse({ error: 'Items payload must be an array' }, 400);
    }

    const items = body.items
      .map(normalizeItem)
      .filter(item => item.id && item.name && item.category && item.price >= 0);

    if (items.length === 0) {
      return jsonResponse({ error: 'No valid items to save' }, 400);
    }

    await env.SHOP_ITEMS.put(ITEMS_KEY, JSON.stringify(items));

    return jsonResponse({ ok: true, count: items.length }, 200);
  } catch (e) {
    console.error('save-items error:', e.message);
    return jsonResponse({ error: 'Failed to save items' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: OPTIONS_HEADERS
  });
}
