// =====================================================================================
// ===== 🗺 MAPS: 🌳 realistic woods · 🌲 classic woods (the original look) · 🌎 the real Earth (satellite)
// =====  Everything else (multiplayer, Phone Link, weapons, workshop, radio, lessons…) works on every map.
// =====================================================================================
const MAPS={woods:{ic:'🌳',n:'Realistic woods',d:'real sky, sun shadows, photo grass, 3D trees, the old airport made realistic'},classic:{ic:'🌲',n:'Classic woods',d:'the original Woods Drone Sim look (light on slow computers and phones)'},earth:{ic:'🌎',n:'Real world',d:'the real Earth from satellite photos, starting over the farm (open it through DJI Phone Link)'}};
function curMap(){return MAPS[CFG.map]?CFG.map:'woods';}
function mapSet(k,why){if(curMap()===k&&!why)return;CFG.map=k;saveCfg();try{sessionStorage.setItem('wds_autostart',started?'1':'');}catch(e){}toast((why||'🗺 Changing map to ')+MAPS[k].ic+' '+MAPS[k].n+'…',2500);setTimeout(()=>location.reload(),700);}
function mapItems(){const k=curMap();return[
  ...Object.keys(MAPS).map(m=>mItem(()=>(k===m?'✅ ':'▫️ ')+MAPS[m].ic+' '+MAPS[m].n,()=>{if(m===k)return;if(typeof mpOpen==='function'&&mpOpen()){WORLD_TS=Date.now();LS.set('worldTs',WORLD_TS);const w=worldState();w.map=m;mpSend({t:'w',w,ts:WORLD_TS});}mapSet(m);})),
  mInfo(()=>MAPS[k].ic+' '+MAPS[k].d),
  ...(k==='earth'?[mItem(()=>'🌎 Real world: '+(CES.on?CES.origin.name:'loading…')+' ▸',()=>menuPush('🌎 Real world map',cesItems()))]:[]),
  mInfo('Changing the map restarts the game. In multiplayer, everyone switches together.'),mItem('◀ Back',()=>menuBack())];}
// map buttons on the start screen
(function(){const st=document.getElementById('start');if(!st)return;const row=document.createElement('div');row.className='row';row.id='mapRow';
  const draw=()=>{row.innerHTML='<span style="align-self:center;font-weight:700;margin-right:6px">Map:</span>'+Object.keys(MAPS).map(m=>'<button class="btn'+(curMap()===m?' big':'')+'" id="map_'+m+'" style="'+(curMap()===m?'outline:2px solid #ffd60a':'opacity:0.85')+'">'+MAPS[m].ic+' '+MAPS[m].n+'</button>').join('');
    Object.keys(MAPS).forEach(m=>{document.getElementById('map_'+m).onclick=()=>{if(curMap()!==m)mapSet(m);};});};
  const first=st.querySelector('.row');st.insertBefore(row,first);draw();})();
// after switching the map while flying, go straight back into the game
setTimeout(()=>{try{if(sessionStorage.getItem('wds_autostart')==='1'){sessionStorage.removeItem('wds_autostart');if(!started)startGame('free');}}catch(e){}},1200);
