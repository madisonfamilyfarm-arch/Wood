const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
await p.goto('http://127.0.0.1:8765/woods-rc-sim.html');await p.waitForTimeout(3000);
const out=await p.evaluate(async()=>{startGame('free');aiSet(4);DZ.on=true;DZ.ai=true;await new Promise(r=>setTimeout(r,3000));const o=[];
for(const q of ['who is winning','gg','nice shot','help me'])o.push(JSON.stringify(nNorm(q)));const B=AIB.L[0];HIT.ctx={p:B.p.clone(),r:30,by:'me',id:mp.id};dzBotDie(B,'x');HIT.ctx=null;o.push('dead '+B.dead+' '+JSON.stringify(PB.score));return o;});
console.log(out.join('\n'));console.log('errors',errs);await b.close();})();
