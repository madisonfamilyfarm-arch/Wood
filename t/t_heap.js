// MEMORY soak: lots of explosions, TNT, rockets, AI battle for ~3 min; tracks JS heap, geometries, textures, scene objects.
const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
await P.evaluate(()=>{startGame('free');aiSet(4);DZ.on=true;DZ.ai=true;D.armed=true;D.state='flying';D.pos.y+=15;});
const snap=()=>P.evaluate(()=>({heap:Math.round(performance.memory.usedJSHeapSize/1e6),geo:renderer.info.memory.geometries,tex:renderer.info.memory.textures,pr:renderer.info.programs.length,ch:scene.children.length,fx:(typeof FXB!=='undefined'?FXB.length:0),cr:(typeof CRATERS!=='undefined'?CRATERS.length:0)}));
const out=[];out.push('start '+JSON.stringify(await snap()));
for(let r=0;r<6;r++){await P.evaluate(async()=>{for(let i=0;i<15;i++){const p=D.pos.clone().add(new V3((Math.random()-0.5)*60,-10,(Math.random()-0.5)*60));try{explode(p,3+Math.random()*10,2,true,'me',mp.id);}catch(e){}try{if(i%3==0){D.shield=performance.now()+1e5;tntDrop&&tntDrop();}}catch(e){}try{fire.last=0;fire();}catch(e){}await new Promise(r=>setTimeout(r,500));}});
  await P.waitForTimeout(8000);try{await P.evaluate(()=>{if(window.gc)gc();});}catch(e){}out.push('round '+r+' '+JSON.stringify(await snap()));}
console.log(out.join('\n'));});
