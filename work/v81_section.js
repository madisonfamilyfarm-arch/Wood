// v81: 🏠 pad finder — a badge that tells you how far you are from your take-off pad, with an arrow pointing back to it
(function(){const st=document.createElement('style');st.textContent=`#padFind{position:fixed;left:50%;transform:translateX(-50%);top:calc(52px + env(safe-area-inset-top));z-index:13;display:none;align-items:center;gap:6px;padding:5px 12px 5px 8px;border-radius:18px;background:rgba(15,20,30,.62);border:1.5px solid rgba(255,255,255,.5);color:#fff;font:700 14px system-ui,sans-serif;text-shadow:0 1px 2px #000;pointer-events:auto;user-select:none}
#padFind .ar{display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#30d158;color:#fff;font-size:15px;transition:transform .1s linear}
#padFind.far .ar{background:#ff9f0a}#padFind.vfar .ar{background:#ff453a}
body.pt #padFind{top:calc(170px + env(safe-area-inset-top));left:auto;right:calc(10px + env(safe-area-inset-right));transform:none}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='padFind';d.title='Tap to fly home';d.innerHTML='<span class="ar">↑</span><span class="tx">🏠 Pad 0 m</span>';document.body.appendChild(d);
  const ar=d.querySelector('.ar'),tx=d.querySelector('.tx');
  // tap the badge → pick what the arrow points to (pad, nearest jump ramp, tunnel, runways, places…)
  window.FINDT=null;
  const nearObj=(ty)=>{const p=WALK&&WALK.on&&WALK.pos?WALK.pos:D.pos;let b=null,bd=1e9;(window.OBJS||[]).forEach(o=>{if(o.type!==ty)return;const q=Math.hypot(o.x-p.x,o.z-p.z);if(q<bd){bd=q;b=o;}});return b;};
  window.findTargets=function(){const L=[{ic:'🏠',n:'Pad',get:()=>({x:D.home.x,z:D.home.z})},
    {ic:'📐',n:'Nearest jump ramp',get:()=>nearObj('ramp')},{ic:'⛏',n:'Tunnel ramp',get:()=>({x:TUN.x,z:TUN.z0})}];
    RW2.forEach(r=>L.push({ic:'🛬',n:r.n.replace('the ','').replace(/^./,c=>c.toUpperCase()),get:()=>({x:r.x,z:r.z})}));
    try{L.push({ic:'🤫',n:'Secret runway',get:()=>({x:SECRET.x,z:SECRET.z})});}catch(e){}
    try{aiPlaces().forEach(p=>{if(/launch pad|tunnel|runway/.test(p.n))return;if(L.some(o=>o.n.toLowerCase()===p.n.replace('the ','').toLowerCase()))return;L.push({ic:'📍',n:p.n.replace('the ','').replace(/^./,c=>c.toUpperCase()),get:()=>({x:p.x,z:p.z})});});}catch(e){}
    for(const ty of Object.keys(OTYPES||{}))if(ty!=='ramp'&&(window.OBJS||[]).some(o=>o.type===ty))L.push({ic:OTYPES[ty].ic,n:'Nearest '+OTYPES[ty].n.toLowerCase(),get:()=>nearObj(ty)});
    return L;};
  window.findSet=function(t){FINDT=t&&t.n!=='Pad'?t:null;if(FINDT&&!FINDT.get()){toast(FINDT.ic+' There isn\'t one yet — place one in 🧱 Build stuff first',3500);FINDT=null;return;}toast((t?t.ic+' Arrow now points to '+t.n:'🏠 Arrow points to your pad')+' — tap the badge to change',3000);};
  const pk=document.createElement('div');pk.id='findPick';pk.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center';document.body.appendChild(pk);
  pk.addEventListener('click',e=>{if(e.target===pk)pk.style.display='none';});
  d.addEventListener('click',()=>{const L=findTargets();pk.innerHTML='<div style="background:#1c1c1e;color:#fff;border-radius:16px;padding:12px;max-height:75vh;overflow:auto;width:min(320px,88vw);font:600 15px system-ui,sans-serif"><div style="font-weight:800;margin-bottom:8px">🧭 Point the arrow to…</div></div>';const box=pk.firstChild;
    L.forEach(t=>{const b=document.createElement('button');b.textContent=t.ic+' '+t.n;b.style.cssText='display:block;width:100%;text-align:left;margin:4px 0;padding:10px;border-radius:10px;border:0;background:'+((FINDT&&FINDT.n===t.n)||(!FINDT&&t.n==='Pad')?'#0a84ff':'#2c2c2e')+';color:#fff;font:600 15px system-ui,sans-serif';b.onclick=()=>{pk.style.display='none';findSet(t);};box.appendChild(b);});pk.style.display='flex';});
  const fm=m=>m>=1000?(m/1000).toFixed(m>=10000?0:1)+' km':Math.round(m)+' m';
  const tk=()=>{try{const show=started&&D&&D.home&&!(menu&&menu.open)&&!(WS&&WS.open)&&!document.body.classList.contains('vr');d.style.display=show?'flex':'none';
    if(show){const p=WALK&&WALK.on&&WALK.pos?WALK.pos:D.pos;let T=null;try{T=FINDT&&FINDT.get();}catch(e){}const tg=T||{x:D.home.x,z:D.home.z};const dx=tg.x-p.x,dz=tg.z-p.z,m=Math.hypot(dx,dz);
      tx.textContent=T?(m<6?FINDT.ic+' You\'re at '+FINDT.n:FINDT.ic+' '+FINDT.n.replace(/^Nearest /,'')+' '+fm(m)):(m<4?'🏠 On the pad':'🏠 Pad '+fm(m));d.className=m>600?'vfar':m>200?'far':'';
      // arrow: direction of the pad relative to where the camera looks
      const f=new THREE.Vector3();cam.getWorldDirection(f);const camA=Math.atan2(f.x,-f.z),padA=Math.atan2(dx,-dz);ar.style.transform='rotate('+((padA-camA)*180/Math.PI)+'deg)';ar.style.visibility=m<(T?6:4)?'hidden':'visible';}}catch(e){}
    requestAnimationFrame(tk);};requestAnimationFrame(tk);})();

{const h0=smartHear;smartHear=function(t){try{const s=String(t||'').toLowerCase();const m=s.match(/(?:where(?:'s| is)?|which way(?: is)?|which direction(?: is)?|direction (?:to|of)|point (?:me )?to|find|show me|how do i (?:find|get to))\s+(?:the |a |my )?(.+)/);
  if(m){const w=m[1].replace(/[?.!]/g,'').trim();const L=findTargets();const hit=/ramp|jump/.test(w)?L.find(o=>/tunnel/.test(w)?o.n==='Tunnel ramp':o.n==='Nearest jump ramp'):L.find(o=>{const n=o.n.toLowerCase().replace('nearest ','');return n&&(w.includes(n)||n.includes(w)||w.split(' ').some(x=>x.length>3&&n.includes(x)));});
    let hh=hit;if(hh&&hh.n==='Nearest jump ramp'&&!hh.get())hh=L.find(o=>o.n==='Tunnel ramp');const hit2=hh;if(hit2){const hit=hit2;findSet(hit);const T=FINDT&&FINDT.get();if(T||hit.n==='Pad'){sbSay('🧭 Follow the arrow on the 🏠 badge — it now points to '+hit.n.toLowerCase()+'.');}return true;}}}catch(e){}return h0.apply(this,arguments);};}
