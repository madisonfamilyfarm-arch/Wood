const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8790/');await A.waitForTimeout(4000);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  await ev(()=>tedOpen());await A.waitForTimeout(1000);
  const scr=async(x,z)=>ev(([x,z])=>tedScreen(x,z),[x,z]);
  const pts=[[20,20],[70,15],[70,-30],[15,-35]];for(const [x,z] of pts){const s=await scr(x,z);await A.mouse.move(s.x,s.y);await A.mouse.click(s.x,s.y);await A.waitForTimeout(200);}
  const m=await scr(-10,0);await A.mouse.move(m.x,m.y);await A.waitForTimeout(300);await A.screenshot({path:'ted1.png'});
  const f=await scr(20,20);await A.mouse.click(f.x,f.y);await A.waitForTimeout(600);
  console.log('loop',await ev(()=>'mine '+TRAIN.mine.length+' loop '+TRAIN.loop+' closed '+TRAIN.closed+' len '+TRAIN.len.toFixed(0)+' ted '+TED.on));
  // switch
  await ev(()=>{tedOpen();TED.mode='pick';});await A.waitForTimeout(600);const sp=await ev(()=>{const p=TRAIN_PTS[Math.floor(TRAIN_PTS.length*0.3)];return tedScreen(p.x,p.z);});await A.mouse.click(sp.x,sp.y);await A.waitForTimeout(200);
  for(const [x,z] of [[110,40],[140,60]]){const s=await scr(x,z);await A.mouse.click(s.x,s.y);await A.waitForTimeout(200);}
  await A.screenshot({path:'ted2.png'});await ev(()=>tedDone());console.log('branch',await ev(()=>'br '+TRAIN.br.length+' built '+TRAIN.brB.length+' len '+(TRAIN.brB[0]&&TRAIN.brB[0].len.toFixed(0))));
  // run the train onto the branch
  await ev(()=>{TRAIN.ride=true;TRAIN.turn=true;TRAIN.sw=TRAIN.brB.map(()=>true);TRAIN.u=(TRAIN.brB[0].u0-0.02+1)%1;TRAIN.v=15;TRAIN.hold=1;});await A.waitForTimeout(4000);console.log('on branch',await ev(()=>'at '+TRAIN.at+' s '+TRAIN.s.toFixed(1)));await ev(()=>{TRAIN.ride=false;TRAIN.hold=0;});
  // blow up everything near the fire tower + the track
  console.log('boom',await ev(()=>{const n0=GONE.objs.length;explode(new V3(FT.x,H(FT.x,FT.z)+3,FT.z),8,4,true,CFG.name,mp.id);const p=TRAIN_PTS[10];explode(new V3(p.x,H(p.x,p.z)+0.5,p.z),5,3,true,CFG.name,mp.id);explode(new V3(TRUCK.x,H(TRUCK.x,TRUCK.z)+1,TRUCK.z),6,3,true,CFG.name,mp.id);return 'objs '+GONE.objs.length+' cols '+GONE.cols.length+' surf '+GONE.surf.length+' brk '+TRAIN.brk.length+' truck '+GONE.truck;}));
  console.log('put back',await ev(()=>{putBack();return 'objs '+GONE.objs.length+' cols '+GONE.cols.length+' brk '+TRAIN.brk.length+' truck '+GONE.truck;}));
  // AI chat
  await ev(()=>{AIB.url=aiUrlFix('127.0.0.1:11435');AIB.models=[];aiBrainSet('local');chatSend('Sam, go to the meadow please');});await A.waitForTimeout(5000);
  console.log('chat',await ev(()=>CHAT.slice(-3).map(c=>(c.who||'')+': '+c.txt).join(' / ')+' | Sam goal '+(CAMPERS.L.find(c=>c.name==='Sam').hx2||0).toFixed(0)));
  console.log('more items',await ev(()=>aiMoreItems().length));
});
