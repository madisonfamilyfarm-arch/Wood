const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(5);D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+8;});await P.waitForTimeout(5000);
  const snap=()=>P.evaluate(()=>{const g={};const seen=new Set();scene.traverse(o=>{if(o.geometry&&!seen.has(o.geometry.uuid)){seen.add(o.geometry.uuid);let p=o;let path='';while(p&&p!==scene){path=(p.name||p.type)+'/'+path;p=p.parent;}const k=o.geometry.type+' @'+path.split('/').slice(0,2).join('/');g[k]=(g[k]||0)+1;}});return {g,mem:renderer.info.memory.geometries,n:seen.size};});
  const a=await snap();await P.waitForTimeout(40000);const b=await snap();console.log('geoms in scene',a.n,'→',b.n,' gpu',a.mem,'→',b.mem);
  Object.keys(b.g).map(k=>[k,a.g[k]||0,b.g[k]]).filter(x=>x[2]!==x[1]).forEach(x=>console.log(x.join('  ')));
});
