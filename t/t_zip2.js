const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(3000);
  const r=await A.evaluate(async()=>{const j=await (await fetch('/zipper.json')).json();const out=[];
    const f=(name,mod)=>{const sp=JSON.parse(JSON.stringify(j.spec));mod(sp);const s=stats(sanitize(sp));out.push(name+': '+Math.round(s.w)+'g T/W '+s.tw.toFixed(1)+' top '+s.top.toFixed(1)+' m/s '+s.mins.toFixed(1)+' min tough '+s.tough+' agile '+s.agile);};
    f('as is',sp=>{});
    const oneBat=sp=>{const b=sp.parts.filter(p=>p.t==='battery');sp.parts=sp.parts.filter(p=>p.t!=='battery'||p===b[0]);const rx=sp.parts.filter(p=>p.t==='rx');sp.parts=sp.parts.filter(p=>p.t!=='rx'||p===rx[1]);};
    f('1 HV battery, 1 receiver',oneBat);
    f('+ motors 8',sp=>{oneBat(sp);sp.parts.forEach(p=>{if(p.t==='motor')p.pow=8;});});
    f('+ motors 10',sp=>{oneBat(sp);sp.parts.forEach(p=>{if(p.t==='motor')p.pow=10;});});
    f('+ motors 10, no guards',sp=>{oneBat(sp);sp.parts=sp.parts.filter(p=>p.t!=='guard');sp.parts.forEach(p=>{if(p.t==='motor')p.pow=10;});});
    f('+ motors 10, no guards, 2-blade props',sp=>{oneBat(sp);sp.parts=sp.parts.filter(p=>p.t!=='guard');sp.parts.forEach(p=>{if(p.t==='motor'){p.pow=10;p.blades=2;}});});
    return out.join('\n');});
  console.log(r);
});
