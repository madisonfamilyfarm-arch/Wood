const H0=require('./harness');
H0(async({mk})=>{const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
for(const [n,vp] of [['pt',{width:393,height:852}],['ls',{width:852,height:393}]]){const P=await mk(n,'http://127.0.0.1:8765/woods-rc-sim.html',vp);P.on('pageerror',e=>console.log('ERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(800);takeoff();D.pos.x+=150;D.pos.z+=80;D.pos.y+=20;await W(800);return $('padFind').textContent+' '+$('padFind').style.display;}));
await P.screenshot({path:S+'pad_'+n+'.png'});}});
