const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(()=>{startGame('free');aiSet(3);});await P.waitForTimeout(2000);
  console.log(await P.evaluate(()=>'sfx on '+SFX.on+' ctx '+(SFX.A&&SFX.A.state)));
  await P.evaluate(()=>{SFX.A.resume();});await P.waitForTimeout(500);
  for(const kind of ['drone','plane','car','tank','boat','sub']){console.log(kind,await P.evaluate(async k=>{try{if(k!=='drone'){bsOpen(k,null);bsClose();useSpec(wsSpec());closeWorkshop();}
      D.armed=true;D.state=k==='drone'||k==='plane'?'flying':'flying';D.vel.set(8,0,0);D.thr=0.8;for(let i=0;i<10;i++)tickSound(0.016);await new Promise(r=>setTimeout(r,300));return 'vk '+vhKind()+' eng gain '+SFX.E.out.gain.value.toFixed(3)+' f '+SFX.E.o1.frequency.value.toFixed(0)+' wind '+SFX.W.g.gain.value.toFixed(3)+' tires '+SFX.T.g.gain.value.toFixed(3)+' clank '+SFX.K.g.gain.value.toFixed(3);}catch(e){return 'ERR '+e.message;}},kind));}
  console.log(await P.evaluate(()=>{try{['mg','rocket','paint','crash','thump','clang','chip','splash','step','stepw','whoosh','freeze','bubble','chirp','cricket','crackle','click'].forEach(t=>sfx(t,cam.position.clone().add(new V3(3,0,0))));sfxBoom(cam.position.clone().add(new V3(10,0,0)),40);explode(cam.position.clone().add(new V3(15,0,0)),6,2,true,'me',mp.id);return 'one-shots ok';}catch(e){return 'ERR '+e.message;}}));
  await P.waitForTimeout(2000);console.log(await P.evaluate(()=>{menuToggle(true);menuPush('s',sfxItems());return document.querySelectorAll('#menuList .mi').length+' sound menu items; programs '+renderer.info.programs.length;}));
});
