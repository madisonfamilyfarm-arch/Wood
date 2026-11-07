// =====================================================================================
// ===== 🌎 REAL WORLD MAP (CesiumJS): the real Earth from satellite photos + real hills, starting over the farm =====
// The game itself (physics, multiplayer, weapons, workshop…) is the same — Cesium just draws the world underneath.
// =====================================================================================
const CES={on:false,ready:false,viewer:null,origin:LS.get('cesOrigin',{lat:37.9155,lon:-86.5250,name:'the farm (Rome, IN)'}),h0:0,ENU:null,inv:null,cache:new Map(),style:LS.get('cesStyle','sat'),bld:LS.get('cesBld',true),token:LS.get('cesToken',''),tried:false};
function cesLoad(){if(CES.tried)return;CES.tried=true;
  if(location.protocol==='file:'){ // browsers won't run the map's helpers from a file you double-clicked — it has to come through DJI Phone Link
    const d=document.createElement('div');d.id='cesFile';d.style.cssText='position:fixed;inset:0;z-index:90;background:rgba(5,10,8,0.96);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;text-align:center;font:600 16px system-ui';
    d.innerHTML='<div style="font:900 26px system-ui">🌎 One more step for the real-world map</div><div style="max-width:620px;opacity:0.9">Browsers won\'t draw the real-world map from a file you open straight from Downloads. Open it through <b>DJI Phone Link</b> instead:</div>'+
      '<ol style="text-align:left;max-width:620px;line-height:1.6"><li>Put <b>'+esc(decodeURIComponent(location.pathname.split('/').pop()))+'</b> in the same folder as <b>dji-phone-link.py</b>.</li><li>Double-click <b>Start DJI Phone Link</b> (Windows) or run the Linux one.</li><li>Pick <b>🌎 Real World RC Sim</b> on the page that opens — or press the button below.</li></ol>'+
      '<a class="btn" style="font-size:18px;padding:14px 20px;text-decoration:none" href="http://localhost:8765/">▶ Open it through DJI Phone Link</a><button class="btn" id="cesFileX" style="font-size:14px">Fly in the woods for now</button>';
    document.body.appendChild(d);$('cesFileX').onclick=()=>d.remove();return;}
  window.CESIUM_BASE_URL='https://cdn.jsdelivr.net/npm/cesium@1.146.0/Build/Cesium/';
  const css=document.createElement('link');css.rel='stylesheet';css.href=window.CESIUM_BASE_URL+'Widgets/widgets.css';document.head.appendChild(css);
  loadScriptOnce(window.CESIUM_BASE_URL+'Cesium.js').then(cesInit).catch(()=>{toast('🌎 Couldn\'t load the real-world map (needs the internet) — flying in the woods instead',5000);});}
async function cesInit(){
  const C=window.Cesium;if(!C)return;
  if(CES.token)C.Ion.defaultAccessToken=CES.token;
  const div=document.createElement('div');div.id='cesDiv';div.style.cssText='position:fixed;inset:0;z-index:0';document.body.insertBefore(div,document.body.firstChild);
  const cr=document.createElement('div');cr.id='cesCredits';document.body.appendChild(cr);
  const viewer=new C.Viewer(div,{animation:false,timeline:false,baseLayerPicker:false,geocoder:false,homeButton:false,sceneModePicker:false,navigationHelpButton:false,fullscreenButton:false,infoBox:false,selectionIndicator:false,
    useDefaultRenderLoop:false,requestRenderMode:false,creditContainer:cr,baseLayer:false,msaaSamples:1,showRenderLoopErrors:false});
  CES.viewer=viewer;const sc=viewer.scene;sc.rethrowRenderErrors=false;sc.renderError.addEventListener((s2,err)=>cesErr(err));
  if(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)){CES.mobile=true;}
  sc.screenSpaceCameraController.enableInputs=false;sc.globe.depthTestAgainstTerrain=true;sc.globe.maximumScreenSpaceError=1.6;sc.fog.enabled=true;
  sc.globe.tileCacheSize=CES.mobile?100:300;if(CES.mobile){sc.globe.maximumScreenSpaceError=2.5;}sc.globe.enableLighting=false;viewer.resolutionScale=Math.min(1,(devicePixelRatio||1));
  cesImagery();
  cesTerrain(0);setTimeout(cesWatch,9000);
  if(CES.token&&CES.bld){try{C.createOsmBuildingsAsync().then(t=>{CES.osm=t;sc.primitives.add(t);});}catch(e){}}
  CES.on=true;document.body.classList.add('ces');cesWorldOff();cesLook(true);await cesSetOrigin(CES.origin,true);CES.ready=true;
  toast('🌎 Real world: '+CES.origin.name+(CES.token?'':' — tip: a free Cesium ion key gives sharper hills + 3D buildings (Menu → 🌎 Real world)'),5000);}
// real hills: your ion key → ArcGIS world elevation (free) → Cesium's built-in key → flat
function cesTerrain(step){const C=window.Cesium,sc=CES.viewer.scene;CES.tStep=step;
  if(step>=2){CES.tName='flat (no hills)';sc.terrainProvider=new C.EllipsoidTerrainProvider();toast('⛰ Couldn\'t get the real hills — the ground is flat for now',3500);return;}
  let t;try{t=step===1?new C.Terrain(C.ArcGISTiledElevationTerrainProvider.fromUrl('https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer')):C.Terrain.fromWorldTerrain();}catch(e){cesTerrain(step+1);return;}CES.tName=['Cesium World Terrain','ArcGIS world elevation','flat'][step];
  t.errorEvent.addEventListener(()=>{if(CES.tStep===step)cesTerrain(step+1);});t.readyEvent.addEventListener(()=>{CES.cache.clear();if(CES.ready)cesSetOrigin(CES.origin,true);});sc.setTerrain(t);}
function cesImagery(){const C=window.Cesium,L=CES.viewer.imageryLayers;L.removeAll();
  const url=CES.style==='map'?null:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer';
  if(CES.style==='map')L.add(new C.ImageryLayer(new C.OpenStreetMapImageryProvider({url:'https://tile.openstreetmap.org/'})));
  else if(CES.token&&CES.style==='bing')L.add(C.ImageryLayer.fromProviderAsync(C.IonImageryProvider.fromAssetId(2)));
  else{const lay=C.ImageryLayer.fromProviderAsync(C.ArcGisMapServerImageryProvider.fromUrl(url));lay.errorEvent.addEventListener(()=>{if(CES.style==='sat'){toast('🗺 Satellite photos didn\'t load — trying another map',2500);CES.style=CES.token||C.Ion.defaultAccessToken?'bing':'map';cesImagery();}});L.add(lay);}
  const top=L.get(L.length-1);if(top&&top.errorEvent&&CES.style!=='sat')top.errorEvent.addEventListener(()=>{if(CES.style==='bing'){CES.style='map';cesImagery();}});}
// if nothing shows after a few seconds, fall back to a flat ground with the map on it so you're never left in the dark
function cesWatch(){if(!CES.viewer)return;let n=0;try{n=CES.viewer.scene.globe._surface._tilesToRender.length;}catch(e){n=1;}
  if(!n){const C=window.Cesium;CES.tStep=9;CES.tName='flat (no hills)';CES.viewer.scene.terrainProvider=new C.EllipsoidTerrainProvider();CES.cache.clear();toast('⛰ The hills didn\'t load — showing the map flat. (A free Cesium ion key in Menu → 🌎 Real world usually fixes this.)',6000);
    setTimeout(()=>{let m=0;try{m=CES.viewer.scene.globe._surface._tilesToRender.length;}catch(e){m=1;}if(!m){CES.style='map';cesImagery();toast('🗺 Switched to the street map',3000);}},6000);}}
// put the game's (0,0) = the pad on a real spot. x = east, -z = north, y = up (metres)
async function cesSetOrigin(o,quiet){const C=window.Cesium;CES.origin=o;LS.set('cesOrigin',o);CES.cache.clear();try{WX.set('lat',o.lat);WX.set('lon',o.lon);WX.set('place',o.name);if(WX.W.mode==='real')WX.sync(true);}catch(e){}
  let h=0;try{const tp=CES.viewer.scene.terrainProvider;if(tp&&tp.availability!==undefined||tp){const r=await C.sampleTerrainMostDetailed(tp,[C.Cartographic.fromDegrees(o.lon,o.lat)]);h=r[0].height||0;}}catch(e){}
  CES.h0=h;CES.ENU=C.Transforms.eastNorthUpToFixedFrame(C.Cartesian3.fromDegrees(o.lon,o.lat,h));CES.inv=C.Matrix4.inverse(CES.ENU,new C.Matrix4());
  {const L=OBJS.map(o=>Object.assign({},o));L.forEach(o=>objDel(o.id,true));L.forEach(o=>{if(o.y!=null&&o.yRel==null){}objAdd(o,true);});}
  setTimeout(()=>{fldBuild();if(D.state==='landed'&&!D.armed||D.state==='down')resetDrone(kindStart());},1500);resetDrone(kindStart());if(typeof WALK!=='undefined'&&WALK.on)WALK.pos.set(2,cesH(2,2),2);if(!quiet)toast('📍 Now flying at '+o.name,2500);}
const _cc={p:null,q:null};
function cesToECEF(x,y,z,out){const C=window.Cesium;return C.Matrix4.multiplyByPoint(CES.ENU,new C.Cartesian3(x,-z,y),out||new C.Cartesian3());}
function cesH(x,z){return fldFlat(x,z,cesH0(x,z));}
function cesH0(x,z){if(!CES.ENU)return 0;const g=2,ix=Math.floor(x/g),iz=Math.floor(z/g),fx=x/g-ix,fz=z/g-iz;
  const a=cesCell(ix,iz),b=cesCell(ix+1,iz),c=cesCell(ix,iz+1),d=cesCell(ix+1,iz+1);return(a*(1-fx)+b*fx)*(1-fz)+(c*(1-fx)+d*fx)*fz;}
function cesCell(ix,iz){const k=ix+','+iz,now=performance.now();let e=CES.cache.get(k);if(e&&now-e.t<(e.ok?2500:400))return e.h;
  const C=window.Cesium,p=cesToECEF(ix*2,0,iz*2),c=C.Cartographic.fromCartesian(p),h=CES.viewer.scene.globe.getHeight(c);
  const ok=h!==undefined&&isFinite(h)&&h>-450&&h<9000;const v=ok?h-CES.h0:(e?e.h:(CES.lastH||0));if(ok)CES.lastH=v;if(CES.cache.size>40000)CES.cache.clear();CES.cache.set(k,{h:v,ok,t:now});return v;}
// hide the woods: trees, pond, arena, courses, deer — the real world replaces them
function cesWorldOff(){for(const ch of chunks.values())unloadChunk(ch);chunks.clear();CG.clear();
  CES.hidden=[];const keep=new Set([...objMesh.values()].map(m=>m.g));scene.children.forEach(o=>{if(keep.has(o)||o===shadow||(DR&&o===DR.g)||(window.skyM&&o.material===skyM))return;if(o.isLight||o.isCamera)return;if(o.visible){o.visible=false;CES.hidden.push(o);}});
  deer.forEach(d=>scene.remove(d.g));deer.length=0;balloons.forEach(b=>{b.alive=false;});RAMPS.length=0;}
function cesTime(){const C=window.Cesium,h=todHour(),d=new Date();d.setUTCHours(0,0,0,0);d.setTime(d.getTime()+((h-CES.origin.lon/15)%24+24)%24*3600e3);CES.viewer.clock.shouldAnimate=false;CES.viewer.clock.currentTime=C.JulianDate.fromDate(d);}
// ground brightness follows the sun (moonlit at night, not pitch black)
function cesDay(){const h=todHour(),f=clamp(Math.sin((h-6)/12*Math.PI)*1.6+0.35,0.28,1);const L=CES.viewer.imageryLayers;for(let i=0;i<L.length;i++){const l=L.get(i);l.brightness=f;l.contrast=1+(1-f)*0.2;}const sc=CES.viewer.scene,b=clamp((f-1)*1.35,-0.97,0);if(sc.skyAtmosphere){sc.skyAtmosphere.brightnessShift=b;sc.skyAtmosphere.saturationShift=b*0.3;}sc.globe.atmosphereBrightnessShift=b;renderer.toneMapping=THREE.LinearToneMapping;renderer.toneMappingExposure=0.3+0.7*clamp((f-0.28)/0.72,0,1);}
function cesSync(){if(!CES.on||!CES.ENU)return;const C=window.Cesium,v=CES.viewer,cm=v.camera;if(performance.now()-(CES.tT||0)>1000){CES.tT=performance.now();cesTime();cesDay();}
  fldTick(performance.now()/1000);
  cam.updateMatrixWorld();const p=cam.position,f=new V3(0,0,-1).applyQuaternion(cam.quaternion),u=new V3(0,1,0).applyQuaternion(cam.quaternion);
  cm.position=cesToECEF(p.x,p.y,p.z);const M=CES.ENU;
  const dir=C.Matrix4.multiplyByPointAsVector(M,new C.Cartesian3(f.x,-f.z,f.y),new C.Cartesian3()),up=C.Matrix4.multiplyByPointAsVector(M,new C.Cartesian3(u.x,-u.z,u.y),new C.Cartesian3());
  C.Cartesian3.normalize(dir,dir);C.Cartesian3.normalize(up,up);cm.direction=dir;cm.up=up;cm.right=C.Cartesian3.normalize(C.Cartesian3.cross(dir,up,new C.Cartesian3()),new C.Cartesian3());
  const asp=innerWidth/innerHeight;cm.frustum.aspectRatio=asp;cm.frustum.fov=asp>=1?2*Math.atan(Math.tan(cam.fov*Math.PI/360)*asp):cam.fov*Math.PI/180;cm.frustum.near=0.2;
  try{v.render();}catch(e){cesErr(e);}}
// if the map's 3D drawing breaks (old phone, in-app viewer, graphics driver) try to heal it, and if it keeps breaking fly in the woods instead
function cesErr(err){let msg=err&&(err.message||err.name);if(!msg){try{msg=JSON.stringify(err);}catch(e){}}if(!msg||msg==='{}')msg='map drawing error';msg=String(msg).slice(0,160);console.warn('Cesium render error',msg,err);CES.errs=(CES.errs||0)+1;CES.lastErr=msg;const sc=CES.viewer&&CES.viewer.scene;
  if(!sc)return cesFail(msg);
  if(CES.errs===1){try{sc.fog.enabled=false;if(sc.skyAtmosphere)sc.skyAtmosphere.show=false;sc.globe.showGroundAtmosphere=false;sc.globe.depthTestAgainstTerrain=false;if(CES.osm){CES.osm.show=false;}CES.viewer.resolutionScale=0.75;sc.globe.maximumScreenSpaceError=3;}catch(e){}toast('🌎 The map hiccupped — trying a lighter version…',2500);}
  else if(CES.errs===2){try{sc.terrainProvider=new window.Cesium.EllipsoidTerrainProvider();CES.tName='flat (simple mode)';CES.cache.clear();CES.viewer.resolutionScale=0.5;}catch(e){}toast('🌎 Still struggling — switching to flat ground…',2500);}
  else cesFail(msg);}
function cesFail(msg){if(CES.failed)return;CES.failed=true;CES.on=false;CES.ENU=null;document.body.classList.remove('ces');
  const d=document.getElementById('cesDiv');if(d)d.style.display='none';
  try{if(FU.g){scene.remove(FU.g);FU.g=null;}FU.cols.forEach(gridRemove);FU.cols=[];FU.built=false;FU.station=null;}catch(e){}
  if(typeof WALK!=='undefined')WALK.pilotAt=null;(CES.hidden||[]).forEach(o=>o.visible=true);CES.hidden=[];
  renderer.setClearColor(0x000000,1);renderer.toneMapping=THREE.NoToneMapping;renderer.toneMappingExposure=1;try{applyTOD();}catch(e){}chunkTick(true);try{resetDrone(null);}catch(e){}
  const b=document.createElement('div');b.style.cssText='position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:80;background:rgba(10,20,40,0.92);color:#fff;font:600 15px system-ui;padding:12px 16px;border-radius:14px;max-width:min(560px,92vw);text-align:center';
  b.innerHTML='🌲 The real-world map can\'t draw on this screen, so you\'re flying in the <b>woods</b> instead.<br><span style="font-weight:400;font-size:13px">Phones and in-app file viewers often can\'t run it. Open it on your computer through <b>DJI Phone Link</b> (pick 🌎 Real World) for the satellite map.<br><span style="opacity:0.6">('+esc(msg)+')</span></span><br><button class="btn" style="margin-top:8px">OK</button>';
  document.body.appendChild(b);b.querySelector('button').onclick=()=>b.remove();setTimeout(()=>b.remove(),20000);}
function cesRender(){const bg=scene.background,fg=scene.fog,sky=scene.children.find(o=>window.skyM&&o.material===skyM);scene.background=null;scene.fog=null;if(sky)sky.visible=false;const sv=STARS.visible;STARS.visible=false;const lb=(typeof LOOK!=='undefined'?LOOK.bg:[]).map(o=>[o,o.visible]);lb.forEach(([o])=>o.visible=false);
  renderer.setClearColor(0x000000,0);renderer.render(scene,cam);scene.background=bg;scene.fog=fg;if(sky)sky.visible=!sky.userData.lkHidden;STARS.visible=sv;lb.forEach(([o,v])=>o.visible=v);}
function cesItems(){return[
  mInfo(()=>CES.on?'🌎 Real world · flying at '+CES.origin.name+' ('+CES.origin.lat.toFixed(4)+', '+CES.origin.lon.toFixed(4)+')':'🌎 The real-world map is loading… (needs the internet)'),
  mInfo(()=>CES.on?'⛰ Hills: '+(CES.tName||'loading')+' · 🗺 Map: '+CES.style+' · map pieces showing: '+(function(){try{return CES.viewer.scene.globe._surface._tilesToRender.length;}catch(e){return '?';}})():''),
  mItem('✈️ Airfield (move it, turn the runway, length…) ▸',()=>menuPush('✈️ Airfield',fldItems())),
  mItem('🏡 Fly at the farm',()=>{cesSetOrigin({lat:37.9155,lon:-86.5250,name:'the farm (Rome, IN)'});menuToggle(false);}),
  mItem('📍 Fly somewhere else (type a place or lat, lon)…',()=>{const a=prompt('Type a place (like "Tell City, Indiana") or latitude, longitude (like 38.25, -85.76)','');if(!a)return;cesGoto(a);menuToggle(false);}),
  mItem('🧭 Fly where I am right now',()=>{if(!navigator.geolocation){toast('This device can\'t share its location');return;}navigator.geolocation.getCurrentPosition(p=>{cesSetOrigin({lat:p.coords.latitude,lon:p.coords.longitude,name:'where you are'});},()=>toast('📍 Location not allowed (it needs https or localhost)',3000));menuToggle(false);}),
  mItem(()=>'🗺 Map: '+({sat:'satellite photos',map:'street map',bing:'Bing satellite (ion key)'}[CES.style])+'  ◀ ▶',()=>cesStyle(1),d=>cesStyle(d)),
  mItem(()=>'🔑 Cesium ion key: '+(CES.token?'set ✓ (sharper hills + 3D buildings)':'not set — optional, free at cesium.com/ion'),()=>{const t=prompt('Paste your free Cesium ion access token (from https://ion.cesium.com/tokens). Leave empty to remove it.',CES.token||'');if(t===null)return;CES.token=t.trim();LS.set('cesToken',CES.token);toast('🔑 Saved — reloading the map…',2000);setTimeout(()=>location.reload(),1200);}),
  mItem(()=>'🏙 3D buildings: '+(CES.bld?'ON':'off')+(CES.token?'':' (needs the ion key)'),()=>{CES.bld=!CES.bld;LS.set('cesBld',CES.bld);if(CES.osm)CES.osm.show=CES.bld;}),
  mInfo('Everyone in multiplayer flies at the same place. Races, the woods and the lake are in the Woods RC Sim file.'),
  mItem('◀ Back',()=>menuBack())];}
function cesStyle(d){const L=CES.token?['sat','bing','map']:['sat','map'];CES.style=L[(L.indexOf(CES.style)+d+L.length)%L.length];LS.set('cesStyle',CES.style);if(CES.viewer)cesImagery();}
async function cesGoto(a){const m=a.match(/^\s*(-?\d+(\.\d+)?)\s*[, ]\s*(-?\d+(\.\d+)?)\s*$/);if(m){cesSetOrigin({lat:+m[1],lon:+m[3],name:a.trim()});return;}
  try{const r=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(a));const j=await r.json();if(j&&j[0])cesSetOrigin({lat:+j[0].lat,lon:+j[0].lon,name:a.trim().slice(0,40)});else toast('📍 Couldn\'t find "'+a+'"',2500);}catch(e){toast('📍 Couldn\'t look that up — try latitude, longitude',2500);}}
// ---- more realistic-looking aircraft: soft sky reflections on everything you fly
(function(){try{const pm=new THREE.PMREMGenerator(renderer),s=new THREE.Scene();
  const g=new THREE.SphereGeometry(10,32,16),cols=[];const pos=g.attributes.position;for(let i=0;i<pos.count;i++){const y=pos.getY(i)/10,c=new THREE.Color();if(y>0)c.setRGB(0.55+0.2*(1-y),0.72+0.15*(1-y),0.98);else c.setRGB(0.32,0.36+0.1*(1+y),0.22);cols.push(c.r,c.g,c.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));s.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
  const sunb=new THREE.Mesh(new THREE.SphereGeometry(1.2,12,8),new THREE.MeshBasicMaterial({color:0xffffff}));sunb.position.set(5,7,3);s.add(sunb);
  CES.env=pm.fromScene(s,0.02).texture;}catch(e){}})();
function cesLook(on){scene.environment=on&&CES.env?CES.env:null;}
