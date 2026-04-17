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
    .map((row) => ({
      material: String(row?.material || '').trim(),
      qty: Number(row?.qty || 0)
    }))
    .filter((row) => row.material && row.qty > 0);
}

function normalizeItem(rawItem) {
  const fixed = Boolean(rawItem?.fixed);
  
  let category = rawItem?.category;
  if (Array.isArray(category)) {
    category = category.map(c => String(c || '').trim()).filter(Boolean);
  } else {
    category = [String(category || '').trim()].filter(Boolean);
  }

  return {
    id: String(rawItem?.id || '').trim(),
    name: String(rawItem?.name || '').trim(),
    category: category.length > 0 ? category : ['Imported'],
    icon: String(rawItem?.icon ?? '').trim(),
    price: Number(rawItem?.price || 0),
    fixed,
    engram: Number(rawItem?.engram || 0),
    yield: fixed ? 1 : Math.max(1, Number(rawItem?.yield || 1)),
    recipe: normalizeRecipe(rawItem?.recipe),
    desc: String(rawItem?.desc || '').trim(),
    bp: String(rawItem?.bp || '').trim(),
    spawn_command: String(rawItem?.spawn_command || '').trim()
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
      .filter((item) => item.id && item.name && item.category.length > 0 && item.price >= 0);

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
