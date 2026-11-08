const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
await P.evaluate(()=>{startGame('free');const R=renderer.render.bind(renderer);window.__sc=new Map();renderer.render=function(s,c){if(s!==scene){const k=(s.name||'')+'#'+s.children.length+':'+(s.uuid.slice(0,6));__sc.set(s.uuid,(__sc.get(s.uuid)||0)+1);}return R(s,c);};});await P.waitForTimeout(800);
console.log(await P.evaluate(async()=>{const live=()=>{const S=new Set();scene.traverse(o=>{if(o.geometry)S.add(o.geometry.uuid);});return S.size;};const a=renderer.info.memory.geometries,la=live();
 for(let i=0;i<10;i++){useSpec(JSON.parse(JSON.stringify([VPRESETS.car.tank,VPRESETS.plane.trainer,VPRESETS.heli.scale][i%3])));await new Promise(r=>setTimeout(r,200));}
 return 'renderer geos '+a+'→'+renderer.info.memory.geometries+' | in main scene '+la+'→'+live()+' | other scenes rendered: '+JSON.stringify([...__sc.entries()].slice(0,5));}));});
