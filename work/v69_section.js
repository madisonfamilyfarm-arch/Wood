// v69: 💾 save file opens the "where do you want to save it" box · 🪖 one tread = spin in circles · 🪖 tank barrel (fires whatever weapon is picked) · ✈️ airliner speed limit
// ---------------------------------------------------------------- 💾 save: iPhone share sheet ("Save to Files" → pick a folder), the computer's Save As box, or a download
saveDroneFile=function(sp){const json=JSON.stringify({type:'woods-drone',v:2,spec:sanitize(sp)},null,1);const name=((sp&&sp.name)||'my-drone').replace(/[^\w\- ]/g,'').trim().replace(/ +/g,'-')+'.drone.json';
  const dl=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([json],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();a.remove();toast('💾 Saved '+name+' (Downloads / Files)',2800);};
  if(window.showSaveFilePicker){showSaveFilePicker({suggestedName:name,types:[{description:'Woods build',accept:{'application/json':['.json']}}]}).then(async h=>{const w=await h.createWritable();await w.write(json);await w.close();toast('💾 Saved '+name,2500);}).catch(e=>{if(e&&e.name!=='AbortError')dl();});return;}
  try{const f=new File([json],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:name}).then(()=>toast('💾 Saved — pick "Save to Files" to choose the folder',2800)).catch(e=>{if(e&&e.name!=='AbortError')dl();});return;}}catch(e){}
  dl();};
// ---------------------------------------------------------------- 🪖 treads: only one side = it spins in circles; no wheels or treads at all = it can't drive
function treadSides(){const P=(SPEC&&SPEC.parts)||[];if(treadSides.sp===SPEC)return treadSides.r;let L=0,R=0,W=0;P.forEach(p=>{if(p.t!=='wheel')return;if(p.style==='tread'){if((p.x||0)<-0.5)L++;else if((p.x||0)>0.5)R++;else{L++;R++;}}else W++;});treadSides.sp=SPEC;treadSides.r={L,R,W,built:P.length>0};return treadSides.r;}
{const t0=tickCar;tickCar=function(dt,inp,prev){try{if(SPEC&&SPEC.parts&&SPEC.parts.length&&inp){const T=treadSides();
  if(T.W===0&&(T.L>0)!==(T.R>0)){const thr=Math.abs(inp.ly)>Math.abs(inp.ry)?inp.ly:inp.ry;const st=Math.abs(inp.rx)>Math.abs(inp.lx)?inp.rx:inp.lx;
    // the one tread pushes its own side forward, so the tank pivots around the dead side
    const side=T.L>0?1:-1;inp=Object.assign({},inp,{ly:thr*0.3,ry:0,lx:0,rx:clamp(st*0.3+side*thr,-1,1)});}
  else if(T.W===0&&T.L===0&&T.R===0&&ST&&ST.kind==='car'){inp=Object.assign({},inp,{ly:0,ry:0});}}}catch(e){}return t0.call(this,dt,inp,prev);};}
// ---------------------------------------------------------------- 🪖 tank barrel: a big cannon that fires whatever weapon you have picked
{const it={t:'gun',ic:'🪖',n:'Tank barrel (fires the picked weapon)',o:{style:'barrel',len:18}};const i1=WSC.findIndex(x=>x&&x.t==='gun'&&x.o&&x.o.style==='rocket'),i2=WSI.findIndex(x=>x&&x.t==='gun'&&x.o&&x.o.style==='rocket');
  if(i1>=0&&i2>=0){WSC.splice(i1+1,0,it);WSI.splice(i2+1,0,it);}else{WSC.push(it);WSI.push(it);}
  try{const i0=WSC0.findIndex(x=>x&&x.t==='gun'&&x.o&&x.o.style==='rocket');if(i0>=0&&!WSC0.includes(it))WSC0.splice(i0+1,0,it);}catch(e){}}
{const g0=gunMesh;gunMesh=function(style,L){if(style!=='barrel')return g0.apply(this,arguments);const g=new THREE.Group();const m=new THREE.MeshPhongMaterial({color:0x4b5530,shininess:30}),d=new THREE.MeshPhongMaterial({color:0x2a2e22});
  const r=Math.max(0.006,L*0.07);const b=new THREE.Mesh(new THREE.CylinderGeometry(r*0.8,r,L,14),m);b.rotation.x=Math.PI/2;g.add(b);
  const brk=new THREE.Mesh(new THREE.CylinderGeometry(r*1.5,r*1.5,L*0.12,14),d);brk.rotation.x=Math.PI/2;brk.position.z=-L*0.5;g.add(brk);
  const ev=new THREE.Mesh(new THREE.CylinderGeometry(r*1.3,r*1.3,L*0.18,14),d);ev.rotation.x=Math.PI/2;ev.position.z=-L*0.1;g.add(ev);
  const mant=new THREE.Mesh(new THREE.BoxGeometry(r*4,r*3.4,L*0.16),m);mant.position.z=L*0.45;g.add(mant);return g;};}
{const w0=weaponTypes;weaponTypes=function(){const L=w0.apply(this,arguments).filter(w=>w!=='barrel'&&WTYPES[w]);const hasBarrel=((DR&&DR.guns)||[]).some(g=>g.w==='barrel');
  if(hasBarrel){['rocket','mg','paint'].forEach(w=>{if(!L.includes(w)&&!(typeof BATTLE!=='undefined'&&BATTLE.on&&BATTLE.mode==='paint'&&w!=='paint'))L.push(w);});}return L.length?L:['paint'];};}
// ---------------------------------------------------------------- ✈️ the airliner tops out around real cruise speed (no more rocket-speed runaway)
{let last=performance.now();const tk=()=>{const now=performance.now();last=now;try{if(ST&&ST.airliner&&D.vel){const v=D.vel.length(),mx=130;if(v>mx)D.vel.multiplyScalar(mx/v);}}catch(e){}requestAnimationFrame(tk);};requestAnimationFrame(tk);}
