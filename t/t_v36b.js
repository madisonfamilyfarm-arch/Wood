const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(3);DZ.on=false;});await P.waitForTimeout(3000);
  console.log(await P.evaluate(async()=>{const B=AIB.L[0];D.state='flying';D.pos.set(B.p.x,B.p.y+8,B.p.z);tntDrop();const T=TNTS[0];let f=0;const c=()=>{f++;requestAnimationFrame(c)};c();await new Promise(r=>setTimeout(r,2500));return 'frames '+f+' t '+(T&&T.t)+' y '+(T&&T.p.y.toFixed(1))+' pause '+SIM.pause+' FIRE '+!!FIRE.g+'/'+FIRE.on;}));
  console.log(await P.evaluate(()=>{let n=0;const r0=renderMenu;renderMenu=function(){n++;return r0.apply(this,arguments);};menuToggle(true);menuPush('x',exItems());return new Promise(r=>setTimeout(()=>r('renders in 3s '+n),3000));}));
});
