const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
for(const [jp,rp] of [[5,2],[7,2],[9,3]]){
console.log(await P.evaluate(async([jp,rp])=>{const W=ms=>new Promise(r=>setTimeout(r,ms));if(!window.__s){startGame('free');window.__s=1;}await W(300);
 KITS.jet.parts.forEach(p=>{if(p.t==='jet')p.pow=jp;if(p.t==='rocket')p.pow=rp;});bsOpen('jet',null);bsClose();await W(500);
 [...document.querySelectorAll('#wsTools button')].find(b=>/FLY IT/.test(b.textContent)).click();await W(1500);
 const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));
 const y0=D.pos.y,p0=D.pos.clone();let mx=0;const iv=setInterval(()=>{mx=Math.max(mx,D.vel?D.vel.length():0);},200);
 kd('ArrowUp');await W(5000);kd('KeyS');await W(2500);ku('KeyS');await W(5000);ku('ArrowUp');clearInterval(iv);
 const r='jet '+jp+' rk '+rp+': state '+D.state+' moved '+Math.round(D.pos.distanceTo(p0))+' alt '+(D.pos.y-y0).toFixed(1)+' max '+mx.toFixed(1);try{resetDrone();}catch(e){}return r;},[jp,rp]));}});
