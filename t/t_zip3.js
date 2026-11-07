const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(3000);
  const r=await A.evaluate(async()=>{const j=await (await fetch('/zipper.json')).json();const out=[];ECO.up={mot:0,bat:0,frm:0};
    const f=(name,mod)=>{const sp=JSON.parse(JSON.stringify(j.spec));mod(sp);const s=stats(sanitize(sp));const conn=connectedParts(sanitize(sp).parts);out.push(name+': '+Math.round(s.w)+'g T/W '+s.tw.toFixed(1)+' top '+s.top.toFixed(1)+' m/s '+s.mins.toFixed(1)+' min tough '+s.tough+' agile '+s.agile+' conn '+conn.size+'/'+sp.parts.length+(s.why?' why='+s.why:''));};
    const base=(sp,pow,bat)=>{const b=sp.parts.filter(p=>p.t==='battery');sp.parts=sp.parts.filter(p=>p.t!=='battery'||p===b[0]);const rx=sp.parts.filter(p=>p.t==='rx');sp.parts=sp.parts.filter(p=>p.t!=='rx'||p===rx[1]);sp.parts.forEach(p=>{if(p.t==='motor')p.pow=pow;});Object.assign(b[0],bat||{});};
    f('as is',sp=>{});
    f('m8 hv 4x2.5',sp=>base(sp,8,{len:4,w:2.5}));
    f('m8 hv 5x3',sp=>base(sp,8,{len:5,w:3}));
    f('m8 hv 5x3 sq.7',sp=>base(sp,8,{len:5,w:3,sq:0.7}));
    f('m7 hv 5x3 sq.7',sp=>base(sp,7,{len:5,w:3,sq:0.7}));
    f('m8 hv 6x3 sq.6',sp=>base(sp,8,{len:6,w:3,sq:0.6}));
    f('m8 2x hv 3x2',sp=>{const b2=JSON.parse(JSON.stringify(sp.parts.filter(p=>p.t==='battery')[0]));base(sp,8);b2.id='x2';sp.parts.push(b2);});
    return out.join('\n');});
  console.log(r);
});
