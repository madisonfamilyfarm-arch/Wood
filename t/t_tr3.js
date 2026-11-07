const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(2500);
  console.log(await P.evaluate(()=>{const c={x:PAD.x,z:PAD.z,r:56};addCrater(c,false);const out={};scene.traverse(o=>{if(!o.visible||!(o.isMesh||o.isInstancedMesh))return;let wp=new V3();o.getWorldPosition(wp);
      if(o.isInstancedMesh){const m=new THREE.Matrix4();let n=0;for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);const p=new V3().setFromMatrixPosition(m).applyMatrix4(o.matrixWorld);if(Math.hypot(p.x-c.x,p.z-c.z)<c.r&&m.elements[0]!==0)n++;}if(n){const k='IM:'+(o.geometry.type)+':'+(o.userData.lk?'lk':'')+(o.name||'');out[k]=(out[k]||0)+n;}}
      });return JSON.stringify(out);}));
});
