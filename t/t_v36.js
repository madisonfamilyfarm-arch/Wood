const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(3);DZ.on=false;});await P.waitForTimeout(3000);
  // TNT over a bot, battle mode OFF
  console.log(await P.evaluate(async()=>{const B=AIB.L[0];B.goal=null;D.state='flying';D.pos.set(B.p.x,B.p.y+8,B.p.z);D.vel.set(0,0,0);WPN.dmg=true;const before=AIB.L.filter(b=>!b.dead).length;
    tntDrop();const n=TNTS.length;await new Promise(r=>setTimeout(r,2500));return 'tnt made '+n+' left '+TNTS.length+' bots alive '+before+'→'+AIB.L.filter(b=>!b.dead).length+' me '+D.state+' dz '+DZ.on;}));
  await P.screenshot({path:'tnt.png'});
  // explosion settings menu
  await P.evaluate(()=>{menuToggle(true);menuPush('💥 Explosion settings',exItems());});await P.waitForTimeout(600);
  console.log('arrows',await P.evaluate(()=>document.querySelectorAll('#menuList .rngA').length+' nums '+document.querySelectorAll('#menuList .rngN').length));
  const btn=await P.$$('#menuList .rngA');const tntUp=btn[7]; // 4th range ▶  (rows: blast, trees, det, TNT)
  const bb=await tntUp.boundingBox();await P.mouse.move(bb.x+5,bb.y+5);await P.mouse.down();await P.waitForTimeout(4000);await P.mouse.up();
  console.log('after hold',await P.evaluate(()=>{const rows=[...document.querySelectorAll('#menuList .mi')].filter(d=>d.querySelector('.rngN'));return rows.map(d=>d.querySelector('b').textContent+' | slider '+d.querySelector('input[type=range]').value+'/'+d.querySelector('input[type=range]').max+' | num '+d.querySelector('.rngN').value).join('\n')+'\nTNT.r '+TNT.r;}));
  await P.screenshot({path:'exmenu.png'});
  await P.evaluate(()=>{const n=[...document.querySelectorAll('#menuList .rngN')][0];n.value='120';n.dispatchEvent(new Event('change'));});
  console.log('typed',await P.evaluate(()=>WPN.blast+' slider '+document.querySelector('#menuList input[type=range]').value));
  await P.evaluate(()=>{WPN.blast=6;saveWpn();menuToggle(false);});
  // auto-detect, battle off: rocket flying past a bot 3 m away
  console.log(await P.evaluate(async()=>{const B=AIB.L.find(b=>!b.dead);if(!B)return'no bot';B.goal=null;const p=B.p.clone().add(new V3(-30,0,3));const n0=FXB.length;let boomed=0;const e0=explode;explode=function(){boomed++;return e0.apply(this,arguments);};
    spawnShot('rocket',p,new V3(40,0,0),0xffffff,true,'tst'+Math.random(),mp.id);await new Promise(r=>setTimeout(r,1500));explode=e0;return 'auto-detect boom '+boomed;}));
});
