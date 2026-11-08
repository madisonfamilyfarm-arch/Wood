// PLAY-TEST EVERYTHING: every vehicle × (computer, iPhone landscape, iPhone portrait, VR). Drives with the sticks, crashes, shoots, opens menus + builder.
// Logs page errors, NaN positions, stuck states, fps, shader-program + scene-object growth.
const {chromium,devices}=require('playwright');
const MODES=(process.env.MODES||'computer,phoneL,phoneP,vr').split(',');
const VEH=[['drone',null],['heli','VPRESETS.heli.scale'],['plane','VPRESETS.plane.trainer'],['car','VPRESETS.car.rally'],['tank','VPRESETS.car.tank'],['boat','VPRESETS.boat.speed'],['sub','VPRESETS.boat.sub'],['walk','walk']];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const report=[];
  for(const mode of MODES){const opt=mode==='phoneL'?devices['iPhone 15 Pro landscape']:mode==='phoneP'?devices['iPhone 15 Pro']:{viewport:{width:1280,height:720}};
    const ctx=await b.newContext(opt);await ctx.addInitScript(()=>{try{localStorage.setItem('wds_cfg',JSON.stringify({look:'fast'}));}catch(e){}});const p=await ctx.newPage();
    const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,140)));p.on('console',m=>{if(m.type()==='error'&&!/CORS|ERR_|Failed to load|net::/.test(m.text()))errs.push('c: '+m.text().slice(0,140));});
    await p.route('**/three.min.js',r=>r.fulfill({path:__dirname+'/node_modules/three/build/three.min.js',contentType:'text/javascript'}));
    await p.goto('http://127.0.0.1:8765/woods-rc-sim.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);
    await p.evaluate(m=>{startGame('free');aiSet(3);DZ.on=true;if(m==='vr'){try{toggleVR();}catch(e){}}},mode);await p.waitForTimeout(2500);
    const base=await p.evaluate(()=>({pr:renderer.info.programs.length,ch:scene.children.length}));
    for(const [vk,pre] of VEH){const r=await p.evaluate(async([vk,pre])=>{const out={vk,notes:[]};try{
        if(WALK.on&&vk!=='walk')walkToggle(false);
        if(vk==='walk'){if(!WALK.on){try{walkToggle(true);}catch(e){out.notes.push('walk err '+e.message);}}}
        else if(pre){const sp=eval(pre);useSpec(JSON.parse(JSON.stringify(sp)));}else{useSpec(JSON.parse(JSON.stringify(SPEC)));}
        await new Promise(r=>setTimeout(r,600));D.armed=true;
        const pos=[],fr=[];let f=0;const t0=performance.now();let last=t0;
        // drive: throttle up, then a pattern of turns, climbs, dives
        const plan=[[0,0.9,0,0],[0,0.6,0,0.8],[0.8,0.3,0,0.8],[-0.8,0.3,0.6,0.5],[0,-0.6,0,0.9],[0,0.5,-0.7,-0.6],[0,1,0,1]];
        for(let step=0;step<plan.length;step++){const [lx,ly,rx,ry]=plan[step];touch.lx=lx;touch.ly=ly;touch.rx=rx;touch.ry=ry;
          if(step===3){try{curWeapon&&curWeapon();fire();}catch(e){out.notes.push('fire err '+e.message);}}
          await new Promise(r=>setTimeout(r,900));const P=(WALK.on?WALK.pos:D.pos);pos.push([P.x,P.y,P.z]);}
        touch.lx=touch.ly=touch.rx=touch.ry=0;
        const P=(WALK.on?WALK.pos:D.pos);const bad=[P.x,P.y,P.z,D.vel.x,D.vel.y,D.vel.z].some(v=>!isFinite(v));if(bad)out.notes.push('NaN position/velocity!');
        const moved=Math.hypot(pos[pos.length-1][0]-pos[0][0],pos[pos.length-1][2]-pos[0][2]);out.moved=Math.round(moved);out.state=D.state;out.kind=vk==='walk'?'walk':vhKind();
        const gy=H(P.x,P.z);out.alt=Math.round(P.y-gy);if(P.y<gy-2&&vk!=='sub'&&!inWater(P.x,P.z))out.notes.push('under the ground! y='+P.y.toFixed(1)+' ground='+gy.toFixed(1));
        if(moved<1&&vk!=='walk')out.notes.push('did not move');
        // crash test
        if(vk==='drone'){D.vel.set(0,-25,0);await new Promise(r=>setTimeout(r,1200));out.crash=D.state;try{quickFix(false);}catch(e){}}
        if(vk==="walk"){try{walkToggle(false);}catch(e){}}
      }catch(e){out.notes.push('ERR '+e.message);}return out;},[vk,pre]);report.push(mode+' '+JSON.stringify(r));}
    // menus: open every category and every submenu label renders
    const mres=await p.evaluate(()=>{const o=[];try{if(WALK.on)walkToggle(false);menuToggle(true);for(const c of MCAT){const L=mCatItems(c[0]);let bad=0;L.forEach(it=>{try{String(it.label());}catch(e){bad++;}});menuPush(c[1],L);renderMenu();o.push(c[0]+':'+L.length+(bad?'('+bad+' bad)':''));menuBack();}menuToggle(false);}catch(e){o.push('ERR '+e.message);}return o.join(' ');});
    report.push(mode+' menus '+mres);
    const bres=await p.evaluate(()=>{const o=[];try{for(const k of ['tank','car','boat','sub','plane','mix','drone']){bsOpen(k,null);bsClose();ezOpen();const s=document.querySelector('#ezPanel input[data-k=size]');s.value=150;s.oninput();ezClose(true);const ov=(()=>{const a=$('wsTray').getBoundingClientRect(),m=$('wsMid').getBoundingClientRect(),t=$('wsTools').getBoundingClientRect();return (a.right>m.left+2?'tray/mid overlap ':'')+(m.right>t.left+2?'mid/tools overlap':'');})();o.push(k+(ov?'['+ov+']':''));closeWorkshop();}}catch(e){o.push('ERR '+e.message);}return o.join(' ');});
    report.push(mode+' builder '+bres);
    await p.waitForTimeout(1500);const after=await p.evaluate(()=>({pr:renderer.info.programs.length,ch:scene.children.length,fps:Math.round(PERF.fps)}));
    report.push(mode+' programs '+base.pr+'→'+after.pr+' sceneObjs '+base.ch+'→'+after.ch+' fps~'+after.fps+' errors: '+(errs.length?[...new Set(errs)].slice(0,6).join(' | '):'none'));
    await p.screenshot({path:'pa_'+mode+'.png'});await ctx.close();}
  console.log(report.join('\n'));await b.close();})();
