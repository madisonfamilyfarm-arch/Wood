const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await ev(async()=>{window.__bm=[];const e=explode;explode=function(p){__bm.push(p.clone());return e.apply(this,arguments);};const c=new V3(TRUCK.x,H(TRUCK.x,TRUCK.z)+1.4,TRUCK.z);spawnShot('rocket',c.clone().add(new V3(-6,12,1.5)),new V3(20,-40,0),0xffffff,true,'t'+Math.random(),mp.id);await new Promise(r=>setTimeout(r,2500));return 'booms '+__bm.map(p=>p.distanceTo(c).toFixed(1)).join(',')+' truck gone '+GONE.truck+' fires '+FIRE.L.length;}));
  console.log(await ev(()=>{putBack();return 'back '+!GONE.truck+' visible '+TRUCK.g.visible;}));});
