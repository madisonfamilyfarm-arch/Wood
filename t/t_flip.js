const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({...devices['iPhone 15 Pro landscape']});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(2000);
  await p.evaluate(()=>{D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+6;});await p.waitForTimeout(800);
  const bb=await p.evaluate(()=>{const b=$('flipBtn');const r=b.getBoundingClientRect();return {d:b.style.display,x:r.x+r.width/2,y:r.y+r.height/2,top:(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)||{}).id,cam:camName(),assist:SPEC.assist,state:D.state};});console.log(JSON.stringify(bb));
  await p.touchscreen.tap(bb.x,bb.y);await p.waitForTimeout(150);console.log(await p.evaluate(()=>'flip '+JSON.stringify(D.flip)+' flipQ '+D.flipQ+' state '+D.state));
  await b.close();})();
