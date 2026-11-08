const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
console.log(await P.evaluate(()=>{const o=[];const f=v=>v.toFixed(1);
 const run=(pre,inpF,sec)=>{useSpec(JSON.parse(JSON.stringify(eval(pre))));D.pos.set(LAKE.x,WATER_Y,LAKE.z);D.vel.set(0,0,0);D.yaw=0;D.state='landed';D.armed=true;const L=[];for(let i=0;i<sec*60;i++){const inp=inpF(i/60);Object.assign(rawIn,inp);tickDrone(1/60,inp);if(i%30===0)L.push({t:i/60,sp:Math.hypot(D.vel.x,D.vel.z),y:D.pos.y-WATER_Y,yaw:D.yaw,st:D.state});}return L;};
 for(const b of ['VPRESETS.boat.speed','VPRESETS.boat.sub']){const L=run(b,t=>t<2.5?{lx:0,ly:1,rx:0,ry:0}:t<5.5?{lx:0,ly:0,rx:0,ry:0}:{lx:0,ly:0.7,rx:0.8,ry:0},10);const at=t=>L.find(e=>e.t>=t)||L[L.length-1];
  const p1=at(7),p2=at(9);const dy=Math.abs(p2.yaw-p1.yaw);o.push('LAKE r '+LAKE.r+' '+b+': '+f(at(1).sp)+'@1 '+f(at(3).sp)+'@3 '+f(at(2.5).sp)+'@2.5 | coast3s '+f(at(5.5).sp)+' | turn r~'+(dy>0.05?f(p1.sp*2/dy):'∞')+'m | depth '+f(at(5).y)+' st '+at(11).st);}
 return o.join('\n');}));});
