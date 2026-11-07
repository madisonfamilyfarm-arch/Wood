const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(5);D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+8;});
  const snap=()=>P.evaluate(()=>{const c={};scene.children.forEach(o=>{const k=o.type+':'+(o.geometry?o.geometry.type:'')+':'+(o.material&&!Array.isArray(o.material)?o.material.type+(o.material.transparent?'T':''):'');c[k]=(c[k]||0)+1;});return {n:scene.children.length,c,progs:renderer.info.programs.length,geo:renderer.info.memory.geometries,tex:renderer.info.memory.textures,FXB:FXB.length};});
  const a=await snap();await P.waitForTimeout(20000);const b=await snap();
  await P.evaluate(async()=>{for(let i=0;i<8;i++){explode(D.pos.clone().add(new V3(20+i*5,0,10)),6,3,true,'me',mp.id);await new Promise(r=>setTimeout(r,300));}});await P.waitForTimeout(15000);const c=await snap();
  for(const [nm,s] of [['start',a],['20s idle',b],['after booms+15s',c]])console.log(nm,'children',s.n,'programs',s.progs,'geoms',s.geo,'tex',s.tex,'FXB',s.FXB);
  const keys=new Set([...Object.keys(a.c),...Object.keys(c.c)]);[...keys].map(k=>[k,a.c[k]||0,b.c[k]||0,c.c[k]||0]).filter(x=>x[3]!==x[1]).sort((x,y)=>(y[3]-y[1])-(x[3]-x[1])).slice(0,20).forEach(x=>console.log(x.join('  ')));
});
