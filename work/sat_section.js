// ================================================================ 🌎 real world: 🌳 trees where the satellite photo shows trees · 🏠 buildings from OpenStreetMap
// Trees: the same satellite tiles you fly over are read pixel by pixel; dark, green, bumpy patches = tree canopy -> a 3D tree there (you can crash into it).
// Buildings: footprints + heights from OpenStreetMap (Overpass), pulled up into 3D boxes with walls you can hit.
const SAT={z:17,tiles:new Map(),trees:LS.get('satTrees',true),bld:LS.get('osmBld',true),cells:new Map(),t:0,blds:null,bldReq:null,gen:0,R:/iPhone|iPad|Android/i.test(navigator.userAgent)?150:230};
function satLL(x,z){const o=CES.origin,lat=o.lat+(-z)/111320,lon=o.lon+x/(111320*Math.cos(o.lat*Math.PI/180));return[lon,lat];}
function satXZ(lon,lat){const o=CES.origin;return[(lon-o.lon)*111320*Math.cos(o.lat*Math.PI/180),-(lat-o.lat)*111320];}
function satTile(tx,ty){const k=tx+','+ty;let e=SAT.tiles.get(k);if(e)return e;e={ok:false,fail:false,d:null};SAT.tiles.set(k,e);
  const im=new Image();im.crossOrigin='anonymous';
  im.onload=()=>{try{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);e.d=x.getImageData(0,0,256,256).data;e.ok=true;}catch(err){e.fail=true;}};
  im.onerror=()=>{e.fail=true;};im.src='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/'+SAT.z+'/'+ty+'/'+tx;return e;}
// game x,z -> global pixel at zoom SAT.z
function satGP(x,z){const ll=satLL(x,z),n=256*Math.pow(2,SAT.z),la=ll[1]*Math.PI/180;return[(ll[0]+180)/360*n,(1-Math.log(Math.tan(la)+1/Math.cos(la))/Math.PI)/2*n];}
function satRGB(gx,gy){const tx=Math.floor(gx/256),ty=Math.floor(gy/256),e=satTile(tx,ty);if(!e.ok)return e.fail?-1:null;const px=Math.floor(gx)-tx*256,py=Math.floor(gy)-ty*256,i=(py*256+px)*4;return[e.d[i],e.d[i+1],e.d[i+2]];}
// is this pixel tree canopy? dark + green, or dark + rough
function satTreePx(gx,gy){let n=0,lumS=0,lum2=0,green=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const c=satRGB(gx+a,gy+b);if(c===null)return null;if(c===-1)return -1;const l=(c[0]+c[1]+c[2])/3,ex=2*c[1]-c[0]-c[2];lumS+=l;lum2+=l*l;if(ex>6&&c[1]>=c[0])green++;n++;}
  const m=lumS/n,sd=Math.sqrt(Math.max(0,lum2/n-m*m));return green>=6&&m<100&&(m<72||sd>8)?(m<52?2:1):0;}
function satCellKey(i,j){return 'sat:'+i+','+j;}
function satBuildCell(i,j){const x0=i*CH,z0=j*CH;
  // the ground must be loaded here first (so trees sit on it)
  cesH0(x0+CH/2,z0+CH/2);const ce=CES.cache.get(Math.floor((x0+CH/2)/2)+','+Math.floor((z0+CH/2)/2));if(!ce||!ce.ok)return null;
  const ch={i,j,trees:[],objs:[],cols:[],sat:true,gen:SAT.gen,hy:[]};
  if(SAT.trees&&(!LOOK.on||LKT)){
    for(let x=x0+2;x<x0+CH;x+=4)for(let z=z0+2;z<z0+CH;z+=4){const g=satGP(x,z),k=satTreePx(g[0],g[1]);if(k===null)return null;if(k<=0)continue;
      const h0=hash2(Math.round(x*7),Math.round(z*7),5);if(h0<0.22)continue;
      const tx=x+(hash2(Math.round(x*3),Math.round(z*3),1)-0.5)*2.6,tz=z+(hash2(Math.round(x*3),Math.round(z*3),2)-0.5)*2.6;
      if(Math.hypot(tx,tz)<14||satInBld(tx,tz)||(typeof fldBlocked==='function'&&fldBlocked(tx,tz)))continue;
      const r=hash2(Math.round(tx*5),Math.round(tz*5),3),pine=k===2?r<0.75:r<0.25,h=8+r*12,tr=0.18+r*0.22,cr=pine?1.8+r*1.0:2.4+r*1.4;
      ch.trees.push({x:tx,z:tz,y:H(tx,tz),pine,h,tr,cr,shade:hash2(Math.round(tx*9),Math.round(tz*9),4)});}
    COLLECT=ch.cols;ch.trees.forEach(t=>{const th=t.pine?t.h*0.45:t.h*0.32;addVCyl(t.x,t.z,t.tr,t.y-1,t.y+th);if(t.pine)t.cc=addCone(t.x,t.z,t.cr,t.y+t.h*0.22,t.y+t.h);else t.cc=addSph(t.x,t.y+t.h*0.72,t.z,t.cr);});COLLECT=null;
    if(ch.trees.length){if(LKT)lkTrees(ch.trees,ch.objs);else satSimpleTrees(ch);}}
  if(SAT.bld&&SAT.blds&&!CES.osm){COLLECT=ch.cols;SAT.blds.filter(b=>b.cx>=x0&&b.cx<x0+CH&&b.cz>=z0&&b.cz<z0+CH).forEach(b=>satBuilding(b,ch));COLLECT=null;}
  ch.hy=[[x0+CH/2,z0+CH/2,H(x0+CH/2,z0+CH/2)]];return ch;}
const _sm=new THREE.Matrix4(),_sq=new THREE.Quaternion(),_ss=new V3(),_sp=new V3();
function satSimpleTrees(ch){const T=ch.trees,trunk=new THREE.InstancedMesh(GEO.trunk||new THREE.CylinderGeometry(0.5,0.7,1,6).translate(0,0.5,0),MAT.trunk||new THREE.MeshLambertMaterial({color:0x5a3d22}),T.length);
  const cone=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,7).translate(0,0.5,0),new THREE.MeshLambertMaterial({color:0x2c5a2a}),T.length),ball=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshLambertMaterial({color:0x3f7a32}),T.length);let nc=0,nb=0;
  T.forEach((t,k)=>{_sm.compose(_sp.set(t.x,t.y,t.z),_sq.identity(),_ss.set(t.tr*2,t.h*(t.pine?0.5:0.75),t.tr*2));trunk.setMatrixAt(k,_sm);
    if(t.pine){_sm.compose(_sp.set(t.x,t.y+t.h*0.22,t.z),_sq,_ss.set(t.cr,t.h*0.8,t.cr));cone.setMatrixAt(nc++,_sm);}else{_sm.compose(_sp.set(t.x,t.y+t.h*0.72,t.z),_sq,_ss.set(t.cr,t.cr*0.9,t.cr));ball.setMatrixAt(nb++,_sm);}});
  cone.count=nc;ball.count=nb;[trunk,cone,ball].forEach(o=>{if(o.count){scene.add(o);ch.objs.push(o);}});}
// ---- buildings from OpenStreetMap
function satInBld(x,z){if(!SAT.blds)return false;for(const b of SAT.blds)if(x>b.x0-1&&x<b.x1+1&&z>b.z0-1&&z<b.z1+1)return true;return false;}
function satFetchBlds(){if(!SAT.bld||CES.osm||SAT.bldReq)return;const o=CES.origin,gen=SAT.gen,R=900;
  const q='[out:json][timeout:25];(way["building"](around:'+R+','+o.lat+','+o.lon+'););out geom tags 1500;';
  SAT.bldReq=fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(r=>r.json()).then(j=>{if(gen!==SAT.gen)return;
    const L=[];(j.elements||[]).forEach(e=>{if(!e.geometry||e.geometry.length<4)return;const pts=e.geometry.map(g=>satXZ(g.lon,g.lat));pts.pop();
      let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,cx=0,cz=0;pts.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1]);cx+=p[0];cz+=p[1];});cx/=pts.length;cz/=pts.length;
      if(x1-x0>250||z1-z0>250)return;const t=e.tags||{},ty=t.building;let h=parseFloat(t.height);if(!(h>0)){const lv=parseFloat(t['building:levels']);h=lv>0?lv*3.1+1:({garage:3,garages:3,shed:3,hut:3,carport:3,barn:8,farm_auxiliary:6,house:6.5,detached:6.5,residential:7,apartments:12,commercial:8,retail:6,industrial:9,warehouse:9,church:14,school:8,silo:16,greenhouse:4}[ty]||6);}
      L.push({pts,x0,x1,z0,z1,cx,cz,h:Math.min(h,120),ty,roof:t['roof:shape']||'',id:e.id});});
    SAT.blds=L;satReset(true);toast('🏠 '+L.length+' real buildings from OpenStreetMap'+(L.length?'':' (none mapped here)'),2500);}).catch(e=>{SAT.bldReq=null;console.warn('overpass',e);setTimeout(()=>{if(gen===SAT.gen&&!SAT.blds)satFetchBlds();},30000);});}
const SAT_WALL=[0xe8e2d4,0xd9d2c3,0xf2f0ea,0xc9b8a0,0xa9a39a,0x9c3b2e,0xb8b0a2,0x8a8f96],SAT_ROOF=[0x5a5e66,0x3c3f45,0x6b4a3a,0x7a7d82,0x4a4038];
function satBuilding(b,ch){let gy=1e9;b.pts.forEach(p=>{gy=Math.min(gy,H(p[0],p[1]));});gy=Math.min(gy,H(b.cx,b.cz));
  const sh=new THREE.Shape();b.pts.forEach((p,k)=>{if(k)sh.lineTo(p[0],-p[1]);else sh.moveTo(p[0],-p[1]);});
  let geo;try{geo=new THREE.ExtrudeGeometry(sh,{depth:b.h+1.5,bevelEnabled:false});}catch(e){return;}geo.rotateX(-Math.PI/2);
  const hk=Math.abs(b.id||0),wall=new THREE.MeshLambertMaterial({color:b.ty==='barn'?0x8e2b22:SAT_WALL[hk%SAT_WALL.length]}),roof=new THREE.MeshLambertMaterial({color:SAT_ROOF[(hk>>3)%SAT_ROOF.length]});
  const m=new THREE.Mesh(geo,[roof,wall]);m.position.y=gy-1.5;m.castShadow=true;m.receiveShadow=true;scene.add(m);ch.objs.push(m);
  // a simple pitched roof on houses / barns
  const small=(b.x1-b.x0)*(b.z1-b.z0)<900;if(small&&/^(house|detached|barn|farm_auxiliary|garage|shed|residential|yes)$/.test(b.ty||'')&&b.roof!=='flat'){const w=b.x1-b.x0,d=b.z1-b.z0,long=w>d,rh=Math.min(w,d)*0.35;
    const rg=new THREE.CylinderGeometry(0.0001,Math.min(w,d)/2*1.42,rh,4,1,false,Math.PI/4);rg.scale(long?w/Math.min(w,d):1,1,long?1:d/Math.min(w,d));
    const r=new THREE.Mesh(rg,roof);r.position.set(b.cx,gy+b.h+rh/2,b.cz);r.castShadow=true;scene.add(r);ch.objs.push(r);addBox(b.cx-w/2,gy+b.h,b.cz-d/2,b.cx+w/2,gy+b.h+rh*0.6,b.cz+d/2);}
  addBox(b.x0,gy-2,b.z0,b.x1,gy+b.h,b.z1);}
function satUnload(k){const ch=SAT.cells.get(k);if(!ch)return;unloadChunk(ch);chunks.delete(k);SAT.cells.delete(k);}
function satReset(keepBlds){[...SAT.cells.keys()].forEach(satUnload);if(!keepBlds){SAT.gen++;SAT.blds=null;SAT.bldReq=null;SAT.tiles.clear();}}
function satTick(){if(!CES.on||!CES.ENU||!CES.ready)return;const now=performance.now();if(now-SAT.t<250)return;SAT.t=now;
  if(SAT.bld&&!SAT.blds&&!SAT.bldReq&&!CES.osm)satFetchBlds();
  const c=(typeof WALK!=='undefined'&&WALK.on)?WALK.pos:D.pos,R=SAT.R,ci=Math.floor(c.x/CH),cj=Math.floor(c.z/CH),n=Math.ceil(R/CH);
  // drop far cells, and cells whose ground got sharper (re-sit the trees on it)
  for(const [k,ch] of SAT.cells){const cx=(ch.i+0.5)*CH,cz=(ch.j+0.5)*CH;if(Math.abs(cx-c.x)>R+CH*1.5||Math.abs(cz-c.z)>R+CH*1.5||ch.gen!==SAT.gen){satUnload(k);continue;}
    if(ch.hy.length&&now-(ch.ht||0)>3000){ch.ht=now;const h=ch.hy[0];if(Math.abs(H(h[0],h[1])-h[2])>0.6)satUnload(k);}}
  if(!SAT.trees&&!(SAT.bld&&SAT.blds))return;
  const need=[];for(let i=ci-n;i<=ci+n;i++)for(let j=cj-n;j<=cj+n;j++){const cx=(i+0.5)*CH,cz=(j+0.5)*CH,d=Math.hypot(cx-c.x,cz-c.z);if(d<=R+CH*0.7&&!SAT.cells.has(satCellKey(i,j)))need.push([d,i,j]);}
  need.sort((a,b)=>a[0]-b[0]);let built=0;for(const [d,i,j] of need){if(built>=2)break;const ch=satBuildCell(i,j);if(ch){const k=satCellKey(i,j);SAT.cells.set(k,ch);chunks.set(k,ch);built++;}}}
{const s0=cesSync;cesSync=function(){const r=s0.apply(this,arguments);try{satTick();}catch(e){console.warn('sat',e);}return r;};}
{const o0=cesSetOrigin;cesSetOrigin=async function(){satReset(false);const r=await o0.apply(this,arguments);satReset(false);return r;};}
{const c0=cesItems;cesItems=function(){return c0().concat([
  mItem(()=>'🌳 Trees from the satellite photo: '+(SAT.trees?'ON ('+[...SAT.cells.values()].reduce((a,c)=>a+c.trees.length,0)+' near you)':'off'),()=>{SAT.trees=!SAT.trees;LS.set('satTrees',SAT.trees);satReset(true);}),
  mItem(()=>'🏠 Buildings from OpenStreetMap: '+(CES.osm?'using Cesium 3D buildings':SAT.bld?(SAT.blds?'ON ('+SAT.blds.length+' around here)':'loading…'):'off'),()=>{SAT.bld=!SAT.bld;LS.set('osmBld',SAT.bld);if(!SAT.bld)satReset(true);else{SAT.bldReq=null;satFetchBlds();satReset(true);}})]);};}
