const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8790/');await A.waitForTimeout(4000);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log('defaults',await ev(()=>'url '+AIB.url+' model '+AIB.model+' src '+AIB.src));
  console.log(await ev(async()=>{AIB.url=aiUrlFix('127.0.0.1:11435');AIB.models=[];AIB.ok=null;aiSet(3);return 1;}));
  await A.waitForTimeout(9000);console.log(await ev(()=>'ok '+AIB.ok+' via '+AIB.via+' model '+AIB.model+' err '+AIB.err+' kinds '+AIB.L.map(b=>b.kind).join(',')+' | menu: '+aiItems().map(i=>{try{return i.label()}catch(e){return ''}}).join(' / ').slice(0,400)));
});
