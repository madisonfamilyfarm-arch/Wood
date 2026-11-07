const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8790/');await A.waitForTimeout(4000);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log('defaults',await ev(()=>'url '+AIB.url+' model '+AIB.model+' src '+AIB.src));
  await ev(()=>{AIB.url=aiUrlFix('127.0.0.1:11435');AIB.model='mistral:7b';AIB.models=[];AIB.ok=null;aiSet(3);});
  await A.waitForTimeout(10000);console.log(await ev(()=>'ok '+AIB.ok+' via '+AIB.via+' model '+AIB.model+' err '+AIB.err+' kinds '+AIB.L.map(b=>b.kind).join(',')+' chat '+CHAT.slice(-3).map(c=>c.txt).join(' / ')));
});
