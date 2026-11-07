const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);await ev(()=>gigaGo());await A.waitForTimeout(4000);
  console.log(await ev(()=>{let n=0,m=0;for(const [k,ch] of chunks)for(const t of ch.trees){if(Math.abs(t.x-820)<40&&Math.abs(t.z+640)<150)n++;if(trainDist(t.x,t.z)<4)m++;}return 'blocked '+blocked(820,-609)+' runway trees '+n+' rail trees '+m+' chunks '+chunks.size+' bd '+blocked.toString().slice(0,80);}));});
