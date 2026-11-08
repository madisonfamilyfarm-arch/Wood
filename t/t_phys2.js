const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  console.log(await P.evaluate(()=>{const o=[];const T=(pre,setup,inp,sec,label)=>{useSpec(JSON.parse(JSON.stringify(eval(pre))));setup();D.armed=true;let top=0,maxY=-1e9,st=[];const gy0=H(D.pos.x,D.pos.z);
      for(let i=0;i<sec*60;i++){tickDrone(1/60,typeof inp==='function'?inp(i/60):inp);top=Math.max(top,Math.hypot(D.vel.x,D.vel.z));maxY=Math.max(maxY,D.pos.y-H(D.pos.x,D.pos.z));if(i%60===0)st.push(D.state[0]);}
      o.push(label.padEnd(26)+' top '+top.toFixed(1)+' m/s  maxAlt '+maxY.toFixed(1)+' m  now '+D.state+'  states '+st.join(''));};
    const pad=()=>{D.pos.set(PAD.x,H(PAD.x,PAD.z)+0.2,PAD.z);D.vel.set(0,0,0);D.state='landed';};
    T('VPRESETS.heli.scale',pad,{lx:0,ly:1,rx:0,ry:0},8,'heli scale: throttle up 8s');
    T('VPRESETS.heli.stunt',pad,{lx:0,ly:1,rx:0,ry:0},8,'heli stunt: throttle up 8s');
    T('VPRESETS.heli.scale',pad,t=>t<4?{lx:0,ly:0.8,rx:0,ry:0}:{lx:0,ly:0.2,rx:0,ry:1},10,'heli scale: up then forward');
    const rw=()=>{const a=aiPlaces().find(p=>/airfield/.test(p.n));D.pos.set(a.x,H(a.x,a.z)+0.2,a.z);D.vel.set(0,0,0);D.state='landed';};
    for(const y of [0,1.57,3.14,4.71]){T('VPRESETS.plane.trainer',()=>{rw();D.yaw=y;},t=>t<5?{lx:0,ly:1,rx:0,ry:0}:{lx:0,ly:1,rx:0,ry:-0.35},12,'plane trainer yaw '+y);}
    return o.join('\n');}));
  console.log(await P.evaluate(()=>{const s=String(tickDrone);const i=s.indexOf("'heli'");return s.length+' '+s.slice(Math.max(0,i-300),i+500);}));
});
