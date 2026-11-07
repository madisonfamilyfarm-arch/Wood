// ================================================================ v36: 💣 deadly TNT · 💥 Explosion settings (◀ arrows + slider + number, all in sync — keep pressing ▶ to make it GIANT) · 🎯 rocket auto-detect in EVERY mode
const TNT=Object.assign({r:30,dr:12,fuse:3,impact:true,deadly:true,det:5},LS.get('tnt',{}));function saveTnt(){LS.set('tnt',TNT);}
const TNTS=[];let tntN=0;
const TNTMAT=(()=>{const c=document.createElement('canvas');c.width=128;c.height=64;const x=c.getContext('2d');x.fillStyle='#c8102e';x.fillRect(0,0,128,64);x.fillStyle='#fff';x.font='900 34px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText('TNT',64,34);
  const t=new THREE.CanvasTexture(c);return[new THREE.MeshLambertMaterial({map:t}),new THREE.MeshLambertMaterial({color:0xc8102e})];})();
function tntMesh(){const g=new THREE.Group();for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.55,12),[TNTMAT[0],TNTMAT[1],TNTMAT[1]]);m.position.x=(i-1)*0.2;m.rotation.y=Math.PI/2;g.add(m);}
  const band=new THREE.Mesh(new THREE.BoxGeometry(0.66,0.06,0.25),new THREE.MeshLambertMaterial({color:0x222222}));g.add(band);
  const fz=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.25,6),new THREE.MeshLambertMaterial({color:0x333333}));fz.position.set(0,0.35,0);g.add(fz);
  const sp=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),new THREE.MeshBasicMaterial({color:0xffdd44}));sp.position.set(0,0.48,0);g.add(sp);g.userData.spark=sp;return g;}
function tntDrop(){if(!started||!DR&&!WALK.on)return;const me=dzMe()||D.pos.clone();const p=me.clone();let v=new V3();
  if(WALK.on){const y=WALK.yaw||0;v.set(-Math.sin(y)*5,4,-Math.cos(y)*5);p.y+=0.4;}else{v.copy(D.vel||new V3()).multiplyScalar(0.8);p.y-=0.5;}
  const id=mp.id+'.t'+(++tntN);tntAdd(id,p,v,true);mpSend({t:'tnt',tid:id,p:p.toArray().map(r2),v:v.toArray().map(r2)});beep(500,0.08,0.05);toast('💣 TNT dropped!',900);}
function tntAdd(id,p,v,own,extra){const g=tntMesh();g.position.copy(p);scene.add(g);const T=Object.assign({id,g,p:p.clone(),v:v.clone(),t:0,own,landed:false},extra||{});if(T.small)g.scale.setScalar(0.6);TNTS.push(T);return T;}
function tntDel(T){scene.remove(T.g);const i=TNTS.indexOf(T);if(i>=0)TNTS.splice(i,1);}
function tntTargets(){const L=[];try{L.push(...fuseTargets());}catch(e){}for(const B of AIB.L)if(!B.dead)L.push(B.p);return L;}
function tntBoom(T){const p=T.p.clone();tntDel(T);if(!T.own)return;mpSend({t:'tntx',tid:T.id});
  const r=Math.max(0.5,T.r||TNT.r),dr=Math.max(0,T.dr!=null?T.dr:TNT.dr),bn=T.bn||CFG.name,bi=T.bi||mp.id,was=DZ.on;if(TNT.deadly)DZ.on=true;try{explode(p,r,dr,!T.bi,bn,bi);}finally{DZ.on=was;}
  mpSend({t:'boom',p:p.toArray().map(r2),r,dr,tnt:TNT.deadly?1:0,bn,bi});tntFx(p,r);try{tntAfter(T,p,r);}catch(e){}}
function tntAfter(){}
// the big look: fireballs blasting out in every direction + a shock ring
function tntFx(p,r){for(let k=0;k<10;k++){const a=k/10*6.2832,up=k%2?0.5:-0.1;const q=p.clone().add(new V3(Math.cos(a)*r*0.45,r*0.25*up+r*0.1,Math.sin(a)*r*0.45));
    const fb=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),new THREE.MeshBasicMaterial({color:k%3?0xff7a20:0xffcc55,transparent:true,opacity:1,depthWrite:false}));fb.position.copy(q);scene.add(fb);FXB.push({m:fb,t:-k*0.03,life:0.9,fire:true,r:r*0.32});}
  const top=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),new THREE.MeshBasicMaterial({color:0xff9a30,transparent:true,opacity:1,depthWrite:false}));top.position.copy(p).add(new V3(0,r*0.4,0));scene.add(top);FXB.push({m:top,t:-0.1,life:1.1,fire:true,r:r*0.45});
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.8,1,48),new THREE.MeshBasicMaterial({color:0xffe2a0,transparent:true,opacity:0.8,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x,H(p.x,p.z)+0.3,p.z);scene.add(ring);
  const t0=performance.now();(function grow(){const u=(performance.now()-t0)/700;if(u>=1){scene.remove(ring);return;}ring.scale.setScalar(0.5+u*r*1.6);ring.material.opacity=0.8*(1-u);requestAnimationFrame(grow);})();
  for(let k=0;k<Math.min(24,6+r*0.5);k++)puff(p.clone().add(new V3((Math.random()-0.5)*r*1.4,Math.random()*r*0.7,(Math.random()-0.5)*r*1.4)),k%3?0x3a3a3a:0x6a6a6a,r*0.12,2.4);shake=Math.max(shake,1.2);}
function tntTick(dt){if(!TNTS.length)return;const T2=tntTargets();for(const T of TNTS.slice()){T.t+=dt;
    if(!T.landed){T.v.y-=9.8*dt;T.p.addScaledVector(T.v,dt);const gy=inWater(T.p.x,T.p.z)?Math.max(H(T.p.x,T.p.z),WATER_Y-0.1):H(T.p.x,T.p.z);
      const hitThing=hitTest(T.p,0.25)||objHitTest(T.p);if(T.p.y<=gy+0.15||hitThing){if(T.p.y<gy+0.15)T.p.y=gy+0.15;T.landed=true;T.v.set(0,0,0);if(T.own&&TNT.impact){tntBoom(T);continue;}}}
    T.g.position.copy(T.p);T.g.rotation.y+=dt*(T.landed?0:4);const sp=T.g.userData.spark;if(sp){sp.visible=Math.random()<0.75;sp.scale.setScalar(0.7+Math.random()*0.8);}
    if(T.own&&T.t>0.35&&T2.some(q=>q.distanceTo(T.p)<1.8)){tntBoom(T);continue;}
    if(T.own&&T.t>=(TNT.impact?Math.max(TNT.fuse,6):TNT.fuse)){tntBoom(T);continue;}if(T.t>20)tntDel(T);}}
{const f0=fireTick;fireTick=function(dt){const r=f0.apply(this,arguments);try{if(!SIM.pause)tntTick(dt);}catch(e){console.warn('tnt',e);}return r;};}
MPH.tnt=function(m){if(!m.tid||TNTS.some(T=>T.id===m.tid))return;tntAdd(m.tid,new V3().fromArray(m.p),new V3().fromArray(m.v||[0,0,0]),false);};
MPH.tntx=function(m){const T=TNTS.find(T=>T.id===m.tid);if(T)tntDel(T);};
// a friend's deadly TNT is deadly on your screen too
{const b0=MPH.boom;MPH.boom=function(m,pe){if(!m.tnt){return b0.apply(this,arguments);}const was=DZ.on;DZ.on=true;try{const r=b0.apply(this,arguments);try{tntFx(new V3().fromArray(m.p),m.r||30);}catch(e){}return r;}finally{DZ.on=was;}};}
addEventListener('keydown',e=>{if(e.code==='Digit0'&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))&&!menu.open){tntDrop();e.preventDefault();}});
// 💣 on-screen button (phones) + in the Tools list (everyone)
setTimeout(()=>{const b=document.createElement('button');b.id='tntBtn';b.textContent='💣 TNT';b.style.cssText='position:fixed;right:calc(150px + env(safe-area-inset-right));bottom:calc(200px + env(safe-area-inset-bottom));z-index:21;font:800 14px system-ui;padding:9px 12px;border-radius:14px;border:2px solid rgba(255,255,255,0.7);background:rgba(200,16,46,0.88);color:#fff;touch-action:none;display:none;cursor:pointer';
  b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();tntDrop();});document.body.appendChild(b);
  setInterval(()=>{b.style.display=started&&!menu.open&&(PHONE||LS.get('devMode','auto')==='phone')&&LS.get('tntBtn',true)?'':'none';},300);},1600);
{const b0=asBtn;asBtn=function(){b0.apply(this,arguments);const box=$('asBox');if(!box)return;let v=$('tntTool');if(!v){v=document.createElement('button');v.id='tntTool';v.className='btn';v.style.cssText=$('asBtn').style.cssText;v.textContent='💣 Drop TNT (0)';v.onclick=()=>tntDrop();box.appendChild(v);}if(!PHONE||asBtn.open)v.style.display='';};}
// ---------------------------------------------------------------- 🎯 rocket auto-detect: your rocket blows up the moment it passes next to ANY player, AI pilot, camper or the truck — battle on or off, any vehicle, walking too
{const t0=tickShots;tickShots=function(dt){try{const R=TNT.det;if(!SIM.pause&&R>0){const T=tntTargets();if(T.length)for(const s of shots){if(!s.own||s.w!=='rocket'||s.life<=0||!s.m)continue;if((s.age2=(s.age2||0)+dt)<0.12)continue;
      const P=s.m.position;_fb.copy(P).addScaledVector(s.v,dt*1.15);_fa.subVectors(_fb,P);const L2=_fa.lengthSq()||1e-9;let best=null,bd=1e9;
      for(const q of T){const t=clamp(_fc.subVectors(q,P).dot(_fa)/L2,0,1);const cx=P.x+_fa.x*t,cy=P.y+_fa.y*t,cz=P.z+_fa.z*t,d=Math.hypot(q.x-cx,q.y-cy,q.z-cz);if(d<R+(q.fr||0)&&d<bd){bd=d;best=[cx,cy,cz];}}
      if(best){P.set(best[0],best[1],best[2]);s.v.setLength(0.001);s.life=0;s.prev&&s.prev.copy(P);}}}}catch(e){}return t0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🎚 every slider gets ◀ ▶ arrows and a number box — all three stay in sync. "Big" ones have no top limit: keep pressing ▶ (or type a number) to go giant.
function mBig(label,get,set,min,soft,step,fmt){const it=mRange(label,get,set,min,1e6,step,fmt);it.range.soft=soft;return it;}
function rngFmt(it,v){return it.range.fmt?it.range.fmt(v):v;}
{const r0=renderMenu;renderMenu=function(){const res=r0.apply(this,arguments);try{const rows=$('menuList').querySelectorAll('.mi');menu.items.forEach((it,i)=>{const d=rows[i];if(!it.range||!d)return;const sl=d.querySelector('input[type=range]');if(!sl||d.querySelector('.rngA'))return;const R=it.range;
      const top=v=>R.soft?Math.max(R.soft,v):R.max;const sync=v=>{sl.max=top(v);sl.value=v;num.value=+(+v).toFixed(3);const b=d.querySelector('b');if(b)b.textContent=rngFmt(it,v);if(it.after)it.after();};
      const setV=v=>{v=clamp(+(+v).toFixed(4),R.min,R.max);R.set(v);sync(R.get());};
      const mk=(t,dir)=>{const b=document.createElement('button');b.className='btn rngA';b.textContent=t;b.style.cssText='min-width:34px;padding:4px 8px;margin:0 3px;font:800 15px system-ui;touch-action:none';let tm=null,n=0;
        const step=()=>{n++;const k=R.soft?Math.min(50,Math.pow(1.12,Math.max(0,n-4))):1;setV(R.get()+dir*R.step*Math.max(1,Math.round(k)));};
        b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();n=0;step();clearTimeout(tm);const rep=()=>{step();tm=setTimeout(rep,Math.max(35,110-n*4));};tm=setTimeout(rep,380);});
        const stop=e=>{if(e)e.stopPropagation();clearTimeout(tm);tm=null;};b.addEventListener('pointerup',stop);b.addEventListener('pointerleave',stop);b.addEventListener('pointercancel',stop);b.onclick=e=>e.stopPropagation();return b;};
      const num=document.createElement('input');num.type='number';num.className='rngN';num.inputMode='decimal';num.step=R.step;num.min=R.min;if(!R.soft)num.max=R.max;num.style.cssText='width:76px;margin-left:4px;font:700 15px system-ui;padding:3px 4px;border-radius:6px;border:1px solid #888;background:#111;color:#fff';
      num.onclick=e=>e.stopPropagation();num.onpointerdown=e=>e.stopPropagation();num.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')num.blur();};num.onchange=()=>{if(num.value!=='')setV(+num.value);};
      const a=mk('◀',-1),z=mk('▶',1);const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;width:100%;gap:2px;margin-top:4px';sl.parentNode.insertBefore(row,sl);sl.style.flex='1';sl.style.minWidth='60px';sl.style.margin='0 4px';row.append(a,sl,z,num);
      const oi=sl.oninput;sl.oninput=function(){const r=oi?oi.apply(this,arguments):0;num.value=+(+sl.value).toFixed(3);return r;};sync(R.get());});}catch(e){console.warn('rng',e);}return res;};}
// ---------------------------------------------------------------- 💥 Explosion settings
function exItems(){return[mInfo('💥 Make explosions as big as you want. Use ◀ ▶, slide, or type a number — keep pressing ▶ to make them GIANT.'),
  mBig('🚀 Rocket blast size',()=>WPN.blast,v=>{WPN.blast=v;saveWpn();},0.5,50,0.5,v=>v+' m'),
  mBig('🌲 Rocket knocks down trees within',()=>WPN.destroy,v=>{WPN.destroy=v;saveWpn();},0,50,0.5,v=>v?v+' m':'none'),
  mBig('🎯 Rocket auto-detect distance (blows up next to someone)',()=>TNT.det,v=>{TNT.det=v;saveTnt();},0,30,0.5,v=>v?v+' m':'off'),
  mBig('💣 TNT blast size',()=>TNT.r,v=>{TNT.r=v;saveTnt();},1,200,1,v=>v+' m'+(WPN.blast>0?'  ('+Math.round(v/WPN.blast*10)/10+'× a rocket)':'')),
  mBig('🌲 TNT knocks down trees within',()=>TNT.dr,v=>{TNT.dr=v;saveTnt();},0,100,1,v=>v?v+' m':'none'),
  mItem(()=>'💣 TNT goes off: '+(TNT.impact?'when it hits the ground':'after the fuse timer')+'  ◀ ▶',()=>{TNT.impact=!TNT.impact;saveTnt();},()=>{TNT.impact=!TNT.impact;saveTnt();}),
  mRange('⏱ TNT fuse timer',()=>TNT.fuse,v=>{TNT.fuse=v;saveTnt();},0.5,15,0.5,v=>v+' s'),
  mItem(()=>'☠️ TNT is deadly in every mode: '+(TNT.deadly?'ON':'off (only in battle)'),()=>{TNT.deadly=!TNT.deadly;saveTnt();}),
  mItem(()=>'📱 TNT button on the phone screen: '+(LS.get('tntBtn',true)?'ON':'off'),()=>LS.set('tntBtn',!LS.get('tntBtn',true))),
  mItem('↩️ Put everything back to normal size',()=>{WPN.blast=6;WPN.destroy=4;saveWpn();Object.assign(TNT,{r:30,dr:12,fuse:3,impact:true,deadly:true,det:5});saveTnt();toast('↩️ Explosions back to normal',1500);}),
  mItem('💣 Drop a TNT now',()=>{menuToggle(false);setTimeout(tntDrop,150);}),
  mInfo('Keys: 0 = drop TNT. Phone: the red 💣 TNT button. Huge blasts can blow YOU up too — fly away fast!'),mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(x=>/Weapons|weapon/i.test(String(x.label())));L.splice(i>=0?i+1:2,0,mItem('💥 Explosion settings (TNT, blast size) ▸',()=>menuPush('💥 Explosion settings',exItems())));return L;};}
{const w0=weaponItems;weaponItems=function(){const L=w0();L.splice(L.length-1,0,mItem('💥 Explosion settings (TNT, giant blasts) ▸',()=>menuPush('💥 Explosion settings',exItems())));return L;};}
