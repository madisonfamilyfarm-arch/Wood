const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({...devices['iPhone 15 Pro landscape']});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
  const p=await ctx.newPage();p.on('pageerror',e=>console.log('PAGEERR',e.message));await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(2000);
  // menu path: build items → tank
  console.log(await p.evaluate(()=>{const L=buildItems();const it=L.find(i=>/Tank/.test(String(i.label())));it.act();return $('bsBox').style.display+' | '+$('bsCard').innerText.replace(/\n+/g,' / ');}));
  await p.screenshot({path:'bs1.png'});
  await p.evaluate(()=>[...document.querySelectorAll('#bsCard .bsO')][0].click());await p.waitForTimeout(800);console.log(await p.evaluate(()=>$('bsCard').innerText.replace(/\n+/g,' / ')));
  await p.evaluate(()=>[...document.querySelectorAll('#bsCard .bsO')][0].click());await p.waitForTimeout(1500);await p.screenshot({path:'ez1.png'});
  await p.evaluate(()=>{const r=document.querySelector('#ezPanel input[data-k=size]');r.value=200;r.oninput();});await p.waitForTimeout(800);
  await p.evaluate(()=>document.querySelector('#ezPanel button[data-v=both]').click());await p.waitForTimeout(800);await p.screenshot({path:'ez2.png'});
  console.log(await p.evaluate(()=>'parts '+WS.parts.length+' guns '+WS.parts.filter(p=>p.t==='gun').map(p=>p.style)+' armor '+WS.armor+' kit '+WS.kit+' cur saved '+!!LS.get('wsCur_tank',null)));
  await p.evaluate(()=>document.querySelector('#ezPanel button[data-fn=drag]').click());await p.waitForTimeout(1200);await p.screenshot({path:'ws2.png'});
  console.log(await p.evaluate(()=>[...document.querySelectorAll('#wsTray .wsHead')].map(h=>h.textContent).join(' | ').slice(0,400)));
  await p.evaluate(()=>$('wsFoldR').click());await p.waitForTimeout(700);await p.screenshot({path:'ws3.png'});
  // crazy
  await p.evaluate(()=>{closeWorkshop();bsStart('mix');[...document.querySelectorAll('#bsCard .bsO')][0].click();});await p.waitForTimeout(1200);console.log(await p.evaluate(()=>$('bsCard').innerText.replace(/\n+/g,' / ')));
  await b.close();})();
