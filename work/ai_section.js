// ================================================================ 🤖 AI PILOTS: other drones flying around with their own pilots — they race the hoops, do flips, chase you, fight fires.
// 🧠 Brain: the built-in AI, or a local Ollama computer on the Wi-Fi (no internet, no keys).
const AIB={n:LS.get('aiN',0),L:[],claude:LS.get('aiClaude',false),key:'',ok:null,busy:false,t:0,err:''};
const AI_NAMES=['🤖 Ace','🤖 Blaze','🤖 Comet','🤖 Dash','🤖 Echo','🤖 Fizz','🤖 Gizmo','🤖 Hawk','🤖 Iggy','🤖 Jet'],AI_COLS=['#ff3b30','#34c759','#0a84ff','#ff9f0a','#bf5af2','#ff2d55','#64d2ff','#ffd60a','#30d158','#ac8e68'];
const AI_KINDS=['drone','plane','boat','drone','car','sub','heli','drone','plane','boat'];
function aiSpec(i){const k=AI_KINDS[i%AI_KINDS.length];if(k!=='drone'){const V=k==='sub'?VPRESETS.boat.sub:k==='car'?(VPRESETS.car.crawler||Object.values(VPRESETS.car)[0]):k==='boat'?VPRESETS.boat.speed:Object.values(VPRESETS[k]||{})[0];if(V){const sp=sanitize(JSON.parse(JSON.stringify(V)));sp.colors=Object.assign({},sp.colors,{body:AI_COLS[i]});sp.name=AI_NAMES[i].replace('🤖 ','')+'\'s '+k;return sp;}}const sp=sanitize(PRESETS.mini);sp.name=AI_NAMES[i].replace('🤖 ','');sp.colors=Object.assign({},sp.colors,{body:AI_COLS[i],arms:'#333333'});return sp;}
function aiMake(i){const id='bot'+i,a=i/10*6.28,x=PAD.x+Math.cos(a)*14,z=PAD.z+Math.sin(a)*14;
  const B={kind:AI_KINDS[i%AI_KINDS.length],ph:Math.random()*6.28,i,id,name:AI_NAMES[i],p:new V3(x,H(x,z)+0.2,z),v:new V3(),yaw:a,goal:null,mode:'takeoff',t:1+Math.random()*3,pil:new V3(x+2,0,z+2),q:new THREE.Quaternion(),flip:0,say:''};AIB.L.push(B);
  mpRecv({id,n:B.name,t:'sp',spec:aiSpec(i),rad:0.5,col:AI_COLS[i]});return B;}
function aiSet(n){n=clamp(n|0,0,10);AIB.n=n;LS.set('aiN',n);while(AIB.L.length>n){const B=AIB.L.pop();mpDrop(B.id,true);}while(AIB.L.length<n)aiMake(AIB.L.length);}
// the built-in brain: pick something fun to do
function aiPickGoal(B){const r=Math.random(),gy=(x,z)=>H(x,z);
  if(FIRE.L.length&&r<0.45){const F=FIRE.L[Math.floor(Math.random()*FIRE.L.length)];B.goal={x:F.x,z:F.z,h:7,kind:'fire',F};B.say=Math.random()<0.3?'Water drop incoming!':'';return;}
  if(r<0.25){const keys=Object.keys(courses).filter(k=>courses[k].cps&&courses[k].cps.length&&!courses[k].custom&&(courses[k].kinds||['drone']).includes('drone'));const C=courses[keys[Math.floor(Math.random()*keys.length)]];if(C){B.goal={kind:'race',C,i:0};B.say=Math.random()<0.4?'Racing '+C.name.replace(/^\S+\s/,'')+'!':'';return;}}
  if(r<0.4){B.goal={kind:'chase',t:12};B.say=Math.random()<0.5?'Catch me if you can!':'';return;}
  if(r<0.5){B.goal={kind:'flip',t:1.5};return;}
  if(r<0.58){B.goal={x:PAD.x+(Math.random()-0.5)*10,z:PAD.z+(Math.random()-0.5)*10,h:0,kind:'land'};return;}
  const a=Math.random()*6.28,d=30+Math.random()*160,x=B.p.x+Math.cos(a)*d,z=B.p.z+Math.sin(a)*d;B.goal={x,z,h:16+Math.random()*16,kind:'go'};}
const _ad=new V3(),_ae2=new THREE.Euler();
function aiTick(dt){if(!AIB.L.length)return;const now=performance.now();
  if(AIB.claude&&!AIB.busy&&now-AIB.t>5000){AIB.t=now;aiAskClaude();}
  for(const B of AIB.L){if(B.kind&&B.kind!=='drone'&&B.kind!=='heli'){aiVehTick(B,dt);continue;}B.t-=dt;let want=null,hgt=18,maxV=12;
    if(B.mode==='landed'){if(B.t<=0){B.mode='takeoff';}}
    else if(B.mode==='takeoff'){want=new V3(B.p.x,H(B.p.x,B.p.z)+8,B.p.z);if(B.p.y-H(B.p.x,B.p.z)>6){B.mode='fly';aiPickGoal(B);}}
    else{const G=B.goal;if(!G||B.t<=0&&G.kind!=='race'){aiPickGoal(B);B.t=10+Math.random()*12;}
      const g=B.goal;if(g.kind==='race'){const cp=g.C.cps[g.i];if(!cp){B.goal=null;}else{const c=cp.c;want=new V3(c.x,c.y,c.z);maxV=11;if(B.p.distanceTo(want)<2){g.i++;if(g.i>=g.C.cps.length){B.goal=null;B.say='Finished the '+g.C.name.replace(/^\S+\s/,'')+'!';}}}}
      else if(g.kind==='chase'){g.t-=dt;want=D.pos.clone().add(_ad.set(Math.sin(now/900+B.i)*6,3,Math.cos(now/900+B.i)*6));maxV=14;if(g.t<=0)B.goal=null;}
      else if(g.kind==='flip'){g.t-=dt;B.flip+=dt*7;want=B.p.clone();if(g.t<=0){B.flip=0;B.goal=null;}}
      else{const gy=H(g.x,g.z);want=new V3(g.x,gy+(g.kind==='land'?0.15:g.h),g.z);
        if(g.kind==='fire'){if(!FIRE.L.includes(g.F)){B.goal=null;}else if(Math.hypot(B.p.x-g.F.x,B.p.z-g.F.z)<3){g.F.int-=dt*0.08;if(Math.random()<dt*30)aiDrop(B);if(g.F.int<=0){fireDel(g.F,'bot');chatSys(B.name+' put out a fire 🚒');B.goal=null;}}}
        if(g.kind==='land'&&B.p.distanceTo(want)<0.6){B.mode='landed';B.t=4+Math.random()*6;B.goal=null;}
        else if(g.kind!=='land'&&Math.hypot(B.p.x-g.x,B.p.z-g.z)<3&&g.kind!=='fire')B.goal=null;}}
    if(B.say){chatAdd(B.name,B.say,AI_COLS[B.i]);B.say='';}
    // fly: steer the velocity toward the target, stay above the trees when travelling far
    if(want&&B.mode!=='landed'){_ad.subVectors(want,B.p);const d=_ad.length();const far=Math.hypot(_ad.x,_ad.z)>25;if(far)_ad.y=Math.max(_ad.y,(H(B.p.x,B.p.z)+hgt)-B.p.y);
      const sp=Math.min(maxV,d*1.2);_ad.setLength(sp);B.v.lerp(_ad,1-Math.exp(-dt*1.6));}else B.v.multiplyScalar(Math.exp(-dt*4));
    B.p.addScaledVector(B.v,dt);const gy=H(B.p.x,B.p.z);if(B.p.y<gy+0.15){B.p.y=gy+0.15;B.v.y=Math.max(0,B.v.y);}
    const hs=Math.hypot(B.v.x,B.v.z);if(hs>0.5)B.yaw=Math.atan2(-B.v.x,-B.v.z);
    _ae2.set(clamp(-hs*0.035,-0.5,0.5)+(B.flip?B.flip:0),B.yaw,0,'YXZ');B.q.setFromEuler(_ae2);
    mpRecv({id:B.id,n:B.name,t:'s',p:[B.p.x,B.p.y,B.p.z],r:[B.q.x,B.q.y,B.q.z,B.q.w],v:[B.v.x,B.v.y,B.v.z],st:B.mode==='landed'?'landed':'flying',a:1,sp:B.mode==='landed'?0:60,pl:[B.pil.x,H(B.pil.x,B.pil.z),B.pil.z]});}}
function aiDrop(B){fireTex();if(FIRE.drops.length>320)return;const m=new THREE.Mesh(FIRE.dg||(FIRE.dg=new THREE.SphereGeometry(0.07,5,4)),FIRE.dm||(FIRE.dm=new THREE.MeshBasicMaterial({color:0x9fdcff,transparent:true,opacity:0.75})));m.position.set(B.p.x,B.p.y-0.3,B.p.z);scene.add(m);FIRE.drops.push({m,v:new V3((Math.random()-0.5)*1.4,-1,(Math.random()-0.5)*1.4)});}
function aiAskClaude(){AIB.busy=false;} // no cloud AI: the brain is the local Ollama computer (see aiAskLocal)
function aiItems(){return[];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Races & games/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem(()=>'🤖 AI pilots'+(AIB.n?' ('+AIB.n+' flying)':'')+' ▸',()=>menuPush('🤖 AI pilots',aiItems())));return L;};}
{const f0=fireTick;fireTick=function(dt){const r=f0.apply(this,arguments);try{aiTick(dt);}catch(e){console.warn('ai',e);}return r;};}
setTimeout(()=>{if(AIB.n&&started)aiSet(AIB.n);else if(AIB.n){const iv=setInterval(()=>{if(started){clearInterval(iv);aiSet(AIB.n);}},500);}},1500);

// planes circle the airfield, boats + subs cruise the lake, the rock crawler laps the dirt track
function aiVehTick(B,dt){B.ph+=dt;let x,y,z,yaw,roll=0,pitch=0,st='flying',sp=60;const k=B.kind;
  if(k==='plane'){const cx=(typeof FLD!=='undefined'?FLD.x:-110),cz=(typeof FLD!=='undefined'?FLD.z:-68),R=110+B.i*12,w=0.18-B.i*0.008,a=B.ph*w;x=cx+Math.cos(a)*R;z=cz+Math.sin(a)*R;y=H(x,z)+38+Math.sin(B.ph*0.3)*8;yaw=Math.atan2(Math.sin(a),-Math.cos(a));roll=-0.45;pitch=Math.cos(B.ph*0.3)*0.08;B.pil.set(cx,0,cz+16);}
  else if(k==='boat'||k==='sub'){const a=B.ph*(k==='sub'?0.06:0.11)+B.i;x=LAKE.x+Math.cos(a)*LAKE.rx*0.62;z=LAKE.z+Math.sin(a)*LAKE.rz*0.62;y=k==='sub'?WATER_Y-(2+Math.sin(B.ph*0.2)*1.8):WATER_Y+0.05;yaw=Math.atan2(Math.sin(a)*LAKE.rx,-Math.cos(a)*LAKE.rz);roll=k==='boat'?0.12:0;pitch=Math.sin(B.ph*2)*0.03;B.pil.set(LAKE.x-LAKE.rx-4,0,LAKE.z+3);sp=8;}
  else{const t=(B.ph*0.012+B.i*0.1)%1,p=TRACK.cv.getPointAt(t),d=TRACK.cv.getTangentAt(t);x=p.x;z=p.z;y=H(x,z)+0.15;yaw=Math.atan2(-d.x,-d.z);B.pil.set(-40,0,4);sp=0;}
  _ae2.set(pitch,yaw,roll,'YXZ');B.q.setFromEuler(_ae2);const v=[(x-B.p.x)/Math.max(dt,1e-3),(y-B.p.y)/Math.max(dt,1e-3),(z-B.p.z)/Math.max(dt,1e-3)];B.p.set(x,y,z);
  mpRecv({id:B.id,n:B.name,t:'s',p:[x,y,z],r:[B.q.x,B.q.y,B.q.z,B.q.w],v,st,a:1,sp,pl:[B.pil.x,H(B.pil.x,B.pil.z),B.pil.z]});}
