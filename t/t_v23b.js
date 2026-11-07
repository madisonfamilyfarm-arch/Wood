const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  // voice parsing
  console.log('voice',await ev(()=>{const out=[];const c=chatSend;chatSend=t=>out.push(t);voiceHeard('hello there');voiceHeard('chat I am going to blow you up Gizmo end chat');voiceHeard('chat watch out');voiceHeard('behind you and chat');chatSend=c;return JSON.stringify(out);}));
  // own blast
  console.log('self',await ev(()=>{takeoff();return 1;}));await A.waitForTimeout(3000);
  console.log('self safe',await ev(()=>{D.shield=0;explode(D.pos.clone().add(new V3(1,0,0)),5,2,true,CFG.name,mp.id);return 'dead '+!!DZ.dead+' state '+D.state;}));
  // battery double tap
  console.log('batt',await ev(()=>{D.batt=5;photoTap();photoTap();return D.batt;}));
  // pause all
  console.log('pause',await ev(()=>{aiSet(2);return 1;}));await A.waitForTimeout(1500);
  const p1=await ev(()=>{pauseToggle();return AIB.L[0].p.x;});await A.waitForTimeout(1500);console.log('frozen bot moved',await ev(x=>Math.abs(AIB.L[0].p.x-x).toFixed(2),p1));await ev(()=>pauseToggle());
  // revenge
  console.log('revenge',await ev(()=>{const B=AIB.L[0];D.shield=0;DZ.dead=0;dzDie('Blown up by test',B.id,B.name);return 'killer '+(DZ.killer&&DZ.killer.name);}));
  console.log('respawn',await ev(()=>{dzRespawn();return 'rev '+ASSIST.revId+' em '+asEM();}));await A.waitForTimeout(1500);
  console.log('rev lock',await ev(()=>'lock '+ASSIST.lock+' tgt '+(ASSIST.tgt&&ASSIST.tgt.id)));
  console.log('rev kill',await ev(()=>{const B=AIB.L[0];dzBotDie(B,'💥 '+CFG.name+' blew up '+B.name);return ((B.dead-performance.now())/60000).toFixed(1)+' min';}));
  // giga
  await ev(()=>{DZ.dead=0;gigaGo();__wds.setCam('CHASE');});await A.waitForTimeout(2000);
  console.log('giga',await ev(()=>'rad '+ST.rad.toFixed(1)+' top '+ST.top.toFixed(0)+' scale '+DR.g.scale.x+' state '+D.state+' pos '+D.pos.x.toFixed(0)+','+D.pos.z.toFixed(0)+' y '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)));
  await ev(()=>takeoff());await A.waitForTimeout(3000);await ev(()=>{keys.KeyW=true;keys.ShiftLeft=true;});await A.waitForTimeout(4000);
  console.log('giga fly',await ev(()=>'state '+D.state+' speed '+D.vel.length().toFixed(1)+' alt '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)+' pos '+D.pos.x.toFixed(0)+','+D.pos.z.toFixed(0)));
  await A.screenshot({path:'giga.png'});await ev(()=>{keys.KeyW=false;});
  // fly giga back into the woods
  await ev(()=>{D.pos.set(60,H(60,-60)+20,-60);});await A.waitForTimeout(3000);console.log('giga woods',await ev(()=>'state '+D.state+' craters '+CRATERS.length));await A.screenshot({path:'giga2.png'});
});
