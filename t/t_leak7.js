const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>startGame('free'));await P.waitForTimeout(800);
console.log(await P.evaluate(async()=>{const o=[];const w=ms=>new Promise(r=>setTimeout(r,ms));const g=()=>renderer.info.memory.geometries;
 for(const pre of ['VPRESETS.car.tank','VPRESETS.heli.scale','SPEC']){const sp=JSON.parse(JSON.stringify(eval(pre)));const a=g();for(let i=0;i<5;i++){useSpec(JSON.parse(JSON.stringify(sp)));await w(300);}o.push(pre+' x5 same: +'+(g()-a)+' pos '+D.pos.toArray().map(Math.round));}
 const a=g();for(let i=0;i<5;i++){rebuildDrone();await w(300);}o.push('rebuildDrone x5: +'+(g()-a));return o.join('\n');}));});
