const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8790/');await A.waitForTimeout(4000);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  await ev(()=>tedOpen());await A.waitForTimeout(1000);
  console.log(await ev(()=>{const c=$('mini').getBoundingClientRect();return 'canvas '+JSON.stringify([c.left,c.top,c.width,c.height])+' mode '+MAP.mode+' view '+MAP.view+' D '+D.pos.x.toFixed(0)+','+D.pos.z.toFixed(0);}));
  for(const [x,z] of [[20,20],[60,10]]){const s=await ev(([x,z])=>tedScreen(x,z),[x,z]);await A.mouse.click(s.x,s.y);await A.waitForTimeout(200);console.log(JSON.stringify(s),await ev(()=>JSON.stringify(TED.pts)));}
});
