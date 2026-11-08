// v74: 📦 import 3D model works on iPhone (any file can be picked; .glb/.gltf checked after) · 🦑 built-in crazy parts that need no file at all
importModel=function(cb){const i=document.createElement('input');i.type='file';
  i.onchange=()=>{const f=i.files[0];if(!f)return;if(!/\.(glb|gltf)$/i.test(f.name)){toast('📦 Pick a .glb or .gltf 3D model file',2500);return;}if(f.size>25e6){toast('📦 That file is too big (max 25 MB)',2500);return;}
    f.arrayBuffer().then(buf=>{const mid=midOf(buf,f.name),name=f.name.replace(/\.(glb|gltf)$/i,'').slice(0,30);MODELS[mid]={buf,name};try{idbPut(mid,{buf,name});}catch(e){}parseModel(mid);toast('📦 '+name+' added',2500);cb&&cb(mid,name);}).catch(e=>toast('📦 Couldn\'t open that file: '+e.message,3000));};
  document.body.appendChild(i);i.style.display='none';i.click();setTimeout(()=>i.remove(),60000);};
// built-in crazy models (made from code, so they work offline and everyone in multiplayer has them)
const XM=(c,e)=>new THREE.MeshStandardMaterial({color:c,emissive:e||0x000000,metalness:0.3,roughness:0.5});
function mkSquid(){const G=new THREE.Group();const body=new THREE.Mesh(new THREE.SphereGeometry(0.5,32,24),XM(0x8e44ad));body.scale.set(1,1.25,1);body.position.y=0.55;G.add(body);
  for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(0.48-Math.abs(i-2)*0.08,0.03,10,40),XM([0xff2d55,0xffd60a,0x30d158,0x0a84ff,0xff9f0a][i],[0x550010,0x554400,0x005510,0x002255,0x552200][i]));r.rotation.x=Math.PI/2;r.position.y=0.25+i*0.16;G.add(r);}
  for(const s of [-1,1]){const w=new THREE.Mesh(new THREE.SphereGeometry(0.16,20,16),XM(0xffffff));w.position.set(s*0.2,0.85,-0.38);G.add(w);const p=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),XM(0x111111));p.position.set(s*0.23,0.83,-0.52);G.add(p);}
  const hat=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.2,0.18,20),XM(0xff2d55));hat.position.y=1.22;G.add(hat);for(let i=0;i<3;i++){const bl=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.02,0.1),XM([0xffd60a,0x30d158,0x0a84ff][i]));bl.position.y=1.33;bl.rotation.y=i*2.094;G.add(bl);}
  for(let i=0;i<6;i++){const a=i/6*6.283,pts=[];for(let k=0;k<=12;k++){const t=k/12;pts.push(new THREE.Vector3(Math.cos(a)*(0.3+t*0.45)+Math.sin(t*8+i)*0.08,0.15-t*0.9,Math.sin(a)*(0.3+t*0.45)+Math.cos(t*8+i)*0.08));}
    G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,0.055,10,false),XM(0xbf5af2)));const end=pts[12];const nz=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.16,14,1,true),XM(0x8e8e93));nz.position.copy(end);G.add(nz);const fl=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.22,12),XM(0xff9f0a,0xff5000));fl.position.copy(end).add(new THREE.Vector3(0,-0.16,0));fl.rotation.x=Math.PI;G.add(fl);}
  for(const s of [-1,1]){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(0.45,0.15);sh.lineTo(0.35,-0.2);sh.lineTo(0,0);const f=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.03,bevelEnabled:false}),XM(0x0a84ff));f.position.set(s*0.45,0.55,0);f.rotation.y=s>0?0:Math.PI;G.add(f);}
  const can=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,0.4,14),XM(0x3a3a3c));can.rotation.x=Math.PI/2;can.position.set(0,0.45,-0.6);G.add(can);return G;}
function mkToaster(){const G=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.6,0.5),XM(0xc0c6cc));b.position.y=0.3;G.add(b);
  for(const x of [-0.18,0.18]){const sl=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.05,0.38),XM(0x111111));sl.position.set(x,0.61,0);G.add(sl);const t=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.32,0.34),XM(0xd2a05a));t.position.set(x,0.72,0);G.add(t);}
  for(const s of [-1,1]){const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(0.3,0.5,0.8,0.55,1.0,0.25);sh.lineTo(0.7,0.05);sh.lineTo(0.85,-0.05);sh.lineTo(0,0);const w=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.04,bevelEnabled:false}),XM(0xffffff));w.position.set(s*0.45,0.35,0);w.rotation.y=s>0?0:Math.PI;G.add(w);}
  for(const s of [-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.1,16,12),XM(0xffffff));e.position.set(s*0.18,0.42,-0.27);G.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(0.045,12,8),XM(0x111111));p.position.set(s*0.18,0.42,-0.36);G.add(p);}
  const lever=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.18,0.06),XM(0xff3b30));lever.position.set(0.48,0.4,0);G.add(lever);
  const fl=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.4,14),XM(0xff9f0a,0xff5000));fl.rotation.x=-Math.PI/2;fl.position.set(0,0.3,0.45);G.add(fl);return G;}
function mkDonutSaucer(){const G=new THREE.Group();const d=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.22,20,40),XM(0xd2a05a));d.rotation.x=Math.PI/2;d.position.y=0.25;G.add(d);
  const ic=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.17,20,40,Math.PI*2),XM(0xff6fb5));ic.rotation.x=Math.PI/2;ic.position.y=0.33;ic.scale.z=0.6;G.add(ic);
  const cols=[0xffd60a,0x30d158,0x0a84ff,0xffffff,0xff3b30];for(let i=0;i<26;i++){const a=Math.random()*6.283,r=0.36+Math.random()*0.28;const s=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.02,0.02),XM(cols[i%5]));s.position.set(Math.cos(a)*r,0.45,Math.sin(a)*r);s.rotation.y=Math.random()*3;G.add(s);}
  const dome=new THREE.Mesh(new THREE.SphereGeometry(0.22,20,14,0,6.283,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x9fd3ff,transparent:true,opacity:0.6}));dome.position.y=0.3;G.add(dome);
  const al=new THREE.Mesh(new THREE.SphereGeometry(0.09,14,10),XM(0x39ff14));al.position.y=0.38;G.add(al);
  for(let i=0;i<8;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.04,8,6),XM(0xffffff,0x88ff88));const a=i/8*6.283;l.position.set(Math.cos(a)*0.72,0.25,Math.sin(a)*0.72);G.add(l);}return G;}
const BIM=[['bi_squid','🦑','Squidrocket',mkSquid],['bi_toaster','🍞','Flying toaster',mkToaster],['bi_donut','🍩','Donut UFO',mkDonutSaucer]];
BIM.forEach(([mid,ic,name,fn])=>{try{MODELS[mid]={name,builtin:true,gltf:{scene:fn(),animations:[]}};}catch(e){}});
{const it0=WSC.findIndex(x=>x&&x.t==='model');const items=BIM.map(([mid,ic,name])=>({t:'model',ic,n:name+' (crazy part)',o:{mid,nm:name,sc:1}}));
  const ins=(L,at)=>{if(at>=0)L.splice(at,0,...items);else L.push(...items);};ins(WSC,it0);ins(WSI,WSI.findIndex(x=>x&&x.t==='model'));try{ins(WSC0,WSC0.findIndex(x=>x&&x.t==='model'));}catch(e){}}
// never ask the internet / other players for a built-in model
{const l0=loadModel;loadModel=function(mid){if(String(mid).startsWith('bi_'))return;return l0.apply(this,arguments);};}
// 📂 opening a saved build works on iPhone (no file-type filter) and keeps its wiring
loadDroneFile=function(cb){const i=document.createElement('input');i.type='file';i.style.display='none';document.body.appendChild(i);
  i.onchange=()=>{const f=i.files[0];i.remove();if(!f)return;f.text().then(t=>{let j;try{j=JSON.parse(t);}catch(e){toast('📂 That file isn\'t a build file (.drone.json)',3000);return;}const raw=j.spec||j;if(!raw||!(raw.parts||raw.rotors)){toast('📂 That file has no build in it',3000);return;}
    const sp=sanitize(raw);try{if(raw.wires&&!sp.wires)sp.wires=raw.wires;}catch(e){}cb(sp);toast('📂 Loaded '+(raw.name||'build'),2200);}).catch(e=>toast('📂 Couldn\'t read that file: '+e.message,3000));};i.click();};
// the 📦 import button also accepts a saved build (.json) and opens it in the builder
{const m0=importModel;importModel=function(cb){const i=document.createElement('input');i.type='file';i.style.display='none';document.body.appendChild(i);
  i.onchange=()=>{const f=i.files[0];i.remove();if(!f)return;if(/\.json$/i.test(f.name)){f.text().then(t=>{try{const j=JSON.parse(t),raw=j.spec||j,sp=sanitize(raw);WS.parts=(sp.parts||[]).map(cleanPart);WS.wires=raw.wires||sp.wires||[];WS.name=raw.name||WS.name;if(raw.flyAs)WS.flyAs=raw.flyAs;WS.bigF=+raw.bigF||1;try{$('wsBig').textContent='📏 Size in the world: '+WS.bigF+'×';}catch(e){}WS.sel=-1;wsChanged();toast('📂 Opened your build "'+(raw.name||'')+'"',2500);}catch(e){toast('📂 That .json isn\'t a build file',2500);}});return;}
    if(!/\.(glb|gltf)$/i.test(f.name)){toast('📦 Pick a .glb / .gltf 3D model (or a .drone.json build)',3000);return;}if(f.size>25e6){toast('📦 That file is too big (max 25 MB)',2500);return;}
    f.arrayBuffer().then(buf=>{const mid=midOf(buf,f.name),name=f.name.replace(/\.(glb|gltf)$/i,'').slice(0,30);MODELS[mid]={buf,name};try{idbPut(mid,{buf,name});}catch(e){}parseModel(mid);toast('📦 '+name+' added',2500);cb&&cb(mid,name);});};i.click();};}
