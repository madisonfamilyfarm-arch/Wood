const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.route('**/blockly.min.js',r=>r.fulfill({path:__dirname+'/node_modules/blockly/blockly.min.js',contentType:'text/javascript'}));
  await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(2000);
  const ev=(f,a)=>A.evaluate(f,a);
  // ---- squash
  console.log('squash',await ev(async()=>{const j=await (await fetch('/zipper.json')).json();const sp=sanitize(j.spec);const b=sp.parts.find(p=>p.t==='battery');const s1=stats(sp);b.sq=0.5;const sp2=sanitize(sp);const s2=stats(sp2);
    const m=partMesh(cleanPart(b),c=>new THREE.MeshLambertMaterial({color:c}),{});return {sq:sanitize(sp).parts.find(p=>p.t==='battery').sq,w1:Math.round(s1.w),w2:Math.round(s2.w),min1:s1.mins.toFixed(1),min2:s2.mins.toFixed(1),scaleY:m.scale.y,box:JSON.stringify(partBox(cleanPart(b)))};}));
  // workshop tool
  console.log('wsTool flat',await ev(()=>{openWorkshop(false);WS.parts.push(cleanPart({t:'battery',x:0,y:0,h:-3.2,w:2,len:3}));WS.sel=WS.parts.length-1;try{wsTool('flat');wsTool('flat');}catch(e){return 'ERR '+e.message;}const p=WS.parts[WS.parts.length-1];closeWorkshop&&closeWorkshop();return p.sq;}));
  // ---- zipper: fly, take hits, check damage
  await ev(async()=>{const j=await (await fetch('/zipper.json')).json();useSpec(sanitize(j.spec));});await A.waitForTimeout(800);
  console.log('coins start',await ev(()=>ECO.coins));
  await ev(()=>{takeoff();});await A.waitForTimeout(3500);
  console.log('state',await ev(()=>D.state+' h='+(D.pos.y-groundY(D.pos.x,D.pos.z)).toFixed(1)));
  // flip -> award
  await ev(()=>{__wds.step({ly:0.6},1.5);doFlip('front');});await A.waitForTimeout(4000);
  console.log('after flip coins',await ev(()=>ECO.coins),'rot',await ev(()=>JSON.stringify(ECO.rot)));
  // medium hits while flying
  const r=await ev(()=>{const out=[];for(let i=0;i<6&&D.state==='flying';i++){impact(9,'a tree');out.push(Object.keys(D.dmg).join(',')+'|'+D.state);}return out.join('  ');});console.log('hits',r);
  await ev(()=>{if(D.state==='flying')impact(30,'a trunk');});await A.waitForTimeout(3500);
  console.log('after crash',await ev(()=>D.state+' dmg='+Object.keys(D.dmg).join(',')+' jobs='+repairJobs().map(j=>j.t+(j.k||'')).join(',')+' debris='+debris.length));
  await ev(()=>openRepair());await A.waitForTimeout(500);await A.screenshot({path:'v9_repair.png'});
  console.log('fix all',await ev(()=>{let n=0;while(repair.open&&n<400){const j=curJob();if(!j)break;if(j.t==='prop'){jobAct(j,0.34);jobAct(j,1);}else jobAct(j,0.5);n++;}return n+' steps, open='+repair.open+' dmg='+Object.keys(D.dmg).join(',')+' spares='+repair.spares+' kits='+ECO.kits+' coins='+ECO.coins+' state='+D.state;}));
  // out of props -> restock
  console.log('restock',await ev(()=>{repair.spares=0;ECO.coins=3;ecoRestock();const a=repair.spares;ECO.coins=50;ecoRestock();return a+' then '+repair.spares+' coins '+ECO.coins;}));
  // shop
  console.log('shop',await ev(()=>{ECO.coins=200;const top0=ST.top;const it=shopItems();const lab=it.map(i=>i.label());it[3].act();it[3].act();const top1=ST.top;ECO.up={mot:0,bat:0,frm:0};ST=stats(SPEC);return lab.join(' / ')+' || top '+top0.toFixed(1)+' -> '+top1.toFixed(1)+' coins '+ECO.coins;}));
  // antenna dropouts + crack overlay
  console.log('dmg fx',await ev(()=>{dmgAdd('ant',true);dmgAdd('cam',true);__wds.setCam('FPV');dmgVis();let cut=0;for(let i=0;i<300;i++){const o=dmgRadio({lx:1,ly:1,rx:1,ry:1},1/60);if(!o.ly)cut++;}return 'cut frames '+cut+'/300 crack '+($('crackFx')&&$('crackFx').style.display);}));
  await A.waitForTimeout(600);await A.screenshot({path:'v9_crack.png'});
  await ev(()=>{quickFix(true);__wds.setCam('CHASE');});
  // award popup screenshot
  await ev(()=>award('😱 Close call!',3));await A.waitForTimeout(300);await A.screenshot({path:'v9_award.png'});
  // ---- program mode micro:bit
  await ev(()=>{localStorage.removeItem('wds_prog');openProg();progTab('blocks');});
  await A.waitForFunction(()=>BL.ws,null,{timeout:60000});await A.waitForTimeout(800);
  console.log('preset blocks',await ev(()=>BL.ws.getTopBlocks(false).map(b=>b.type).join(',')));
  console.log('code:\n'+await ev(()=>blocksToJs()));
  await A.screenshot({path:'v9_prog.png'});
  // run it, then push throttle via touch and check it climbs
  await ev(()=>{quickFix(true);});await A.waitForTimeout(300);
  await ev(()=>{runProg();});await A.waitForTimeout(1500);
  console.log('running',await ev(()=>AP.on+' ev='+AP.ev+' state='+D.state+' log='+AP.log.slice(-3).join(' | ')));
  await ev(()=>takeoff());await A.waitForTimeout(3000);
  const h0=await ev(()=>D.pos.y);await ev(()=>{touch.ly=0.9;});await A.waitForTimeout(2000);const h1=await ev(()=>D.pos.y);await ev(()=>{touch.ly=0;});
  console.log('stick climb',h0.toFixed(2),'->',h1.toFixed(2),'drive',await ev(()=>JSON.stringify(AP.drive)),'state',await ev(()=>D.state));
  const g0=await ev(()=>gallery.length);await ev(()=>{MB.scr['Ⓐ']=true;});await A.waitForTimeout(400);await ev(()=>{MB.scr['Ⓐ']=false;});await A.waitForTimeout(800);
  console.log('Ⓐ photo',g0,'->',await ev(()=>gallery.length+' status='+AP.status+' log='+AP.log.slice(-2).join('|')),'still on',await ev(()=>AP.on));
  await A.screenshot({path:'v9_running.png'});
  await ev(()=>apStop('stop'));await A.waitForTimeout(500);console.log('stopped',await ev(()=>AP.on+' ev='+AP.ev));
  // JS example
  console.log('js example',await ev(async()=>{progTab('js');$('jsEd').value=progExamples.toString().includes('Sticks fly it')?'ok':'missing';return $('jsEd').value;}));
  console.log('names rc',await ev(()=>JSON.stringify(mbNames('rc'))),'kind',await ev(()=>mbKind()));
});
