const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), {
      status: 400,
      headers: JSON_HEADERS
    });
  }

  try {
    // Proxy the request to the flipscreen API
    const response = await fetch(`https://psn.flipscreen.games/search.php?username=${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://psn.flipscreen.games/'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Lookup service error: ${response.status}` }), {
        status: response.status,
        headers: JSON_HEADERS
      });
    }

    const data = await response.json();
    
    // Check if the API returned an internal error
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 404,
        headers: JSON_HEADERS
      });
    }

    // Return the clean data to our frontend
    return new Response(JSON.stringify({
      psnUsername: data.online_id,
      playId: data.user_id,
      encodedId: data.encoded_id
    }), {
      status: 200,
      headers: JSON_HEADERS
    });

  } catch (error) {
    console.error('PSN Lookup Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to connect to lookup service' }), {
      status: 500,
      headers: JSON_HEADERS
    });
  }
}
