const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(async()=>{const j=await (await fetch('/ufo.json')).json();ECO.up={mot:0,bat:0,frm:0};const out=[];
    const f=(name,mod)=>{const sp=JSON.parse(JSON.stringify(j.spec));mod(sp);const s=stats(sanitize(sp)),I=s.info;out.push(name+': '+Math.round(s.w)+'g T/W '+(s.tw||0).toFixed(2)+' top '+(s.top||0).toFixed(1)+' '+(s.mins||0).toFixed(1)+'min mah '+I.mah+' n '+I.n+' tough '+s.tough+' why='+s.why+' fc '+(s.fc&&s.fc.ok));};
    const wire=sp=>{sp.parts.filter(p=>p.t==='sprop').forEach(p=>sp.wires.push(['pmvr72kzeb6ox',p.id]));};
    const bats=(sp,keep)=>{const big=['pmvr701hm962g','pmvr702u8a2c9'];sp.parts=sp.parts.filter(p=>!(big.includes(p.id)&&!keep.includes(p.id)));sp.wires=sp.wires.filter(w=>sp.parts.some(p=>p.id===w[1]));};
    f('as is',sp=>{});f('wired',wire);
    f('wired, 1 small LiPo',sp=>{wire(sp);bats(sp,[]);});
    f('wired, small + HV 12x8 thin',sp=>{wire(sp);const b=sp.parts.find(p=>p.id==='pmvr701hm962g');Object.assign(b,{len:12,w:8,sq:0.5});bats(sp,['pmvr701hm962g']);});
    f('wired, HV 12x8 thin only',sp=>{wire(sp);const b=sp.parts.find(p=>p.id==='pmvr701hm962g');Object.assign(b,{len:12,w:8,sq:0.5});bats(sp,['pmvr701hm962g']);sp.parts=sp.parts.filter(p=>p.id!=='pmvr7012085v4');sp.wires=sp.wires.filter(w=>w[1]!=='pmvr7012085v4');});
    f('wired, HV 14x10 thin only',sp=>{wire(sp);const b=sp.parts.find(p=>p.id==='pmvr701hm962g');Object.assign(b,{len:14,w:10,sq:0.5});bats(sp,['pmvr701hm962g']);sp.parts=sp.parts.filter(p=>p.id!=='pmvr7012085v4');sp.wires=sp.wires.filter(w=>w[1]!=='pmvr7012085v4');});
    return out.join('\n');}));
});
