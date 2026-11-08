// builder USER FLOW on iPhone portrait using real taps: Menu → Build → Tank → New project → drag a part → undo/redo → Drive it. Screenshots each step.
const {chromium,devices}=require('playwright');const DEV=process.env.DEV||'iPhone 15 Pro';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext(devices[DEV]);await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
 await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));await p.waitForTimeout(1500);
 const log=[];let n=0;const shot=async(l)=>{n++;await p.waitForTimeout(700);await p.screenshot({path:'bf'+n+'.png'});log.push(n+' '+l);};
 const tap=async(re)=>{const r=await p.evaluate(src=>{const R=new RegExp(src,'i');const els=[...document.querySelectorAll('button,.mItem,.tile,[onclick],div')].filter(e=>{const b=e.getBoundingClientRect();return b.width>10&&b.height>10&&b.top<innerHeight&&b.bottom>0&&getComputedStyle(e).visibility!=='hidden'&&R.test((e.textContent||'').trim())&&e.children.length<4;});
   els.sort((a,b)=>(a.textContent||'').length-(b.textContent||'').length);const e=els[0];if(!e)return null;const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2,t:(e.textContent||'').trim().slice(0,40)};},re.source);
   if(!r){log.push('  ✗ no button /'+re.source+'/');return false;}await p.mouse.click(r.x,r.y);log.push('  tapped "'+r.t+'"');return true;};
 await tap(/^☰$/);await shot('menu');await tap(/build/);await shot('build category');await tap(/tank/);await shot('build anything');await tap(/Tank$/);await shot('tank start screen');await tap(/new/);await shot('new project');await tap(/Drag parts/);await shot('drag mode');
 // drag the first tray item onto the picture
 const d=await p.evaluate(()=>{const it=document.querySelector('#wsTray .wsPart');const mid=$('wsMid')||$('wsCan');if(!it||!mid)return null;const a=it.getBoundingClientRect(),m=mid.getBoundingClientRect();return {ax:a.left+a.width/2,ay:a.top+a.height/2,bx:m.left+m.width/2,by:m.top+m.height/2,t:it.textContent.trim().slice(0,20)};});
 if(d){await p.mouse.move(d.ax,d.ay);await p.mouse.down();for(let i=1;i<=12;i++){await p.mouse.move(d.ax+(d.bx-d.ax)*i/12,d.ay+(d.by-d.ay)*i/12);await p.waitForTimeout(30);}await p.mouse.up();log.push('  dragged "'+d.t+'"');}else log.push('  ✗ no tray item');
 await shot('after drag');const parts=()=>p.evaluate(()=>(WS.parts||(WS.spec&&WS.spec.parts)||[]).length);log.push('  parts '+await parts());
 await tap(/Undo/);log.push('  parts after undo '+await parts());await tap(/Redo/);log.push('  parts after redo '+await parts());await shot('undo/redo');
 await tap(/drive it|sail it|fly it/);await shot('drive');
 console.log(log.join('\n'));console.log('errors',errs);await b.close();})();
