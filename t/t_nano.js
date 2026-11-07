const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  console.log(await ev(async()=>{ECO.up={mot:0,bat:0,frm:0};const j=await (await fetch('/micro.json')).json();useSpec(sanitize(j.spec));openWorkshop(true);const out=[];
    for(let n=0;n<=6;n++){const sp=wsSpec(),s=stats(sp),I=s.info;out.push(n+': ext '+(I.ext*2).toFixed(1)+'cm '+Math.round(s.w)+'g T/W '+(s.tw||0).toFixed(1)+' top '+(s.top||0).toFixed(1)+' '+(s.mins||0).toFixed(1)+'min why='+s.why+' conn '+connectedParts(sp.parts).size+'/'+sp.parts.length+' strikes '+I.strikes.length);wsTool('shrinkAll');}
    WS.sel=0;wsTool('shrink');wsTool('expand');closeWorkshop();return out.join('\n');}));
});
