const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(1);DZ.on=true;DZ.ai=true;await new Promise(r=>setTimeout(r,1500));const B=AIB.L[0];aiSwitch(B,'sub','x');await new Promise(r=>setTimeout(r,800));
 D.pos.set(B.p.x+20,WATER_Y+3,B.p.z);D.state='flying';D.armed=true;let n=0;const f0=dzBotFire;dzBotFire=function(){n++;return f0.apply(this,arguments);};const rk0=DZ.rk.length;B.rkT=0;dzBotsShoot(0.1);
 await new Promise(r=>setTimeout(r,1500));return 'sub fired '+n+' rockets in flight now '+DZ.rk.length+' sub pos y '+B.p.y.toFixed(1)+' water '+WATER_Y;}));});
