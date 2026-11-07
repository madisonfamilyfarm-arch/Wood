// ================================================================ 🔄 FLIP button (phones have no F key) · AI pilots really flip when asked · your AI pilots show up for everyone in multiplayer / online rooms
// ---------------------------------------------------------------- 🔄 flip button
setTimeout(()=>{const b=document.createElement('button');b.id='flipBtn';b.textContent='🔄 FLIP';b.style.cssText='position:fixed;right:calc(150px + env(safe-area-inset-right));bottom:calc(150px + env(safe-area-inset-bottom));z-index:21;font:800 14px system-ui;padding:9px 12px;border-radius:14px;border:2px solid rgba(255,255,255,0.7);background:rgba(191,90,242,0.85);color:#fff;touch-action:none;display:none;cursor:pointer';
  let dn=null;b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();dn={x:e.clientX,y:e.clientY};});
  b.addEventListener('pointerup',e=>{e.stopPropagation();if(!dn)return;const dx=e.clientX-dn.x,dy=e.clientY-dn.y;dn=null;let way;if(Math.max(Math.abs(dx),Math.abs(dy))>25)way=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'back':'front');try{doFlip(way);}catch(err){}});
  b.title='Tap = flip · swipe on it = flip that way';document.body.appendChild(b);
  setInterval(()=>{const k=vkind();b.style.display=started&&!WALK.on&&!menu.open&&D.state==='flying'&&(k==='drone'||k==='heli'||k==='plane')&&(PHONE||LS.get('devMode','auto')==='phone')?'':'none';},300);},1500);
// in the Tools list too (any device)
{const b0=asBtn;asBtn=function(){b0.apply(this,arguments);const box=$('asBox');if(!box)return;let v=$('flipTool');if(!v){v=document.createElement('button');v.id='flipTool';v.className='btn';v.style.cssText=$('asBtn').style.cssText;v.textContent='🔄 Flip (F)';v.onclick=()=>{try{doFlip();}catch(e){}};box.appendChild(v);}
  const k=vkind();v.dataset.hide=(D.state==='flying'&&!WALK.on&&(k==='drone'||k==='heli'||k==='plane'))?'':'1';if(!PHONE||asBtn.open)v.style.display=v.dataset.hide?'none':'';};}
// ---------------------------------------------------------------- 🤖 AI flips that always happen (a pilot on the ground hops up first)
{const a0=aiTick;aiTick=function(dt){for(const B of AIB.L){if(B.dead||!(B.flipT>0))continue;B.flipT-=dt;if(B.kind==='drone'||B.kind==='heli'){if(B.p.y-H(B.p.x,B.p.z)<3)B.p.y+=dt*8;}if(B.flipT<=0){B.flipT=0;B.flip=0;}}
  const r=a0.apply(this,arguments);for(const B of AIB.L){if(B.dead||!(B.flipT>0)||!(B.kind==='drone'||B.kind==='heli'))continue;const k=1-B.flipT/1.8;_ae2.set(k*6.2832*2,B.yaw||0,0,'YXZ');B.q.setFromEuler(_ae2);
    mpRecv({id:B.id,n:B.name,t:'s',p:[B.p.x,B.p.y,B.p.z],r:[B.q.x,B.q.y,B.q.z,B.q.w],v:[0,0,0],st:'flying',a:1,sp:60});}return r;};}
function aiFlip(B){if(!B||B.dead)return;if(B.kind==='plane'){B.loop=2.5;return;}if(B.kind==='drone'||B.kind==='heli'){B.flipT=1.8;if(B.mode!=='fly')B.mode='fly';return;}}
{const s0=smartHear;smartHear=function(txt){const s=' '+String(txt||'').toLowerCase()+' ';if(/\b(flip|flips|trick|loop|stunt|roll|backflip|frontflip)\b/.test(s)){let W=sbWho(s.replace(/[!?.,]/g,' '));if(!W){const me=dzMe()||D.pos;const n=AIB.L.filter(B=>!B.dead).sort((a,b)=>a.p.distanceTo(me)-b.p.distanceTo(me))[0];W=n?[{B:n}]:[];}
    W.forEach((w,i)=>{if(w.B){aiFlip(w.B);sbSay(w,['Watch this! 🤸','Wheee!','Ta-da! ✨','Flip time! 🔄'][i%4],300+i*500);}else if(w.C){w.C.dance=performance.now()+4000;sbSay(w,'I can\'t flip, but I can dance! 💃',300+i*500);}});return true;}return s0.apply(this,arguments);};}
{const p0=aiApply;aiApply=function(arr){(Array.isArray(arr)?arr:[]).forEach(o=>{if(o&&/flip|trick|loop/.test(String(o.do||''))){const B=AIB.L.find(b=>b.name.replace('🤖 ','').toLowerCase()===String(o.name||'').toLowerCase());if(B)aiFlip(B);}});return p0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🌐 share your AI pilots with everyone in the game (they show up as "Ace (Madison's AI)")
const BOTNET={sp:{},last:{}};
function botNetSend(m){if(!mpOpen()||!mp.ws)return;const o=Object.assign({},m,{id:mp.id+'~'+m.id,q:++mp.seq,n:(m.n||'')+' ('+(CFG.name||'')+'\'s AI)',botnet:1});try{mp.ws.send(JSON.stringify(o));}catch(e){}}
{const r0=mpRecv;mpRecv=function(m){const r=r0.apply(this,arguments);try{if(m&&!m.botnet&&typeof m.id==='string'&&/^bot\d+$/.test(m.id)&&mp.peers[m.id]){
    if(m.t==='sp'){BOTNET.sp[m.id]=m;botNetSend(m);}
    else if(m.t==='s'){const now=performance.now();if(now-(BOTNET.last[m.id]||0)>120){BOTNET.last[m.id]=now;if(BOTNET.sp[m.id]&&now-(BOTNET.sp[m.id].sentT||0)>8000){BOTNET.sp[m.id].sentT=now;botNetSend(BOTNET.sp[m.id]);}botNetSend(m);}}}}catch(e){}return r;};}
// a pilot that switches / gets blown up disappears for everyone too
{const d0=mpDrop;mpDrop=function(id){const r=d0.apply(this,arguments);try{if(typeof id==='string'&&/^bot\d+$/.test(id)&&mpOpen()){delete BOTNET.sp[id];try{mp.ws.send(JSON.stringify({t:'bye',id:mp.id+'~'+id,q:++mp.seq}));}catch(e){}}}catch(e){}return r;};}
{const h0=mpHello;mpHello=function(){const r=h0.apply(this,arguments);try{for(const k in BOTNET.sp)botNetSend(BOTNET.sp[k]);}catch(e){}return r;};}
// when a real player leaves, their AI pilots leave with them
setInterval(()=>{try{for(const id in mp.peers){const i=id.indexOf('~');if(i>0){const owner=id.slice(0,i);const pe=mp.peers[id];if(!mp.peers[owner]&&performance.now()-(pe.t||pe.lastT||0)>8000)mpDrop(id);}}}catch(e){}},4000);
