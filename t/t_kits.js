const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');A.on('dialog',d=>d.accept('Front cam'));await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  for(const k of ['car','monster','boat','sub','tank','plane','mix','drone']){
    console.log(k,await ev(k=>{openKit(k);const sp=wsSpec(),st=stats(sp),conn=connectedParts(sp.parts);const r=JSON.stringify({kind:st.kind||st.flyAs,combo:!!st.combo,tank:!!st.tank,sub:!!st.sub,top:st.top&&st.top.toFixed(1),why:st.why||'',conn:conn.size+'/'+sp.parts.length});closeWorkshop();return r;},k));}
  await ev(()=>{openKit('tank');});await A.waitForTimeout(1500);await A.screenshot({path:'kit_tank.png'});
  await ev(()=>{openKit('sub');});await A.waitForTimeout(1500);await A.screenshot({path:'kit_sub.png'});
  // fly the sub kit: dive
  console.log('sub fly',await ev(()=>{const sp=wsSpec();closeWorkshop();useSpec(sp);__wds.step({ly:1},3);__wds.step({ry:-1},2);return vkind()+' isSub '+isSubNow()+' depth '+(D.depth||0).toFixed(1);}));
  console.log('tank drive',await ev(()=>{openKit('tank');const sp=wsSpec();closeWorkshop();useSpec(sp);const p0=D.pos.clone();__wds.step({ly:1},3);return vkind()+' moved '+D.pos.distanceTo(p0).toFixed(1)+' skid '+ST.skid;}));
  // cameras: add 2 named
  console.log('cams',await ev(()=>{openKit('car');WS.parts.push(cleanPart({t:'camera',style:'action',x:0,y:10,h:6,a:180,nm:'Rear cam'}));wsChanged();const sp=wsSpec();closeWorkshop();useSpec(sp);const names=[];for(let i=0;i<10;i++){nextCam();names.push($('camName').textContent);}return names.join(', ');}));
  console.log('prompt test',await ev(async()=>{openWorkshop(false);WS.parts.push(cleanPart({t:'camera',style:'fpv',x:0,y:0,h:3}));wsChanged();await new Promise(r=>setTimeout(r,600));const c=WS.parts.find(p=>p.t==='camera');const n=c.nm;closeWorkshop();return n;}));
  console.log('tilt',await ev(()=>{const it=flightItems().find(i=>/FPV camera tilt/.test(i.label()));return it?it.label():'?';}));
});
