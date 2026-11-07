const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  for(const [k,walk,d] of [['sticky',false,30],['classic',false,40],['timer',false,20],['sticky',true,25],['bouncy',false,30]]){
    console.log(k,walk?'walk':'fly',d,await P.evaluate(([k,walk,d])=>{TNT.kind=k;TNT.throwD=d;TNT.fuse=6;D.state='flying';D.armed=true;D.pos.set(PAD.x,H(PAD.x,PAD.z)+3,PAD.z);D.vel.set(0,0,0);if(walk){WALK.on=true;WALK.pos.set(PAD.x,H(PAD.x,PAD.z),PAD.z);}
      const e0=explode;let at=null;explode=function(p){at=p.clone();return e0.apply(this,arguments);};const st=(dzMe()||D.pos).clone();tntDrop();const T=TNTS[TNTS.length-1];let lp=null;for(let i=0;i<400&&TNTS.length;i++){if(TNTS.includes(T))lp=T.p.clone();tntTick(0.02);}explode=e0;TNTS.slice().forEach(x=>tntDel(x));WALK.on=false;
      const end=at||lp;return 'landed '+Math.round(Math.hypot(end.x-st.x,end.z-st.z))+' m away';},[k,walk,d]));}
});
