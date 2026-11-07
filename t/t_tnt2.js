const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(3);DZ.on=true;});await P.waitForTimeout(2500);
  for(const k of Object.keys(await P.evaluate(()=>TNTK))){const r=await P.evaluate(k=>{TNT.kind=k;TNT.r=12;TNT.fuse=1.5;const B=AIB.L.find(b=>!b.dead);D.state='flying';D.armed=true;if(B){D.pos.copy(B.p).add(new V3(4,5,0));}else D.pos.set(PAD.x+60,H(PAD.x+60,PAD.z)+6,PAD.z);D.vel.set(0,0,0);
      let booms=0;const e0=explode;explode=function(){booms++;return e0.apply(this,arguments);};const n0=TNTS.length;tntDrop();const made=TNTS.length-n0;
      for(let i=0;i<200&&TNTS.length;i++){tntTick(0.03);bigTick(0.03);}explode=e0;const left=TNTS.length;TNTS.slice().forEach(T=>tntDel(T));return 'made '+made+' booms '+booms+' left '+left+' frozen '+AIB.L.filter(b=>b.frozenT>performance.now()).length;},k);console.log(k.padEnd(8),r);}
  console.log(await P.evaluate(()=>{menuToggle(true);menuPush('x',tntTypeItems());return document.querySelectorAll('#menuList .mi').length+' items';}));
});
