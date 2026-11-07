const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  console.log(await P.evaluate(()=>{const out=[];TNT.throwD=0;for(const [k,sz] of [['classic',12],['bouncy',44],['nuke',90],['freeze',7]]){TNT.kind=k;TNT.sz[k]=sz;tntSyncR();D.state='flying';D.armed=true;D.pos.set(PAD.x+80,H(PAD.x+80,PAD.z)+4,PAD.z);D.vel.set(0,0,0);
      let R=null;const e0=explode;explode=function(p,r){R=r;return e0.apply(this,arguments);};const f0=tntFxK;tntFxK=function(kk,p,r){R=r;return f0.apply(this,arguments);};tntDrop();for(let i=0;i<300&&TNTS.length;i++)tntTick(0.03);explode=e0;tntFxK=f0;TNTS.slice().forEach(x=>tntDel(x));out.push(k+' set '+sz+' → boom '+R);}
    menuToggle(true);menuPush('t',tntTypeItems());out.push([...document.querySelectorAll('#menuList .mi')].slice(0,6).map(d=>d.textContent.replace(/\s+/g,' ').slice(0,70)).join(' | '));return out.join('\n');}));
});
