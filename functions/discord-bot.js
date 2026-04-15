// functions/discord-bot.js
// Handles Discord Slash Commands (Webhook mode)

export async function onRequestPost({ env, request }) {
  const PUBLIC_KEY = env.DISCORD_PUBLIC_KEY;

  // 1. Verify the signature (Discord security requirement)
  const signature = request.headers.get('X-Signature-Ed25519');
  const timestamp = request.headers.get('X-Signature-Timestamp');
  const body = await request.text();

  const isValidRequest = await verifySignature(PUBLIC_KEY, signature, timestamp, body);
  if (!isValidRequest) {
    return new Response('Invalid request signature', { status: 401 });
  }

  const interaction = JSON.parse(body);

  // 2. Handle PING (Discord's way of checking if the bot is alive)
  if (interaction.type === 1) {
    return new Response(JSON.stringify({ type: 1 }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 3. Handle Slash Commands (Type 2)
  if (interaction.type === 2) {
    const { name } = interaction.data;

    if (name === 'register') {
      const user = interaction.member ? interaction.member.user : interaction.user;
      
      // Get the "Actual Username" (the one they use to log in to Discord)
      // For old accounts: name#1234
      // For new accounts: name
      const discordName = user.discriminator && user.discriminator !== '0' && user.discriminator !== '0000'
        ? `${user.username}#${user.discriminator}` 
        : user.username;
      
      // Generate code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        // Store in KV using the lowercase username
        await env.SHOP_USERS.put(`user:${discordName.toLowerCase()}`, code);

        return new Response(JSON.stringify({
          type: 4, 
          data: {
            content: `## ✅ Registration Successful!\n\nHello **${user.global_name || user.username}**,\n\nYour shop login is now set to your actual Discord username.\n\n### Login Details:\n- **Discord Name:** \` ${discordName} \` \n- **Your Code:** \` ${code} \` \n\n**Login at:** [247alwaysonline.pages.dev](https://247alwaysonline.pages.dev)\n\n*Note: Use your full name exactly as shown above. This message is only visible to you.*`,
            flags: 64 
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        console.error('KV Error:', e);
        return new Response(JSON.stringify({
          type: 4,
          data: { content: "❌ Failed to register. There was an error saving your data. Please contact an admin.", flags: 64 }
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    }
  }

  return new Response('Unknown interaction', { status: 400 });
}

// Security: Verify that the request actually came from Discord
async function verifySignature(publicKey, signature, timestamp, body) {
  if (!publicKey || !signature || !timestamp) return false;
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(timestamp + body);
    const publicKeyBuffer = hexToUint8Array(publicKey);
    const signatureBuffer = hexToUint8Array(signature);

    const key = await crypto.subtle.importKey(
      'raw',
      publicKeyBuffer,
      { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify(
      'NODE-ED25519',
      key,
      signatureBuffer,
      data
    );
  } catch (e) {
    return false;
  }
}

function hexToUint8Array(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}
