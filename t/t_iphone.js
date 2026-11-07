const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl']});
  const dev=devices['iPhone 15 Pro landscape']||devices['iPhone 14 Pro landscape'];const ctx=await b.newContext({...dev});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
  const p=await ctx.newPage();p.setDefaultTimeout(150000);p.on('pageerror',e=>console.log('PAGEERR',e.message));
  for(const f of ['three.min.js']) await p.route('**/'+f,r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.route('**/GLTFLoader.js',r=>r.fulfill({path:__dirname+'/node_modules/three/examples/js/loaders/GLTFLoader.js',contentType:'text/javascript'}));
  await p.route('**/SkeletonUtils.js',r=>r.fulfill({path:__dirname+'/node_modules/three/examples/js/utils/SkeletonUtils.js',contentType:'text/javascript'}));
  await p.route('**/GLTFExporter.js',r=>r.fulfill({path:__dirname+'/node_modules/three/examples/js/exporters/GLTFExporter.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.screenshot({path:'ip_title.png'});
  await p.evaluate(()=>startGame('free'));await p.waitForTimeout(2500);await p.screenshot({path:'ip_game.png'});
  await p.evaluate(()=>{aiSet(4);});await p.waitForTimeout(2500);
  await p.tap('#cbBtn');await p.waitForTimeout(400);
  const lines=['hi Sam','hey everyone','Gizmo go to the lake','everyone follow me','Ace switch to a plane','race me','tell me a joke','what are you doing','help the tree is on fire','stop shooting','thanks'];
  for(const t of lines){await p.fill('#cbIn',t);await p.tap('#cbForm button');await p.waitForTimeout(1800);}
  await p.screenshot({path:'ip_chat.png'});console.log('dev',await p.evaluate(()=>{devSet('computer');return 'phone '+PHONE+' sticks '+document.querySelector('.stick').style.display+' tools '+$('asBtn').style.display;}));await p.waitForTimeout(500);await p.screenshot({path:'ip_comp.png'});await p.evaluate(()=>devSet('auto'));
  console.log(await p.evaluate(()=>CHAT.slice(-40).map(c=>(c.who||'·')+': '+c.txt).join('\n')));
  console.log('kinds',await p.evaluate(()=>AIB.L.map(B=>B.name+':'+B.kind).join(' ')));
  console.log(dev.viewport);await b.close();})();
