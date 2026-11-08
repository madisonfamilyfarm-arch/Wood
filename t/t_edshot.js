const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');aiSet(5);dzSet(true);await W(1000);
 // put all bots right next to me, aggressive
 AIB.L.forEach(B=>{B.p.copy(D.pos).add(new THREE.Vector3((Math.random()-.5)*10,3,(Math.random()-.5)*10));B.rkT=0;});
 openWorkshop(false);const d0=DZ.deaths;let rk0=DZ.rk.length,fired=0;const f0=dzBotFire;dzBotFire=function(B,tg){if(tg&&tg.distanceTo(D.pos)<3)fired++;return f0.apply(this,arguments);};
 await W(20000);const inWS='deaths in builder: '+(DZ.deaths-d0)+', rockets aimed at me: '+fired;
 closeWorkshop();fired=0;const d1=DZ.deaths;AIB.L.forEach(B=>{B.rkT=0;});await W(20000);return inWS+' | after closing: deaths '+(DZ.deaths-d1)+', aimed '+fired;}));});
