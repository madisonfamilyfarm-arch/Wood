// ================================================================ 🗺 MAP: smooth pan (drag / ▲▼◀▶ / keys), it stays where you put it, and a 2D ⇄ 3D switch (3D = tilted bird's-eye view of the real world)
MAP.d3=LS.get('map3d',false);MAP.y3=0;
// keep the map where you panned it (doesn't slide along with your drone)
function mapPanBy(dx,dz){if(!MAP.anc)MAP.anc={x:D.pos.x,z:D.pos.z};MAP.px+=dx;MAP.pz+=dz;mapApply();}
function mapPanScreen(sx,sy){const rr=MAP.d3&&MAP.mode!=='corner'?MAP.y3:(MAP.rot?D.yaw:0),co=Math.cos(rr),si=Math.sin(rr),ss=MAP.s||1;mapPanBy(-(co*sx+si*sy)/ss,-(-si*sx+co*sy)/ss);}
function map3dOn(){return MAP.d3&&MAP.mode!=='corner';}
// ▲▼◀▶ + 2D/3D + rotate buttons on the big map
setTimeout(()=>{const box=$('mapBox');if(!box)return;const pad=document.createElement('div');pad.id='mapPad';pad.style.cssText='position:absolute;left:10px;bottom:62px;z-index:5;display:none;grid-template-columns:repeat(3,38px);grid-template-rows:repeat(3,38px);gap:3px';
  const mk=(t,c,r,fn,hold)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='grid-column:'+c+';grid-row:'+r+';font:800 16px system-ui;border-radius:9px;border:1px solid rgba(255,255,255,0.5);background:rgba(0,0,0,0.6);color:#fff;touch-action:none;cursor:pointer';
    let iv=null;b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();fn();if(hold){clearInterval(iv);iv=setInterval(fn,60);}});const stop=()=>{clearInterval(iv);iv=null;};b.addEventListener('pointerup',stop);b.addEventListener('pointerleave',stop);b.addEventListener('click',e=>e.stopPropagation());pad.appendChild(b);return b;};
  const step=()=>(MAP.s?40/MAP.s*(MAP.dpr||1):6);
  mk('▲',2,1,()=>mapPanScreen(0,-40*(MAP.dpr||1)),1);mk('◀',1,2,()=>mapPanScreen(-40*(MAP.dpr||1),0),1);mk('▶',3,2,()=>mapPanScreen(40*(MAP.dpr||1),0),1);mk('▼',2,3,()=>mapPanScreen(0,40*(MAP.dpr||1)),1);
  mk('🎯',2,2,()=>{MAP.px=MAP.pz=0;MAP.anc=null;mapApply();});
  const t=document.createElement('div');t.id='mapTop';t.style.cssText='position:absolute;right:10px;bottom:10px;z-index:5;display:none;gap:5px';
  const mk2=(txt,fn)=>{const b=document.createElement('button');b.style.cssText='font:800 14px system-ui;padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.5);background:rgba(0,0,0,0.65);color:#fff;cursor:pointer';b.textContent=txt;b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();fn(b);};t.appendChild(b);return b;};
  const d=mk2(MAP.d3?'🗺 2D':'⛰ 3D',b=>{MAP.d3=!MAP.d3;LS.set('map3d',MAP.d3);b.textContent=MAP.d3?'🗺 2D':'⛰ 3D';toast(MAP.d3?'⛰ 3D map — drag to move, scroll/pinch to zoom, ⟲ ⟳ to turn':'🗺 2D map',2000);});
  mk2('⟲',()=>{MAP.y3+=Math.PI/4;});mk2('⟳',()=>{MAP.y3-=Math.PI/4;});
  box.appendChild(pad);box.appendChild(t);
  setInterval(()=>{const big=MAP.mode!=='corner';pad.style.display=big?'grid':'none';t.style.display=big?'flex':'none';[...t.children].slice(1).forEach(b=>b.style.display=map3dOn()?'':'none');const c=$('mini');if(c)c.style.opacity=map3dOn()?'0':'1';box.style.background=map3dOn()?'transparent':'';},250);},800);
// arrow keys pan the big map (while it's open)
addEventListener('keydown',e=>{if(MAP.mode==='corner'||menu.open)return;const k={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.code];if(!k)return;e.preventDefault();e.stopImmediatePropagation();mapPanScreen(k[0]*50*(MAP.dpr||1),k[1]*50*(MAP.dpr||1));},true);
// ---------------------------------------------------------------- ⛰ the 3D map: an extra camera high above, drawn into the big-map box
const MAP3C=new THREE.PerspectiveCamera(50,1,1,5000);
const MAPBEAC=(()=>{const g=new THREE.Group();const m=new THREE.Mesh(new THREE.ConeGeometry(1,3,12),new THREE.MeshBasicMaterial({color:0xff3b30}));m.rotation.x=Math.PI;g.add(m);g.visible=false;scene.add(g);return g;})();
function map3dCenter(){const a=MAP.anc||D.pos;return new V3(a.x+MAP.px,0,a.z+MAP.pz);}
{const r0=renderer.render.bind(renderer);renderer.render=function(sc,camera){r0(sc,camera);if(camera!==cam||!map3dOn()||!started)return;try{
  const box=$('mapBox'),R=box.getBoundingClientRect();if(R.width<20)return;const c=map3dCenter(),view=MAP.view*1.8;c.y=H(c.x,c.z);
  const dist=view*1.6;MAP3C.aspect=R.width/R.height;MAP3C.position.set(c.x+Math.sin(MAP.y3)*dist*0.75,c.y+dist*0.85,c.z+Math.cos(MAP.y3)*dist*0.75);MAP3C.lookAt(c);MAP3C.far=dist*6;MAP3C.updateProjectionMatrix();
  const me=WALK.on?WALK.pos:D.pos;MAPBEAC.position.set(me.x,me.y+view*0.06+2,me.z);MAPBEAC.scale.setScalar(Math.max(1,view/25));MAPBEAC.visible=true;
  const fog=sc.fog;sc.fog=null;const y=innerHeight-R.bottom;renderer.setScissorTest(true);renderer.setViewport(R.left,y,R.width,R.height);renderer.setScissor(R.left,y,R.width,R.height);renderer.clearDepth();r0(sc,MAP3C);
  renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight);sc.fog=fog;MAPBEAC.visible=false;}catch(e){renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight);}};}
// taps on the 3D map land on the real ground (track points, build mode, teleport all keep working)
{const m0=mapToWorld;mapToWorld=function(cx,cy){if(!map3dOn())return m0.apply(this,arguments);const R=$('mapBox').getBoundingClientRect();const nd=new THREE.Vector2((cx-R.left)/R.width*2-1,-((cy-R.top)/R.height)*2+1);
  const ray=new THREE.Raycaster();ray.setFromCamera(nd,MAP3C);const o=ray.ray.origin.clone(),d=ray.ray.direction;for(let t=0;t<6000;t+=2){const p=o.clone().addScaledVector(d,t);if(p.y<=H(p.x,p.z))return{x:p.x,z:p.z};}const p=o.clone().addScaledVector(d,(o.y-0)/Math.max(0.01,-d.y));return{x:p.x,z:p.z};};}
// ---------------------------------------------------------------- 📱 phone layout: the tool buttons fold into one 🎛 button (they covered the right stick)
function devIsPhone(){const m=LS.get('devMode','auto');if(m==='phone')return true;if(m==='computer'||m==='vr')return false;return matchMedia('(hover: none)').matches||Math.min(innerWidth,innerHeight)<500;}
let PHONE=devIsPhone();
{const b0=asBtn;asBtn=function(){b0.apply(this,arguments);const box=$('asBox');if(!box||!PHONE)return;let t=$('asFold');
  if(!t){t=document.createElement('button');t.id='asFold';t.className='btn';t.style.cssText=$('asBtn').style.cssText+';font-size:15px;padding:6px 11px';t.onclick=()=>{asBtn.open=!asBtn.open;asBtn();};box.insertBefore(t,box.firstChild);
    box.addEventListener('click',e=>{if(e.target!==t&&asBtn.open){setTimeout(()=>{asBtn.open=false;asBtn();},700);}});}
  t.textContent=asBtn.open?'✕ Close':'🎛 Tools';[...box.children].forEach(c=>{if(c!==t)c.style.display=asBtn.open?(c.dataset.hide?'none':''):'none';});
  box.style.top='calc(84px + env(safe-area-inset-top))';box.style.maxHeight='calc(100vh - 100px)';box.style.overflowY='auto';};}
// remember which buttons the normal code hides (so opening the fold doesn't show them)
{const b1=asBtn;asBtn=function(){b1.apply(this,arguments);if(!PHONE)return;const sb=$('safeBtn'),cb=$('chuteBtn');if(sb){const k=vkind();sb.dataset.hide=((k==='drone'||k==='heli')&&!WALK.on)?'':'1';}if(cb)cb.dataset.hide=(chuteCan()||CHUTE.on)?'':'1';};}
// 🚂 the default track keeps away from the launch pad and the campsite (it was running campers over)
{const d0=trainDefaultPts;trainDefaultPts=function(){const P=d0.apply(this,arguments);const avoid=[[PAD.x,PAD.z,24],[16,-14,26],[TRUCK.x,TRUCK.z,14]];
  return P.map(p=>{let [x,z]=p;for(const [ax,az,r] of avoid){const dx=x-ax,dz=z-az,d=Math.hypot(dx,dz);if(d<r){const k=(r/(d||1));x=ax+dx*k;z=az+dz*k;}}return[x,z];});};}
if(!TRAIN.mine.length)trainBuild();
// campers hear the horn and jump out of the way instead of getting squashed
{const c0=dzCampDie;dzCampDie=function(C,txt){if(/train/i.test(String(txt))){if(!C.dodgeT||performance.now()>C.dodgeT){C.dodgeT=performance.now()+3000;C.x+=(Math.random()<0.5?-1:1)*5;C.z+=(Math.random()<0.5?-1:1)*5;C.g.position.set(C.x,H(C.x,C.z),C.z);beep(330,0.25,0.05);}return;}return c0.apply(this,arguments);};}
// ---------------------------------------------------------------- 💬 chat on the phone: the bar moves to the TOP (the keyboard was covering it + the Send button), big Send, keyboard "send" key works
{const o0=chatOpen;chatOpen=function(){chatEl();const bar=$('chatBar'),i=$('chatIn'),go=$('chatGo');
  if(!bar.dataset.fixed){bar.dataset.fixed=1;i.setAttribute('enterkeyhint','send');i.setAttribute('autocapitalize','sentences');
    const f=document.createElement('form');f.style.cssText='display:flex;flex:1;gap:6px;margin:0';f.onsubmit=e=>{e.preventDefault();const v=i.value;if(v.trim()){chatSend(v);i.value='';}chatClose();};bar.insertBefore(f,i);f.appendChild(i);f.appendChild(go);go.type='submit';go.onclick=null;
    go.textContent='Send ➤';go.style.cssText+=';font:800 16px system-ui;padding:8px 16px;min-width:84px';i.placeholder=PHONE?'Type a message, then tap Send ➤':i.placeholder;
    if(PHONE){bar.style.cssText+=';position:fixed;top:calc(6px + env(safe-area-inset-top));bottom:auto;left:8px;right:8px;width:auto;max-width:none;transform:none;z-index:90;background:rgba(0,0,0,0.88);padding:6px;border-radius:12px;box-sizing:border-box';i.style.cssText+=';flex:1;min-width:0;font-size:16px;background:#fff;color:#111;padding:10px 12px;border-radius:10px;border:0;outline:none';}}
  return o0.apply(this,arguments);};}
// a 💬 button opens it on the phone (no Enter key needed)
setTimeout(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='💬');if(b&&!b.dataset.hooked){b.dataset.hooked=1;b.addEventListener('click',()=>setTimeout(()=>{const bar=$('chatBar');if(!bar||bar.style.display==='none')chatOpen();},50));}},1500);
