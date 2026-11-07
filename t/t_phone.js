const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8790/');await A.waitForTimeout(4000);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await ev(()=>'url '+phoneUrl()+' item '+mainItems().some(i=>{try{return /Play on my phone/.test(i.label())}catch(e){return false}})));
  await ev(()=>phoneShow());await A.waitForTimeout(3000);await A.screenshot({path:'phone.png'});
  console.log(await ev(()=>'qr '+($('phQR').querySelector('canvas,img')?'drawn':$('phQR').textContent)));
});
