const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/'+process.argv[2]);
  await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(3000);
  const r=await A.evaluate(()=>new Promise(res=>{let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<4000)requestAnimationFrame(f);else res(n/4);})();}));
  console.log(process.argv[2],'fps',r,await A.evaluate(()=>JSON.stringify({calls:renderer.info.render.calls,tris:renderer.info.render.triangles,look:LOOK.on,map:typeof curMap==='function'?curMap():'-',shadow:renderer.shadowMap.enabled})));
});
