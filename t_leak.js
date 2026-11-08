// finds GPU leaks: things removed from the scene whose geometry/material is never disposed (and not used anywhere else). Groups by where they were removed.
const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
await P.evaluate(()=>{startGame('free');aiSet(4);DZ.on=true;DZ.ai=true;D.armed=true;D.state='flying';D.pos.y+=15;window.__rm=[];
 const disposed=new WeakSet();const d0=THREE.BufferGeometry.prototype.dispose;THREE.BufferGeometry.prototype.dispose=function(){disposed.add(this);return d0.apply(this,arguments);};window.__disp=disposed;
 const r0=THREE.Object3D.prototype.remove;THREE.Object3D.prototype.remove=function(...objs){for(const o of objs){if(!o)continue;const st=(new Error().stack||'').split('\n').slice(2,5).map(l=>l.trim().replace(/\(?http[^)]*:(\d+):\d+\)?/,'@$1')).join(' < ');o.traverse&&o.traverse(m=>{if(m.geometry&&!m.isInstancedMesh)__rm.push({g:m.geometry,st});});}return r0.apply(this,objs);};});
const g0=await P.evaluate(()=>renderer.info.memory.geometries);
await P.evaluate(async()=>{for(let i=0;i<40;i++){const p=D.pos.clone().add(new V3((Math.random()-0.5)*60,-10,(Math.random()-0.5)*60));try{explode(p,3+Math.random()*10,2,true,'me',mp.id);}catch(e){}try{if(i%3==0){D.shield=performance.now()+1e5;tntDrop();}}catch(e){}try{fire.last=0;fire();}catch(e){}await new Promise(r=>setTimeout(r,400));}});
await P.waitForTimeout(15000);
console.log(await P.evaluate((g0)=>{const inScene=new Set();scene.traverse(o=>{if(o.geometry)inScene.add(o.geometry);});const by={};let n=0;
  for(const r of __rm){if(__disp.has(r.g)||inScene.has(r.g))continue;if(typeof SHARED_GEO!=='undefined'&&SHARED_GEO.has(r.g))continue;if(Object.values(GEO||{}).includes(r.g))continue;n++;by[r.st]=(by[r.st]||0)+1;}
  return 'geometries '+g0+' → '+renderer.info.memory.geometries+'; removed-but-not-disposed: '+n+'\n'+Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>v+'  '+k.slice(0,230)).join('\n');},g0));});
