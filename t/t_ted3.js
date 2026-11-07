const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8790/');await A.waitForTimeout(4000);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);await ev(()=>tedOpen());await A.waitForTimeout(1000);
  for(const [x,z] of [[20,20],[70,15],[70,-30],[15,-35],[20,20]]){const s=await ev(([x,z])=>tedScreen(x,z),[x,z]);await A.mouse.click(s.x,s.y);await A.waitForTimeout(400);console.log(JSON.stringify(s),await ev(()=>JSON.stringify(TED.pts)+' ted '+TED.on+' mine '+JSON.stringify(TRAIN.mine)+' len '+TRAIN.len.toFixed(0)));}
});
