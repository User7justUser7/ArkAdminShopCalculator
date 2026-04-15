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
      const discordName = `${user.username}${user.discriminator !== '0' ? '#' + user.discriminator : ''}`;
      
      // Generate code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        // Save to KV directly
        await env.SHOP_USERS.put(`user:${discordName.toLowerCase()}`, code);

        return new Response(JSON.stringify({
          type: 4, // Respond immediately
          data: {
            content: `Hello ${user.username}!\n\nYour 6-digit shop login code is: **${code}**\nUse your Discord name (**${discordName}**) to log in at:\nhttps://247alwaysonline.pages.dev`,
            flags: 64 // EPHEMERAL - Only the user who typed the command sees this!
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({
          type: 4,
          data: { content: "❌ Failed to register. Please contact an admin.", flags: 64 }
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
