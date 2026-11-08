const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({...devices['iPhone 15 Pro']});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
  const p=await ctx.newPage();await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(1500);
  await p.evaluate(()=>{bsOpen('tank',null);bsClose();});await p.waitForTimeout(1200);await p.screenshot({path:'wsP1.png'});
  await p.evaluate(()=>{ezOpen();});await p.waitForTimeout(1000);await p.screenshot({path:'wsP2.png'});await b.close();})();
