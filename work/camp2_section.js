// ================================================================ 🧑‍🚒 smarter AI campers: spawn more · they drive the fire truck · you can TALK to them (chat or 📣 Shout)
const CAMP_NAMES=['Sam','Jo','Max','Lu','Ava','Ben','Kai','Mia','Leo','Zoe','Eli','Ivy','Gus','Ada','Rex','Tess'],CAMP_COLS=[0xffd60a,0x34c759,0xff9f0a,0xbf5af2,0x0a84ff,0xff375f,0x64d2ff,0xac8e68];
CAMPERS.order=null;CAMPERS.orderT=0;
function campAdd(silent){const i=CAMPERS.L.length,c=CAMP_COLS[i%CAMP_COLS.length],g=makePilot(c),a=Math.random()*6.28,x=16+Math.cos(a)*5,z=-14+Math.sin(a)*5;g.position.set(x,H(x,z),z);scene.add(g);
  const ex=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.45,8),new THREE.MeshLambertMaterial({color:0xd7263d}));ex.position.set(0.25,0.9,-0.1);g.add(ex);
  const C={noTruck:0,g,x,z,hx:x,hz:z,yaw:0,tgt:null,state:'idle',t:Math.random()*5,name:CAMP_NAMES[i%CAMP_NAMES.length]+(i>=CAMP_NAMES.length?' '+(Math.floor(i/CAMP_NAMES.length)+1):''),sprayT:0};CAMPERS.L.push(C);
  if(!silent){chatSys('🧑‍🚒 '+C.name+' joined the camp');LS.set('campN',CAMPERS.L.length);}return C;}
function campRemove(){const C=CAMPERS.L.pop();if(!C)return;if(TRUCK.ai===C)truckAiOut();scene.remove(C.g);LS.set('campN',CAMPERS.L.length);chatSys('👋 '+C.name+' went home');}
setTimeout(()=>{const n=LS.get('campN',4);while(CAMPERS.L.length<n)campAdd(true);},0);
function campSay(C,txt){chatAdd('🧑‍🚒 '+C.name,txt,'#'+(C.g.children[1]&&C.g.children[1].material&&C.g.children[1].material.color?C.g.children[1].material.color.getHexString():'ffd60a'));}
function playerPos(){return TRUCK.in?new V3(TRUCK.x,0,TRUCK.z):WALK.on?WALK.pos:D.pos;}
function nearestFire(x,z,maxD){let b=null,bd=maxD||1e9;FIRE.L.forEach(F=>{const d=Math.hypot(F.x-x,F.z-z);if(d<bd){bd=d;b=F;}});return b;}
// ---- the AI driving the fire truck
function truckAiIn(C){if(TRUCK.in||TRUCK.ai)return false;TRUCK.ai=C;C.g.visible=false;C.state='driving';campSay(C,'🚒 I\'ve got the truck!');return true;}
function truckAiOut(){const C=TRUCK.ai;if(!C)return;TRUCK.ai=null;TRUCK.aiT=null;const s=Math.sin(TRUCK.yaw),c=Math.cos(TRUCK.yaw);C.x=TRUCK.x+c*2.4;C.z=TRUCK.z-s*2.4;C.g.visible=true;C.state='idle';C.order=null;}
const _ta=new V3();
function truckAiTick(dt){const C=TRUCK.ai;if(!C)return;C.x=TRUCK.x;C.z=TRUCK.z;
  let tx=null,tz=null,stop=4,spray=false,F=null;
  if(TRUCK.tank<5){tx=TRUCK.hyd.x+3;tz=TRUCK.hyd.z+2;stop=2;if(Math.hypot(TRUCK.x-TRUCK.hyd.x,TRUCK.z-TRUCK.hyd.z)<5){TRUCK.tank=Math.min(TRUCK.cap,TRUCK.tank+dt*30);if(!C.saidFill){C.saidFill=1;campSay(C,'🚰 Filling up the truck…');}}}
  else{C.saidFill=0;const p=playerPos();F=CAMPERS.order==='truck'&&!FIRE.L.length?null:nearestFire(TRUCK.x,TRUCK.z);
    if(F){tx=F.x;tz=F.z;stop=24;}else if(CAMPERS.order==='truck'||CAMPERS.order==='follow'){tx=p.x;tz=p.z;stop=10;}else{tx=MEADOW.x0+12;tz=MEADOW.z0+5;stop=2;}}
  const dx=tx-TRUCK.x,dz=tz-TRUCK.z,d=Math.hypot(dx,dz),want=Math.atan2(-dx,-dz)+(TRUCK.aiDet>0?TRUCK.aiDetA:0);if(TRUCK.aiDet>0)TRUCK.aiDet-=dt;
  if(d>stop+2&&Math.abs(TRUCK.v)<1.5){TRUCK.aiStuck=(TRUCK.aiStuck||0)+dt;if(TRUCK.aiStuck>8){TRUCK.aiStuck=0;const c=TRUCK.ai;truckAiOut();c.noTruck=40;campSay(c,'🌲 Too many trees for the truck — I\'ll run the rest of the way!');return;}}else TRUCK.aiStuck=0;let dy=((want-TRUCK.yaw+Math.PI*3)%(Math.PI*2))-Math.PI;
  if(TRUCK.aiBack>0){TRUCK.aiBack-=dt;TRUCK.v=lerp(TRUCK.v,-4,dt*3);TRUCK.yaw+=0.8*dt;}
  else if(d>stop){TRUCK.yaw+=clamp(dy,-1,1)*1.2*dt*clamp(Math.abs(TRUCK.v)/3,0.3,1);TRUCK.v=lerp(TRUCK.v,Math.abs(dy)>1.2?3:Math.min(12,d*0.6),dt*1.2);}
  else{TRUCK.v=lerp(TRUCK.v,0,dt*3);if(F){TRUCK.yaw+=clamp(dy,-1,1)*1.5*dt;spray=Math.abs(dy)<0.25;}
    else if(!FIRE.L.length&&!CAMPERS.order&&Math.hypot(TRUCK.x-(MEADOW.x0+12),TRUCK.z-(MEADOW.z0+5))<4){truckAiOut();campSay(C,'🚒 Truck parked. Good job, team!');return;}}
  const nx=TRUCK.x-Math.sin(TRUCK.yaw)*TRUCK.v*dt,nz=TRUCK.z-Math.cos(TRUCK.yaw)*TRUCK.v*dt;_ta.set(nx,H(nx,nz)+1.2,nz);
  if(hitTest(_ta,1.4)&&Math.abs(TRUCK.v)>0.3){TRUCK.v=0;TRUCK.aiBack=1.0;TRUCK.aiDet=2.5;TRUCK.aiDetA=(Math.random()<0.5?-1:1)*(0.7+Math.random()*0.6);}else if(!(inWater(nx,nz)&&H(nx,nz)<WATER_Y-1)){TRUCK.x=nx;TRUCK.z=nz;}
  truckPlace();if(spray&&TRUCK.tank>0){TRUCK.tank=Math.max(0,TRUCK.tank-dt);truckSprayDrops(dt);if(!C.saidSpray){C.saidSpray=1;campSay(C,'💦 Spraying the fire!');}}else C.saidSpray=0;}
function truckSprayDrops(dt){const fx=-Math.sin(TRUCK.yaw),fz=-Math.cos(TRUCK.yaw),gy=H(TRUCK.x,TRUCK.z),n=Math.ceil(dt*90);fireTex();
  for(let k=0;k<n;k++){if(FIRE.drops.length>320)break;const m=new THREE.Mesh(FIRE.dg||(FIRE.dg=new THREE.SphereGeometry(0.07,5,4)),FIRE.dm||(FIRE.dm=new THREE.MeshBasicMaterial({color:0x9fdcff,transparent:true,opacity:0.75})));
    m.position.set(TRUCK.x+fx*1.6,gy+2.9,TRUCK.z+fz*1.6);scene.add(m);const sp=16+Math.random()*3,j=(Math.random()-0.5)*0.12;FIRE.drops.push({m,v:new V3((fx*Math.cos(j)-fz*Math.sin(j))*sp,6+Math.random()*1.5,(fz*Math.cos(j)+fx*Math.sin(j))*sp)});}}
// player wants the truck while an AI is driving it → the AI hops out
{const t0=truckToggle;truckToggle=function(){if(!TRUCK.in&&TRUCK.ai){const C=TRUCK.ai;truckAiOut();campSay(C,'Here, you drive!');}return t0.apply(this,arguments);};}
// ---- the campers' brains (replaces the simple one)
campersTick=function(dt){const now=performance.now()/1000;if(CAMPERS.orderT>0){CAMPERS.orderT-=dt;if(CAMPERS.orderT<=0&&CAMPERS.order!=='stay')CAMPERS.order=null;}
  truckAiTick(dt);
  CAMPERS.L.forEach((C,i)=>{if(TRUCK.ai===C)return;C.t-=dt;C.noTruck=Math.max(0,(C.noTruck||0)-dt);let gx=C.hx,gz=C.hz,run=false;const p=playerPos(),ord=CAMPERS.order;
    const range=ord==='fire'||ord==='truck'?1e9:180;let F=null;
    if(CAMPERS.on&&FIRE.L.length&&ord!=='stay'){let bd=1e9;FIRE.L.forEach(f=>{const d=Math.hypot(f.x-C.x,f.z-C.z),dh=Math.hypot(f.x-C.hx,f.z-C.hz);if(dh<range){const taken=CAMPERS.L.filter(o=>o!==C&&o.tgt===f).length;const s=d+taken*40;if(s<bd){bd=s;F=f;}}});}
    C.tgt=F;
    // far fire + free truck → someone goes to drive it
    if(F&&!(C.noTruck>0)&&!TRUCK.ai&&!TRUCK.in&&!CAMPERS.L.some(o=>o!==C&&o.state==='toTruck')&&(Math.hypot(F.x-C.x,F.z-C.z)>60||ord==='truck')&&TRUCK.tank>10)C.state='toTruck';
    if(ord==='truck'&&!(C.noTruck>0)&&!TRUCK.ai&&!TRUCK.in&&!CAMPERS.L.some(o=>o!==C&&o.state==='toTruck')&&i===0)C.state='toTruck';
    if(C.state==='toTruck'){gx=TRUCK.x+2.5;gz=TRUCK.z;run=true;if(Math.hypot(C.x-TRUCK.x,C.z-TRUCK.z)<4){if(!truckAiIn(C))C.state='idle';return;}if(TRUCK.ai||TRUCK.in)C.state='idle';}
    else if(F&&FIRE.L.includes(F)){const dx=C.x-F.x,dz=C.z-F.z,d=Math.hypot(dx,dz)||1,stand=F.r+3;gx=F.x+dx/d*stand;gz=F.z+dz/d*stand;run=true;
      if(d<stand+1.2){C.state='spray';C.yaw=Math.atan2(dx,dz);F.int-=dt*0.035;if(Math.random()<dt*25)campSpray(C,F);if(F.int<=0){fireDel(F,'camper');campSay(C,'🎉 Got that one!');}else if(Math.random()<dt*2)mpSendFireHit(F);}
      else{C.state='run';if(!C.said){C.said=1;if(Math.random()<0.6)campSay(C,['🔥 Fire! I\'m on it!','🏃 Coming!','💨 Grabbing my extinguisher!'][Math.floor(Math.random()*3)]);}}}
    else if(ord==='follow'){const a=i/Math.max(1,CAMPERS.L.length)*6.28;gx=p.x+Math.cos(a)*3;gz=p.z+Math.sin(a)*3;run=Math.hypot(gx-C.x,gz-C.z)>8;C.state='walk';}
    else if(ord==='stay'){gx=C.x;gz=C.z;C.state='idle';}
    else{C.said=0;if(C.t<=0){C.t=3+Math.random()*6;C.hx2=16+(Math.random()-0.5)*14;C.hz2=-14+(Math.random()-0.5)*14;}gx=C.hx2||C.hx;gz=C.hz2||C.hz;C.state='walk';}
    if(C.state!=='spray'){const dx=gx-C.x,dz=gz-C.z,d=Math.hypot(dx,dz);if(d>0.3){const sp=(run?4.8:1.3)*dt;C.x+=dx/d*Math.min(sp,d);C.z+=dz/d*Math.min(sp,d);C.yaw=Math.atan2(-dx,-dz)+Math.PI;}}
    C.g.position.set(C.x,H(C.x,C.z)+(run?Math.abs(Math.sin(now*10+i))*0.08:0),C.z);C.g.rotation.y=C.yaw;});};
{const t0=truckTick;truckTick=function(dt){const r=t0.apply(this,arguments);if(TRUCK.ai){const t=performance.now()/1000;TRUCK.lights.forEach((l,i)=>{l.visible=((t*3+i*0.5)%1)<0.5;});}return r;};}
// ---- talking to the AI: type in chat (Enter) or use 📣 Shout
function aiHear(txt){const s=String(txt||'').toLowerCase();if(!s)return false;let did=false;const pick=()=>CAMPERS.L[Math.floor(Math.random()*CAMPERS.L.length)];
  const say=(t,d)=>{const C=pick();if(C)setTimeout(()=>campSay(C,t),d||500);};
  if(/truck|drive|hose/.test(s)){CAMPERS.order='truck';CAMPERS.orderT=90;did=true;if(TRUCK.in)say('You\'re already in it — go get it! 🚒');else if(TRUCK.ai)say('I\'m already driving it! 🚒');else say('On it — heading for the fire truck! 🚒');}
  else if(/fire|help|burn|spread|smoke|put (it|them)? ?out|water|hurry|quick/.test(s)){CAMPERS.order='fire';CAMPERS.orderT=120;did=true;
    if(!FIRE.L.length)say('I don\'t see any fire right now… 👀');else{say(['🔥 We\'re coming!','🧯 Grab the extinguishers, everyone!','🏃 Running to the fire!'][Math.floor(Math.random()*3)]);if(FIRE.L.length&&FIRE.L.some(F=>Math.hypot(F.x-16,F.z+14)>60))setTimeout(()=>{if(!TRUCK.ai&&!TRUCK.in){CAMPERS.order='truck';}},1500);}
    if(typeof AIB!=='undefined')AIB.L.forEach(B=>{if(B.mode==='fly'&&FIRE.L.length){const F=nearestFire(B.p.x,B.p.z);B.goal={x:F.x,z:F.z,h:7,kind:'fire',F};B.t=20;}});
    if(typeof AIB!=='undefined'&&AIB.L.length&&FIRE.L.length)setTimeout(()=>chatAdd(AIB.L[0].name,'🚁 Drones on the way with water!',AI_COLS[0]),1200);}
  else if(/follow|come( here)?|with me|this way/.test(s)){CAMPERS.order='follow';CAMPERS.orderT=120;did=true;say('Right behind you! 🏃');}
  else if(/stay|stop|wait|hold on/.test(s)){CAMPERS.order='stay';CAMPERS.orderT=0;did=true;say('Okay, waiting here ✋');}
  else if(/camp|home|back|go back|rest/.test(s)){CAMPERS.order=null;CAMPERS.orderT=0;if(TRUCK.ai)TRUCK.aiHome=true;did=true;say('Heading back to camp 🏕');}
  else if(/hi|hello|hey/.test(s)){did=true;say(['Hi! 👋','Hey there!','Hello, pilot! 🚁'][Math.floor(Math.random()*3)]);}
  else if(/more|spawn|join/.test(s)&&/camper|people|help|friend|ai/.test(s)){campAdd();did=true;}
  return did;}
{const c0=chatSend;chatSend=function(txt){const t=(txt||'').trim();if(!t)return;const heard=aiHear(t);if(!mpOpen()){chatAdd(CFG.name+' (you)',t.slice(0,140),'#ffd60a');if(!heard)setTimeout(()=>{const C=CAMPERS.L[0];if(C)campSay(C,'Try: "help, fire!", "get in the truck", "follow me", "stay", "go back to camp" 🙂');},600);return;}return c0.apply(this,arguments);};}
function shoutItems(){const S=(lab,txt)=>mItem(lab,()=>{chatSend(txt);menuToggle(false);});return[mInfo('📣 Shout to the AI campers and AI pilots (or press Enter and type it in chat)'),
  S('🔥 "Help! Put out the fire!"','Help! Put out the fire!'),S('🚒 "Get in the fire truck!"','Get in the fire truck!'),S('🌲 "The trees are on fire — it\'s spreading fast!"','The trees are on fire, it\'s spreading fast!'),
  S('🏃 "Follow me!"','Follow me!'),S('✋ "Stay here!"','Stay here!'),S('🏕 "Go back to camp"','Go back to camp'),mItem('◀ Back',()=>menuBack())];}
function campItems(){return[mItem(()=>'➕ Spawn another AI camper ('+CAMPERS.L.length+' now)',()=>campAdd()),mItem('➖ Send one camper home',()=>campRemove()),
  mItem(()=>'➕ Spawn another AI drone pilot ('+(AIB.n||0)+' now)',()=>aiSet((AIB.n||0)+1)),mItem('📣 Shout to the AI ▸',()=>menuPush('📣 Shout',shoutItems())),
  mItem(()=>'🧑‍🚒 Campers fight fires: '+(CAMPERS.on?'ON':'off'),()=>{CAMPERS.on=!CAMPERS.on;LS.set('campersOn',CAMPERS.on);}),mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Take me to the fire truck/.test(it.label());}catch(e){return false;}});
  L.splice(i+1,0,mItem('📣 Shout to the AI (help! fire! get in the truck!) ▸',()=>menuPush('📣 Shout',shoutItems())),mItem(()=>'🧑‍🚒 AI campers ('+CAMPERS.L.length+') — spawn more ▸',()=>menuPush('🧑‍🚒 AI campers',campItems())));return L;};}
{const f0=fireItems;fireItems=function(){const L=f0();L.splice(2,0,mItem(()=>'➕ Spawn another AI camper ('+CAMPERS.L.length+' now)',()=>campAdd()),mItem('📣 Shout to the AI ▸',()=>menuPush('📣 Shout',shoutItems())));return L;};}
