// ================================================================ 🧗 things you can stand / land on: the fire tower deck (with a ladder), roofs, crates, rocks, walls…
// ================================================================ 🪨 the rock crawler climbs up ANYTHING (trees, walls, rocks, the tower)
const SURF=[];
function surfY(x,z,y){let best=-1e9;const top=y+0.6;
  for(const s of SURF)if(x>s.x0&&x<s.x1&&z>s.z0&&z<s.z1&&s.y<=top&&s.y>best)best=s.y;
  const L=CG.get(Math.floor(x/CGS)+','+Math.floor(z/CGS));if(L)for(const o of L){let t=-1e9;
    if(o.t==='b'){if(x>o.x0&&x<o.x1&&z>o.z0&&z<o.z1)t=o.y1;}
    else if(o.t==='v'){if(o.r>0.25&&Math.hypot(x-o.x,z-o.z)<o.r)t=o.y1;}
    else if(o.t==='s'){const d=Math.hypot(x-o.x,z-o.z);if(d<o.r*0.8)t=o.y+Math.sqrt(Math.max(0,o.r*o.r*0.64-d*d));}
    if(t<=top&&t>best)best=t;}
  return best;}
// fire lookout tower: a deck all the way round the cabin at the top + a ladder up the south side
const FT={x:-40,z:-40};
(function(){const fx=FT.x,fz=FT.z,fy=H(fx,fz),dy=fy+18;FT.top=dy;FT.y0=fy;
  const wood=MAT.wood,metal=MAT.metal;const deck=new THREE.Mesh(GEO.box,wood);deck.scale.set(8,0.22,8);deck.position.set(fx,dy-0.11,fz);scene.add(deck);
  SURF.push({x0:fx-4,x1:fx+4,z0:fz-4,z1:fz+4,y:dy});
  for(const [ax,az,lx,lz] of [[0,-4,8,0.08],[0,4,8,0.08],[-4,0,0.08,8],[4,0,0.08,8]]){if(az===4)continue;const r=new THREE.Mesh(GEO.box,metal);r.scale.set(lx||0.08,0.08,lz||0.08);r.position.set(fx+ax,dy+1,fz+az);scene.add(r);
    for(let k=-4;k<=4;k+=2){const p=new THREE.Mesh(GEO.box,metal);p.scale.set(0.06,1,0.06);p.position.set(fx+(lx>1?k:ax),dy+0.5,fz+(lz>1?k:az));scene.add(p);}}
  // south railing has a gap for the ladder
  for(const sx of[-1,1]){const r=new THREE.Mesh(GEO.box,metal);r.scale.set(3,0.08,0.08);r.position.set(fx+sx*2.5,dy+1,fz+4);scene.add(r);}
  // the ladder
  const lz=fz+4.15;for(const sx of[-0.35,0.35]){const rail=new THREE.Mesh(GEO.box,metal);rail.scale.set(0.07,18+1.2,0.07);rail.position.set(fx+sx,fy+9.6,lz);scene.add(rail);}
  for(let y=0.4;y<18;y+=0.4){const rung=new THREE.Mesh(GEO.box,metal);rung.scale.set(0.7,0.04,0.04);rung.position.set(fx,fy+y,lz);scene.add(rung);}
  FT.ladder={x:fx,z:lz};label('🪜 Climb me (walk into the ladder)',fx,fy+2.6,lz+0.6,4.2);
  // the drone pad on the roof deck
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,0.05,20),new THREE.MeshLambertMaterial({color:0xffd60a}));pad.position.set(fx+2.9,dy+0.03,fz-2.9);scene.add(pad);})();
// walking: stand on decks / roofs / crates, step up onto low things, climb the ladder
{const w0=tickWalk;tickWalk=function(dt){
  if(WALK.on&&FT.ladder&&!menu.open&&!WS.open&&!repair.open){const L=FT.ladder,d=Math.hypot(WALK.pos.x-L.x,WALK.pos.z-L.z),k=keys,inp=WALK.inp||Z0;
    const up=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)||(Math.abs(inp.ly)>0.2?Math.sign(inp.ly):0);
    if(d<0.9&&WALK.pos.y<FT.top+0.05&&(up!==0||WALK.pos.y>FT.y0+0.3)){WALK.climb=true;WALK.vy=0;WALK.pos.y=clamp(WALK.pos.y+up*2.2*dt,FT.y0,FT.top+0.05);
      if(WALK.pos.y>=FT.top&&up>0){WALK.pos.z=L.z-0.9;WALK.pos.y=FT.top;WALK.climb=false;WALK.yaw=Math.PI;WALK.pitch=-0.2;toast('🔥 Top of the fire tower! Land your drone on the yellow pad',2500);}
      if(WALK.pos.y<=FT.y0+0.01&&up<0){WALK.climb=false;WALK.pos.z=L.z+1.0;}
      WALK.bob+=Math.abs(up)*dt*3;return;}
    WALK.climb=false;}
  return w0.apply(this,arguments);};}
// cars: stand on top of things; the crawler drives straight up anything
{const g0=carGround;carGround=function(x,z){const g=g0(x,z);if(!DR||vkind()!=='car')return g;const s=surfY(x,z,D.pos.y-(ST.legs||0));return s>g?s:g;};}
{const g0=groundY;groundY=function(x,z){const g=g0(x,z);if(!DR||vkind()==='car'||vkind()==='boat')return g;const s=surfY(x,z,D.pos.y);return s+(ST.legs||0)>g?s+(ST.legs||0):g;};}
{const s0=stats;stats=function(sp){const st=s0(sp);if(st&&sp&&(sp.style==='crawler'||sp.flyAs==='crawler')){st.crawl=true;st.climb=true;}return st;};ST=stats(SPEC);}
// ---------------- ⬇ photos + videos go straight to your Downloads folder (and stay in Menu → 📸 Photos & videos too)
function autoDl(it){if(CFG.autoDl===false||!it||!it.url)return;try{const a=document.createElement('a');a.href=it.url;a.download='woods-rc-'+(it.type==='photo'?'photo':'video')+'-'+it.t.toISOString().replace(/[:.]/g,'-').slice(0,19)+'.'+(it.type==='photo'?'jpg':it.ext||'webm');document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),500);toast(it.type==='photo'?'📸 Photo saved to Downloads':'🎬 Video saved to Downloads',1600);}catch(e){}}
{const u0=gallery.unshift.bind(gallery);gallery.unshift=function(it){const r=u0(it);setTimeout(()=>autoDl(it),50);return r;};}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Photos & videos/.test(it.label());}catch(e){return false;}});
  L.splice(i+1,0,mItem(()=>'⬇ Photos + videos straight to Downloads: '+(CFG.autoDl===false?'off':'ON'),()=>{CFG.autoDl=CFG.autoDl===false;saveCfg();}));return L;};}
// ---------------- 🔥 fire tower cab you can walk around inside (windows all round) + 🛗 elevator up the middle (3 seconds)
function ftCab(fx,fy,fz){const y0=fy+18,wood=MAT.wood,glass=new THREE.MeshLambertMaterial({color:0x9fd3ff,transparent:true,opacity:0.28,depthWrite:false,side:THREE.DoubleSide});
  const box=(sx,sy,sz,x,y,z,m)=>{const b=new THREE.Mesh(GEO.box,m||wood);b.scale.set(sx,sy,sz);b.position.set(x,y,z);scene.add(b);return b;};
  const T=0.14,S=4,hS=S/2;
  // north, east, west walls: wood below + above, glass window band in between
  for(const [ax,az,lx,lz] of [[0,-hS,S,T],[hS,0,T,S],[-hS,0,T,S]]){box(lx,1.0,lz,fx+ax,y0+0.5,fz+az);box(lx,0.4,lz,fx+ax,y0+2.2,fz+az);box(lx*(lx>1?0.98:1),1.0,lz*(lz>1?0.98:1),fx+ax,y0+1.5,fz+az,glass);
    addBox(fx+ax-lx/2,y0,fz+az-lz/2,fx+ax+lx/2,y0+2.4,fz+az+lz/2);}
  // south wall with a door in the middle
  for(const sx of[-1,1]){const w=(S-1.4)/2,cx=fx+sx*(0.7+w/2);box(w,1.0,T,cx,y0+0.5,fz+hS);box(w,0.4,T,cx,y0+2.2,fz+hS);box(w,1.0,T,cx,y0+1.5,fz+hS,glass);addBox(cx-w/2,y0,fz+hS-T/2,cx+w/2,y0+2.4,fz+hS+T/2);}
  box(1.4,0.4,T,fx,y0+2.2,fz+hS);
  // window frames (corner posts) + ceiling
  for(const [px,pz] of [[-hS,-hS],[hS,-hS],[-hS,hS],[hS,hS]])box(0.12,2.4,0.12,fx+px,y0+1.2,fz+pz);
  box(S,0.1,S,fx,y0+2.4,fz);
  // inside: a fire-finder map table and a stool
  box(1.0,0.06,1.0,fx-0.9,y0+0.95,fz-0.9);box(0.1,0.9,0.1,fx-0.9,y0+0.45,fz-0.9);const mp2=new THREE.Mesh(new THREE.CircleGeometry(0.45,24),new THREE.MeshLambertMaterial({color:0xd8c690}));mp2.rotation.x=-Math.PI/2;mp2.position.set(fx-0.9,y0+0.99,fz-0.9);scene.add(mp2);
  box(0.4,0.06,0.4,fx+0.9,y0+0.6,fz-0.9);box(0.08,0.6,0.08,fx+0.9,y0+0.3,fz-0.9);}
const ELEV={t:-1,dir:0,car:null,y0:0,y1:0};
(function(){const fx=FT.x,fz=FT.z;ELEV.y0=FT.y0;ELEV.y1=FT.top;const g=new THREE.Group(),m=MAT.metal;
  const fl=new THREE.Mesh(GEO.box,new THREE.MeshLambertMaterial({color:0x666a70}));fl.scale.set(1.3,0.08,1.3);g.add(fl);
  for(const [x,z] of [[-0.62,-0.62],[0.62,-0.62],[-0.62,0.62],[0.62,0.62]]){const p=new THREE.Mesh(GEO.box,m);p.scale.set(0.05,2.2,0.05);p.position.set(x,1.1,z);g.add(p);}
  const top=new THREE.Mesh(GEO.box,new THREE.MeshLambertMaterial({color:0xffd60a}));top.scale.set(1.3,0.08,1.3);top.position.y=2.2;g.add(top);
  g.position.set(fx,FT.y0+0.04,fz);scene.add(g);ELEV.car=g;
  // the shaft rails
  for(const sx of[-0.7,0.7]){const r=new THREE.Mesh(GEO.box,m);r.scale.set(0.06,18,0.06);r.position.set(fx+sx,FT.y0+9,fz-0.7);scene.add(r);}
  label('🛗 Elevator',fx,FT.y0+3,fz+0.8,2.6);})();
function elevBtn(){let b=$('elevB');if(!b){b=document.createElement('button');b.id='elevB';b.className='btn';b.style.cssText='position:fixed;left:50%;bottom:120px;transform:translateX(-50%);z-index:14;font:900 18px system-ui,sans-serif;padding:12px 18px;border-radius:14px;background:rgba(255,214,10,0.92);color:#111;display:none';
    b.onclick=e=>{e.stopPropagation();elevGo();};document.body.appendChild(b);}return b;}
function elevGo(){if(ELEV.dir)return;const atTop=WALK.pos.y>FT.top-1;ELEV.dir=atTop?-1:1;ELEV.t=0;WALK.pos.set(FT.x,atTop?FT.top:FT.y0,FT.z);beep(600,0.1,0.05);toast(atTop?'🛗 Going down…':'🛗 Going up…',1500);}
function elevTick(dt){const b=elevBtn();if(!WALK.on||menu.open||WS.open){b.style.display='none';return;}
  if(ELEV.dir){ELEV.t+=dt/3;const k=smooth(0,1,Math.min(1,ELEV.t)),y=ELEV.dir>0?lerp(ELEV.y0,ELEV.y1,k):lerp(ELEV.y1,ELEV.y0,k);WALK.pos.set(FT.x,y,FT.z);WALK.vy=0;ELEV.car.position.y=y+0.04;
    if(ELEV.t>=1){const up=ELEV.dir>0;ELEV.dir=0;beep(1000,0.15,0.05);toast(up?'🔥 Top of the fire tower — walk around, look out the windows (door + deck outside)':'🛗 Back on the ground',2600);}b.style.display='none';return;}
  const d=Math.hypot(WALK.pos.x-FT.x,WALK.pos.z-FT.z),atTop=Math.abs(WALK.pos.y-FT.top)<0.6,atBot=WALK.pos.y<FT.y0+1.5;
  const show=d<(atTop?1.0:2.4)&&(atTop||atBot);b.style.display=show?'block':'none';if(show)b.textContent=atTop?'🛗 Elevator DOWN':'🛗 Elevator UP';
  if(show&&!ELEV.dir&&!atTop)ELEV.car.position.y=FT.y0+0.04;if(show&&atTop)ELEV.car.position.y=FT.top+0.04;}
{const w0=tickWalk;tickWalk=function(dt){if(WALK.on&&ELEV.dir){elevTick(dt);return;}const r=w0.apply(this,arguments);try{elevTick(dt);}catch(e){}return r;};}
