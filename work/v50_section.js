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
    cats.forEach(c=>{if(c.items.length){const it=mItem('<span class="tIc">'+c.n.split(' ')[0]+'</span><span class="tN">'+c.n.replace(/^\S+\s/,'')+'</span><span class="tD">'+c.d+'</span>',()=>menuPush(c.n,mCatItems(c.k)));it.tile=true;out.push(it);}});
    if(other.length){const it=mItem('<span class="tIc">📦</span><span class="tN">Everything else</span>',()=>menuPush('📦 Everything else',mCatItems('other')));it.tile=true;out.push(it);}
    // handy shortcuts right on the front page
    const q=re=>L.find(it=>re.test(lab(it)));[q(/^🛬 Back to the pad/),q(/^🔄 Do a flip/),q(/^🚶 Walk around/)].forEach(it=>{if(it)out.push(it);});if(help)out.push(help);return out;};}
function mCatItems(k){const L=mainAllItems();const lab=it=>{try{return String(it.label()).replace(/<[^>]+>/g,'');}catch(e){return'';}};
  if(k==='other'){const all=MCAT.map(c=>c[3]);return[...L.filter(it=>{const l=lab(it);return !it.info&&!/^▶ Back to flying|How to play/.test(l)&&!all.some(re=>re.test(l));}),mItem('◀ Back',()=>menuBack())];}
  const c=MCAT.find(c=>c[0]===k);return[mInfo(c[2]),...L.filter(it=>c[3].test(lab(it))),mItem('◀ Back',()=>menuBack())];}
// the categories show as big buttons
(function(){const st=document.createElement('style');st.textContent=`
#menuList.tiles{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:6px;align-content:start}
#menuList.tiles .mi{grid-column:1 / -1}
#menuList.tiles .mi.tile{grid-column:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:64px;padding:6px 4px!important;border-radius:16px!important;background:linear-gradient(160deg,rgba(52,199,89,0.22),rgba(10,132,255,0.18))!important;border:1px solid rgba(255,255,255,0.18)!important}
#menuList.tiles .mi.tile.sel{outline:3px solid #ffd60a}
#menuList .tIc{display:block;font-size:24px;line-height:1.1}#menuList .tN{display:block;font:800 14px system-ui;margin-top:2px}#menuList .tD{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font:500 10px system-ui;opacity:0.7;margin-top:2px;line-height:1.2}body.ph #menuList .tD{display:none}`;document.head.appendChild(st);})();
{const r0=renderMenu;renderMenu=function(){const r=r0.apply(this,arguments);try{const L=$('menuList');const any=menu.items.some(it=>it.tile);L.classList.toggle('tiles',any);if(any){const rows=L.querySelectorAll(':scope > .mi');menu.items.forEach((it,i)=>{if(it.tile&&rows[i])rows[i].classList.add('tile');});}}catch(e){}return r;};}
// 🎚 the camera-tilt slider never sits on top of the FIRE button (phone held upright)
(function(){const st=document.createElement('style');st.textContent='body.pt #gimbal{right:calc(14px + env(safe-area-inset-right))!important;bottom:calc(300px + env(safe-area-inset-bottom))!important;height:100px!important}';document.head.appendChild(st);})();
// 🌊 torpedoes LOOK like torpedoes: dark grey body, round nose, spinning propeller — the rocket look comes back when it leaves the water
const TORPM=(()=>{const body=new THREE.MeshLambertMaterial({color:0x3a4048}),band=new THREE.MeshLambertMaterial({color:0xd4a017}),prop=new THREE.MeshLambertMaterial({color:0x9aa3ad});
  return function(){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.6,12),body);c.rotation.x=Math.PI/2;g.add(c);const n=new THREE.Mesh(new THREE.SphereGeometry(0.07,12,8),body);n.position.z=-0.3;g.add(n);
    const b=new THREE.Mesh(new THREE.CylinderGeometry(0.072,0.072,0.06,12),band);b.rotation.x=Math.PI/2;b.position.z=-0.12;g.add(b);const t=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.14,12),body);t.rotation.x=-Math.PI/2;t.position.z=0.37;g.add(t);
    const p=new THREE.Group();for(let i=0;i<3;i++){const bl=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.16,0.02),prop);bl.rotation.z=i*2.094;p.add(bl);}p.position.z=0.45;g.add(p);g.userData.prop=p;return g;};})();
{const t0=tickShots;tickShots=function(dt){const r=t0.apply(this,arguments);try{for(const s of shots){if(s.w!=='rocket'||!s.m)continue;const want=!!s.torp;if(s._tl===want&&!want)continue;
      if(want&&!s.tm){s.tm=TORPM();s.m.add(s.tm);}if(s._tl!==want){s.m.children.forEach(c=>{if(c===s.tm)c.visible=want;else if(c!==s.m.userData.flame)c.visible=!want;else c.visible=!want;});s._tl=want;}
      if(want&&s.tm)s.tm.userData.prop.rotation.z+=dt*40;}}catch(e){}return r;};}
