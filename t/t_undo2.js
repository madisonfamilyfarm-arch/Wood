const H=require('./harness');
H(async({b})=>{const ctx=await b.newContext({viewport:{width:393,height:852},isMobile:true,hasTouch:true});const P=await ctx.newPage();
 for(const f of ['three.min.js','GLTFLoader.js','SkeletonUtils.js','GLTFExporter.js'])await P.route('**/'+f,r=>r.fulfill({path:__dirname+'/node_modules/three/'+(f==='three.min.js'?'build/':f==='GLTFLoader.js'?'examples/js/loaders/':f==='SkeletonUtils.js'?'examples/js/utils/':'examples/js/exporters/')+f,contentType:'text/javascript'}));
 P.on('pageerror',e=>console.log('PAGEERR',e.message));
 await P.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded',timeout:150000});await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');openWorkshop(false);});await P.waitForTimeout(1500);
 const st=()=>P.evaluate(()=>({u:HIST.u.length,r:HIST.r.length,sel:WS.sel,p:WS.parts.map(p=>[p.t,Math.round(p.x*10)/10,Math.round(p.y*10)/10,p.a||0].join(':')).join(' '),same:histSnap()===HIST.cur}));
 console.log('idle',JSON.stringify(await st()));await P.waitForTimeout(1500);console.log('idle2',JSON.stringify(await st()));
 // tap the part on the canvas to select, then drag it
 const c=await P.evaluate(()=>{const r=$('wsMid').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height*0.55];});
 await P.touchscreen.tap(c[0],c[1]);await P.waitForTimeout(600);console.log('tap',JSON.stringify(await st()));
 await P.mouse.move(c[0],c[1]);await P.mouse.down();for(let i=1;i<=10;i++){await P.mouse.move(c[0]+i*8,c[1]+i*3);await P.waitForTimeout(30);}await P.mouse.up();await P.waitForTimeout(800);
 console.log('drag',JSON.stringify(await st()));
 // click tool buttons by text
 for(const t of ['↻','⟳','rotate','bigger','longer']){const ok=await P.evaluate(t=>{const b=[...document.querySelectorAll('#wsTools button')].find(b=>b.textContent.includes(t)&&b.offsetParent);if(b){b.click();return b.textContent;}return null;},t);if(ok){await P.waitForTimeout(500);console.log('tool',ok,JSON.stringify(await st()));}}
 // easy sliders
 const ez=await P.evaluate(()=>{const b=[...document.querySelectorAll('#wsTools button')].find(b=>/Easy sliders/.test(b.textContent));if(b)b.click();return !!b;});await P.waitForTimeout(800);
 const sl=await P.evaluate(()=>{const s=[...document.querySelectorAll('input[type=range]')].filter(x=>x.offsetParent);return s.map(x=>x.id||x.className);});console.log('sliders',sl);
 const s1=await P.evaluate(()=>{const s=[...document.querySelectorAll('input[type=range]')].find(x=>x.offsetParent);if(!s)return null;const r=s.getBoundingClientRect();return [r.x+5,r.y+r.height/2,r.width];});
 if(s1){await P.mouse.move(s1[0],s1[1]);await P.mouse.down();for(let i=1;i<=8;i++){await P.mouse.move(s1[0]+i*s1[2]/12,s1[1]);await P.waitForTimeout(40);}await P.mouse.up();await P.waitForTimeout(800);console.log('slider',JSON.stringify(await st()));}
 // undo all
 for(let i=0;i<8;i++){await P.evaluate(()=>$('wsUndo').click());await P.waitForTimeout(300);}console.log('undone',JSON.stringify(await st()));
 await P.screenshot({path:'/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/ws_ez.png'});
});
