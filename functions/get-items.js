const ITEMS_KEY = 'shop:items';

const STARTER_ITEMS = [
  { id:'c1', name:'Adv Rifle Bullet', category:'Ammo', icon:'🔹', price:10, fixed:true, engram:0, recipe:[], desc:'Advanced rifle ammo' },
  { id:'c2', name:'Ammo Box', category:'Ammo', icon:'📦', price:204, fixed:true, engram:0, recipe:[], desc:'Box of assorted ammo' },
  { id:'c3', name:'Cryopod', category:'Taming & Utility', icon:'🧊', price:194, fixed:true, engram:0, recipe:[], desc:'Store tamed dinos' },
  { id:'c4', name:'Incubator', category:'Taming & Utility', icon:'🥚', price:8258, fixed:true, engram:0, recipe:[], desc:'Egg incubation station' },
  { id:'c5', name:'Dino Leash', category:'Taming & Utility', icon:'🔗', price:97, fixed:true, engram:0, recipe:[], desc:'Keep dinos in place' },
  { id:'w1', name:'Simple Pistol', category:'Weapons', icon:'🔫', price:70, fixed:false, engram:8, recipe:[{material:'Metal Ingot',qty:35},{material:'Wood',qty:10}] },
  { id:'w2', name:'Longneck Rifle', category:'Weapons', icon:'🎯', price:190, fixed:false, engram:35, recipe:[{material:'Metal Ingot',qty:60},{material:'Wood',qty:20},{material:'Crystal',qty:5}] },
  { id:'w3', name:'Pump Shotgun', category:'Weapons', icon:'💥', price:356, fixed:false, engram:55, recipe:[{material:'Metal Ingot',qty:85},{material:'Wood',qty:25},{material:'Polymer',qty:15}] },
  { id:'w4', name:'Assault Rifle', category:'Weapons', icon:'⚔️', price:980, fixed:false, engram:65, recipe:[{material:'Metal Ingot',qty:125},{material:'Polymer',qty:50},{material:'Crystal',qty:15},{material:'Electronics',qty:10}] },
  { id:'w5', name:'Fabricated Pistol', category:'Weapons', icon:'🔫', price:556, fixed:false, engram:45, recipe:[{material:'Metal Ingot',qty:60},{material:'Polymer',qty:20},{material:'Electronics',qty:15}] },
  { id:'w6', name:'Fabricated Sniper', category:'Weapons', icon:'🎯', price:1190, fixed:false, engram:85, recipe:[{material:'Metal Ingot',qty:150},{material:'Polymer',qty:60},{material:'Crystal',qty:20},{material:'Electronics',qty:15}] },
  { id:'w7', name:'Rocket Launcher', category:'Weapons', icon:'🚀', price:2054, fixed:false, engram:87, recipe:[{material:'Metal Ingot',qty:200},{material:'Polymer',qty:100},{material:'Crystal',qty:30},{material:'Electronics',qty:20}] },
  { id:'w8', name:'Compound Bow', category:'Weapons', icon:'🏹', price:262, fixed:false, engram:51, recipe:[{material:'Metal Ingot',qty:40},{material:'Wood',qty:30},{material:'Fiber',qty:50},{material:'Polymer',qty:10}] },
  { id:'a1', name:'Flak Helmet', category:'Armor', icon:'⛑️', price:342, fixed:false, engram:46, recipe:[{material:'Metal Ingot',qty:120},{material:'Hide',qty:60},{material:'Fiber',qty:15}] },
  { id:'a2', name:'Flak Chestpiece', category:'Armor', icon:'🛡️', price:614, fixed:false, engram:46, recipe:[{material:'Metal Ingot',qty:250},{material:'Hide',qty:120},{material:'Fiber',qty:30}] },
  { id:'a3', name:'Flak Leggings', category:'Armor', icon:'🦺', price:468, fixed:false, engram:46, recipe:[{material:'Metal Ingot',qty:180},{material:'Hide',qty:90},{material:'Fiber',qty:25}] },
  { id:'a4', name:'Flak Gauntlets', category:'Armor', icon:'🧤', price:298, fixed:false, engram:46, recipe:[{material:'Metal Ingot',qty:100},{material:'Hide',qty:50},{material:'Fiber',qty:10}] },
  { id:'a5', name:'Flak Boots', category:'Armor', icon:'👢', price:342, fixed:false, engram:46, recipe:[{material:'Metal Ingot',qty:120},{material:'Hide',qty:60},{material:'Fiber',qty:15}] },
  { id:'a6', name:'Riot Helmet', category:'Armor', icon:'⛑️', price:924, fixed:false, engram:70, recipe:[{material:'Metal Ingot',qty:100},{material:'Polymer',qty:60},{material:'Crystal',qty:40},{material:'Electronics',qty:10}] },
  { id:'a7', name:'Riot Chestpiece', category:'Armor', icon:'🛡️', price:1734, fixed:false, engram:70, recipe:[{material:'Metal Ingot',qty:200},{material:'Polymer',qty:100},{material:'Crystal',qty:80},{material:'Electronics',qty:20}] },
  { id:'s1', name:'Metal Foundation', category:'Structures', icon:'🏗️', price:440, fixed:false, engram:20, recipe:[{material:'Metal Ingot',qty:220}] },
  { id:'s2', name:'Metal Wall', category:'Structures', icon:'🧱', price:80, fixed:false, engram:0, recipe:[{material:'Metal Ingot',qty:40}] },
  { id:'s3', name:'Metal Ceiling', category:'Structures', icon:'🏠', price:80, fixed:false, engram:0, recipe:[{material:'Metal Ingot',qty:40}] },
  { id:'s4', name:'Metal Doorframe', category:'Structures', icon:'🚪', price:50, fixed:false, engram:0, recipe:[{material:'Metal Ingot',qty:25}] },
  { id:'s5', name:'Metal Door', category:'Structures', icon:'🚪', price:100, fixed:false, engram:0, recipe:[{material:'Metal Ingot',qty:50}] },
  { id:'s6', name:'Metal Ramp', category:'Structures', icon:'📐', price:120, fixed:false, engram:0, recipe:[{material:'Metal Ingot',qty:60}] },
  { id:'s7', name:'Large Storage Box', category:'Structures', icon:'📦', price:60, fixed:false, engram:0, recipe:[{material:'Metal Ingot',qty:50},{material:'Wood',qty:200},{material:'Fiber',qty:50}] },
  { id:'s8', name:'Vault', category:'Structures', icon:'🏦', price:1600, fixed:false, engram:0, recipe:[{material:'Metal Ingot',qty:800}] },
  { id:'s9', name:'Auto Turret', category:'Structures', icon:'🔫', price:2560, fixed:false, engram:96, recipe:[{material:'Metal Ingot',qty:140},{material:'Polymer',qty:50},{material:'Electronics',qty:70},{material:'Crystal',qty:20}] },
  { id:'s10', name:'Fabricator', category:'Structures', icon:'⚙️', price:960, fixed:false, engram:55, recipe:[{material:'Metal Ingot',qty:35},{material:'Polymer',qty:20},{material:'Electronics',qty:15},{material:'Crystal',qty:5},{material:'Cementing Paste',qty:20}] },
  { id:'s11', name:'Industrial Forge', category:'Structures', icon:'🔥', price:1320, fixed:false, engram:80, recipe:[{material:'Metal Ingot',qty:100},{material:'Electronics',qty:50},{material:'Gasoline',qty:80}] },
  { id:'sd1', name:'Rex Saddle', category:'Saddles', icon:'🦕', price:710, fixed:false, engram:74, recipe:[{material:'Hide',qty:550},{material:'Fiber',qty:130},{material:'Metal Ingot',qty:100}] },
  { id:'sd2', name:'Argentavis Saddle', category:'Saddles', icon:'🦅', price:578, fixed:false, engram:62, recipe:[{material:'Hide',qty:450},{material:'Fiber',qty:100},{material:'Metal Ingot',qty:80}] },
  { id:'sd3', name:'Raptor Saddle', category:'Saddles', icon:'🦖', price:100, fixed:false, engram:18, recipe:[{material:'Hide',qty:100},{material:'Fiber',qty:30},{material:'Wood',qty:50}] },
  { id:'sd4', name:'Quetzal Saddle', category:'Saddles', icon:'🦕', price:758, fixed:false, engram:86, recipe:[{material:'Hide',qty:500},{material:'Fiber',qty:200},{material:'Metal Ingot',qty:120},{material:'Crystal',qty:50}] },
  { id:'bp1', name:'Assault Rifle BP', category:'Blueprints', icon:'📋', price:980, fixed:false, engram:65, recipe:[{material:'Metal Ingot',qty:125},{material:'Polymer',qty:50},{material:'Crystal',qty:15},{material:'Electronics',qty:10}] },
  { id:'bp2', name:'Flak Chestpiece BP', category:'Blueprints', icon:'📋', price:614, fixed:false, engram:46, recipe:[{material:'Metal Ingot',qty:250},{material:'Hide',qty:120},{material:'Fiber',qty:30}] },
  { id:'bp3', name:'Fabricated Sniper BP', category:'Blueprints', icon:'📋', price:1190, fixed:false, engram:85, recipe:[{material:'Metal Ingot',qty:150},{material:'Polymer',qty:60},{material:'Crystal',qty:20},{material:'Electronics',qty:15}] }
];

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const OPTIONS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

export async function onRequestGet({ env }) {
  try {
    const existing = await env.SHOP_ITEMS.get(ITEMS_KEY);

    if (!existing) {
      await env.SHOP_ITEMS.put(ITEMS_KEY, JSON.stringify(STARTER_ITEMS));
      return jsonResponse({ items: STARTER_ITEMS });
    }

    const items = JSON.parse(existing);
    return jsonResponse({ items });
  } catch (e) {
    console.error('get-items error:', e.message);
    return jsonResponse({ error: 'Failed to retrieve items' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: OPTIONS_HEADERS
  });
}
