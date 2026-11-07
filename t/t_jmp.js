const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  await A.evaluate(()=>{useSpec(sanitize(Object.values(VPRESETS.car)[0]));});await A.waitForTimeout(1500);
  console.log(await A.evaluate(()=>{RAMPSET.steep=1.6;RAMPSET.pow=3;
    const o={id:'tj',type:'ramp',x:(MEADOW.x0+MEADOW.x1)/2,y:0,z:(MEADOW.z0+MEADOW.z1)/2,yaw:Math.PI/2,s:1,steep:1.3,pow:2,long:1};objAdd(o);const R=RAMPS.find(r=>r.obj==='tj');
    D.pos.set(R.x-R.fx*25,0,R.z-R.fz*25);D.yaw=Math.atan2(-R.fx,-R.fz);D.pos.y=groundY(D.pos.x,D.pos.z);D.vel.set(0,0,0);D.state='landed';D.armed=true;D.lock=false;const log=[];let maxY=-99,air=0;
    for(let i=0;i<60*6;i++){tickDrone(1/60,{lx:0,ly:1,rx:0,ry:0});const h=D.pos.y-H(D.pos.x,D.pos.z);if(h>maxY)maxY=h;if(D.air)air+=1/60;if(window._t0!==D.airT0){log.push('T0 '+window._t0+'->'+D.airT0+' air '+D.air+' st '+D.state+' coins '+ECO.coins+' S '+D.airS);window._t0=D.airT0;}if(i%30==0||(i>=140&&i<=156))log.push(i/60+'s '+D.pos.x.toFixed(1)+','+D.pos.z.toFixed(1)+' h'+h.toFixed(2)+' v'+Math.hypot(D.vel.x,D.vel.z).toFixed(1)+' '+D.state+(D.onRamp?' R':''));}
    return JSON.stringify(R)+'\n'+log.join('\n')+'\nmax '+maxY.toFixed(1)+' air '+air.toFixed(1)+' coins '+ECO.coins+' airS '+D.airS+' T0 '+D.airT0;}));
});
