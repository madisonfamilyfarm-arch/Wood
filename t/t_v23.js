const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log('train',await ev(()=>TRAIN.len.toFixed(0)+' cars '+TRAIN.cars.length+' u '+TRAIN.u.toFixed(3)));
  // assist
  console.log(await ev(()=>{aiSet(3);asSet(3);return 'mode '+ASSIST.mode;}));await A.waitForTimeout(1500);
  console.log('assist',await ev(()=>{takeoff();return 'tgt '+(ASSIST.tgt&&ASSIST.tgt.name)+' lock '+ASSIST.lock;}));
  await A.waitForTimeout(3000);
  console.log('assist2',await ev(()=>{const B=AIB.L[0];D.pos.set(B.p.x,B.p.y+3,B.p.z+25);D.yaw=0;return 'tgt '+(ASSIST.tgt&&ASSIST.tgt.name)+' lock '+ASSIST.lock+' shots '+shots.length;}));
  await A.waitForTimeout(3000);console.log('assist3',await ev(()=>'lock '+ASSIST.lock+' shots '+shots.length+' mark '+$('asMark').style.display+' dead bots '+AIB.L.filter(b=>b.dead).length));
  // fly for me
  await ev(()=>asSet(4));await A.waitForTimeout(4000);console.log('pilot',await ev(()=>D.state+' pos '+D.pos.x.toFixed(0)+','+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(0)+','+D.pos.z.toFixed(0)));
  await ev(()=>asSet(0));
  // chute
  console.log('chute',await ev(()=>{D.state='tumble';D.pos.y+=40;D.vel.set(0,-15,0);chuteToggle();return CHUTE.on;}));await A.waitForTimeout(1500);console.log('chute vy',await ev(()=>D.vel.y.toFixed(1)+' on '+CHUTE.on));
  // logs
  console.log('log',await ev(()=>{resetDrone();walkToggle(true);const p=WALK.pos;fallingTree({x:p.x+2,y:H(p.x+2,p.z),z:p.z-3,h:10,tr:0.3,cr:1.5,pine:true},{x:p.x+2,z:p.z-4});return LOGS.length;}));
  await A.waitForTimeout(2000);console.log('log hit',await ev(()=>{const L=LOGS[LOGS.length-1];const q=new V3(L.x+L.dx*4,H(L.x+L.dx*4,L.z+L.dz*4)+0.5,L.z+L.dz*4);return !!logHit(q,0.3);}));
  // train ride
  console.log('train ride',await ev(()=>{const g=TRAIN.cars[1].position;WALK.pos.set(g.x+2,H(g.x,g.z),g.z);return trainToggle()+' '+TRAIN.ride;}));await A.waitForTimeout(1500);
  await A.screenshot({path:'v23_train.png'});console.log(await ev(()=>{trainToggle();walkToggle(false);return 'off '+TRAIN.ride;}));
  // menu pause
  console.log('pause',await ev(()=>{takeoff();menuToggle(true);return D.shield>performance.now();}));await ev(()=>menuToggle(false));
  // local AI
  console.log('local',await ev(async()=>{AIB.url=aiUrlFix('127.0.0.1');const L=await aiListModels();aiBrainSet('local');return AIB.url+' '+L.map(m=>m.n).join(',')+' pick '+AIB.model;}));
  await A.waitForTimeout(7000);console.log('local ok',await ev(()=>AIB.ok+' err '+AIB.err+' kinds '+AIB.L.map(b=>b.kind).join(',')));
  console.log('menus',await ev(()=>aiItems().length+' '+assistItems().length+' '+mainItems().map(i=>{try{return i.label()}catch(e){return ''}}).filter(l=>/Assist|train/.test(l)).join(' | ')));
  await ev(()=>{__wds.setCam('CHASE');});
});
