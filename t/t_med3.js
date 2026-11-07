const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');A.on('dialog',d=>d.accept('Overhead test'));await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  await ev(()=>medOpen());await A.waitForTimeout(1500);
  // tap 4 spots on the screen
  for(const [x,y] of [[450,250],[650,220],[750,380],[500,420]]){await A.mouse.click(x,y);await A.waitForTimeout(300);}
  console.log('pieces',await ev(()=>JSON.stringify(MED.g.map(g=>[Math.round(g.x),Math.round(g.z),g.t]))));
  // change piece type of selected + drag piece 1
  await ev(()=>{MED.sel=1;MED.g[1].t='tunnel';MED.g[2].t='neon';med3Preview();});
  await A.mouse.move(450,250);await A.mouse.down();await A.mouse.move(420,300,{steps:5});await A.mouse.up();
  console.log('after drag',await ev(()=>JSON.stringify(MED.g[0])));
  await A.waitForTimeout(800);await A.screenshot({path:'med3.png'});
  await ev(()=>{MED3.tilt=1;});await A.waitForTimeout(800);await A.screenshot({path:'med3tilt.png'});
  console.log('save',await ev(()=>{const k=medStore();medClose();return k+' '+(courses[k]&&courses[k].cps.length)+' preview gone '+!MED3.g;}));
  // elevator
  console.log('elev',await ev(()=>{walkToggle(true);WALK.pos.set(FT.x,FT.y0,FT.z+1);for(let i=0;i<5;i++)tickWalk(1/60);const b=$('elevB');const t1=b.style.display+' '+b.textContent;elevGo();for(let i=0;i<60*3.5;i++)tickWalk(1/60);return t1+' -> y '+WALK.pos.y.toFixed(1)+'/'+FT.top.toFixed(1)+' btn '+$('elevB').textContent;}));
  await ev(()=>{WALK.yaw=Math.PI*0.75;WALK.pitch=-0.1;});await A.waitForTimeout(1000);await A.screenshot({path:'cab.png'});
  console.log('dl',await ev(()=>CFG.autoDl+' '+mainItems().map(i=>i.label()).filter(l=>/Downloads/.test(l)).join('')));
});
