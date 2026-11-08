const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>startGame('free'));await P.waitForTimeout(800);
console.log(await P.evaluate(()=>{const o=[];for(const m of ['CINE','NORMAL','SPORT']){setSpeed(m);D.pos.set(0,H(0,0)+40,0);D.vel.set(0,0,0);D.state='flying';D.armed=true;D.yaw=0;let top=0,climb=0,t90=null;
 for(let i=0;i<600;i++){const inp={lx:0,ly:0,rx:0,ry:1};Object.assign(rawIn,inp);tickDrone(1/60,inp);D.pos.y=Math.max(D.pos.y,H(D.pos.x,D.pos.z)+30);const sp=Math.hypot(D.vel.x,D.vel.z);top=Math.max(top,sp);}
 D.vel.set(0,0,0);for(let i=0;i<180;i++){const inp={lx:0,ly:1,rx:0,ry:0};Object.assign(rawIn,inp);tickDrone(1/60,inp);climb=Math.max(climb,D.vel.y);}
 // stop distance from top speed
 for(let i=0;i<300;i++){const inp={lx:0,ly:0,rx:0,ry:1};tickDrone(1/60,inp);}const p0=D.pos.clone();let ts=0;for(let i=0;i<600;i++){tickDrone(1/60,{lx:0,ly:0,rx:0,ry:0});if(Math.hypot(D.vel.x,D.vel.z)<0.3){ts=i/60;break;}}
 o.push(m+': top '+top.toFixed(1)+' m/s ('+Math.round(top*3.6)+' km/h)  climb '+climb.toFixed(1)+' m/s  stop in '+ts.toFixed(1)+'s over '+Math.hypot(D.pos.x-p0.x,D.pos.z-p0.z).toFixed(1)+' m');}return o.join('\n');}));});
