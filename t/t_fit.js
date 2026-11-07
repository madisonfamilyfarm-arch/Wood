const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({...devices['iPhone 15 Pro landscape']});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(1500);
  await p.evaluate(()=>{bsOpen('drone',null);bsClose();});await p.waitForTimeout(1000);
  const vis=()=>p.evaluate(()=>[...$('wsTools').children].filter(e=>e.style.display!=='none').map(e=>e.textContent.trim()).join(' | '));
  console.log('NONE:',await vis());
  for(const t of ['arm','motor','board']){await p.evaluate(t=>{WS.sel=WS.parts.findIndex(q=>q.t===t);wsDraw();},t);await p.waitForTimeout(300);console.log(t.toUpperCase()+':',await vis());}
  await p.screenshot({path:'fit.png'});await b.close();})();
