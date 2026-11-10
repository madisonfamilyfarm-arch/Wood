const H0=require('./harness');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:560});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(500);try{takeoff();}catch(e){}await W(2500);D.pos.set(RW2[0].x+RW2[0].len/2+30,H(RW2[0].x+RW2[0].len/2+30,RW2[0].z)+25,RW2[0].z);D.yaw=Math.PI/2;await W(1500);camI=CAMS.indexOf('CHASE');CAMX=-1;await W(1500);return 'pos '+D.pos.toArray().map(Math.round)+' flat? '+[-150,-50,50,150].map(u=>H(RW2[0].x+u,RW2[0].z).toFixed(1)).join(' ');}));
await P.screenshot({path:S+'runway2.png'});});
