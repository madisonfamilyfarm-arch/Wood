const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);bsOpen('ornithopter',null);bsClose();const sp=wsSpec();closeWorkshop();useSpec(sp);await W(800);D.state='flying';
 const F=DR.g.userData.flap;const o=[];const v=new THREE.Vector3();for(let i=0;i<6;i++){await W(120);const ys=F.piv.map(q=>{q.pv.children[0].updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(q.pv);const wp=DR.g.worldToLocal(b.max.clone());return q.side+':'+q.pv.rotation.z.toFixed(2)+' top'+wp.y.toFixed(3);});o.push(ys.join('  '));}
 return o.join('\n')+'\nrz '+JSON.stringify(SPEC.parts.filter(p=>p.t==='wing').map(p=>[p.x,p.rz]));}));});
