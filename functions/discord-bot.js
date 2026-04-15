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
        // 1. Store in KV
        await env.SHOP_USERS.put(`user:${discordName.toLowerCase()}`, code);

        // 2. Send the DM via Discord REST API
        // First, create/get the DM channel ID
        const dmChannelResponse = await fetch('https://discord.com/api/v10/users/@me/channels', {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipient_id: user.id }),
        });

        const dmChannel = await dmChannelResponse.json();

        if (dmChannel.id) {
          // Send the actual message to that DM channel
          const messageText = `## 🗝️ Your Shop Login Details\n\nHello **${user.global_name || user.username}**,\n\nHere are your login details for the 247 Always Online Shop. You can refer back to this message whenever you need your code.\n\n- **Discord Name:** \` ${discordName} \` \n- **Your Code:** \` ${code} \` \n\n**Login at:** [https://247alwaysonline.pages.dev](https://247alwaysonline.pages.dev)`;

          await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bot ${env.DISCORD_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: messageText }),
          });

          // 3. Respond to the slash command with a "Check your DMs" message
          return new Response(JSON.stringify({
            type: 4, 
            data: {
              content: `✅ **Success!** I have sent your login code to your **Direct Messages**, ${user.username}. Please check your inbox!`,
              flags: 64 
            }
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          throw new Error("Could not open DM channel. They might have DMs disabled.");
        }

      } catch (e) {
        console.error('Registration/DM Erro
