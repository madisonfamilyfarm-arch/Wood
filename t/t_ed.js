const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({...devices['iPhone 15 Pro landscape']});await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/CORS|ERR_|Failed to load/.test(m.text()))errs.push('console: '+m.text());});await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
  await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(1500);
  await p.evaluate(()=>{bsOpen('tank',null);bsClose();});await p.waitForTimeout(1000);
  const n=()=>p.evaluate(()=>WS.parts.length+' parts, undo '+HIST.u.length+' redo '+HIST.r.length);
  console.log('start',await n());
  // --- touch: vertical swipe on the parts list should SCROLL, not grab
  const tile=await p.evaluate(()=>{const t=document.querySelectorAll('#wsTray .wsPart')[2].getBoundingClientRect();return {x:t.x+t.width/2,y:t.y+t.height/2};});
  const cdp=await ctx.newCDPSession(p);const touch=async(pts)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pts[0][0],y:pts[0][1]}]});for(const q of pts.slice(1)){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:q[0],y:q[1]}]});await p.waitForTimeout(16);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
  const sc0=await p.evaluate(()=>$('wsTray').scrollTop);const pts=[];for(let i=0;i<=12;i++)pts.push([tile.x+i*0.8,tile.y-i*14]);await touch(pts);await p.waitForTimeout(600);
  console.log('vertical swipe → scrolled',(await p.evaluate(()=>$('wsTray').scrollTop))-sc0,'px; drag?',await p.evaluate(()=>!!WS.drag),'|',await n());
  // --- sideways swipe = drag the part onto the picture
  const tile2=await p.evaluate(()=>{const t=document.querySelectorAll('#wsTray .wsPart')[1].getBoundingClientRect();return {x:t.x+t.width/2,y:t.y+t.height/2};});
  const cv=await p.evaluate(()=>{const r=$('wsCv').getBoundingClientRect();return {x:r.x+r.width*0.5,y:r.y+r.height*0.45};});
  const pts2=[];for(let i=0;i<=20;i++)pts2.push([tile2.x+(cv.x-tile2.x)*i/20,tile2.y+(cv.y-tile2.y)*i/20]);await touch(pts2);await p.waitForTimeout(600);console.log('sideways drag →',await n());
  // --- tap a tile = adds it
  await touch([[tile2.x,tile2.y],[tile2.x+1,tile2.y]]);await p.waitForTimeout(500);console.log('tap →',await n());
  // --- tools + undo/redo chain
  await p.evaluate(()=>{WS.sel=WS.parts.length-1;wsTool('long');wsTool('rotL');});await p.waitForTimeout(600);console.log('after tools',await n());
  await p.evaluate(()=>{const r=$('ezPanel');ezOpen();const s=document.querySelector('#ezPanel input[data-k=size]');for(const v of [110,130,160,200]){s.value=v;s.oninput();}});await p.waitForTimeout(800);console.log('easy slider drag',await n());
  console.log(await p.evaluate(()=>{const a=WS.parts.length;histUndo();const b=WS.parts.length;histUndo();histUndo();histUndo();const c=WS.parts.length;histRedo();histRedo();const d=WS.parts.length;return 'undo chain parts '+a+'→'+b+'→'+c+' redo→'+d+' | '+HIST.u.length+'/'+HIST.r.length;}));
  // --- autosave + restore after reload
  await p.evaluate(()=>{WS.name='Test Tank';wsChanged();});await p.waitForTimeout(800);await p.reload({waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(2500);
  console.log('after reload prompt:',await p.evaluate(()=>$('bsBox').style.display+' '+$('bsCard').innerText.replace(/\n+/g,' / ')));
  await p.evaluate(()=>document.querySelector('#bsCard .bsO').click());await p.waitForTimeout(800);await p.evaluate(()=>{const b=document.querySelectorAll('#bsCard .bsO');if(b[1])b[1].click();});await p.waitForTimeout(800);console.log('restored:',await p.evaluate(()=>WS.open+' '+WS.name+' '+WS.parts.length+' parts'));
  await p.screenshot({path:'ed.png'});console.log('errors:',errs.slice(0,5));await b.close();})();
