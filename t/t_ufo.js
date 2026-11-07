const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(async()=>{const j=await (await fetch('/ufo.json')).json();ECO.up={mot:0,bat:0,frm:0};const sp=sanitize(j.spec),s=stats(sp),I=s.info;const conn=connectedParts(sp.parts);
    return JSON.stringify({flyAs:s.flyAs,combo:s.combo,w:Math.round(s.w),tw:s.tw&&s.tw.toFixed(2),top:s.top&&s.top.toFixed(1),mins:s.mins&&s.mins.toFixed(1),tough:s.tough,why:s.why,n:I.n,mah:I.mah,hov:Math.round(I.hov),rUp:Math.round(I.rUp),rFwd:Math.round(I.rFwd),W:Math.round(I.W),T:Math.round(I.T),
      loose:(I.loose||[]).length,strikes:(I.strikes||[]).length,unconnected:sp.parts.map((p,i)=>conn.has(i)?null:p.t).filter(Boolean),elec:I.elec&&{board:I.elec.board,rx:I.elec.rx,gps:I.elec.gps,wiredMotors:sp.parts.filter(p=>p.t==='sprop').map(p=>I.elec.wired?I.elec.wired(p.id):'?')},fc:s.fc&&{ok:s.fc.ok,head:s.fc.head,alpha:s.fc.alpha,mismatch:s.fc.mismatch}});}));
});
