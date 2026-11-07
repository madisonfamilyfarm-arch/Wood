const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  await ev(()=>{window.__bm=[];const e=explode;explode=function(p){__bm.push(p.clone());return e.apply(this,arguments);};const tp=new V3(40,H(40,40)+25,40);window.__tp=tp;mpRecv({id:'tst',n:'Target',t:'sp',spec:aiSpec2(0,'drone'),rad:0.5,col:'#ff0'});
    window.__iv=setInterval(()=>mpRecv({id:'tst',n:'Target',t:'s',p:[tp.x,tp.y,tp.z],r:[0,0,0,1],v:[0,0,0],st:'flying',a:1,sp:60}),30);});
  await A.waitForTimeout(1000);
  for(const off of [1.5,2.5,3.2,4.5]){
    console.log(off,await ev(async off=>{__bm.length=0;const o=__tp.clone().add(new V3(-50,0,off));spawnShot('rocket',o,new V3(60,0,0),0xffffff,true,'t'+Math.random(),mp.id);
      await new Promise(r=>setTimeout(r,3000));return __bm.map(p=>'boom '+p.distanceTo(__tp).toFixed(1)+'m from target').join(', ')||'no boom';},off));}
});
