const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  for(const m of ['classic','woods','earth']){
    await A.evaluate(m=>{CFG.map=m;saveCfg();},m);await A.reload();await A.waitForTimeout(m==='earth'?9000:4000);
    await A.screenshot({path:'map_start_'+m+'.png'});
    await A.evaluate(()=>{CFG.tod=14;startGame('free');applyTOD();__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.setCam('CHASE');});await A.waitForTimeout(7000);
    console.log(m,await A.evaluate(()=>JSON.stringify({map:curMap(),look:LOOK.on,ces:CES.on,fld:FU.built,pos:D.pos.toArray().map(v=>+v.toFixed(0)),chunks:chunks.size,sock:!!window.windSock})));
    await A.screenshot({path:'map_'+m+'.png'});}
  // switching from the menu reloads into the game
  await A.evaluate(()=>{__wds.menuToggle(true);__wds.menuPush('🗺 Map',mapItems());});await A.waitForTimeout(800);await A.screenshot({path:'map_menu.png'});
});
