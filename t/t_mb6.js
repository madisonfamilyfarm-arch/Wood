const H=require('./harness');const fs=require('fs');const J=JSON.parse(fs.readFileSync(process.argv[2]||'mybuild6.json'));
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);
  const ev=(f,x)=>A.evaluate(f,x);await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await ev(j=>{useSpec(sanitize(j.spec));__wds.setCam('CHASE');return JSON.stringify({w:ST.mass,thr:ST.thrust,tw:ST.tw,rad:ST.rad,hov:ST.hover,flyAs:SPEC.flyAs,kind:vkind(),motors:DR.props.length,warn:ST.warn||ST.issues});},J));
  console.log(await ev(()=>{const o={};for(const k in ST){const v=ST[k];if(typeof v==='number'||typeof v==='string'||typeof v==='boolean')o[k]=typeof v==='number'?+v.toFixed(3):v;}return JSON.stringify(o).slice(0,1500);}));
  await ev(()=>{takeoff();});await A.waitForTimeout(3000);await ev(()=>{keys.ShiftLeft=true;keys.Space=true;});await A.waitForTimeout(3000);await ev(()=>{keys.ShiftLeft=false;keys.Space=false;});console.log('after climb',await ev(()=>D.state+' alt '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)+' yaw '+D.yaw.toFixed(2)));
  for(let i=0;i<5;i++){await ev(()=>{keys.KeyW=true;});await A.waitForTimeout(1000);console.log(await ev(()=>D.state+' y '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)+' v '+D.vel.length().toFixed(1)+' pitch '+D.pitch.toFixed(2)+' roll '+D.roll.toFixed(2)+' yaw '+D.yaw.toFixed(2)+' bat '+(D.bat!=null?D.bat.toFixed?D.bat.toFixed(2):D.bat:'')));}
  await ev(()=>{keys.KeyW=false;});await A.screenshot({path:'mb6.png'});
  console.log('toasts',await ev(()=>(window.__toasts||[]).slice(-5).join(' | ')));
});
