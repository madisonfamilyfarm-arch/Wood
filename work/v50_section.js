// ================================================================ v50: 📂 the menu is sorted into categories (✈️ Fly · 🛠 Build · 💥 Weapons · 🤖 AI · 🌐 Multiplayer · 🎮 Games & places · 📷 Camera · 🌦 World · ⚙️ Settings). Search still finds everything.
const MCAT=[
  ['fly','✈️ Fly','drone choice, flight settings, assist, radio, lessons, camera view',/^(🚁 Drone|🚁 Drone:|⚙️ Flight settings|🎯 Assist|📻 Radio|🎓 Flight lessons|🎚️ Speed|🎥 Camera|🌀 Motors|🔄 Do a flip|👁 Drone|↩ Back to last checkpoint|🛬 Back to the pad|📍 Launch drone|🔋 Swap battery|🚶 Walk around)/],
  ['build','🛠 Build','build drones / cars / tanks / boats / subs, workshop, programs, shop',/^(🛠 Build anything|🧩 Workshop|💻 Program mode|🏗 Build mode|📦 Put things down|💰 Shop)/],
  ['war','💥 Weapons & battle','weapons, TNT, explosions, battle mode, fixing what got blown up',/^(🔫 Weapons|💣 TNT type|💥 Explosion settings|💥 Danger mode|😠 Revenge mode|🔧 Put back|🔥 Fires)/],
  ['ai','🤖 AI players','AI pilots, play games with them, campers, shouting to them',/^(🤖 AI pilots|🎮 Play a game with the AI|📣 Shout to the AI|🧑‍🚒 AI campers|🚒 Take me to the fire truck)/],
  ['mp','🌐 Multiplayer','online rooms, multiplayer, play on your phone',/^(🌐 Online rooms|👥 Multiplayer|📱 Play on my phone)/],
  ['games','🎮 Games & places','races, missions, train, GIGA drone, trails, airports, maps',/^(🏁 Races|🎒 Missions|🚂 Train|🦖 GIGA|➕ 🛤️|🎲 Roll a new airport|🛫 Airport|🗺 Map)/],
  ['cam','📷 Camera & photos','zoom, shutter, photos and videos',/^(🔍 Zoom|📷 Shutter|📸 Photos|⬇ Photos)/],
  ['world','🌦 World','weather, time of day, real-world settings',/^(🌦 Weather|🌅 Time of day|🕰 Use the real clock|🌍 Real-world)/],
  ['set','⚙️ Settings','device, screen, phone model, sound, smoothness, graphics, VR, controllers',/^(⚙️ Playing on|📐 Screen|📱 My phone|⚡ Smoothness|🔊 Sound|✨ Graphics|🥽 VR|⚙️ VR lens|🎮 DJI remote|🕹 Controller|⛶ Full screen)/]];
let mainAllItems=null;
{const m0=mainItems;mainAllItems=function(){return m0();};
  mainItems=function(){const L=m0();const lab=it=>{try{return String(it.label()).replace(/<[^>]+>/g,'');}catch(e){return'';}};const used=new Set();const pick=re=>L.filter(it=>{const l=lab(it);if(re.test(l)){used.add(it);return true;}return false;});
    const cats=MCAT.map(([k,n,d,re])=>({k,n,d,items:pick(re)}));const back=L.find(it=>/^▶ Back to flying/.test(lab(it)));if(back)used.add(back);const help=L.find(it=>/How to play/.test(lab(it)));if(help)used.add(help);
    const other=L.filter(it=>!used.has(it)&&!it.info);
    const out=[];if(back)out.push(back);
    cats.forEach(c=>{if(c.items.length)out.push(mItem(c.n+' ▸  <span style="opacity:0.6;font-size:0.8em">'+c.d+'</span>',()=>menuPush(c.n,mCatItems(c.k))));});
    if(other.length)out.push(mItem('📦 Everything else ▸',()=>menuPush('📦 Everything else',mCatItems('other'))));
    // handy shortcuts right on the front page
    const q=re=>L.find(it=>re.test(lab(it)));[q(/^🛬 Back to the pad/),q(/^🔄 Do a flip/),q(/^🚶 Walk around/)].forEach(it=>{if(it)out.push(it);});if(help)out.push(help);return out;};}
function mCatItems(k){const L=mainAllItems();const lab=it=>{try{return String(it.label()).replace(/<[^>]+>/g,'');}catch(e){return'';}};
  if(k==='other'){const all=MCAT.map(c=>c[3]);return[...L.filter(it=>{const l=lab(it);return !it.info&&!/^▶ Back to flying|How to play/.test(l)&&!all.some(re=>re.test(l));}),mItem('◀ Back',()=>menuBack())];}
  const c=MCAT.find(c=>c[0]===k);return[mInfo(c[2]),...L.filter(it=>c[3].test(lab(it))),mItem('◀ Back',()=>menuBack())];}
