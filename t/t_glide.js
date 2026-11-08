const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
for(const k of (process.env.KS||'plane,airliner').split(',')){
console.log(await P.evaluate(async(k)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));if(!window.__s){startGame('free');window.__s=1;}await W(300);
 const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));
 if(k==='airliner')airlinerGo();else{bsOpen(k,null);bsClose();const sp=wsSpec();closeWorkshop();useSpec(sp);}await W(1200);
 try{takeoff();}catch(e){}await W(300);try{takeoff();}catch(e){}// auto take-off
 let n=0;while(n<60&&!(D.pos.y-H(D.pos.x,D.pos.z)>40)){await W(500);n++;}
 const o=[k+' assist '+SPEC.assist+' stall '+(ST.stall||0).toFixed(1)+' after climb alt '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(0)+' state '+D.state];
 D.autoTO=false;D.thr=0;kd('ArrowDown');await W(400);ku('ArrowDown');D.thr=0;
 for(let i=0;i<10;i++){await W(1500);const a=D.pos.y-H(D.pos.x,D.pos.z),V=D.vel.length();o.push('t'+(i*1.5+1.5).toFixed(0)+' V'+V.toFixed(0)+' vy'+D.vel.y.toFixed(1)+' alt'+a.toFixed(0)+' '+D.state);if(D.state!=='flying')break;}
 try{resetDrone();}catch(e){}return o.join(' | ');},k));}});
