const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const f of process.argv.slice(2)){let err='';p.removeAllListeners('pageerror');p.on('pageerror',e=>err+=e.message+' | ');
 await p.route('**/*.js',r=>r.fulfill({body:'window.THREE=window.THREE||{};',contentType:'text/javascript'}));
 await p.goto('http://127.0.0.1:8765/'+f,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1500);console.log(f,err.slice(0,200));}
await b.close();})();
