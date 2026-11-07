const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(5);D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+8;});await P.waitForTimeout(5000);
  await P.evaluate(()=>{window._cb={};const s0=THREE.BufferGeometry.prototype.setAttribute;THREE.BufferGeometry.prototype.setAttribute=function(n){if(n==='position'){Error.stackTraceLimit=60;const st=(new Error().stack||'').split('\n').filter(s=>/woods-rc-sim/.test(s)).slice(0,4).map(s=>s.trim().replace(/https?:\/\/[^ ]*woods-rc-sim.html:/,'L')).join(' < ');_cb[st]=(_cb[st]||0)+1;}return s0.apply(this,arguments);};});
  await P.waitForTimeout(40000);console.log(await P.evaluate(()=>Object.entries(_cb).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>v+'  '+k).join('\n')));
});
