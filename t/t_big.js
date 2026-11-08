const H0=require('./harness');const fs=require('fs');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:1000,height:620});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
const j=JSON.parse(fs.readFileSync(S+'mb/GIANT-Squid-Quad.drone.json','utf8'));
console.log(await P.evaluate(async(j)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);const sp=sanitize(j.spec);useSpec(sp);await W(1500);
 const bb=new THREE.Box3().setFromObject(DR.g);const sz=bb.getSize(new THREE.Vector3());const o=['bigF '+SPEC.bigF+' size '+sz.x.toFixed(0)+'x'+sz.y.toFixed(0)+'x'+sz.z.toFixed(0)+' m, ground gap '+(bb.min.y-H(D.pos.x,D.pos.z)).toFixed(1)+' state '+D.state+' why '+(ST.why||'')];
 camI=CAMS.indexOf('CHASE');CAMX=-1;try{takeoff();}catch(e){}const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));const y0=D.pos.y;kd('ArrowUp');await W(5000);ku('ArrowUp');await W(1000);
 o.push('climbed '+(D.pos.y-y0).toFixed(0)+' m state '+D.state);return o.join('\n');},j));
await P.screenshot({path:S+'giant.png'});});
