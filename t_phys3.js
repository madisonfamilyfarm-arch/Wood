const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
console.log(await P.evaluate((YAW)=>{const o=[];const a=aiPlaces().find(p=>/airfield/.test(p.n));
 const run=(pre,inpF,sec,place)=>{useSpec(JSON.parse(JSON.stringify(eval(pre))));place();D.armed=true;const L=[];for(let i=0;i<sec*60;i++){const inp=inpF(i/60);Object.assign(rawIn,{lx:inp.lx,ly:inp.ly,rx:inp.rx,ry:inp.ry});tickDrone(1/60,inp);if(i%30===0)L.push({t:i/60,sp:Math.hypot(D.vel.x,D.vel.z),y:D.pos.y-H(D.pos.x,D.pos.z),vy:D.vel.y,yaw:D.yaw,x:D.pos.x,z:D.pos.z,st:D.state});}return L;};
 const rwPlace=()=>{D.pos.set(a.x,H(a.x,a.z)+0.3,a.z);D.vel.set(0,0,0);D.yaw=YAW;D.state='landed';};
 const f=v=>v.toFixed(1);
 for(const c of ['VPRESETS.car.rally','VPRESETS.car.tank']){
  const L=run(c,t=>t<4?{lx:0,ly:1,rx:0,ry:0}:t<7?{lx:0,ly:0,rx:0,ry:0}:{lx:0,ly:0.6,rx:0.7,ry:0},12,rwPlace);
  const at=t=>L.find(e=>e.t>=t)||L[L.length-1];
  // turn radius from last 3s: arc length / heading change
  const p1=at(9),p2=at(11.5);const dy=Math.abs(p2.yaw-p1.yaw);const r=dy>0.05?(p1.sp*2.5)/dy:0;
  o.push(L.filter((e,i)=>i%2==0).map(e=>e.t+':'+f(e.sp)+e.st[0]+'('+f(e.x)+','+f(e.z)+')').join(' '));o.push(c+': 0→ '+f(at(1).sp)+'@1s '+f(at(2).sp)+'@2s '+f(at(4).sp)+'@4s | coast 3s → '+f(at(7).sp)+' | turn radius ~'+f(r)+'m  alt '+f(at(11.5).y));}
 for(const h of ['VPRESETS.heli.scale','VPRESETS.heli.stunt']){
  const L=run(h,t=>t<3?{lx:0,ly:1,rx:0,ry:0}:t<6?{lx:0,ly:0,rx:0,ry:0}:{lx:0,ly:0,rx:0,ry:1},10,rwPlace);
  const at=t=>L.find(e=>e.t>=t)||L[L.length-1];
  o.push(h+': alt '+f(at(1).y)+'@1 '+f(at(3).y)+'@3 | stick centered 3s: alt '+f(at(4).y)+'→'+f(at(6).y)+' vy '+f(at(6).vy)+' | forward 4s speed '+f(at(10).sp)+' state '+at(10).st);}
 return o.join('\n');},+(process.env.YAW||0)));});
