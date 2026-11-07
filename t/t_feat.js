const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  // --- creator builds
  const builds={
    ufo:{name:'UFO',parts:[{t:'shape',style:'disc',w:60,len:60,d:14,col:'#9aa0a6',mat:'metal'},{t:'shape',style:'sphere',mat:'glass',w:20,len:20,d:14,h:6,col:'#9fd3ff'},{t:'battery',x:0,y:0,h:-6,w:6,len:10},{t:'hover',x:-18,y:-18,h:-8,r:8,pow:6},{t:'hover',x:18,y:-18,h:-8,r:8,pow:6},{t:'hover',x:-18,y:18,h:-8,r:8,pow:6},{t:'hover',x:18,y:18,h:-8,r:8,pow:6},{t:'shape',style:'sphere',mat:'glow',col:'#00ff88',w:4,len:4,d:4,x:28,h:0},{t:'gun',style:'rocket',x:0,y:-26,h:-6,len:10}]},
    rocketplane:{name:'Rocket plane',parts:[{t:'shape',style:'capsule',w:8,len:50,d:8,col:'#ff3030'},{t:'wing',w:80,len:16,d:1.5,h:0,col:'#f2f2f2'},{t:'wing',w:24,len:10,d:1,y:22,h:0},{t:'wing',w:12,len:10,d:1,y:22,h:6,rz:90},{t:'rocket',y:30,w:4,len:14,pow:6},{t:'wheel',x:-10,y:-4,h:-7,r:3},{t:'wheel',x:10,y:-4,h:-7,r:3},{t:'wheel',x:0,y:20,h:-6,r:2}]},
    car:{name:'Box car',parts:[{t:'shape',style:'box',w:22,len:40,d:8,col:'#0a84ff'},{t:'battery',h:5,w:6,len:10},{t:'wheel',x:-12,y:-14,h:-4,r:5},{t:'wheel',x:12,y:-14,h:-4,r:5},{t:'wheel',x:-12,y:14,h:-4,r:5},{t:'wheel',x:12,y:14,h:-4,r:5}]},
    boat:{name:'Raft',parts:[{t:'shape',style:'box',w:30,len:50,d:6,col:'#8b5a2b'},{t:'wprop',y:27,h:-3,r:5,pow:6},{t:'battery',h:4,w:6,len:10}]},
  };
  for(const k in builds){const r=await A.evaluate(sp=>{const s=sanitize(sp),st=stats(s);return {fly:st.flyAs,kind:st.kind||'drone',top:Math.round(st.top),tw:st.tw&&st.tw.toFixed(2),why:st.why||'',space:!!st.space,w:Math.round(st.w||st.m*1000)};},builds[k]);console.log(k,JSON.stringify(r));}
  // fly the UFO: use it, take off, check it rises
  await ev(sp=>{useSpec(sp);},builds.ufo);
  await A.evaluate(sp=>useSpec(sp),builds.ufo);
  console.log('UFO kind',await ev(()=>vkind()),'guns',await ev(()=>DR.guns.length),'flames',await ev(()=>DR.flames.length));
  await ev(()=>{takeoff();__wds.step({ly:0.8},3);});
  console.log('UFO height after 3s climb',await ev(()=>(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)),D=await ev(()=>D.state));
  await ev(()=>__wds.setCam('CHASE'));await A.waitForTimeout(1500);await A.screenshot({path:'f_ufo.png'});
  // rocket plane: auto take-off on the runway
  await ev(sp=>useSpec(sp),builds.rocketplane);
  console.log('plane kind',await ev(()=>vkind()));
  await ev(()=>{takeoff();takeoff();__wds.step({},12);});
  console.log('plane: alt',await ev(()=>(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)),'speed',await ev(()=>D.vel.length().toFixed(1)),'state',await ev(()=>D.state));
  await A.waitForTimeout(1500);await A.screenshot({path:'f_plane.png'});
  // car drive
  await ev(sp=>useSpec(sp),builds.car);
  await ev(()=>{__wds.step({ly:1},3);});
  console.log('car kind',await ev(()=>vkind()),'speed',await ev(()=>Math.hypot(D.vel.x,D.vel.z).toFixed(1)),'state',await ev(()=>D.state));
  await A.waitForTimeout(1200);await A.screenshot({path:'f_car.png'});
  // boat
  await ev(sp=>useSpec(sp),builds.boat);
  await ev(()=>{__wds.step({ly:1},3);});
  console.log('boat kind',await ev(()=>vkind()),'speed',await ev(()=>Math.hypot(D.vel.x,D.vel.z).toFixed(1)),'y',await ev(()=>D.pos.y.toFixed(2)));
  // --- GPS hold in wind
  await ev(()=>{useSpec(__wds.PRESETS.mini);WX.set('wind',6);WX.setMode('windy');takeoff();__wds.step({ly:0.6},3);});
  const p0=await ev(()=>[D.pos.x,D.pos.z]);await ev(()=>__wds.step({},10));const p1=await ev(()=>[D.pos.x,D.pos.z]);
  console.log('GPS hold drift over 10s in wind:',Math.hypot(p1[0]-p0[0],p1[1]-p0[1]).toFixed(2),'m');
  await ev(()=>{CFG.gpsHold=false;});const p2=await ev(()=>[D.pos.x,D.pos.z]);await ev(()=>__wds.step({},10));const p3=await ev(()=>[D.pos.x,D.pos.z]);
  console.log('no GPS drift over 10s:',Math.hypot(p3[0]-p2[0],p3[1]-p2[1]).toFixed(2),'m');
  await ev(()=>{CFG.gpsHold=true;WX.setMode('clear');WX.set('wind',2);});
  // --- landing cancel
  await ev(()=>{D.wantLand=true;__wds.step({},0.5);__wds.step({ly:1},0.3);});console.log('landing cancelled:',await ev(()=>!D.wantLand));
  // --- flip low: auto climb
  await ev(()=>{D.pos.y=H(D.pos.x,D.pos.z)+1.5;doFlip('left');__wds.step({},3);});console.log('flip after climb done:',await ev(()=>!D.flipQ),'alt',await ev(()=>(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)));
  // --- rain damage
  await ev(()=>{CFG.real=true;WX.setMode('storm');WX.set('amount',1);});
  for(let i=0;i<30;i++)await ev(()=>{for(let k=0;k<30;k++){tickRain(0.05);}});
  console.log('rain: state',await ev(()=>D.state),'wet',await ev(()=>D.wet));
  await ev(()=>{WX.setMode('clear');quickFix(false);});
  // waterproof splash drone
  await ev(()=>{useSpec(__wds.PRESETS.splash);WX.setMode('storm');takeoff();__wds.step({ly:0.5},2);for(let k=0;k<900;k++)tickRain(0.05);});
  console.log('splash drone in storm:',await ev(()=>D.state),'rain',await ev(()=>D.rain.toFixed(2)));
  await ev(()=>WX.setMode('clear'));
  // --- walk + launch
  await ev(()=>{useSpec(__wds.PRESETS.mini);walkToggle(true);});
  await A.keyboard.down('KeyW');await A.waitForTimeout(2500);await A.keyboard.up('KeyW');
  console.log('walked to',await ev(()=>WALK.pos.toArray().map(v=>v.toFixed(1)).join(',')));
  await A.waitForTimeout(800);await A.screenshot({path:'f_walk.png'});
  await ev(()=>launchHere());console.log('launched at',await ev(()=>D.pos.toArray().map(v=>v.toFixed(1)).join(',')),'walking',await ev(()=>WALK.on),'state',await ev(()=>D.state));
});
