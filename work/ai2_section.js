// ================================================================ 🤖 AI pilots play like a real player: they switch between drones, planes, helis, boats, subs and cars,
// roam the whole map, visit places, race, chase, do tricks, fight fires — and the local AI computer (when connected) picks their vehicle + plan.
const AI_VK=['drone','plane','heli','boat','sub','car'],AI_VIC={drone:'🚁',plane:'✈️',heli:'🚁',boat:'🚤',sub:'🐟',car:'🚙'};
function aiPlaces(){const L=[{n:'the launch pad',x:PAD.x,z:PAD.z},{n:'the fire tower',x:FT.x,z:FT.z},{n:'the campsite',x:16,z:-14},{n:'the meadow',x:(MEADOW.x0+MEADOW.x1)/2,z:0},{n:'the lake',x:LAKE.x,z:LAKE.z,water:1},
    {n:'the airfield',x:FLD.x,z:FLD.z},{n:'the dirt track',x:-60,z:30},{n:'the arena',x:(ARENA.x0+ARENA.x1)/2,z:(ARENA.z0+ARENA.z1)/2},{n:'the fire truck',x:TRUCK.x,z:TRUCK.z}];
  if(FIRE.L.length)L.push({n:'the fire',x:FIRE.L[0].x,z:FIRE.L[0].z});return L;}
function aiSpec2(i,kind){const pick=o=>{const k=Object.keys(o);return o[k[Math.floor(Math.random()*k.length)]];};let V;
  if(kind==='drone'){const sp=sanitize(JSON.parse(JSON.stringify(pick(PRESETS))));sp.name=AI_NAMES[i].replace('🤖 ','')+'\'s drone';sp.colors=Object.assign({},sp.colors,{body:AI_COLS[i]});return sp;}
  if(kind==='sub')V=VPRESETS.boat.sub;else if(kind==='boat'){const b=Object.assign({},VPRESETS.boat);delete b.sub;V=pick(b);}else V=pick(VPRESETS[kind]||VPRESETS.plane);
  const sp=sanitize(JSON.parse(JSON.stringify(V)));sp.colors=Object.assign({},sp.colors,{body:AI_COLS[i]});sp.name=AI_NAMES[i].replace('🤖 ','')+'\'s '+kind;return sp;}
// where a vehicle of this kind starts
function aiStartAt(B,kind){const p=B.p;
  if(kind==='boat'||kind==='sub'){const a=Math.random()*6.28;p.set(LAKE.x+Math.cos(a)*LAKE.rx*0.5,WATER_Y+0.05,LAKE.z+Math.sin(a)*LAKE.rz*0.5);B.pil.set(LAKE.x-LAKE.rx-4,0,LAKE.z+3);}
  else if(kind==='plane'){p.set(FLD.x+(Math.random()-0.5)*20,0,FLD.z+(Math.random()-0.5)*10);p.y=H(p.x,p.z)+0.3;B.pil.set(FLD.x,0,FLD.z+16);B.yaw=Math.random()*6.28;}
  else if(kind==='car'){if(inWater(p.x,p.z)||p.y-H(p.x,p.z)>3){p.set(PAD.x+(Math.random()-0.5)*20,0,PAD.z+(Math.random()-0.5)*20);}p.y=H(p.x,p.z)+0.15;B.pil.set(p.x+2,0,p.z+2);}
  else{if(inWater(p.x,p.z)){p.set(PAD.x+(Math.random()-0.5)*16,0,PAD.z+(Math.random()-0.5)*16);}p.y=Math.max(p.y,H(p.x,p.z)+0.2);B.mode='takeoff';B.pil.set(p.x+2,0,p.z+2);}
  B.v.set(0,0,0);B.wp=null;B.goal=null;B.spd=0;}
function aiRespawnQuiet(B){const cs=chatSys;chatSys=function(t){if(/joined|left/.test(String(t)))return;return cs.apply(this,arguments);};try{mpDrop(B.id,false);mpRecv({id:B.id,n:B.name,t:'sp',spec:aiSpec2(B.i,B.kind),rad:0.5,col:AI_COLS[B.i]});}finally{chatSys=cs;}}
function aiSwitch(B,kind,why){if(!kind||!AI_VK.includes(kind))kind=AI_VK.filter(k=>k!==B.kind)[Math.floor(Math.random()*(AI_VK.length-1))];if(kind===B.kind&&!why)return;
  B.kind=kind;aiStartAt(B,kind);aiRespawnQuiet(B);B.swT=50+Math.random()*70;B.act=null;
  chatAdd(B.name,why||['Switching to my '+kind+' '+AI_VIC[kind]+'!','Time for the '+kind+' '+AI_VIC[kind],'Let\'s take the '+kind+' out '+AI_VIC[kind],'Ooh, '+kind+' time '+AI_VIC[kind]][Math.floor(Math.random()*4)],AI_COLS[B.i]);}
// built-in brain for drones/helis: sometimes visit a named place or follow the player around
{const p0=aiPickGoal;aiPickGoal=function(B){const r=Math.random();
  if(r<0.3&&!(FIRE.L.length&&Math.random()<0.5)){const P=aiPlaces().filter(q=>!q.water||B.kind==='heli');const q=P[Math.floor(Math.random()*P.length)];B.goal={x:q.x+(Math.random()-0.5)*14,z:q.z+(Math.random()-0.5)*14,h:6+Math.random()*20,kind:'go'};if(Math.random()<0.4)B.say='Heading to '+q.n+'!';return;}
  if(r<0.38){B.goal={kind:'chase',t:10+Math.random()*10};if(Math.random()<0.4)B.say=['Wait for me!','Following you!','Race you!'][Math.floor(Math.random()*3)];return;}
  return p0.apply(this,arguments);};}
// a waypoint wanderer for planes, boats, subs and cars (they go everywhere, not in one circle)
function aiPickWp(B){const k=B.kind,P=aiPlaces();
  if(k==='boat'||k==='sub'){for(let n=0;n<12;n++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*0.85,x=LAKE.x+Math.cos(a)*LAKE.rx*r,z=LAKE.z+Math.sin(a)*LAKE.rz*r;if(inWater(x,z))return{x,z,y:k==='sub'?WATER_Y-(1.5+Math.random()*4):WATER_Y+0.05};}return{x:LAKE.x,z:LAKE.z,y:WATER_Y};}
  if(k==='plane'){const r=Math.random();if(r<0.45){const q=P[Math.floor(Math.random()*P.length)];if(Math.random()<0.3)B.say='Flying over '+q.n+' ✈️';return{x:q.x,z:q.z,alt:r<0.15?14:30+Math.random()*25};}
    if(r<0.6&&D.pos){return{x:D.pos.x,z:D.pos.z,alt:20,buzz:1};}const a=Math.random()*6.28,d=150+Math.random()*250;return{x:Math.cos(a)*d,z:Math.sin(a)*d,alt:35+Math.random()*40};}
  // car: anywhere on dry land near the action, sometimes a lap of the dirt track
  if(Math.random()<0.25)return{track:1,t0:Math.random()};
  for(let n=0;n<15;n++){const q=P[Math.floor(Math.random()*P.length)],x=q.x+(Math.random()-0.5)*40,z=q.z+(Math.random()-0.5)*40;if(!inWater(x,z)&&!(hitTest&&hitTest(new V3(x,H(x,z)+0.6,z),0.6))){if(Math.random()<0.3)B.say='Driving to '+q.n+' 🚙';return{x,z};}}
  return{x:PAD.x+(Math.random()-0.5)*40,z:PAD.z+(Math.random()-0.5)*40};}
function aiTurn(cur,want,max){let d=want-cur;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return cur+clamp(d,-max,max);}
aiVehTick=function(B,dt){const k=B.kind;B.ph+=dt;if(!B.wp||B.wpT<=0){B.wp=aiPickWp(B);B.wpT=k==='plane'?25:20;if(B.say){chatAdd(B.name,B.say,AI_COLS[B.i]);B.say='';}}B.wpT-=dt;
  const W=B.wp;let x=B.p.x,y=B.p.y,z=B.p.z,roll=0,pitch=0,st='flying',sp=60;
  if(W.track){W.t0=(W.t0+dt*0.012)%1;const p=TRACK.cv.getPointAt(W.t0),d=TRACK.cv.getTangentAt(W.t0);x=p.x;z=p.z;y=H(x,z)+0.15;B.yaw=Math.atan2(-d.x,-d.z);sp=0;if(B.wpT<=0)B.wp=null;}
  else{const dx=W.x-x,dz=W.z-z,dist=Math.hypot(dx,dz),want=Math.atan2(-dx,-dz);
    if(k==='plane'){const top=24;B.spd=Math.min(top,(B.spd||0)+dt*6);const turn=0.55;const ny=aiTurn(B.yaw,want,turn*dt);roll=clamp((ny-B.yaw)/dt/turn,-1,1)*-0.7;B.yaw=ny;
      const gy=H(x,z),onRwy=B.spd<14;const ty=onRwy?gy+0.3:Math.max(gy+(W.alt||35),H(x-Math.sin(B.yaw)*40,z-Math.cos(B.yaw)*40)+12);y+=clamp(ty-y,-6*dt,7*dt);pitch=clamp((ty-y)*0.04,-0.35,0.35);
      if(B.loop>0){B.loop-=dt;pitch=(1-B.loop/2.5)*6.2832;}else if(Math.random()<dt*0.02&&y-gy>30){B.loop=2.5;if(Math.random()<0.5)B.say='Watch this loop!';}
      x-=Math.sin(B.yaw)*B.spd*dt;z-=Math.cos(B.yaw)*B.spd*dt;if(dist<25)B.wp=null;if(B.spd<14)st='landed';}
    else if(k==='boat'||k==='sub'){const top=k==='sub'?4:9;B.spd=Math.min(top,(B.spd||0)+dt*3);B.yaw=aiTurn(B.yaw,want,1.1*dt);const nx=x-Math.sin(B.yaw)*B.spd*dt,nz=z-Math.cos(B.yaw)*B.spd*dt;
      if(inWater(nx,nz)){x=nx;z=nz;}else{B.yaw+=1.5;B.wp=null;}const ty=k==='sub'?Math.max(W.y,H(x,z)+0.6):WATER_Y+0.05;y+=clamp(ty-y,-1.2*dt,1.2*dt);roll=k==='boat'?clamp(aiTurn(0,want-B.yaw,1)*0.25,-0.2,0.2):0;pitch=k==='boat'?-0.05-Math.sin(B.ph*3)*0.03:0;sp=k==='boat'?20:5;if(dist<5)B.wp=null;}
    else{const top=8;B.spd=Math.min(top,(B.spd||0)+dt*4);B.yaw=aiTurn(B.yaw,want,1.4*dt);const nx=x-Math.sin(B.yaw)*B.spd*dt,nz=z-Math.cos(B.yaw)*B.spd*dt;
      if(!inWater(nx,nz)&&!hitTest(new V3(nx,H(nx,nz)+0.5,nz),0.4)){x=nx;z=nz;}else{B.yaw+=1.2+Math.random();B.spd=1;B.stuck=(B.stuck||0)+1;if(B.stuck>40){B.stuck=0;B.wp=null;}}
      y=H(x,z)+0.15;const g2=H(x-Math.sin(B.yaw)*0.8,z-Math.cos(B.yaw)*0.8);pitch=clamp((g2-H(x,z))*0.9,-0.5,0.5);sp=0;if(dist<3)B.wp=null;}}
  _ae2.set(pitch,B.yaw,roll,'YXZ');B.q.setFromEuler(_ae2);const v=[(x-B.p.x)/Math.max(dt,1e-3),(y-B.p.y)/Math.max(dt,1e-3),(z-B.p.z)/Math.max(dt,1e-3)];B.p.set(x,y,z);
  if(k!=='plane'||B.spd>=14){}else B.pil.set(FLD.x,0,FLD.z+16);
  mpRecv({id:B.id,n:B.name,t:'s',p:[x,y,z],r:[B.q.x,B.q.y,B.q.z,B.q.w],v,st,a:1,sp,pl:[B.pil.x,H(B.pil.x,B.pil.z),B.pil.z]});};
// every so often each pilot switches to a different vehicle (like you do)
{const a0=aiTick;aiTick=function(dt){for(const B of AIB.L){if(B.dead)continue;if(B.yaw==null)B.yaw=0;if(B.swT==null)B.swT=20+Math.random()*60;if(!AIB.claude||AIB.ok!==true)B.swT-=dt;else B.swT-=dt*0.5;if(B.swT<=0)aiSwitch(B);}return a0.apply(this,arguments);};}
// AI pilots start on a random vehicle instead of a fixed one
{const m0=aiMake;aiMake=function(i){const B=m0.apply(this,arguments);const kind=AI_VK[Math.floor(Math.random()*AI_VK.length)];B.kind=kind;aiStartAt(B,kind);aiRespawnQuiet(B);B.swT=30+Math.random()*60;return B;};}
// dead pilots come back on their current vehicle
{const s0=aiSpec;aiSpec=function(i){const B=AIB.L.find(b=>b.i===i);return B&&B.kind?aiSpec2(i,B.kind):s0.apply(this,arguments);};}
function aiApply(arr){(Array.isArray(arr)?arr:[]).forEach(o=>{const B=AIB.L.find(b=>b.name.replace('🤖 ','').toLowerCase()===String(o.name||'').toLowerCase());if(!B||B.dead)return;
    const veh=String(o.vehicle||'').toLowerCase();if(AI_VK.includes(veh)&&veh!==B.kind)aiSwitch(B,veh,o.say?String(o.say).slice(0,80):null);else if(o.say)B.say=String(o.say).slice(0,80);
    const d=String(o.do||'go'),P=aiPlaces();let q=null;if(o.place){const nm=String(o.place).toLowerCase().replace(/^the /,'');q=P.find(p=>p.n.toLowerCase().includes(nm));}
    const tx=q?q.x:+o.x,tz=q?q.z:+o.z;
    if(B.kind==='drone'||B.kind==='heli'){if(B.mode!=='fly')return;
      if(d==='fire'&&FIRE.L.length){const F=FIRE.L.reduce((a,f)=>Math.hypot(f.x-(tx||0),f.z-(tz||0))<Math.hypot(a.x-(tx||0),a.z-(tz||0))?f:a);B.goal={x:F.x,z:F.z,h:7,kind:'fire',F};}
      else if(d==='race'&&courses[o.track])B.goal={kind:'race',C:courses[o.track],i:0};else if(d==='chase')B.goal={kind:'chase',t:12};else if(d==='flip')B.goal={kind:'flip',t:1.5};
      else if(d==='land')B.goal={x:isFinite(tx)?tx:PAD.x,z:isFinite(tz)?tz:PAD.z,h:0,kind:'land'};else if(isFinite(tx)&&isFinite(tz))B.goal={x:tx,z:tz,h:clamp(+o.h||18,4,60),kind:'go'};B.t=12;}
    else if(isFinite(tx)&&isFinite(tz)){if(B.kind==='boat'||B.kind==='sub'){if(inWater(tx,tz))B.wp={x:tx,z:tz,y:B.kind==='sub'?WATER_Y-3:WATER_Y+0.05};}else if(B.kind==='plane')B.wp={x:tx,z:tz,alt:clamp(+o.h||30,12,80)};else if(!inWater(tx,tz))B.wp={x:tx,z:tz};B.wpT=25;}
    else if(d==='chase'&&B.kind==='plane')B.wp={x:D.pos.x,z:D.pos.z,alt:20};});}

