const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  await ev(()=>{__wds.setCam('FPV');const base=new V3(MEADOW.x0+5,0,0);D.pos.set(base.x,H(base.x,0)+6,0);D.yaw=-Math.PI/2;
    [[25,'Gizmo'],[70,'Ace'],[150,'Blaze']].forEach(([d,n],i)=>{const p=[base.x+d,H(base.x+d,(i-1)*8)+6,(i-1)*8];const id='tg'+i;mpRecv({id,n:'🤖 '+n,t:'sp',spec:aiSpec2(i,'drone'),rad:0.5,col:'#ff0'});setInterval(()=>mpRecv({id,n:'🤖 '+n,t:'s',p,r:[0,0,0,1],v:[0,0,0],st:'flying',a:1,sp:60}),50);});});
  await A.waitForTimeout(2500);await A.screenshot({path:'tags.png'});});
