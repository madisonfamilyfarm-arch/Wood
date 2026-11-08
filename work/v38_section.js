// ================================================================ v38: 💥 GIANT explosions that really look + act giant · 💣 5 kinds of TNT · 🔧 fixing that fixes EVERYTHING (+ fixes itself) · 🤖 smarter AI fighters · 📚 huge vocabulary + lots more to talk about
// ---------------------------------------------------------------- 💥 big-blast effects: smoke column, mushroom cloud, dust wave, debris, scorched ground, flash, fires, flattened trees
const BIG={L:[],fires:LS.get('bigFires',true),flat:LS.get('bigFlat',true),scorch:[]};
const BIGMAT=c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.85,depthWrite:false});
function bigAdd(m,o){scene.add(m);BIG.L.push(Object.assign({m,t:0},o));if(BIG.L.length>140){const x=BIG.L.shift();scene.remove(x.m);}}
function bigTick(dt){for(let i=BIG.L.length-1;i>=0;i--){const f=BIG.L[i];f.t+=dt;if(f.t<0){f.m.visible=false;continue;}f.m.visible=true;const u=f.t/f.life;
    if(f.kind==='smoke'){f.m.position.y+=f.vy*dt*(1-u*0.6);f.m.position.x+=f.dx*dt;f.m.position.z+=f.dz*dt;f.m.scale.setScalar(f.r*(0.5+u*1.6));f.m.material.opacity=0.8*(1-u)*Math.min(1,f.t*3);}
    else if(f.kind==='cap'){f.m.position.y=f.y0+f.rise*Math.min(1,f.t/2.2);f.m.scale.set(f.r*(0.4+Math.min(1,f.t/2)*1.1),f.r*0.55*(0.4+Math.min(1,f.t/2)),f.r*(0.4+Math.min(1,f.t/2)*1.1));f.m.material.opacity=0.85*(1-Math.max(0,u-0.5)*2);
      f.m.material.color.setHex(f.t<0.8?0xff8a30:f.t<1.8?0x5a3a2a:0x353535);}
    else if(f.kind==='stem'){const k=Math.min(1,f.t/2.2);f.m.scale.set(f.r*(0.6+k*0.3),f.h*k,f.r*(0.6+k*0.3));f.m.position.y=f.y0+f.h*k/2;f.m.material.opacity=0.8*(1-Math.max(0,u-0.5)*2);}
    else if(f.kind==='dust'){const s=0.3+u*f.r;f.m.scale.set(s,1,s);f.m.material.opacity=0.65*(1-u);}
    else if(f.kind==='deb'){f.v.y-=9.8*dt;f.m.position.addScaledVector(f.v,dt);f.m.rotation.x+=dt*5;f.m.rotation.z+=dt*4;const gy=H(f.m.position.x,f.m.position.z);if(f.m.position.y<gy){f.m.position.y=gy;f.v.set(0,0,0);}if(f.trail&&Math.random()<dt*14&&f.v.lengthSq()>4)puff(f.m.position.clone(),0x333333,0.3+f.sz,1.2);}
    if(f.t>=f.life){scene.remove(f.m);BIG.L.splice(i,1);}}
  if(BIG.shakeT>0){BIG.shakeT-=dt;shake=Math.max(shake,Math.min(1.2,BIG.shakeK*BIG.shakeT));}}
{const f0=fireTick;fireTick=function(dt){const r=f0.apply(this,arguments);try{if(!SIM.pause)bigTick(dt);}catch(e){console.warn('big',e);}return r;};}
function bigFlash(k){let el=$('bigFlash');if(!el){el=document.createElement('div');el.id='bigFlash';el.style.cssText='position:fixed;inset:0;z-index:60;pointer-events:none;background:#fff6d8;opacity:0;transition:opacity 0.9s ease-out';document.body.appendChild(el);}
  el.style.transition='none';el.style.opacity=String(Math.min(0.3,k));void el.offsetWidth;el.style.transition='opacity 0.9s ease-out';el.style.opacity='0';}
function bigBoom(p,r,dr,by,noTrees){const gy=H(p.x,p.z),low=p.y-gy<r*0.7+2,me=dzMe()||cam.position,dist=me.distanceTo(p);
  // flattened trees in most of the blast (not just the "trees" setting)
  if(BIG.flat&&!noTrees&&low&&r*0.85>(dr||0)+1)addCrater({x:+p.x.toFixed(2),z:+p.z.toFixed(2),r:+Math.min(r*0.85,400).toFixed(2)},true);
  // scorched ground
  if(low){const conform=(g)=>{const P=g.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i);P.setZ(i,H(p.x+x,p.z-y)-gy+0.12);}P.needsUpdate=true;return g;};
    const sc=new THREE.Mesh(conform(new THREE.RingGeometry(0.01,r*0.85,48,Math.min(24,4+Math.floor(r/4)))),new THREE.MeshBasicMaterial({color:0x14100c,transparent:true,opacity:0.8,depthWrite:false}));sc.rotation.x=-Math.PI/2;sc.position.set(p.x,gy+0.05,p.z);scene.add(sc);BIG.scorch.push(sc);
    const rg=new THREE.Mesh(conform(new THREE.RingGeometry(r*0.85,r*1.05,48,2)),new THREE.MeshBasicMaterial({color:0x3a2a1a,transparent:true,opacity:0.5,depthWrite:false}));rg.rotation.x=-Math.PI/2;rg.position.set(p.x,gy+0.04,p.z);scene.add(rg);BIG.scorch.push(rg);
    if(BIG.scorch.length>60)scene.remove(BIG.scorch.shift());
    // dust wave racing out along the ground
    const dw=new THREE.Mesh(new THREE.TorusGeometry(1,0.12,6,40),BIGMAT(0xb8a68a));dw.rotation.x=-Math.PI/2;dw.position.set(p.x,gy+0.6,p.z);bigAdd(dw,{kind:'dust',life:1.6,r:r*1.5});}
  // smoke column
  const n=Math.min(26,6+Math.floor(r/4));for(let k=0;k<n;k++){const m=new THREE.Mesh(GEO.ball,BIGMAT(k%3?0x1e1e1e:0x3a3a3a));m.position.set(p.x+(Math.random()-0.5)*r*0.6,Math.max(p.y,gy)+Math.random()*r*0.3,p.z+(Math.random()-0.5)*r*0.6);
    bigAdd(m,{kind:'smoke',t:-k*0.12,life:7+Math.random()*5,r:r*0.18+Math.random()*r*0.1,vy:r*0.08+2,dx:(Math.random()-0.5)*1.5+0.6,dz:(Math.random()-0.5)*1.5});}
  // mushroom cloud for really big ones
  if(r>=35){const stem=new THREE.Mesh(new THREE.CylinderGeometry(1,1.4,1,16,1,true),BIGMAT(0x3a2e26));stem.position.set(p.x,gy,p.z);bigAdd(stem,{kind:'stem',life:12,r:r*0.12,h:r*1.3,y0:gy});
    const cap=new THREE.Mesh(GEO.ball,BIGMAT(0xff8a30));cap.position.set(p.x,gy,p.z);bigAdd(cap,{kind:'cap',life:12,r:r*0.5,y0:gy,rise:r*1.4});}
  // flying debris (dirt, rocks, wood) with smoke trails
  const nd=Math.min(40,8+Math.floor(r/2));for(let k=0;k<nd;k++){const sz=0.15+Math.random()*Math.min(1.5,r*0.03);const m=new THREE.Mesh(GEO.box,new THREE.MeshLambertMaterial({color:[0x4a3a2a,0x5a4a3a,0x666666,0x3a2a1a][k%4]}));m.scale.setScalar(sz);m.position.set(p.x,Math.max(p.y,gy)+0.5,p.z);
    const a=Math.random()*6.28,sp=r*(0.4+Math.random()*0.8);bigAdd(m,{kind:'deb',life:4+Math.random()*2,v:new V3(Math.cos(a)*sp*0.6,sp*(0.4+Math.random()*0.7),Math.sin(a)*sp*0.6),sz,trail:k%3===0});}
  // fires around the edge
  if(BIG.fires&&low&&r>=10&&typeof fireStart==='function'&&typeof FIRE!=='undefined'&&FIRE.L.length<30){const nf=Math.min(6,Math.floor(r/10));for(let k=0;k<nf;k++){const a=Math.random()*6.28,d=r*(0.3+Math.random()*0.6);try{fireStart(p.x+Math.cos(a)*d,p.z+Math.sin(a)*d,false);}catch(e){}}}
  // flash, rumble, shaking
  if(LS.get('boomFlash',true)&&r>=25&&dist<r*3)bigFlash(clamp(0.6-dist/(r*3),0.05,0.28));BIG.shakeT=Math.min(3,0.6+r/40);BIG.shakeK=clamp(1.4-dist/(r*5),0.2,1.2)/Math.max(0.6,BIG.shakeT);
  try{setTimeout(()=>boomSound(dist*0.8,true),180);if(r>=35)setTimeout(()=>boomSound(dist*0.6,true),420);}catch(e){}}
{const e0=explode;explode=function(p,r,dr,own,byName,byId){const L0=FXB.length;const res=e0.apply(this,arguments);
  try{for(let i=L0;i<FXB.length;i++){const f=FXB[i];if(f.fire&&f.m.material){f.m.material.side=THREE.DoubleSide;if((r||4)>=12)f.life*=1.8;}}if((r||4)>=8)bigBoom(p,r||4,dr||0,byName);}catch(e){console.warn('bigBoom',e);}return res;};}
// ---------------------------------------------------------------- 💣 5 kinds of TNT
const TNTK={classic:{n:'💣 Classic',d:'big boom when it lands'},cluster:{n:'🎆 Cluster',d:'pops into 6 little bombs that fly everywhere'},sticky:{n:'🧲 Sticky',d:'sticks to what it hits, then BOOM'},timer:{n:'⏰ Timer',d:'beeps, then goes off after the fuse time'},mega:{n:'☢️ MEGA',d:'4× bigger with a mushroom cloud'}};
TNT.kind=TNT.kind&&TNTK[TNT.kind]?TNT.kind:'classic';
function tntKindNext(d){const K=Object.keys(TNTK);TNT.kind=K[(K.indexOf(TNT.kind)+(d||1)+K.length)%K.length];saveTnt();toast(TNTK[TNT.kind].n+' TNT — '+TNTK[TNT.kind].d,1800);tntBtnLabel();}
function tntBtnLabel(){const b=$('tntBtn');if(b)b.textContent=TNTK[TNT.kind].n.split(' ')[0]+' '+(TNT.kind==='classic'?'TNT':TNTK[TNT.kind].n.split(' ')[1]);const v=$('tntTool');if(v)v.textContent=TNTK[TNT.kind].n+' TNT (0)';}
setTimeout(tntBtnLabel,2000);setInterval(tntBtnLabel,3000);
// throw it further when walking, and mark what kind it is
{const d0=tntDrop;tntDrop=function(){const n0=TNTS.length;const r=d0.apply(this,arguments);const T=TNTS[TNTS.length-1];if(TNTS.length>n0&&T&&T.own&&!T.bi){T.kind=TNT.kind;if(WALK.on){const y=WALK.yaw||0;T.v.set(-Math.sin(y)*11,6,-Math.cos(y)*11);}
    if(T.kind==='mega'){T.r=TNT.r*4;T.dr=Math.max(TNT.dr,TNT.r*1.5);T.g.scale.setScalar(1.6);}if(T.kind==='timer'||T.kind==='sticky'){T.air=true;T.landed=true;}}return r;};}
// long-press the TNT button = change kind
setTimeout(()=>{const b=$('tntBtn');if(!b)return;let t=null;b.addEventListener('pointerdown',()=>{t=setTimeout(()=>{t=null;tntKindNext(1);},600);});b.addEventListener('pointerup',()=>{if(t)clearTimeout(t);});b.addEventListener('pointerleave',()=>{if(t)clearTimeout(t);});},1800);
addEventListener('keydown',e=>{if(e.code==='Digit9'&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))&&!menu.open){tntKindNext(1);e.preventDefault();}});
// kind behaviour: timer + sticky TNT fly by themselves here; the normal TNT code only draws them
{const t0=tntTick;tntTick=function(dt){try{for(const T of TNTS.slice()){if(!T.air||!T.own)continue;
      if(T.stuck){if(T.stuck.dead){T.stuck=null;}else T.p.copy(T.stuck.p).add(new V3(0,0.4,0));}
      else if(!T.rest){T.v.y-=9.8*dt;const n=T.p.clone().addScaledVector(T.v,dt);const gy=inWater(n.x,n.z)?Math.max(H(n.x,n.z),WATER_Y-0.1):H(n.x,n.z);
        if(T.kind==='sticky'){for(const B of AIB.L)if(!B.dead&&B.p.distanceTo(n)<1.8){T.stuck=B;toast('🧲 Stuck to '+B.name.replace('🤖 ','')+'!',1200);break;}}
        if(!T.stuck){if(n.y<=gy+0.15||hitTest(n,0.25)||objHitTest(n)){T.rest=true;T.v.set(0,0,0);T.p.y=Math.max(Math.min(T.p.y,n.y),gy+0.15);}else T.p.copy(n);}}
      const left=TNT.fuse-T.t;if(Math.floor(left*2)!==T.bp&&left>0){T.bp=Math.floor(left*2);beep(left<1?1400:900,0.04,0.03);}
      if(left<=0){T.g.visible=true;tntBoom(T);continue;}T.g.visible=left>1||Math.floor(T.t*10)%2===0;}}catch(e){console.warn('tntk',e);}
  const keep=TNTS.filter(T=>T.air&&T.own);keep.forEach(T=>T.own=false);try{return t0.apply(this,arguments);}finally{keep.forEach(T=>T.own=true);}};}
// cluster: 6 little bombs fly out · mega: mushroom cloud comes from the big blast automatically
tntAfter=function(T,p,r){if(T.kind==='cluster'&&!T.small){for(let k=0;k<6;k++){const a=k/6*6.2832+Math.random()*0.4;const id=T.id+'c'+k;
    const c=tntAdd(id,p.clone().add(new V3(0,1,0)),new V3(Math.cos(a)*(6+Math.random()*6),7+Math.random()*5,Math.sin(a)*(6+Math.random()*6)),true,{small:true,r:Math.max(2,r*0.45),dr:Math.max(1,(T.dr||TNT.dr)*0.4),kind:'classic',bn:T.bn,bi:T.bi});
    mpSend({t:'tnt',tid:id,p:c.p.toArray().map(r2),v:c.v.toArray().map(r2)});}}};
{const i0=exItems;exItems=function(){const L=i0();L.splice(4,0,mItem(()=>'💣 TNT kind: '+TNTK[TNT.kind].n+' — '+TNTK[TNT.kind].d+'  ◀ ▶',()=>tntKindNext(1),d=>tntKindNext(d)));
  L.splice(L.length-3,0,mItem(()=>'🔥 Giant blasts start fires: '+(BIG.fires?'ON':'off'),()=>{BIG.fires=!BIG.fires;LS.set('bigFires',BIG.fires);}),
    mItem(()=>'🌲 Giant blasts flatten the trees: '+(BIG.flat?'ON':'off'),()=>{BIG.flat=!BIG.flat;LS.set('bigFlat',BIG.flat);}),
    mInfo('Phone: hold the 💣 button to change the kind. Computer: 9 = change kind, 0 = drop.'));return L;};}
// ---------------------------------------------------------------- 🔧 FIX EVERYTHING (and it can fix itself)
const FIXA={auto:LS.get('autoFix',0),last:0};
function fixAll(quiet,fromNet){let parts=0;const q=f=>{try{const t0=toast;toast=()=>{};try{f();}finally{toast=t0;}parts++;}catch(e){console.warn('fix',e);}};
  q(()=>{BOOMED.forEach(o=>{if(!OBJS.some(x=>x.id===o.id))objAdd(o);});BOOMED.length=0;LS.set('boomedObjs',[]);});
  q(pbBuild);q(pbTruck);q(pbSky);q(pbTrain);q(()=>{if(TRAIN.brk.length){TRAIN.brk=[];trainBuild();}});q(()=>{if(TRAIN.derailed)trainRerail();});
  q(()=>{BIG.scorch.forEach(m=>scene.remove(m));BIG.scorch.length=0;BIG.L.forEach(f=>scene.remove(f.m));BIG.L.length=0;if(typeof splats!=='undefined'){splats.forEach(m=>scene.remove(m));splats.length=0;}});
  q(()=>{TNTS.slice().forEach(T=>tntDel(T));});
  q(()=>{for(const C of CAMPERS.L)if(C.dead){C.dead=1;}for(const B of AIB.L)if(B.dead)B.dead=1;});
  q(()=>{if(FIXA.fires!==false&&typeof FIRE!=='undefined')FIRE.L.slice().forEach(F=>{try{fireDel(F,'fix',true);}catch(e){}});});
  q(()=>{if(DR&&!WALK.on&&D.state!=='flying'&&!DZ.dead)quickFix(false);});
  const t=CRATERS.length;CRATERS.length=0;LS.set('craters',[]);if(t)reloadWorld();
  if(!fromNet&&mpOpen())mpSend({t:'fixall'});FIXA.last=performance.now();
  if(!quiet)toast('🔧 Fixed EVERYTHING — trees, buildings, the train, the track, the truck, the sky, people, scorch marks and fires ✨',3000);beep(880,0.08,0.05);setTimeout(()=>beep(1320,0.12,0.05),120);}
MPH.fixall=function(m,pe){fixAll(true,true);toast('🔧 '+((pe&&pe.name)||'Someone')+' fixed everything',2000);};
putBack=function(){fixAll(false);};
// fixes itself after a while (optional)
{const e0=explode;explode=function(){FIXA.last=performance.now();FIXA.dirty=true;return e0.apply(this,arguments);};}
setInterval(()=>{try{if(FIXA.auto>0&&FIXA.dirty&&performance.now()-FIXA.last>FIXA.auto*60000){FIXA.dirty=false;fixAll(true);chatSys('🌱 Everything grew back and got fixed by itself');}}catch(e){}},5000);
{const p0=putBackItems;putBackItems=function(){const L=p0();L.splice(1,0,mItem('🔧✨ Fix EVERYTHING at once',()=>{fixAll();menuToggle(false);}),
    mItem(()=>'🌱 Fix itself after: '+(FIXA.auto?FIXA.auto+' min with no explosions':'off')+'  ◀ ▶',()=>fixAutoNext(1),d=>fixAutoNext(d)));return L;};}
function fixAutoNext(d){const o=[0,1,2,5,10];FIXA.auto=o[(o.indexOf(FIXA.auto)+(d||1)+o.length)%o.length];LS.set('autoFix',FIXA.auto);toast(FIXA.auto?'🌱 Things fix themselves '+FIXA.auto+' min after the last explosion':'🌱 Self-fixing off',1800);}
{const i0=exItems;exItems=function(){const L=i0();L.splice(L.length-2,0,mItem('🔧 Fix everything that got blown up',()=>{fixAll();menuToggle(false);}),mItem(()=>'🌱 Fix itself after: '+(FIXA.auto?FIXA.auto+' min':'off')+'  ◀ ▶',()=>fixAutoNext(1),d=>fixAutoNext(d)));return L;};}
{const b0=asBtn;asBtn=function(){b0.apply(this,arguments);const box=$('asBox');if(!box)return;let v=$('fixTool');if(!v){v=document.createElement('button');v.id='fixTool';v.className='btn';v.style.cssText=$('asBtn').style.cssText;v.textContent='🔧 Fix everything';v.onclick=()=>fixAll();box.appendChild(v);}if(!PHONE||asBtn.open)v.style.display='';};}
// ---------------------------------------------------------------- 🤖 smarter AI fighters: dodge rockets, teams, hunt one target, bomb with TNT
function aiPeerPos(id){if(id==='me')return dzMe();const B=AIB.L.find(b=>b.id===id&&!b.dead);if(B)return B.p;const pe=mp.peers[id];return pe&&pe.p?pe.p:null;}
{const s0=dzBotsShoot;dzBotsShoot=function(dt){if(!DZ.on||!DZ.ai)return;const keep=[];
  // teammates never shoot you; hunters only shoot their target
  const me=dzMe();for(const B of AIB.L){if(B.dead)continue;if(B.team==='me'||B.hunt){keep.push(B);B._rk=B.rkT;B.rkT=1e9;}}
  const r=s0.apply(this,arguments);
  for(const B of keep){B.rkT=B._rk;B.rkT=(B.rkT==null?3:B.rkT)-dt;if(B.rkT>0)continue;const S=aiD();B.rkT=Math.max(2.5,S.gap[0]*0.6);
    let tg=null;if(B.hunt){tg=aiPeerPos(B.hunt);if(!tg){chatSys('🎯 '+B.name.replace('🤖 ','')+' got their target!');B.hunt=null;continue;}}
    else{const L=AIB.L.filter(x=>!x.dead&&x!==B&&x.team!=='me').map(x=>x.p);tg=L.sort((a,b)=>a.distanceTo(B.p)-b.distanceTo(B.p))[0];}
    if(tg&&tg.distanceTo(B.p)<S.range*1.2&&tg.distanceTo(B.p)>4)dzBotFire(B,tg.clone().add(new V3((Math.random()-0.5)*S.err,(Math.random()-0.5)*S.err*0.5,(Math.random()-0.5)*S.err)));}
  return r;};}
// AI hunters + bombers fly to their target; drones dodge your rockets (harder = better dodging)
{const a0=aiTick;aiTick=function(dt){const now=performance.now();try{for(const B of AIB.L){if(B.dead||!(B.kind==='drone'||B.kind==='heli')||B.mode!=='fly')continue;
      const tid=B.bomb||B.hunt;if(tid){const tp=aiPeerPos(tid);if(tp){B.goal={x:tp.x+(B.bomb?0:Math.sin(now/1400+B.i*1.7)*16),z:tp.z+(B.bomb?0:Math.cos(now/1400+B.i*1.7)*16),h:clamp(tp.y-H(tp.x,tp.z)+(B.bomb?9:String(tid).startsWith('bot')?-1:4),6,B.bomb?45:35),kind:'go'};
          if(B.bomb&&Math.hypot(tp.x-B.p.x,tp.z-B.p.z)<4&&!(B.bombCd>now)){B.bombCd=now+4000;aiDropTnt(B);B.bomb=null;}}else{B.bomb=null;B.hunt=null;}}
      // dodge
      const dodge={fun:0.25,medium:0.6,hard:0.95}[AIB.diff]||0.3;if(Math.random()<dodge)for(const s of shots){if(!s.own||s.w!=='rocket'||s.life<=0||!s.m)continue;const to=B.p.clone().sub(s.m.position),d=to.length();if(d>22||d<1)continue;const sv=s.v.clone().normalize();if(sv.dot(to.normalize())<0.93)continue;
        const side=new V3(-sv.z,0.4,sv.x).normalize().multiplyScalar(((B.i%2)?1:-1)*dt*14);B.p.add(side);if(!B.dodgeSaid||now-B.dodgeSaid>15000){B.dodgeSaid=now;if(Math.random()<0.3)B.say=PICK(['Missed me! 😜','Whoa, close one!','Nope! 💨','Too slow!']);}break;}}}catch(e){}return a0.apply(this,arguments);};}
function aiDropTnt(B){const id=(B.id||'bot')+'.t'+(++tntN);const T=tntAdd(id,B.p.clone().add(new V3(0,-0.6,0)),new V3(0,-1,0),true,{bn:B.name,bi:B.id,kind:'classic',r:Math.min(TNT.r,30)});mpSend({t:'tnt',tid:id,p:T.p.toArray().map(r2),v:[0,-1,0]});}
// in battle, medium/hard AI sometimes drop TNT on whoever is under them
setInterval(()=>{try{if(!DZ.on||!DZ.ai||AIB.diff==='fun')return;const me=dzMe();for(const B of AIB.L){if(B.dead||B.team==='me'||!(B.kind==='drone'||B.kind==='heli'))continue;if(me&&Math.hypot(me.x-B.p.x,me.z-B.p.z)<5&&B.p.y>me.y+3&&Math.random()<(AIB.diff==='hard'?0.35:0.12)){aiDropTnt(B);B.say=PICK(['Bombs away! 💣','Look out below!','Incoming TNT!']);}}}catch(e){}},2500);
// ---------------------------------------------------------------- 📚 huge vocabulary: lots of ways to say the same thing → the AI understands them all
const SYN=[['(chase|tail|trail|shadow|stick with|stay with|come along|tag along|accompany|escort|keep up with) (me|us)','follow me'],['\\b(come to me|come over|over here|get over here|join me|meet me here)\\b','come here'],
  ['\\b(zoom|hurry|rush|speed it up|step on it|punch it|go go go|floor it|full speed|full throttle|max speed|turbo|boost)\\b','faster'],['\\b(brake|ease up|slow it down|not so fast|calm down|gently)\\b','slower'],
  ['\\b(ascend|rise|go up up|climb up|gain altitude|up high|way up|sky high|to the sky|to the clouds)\\b','higher'],['\\b(descend|drop down|get low|go low|dive|lose altitude|down low|closer to the ground)\\b','lower'],
  ['\\b(stay still|halt|pause|park|stand still|stop there|hold position|stay right there|chill there|don\'?t go|stay here)\\b','wait'],['\\b(orbit|go round|go around|loop around|circle around|ring around)\\b','circle me'],
  ['\\b(ambush|strike|raid|assault|charge|get (him|her|them)|take (him|her|them) (out|down)|blow (him|her|them) up|destroy|wreck|smash|nuke|blast|fire at|open fire|light (him|her|them) up)\\b','attack'],
  ['\\b(truce|cease ?fire|make peace|be friends|stop attacking|stop fighting|chill out|calm it|no fighting|no more fighting|put down your weapons)\\b','peace'],['\\b(pursue|race against|compete|challenge me|beat me|first one there|race you)\\b','race me'],
  ['\\b(touch ?down|come down|set it down|put it down|park it)\\b','land'],['\\b(barrel roll|somersault|cartwheel|tumble|stunt|trick shot)\\b','flip'],['\\b(boogie|groove|bust a move|shake it|disco|wiggle)\\b','dance'],
  ['\\b(chopper|whirlybird|copter|helo)\\b','helicopter'],['\\b(quadcopter|quad|fpv|uav)\\b','drone'],['\\b(jet|airplane|aeroplane|glider|fighter|bomber|airliner|aircraft)\\b','plane'],['\\b(speedboat|ship|yacht|canoe|kayak|raft)\\b','boat'],['\\b(sub|u-?boat)\\b','submarine'],['\\b(racecar|race car|buggy|jeep|automobile|monster truck)\\b','car'],
  ['\\b(pond|lagoon|swimming hole)\\b','lake'],['\\b(lookout|watchtower|watch tower|tall tower)\\b','fire tower'],['\\b(tent|tents|campfire|camp fire|cabin)\\b','campsite'],['\\b(airport|air strip|airstrip|landing strip|hangar)\\b','airfield'],['\\b(grass|grassland|field|flowers|prairie)\\b','meadow'],['\\b(home base|helipad|landing pad)\\b','launch pad'],
  ['\\b(greetings|howdy|hiya|heya|yo yo|sup|wassup|what\'?s up|good (morning|afternoon|evening))\\b','hello'],['\\b(cheers|much appreciated|thank ya|thankyou|ty|thx|tysm)\\b','thanks'],['\\b(farewell|see ya|catch you later|peace out|i\'?m out|gotta go|ttyl|goodnight)\\b','bye'],
  ['\\b(bomb|explosive|dynamite|grenade|c4)\\b','tnt']];
const SYNR=SYN.map(([a,b])=>[new RegExp(a,'g'),b]);
function synNorm(s){let t=' '+String(s).toLowerCase()+' ';const keep=[];[...AIB.L.map(B=>B.name.replace('🤖 ','')),...CAMPERS.L.map(c=>c.name)].map(n=>String(n).toLowerCase().split(' ')[0]).filter(Boolean).forEach(n=>{t=t.replace(new RegExp('\\b'+n+'\\b','g'),()=>{keep.push(n);return ' zzn'+(keep.length-1)+'zz ';});});
  for(const [r,b] of SYNR)t=t.replace(r,' '+b+' ');t=t.replace(/ ?zzn(\d+)zz ?/g,(m,i)=>' '+keep[+i]+' ');return t.replace(/\s+/g,' ').trim();}
SPEECH_WORDS.push(...('ambush strike raid assault charge destroy wreck smash nuke blast bomb dynamite grenade explosive tnt cluster sticky timer mega mushroom crater debris shockwave '+
  'zoom hurry rush turbo boost brake ascend descend dive altitude orbit halt pause hover glide soar swoop barrel somersault cartwheel tumble boogie groove disco wiggle '+
  'teammate teammates team partner buddy enemy enemies opponent rival hunt hunter target bullseye sniper aim reload ammo shield armor health heal medic respawn revive '+
  'chopper whirlybird quadcopter airliner aeroplane fighter bomber speedboat yacht canoe kayak buggy automobile monster lagoon hangar prairie cabin wilderness '+
  'riddle story joke song sing poem fact facts trivia math plus minus times divided count guess number coin dice rock paper scissors compliment rate score winning losing '+
  'north south east west left right forward backward behind above below nearby distance meters far close compass direction directions').split(' '));
// ---------------------------------------------------------------- 💬 even more to talk about: math, directions, status, games, facts, riddles, stories, songs, teams, bombing
const FACTS=['The first drone flights were over 100 years ago — in World War 1!','A hummingbird can fly backwards — so can a drone 😎','The fastest racing drones go over 160 mph!','Helicopters can\'t fly as high as planes because the air gets too thin for the rotors.','The Wright brothers\' first flight lasted only 12 seconds.','A bee flaps its wings about 200 times every second 🐝','Submarines dive by filling tanks with water and come up by blowing it out with air.','Pine trees can live for thousands of years 🌲','Lightning is about 5 times hotter than the surface of the sun ⚡','Fire trucks are red so they are easy to see — but some are yellow!','Owls can turn their heads almost all the way around 🦉','Raccoons wash their food before eating 🦝','The Ohio River is almost 1,000 miles long!','Hot air balloons float because hot air is lighter than cold air 🎈','A jet engine sucks in air, squishes it, burns fuel, and blasts it out the back 🚀'];
const RIDDLES=[['What has wings but can\'t fly, and a tail but no body?','A kite… just kidding — a coin! 🪙'],['What goes up but never comes down?','Your age! 🎂'],['What has hands but can\'t clap?','A clock ⏰'],['What gets wetter the more it dries?','A towel 🧺'],['I have keys but open no locks. What am I?','A piano 🎹'],['What can you catch but not throw?','A cold 🤧'],['What has one eye but can\'t see?','A needle 🪡'],['What flies without wings?','Time! ⏳']];
const STORIES=['Once upon a time a tiny drone named Zip wanted to fly over the tallest tree. Every day it climbed a little higher… until one sunny morning it soared above the clouds and saw the whole farm! 🌄 The end.','There once was a fire truck who was afraid of fire. But when the camp needed help, it rolled in, sprayed with all its might, and saved the day. Now it\'s the bravest truck in the woods 🚒','A little submarine found a shiny treasure at the bottom of the lake… it was a lost fishing lure. It gave it back to the fish, who said thanks with lots of bubbles 🫧'];
const SONGS=['🎵 Fly, fly, fly so high, zooming past the big blue sky! 🎵','🎵 Propellers spin, round and round, lift me up right off the ground! 🎵','🎵 Over the lake and through the trees, flying fast with the summer breeze! 🎵'];
const FAV={color:['Blue, like the sky! 💙','Orange — like explosions! 🧡','Green, like the woods 💚'],animal:['Owls — they fly at night! 🦉','Bees! Tiny pilots 🐝','Raccoons, the sneaky bandits 🦝'],food:['Pizza! 🍕','S\'mores at the campfire 🔥','Battery juice… I mean, cookies! 🍪'],song:['Anything with a good beat! 🎶','The sound of propellers 😄'],game:['This one, obviously! 😄','Tag in the sky!'],vehicle:['Helicopters! 🚁','Planes are so fast ✈️','The submarine is sneaky 🐟'],place:['The fire tower — best view! 🗼','The lake at sunset 🌅','The dirt track! 🏁']};
const NUMW={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,hundred:100,thousand:1000};
function numify(s){return s.replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b/g,w=>NUMW[w]);}
function doMath(s){const t=numify(s).replace(/\bx\b|\btimes\b|\bmultiplied by\b/g,'*').replace(/\bplus\b|\badd\b|\band\b(?=\s*\d)/g,'+').replace(/\bminus\b|\btake away\b|\bsubtract\b/g,'-').replace(/\bdivided by\b|\bover\b/g,'/');
  const m=t.match(/(-?\d+(?:\.\d+)?)\s*([-+*\/])\s*(-?\d+(?:\.\d+)?)/);if(!m)return null;const a=+m[1],b=+m[3];const r={'+':a+b,'-':a-b,'*':a*b,'/':b?a/b:NaN}[m[2]];return isFinite(r)?a+' '+m[2].replace('*','×').replace('/','÷')+' '+b+' = '+(Math.round(r*1000)/1000):null;}
function compass(dx,dz){const a=(Math.atan2(dx,-dz)*180/Math.PI+360)%360;return['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(a/45)%8];}
function aiNamed(s){return AIB.L.filter(B=>!B.dead&&s.includes(' '+B.name.replace('🤖 ','').toLowerCase()+' '));}
{const s0=smartHear;smartHear=function(txt){const raw=' '+String(txt||'').toLowerCase().replace(/[!?,]/g,' ').replace(/\s+/g,' ')+' ';const s=' '+synNorm(raw)+' ';
  const me=dzMe()||D.pos;const P=AIB.L.filter(B=>!B.dead);const W0=sbWho(s);const near=[...P].sort((a,b)=>a.p.distanceTo(me)-b.p.distanceTo(me));const first=(W0&&W0[0])||(near[0]?{B:near[0]}:(CAMPERS.L[0]?{C:CAMPERS.L[0]}:null));
  const say=t=>{if(first)sbSay(first,t);else chatSys('🤖 '+t);};
  // ---- math
  if(/\d|\b(plus|minus|times|divided)\b/.test(numify(s))&&/\b(what'?s|what is|how much is|calculate|plus|minus|times|divided by|multiplied)\b/.test(s)){const a=doMath(s);if(a){say('🧮 '+a);return true;}}
  // ---- teams / hunting / bombing
  if(/\b(be on my team|join my team|team up|you'?re on my team|be my teammate|on my side|help me fight|protect me|cover me|back me up)\b/.test(s)){const L=W0?W0.filter(w=>w.B).map(w=>w.B):near.slice(0,1);L.forEach((B,i)=>{B.team='me';sbSay({B},PICK(['I\'ve got your back! 🛡️','Teammates! 🤝','Let\'s do this together!']),400+i*600);});return true;}
  if(/\b(leave my team|not on my team|be enemies|go solo|every man for himself|free for all)\b/.test(s)){P.forEach(B=>{B.team=null;B.hunt=null;});say('Free-for-all! 😈');return true;}
  if(/\b(attack|hunt|get|go after|target)\b/.test(s)){const T=aiNamed(s);const tgtMe=/\b(attack|hunt|get|go after|target) me\b/.test(s);
    if(T.length===1||tgtMe){const tgt=tgtMe?'me':T[0].id,tn=tgtMe?'you':T[0].name.replace('🤖 ','');const hunters=(W0&&W0.some(w=>w.B&&w.B.id!==tgt)?W0.filter(w=>w.B&&w.B.id!==tgt).map(w=>w.B):P.filter(B=>B.id!==tgt&&(B.team==='me'||/everyone/.test(s)||!W0))).slice(0,6);
      if(hunters.length&&(T.length||tgtMe)){DZ.ai=true;LS.set('dzAi',true);hunters.forEach((B,i)=>{B.hunt=tgt;if(tgtMe)B.team=null;sbSay({B},PICK(['Going after '+tn+'! 🎯','Target locked: '+tn+' 🚀',tn+', here I come!']),400+i*500);});return true;}}}
  if(/\b(tnt|drop it|bombs away)\b/.test(s)&&/\b(drop|throw|use|bomb|on|at|get)\b/.test(s)){const T=aiNamed(s);const tgtMe=/\b(on|at) me\b/.test(s);const L=(W0?W0.filter(w=>w.B):[{B:near[0]}]).map(w=>w.B).filter(B=>B&&(B.kind==='drone'||B.kind==='heli')&&!T.includes(B));
    if(L.length){L.forEach((B,i)=>{if(T.length||tgtMe){B.bomb=tgtMe?'me':T[0].id;sbSay({B},'💣 Bombing run on '+(tgtMe?'you':T[0].name.replace('🤖 ',''))+'!',400+i*500);}else{aiDropTnt(B);sbSay({B},'Bombs away! 💣',300+i*400);}});return true;}
    sbSay(first,'Only drones and helicopters can drop TNT — tell me "switch to a drone"!');return true;}
  // ---- directions + status
  if(/\b(where is|where'?s|how do i get to|how far is|which way is|directions to|take me to)\b/.test(s)){const q=sbPlace(s);if(q){const dx=q.x-me.x,dz=q.z-me.z,d=Math.round(Math.hypot(dx,dz));say(d<15?'You\'re right at '+q.n+'! 📍':q.n.replace(/^./,c=>c.toUpperCase())+' is '+d+' m '+compass(dx,dz)+' of you 🧭');return true;}
    const T=aiNamed(s);if(T.length){const B=T[0],dx=B.p.x-me.x,dz=B.p.z-me.z;say(B.name.replace('🤖 ','')+' is '+Math.round(Math.hypot(dx,dz))+' m '+compass(dx,dz)+' of you, '+Math.round(B.p.y-H(B.p.x,B.p.z))+' m up');return true;}}
  if(/\bwhere am i\b/.test(s)){const pl=aiPlaces().reduce((a,q)=>Math.hypot(q.x-me.x,q.z-me.z)<Math.hypot(a.x-me.x,a.z-me.z)?q:a);const d=Math.round(Math.hypot(pl.x-me.x,pl.z-me.z));say(d<20?'You\'re at '+pl.n+'! 📍':'You\'re '+d+' m '+compass(me.x-pl.x,me.z-pl.z)+' of '+pl.n);return true;}
  if(/\bhow (high|tall|far up) am i\b|\bmy (height|altitude)\b/.test(s)){say('You\'re '+Math.round(me.y-H(me.x,me.z))+' m above the ground ⬆️');return true;}
  if(/\bhow fast am i\b|\bmy speed\b|\bhow fast (is|was) (i|that)\b/.test(s)){const v=WALK.on?0:D.vel.length();say('You\'re going '+Math.round(v*3.6)+' km/h ('+Math.round(v*2.237)+' mph) 💨');return true;}
  if(/\bhow (high|fast) are you\b|\bwhat are you (flying|driving|in)\b/.test(s)&&first&&first.B){const B=first.B;sbSay(first,'I\'m in a '+B.kind+' '+(AI_VIC[B.kind]||'')+', '+Math.round(B.p.y-H(B.p.x,B.p.z))+' m up!');return true;}
  if(/\b(who'?s here|who is here|who'?s playing|how many (pilots|players|people|bots|ais))\b/.test(s)){const n=P.map(B=>B.name.replace('🤖 ','')+' ('+B.kind+')'),pl=Object.values(mp.peers).filter(pe=>pe.name&&!/🤖/.test(pe.name)).map(pe=>pe.name);say('Here now: '+[...pl,...n].join(', ')+(CAMPERS.L.length?' + '+CAMPERS.L.length+' campers 🏕️':''));return true;}
  if(/\b(score|how many kills|kills|who'?s winning|am i winning)\b/.test(s)){say('🏆 You: '+(DZ.kills||0)+' blow-ups, '+(DZ.deaths||0)+' times blown up. '+((DZ.kills||0)>=(DZ.deaths||0)?'You\'re winning! 🎉':'Keep going, you got this! 💪'));return true;}
  // ---- games
  if(/\b(rock|paper|scissors)\b/.test(s)&&/\b(play|shoot|i (pick|choose|go)|rock paper scissors)\b|^ (rock|paper|scissors) $/.test(s)){const mine=(s.match(/\b(rock|paper|scissors)\b(?!.*\b(rock|paper|scissors)\b)/)||[])[1];const ai=PICK(['rock','paper','scissors']),E={rock:'🪨',paper:'📄',scissors:'✂️'};
    if(!mine||/rock paper scissors/.test(s)&&!/\bi (pick|choose|go)\b/.test(s)){say('Rock, paper, scissors… say "I pick rock", "paper" or "scissors"! ✊✋✌️');return true;}
    const win={rock:'scissors',paper:'rock',scissors:'paper'};say(E[ai]+' I picked '+ai+'! '+(ai===mine?'Tie! 🤝':win[mine]===ai?'You win! 🎉':'I win! 😄'));return true;}
  if(/\b(flip a coin|coin flip|heads or tails)\b/.test(s)){say('🪙 '+PICK(['Heads!','Tails!']));return true;}
  if(/\b(roll (a|the)? ?(dice|die)|dice roll)\b/.test(s)){say('🎲 You rolled a '+(1+Math.floor(Math.random()*6))+'!');return true;}
  if(/\bpick a number\b|\brandom number\b/.test(s)){const m=numify(s).match(/(\d+)\D+(\d+)/);const a=m?+m[1]:1,b=m?+m[2]:10;say('🔢 '+(Math.min(a,b)+Math.floor(Math.random()*(Math.abs(b-a)+1))));return true;}
  if(/\bcount (to|down from) (\d+|\w+)\b/.test(s)){const m=numify(s).match(/count (to|down from) (\d+)/);const n=Math.min(10,m?+m[2]:5);const up=/count to/.test(s);let L=[];for(let i=1;i<=n;i++)L.push(up?i:n-i+1);say(L.join('… ')+(up?' 🎉':'… 🚀 LIFTOFF!'));return true;}
  if(/\b(riddle|brain teaser)\b/.test(s)){const r=PICK(RIDDLES);say('🤔 '+r[0]);setTimeout(()=>say('Answer: '+r[1]),9000);return true;}
  if(/\b(fun fact|tell me a fact|did you know|teach me something|tell me something)\b/.test(s)){say('💡 '+PICK(FACTS));return true;}
  if(/\b(story|tale)\b/.test(s)){say('📖 '+PICK(STORIES));return true;}
  if(/\b(sing|song)\b/.test(s)&&!/\bfavorite\b/.test(s)){say(PICK(SONGS));return true;}
  if(/\b(compliment me|say something nice|am i (good|cool|awesome))\b/.test(s)){say(PICK(['You\'re an awesome pilot! ✈️','Your flying is getting so good!','You\'re the coolest person in these woods 😎','Best co-pilot ever! 🏅']));return true;}
  if(/\b(rate my flying|how am i doing|how was that|was that good)\b/.test(s)){say(PICK(['⭐⭐⭐⭐⭐ Amazing!','⭐⭐⭐⭐ Super smooth!','10 out of 10, no notes! 🏆','That was epic! 🔥']));return true;}
  { const m=s.match(/\b(favorite|favourite) (color|colour|animal|food|song|game|vehicle|place)\b/);if(m){say(PICK(FAV[m[2].replace('colour','color')]));return true;}}
  if(/\b(where are you from|where do you live)\b/.test(s)){say(PICK(['I live right here in the woods! 🌲','I was born in the hangar ✈️','From the cloud… get it? ☁️😄']));return true;}
  if(/\b(do you like|do you love)\b/.test(s)){say(PICK(['I LOVE it! 😍','Yes! It\'s the best!','Heck yeah! 🙌','Hmm… only on Tuesdays 😄']));return true;}
  if(/\b(what'?s (my|your) name|do you know me|who am i)\b/.test(s)&&/\bmy\b|\bwho am i\b|know me/.test(s)){say('You\'re '+(CFG.name||'the best pilot')+'! 😄');return true;}
  if(/\b(i'?m (sad|upset|mad|angry|lonely))\b/.test(s)){say(PICK(['Aww, I\'m here for you 💛 Want to go fly somewhere fun together?','Sending you a big robot hug 🤗','Let\'s fly to the lake and cheer up! 🌅']));return true;}
  if(/\b(i'?m (happy|excited|having fun)|this is (fun|awesome|amazing))\b/.test(s)){say(PICK(['Yay! Me too! 🎉','Best day ever! 😄','Woo-hoo! 🙌']));return true;}
  // everything else, with all the different words turned into ones the AI knows
  return s0.call(this,s.trim());};}
