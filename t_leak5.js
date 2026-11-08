const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>startGame('free'));await P.waitForTimeout(800);
console.log(await P.evaluate(async()=>{const o=[];const w=ms=>new Promise(r=>setTimeout(r,ms));useSpec(JSON.parse(JSON.stringify(VPRESETS.car.tank)));await w(300);
 window.__bc=0;{const b0=buildChunk;buildChunk=function(){__bc++;return b0.apply(this,arguments);};}const G=new Set();DR.g.traverse(m=>{if(m.geometry)G.add(m.geometry);});let disp=0;G.forEach(g=>g.addEventListener('dispose',()=>disp++));const a=renderer.info.memory.geometries;
 useSpec(JSON.parse(JSON.stringify(VPRESETS.plane.trainer)));await w(500);o.push('old tank geos '+G.size+' disposed '+disp+' | renderer '+a+'→'+renderer.info.memory.geometries);
 const G2=new Set();DR.g.traverse(m=>{if(m.geometry)G2.add(m.geometry);});o.push('new plane geos '+G2.size+' chunks rebuilt '+__bc);
 // what else got added? count scene meshes not in DR by name
 return o.join('\n');}));});
