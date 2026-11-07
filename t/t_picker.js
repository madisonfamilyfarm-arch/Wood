const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1000,height:640}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
await p.route('**/OrbitControls.js',r=>r.fulfill({path:__dirname+'/node_modules/three/examples/js/controls/OrbitControls.js',contentType:'text/javascript'}));
await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await p.goto('file://'+__dirname+'/view/picker.html');await p.waitForTimeout(5000);
await p.click('#n6');await p.waitForTimeout(4000);await p.click('#g6');await p.click('#t11');
console.log(await p.textContent('#info'),'|',await p.textContent('#picks'));await p.screenshot({path:'picker.png'});await b.close();})();
