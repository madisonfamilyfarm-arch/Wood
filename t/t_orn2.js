const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:560});await P.waitForTimeout(3000);
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);bsOpen('ornithopter',null);bsClose();const sp=wsSpec();closeWorkshop();useSpec(sp);await W(800);try{takeoff();}catch(e){}await W(300);try{takeoff();}catch(e){}await W(4000);camI=CAMS.indexOf('CHASE');CAMX=-1;});
for(const n of [1,2]){await P.waitForTimeout(170);await P.screenshot({path:S+'orn'+n+'.png'});}
console.log(await P.evaluate(()=>{const F=DR.g.userData.flap;return 'pivots '+(F?F.piv.length:0)+' rz '+(F?F.piv.map(o=>o.pv.rotation.z.toFixed(2)).join(','):'');}));});
