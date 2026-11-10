const H0=require('./harness');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:560});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);bsOpen('tank',null);bsClose();const sp=wsSpec();closeWorkshop();useSpec(sp);await W(1500);
 const I=partsInfo(sp);window.__loose=I.loose.map(i=>sp.parts[i].t+'@'+[sp.parts[i].x,sp.parts[i].y,sp.parts[i].h]).join(' ');
 TUR.stick.x=1;await W(700);TUR.stick.x=0;TUR.stick.y=-1;await W(600);TUR.stick.y=0;updateCam=function(){};document.querySelectorAll('#ui,#hud').forEach(e=>e.style.display='none');});
for(const [n,off] of [['a',[-0.9,0.45,-0.9]],['b',[0.9,0.35,0.6]]]){await P.evaluate(off=>{const p=D.pos;const v=new THREE.Vector3(...off).applyQuaternion(DR.g.quaternion);cam.position.copy(p).add(v);cam.lookAt(p.x,p.y+0.08,p.z);cam.fov=50;cam.updateProjectionMatrix();},off);await P.waitForTimeout(600);await P.screenshot({path:S+'tankc_'+n+'.png'});}
console.log(await P.evaluate(()=>window.__loose));});
