const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(2);await new Promise(r=>setTimeout(r,2000));const o=[];const g=()=>renderer.info.memory.geometries;const w=ms=>new Promise(r=>setTimeout(r,ms));
 let a=g();for(let i=0;i<10;i++){useSpec(JSON.parse(JSON.stringify(PICK([VPRESETS.car.tank,VPRESETS.plane.trainer,VPRESETS.heli.scale]))));await w(150);}o.push('10 useSpec: +'+(g()-a));
 a=g();for(let i=0;i<10;i++){aiSwitch(AIB.L[0]);await w(150);}o.push('10 aiSwitch: +'+(g()-a));
 a=g();for(let i=0;i<20;i++){chatAdd('x','hello '+i);await w(50);}o.push('20 chat lines: +'+(g()-a));
 a=g();for(let i=0;i<10;i++){smartHear('flip a coin');await w(300);}o.push('10 replies: +'+(g()-a));
 a=g();await w(10000);o.push('10s idle: +'+(g()-a));
 return o.join('\n');}));});
