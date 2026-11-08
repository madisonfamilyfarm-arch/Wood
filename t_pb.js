const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
await p.goto('http://127.0.0.1:8765/woods-rc-sim.html');await p.waitForTimeout(3000);
const out=await p.evaluate(async()=>{const log=[];const c0=chatAdd;chatAdd=function(n,t){log.push(String(n).slice(0,14)+': '+t);return c0.apply(this,arguments);};
startGame('free');aiSet(4);DZ.on=true;DZ.ai=true;await new Promise(r=>setTimeout(r,25000));
for(const q of ['which team are you on','help me','gg','rematch','are you ok','who is winning','nice shot','lol','you missed']){smartHear(q);await new Promise(r=>setTimeout(r,2500));}
const B=AIB.L[0];HIT.ctx={p:B.p.clone(),r:30,by:'me',id:mp.id};dzBotDie(B,'x');HIT.ctx=null;await new Promise(r=>setTimeout(r,3000));smartHear('who is winning');await new Promise(r=>setTimeout(r,3000));return log;});
console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
