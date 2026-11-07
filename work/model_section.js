// ---------------------------------------------------------------- 📦 your own 3D models (.glb / .gltf) — animated ones keep moving. Stored on this device, sent to friends in multiplayer.
const MODELS={},MIXERS=[];
const IDB={db:null};
function idb(){return new Promise((res,rej)=>{if(IDB.db)return res(IDB.db);try{const q=indexedDB.open('woodsrc',1);q.onupgradeneeded=()=>q.result.createObjectStore('models');q.onsuccess=()=>{IDB.db=q.result;res(IDB.db);};q.onerror=()=>rej(q.error);}catch(e){rej(e);}});}
function idbPut(k,v){return idb().then(db=>new Promise(res=>{try{const t=db.transaction('models','readwrite');t.objectStore('models').put(v,k);t.oncomplete=res;t.onerror=res;}catch(e){res();}})).catch(()=>{});}
function idbGet(k){return idb().then(db=>new Promise(res=>{try{const q=db.transaction('models').objectStore('models').get(k);q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null);}catch(e){res(null);}})).catch(()=>null);}
const _scripts={};
function loadScriptOnce(src){if(_scripts[src])return _scripts[src];return _scripts[src]=new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>{delete _scripts[src];rej(new Error('offline'));};document.head.appendChild(s);});}
function gltfLib(){const base='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';return loadScriptOnce(base+'loaders/GLTFLoader.js').then(()=>loadScriptOnce(base+'utils/SkeletonUtils.js').catch(()=>{}));}
function parseModel(mid){const M=MODELS[mid];if(!M||!M.buf||M.gltf||M.parsing)return;M.parsing=true;
  gltfLib().then(()=>{new THREE.GLTFLoader().parse(M.buf,'',g=>{M.gltf=g;M.parsing=false;modelsChanged();},e=>{M.parsing=false;M.err=1;toast('📦 Couldn\'t read the 3D model "'+(M.name||'')+'"',3000);});})
    .catch(()=>{M.parsing=false;toast('📦 Loading 3D models needs the internet once (to fetch the model reader)',3500);});}
function modelObj(p,opt){const holder=new THREE.Group(),M=MODELS[p.mid];
  if(M&&M.gltf){const src=M.gltf.scene;let o;try{o=THREE.SkeletonUtils?THREE.SkeletonUtils.clone(src):src.clone(true);}catch(e){o=src.clone(true);}
    src.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(src),sz=bb.getSize(new V3()),c=bb.getCenter(new V3()),k=0.2*p.sc/Math.max(sz.x,sz.y,sz.z,1e-6);o.scale.multiplyScalar(k);o.position.set(-c.x*k,-c.y*k,-c.z*k);
    if(opt&&opt.ghost)o.traverse(m=>{if(m.isMesh)m.material=new THREE.MeshBasicMaterial({color:0x88ccff,transparent:true,opacity:0.3,depthWrite:false});});
    holder.add(o);if(M.gltf.animations&&M.gltf.animations.length&&!(opt&&opt.ghost)){const mx=new THREE.AnimationMixer(o);M.gltf.animations.forEach(cl=>{try{mx.clipAction(cl).play();}catch(e){}});MIXERS.push({mx,h:holder});}}
  else{const b=new THREE.Mesh(new THREE.BoxGeometry(0.2*p.sc,0.2*p.sc,0.2*p.sc),new THREE.MeshBasicMaterial({color:0x88ccff,wireframe:true}));holder.add(b);
    if(!M)loadModel(p.mid);else if(M.buf)parseModel(p.mid);}
  return holder;}
function loadModel(mid){if(!mid||MODELS[mid])return;MODELS[mid]={loading:true};idbGet(mid).then(v=>{if(v&&v.buf){MODELS[mid]={buf:v.buf,name:v.name};parseModel(mid);}else{MODELS[mid]={missing:true};if(mpOpen())mpSend({t:'mreq',mid});}});}
let _mcT=0;function modelsChanged(){clearTimeout(_mcT);_mcT=setTimeout(()=>{
  const uses=sp=>sp&&sp.parts&&sp.parts.some(p=>p.t==='model');
  if(uses(SPEC)&&DR){const keep={s:D.state,a:D.armed};rebuildDrone();D.state=keep.s;D.armed=keep.a;}
  if(WS.open)wsChanged();
  for(const id in mp.peers){const pe=mp.peers[id];if(uses(pe.spec)){pe.specJ='';MPH.sp({spec:pe.spec,rad:pe.rad,col:pe.col},pe);}}},120);}
function tickMixers(dt){for(let i=MIXERS.length-1;i>=0;i--){const m=MIXERS[i];let r=m.h;while(r.parent)r=r.parent;if(r!==scene&&r!==ED.scene){MIXERS.splice(i,1);continue;}m.mx.update(dt);}}
function midOf(buf,name){const u=new Uint8Array(buf);let h=2166136261;for(let i=0;i<u.length;i+=Math.max(1,Math.floor(u.length/4096)))h=Math.imul(h^u[i],16777619);return 'm'+(h>>>0).toString(36)+u.length.toString(36);}
function importModel(cb){const i=document.createElement('input');i.type='file';i.accept='.glb,.gltf,model/gltf-binary,model/gltf+json';
  i.onchange=()=>{const f=i.files[0];if(!f)return;if(f.size>25e6){toast('📦 That file is too big (max 25 MB)',2500);return;}
    f.arrayBuffer().then(buf=>{const mid=midOf(buf,f.name),name=f.name.replace(/\.(glb|gltf)$/i,'').slice(0,30);MODELS[mid]={buf,name};idbPut(mid,{buf,name});parseModel(mid);toast('📦 '+name+' added'+(f.size>6e6?' (big file — friends won\'t get a copy in multiplayer)':''),2500);cb&&cb(mid,name);});};i.click();}
// multiplayer: ask friends for models we don't have, send ours when asked
function needModels(sp){if(!sp||!sp.parts)return;sp.parts.forEach(p=>{if(p.t!=='model'||!p.mid)return;const M=MODELS[p.mid];if(!M)loadModel(p.mid);else if(M.missing&&!M.asked){M.asked=1;mpSend({t:'mreq',mid:p.mid});}});}
function b64(buf){const u=new Uint8Array(buf);let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);}
function unb64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;}
function sendModel(mid){const M=MODELS[mid];if(!M||!M.buf||M.buf.byteLength>6e6)return;if(M.sentAt&&performance.now()-M.sentAt<3000)return;M.sentAt=performance.now();mpSend({t:'mdl',mid,name:M.name,b64:b64(M.buf)});}
function gotModel(m){if(!m.mid||!m.b64)return;const M=MODELS[m.mid];if(M&&(M.buf||M.gltf))return;const buf=unb64(m.b64);MODELS[m.mid]={buf,name:m.name};idbPut(m.mid,{buf,name:m.name});parseModel(m.mid);}
// rocket / jet flames grow with the throttle, hover pads glow
function tickFlames(dt){
  if(DR&&DR.flames&&DR.flames.length){const k=vkind(),I=WALK.inp||Z0;let u=0;
    if(D.state==='flying'||D.state==='takeoff')u=k==='plane'?D.thr:k==='car'||k==='boat'?Math.min(1,Math.abs(I.ly)+Math.abs(I.ry)):clamp(0.35+Math.abs(I.ly)*0.4+Math.hypot(I.rx,I.ry)*0.5,0,1);
    DR.flames.forEach(f=>{if(f.t==='hover'){f.m.material.color.setHSL(0.53,1,0.35+0.3*u+Math.random()*0.05);return;}f.m.visible=u>0.03;f.m.scale.set(1,0.4+u*0.9+Math.random()*0.25,1);});}
  for(const id in mp.peers){const pe=mp.peers[id];if(pe.mesh&&pe.mesh.flames)pe.mesh.flames.forEach(f=>{if(f.t==='hover')return;f.m.visible=pe.sp>0;f.m.scale.set(1,0.6+Math.random()*0.5,1);});}
}
