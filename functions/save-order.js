export async function onRequestPost({ env, request }) {
  try {
    const order = await request.json();
    
    // Generate a short 6-character order ID (same as your Netlify version)
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();

    // Upstash REST API — body must be a JSON array: ["SET", "key", "value"]
    const response = await fetch(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', `order:${id}`, JSON.stringify(order)])
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (e) {
    console.error('Error in save-order function:', e.message);
    return new Response(JSON.stringify({ error: e.message || 'Failed to save order' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle CORS preflight
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
