const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(3);DZ.on=false;});await P.waitForTimeout(3000);
  console.log(await P.evaluate(()=>{const B=AIB.L[0];B.goal=null;D.state='flying';D.pos.set(B.p.x+40,B.p.y+8,B.p.z);D.vel.set(0,0,0);tntDrop();const T=TNTS[0];T.p.set(B.p.x,B.p.y+6,B.p.z);T.g.position.copy(T.p);SIM.pause=true;
    for(let i=0;i<60&&TNTS.length;i++){SIM.pause=false;tntTick(0.05);}return 'TNT left '+TNTS.length+' bots alive '+AIB.L.filter(b=>!b.dead).length+'/3';}));
  await P.waitForTimeout(800);await P.screenshot({path:'tnt.png'});
  console.log(await P.evaluate(()=>{const B=AIB.L.find(b=>!b.dead);if(!B)return'no bot';const p=B.p.clone().add(new V3(-30,0,3));let boomed=0;const e0=explode;explode=function(){boomed++;return e0.apply(this,arguments);};
    spawnShot('rocket',p,new V3(40,0,0),0xffffff,true,'tst'+Math.random(),mp.id);for(let i=0;i<80;i++)tickShots(0.02);explode=e0;return 'auto-detect boom '+boomed+' botalive '+!B.dead;}));
});
