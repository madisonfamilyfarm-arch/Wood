const H=require('./harness');const {devices}=require('playwright');
H(async({b})=>{for(const [nm,vp] of [['portrait',{width:393,height:852}],['landscape',{width:852,height:393}]]){
 const ctx=await b.newContext({viewport:vp,isMobile:true,hasTouch:true,deviceScaleFactor:1});const P=await ctx.newPage();
 for(const f of ['three.min.js','GLTFLoader.js','SkeletonUtils.js','GLTFExporter.js'])await P.route('**/'+f,r=>r.fulfill({path:__dirname+'/node_modules/three/'+(f==='three.min.js'?'build/':f==='GLTFLoader.js'?'examples/js/loaders/':f==='SkeletonUtils.js'?'examples/js/utils/':'examples/js/exporters/')+f,contentType:'text/javascript'}));
 P.on('pageerror',e=>console.log('PAGEERR',e.message));
 await P.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded',timeout:150000});await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
 for(const mode of ['free','kit']){
  await P.evaluate(m=>{if(m==='free')openWorkshop(false);else bsOpen(Object.keys(KITS)[0],null);},mode);await P.waitForTimeout(1500);
  const info=async()=>P.evaluate(()=>{const o={};for(const id of ['wsUndo','wsRedo']){const e=$(id);if(!e){o[id]='missing';continue;}const r=e.getBoundingClientRect();const top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);o[id]=Math.round(r.x)+','+Math.round(r.y)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' vis='+(r.width>0&&getComputedStyle(e).visibility!=='hidden')+' top='+(top===e?'self':(top?top.id||top.className||top.tagName:'none'));}o.u=HIST.u.length;o.parts=WS.parts.length;o.ez=!!(window.EZB&&EZB.on);return o;});
  console.log(nm,mode,'start',JSON.stringify(await info()));
  // tap a tray part then tap the canvas center to place (like a phone user)
  const tray=await P.evaluate(()=>{const e=document.querySelector('#wsTray .wsPart');if(!e)return null;e.scrollIntoView();const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});
  const mid=await P.evaluate(()=>{const r=$('wsMid').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height*0.6];});
  if(tray){// drag tray part to middle
   await P.mouse.move(tray[0],tray[1]);await P.mouse.down();for(let i=1;i<=10;i++){await P.mouse.move(tray[0]+(mid[0]-tray[0])*i/10,tray[1]+(mid[1]-tray[1])*i/10);await P.waitForTimeout(30);}await P.mouse.up();await P.waitForTimeout(800);}
  console.log(nm,mode,'after drop',JSON.stringify(await info()));
  // tap the Undo button for real
  const ub=await P.evaluate(()=>{const r=$('wsUndo').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});
  await P.touchscreen.tap(ub[0],ub[1]);await P.waitForTimeout(800);
  console.log(nm,mode,'after undo tap',JSON.stringify(await info()));
  const rb=await P.evaluate(()=>{const r=$('wsRedo').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2];});
  await P.touchscreen.tap(rb[0],rb[1]);await P.waitForTimeout(800);
  console.log(nm,mode,'after redo tap',JSON.stringify(await info()));
  await P.screenshot({path:'/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/ws_'+nm+'_'+mode+'.png'});
  await P.evaluate(()=>{try{bsClose&&bsClose();}catch(e){}try{closeWorkshop();}catch(e){}});await P.waitForTimeout(600);}
 await ctx.close();}});
