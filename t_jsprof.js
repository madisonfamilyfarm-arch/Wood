const H=require('./harness');H(async({mk,b})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
await P.evaluate(()=>{startGame('free');aiSet(4);DZ.on=true;DZ.ai=true;D.state='flying';D.armed=true;D.pos.y+=10;});await P.waitForTimeout(3000);
const c=await P.context().newCDPSession(P);await c.send('Profiler.enable');await c.send('Profiler.setSamplingInterval',{interval:500});
await P.evaluate(()=>{window.__r0=renderer.render;renderer.render=function(){};});await c.send('Profiler.start');await P.waitForTimeout(8000);const {profile}=await c.send('Profiler.stop');
await P.evaluate(()=>{renderer.render=__r0;});
const self={};const byId={};profile.nodes.forEach(n=>byId[n.id]=n);const dt={};for(let i=0;i<profile.samples.length;i++){const id=profile.samples[i];dt[id]=(dt[id]||0)+(profile.timeDeltas[i]||0);}
for(const n of profile.nodes){const f=n.callFrame;const k=(f.functionName||'(anon)')+':'+f.lineNumber;self[k]=(self[k]||0)+(dt[n.id]||0);}
const tot=Object.values(self).reduce((a,b)=>a+b,0);console.log('total ms',Math.round(tot/1000));Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([k,v])=>console.log((v/1000).toFixed(0).padStart(6),'ms',(100*v/tot).toFixed(1)+'%',k));});
