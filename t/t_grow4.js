const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(5);DZ.on=true;DZ.ai=true;D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+8;});await P.waitForTimeout(3000);
  const snap=()=>P.evaluate(()=>{const c={};scene.children.forEach(o=>{const k=(o.name||o.type)+':'+(o.geometry?o.geometry.type:'')+':'+(o.material&&!Array.isArray(o.material)?(o.material.color?o.material.color.getHexString():''):'');c[k]=(c[k]||0)+1;});return {n:scene.children.length,c,FXB:FXB.length,BIG:BIG.L.length,shots:shots.length,TN:TNTS.length};});
  const a=await snap();
  // simulate a busy minute of battle: lots of AI rockets
  for(let i=0;i<6;i++){await P.evaluate(()=>{for(let k=0;k<200;k++){try{aiTick(0.05);dzBotsShoot(0.05);tickShots(0.05);fireTick(0.05);}catch(e){}}});}
  const b=await snap();await P.waitForTimeout(8000);const c=await snap();
  console.log('scene',a.n,'→',b.n,'→',c.n,'| FXB',a.FXB,b.FXB,c.FXB,'| BIG',a.BIG,b.BIG,c.BIG,'| shots',a.shots,b.shots,c.shots);
  Object.keys(c.c).map(k=>[k,a.c[k]||0,b.c[k]||0,c.c[k]]).filter(x=>x[3]-x[1]>2).sort((x,y)=>(y[3]-y[1])-(x[3]-x[1])).slice(0,12).forEach(x=>console.log(x.join('  ')));
});
