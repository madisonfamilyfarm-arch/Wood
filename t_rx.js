const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(3);await new Promise(r=>setTimeout(r,3000));const o=[];const c0=chatAdd;chatAdd=function(n,t){if(/🤖/.test(n))o.push(n+': '+t);return c0.apply(this,arguments);};const w=ms=>new Promise(r=>setTimeout(r,ms));
 D.state='flying';D.armed=true;await w(1500);o.push('-- crash');D.state='down';await w(3500);quickFix(false);
 o.push('-- award inverted');PB.ev=0;award('🙃 Inverted flying!',2);await w(3500);
 o.push('-- tank');PB.ev=0;useSpec(JSON.parse(JSON.stringify(VPRESETS.car.tank)));await w(3500);
 o.push('-- high');PB.ev=0;useSpec(JSON.parse(JSON.stringify(SPEC)));D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+120;await w(3500);
 return o.join('\n');}));});
