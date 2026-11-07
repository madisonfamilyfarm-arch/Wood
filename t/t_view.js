const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:512,height:512}});
p.on('console',m=>console.log('c',m.text()));
const fs=require('fs');for(const f of fs.readdirSync(__dirname+'/view').filter(f=>f.endsWith('.glb'))){await p.goto('file://'+__dirname+'/view/view.html');console.log(f,await p.evaluate(f=>show(f),f));await p.screenshot({path:__dirname+'/view/'+f+'.png'});}
await b.close();})();
