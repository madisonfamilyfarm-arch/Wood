const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await ev(()=>{walkToggle(true);trainReset();bmSet(true);return 'bm '+BM.on+' cur '+bmCur();}));
  for(const p of [[20,30],[60,45],[75,-10],[30,-40]]){await ev(p=>{WALK.pos.set(p[0],H(p[0],p[1]),p[1]);$('bShot').click();},p);await A.waitForTimeout(400);}
  console.log('track',await ev(()=>'pts '+TRAIN.mine.length+' len '+TRAIN.len.toFixed(0)+' marks '+BM.marks.length));
  console.log('swap',await ev(()=>{$('bMode').click();return bmCur();}));
  const n0=await ev(()=>OBJS.length);await ev(()=>$('bShot').click());console.log('placed',await ev(n=>OBJS.length-n,n0));
  // map tap
  await ev(()=>{BM.i=0;mapMode('big');});await A.waitForTimeout(800);
  const r=await ev(()=>{const c=$('mini').getBoundingClientRect();return [c.left+c.width*0.7,c.top+c.height*0.4];});
  await A.mouse.click(r[0],r[1]);await A.waitForTimeout(500);console.log('map tap',await ev(()=>'pts '+TRAIN.mine.length+' last '+JSON.stringify(TRAIN.mine[TRAIN.mine.length-1])));
  await A.screenshot({path:'bm_map.png'});await ev(()=>{mapMode('corner');});
  console.log('walk',await ev(()=>{WALK.pos.set(0,H(0,0),0);keys.KeyW=true;return 1;}));await A.waitForTimeout(1000);console.log(await ev(()=>{keys.KeyW=false;return 'moved '+Math.hypot(WALK.pos.x,WALK.pos.z).toFixed(1);}));
  await ev(()=>{bmSet(false);trainReset();});console.log('off',await ev(()=>BM.on+' '+$('bmBan').style.display));
});
