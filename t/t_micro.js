const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  console.log(await ev(()=>{ECO.up={mot:0,bat:0,frm:0};const out=[];
    const mk=(o)=>{const P=[{t:'body',x:0,y:0,h:0,w:2.4,len:3.2,col:'#ff2d55',id:'b'}];const L=o.arm||3.4;
      [45,135,225,315].forEach((a,i)=>{P.push({t:'arm',x:0,y:0,h:0,a,len:L,w:0.6,col:'#222222',id:'a'+i});const tx=Math.sin(a*Math.PI/180)*L,ty=-Math.cos(a*Math.PI/180)*L;P.push({t:'motor',x:+tx.toFixed(2),y:+ty.toFixed(2),h:o.mh||0.6,r:o.r||2,pow:o.pow||6,blades:o.bl||4,col:'#64d2ff',id:'m'+i});if(o.duct)P.push({t:'guard',x:+tx.toFixed(2),y:+ty.toFixed(2),h:o.gh||1.6,r:(o.r||2)*1.12,col:'#ff2d55',id:'g'+i});});
      P.push({t:'battery',x:0,y:0.4,h:-1.4,len:o.bl2||2.6,w:o.bw||1.3,bt:'HV LiPo',sq:0.6,id:'bat'});P.push({t:'board',x:0,y:0,h:1.9,style:'f4',id:'fc'});P.push({t:'rx',x:0,y:1.1,h:2.3,id:'rx'});P.push({t:'camera',style:'fpv',x:0,y:-1.6,h:2.4,nm:'FPV',id:'cam'});
      const W=[['fc','m0'],['fc','m1'],['fc','m2'],['fc','m3'],['fc','bat'],['fc','rx'],['fc','cam']];return{name:'Micro whoop',flyAs:'auto',assist:true,parts:P,wires:W};};
    const f=(n,o)=>{const sp=sanitize(mk(o)),s=stats(sp),c=connectedParts(sp.parts);out.push(n+': '+Math.round(s.w)+'g T/W '+(s.tw||0).toFixed(1)+' top '+(s.top||0).toFixed(1)+' '+(s.mins||0).toFixed(1)+'min tough '+s.tough+' why='+s.why+' conn '+c.size+'/'+sp.parts.length+' n '+s.info.n+' strikes '+s.info.strikes.length+' fc '+(s.fc&&s.fc.ok));};
    f('base',{});f('ducted',{duct:true});f('ducted pow8',{duct:true,pow:8});f('ducted pow8 bat3x1.5',{duct:true,pow:8,bl2:3,bw:1.5});
    f('final',{arm:4.5,duct:true,mh:1,bl2:3.2,bw:1.6});const FS=sanitize(mk({arm:4.5,duct:true,mh:1,bl2:3.2,bw:1.6}));window.__final=FS;useSpec(FS);takeoff();f('arm4.5 ducted mh1',{arm:4.5,duct:true,mh:1});f('arm5 duct',{arm:5,duct:true});const sp=sanitize(mk({arm:4.5,duct:true}));out.push(JSON.stringify(propStrikes(sp.parts,connectedParts(sp.parts)).map(k=>sp.parts[k.i].id+'x'+sp.parts[k.j].id)));return out.join('\n');}));
  await A.waitForTimeout(3000);console.log(await ev(()=>{__wds.step({ly:1},2);__wds.step({ry:1},3);return D.state+' h '+(D.pos.y-groundY(D.pos.x,D.pos.z)).toFixed(1)+' hs '+Math.hypot(D.vel.x,D.vel.z).toFixed(1);}));
  const j=await ev(()=>JSON.stringify({type:'woods-drone',v:2,spec:window.__final},null,1));require('fs').writeFileSync('/mnt/user-data/outputs/Micro-whoop.drone.json',j);
  await ev(()=>{__wds.setCam('CHASE');});await A.waitForTimeout(1500);await A.screenshot({path:'micro.png'});await ev(()=>openWorkshop(true));await A.waitForTimeout(1500);await A.screenshot({path:'micro_ws.png'});
});
