const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  await A.waitForTimeout(8000);await A.evaluate(()=>{CFG.tod=14;startGame('free');});await A.waitForTimeout(4000);
  console.log(await A.evaluate(()=>{const ap=FU.g.children[0];return JSON.stringify({type:ap.geometry.type,vis:ap.visible,mat:ap.material.type,map:!!ap.material.map,img:ap.material.map&&ap.material.map.image&&ap.material.map.image.width,op:ap.material.opacity,pos:ap.position,frust:ap.frustumCulled});}));
  await A.evaluate(()=>{walkToggle(true);WALK.pos.set(0,40,-30);WALK.yaw=Math.PI;WALK.pitch=-0.9;window.__hold=setInterval(()=>{WALK.pos.y=40;},10);});
  await A.waitForTimeout(5000);await A.screenshot({path:'fdbg2.png'});
});
