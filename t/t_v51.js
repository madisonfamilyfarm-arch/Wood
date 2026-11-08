const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  for(const dev of ['iPhone 15 Pro landscape','iPhone 15 Pro']){const ctx=await b.newContext({...devices[dev]});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>{startGame('free');});await p.waitForTimeout(2000);
  console.log(dev,await p.evaluate(()=>{const f=$('bFire');f.style.display='block';const a=f.getBoundingClientRect(),g=$('gimbal').getBoundingClientRect();const ov=!(g.right<a.left||g.left>a.right||g.bottom<a.top||g.top>a.bottom);return 'fire '+[a.x,a.y,a.width].map(Math.round)+' gimbal '+[g.x,g.y,g.height].map(Math.round)+' overlap '+ov;}));
  await p.evaluate(()=>menuToggle(true));await p.waitForTimeout(800);await p.screenshot({path:'menu_'+(dev.includes('land')?'L':'P')+'.png'});await ctx.close();}await b.close();})();
