// MONKEY test: taps random visible buttons/inputs for N steps on a device, logs page errors + what was tapped right before.
const {chromium,devices}=require('playwright');const DEV=process.env.DEV||'iPhone 15 Pro';const N=+(process.env.N||400);const SEED=+(process.env.SEED||1);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const ctx=await b.newContext(DEV==='pc'?{viewport:{width:1280,height:720}}:devices[DEV]);
 await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});const p=await ctx.newPage();const errs=[];let last='';
 p.on('pageerror',e=>errs.push(last+' ⇒ '+e.message.slice(0,160)));p.on('dialog',d=>d.dismiss().catch(()=>{}));
 await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
 await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);await p.evaluate((vr)=>{startGame('free');aiSet(2);if(vr)toggleVR();},!!process.env.VR);await p.waitForTimeout(1500);
 let s=SEED;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};
 for(let i=0;i<N;i++){const info=await p.evaluate(r=>{const els=[...document.querySelectorAll('button,[onclick],input[type=range],input[type=checkbox],select,.mItem,.tile')].filter(e=>{const b=e.getBoundingClientRect();if(b.width<4||b.height<4||b.bottom<0||b.top>innerHeight)return false;const st=getComputedStyle(e);return st.visibility!=='hidden'&&st.display!=='none'&&!/close|exit|reload|reset all|delete|clear all|leave/i.test(e.textContent||'');});
   if(!els.length)return null;const e=els[Math.floor(r*els.length)];const b=e.getBoundingClientRect();const lab=(e.id||'')+':'+(e.textContent||e.title||e.type||'').trim().slice(0,30);
   if(e.tagName==='INPUT'&&e.type==='range'){e.value=e.min&&e.max?(+e.min+(+e.max-+e.min)*Math.random()):50;e.oninput&&e.oninput({target:e});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return {lab:'range '+lab};}
   if(e.tagName==='SELECT'){e.selectedIndex=Math.floor(Math.random()*e.options.length);e.dispatchEvent(new Event('change',{bubbles:true}));return {lab:'select '+lab};}
   return {lab,x:b.left+b.width/2,y:b.top+b.height/2};},rnd());
  if(!info){await p.evaluate(()=>{try{menuToggle(true);}catch(e){}});continue;}last=i+' '+info.lab;
  if(info.x!=null){try{await p.mouse.click(info.x,info.y);}catch(e){}}
  await p.waitForTimeout(120);
  if(i%60===59){const bad=await p.evaluate(()=>{const P=WALK.on?WALK.pos:D.pos;return [P.x,P.y,P.z].some(v=>!isFinite(v))?'NaN pos':'';});if(bad)errs.push(i+' '+bad);}}
 const st=await p.evaluate(()=>({pr:renderer.info.programs.length,ch:scene.children.length}));console.log(DEV,'seed',SEED,'steps',N,'programs',st.pr,'scene',st.ch);console.log('errors:',errs.length?[...new Set(errs)].slice(0,12).join('\n'):'none');await p.screenshot({path:'monkey_'+SEED+'.png'});await b.close();})();
