// screenshot tour on a phone: walking, sub underwater, battle, death, menu deep pages, weapons menu
const {chromium,devices}=require('playwright');const DEV=process.env.DEV||'iPhone 15 Pro';(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext(devices[DEV]);await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));await p.goto('http://127.0.0.1:8765/woods-rc-sim.html');await p.waitForTimeout(3000);
await p.evaluate(()=>{startGame('free');aiSet(2);});await p.waitForTimeout(2000);const tag=DEV.includes('landscape')?'L':'P';let n=0;const sh=async(l,fn,wait)=>{await p.evaluate(fn);await p.waitForTimeout(wait||1800);n++;await p.screenshot({path:'tour'+tag+n+'.png'});console.log(n,l);};
await sh('walking',()=>{walkToggle(true);});
await sh('sub underwater',()=>{walkToggle(false);useSpec(JSON.parse(JSON.stringify(VPRESETS.boat.sub)));D.pos.set(LAKE.x,WATER_Y-4,LAKE.z);D.state='flying';D.armed=true;},2500);
await sh('battle',()=>{useSpec(JSON.parse(JSON.stringify(PRESETS.mini||SPEC)));D.pos.set(PAD.x,H(PAD.x,PAD.z)+8,PAD.z);D.state='flying';DZ.on=true;DZ.ai=true;shotMode='gun';updBadge&&updBadge();});
await sh('blown up',()=>{DZ.dead=performance.now()+10000;},1200);
await sh('weapons menu',()=>{DZ.dead=0;menuToggle(true);const c=MCAT.find(c=>c[0]==='war');menuPush(c[1],mCatItems('war'));renderMenu();});
await sh('settings menu',()=>{menuBack();const c=MCAT.find(c=>c[0]==='set');menuPush(c[1],mCatItems('set'));renderMenu();});
console.log('errors',errs);await b.close();})();
