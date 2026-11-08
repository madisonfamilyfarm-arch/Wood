const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');const B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');
 for(const p of [A,B]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}
 await A.evaluate(()=>{CFG.name='Madison';aiSet(2);});await B.evaluate(()=>{CFG.name='Sister';takeoff();});await A.waitForTimeout(8000);
 await B.evaluate(()=>{D.pos.set(60,12,60);D.state='flying';D.armed=true;D.vel.set(0,0,0);});await A.waitForTimeout(2000);
 await B.evaluate(()=>chatSend('Ace follow me'));await A.waitForTimeout(12000);
 console.log(await A.evaluate(()=>{const pe=Object.values(mp.peers).find(p=>p.name==='Sister');const B=AIB.L[0];return 'sister@'+pe.p.toArray().map(Math.round)+' ace@'+B.p.toArray().map(Math.round)+' dist '+Math.round(B.p.distanceTo(pe.p))+' folPeer '+B.folPeer+' goal '+JSON.stringify(B.goal)+' hunt '+B.hunt+' dz '+DZ.on+DZ.ai+' kind '+B.kind+' mode '+B.mode+' team '+B.team+' cmdT '+Math.round(performance.now()-(B.cmdT||0));}));
});
