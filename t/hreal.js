const {chromium}=require('playwright');
module.exports=async function(fn){
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl']});
  const mk=async(name,url,vp)=>{const ctx=await b.newContext({viewport:vp||{width:1100,height:650}});if(process.env.FAST)await ctx.addInitScript(()=>{try{const c=JSON.parse(localStorage.getItem('wds_cfg')||'{}');c.look='fast';localStorage.setItem('wds_cfg',JSON.stringify(c));}catch(e){}});else await ctx.addInitScript(()=>{try{const c=JSON.parse(localStorage.getItem('wds_cfg')||'{}');delete c.look;localStorage.setItem('wds_cfg',JSON.stringify(c));}catch(e){}});await ctx.addInitScript(()=>{try{const c=JSON.parse(localStorage.getItem('wds_cfg')||'{}');if(!c.map)c.map='earth';localStorage.setItem('wds_cfg',JSON.stringify(c));}catch(e){}});const p=await ctx.newPage();p.setDefaultTimeout(150000);
    await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
    await p.route('https://cdn.jsdelivr.net/npm/cesium@1.146.0/Build/Cesium/**',r=>{const u=r.request().url().split('Build/Cesium/')[1].split('?')[0];r.fulfill({path:__dirname+'/node_modules/cesium/Build/Cesium/'+u});});
    await p.route('https://tile.openstreetmap.org/**',r=>r.fulfill({path:__dirname+'/tile.png',contentType:'image/png'}));
    await p.route(/arcgis|nominatim|ion\.cesium|open-meteo/,r=>r.abort());
    p.on('pageerror',e=>console.log('['+name+'] PAGEERR',e.message,(e.stack||'').split('\n').slice(1,7).join(' <- ')));
    p.on('console',m=>{if(m.type()==='error')console.log('['+name+'] console.error',m.text().slice(0,200));});
    await p.addInitScript(()=>{try{localStorage.setItem('wds_cesStyle',JSON.stringify('map'));}catch(e){}});
    await p.goto(url,{timeout:150000,waitUntil:'domcontentloaded'});return p;};
  try{await fn({b,mk});}catch(e){console.log('TEST ERROR',e);}finally{await b.close();}
};
