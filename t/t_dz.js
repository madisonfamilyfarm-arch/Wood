const H=require('./harness');
H(async({mk})=>{
  const U='http://127.0.0.1:8765/woods-rc-sim.html';
  const A=await mk('A',U);const B=await mk('B',U);await A.waitForTimeout(3000);
  for(const P of [A,B])await P.evaluate(()=>startGame('free'));await A.waitForTimeout(2500);
  const a=(f,x)=>A.evaluate(f,x),b=(f,x)=>B.evaluate(f,x);
  console.log('A peers',await a(()=>Object.keys(mp.peers).length),'dz',await a(()=>DZ.on),'weapons',await a(()=>weaponTypes().join(',')));
  // A walks; B blows A up over the network
  const wp=await a(()=>{walkToggle(true);WALK.pos.set(PAD.x+8,0,PAD.z+8);WALK.pos.y=H(WALK.pos.x,WALK.pos.z);return [WALK.pos.x,WALK.pos.y,WALK.pos.z];});
  await A.waitForTimeout(800);
  await b(p=>{const v=new V3(p[0],p[1]+0.5,p[2]);explode(v,4,2.5,true,CFG.name,mp.id);mpSend({t:'boom',p:v.toArray(),r:4,dr:2.5,sid:'zz'});},wp);
  await A.waitForTimeout(1000);
  console.log('A dead',await a(()=>DZ.dead.toFixed(1)+' deaths '+DZ.deaths),'B kills',await b(()=>DZ.kills),'B chat',await b(()=>CHAT.slice(-2).map(c=>c.txt).join(' / ')));
  await A.screenshot({path:'dz_dead.png'});
  await A.waitForTimeout(3500);
  console.log('A respawned',await a(()=>'dead '+DZ.dead+' shield '+(D.shield>performance.now())+' pos '+WALK.pos.x.toFixed(0)+','+WALK.pos.z.toFixed(0)));
  // walking rocket
  console.log('walk fire',await a(()=>{shotMode='gun';wCur=weaponTypes().indexOf('rocket');fire.last=0;fire();return shots.length+' '+(shots[0]&&shots[0].w);}));
  // bots + campers
  console.log(await a(()=>{aiSet(3);return 'bots '+AIB.L.length;}));await A.waitForTimeout(2000);
  console.log('bot kill',await a(()=>{const Bt=AIB.L[0];explode(Bt.p.clone(),4,2.5,true,CFG.name,mp.id);return Bt.dead>0&&!mp.peers[Bt.id];}));
  console.log('camper kill',await a(()=>{const C=CAMPERS.L[0];explode(new V3(C.x,H(C.x,C.z)+0.5,C.z),4,2.5,true,CFG.name,mp.id);return C.dead>0&&!C.g.visible;}));
  // falling tree on B (drone on pad)
  console.log('tree',await b(()=>{D.shield=0;const p=D.pos;fallingTree({x:p.x-3,y:H(p.x-3,p.z),z:p.z,h:9,tr:0.3,cr:1.5,pine:true},{x:p.x-4,z:p.z});return 'queued';}));
  await A.waitForTimeout(1500);console.log('B dead by tree',await b(()=>DZ.dead>0),await b(()=>CHAT.slice(-1)[0].txt));
  // bots shoot
  await a(()=>{D.shield=0;AIB.L.forEach(B=>{B.rkT=0;B.p.copy(WALK.pos).add(new V3(10,3,0));});});
  await A.waitForTimeout(300);console.log('bot rockets',await a(()=>DZ.rk.length));
  await A.waitForTimeout(9000);
  console.log('after',await a(()=>'deaths '+DZ.deaths+' bots alive '+AIB.L.filter(B=>!B.dead).length+' peers '+Object.keys(mp.peers).join(',')+' campers dead '+CAMPERS.L.filter(c=>c.dead).length));
  console.log('menu',await a(()=>mainItems().map(i=>i.label()).filter(l=>/Danger/.test(l)).join('|')+' / '+dangerItems().length));
});
