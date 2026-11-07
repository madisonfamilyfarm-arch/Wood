const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(2500);
  console.log(await P.evaluate(()=>{const c={x:PAD.x,z:PAD.z,r:56};addCrater(c,false);let n=0,tot=0;for(const [k,ch] of chunks){for(const t of ch.trees){tot++;if((t.x-c.x)**2+(t.z-c.z)**2<c.r*c.r)n++;}}
    // other meshes looking like trees near
    let inst=0;scene.traverse(o=>{if(o.isInstancedMesh&&o.visible)inst++;});return 'chunk trees inside '+n+'/'+tot+' instanced '+inst+' CH '+CH+' chunks '+chunks.size;}));
});
