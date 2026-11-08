const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:1000,height:620});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(800);airlinerGo();await W(2500);window.__u=updateCam;updateCam=function(){};
 document.querySelectorAll('#ui,#hud,.hud').forEach(e=>e.style.display='none');});
for(const [n,off] of [['quarter',[-38,14,-40]],['side',[-60,4,0]],['top',[0,70,5]],['rear',[25,10,55]]]){
 console.log(await P.evaluate(async(off)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const p=D.pos;const g=DR.g;const d=new THREE.Vector3();g.getWorldDirection(d);
  // put the camera relative to the plane's own axes (forward = -z of the model)
  const v=new THREE.Vector3(off[0],off[1],off[2]).applyQuaternion(g.quaternion);cam.position.copy(p).add(v);cam.lookAt(p.x,p.y+2,p.z);cam.fov=55;cam.updateProjectionMatrix();await W(600);return 'dir '+d.toArray().map(x=>x.toFixed(2));},off));
 await P.screenshot({path:S+'airlv_'+n+'.png'});}});
