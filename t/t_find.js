const H0=require('./harness');
H0(async({mk})=>{const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
const P=await mk('pt','http://127.0.0.1:8765/woods-rc-sim.html',{width:393,height:852});P.on('pageerror',e=>console.log('ERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(800);takeoff();await W(500);const o=[];const s0=sbSay;window.sbSay=function(m){o.push('AI: '+m);return s0.apply(this,arguments);};
 for(const q of ['which direction is the ramp','where is the tunnel','where is the north runway','how do i find the fire tower']){smartHear(q);await W(400);o.push(q+' -> '+$('padFind').textContent);}
 $('padFind').click();await W(300);o.push('picker '+$('findPick').style.display+' '+$('findPick').querySelectorAll('button').length);return o.join('\n');}));
await P.screenshot({path:S+'find.png'});});
