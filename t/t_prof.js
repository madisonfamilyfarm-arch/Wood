const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(5);D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+8;});await P.waitForTimeout(3000);
  // play a bit: a few explosions + TNT so things "build up"
  await P.evaluate(async()=>{for(let i=0;i<8;i++){explode(D.pos.clone().add(new V3(20+i*5,0,10)),6,3,true,'me',mp.id);TNT.kind='classic';tntDrop();await new Promise(r=>setTimeout(r,400));}});
  const cdp=await P.context().newCDPSession(P);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:500});await cdp.send('Profiler.start');
  await P.waitForTimeout(12000);
  const {profile}=await cdp.send('Profiler.stop');
  const self={},byId={};profile.nodes.forEach(n=>byId[n.id]=n);const dt=profile.timeDeltas;const cnt={};profile.samples.forEach((id,i)=>{cnt[id]=(cnt[id]||0)+(dt[i]||0);});
  for(const id in cnt){const n=byId[id];const k=(n.callFrame.functionName||'(anon)')+' :'+n.callFrame.lineNumber+':'+n.callFrame.columnNumber;self[k]=(self[k]||0)+cnt[id];}
  const tot=Object.values(self).reduce((a,b)=>a+b,0);console.log('total ms',Math.round(tot/1000));
  Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,30).forEach(([k,v])=>console.log((v/1000).toFixed(0).padStart(6),'ms',(100*v/tot).toFixed(1)+'%',k));
  console.log(await P.evaluate(()=>'FXB '+FXB.length+' BIG '+BIG.L.length+' scorch '+BIG.scorch.length+' craters '+CRATERS.length+' scene children '+scene.children.length+' shots '+shots.length+' puffs? '+(typeof PUFFS!=='undefined'?PUFFS.length:'-')));
});
