const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(3000);await A.evaluate(()=>{window.__oc=updateCam;CFG.tod=14;startGame('free');applyTOD();});await A.waitForTimeout(3000);
  // find a leafy tree near the pad and stand next to it
  const info=await A.evaluate(()=>{for(let i=0;i<20;i++)lkNearTick(0.3);let best=null;for(const ch of chunks.values())for(const t of ch.trees){if(t.pine||t.im===undefined)continue;const d=Math.hypot(t.x-D.pos.x,t.z-D.pos.z);if(!best||d<best.d)best={d,t};}
    const t=best.t;window.__T=t;let lc=0;for(const [tt,e] of __wds.LKN.near)lc+=e.cols.length;return JSON.stringify({near:__wds.LKN.near.size,d:best.d.toFixed(1),h:t.h.toFixed(1),x:t.x.toFixed(1),z:t.z.toFixed(1),limbCols:lc,pool:__wds.LKN.pool.map(p=>p.w.count)});});
  console.log(info);
  await A.evaluate(()=>{const t=window.__T;window.updateCam=function(){cam.position.set(t.x+9,t.y+2,t.z+9);cam.lookAt(t.x,t.y+t.h*0.55,t.z);};});await A.waitForTimeout(6000);await A.screenshot({path:'tree3d_a.png'});
  await A.evaluate(()=>{const t=window.__T;window.updateCam=function(){cam.position.set(t.x+3,t.y+t.h*0.5,t.z+2);cam.lookAt(t.x-3,t.y+t.h*0.62,t.z-2);};});await A.waitForTimeout(6000);await A.screenshot({path:'tree3d_b.png'});
  await A.evaluate(()=>{window.updateCam=function(){cam.position.set(D.pos.x-25,6,D.pos.z+25);cam.lookAt(D.pos.x+20,5,D.pos.z-20);};});await A.waitForTimeout(6000);await A.screenshot({path:'tree3d_c.png'});
  // fly a drone into the crown: does it hit a limb (not the old solid ball)?
  const hit=await A.evaluate(()=>{const t=window.__T;let hits=0,tries=0;for(let k=0;k<200;k++){const p=new THREE.Vector3(t.x+(Math.random()-0.5)*t.cr*2,t.y+t.h*(0.45+Math.random()*0.5),t.z+(Math.random()-0.5)*t.cr*2);tries++;if(hitTest(p,0.15))hits++;}return hits+'/'+tries;});
  console.log('random points inside the crown that hit something:',hit);
});
