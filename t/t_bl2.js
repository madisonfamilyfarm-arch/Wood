const H0=require('./harness');const fs=require('fs');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/bl/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:430,height:860});await P.waitForTimeout(3000);
const j=JSON.parse(fs.readFileSync(S+'f1.json','utf8'));
console.log(await P.evaluate(async(j)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(500);const sp=sanitize(j.spec);sp.wires=j.spec.wires;useSpec(sp);await W(800);
 D.pos.x=SECRET.x;D.pos.z=SECRET.z;D.pos.y=groundY(D.pos.x,D.pos.z);D.home.set(D.pos.x,D.pos.y,D.pos.z);await W(300);const y0=D.pos.y;takeoff();
 const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));kd('ArrowUp');await W(2500);ku('ArrowUp');await W(1500);
 return 'h '+(D.pos.y-y0).toFixed(1)+' '+D.state;},j));
await P.screenshot({path:S+'fly.png'});});
