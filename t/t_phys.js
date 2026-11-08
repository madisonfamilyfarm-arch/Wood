const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  const V=[['drone (Mini 4)',null],['heli scale','VPRESETS.heli.scale'],['heli stunt','VPRESETS.heli.stunt'],['plane trainer','VPRESETS.plane.trainer'],['plane jet','VPRESETS.plane.jet'],['car rally','VPRESETS.car.rally'],['car buggy','VPRESETS.car.buggy'],['monster','VPRESETS.car.monster'],['tank','VPRESETS.car.tank'],['crawler','VPRESETS.car.crawler'],['boat speed','VPRESETS.boat.speed'],['sub','VPRESETS.boat.sub']];
  for(const [n,pre] of V){const r=await P.evaluate(([n,pre])=>{try{const sp=pre?JSON.parse(JSON.stringify(eval(pre))):null;if(sp)useSpec(sp);else useSpec(JSON.parse(JSON.stringify(SPEC)));
      const k=vkind();let start;if(k==='boat'){start=new V3(LAKE.x,WATER_Y,LAKE.z);}else if(k==='car'){start=new V3(PAD.x+40,0,PAD.z+40);start.y=H(start.x,start.z)+0.3;}else start=new V3(PAD.x,H(PAD.x,PAD.z)+0.2,PAD.z);
      D.pos.copy(start);D.vel.set(0,0,0);D.yaw=0;D.armed=true;D.state=k==='car'||k==='boat'?'flying':'landed';
      const run=(inp,sec)=>{let top=0,climb=0;const y0=D.pos.y;for(let i=0;i<sec*60;i++){tickDrone(1/60,inp);const hs=Math.hypot(D.vel.x,D.vel.z);if(hs>top)top=hs;}return{top,dy:D.pos.y-y0};};
      const air=k==='drone'||k==='heli'||k==='plane';
      // 1) full power forward 10 s
      const fwd=air?(k==='plane'?{lx:0,ly:1,rx:0,ry:0.15}:{lx:0,ly:0.3,rx:0,ry:1}):{lx:0,ly:1,rx:0,ry:1};
      if(k==='drone'||k==='heli'){run({lx:0,ly:1,rx:0,ry:0},2.5);}
      const a=run(fwd,10);const tsp=a.top;
      // 2) turn rate at speed
      const y0=D.yaw;run(air?(k==='plane'?{lx:0,ly:1,rx:1,ry:0.3}:{lx:1,ly:0.3,rx:0,ry:0.6}):{lx:1,ly:1,rx:1,ry:1},2);const turn=Math.abs(D.yaw-y0)/2*57.3;
      // 3) let go: how far to stop
      const p0=D.pos.clone();const b=run({lx:0,ly:k==='drone'||k==='heli'?0:0,rx:0,ry:0},4);const coast=Math.hypot(D.pos.x-p0.x,D.pos.z-p0.z);const left=Math.hypot(D.vel.x,D.vel.z);
      const gy=H(D.pos.x,D.pos.z);return n.padEnd(14)+' top '+(tsp).toFixed(1)+' m/s ('+(tsp*2.237).toFixed(0)+' mph)  turn '+turn.toFixed(0)+'°/s  coast '+coast.toFixed(0)+' m, still '+left.toFixed(1)+' m/s  alt '+(D.pos.y-gy).toFixed(1)+' state '+D.state+(isFinite(D.pos.x)?'':' NaN!');}catch(e){return n+' ERR '+e.message;}},[n,pre]);console.log(r);}
});
