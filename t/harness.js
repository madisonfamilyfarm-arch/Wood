// usage: node harness.js script.js  -> exports helpers to script
const {chromium}=require('playwright');
const path=require('path');
module.exports=async function(fn,opts={}){
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl']});
  const mk=async(name,url,vp)=>{const ctx=await b.newContext({viewport:vp||{width:1100,height:650}});if(process.env.FAST)await ctx.addInitScript(()=>{try{const c=JSON.parse(localStorage.getItem('wds_cfg')||'{}');c.look='fast';localStorage.setItem('wds_cfg',JSON.stringify(c));}catch(e){}});else await ctx.addInitScript(()=>{try{const c=JSON.parse(localStorage.getItem('wds_cfg')||'{}');delete c.look;localStorage.setItem('wds_cfg',JSON.stringify(c));}catch(e){}});const p=await ctx.newPage();p.setDefaultTimeout(150000);
    await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
    await p.route('**/GLTFLoader.js',r=>r.fulfill({path:__dirname+'/node_modules/three/examples/js/loaders/GLTFLoader.js',contentType:'text/javascript'}));
    await p.route('**/SkeletonUtils.js',r=>r.fulfill({path:__dirname+'/node_modules/three/examples/js/utils/SkeletonUtils.js',contentType:'text/javascript'}));
    await p.route('**/GLTFExporter.js',r=>r.fulfill({path:__dirname+'/node_modules/three/examples/js/exporters/GLTFExporter.js',contentType:'text/javascript'}));
    p.on('pageerror',e=>console.log('['+name+'] PAGEERR',e.message,e.stack&&e.stack.split('\n')[1]));
    p.on('console',m=>{if(m.type()==='error')console.log('['+name+'] console.error',m.text().slice(0,300));});
    await p.goto(url||'http://127.0.0.1:8765/',{timeout:150000,waitUntil:'domcontentloaded'});return p;};
  try{await fn({b,mk});}catch(e){console.log('TEST ERROR',e);}finally{await b.close();}
};
