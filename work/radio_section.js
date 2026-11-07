// ---------------------------------------------------------------- radio: rates, expo, trims, flaps, throttle cut, smoke · pause / slow-mo / rescue · flight lessons (RealFlight-style)
const RADIO=Object.assign({rate:'high',expo:30,trim:{a:0,e:0,r:0},smokeCol:'#ffffff'},LS.get('radio',{}));
function radioSave(){LS.set('radio',{rate:RADIO.rate,expo:RADIO.expo,trim:RADIO.trim,smokeCol:RADIO.smokeCol});}
D.flaps=0;D.thrCut=false;D.smoke=false;D.cs=[0,0,0,0];D.rescue=0;
function rdIn(v,ax){const e=RADIO.expo/100;v=v*(1-e)+v*v*v*e;v*=RADIO.rate==='low'?0.6:1;return clamp(v+(RADIO.trim[ax]||0)*0.01,-1,1);}
// moving control surfaces: ailerons, flaps, elevator, rudder, elevons
function csApply(M,c){if(!M||!M.surf)return;const S=M.surf,k=0.42,a=c[0]||0,e=c[1]||0,r=c[2]||0,f=c[3]||0;
  if(S.ail){S.ail[0].rotation.x=a*k;S.ail[1].rotation.x=-a*k;}
  if(S.flap)S.flap.forEach(h=>h.rotation.x=f*0.7);
  if(S.elev)S.elev.rotation.x=-e*k;
  if(S.rud)S.rud.rotation.y=r*k;
  if(S.elevon){S.elevon[0].rotation.x=clamp(-e+a,-1,1)*0.38;S.elevon[1].rotation.x=clamp(-e-a,-1,1)*0.38;}}
function csSet(a,e,r,dt){const c=D.cs,k=Math.min(1,dt*14);c[0]+=(a-c[0])*k;c[1]+=(e-c[1])*k;c[2]+=(r-c[2])*k;c[3]+=(D.flaps-c[3])*Math.min(1,dt*2.5);csApply(DR,c);}
// switches
function flapSet(v,quiet){D.flaps=v;if(!quiet)toast('🪶 Flaps '+(v>=1?'FULL':v>0?'HALF':'UP'),1100);}
function flapCycle(){flapSet(D.flaps>=1?0:D.flaps>0?1:0.5);}
function cutSet(on,quiet){D.thrCut=on;if(on)D.thr=0;if(!quiet)toast(on?'✋ THROTTLE CUT — motor can\'t run':'✅ Throttle cut off — motor live!',1300);}
function ratesSet(r,quiet){RADIO.rate=r;radioSave();if(!quiet)toast('🎚 Rates '+r.toUpperCase()+(r==='low'?' (gentle — 60%)':' (full throw)'),1100);}
function smokeToggle(){D.smoke=!D.smoke;toast(D.smoke?'💨 Smoke ON':'💨 Smoke off',900);}
function radioState(a,pos,quiet){if(a==='rates'){ratesSet(pos,quiet);return true;}if(a==='flaps'){flapSet(pos==='full'?1:pos==='half'?0.5:0,quiet);return true;}if(a==='thrcut'){cutSet(pos==='on',quiet);return true;}return false;}
Object.assign(ACTS,{rates:{n:'🎚 Dual rates switch: LOW · HIGH',t:'state',pos:['low','high']},flaps:{n:'🪶 Flaps switch: UP · HALF · FULL',t:'state',pos:['up','half','full']},
  thrcut:{n:'✋ Throttle cut switch (on = motor can\'t run)',t:'state',pos:['off','on']},flapcyc:{n:'🪶 Next flap setting',t:'mom'},smoke:{n:'💨 Smoke on / off',t:'mom'},
  pause:{n:'⏸ Pause',t:'mom'},slowmo:{n:'🐢 Slow motion',t:'mom'},rescue:{n:'🛟 Rescue (levels the wings and climbs)',t:'mom'}});
ACT_ORDER.push('rates','flaps','flapcyc','thrcut','smoke','rescue','pause','slowmo');
// smoke trail
const SMK=[];let smkGeo=null,smkT=0;const _smp=new V3(),_smb=new V3();
function smokeAt(p,col){if(SMK.length>260){const o=SMK.shift();scene.remove(o.m);o.m.material.dispose();}
  if(!smkGeo)smkGeo=new THREE.SphereGeometry(0.5,8,6);
  const m=new THREE.Mesh(smkGeo,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.6,depthWrite:false}));m.position.copy(p);m.scale.setScalar(0.3);scene.add(m);SMK.push({m,t:0});}
function smokeFrom(g,rad,col){_smb.set(0,0,1).applyQuaternion(g.quaternion);_smp.copy(g.position).addScaledVector(_smb,Math.max(0.3,rad*0.9));_smp.x+=(Math.random()-0.5)*0.15;_smp.y+=(Math.random()-0.5)*0.15;smokeAt(_smp,col);}
function tickSmoke(dt){smkT-=dt;
  if(smkT<=0){smkT=0.04;
    if(D.smoke&&DR&&(D.state==='flying'||D.state==='takeoff')&&!D.hidden)smokeFrom(DR.g,ST.rad||0.5,RADIO.smokeCol);
    if(typeof mp!=='undefined')for(const id in mp.peers){const pe=mp.peers[id];if(pe.sm&&pe.mesh&&pe.st==='flying')smokeFrom(pe.mesh.g,pe.rad||0.5,pe.sm);}}
  for(let i=SMK.length-1;i>=0;i--){const s=SMK[i];s.t+=dt;const u=s.t/7;if(u>=1){scene.remove(s.m);s.m.material.dispose();SMK.splice(i,1);continue;}
    s.m.scale.setScalar(0.3+s.t*0.55);s.m.material.opacity=0.6*(1-u)*(1-u*0.3);s.m.position.y+=dt*0.12;s.m.position.x+=wind.x*dt*0.8;s.m.position.z+=wind.z*dt*0.8;}}
// pause / slow motion / rescue
const SIM={pause:false,speed:1};
function simBanner(){let b=document.getElementById('simBan');if(!b){b=document.createElement('div');b.id='simBan';b.style.cssText='position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:30;background:rgba(0,0,0,0.6);color:#fff;font:700 18px system-ui;padding:6px 16px;border-radius:12px;pointer-events:none;display:none';document.body.appendChild(b);}
  b.textContent=SIM.pause?'⏸ PAUSED — press Z (or ⏸) to fly again':SIM.speed<1?'🐢 SLOW MOTION '+SIM.speed+'×':'';b.style.display=b.textContent?'block':'none';}
function pauseToggle(){SIM.pause=!SIM.pause;simBanner();if(typeof mp!=='undefined'&&mpOpen()&&SIM.pause)toast('⏸ Only your aircraft freezes — the others keep flying',2200);}
function slowCycle(){const L=[1,0.5,0.25];SIM.speed=L[(L.indexOf(SIM.speed)+1)%L.length];simBanner();toast(SIM.speed===1?'▶ Normal speed':'🐢 Slow motion '+SIM.speed+'×',1100);}
function rescue(){if(D.state!=='flying'){toast('🛟 Rescue works while flying',1200);return;}
  if(vkind()==='plane'){D.rescue=3;D.man=null;toast('🛟 Rescue! Wings level, climbing…',1300);}
  else{D.vel.multiplyScalar(0.1);toast('🛟 Rescue! Stopped',1000);}}
// ---------------------------------------------------------------- flight lessons + challenges (like RealFlight's Virtual Flight Instructor)
const LES={on:false,k:null,step:0,t:0,g:null,pa:0,ra:0,ya:0,q:new THREE.Quaternion(),yaw0:0,best:null};
const _lq=new THREE.Quaternion();
function agl(){return D.pos.y-H(D.pos.x,D.pos.z);}
function homeDist(){return Math.hypot(D.pos.x-LES.hx,D.pos.z-LES.hz);}
function onGroundStill(){return agl()<Math.max(0.6,(ST.legs||0.2)+0.3)&&D.vel.length()<0.7;}
function hold(sec,ok,dt){if(ok)LES.t+=dt;else LES.t=Math.max(0,LES.t-dt*2);return LES.t>=sec;}
const LESSONS={
  ptake:{n:'1 · Take-off',kinds:['plane'],tip:'Real RC pilots take off INTO the wind. Keep it straight with the rudder (left stick), don\'t yank the elevator.',steps:[
    {t:'Start the motor (🛫 button, or both sticks down + in)',c:()=>D.armed||D.state==='flying'},
    {t:'Smoothly push the throttle all the way up',c:()=>D.thr>0.8||agl()>3},
    {t:'When it\'s fast, gently pull back — climb to 20 m',c:()=>D.state==='flying'&&agl()>20},
    {t:'Level the wings and hold 15–70 m for 5 seconds',c:dt=>hold(5,agl()>15&&agl()<70&&Math.abs(D.roll)<0.35,dt),p:()=>LES.t.toFixed(1)+' / 5 s'}]},
  pturn:{n:'2 · Turns',kinds:['plane'],tip:'Bank with the ailerons, then add a little up elevator to hold height in the turn. Low rates + expo make it smoother.',steps:[
    {t:'Take off and climb to 25 m',c:()=>D.state==='flying'&&agl()>25},
    {t:'Make a full circle to the LEFT, staying between 15 and 90 m',c:()=>LES.ya>=Math.PI*2,p:()=>Math.round(Math.max(0,LES.ya)*57.3)+'° / 360°',a:'yawL'},
    {t:'Now a full circle to the RIGHT',c:()=>LES.ya<=-Math.PI*2,p:()=>Math.round(Math.max(0,-LES.ya)*57.3)+'° / 360°',a:'yawR'}]},
  ppat:{n:'3 · Fly a circuit',kinds:['plane'],tip:'A circuit is take-off → crosswind → downwind → base → final. Keep it in front of you and never fly behind your own back.',steps:[
    {t:'Take off and climb to 20 m',c:()=>D.state==='flying'&&agl()>20},
    {t:'Fly out at least 150 m from the runway',c:()=>homeDist()>150,p:()=>Math.round(homeDist())+' / 150 m'},
    {t:'Turn back and fly low over the runway (under 25 m, within 30 m)',c:()=>homeDist()<30&&agl()<25,p:()=>Math.round(homeDist())+' m away · '+Math.round(agl())+' m up'}]},
  pland:{n:'4 · Landing',kinds:['plane'],tip:'Line up far out, throttle back early, hold a gentle nose-up and let it settle. Flaps let you land slower.',steps:[
    {t:'Take off, climb to 20 m and fly out past 100 m',c:()=>D.state==='flying'&&homeDist()>100&&agl()>12},
    {t:'Throttle back (under 30%) and line up with the runway',c:()=>D.thr<0.3&&homeDist()<160},
    {t:'Touch down gently near the runway and roll to a stop',c:()=>onGroundStill()&&homeDist()<90,p:()=>Math.round(homeDist())+' m from the runway'}]},
  paero:{n:'5 · Loop & roll',kinds:['plane'],tip:'Climb high first! For a loop: full throttle, then smooth full up elevator. For a roll: full aileron and a touch of down elevator when upside down.',steps:[
    {t:'Climb to 40 m',c:()=>D.state==='flying'&&agl()>40},
    {t:'Do a LOOP — full throttle, pull all the way back',c:()=>Math.abs(LES.pa)>=Math.PI*1.8,p:()=>Math.round(Math.abs(LES.pa)*57.3)+'° / 330°',a:'pa'},
    {t:'Do a ROLL — full aileron one way',c:()=>Math.abs(LES.ra)>=Math.PI*1.8,p:()=>Math.round(Math.abs(LES.ra)*57.3)+'° / 330°',a:'ra'}]},
  pspot:{n:'🎯 Spot-landing challenge',kinds:['plane','heli','drone'],spot:true,tip:'Land as close to the yellow target as you can. Under 3 m is a bullseye!',steps:[
    {t:'Take off and fly out past 60 m',c:()=>D.state==='flying'&&homeDist()>60},
    {t:'Come back and land on the target',c:()=>onGroundStill(),p:()=>Math.round(homeDist())+' m from the target'}]},
  hhov:{n:'1 · Hover',kinds:['drone','heli'],tip:'Small, gentle stick moves. In a real heli there is no GPS — you have to fly every second!',steps:[
    {t:'Take off',c:()=>D.state==='flying'},
    {t:'Hover between 2 and 8 m, inside 5 m of the start, for 10 s',c:dt=>hold(10,agl()>2&&agl()<8&&homeDist()<5,dt),p:()=>LES.t.toFixed(1)+' / 10 s'}]},
  hnose:{n:'2 · Nose-in hover',kinds:['drone','heli'],tip:'Nose-in means the controls feel backwards: left is right! Real pilots practise this a lot.',steps:[
    {t:'Take off and climb to 3 m',c:()=>D.state==='flying'&&agl()>3},
    {t:'Turn it to face you (nose pointing at you) and hold 8 s',c:dt=>{const pp=pilotPos(),dx=pp.x-D.pos.x,dz=pp.z-D.pos.z,d=Math.hypot(dx,dz)||1,f=(-Math.sin(D.yaw)*dx-Math.cos(D.yaw)*dz)/d;return hold(8,f>0.8&&D.vel.length()<2,dt);},p:()=>LES.t.toFixed(1)+' / 8 s'}]},
  hbox:{n:'3 · Box',kinds:['drone','heli'],box:true,tip:'Fly to each glowing post in order. Try it with the camera in PILOT view, like a real flying field.',steps:[0,1,2,3].map(i=>({t:'Fly to post '+(i+1)+' of 4 (it glows)',c:()=>{const P=LES.posts&&LES.posts[i];return !!P&&Math.hypot(D.pos.x-P.x,D.pos.z-P.z)<3.5&&D.state==='flying';},post:i}))},
  hland:{n:'4 · Precision landing',kinds:['drone','heli'],spot:true,tip:'Come down slowly over the target. Stop above it, then descend.',steps:[
    {t:'Take off and fly at least 20 m away',c:()=>D.state==='flying'&&homeDist()>20},
    {t:'Land inside the target circle (1.5 m)',c:()=>onGroundStill()&&homeDist()<1.5,p:()=>homeDist().toFixed(1)+' m'}]}};
function lesBox(){let b=document.getElementById('lesBox');if(!b){b=document.createElement('div');b.id='lesBox';b.style.cssText='position:fixed;left:50%;top:96px;transform:translateX(-50%);z-index:29;background:rgba(10,20,40,0.78);color:#fff;font:15px system-ui;padding:8px 14px;border-radius:12px;max-width:min(560px,92vw);text-align:center;pointer-events:none;display:none;border:1px solid rgba(255,214,10,0.5)';document.body.appendChild(b);}return b;}
function lesMarks(){if(LES.g){scene.remove(LES.g);LES.g=null;}const L=LESSONS[LES.k];if(!L)return;const g=new THREE.Group();
  if(L.spot){[[3,'#ffd60a'],[1.5,'#ff3b30']].forEach(([r,c])=>{const m=new THREE.Mesh(new THREE.RingGeometry(r-0.25,r,40),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(LES.hx,H(LES.hx,LES.hz)+0.04,LES.hz);g.add(m);});}
  if(L.box){LES.posts=[[10,-10],[-10,-10],[-10,-30],[10,-30]].map(([a,b])=>{const c=Math.cos(LES.yaw0),s=Math.sin(LES.yaw0),x=LES.hx+a*c+b*s,z=LES.hz-a*s+b*c;const m=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,8,10),new THREE.MeshBasicMaterial({color:'#5ac8fa'}));m.position.set(x,H(x,z)+4,z);g.add(m);return{x,z,m};});}
  scene.add(g);LES.g=g;}
function lesStart(k){const L=LESSONS[k];if(!L)return;LES.k=k;LES.on=true;menuToggle(false);resetDrone(null);LES.hx=D.pos.x;LES.hz=D.pos.z;LES.yaw0=D.yaw;lesReset();lesMarks();beep(800,0.12,0.05);}
function lesReset(){LES.step=0;LES.t=0;LES.pa=0;LES.ra=0;LES.ya=0;LES.crash=false;LES.prevYaw=D.yaw;if(DR)LES.q.copy(DR.g.quaternion);LES.t0=performance.now();}
function lesStop(){LES.on=false;LES.k=null;if(LES.g){scene.remove(LES.g);LES.g=null;}lesBox().style.display='none';}
function lesDone(){const L=LESSONS[LES.k],done=LS.get('lesDone',{});let extra='';
  if(L.spot){const d=homeDist(),b=LS.get('spotBest_'+vkind(),0);extra=' — '+d.toFixed(1)+' m from the centre'+(d<3?' 🎯 BULLSEYE!':'');if(!b||d<b){LS.set('spotBest_'+vkind(),+d.toFixed(2));extra+=' (new best!)';}}
  done[LES.k]=1;LS.set('lesDone',done);beep(1200,0.25,0.06);setTimeout(()=>beep(1500,0.3,0.06),180);
  const b=lesBox();b.innerHTML='✅ <b>'+L.n+'</b> passed!'+extra+'<br><span style="font-size:13px;opacity:0.8">Menu → 🎓 Flight lessons for the next one</span>';b.style.display='block';LES.on=false;setTimeout(()=>{if(!LES.on){b.style.display='none';if(LES.g){scene.remove(LES.g);LES.g=null;}}},7000);}
function tickLessons(dt){if(!LES.on||!DR)return;const L=LESSONS[LES.k];if(!L)return lesStop();
  // spin counters
  const q=DR.g.quaternion;_lq.copy(LES.q).invert().multiply(q);LES.q.copy(q);const w=_lq.w>0?1:-1,ang=2*Math.acos(clamp(Math.abs(_lq.w),0,1));if(ang>1e-5&&ang<1){const sn=Math.sin(ang/2)||1;LES.pa+=_lq.x/sn*ang*w;LES.ra+=_lq.z/sn*ang*w;}
  let dy=D.yaw-LES.prevYaw;LES.prevYaw=D.yaw;if(dy>Math.PI)dy-=Math.PI*2;if(dy<-Math.PI)dy+=Math.PI*2;const h=agl();if(h>15&&h<90)LES.ya+=dy;
  const crashed=!['flying','landed','takeoff'].includes(D.state);
  const b=lesBox();b.style.display='block';
  if(crashed){if(!LES.crash){LES.crash=true;beep(300,0.3,0.06);}b.innerHTML='💥 <b>'+L.n+'</b> — crashed! Press ↩ reset (R) to try again';return;}
  if(LES.crash&&D.state==='landed'){lesReset();}
  const S=L.steps[LES.step];if(!S)return;
  if(S.a==='yawL'&&LES.ya<0)LES.ya=0;if(S.a==='yawR'&&LES.ya>0)LES.ya=0;
  if(LES.posts)LES.posts.forEach((P,i)=>{P.m.material.color.set(S.post===i?'#ffd60a':i<(S.post==null?4:S.post)?'#34c759':'#5ac8fa');});
  if(S.c(dt)){LES.step++;LES.t=0;LES.pa=0;LES.ra=0;LES.ya=0;beep(1000,0.12,0.05);if(LES.step>=L.steps.length){lesDone();return;}}
  const N=L.steps[LES.step];
  b.innerHTML='🎓 <b>'+L.n+'</b> · step '+(LES.step+1)+' of '+L.steps.length+'<br><span style="font-size:17px;color:#ffd60a">'+N.t+'</span>'+(N.p?'<br><span style="font-size:13px">'+N.p()+'</span>':'')+'<br><span style="font-size:12px;opacity:0.75">💡 '+L.tip+'</span>';}
function lessonItems(){const k=vkind(),done=LS.get('lesDone',{}),list=Object.keys(LESSONS).filter(n=>LESSONS[n].kinds.includes(k));
  if(!list.length)return[mInfo('Lessons are for planes, helicopters and drones — pick one of those first')];
  return[...(LES.on?[mItem('⏹ Stop this lesson',()=>{lesStop();menuToggle(false);})]:[]),
    ...list.map(n=>mItem(()=>(done[n]?'✅ ':'▫️ ')+LESSONS[n].n+(LESSONS[n].spot&&LS.get('spotBest_'+k,0)?'  (best '+LS.get('spotBest_'+k,0)+' m)':''),()=>lesStart(n))),
    mInfo('Like RealFlight\'s flight instructor: each lesson tells you what to do and checks it')];}
function radioItems(){return[
  mItem(()=>'🎚 Rates: '+(RADIO.rate==='low'?'LOW (gentle, 60%)':'HIGH (full throw)')+'  (I)',()=>ratesSet(RADIO.rate==='low'?'high':'low')),
  mRange('📈 Expo (softer around centre)',()=>RADIO.expo,v=>{RADIO.expo=v;radioSave();},0,80,5,v=>v+'%'),
  mRange('↔️ Aileron trim',()=>RADIO.trim.a,v=>{RADIO.trim.a=v;radioSave();},-20,20,1,v=>v>0?'R'+v:v<0?'L'+(-v):'centre'),
  mRange('↕️ Elevator trim',()=>RADIO.trim.e,v=>{RADIO.trim.e=v;radioSave();},-20,20,1,v=>v>0?'up '+v:v<0?'down '+(-v):'centre'),
  mRange('🔄 Rudder trim',()=>RADIO.trim.r,v=>{RADIO.trim.r=v;radioSave();},-20,20,1,v=>v>0?'R'+v:v<0?'L'+(-v):'centre'),
  mItem('⊙ Centre all trims',()=>{RADIO.trim={a:0,e:0,r:0};radioSave();toast('Trims centred',900);}),
  mItem(()=>'🪶 Flaps: '+(D.flaps>=1?'FULL':D.flaps>0?'HALF':'UP')+'  (U)',()=>flapCycle()),
  mItem(()=>'✋ Throttle cut: '+(D.thrCut?'ON (motor can\'t run)':'off')+'  (O)',()=>cutSet(!D.thrCut)),
  mItem(()=>'💨 Smoke: '+(D.smoke?'ON':'off')+'  (Y)',()=>smokeToggle()),
  mItem(()=>'🎨 Smoke colour: '+({'#ffffff':'white','#ff3b30':'red','#0a84ff':'blue','#34c759':'green','#ffd60a':'yellow','#ff2d92':'pink'}[RADIO.smokeCol]||RADIO.smokeCol),()=>{const L=['#ffffff','#ff3b30','#0a84ff','#34c759','#ffd60a','#ff2d92'];RADIO.smokeCol=L[(L.indexOf(RADIO.smokeCol)+1)%L.length];radioSave();}),
  mItem(()=>'⏸ Pause: '+(SIM.pause?'PAUSED':'off')+'  (Z)',()=>{menuToggle(false);pauseToggle();}),
  mItem(()=>'🐢 Slow motion: '+(SIM.speed===1?'off':SIM.speed+'×')+'  (N)',()=>slowCycle()),
  mItem('🛟 Rescue — level the wings and climb  (T)',()=>{menuToggle(false);rescue();}),
  mInfo('Any of these can go on a switch: Menu → ⚙️ → 🕹 Controller setup')];}
