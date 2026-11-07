const H=require('./harness');const fs=require('fs');const J=JSON.parse(fs.readFileSync(process.argv[2]));
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1200);await ev(j=>{useSpec(sanitize(j.spec));__wds.setCam('CHASE');takeoff();},J);await A.waitForTimeout(3500);
  await ev(()=>{window.__s=[];window.__iv=setInterval(()=>__s.push([D.roll,D.pitch]),50);});await A.waitForTimeout(4000);
  console.log('hover wobble',await ev(()=>{clearInterval(__iv);const r=__s.map(x=>x[0]),p=__s.map(x=>x[1]);const sd=a=>{const m=a.reduce((s,v)=>s+v,0)/a.length;return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length).toFixed(4);};return 'roll sd '+sd(r)+' pitch sd '+sd(p)+' n '+__s.length+' state '+D.state;}));
  await ev(()=>{keys.KeyW=true;});await A.waitForTimeout(5000);console.log('fwd',await ev(()=>'speed '+Math.hypot(D.vel.x,D.vel.z).toFixed(1)+' alt '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)+' '+D.state));await ev(()=>{keys.KeyW=false;});await A.screenshot({path:'giant.png'});
});
