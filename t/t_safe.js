const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const o=[];startGame('free');aiSet(5);dzSet(true);await W(1000);
 const near=()=>AIB.L.forEach(B=>{B.p.copy(D.pos).add(new THREE.Vector3((Math.random()-.5)*12,4,(Math.random()-.5)*12));B.rkT=0;});
 let aimed=0;const f0=dzBotFire;dzBotFire=function(B,tg){if(tg&&tg.distanceTo(D.pos)<3)aimed++;return f0.apply(this,arguments);};
 for(const [diff,fly] of [['hard',false],['fun',true],['hard',true]]){AIB.diff=diff;aimed=0;const d0=DZ.deaths;if(fly){try{takeoff();}catch(e){}await W(1500);}else{try{resetDrone();}catch(e){}await W(800);}
  for(let i=0;i<4;i++){near();await W(4000);}o.push(diff+(fly?' flying':' parked')+': deaths '+(DZ.deaths-d0)+', rockets aimed at me '+aimed+' state '+D.state);if(DZ.dead){try{dzRespawn();}catch(e){}}}
 return o.join('\n');}));});
