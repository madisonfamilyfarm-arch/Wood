const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({...devices[process.env.DEV||'iPhone 15 Pro landscape']});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));localStorage.setItem('wds_devMode','"phone"');}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(2000);
  await p.evaluate(()=>{if(typeof devSet==='function')try{devSet('phone');}catch(e){}openKit('tank');});await p.waitForTimeout(2500);await p.screenshot({path:'ws_'+(process.env.TAG||'a')+'.png'});
  if(process.env.JS)console.log(await p.evaluate(process.env.JS));await b.close();})();
