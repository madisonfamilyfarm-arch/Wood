const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');A.on('console',m=>{if(m.type()==='warning')console.log('WARN',m.text().slice(0,300));});await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(()=>{const sp={flyAs:'combo',parts:[{t:'body',w:6,len:10},{t:'battery',h:-3.2,w:3,len:6},{t:'wheel',x:-4,y:-4,h:-4,r:2,w:1},{t:'wheel',x:4,y:-4,h:-4,r:2,w:1},{t:'wheel',x:-4,y:4,h:-4,r:2,w:1},{t:'wheel',x:4,y:4,h:-4,r:2,w:1}]};useSpec(sanitize(sp));
    const o=[ST.combo,vkind(),D.state];for(let i=0;i<60;i++)tickDrone(1/60,{lx:0,ly:0,rx:0,ry:1});o.push(CB.wv,D.pos.z,inWater(D.pos.x,D.pos.z),ST.info.wheels.length,ST.top);return JSON.stringify(o);}));
});
