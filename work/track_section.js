// ================================================================ 🏁 track builder: more piece types, copy + edit the built-in tracks, delete easily, hide other tracks' hoops
// ================================================================ 🦘 jumps: adjustable (steepness, length, launch power) and they really throw you in the air
const MTL=['hoop','gate','tunnel','neon','jump'],MTN={hoop:'⭕ hoop',gate:'🚩 gate',tunnel:'🌀 hoop tunnel',neon:'💡 neon gate',jump:'🦘 jump + gate'};
const RAMPSET=Object.assign({steep:1.3,pow:2,long:1},LS.get('rampSet',{}));
function rampAt(x,z){for(const r of RAMPS){const dx=x-r.x,dz=z-r.z,a=dx*r.fx+dz*r.fz,b=dx*-r.fz+dz*r.fx;if(Math.abs(b)<r.w/2+0.3&&a>-r.len/2&&a<r.len/2+0.6)return r;}return null;}
// a proper wedge with side walls, supports and a yellow/black lip, so it looks like a real jump
function rampDeco(g,x,gy,z,fx,fz,L,W,h,col){const yaw=Math.atan2(-fz,fx),sh=new THREE.Shape();sh.moveTo(-L/2,0);sh.lineTo(L/2,h);sh.lineTo(L/2,0);sh.lineTo(-L/2,0);
  const geo=new THREE.ExtrudeGeometry(sh,{depth:W,bevelEnabled:false});geo.translate(0,0,-W/2);const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:col||0x8b6a45}));m.position.set(x,gy,z);m.rotation.y=yaw;g.add(m);
  const lip=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.12,W),new THREE.MeshLambertMaterial({color:0xffd60a}));lip.position.set(L/2-0.12,h+0.02,0);m.add(lip);
  for(let k=0;k<4;k++){const st=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.13,W/8),new THREE.MeshLambertMaterial({color:0x111111}));st.position.set(L/2-0.12,h+0.03,-W/2+W/8*(k*2+0.5));m.add(st);}
  return m;}
function trkPieceN(G,j){const g=G[j],nx=j<G.length-1?G[j+1].x-g.x:g.x-G[j-1].x,nz=j<G.length-1?G[j+1].z-g.z:g.z-G[j-1].z;return new V3(nx,0,nz).normalize();}
function trkExtras(def,cg,key){const G=def.g;if(G.length<2)return;
  G.forEach((g,j)=>{const n=trkPieceN(G,j),gy=H(g.x,g.z),side=new V3(-n.z,0,n.x);
    if(g.t==='tunnel'){const R=g.s,cy=gy+Math.max(R+0.3,g.y),mat=new THREE.MeshLambertMaterial({color:0x5ac8fa,emissive:0x0a3a5a});
      for(const d of[-6,-3,3,6]){const c=new V3(g.x+n.x*d,cy,g.z+n.z*d),ring=new THREE.Mesh(new THREE.TorusGeometry(R,0.08+R*0.02,8,32),mat);ring.position.copy(c);ring.lookAt(c.clone().add(n));cg.add(ring);addTorus(c,n,R,0.1);}}
    if(g.t==='neon'){const w=g.s,h=def.kind==='car'||def.kind==='boat'?3.6:Math.max(3,g.y+1.5);for(const sg of[-1,1]){const b=new THREE.Mesh(GEO.box,neonMat(j/G.length));b.scale.set(0.16,h,0.16);b.position.set(g.x+side.x*(w/2+0.25)*sg,gy+h/2,g.z+side.z*(w/2+0.25)*sg);cg.add(b);}
      const top=new THREE.Mesh(GEO.box,neonMat(j/G.length+0.3));top.scale.set(w+0.6,0.16,0.16);top.position.set(g.x,gy+h+0.2,g.z);top.rotation.y=Math.atan2(-side.z,side.x);cg.add(top);}
    if(g.t==='jump'){const L=5*(g.ramp||1),h=1.6*(g.ramp||1),W=Math.max(3,g.s*0.7),rx=g.x-n.x*(L/2+3),rz=g.z-n.z*(L/2+3),ry=H(rx,rz);
      rampDeco(cg,rx,ry,rz,n.x,n.z,L,W,h,0xb07a45);RAMPS.push({x:rx,z:rz,fx:n.x,fz:n.z,len:L,w:W,h,obj:'mc:'+key,pow:g.pow||2.4});}});}
{const b0=buildMyCourses;buildMyCourses=function(){for(let k=RAMPS.length-1;k>=0;k--)if(String(RAMPS[k].obj||'').indexOf('mc:')===0)RAMPS.splice(k,1);const r=b0.apply(this,arguments);trkVis();return r;};}
// which tracks' hoops you can see: all / built-in + the one you're racing / only the one you're racing
function trkVis(){const v=CFG.cvis||'mine';Object.values(courses).forEach(C=>{const on=course===C;
  if(C.custom&&C.grp)C.grp.visible=on||v==='all';
  else if(!C.custom&&C.cps)C.cps.forEach(cp=>(cp.mesh||[]).forEach(m=>{m.visible=on||v!=='race';}));});}
{const s0=setCourseVisible;setCourseVisible=function(){const r=s0.apply(this,arguments);try{trkVis();}catch(e){}return r;};}
function trkCvisItem(){return mItem(()=>'👀 Show track hoops: '+({all:'ALL tracks (busy!)',mine:'built-in + the one I\'m racing',race:'only the track I\'m racing'}[CFG.cvis||'mine']),()=>{const L=['mine','race','all'];CFG.cvis=L[(L.indexOf(CFG.cvis||'mine')+1)%3];saveCfg();trkVis();});}
// copy a built-in track into the editor, so you can change it
function trkCopy(key){const C=courses[key];if(!C)return;const g=C.cps.map(cp=>{if(cp.kind==='hoop'){const gy=H(cp.c.x,cp.c.z);return{x:+cp.c.x.toFixed(1),z:+cp.c.z.toFixed(1),y:+(cp.c.y-gy).toFixed(1),t:'hoop',s:+((cp.R||1.4)+0.1).toFixed(2)};}
    return{x:+cp.c.x.toFixed(1),z:+cp.c.z.toFixed(1),y:+Math.max(0,(cp.h||3.6)-1.5).toFixed(1),t:'gate',s:+(((cp.w||2.1)+0.1)*2).toFixed(1)};});
  menuToggle(false);medOpen({kind:(C.kinds&&C.kinds[0])||vkind(),g,name:C.name.replace(/^\S+\s/,'')+' (my copy)'});toast('✏️ Your own copy of '+C.name+' — drag pieces, change types, then 💾 save',3200);}
{const m0=myCourseItems;myCourseItems=function(){const out=m0(),k=vkind(),L=LS.get('mycourses',[]);
  const built=COURSE_ORDER.filter(key=>courses[key]&&!courses[key].custom&&!courses[key].pop&&((courses[key].kinds||['drone','heli']).includes(k)));
  out.splice(1,0,mItem('📋 Copy a built-in track to edit it ▸',()=>menuPush('📋 Copy which track?',built.map(key=>mItem('✏️ '+courses[key].name,()=>trkCopy(key))).concat([mItem('◀ Back',()=>menuBack())]))),
    mInfo('Pieces: ⭕ hoop · 🚩 gate · 🌀 hoop tunnel · 💡 neon gate · 🦘 jump + gate (cars) — tap the piece button in the editor to switch'));
  const del=L.map((d,i)=>{let armed=0;return mItem(()=>armed&&performance.now()-armed<3000?'⚠️ Tap again to delete "'+d.name+'"':'🗑 Delete "'+d.name+'"',()=>{if(!(armed&&performance.now()-armed<3000)){armed=performance.now();return;}const M=LS.get('mycourses',[]);M.splice(i,1);LS.set('mycourses',M);buildMyCourses();toast('🗑 Deleted "'+d.name+'"',1500);menuBack();});});
  const bi=out.findIndex(it=>{try{return /Delete a course/.test(it.label());}catch(e){return false;}});if(bi>=0)out.splice(bi,1,...del);else out.splice(out.length-1,0,...del);
  out.splice(out.length-1,0,trkCvisItem());return out;};}
// put-things-down menu: jump settings + tidy-up
{const p0=placeItems;placeItems=function(){const L=p0();const at=L.findIndex(it=>{try{return /Remove the nearest/.test(it.label());}catch(e){return false;}});
  const sv=()=>LS.set('rampSet',RAMPSET);
  const add=[mRange('📐 Jump steepness',()=>RAMPSET.steep,v=>{RAMPSET.steep=v;sv();},0.4,4,0.1,v=>(v<0.9?'gentle ':v<1.8?'normal ':'STEEP ')+v.toFixed(1)),
    mRange('📏 Jump length',()=>RAMPSET.long,v=>{RAMPSET.long=v;sv();},0.5,3,0.25,v=>v+'×'),
    mRange('🚀 Jump launch power',()=>RAMPSET.pow,v=>{RAMPSET.pow=v;sv();},1,6,0.5,v=>v+(v>=4?' 🚀🚀':v>=2.5?' 🚀':'')),
    mItem('🔧 Change the nearest jump to these settings',()=>{const src=WALK.on?WALK.pos:D.pos;let b=null,bd=1e9;OBJS.forEach(o=>{if(o.type!=='ramp')return;const d=Math.hypot(o.x-src.x,o.z-src.z);if(d<bd){bd=d;b=o;}});if(!b){toast('No placed jump nearby — put one down first (📐 Jump ramp)');return;}
      const o=Object.assign({},b,{steep:RAMPSET.steep,pow:RAMPSET.pow,long:RAMPSET.long,s:objSize,id:b.id+'x'});objDel(b.id);objAdd(o);toast('🔧 Jump changed',1200);}),
    mItem(()=>'🗑 Remove all placed hoops ('+OBJS.filter(o=>o.type==='hoop').length+')',()=>{const L2=OBJS.filter(o=>o.type==='hoop');L2.forEach(o=>objDel(o.id));toast('🗑 Removed '+L2.length+' hoops',1400);}),
    trkCvisItem()];
  L.splice(at>=0?at:L.length-1,0,...add);return L;};}
// big air for cars
{const c0=tickCar;tickCar=function(dt,inp,prev){const r=c0.apply(this,arguments);if(D.airT0&&D.air)D.airS=(D.airS||0)+dt;if(D.airT0&&!D.air){const t=D.airS||0;D.airT0=0;if(t>0.9&&D.state!=='tumble')award('🦘 Big air '+t.toFixed(1)+' s!',Math.round(2+t*3));}return r;};}
