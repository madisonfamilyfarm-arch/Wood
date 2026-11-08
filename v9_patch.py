import shutil
shutil.copy('rc.html','rc_pre_v9.html')
r=open('rc.html').read()
assert 'ECO=' not in r, 'already patched'
def rep(a,b,cnt=1):
    global r
    n=r.count(a)
    if n!=cnt: raise SystemExit('count %d for %r'%(n,a[:120]))
    r=r.replace(a,b)

# ---------------- ↧ squash: any part can be made thinner (or taller) top-to-bottom
rep("sc:clamp(n(p.sc,1),0.05,60),mid:","sc:clamp(n(p.sc,1),0.05,60),sq:clamp(n(p.sq,1),0.15,6),mid:")
rep("  const z0=r[3]===null?-p.len:-r[3],z1=r[3]===null?0:r[3];_be.set(",
    "  if(p.sq&&p.sq!==1&&p.t!=='shape'&&p.t!=='wing'){r[1]*=p.sq;r[2]*=p.sq;}\n  const z0=r[3]===null?-p.len:-r[3],z1=r[3]===null?0:r[3];_be.set(")
rep("const mah=bats.reduce((a,b)=>a+Math.round(b.len*b.w*55),0);","const mah=bats.reduce((a,b)=>a+Math.round(b.len*b.w*55*(b.sq||1)),0);")
rep("else if(p.t==='battery')add(p.len*p.w*55*bk[p.bt][2],p.x,p.y);","else if(p.t==='battery')add(p.len*p.w*55*(p.sq||1)*bk[p.bt][2],p.x,p.y);")
i=r.index("function partMesh(p,mat,opt){");j=r.index("  return g;}",i)
r=r[:j]+"  if(p.sq&&p.sq!==1&&p.t!=='shape'&&p.t!=='wing')g.scale.y*=p.sq;\n"+r[j:]
rep("B('↥ taller',()=>wsTool('tall'));B('↧ flatter',()=>wsTool('flat'));","B('↥ stretch taller',()=>wsTool('tall'));B('↧ squash thinner',()=>wsTool('flat'));")
rep("if(['shape','wing'].includes(p.t))p.d=clamp(+(p.d+d*Math.max(0.5,p.d*0.08)).toFixed(1),0.2,400);else toast('↥↧ is for shapes and wings',1200);}",
    "if(['shape','wing'].includes(p.t))p.d=clamp(+(p.d+d*Math.max(0.5,p.d*0.08)).toFixed(1),0.2,400);else{p.sq=clamp(+((p.sq||1)*(d>0?1.12:1/1.12)).toFixed(3),0.15,6);toast((d>0?'↥ taller ':'↧ squashed ')+Math.round(p.sq*100)+'% high'+(p.t==='battery'?' (thinner battery = less mAh, lighter)':''),1100);}}")

# ---------------- 💥 more kinds of damage
rep("  const chips=DR.props.filter(P=>P.state==='chip').length;\n",
    "  const chips=DR.props.filter(P=>P.state==='chip').length+(D.dmg&&D.dmg.motor?2:0)+(D.dmg&&D.dmg.frame?1:0);if(D.dmg&&D.dmg.motor&&D.state==='flying'){D.yaw+=0.55*dt;D.vel.y-=0.6*dt;}\n")
rep("const gpsOK=SPEC.assist&&CFG.gpsHold!==false&&(!ST.elec||ST.elec.gps),","const gpsOK=SPEC.assist&&CFG.gpsHold!==false&&(!ST.elec||ST.elec.gps)&&!(D.dmg&&D.dmg.gps),")
rep("function tickDrone(dt,inp){\n","function tickDrone(dt,inp){\n  if(D.dmg&&D.dmg.ant)inp=dmgRadio(inp,dt);\n")
rep("DR.props.forEach(P=>{if(P.state!=='ok')J.push({t:'prop',P});});return J;}","DR.props.forEach(P=>{if(P.state!=='ok')J.push({t:'prop',P});});dmgJobs(J);return J;}")
rep("function openRepair(){if(D.state!=='down'&&!DR.props.some(P=>P.state!=='ok')){","function openRepair(){if(D.state!=='down'&&!DR.props.some(P=>P.state!=='ok')&&!dmgAny()){")
rep("if(repair.spares<=0){toast('No spare props left — use Quick fix');return;}","if(repair.spares<=0&&!ecoRestock()){toast('No spare props left — use Quick fix');return;}")
rep("    if(repair.prog>=1){repair.prog=0;if(J.t==='flip')","    if(repair.prog>=1){repair.prog=0;if(J.t==='dmg')dmgFix(J.k);if(J.t==='flip')")
rep("function quickFix(toPad){","function quickFix(toPad){dmgClear();")
rep("c.fillText('Spare props ×'+repair.spares+'  (drag one onto a red motor)',32,350);","c.fillText('Spare props ×'+repair.spares+'  🧰 parts ×'+ECO.kits+'  💰'+ECO.coins+'  (drag a prop onto a red motor)',32,350);")
rep("  if(!all.length){c.fillStyle='#33ff66';c.fillText('✅ All good!',410,y);}","  dmgList(all);\n  if(!all.length){c.fillStyle='#33ff66';c.fillText('✅ All good!',410,y);}")
rep("const on=cur&&cur.t===a[1]&&(!a[2]||cur.P===a[2]||cur.A===a[2]);","const on=cur&&cur.t===a[1]&&(!a[2]||cur.P===a[2]||cur.A===a[2]||cur.k===a[2]);")
rep("if(cur&&(cur.t==='flip'||cur.t==='dry'||cur.t==='arm')){","if(cur&&(cur.t==='flip'||cur.t==='dry'||cur.t==='arm'||cur.t==='dmg')){")
rep("c.fillText(cur.t==='flip'?'HOLD to flip it over'","c.fillText(cur.t==='dmg'?DMG[cur.k].hold:cur.t==='flip'?'HOLD to flip it over'")

# ---------------- 💰 coins chip + shop in the menu
rep('<span class="chip" id="cBat">🔋100%</span>','<span class="chip" id="cBat">🔋100%</span><span class="chip" id="cCoin" title="Coins from stunts — tap for the shop">💰0</span>')
rep("  mItem('🎓 Flight lessons & challenges ▸',","  mItem(()=>'💰 Shop — props, parts, upgrades ('+ECO.coins+' coins) ▸',()=>menuPush('💰 Shop',shopItems())),\n  mItem('🎓 Flight lessons & challenges ▸',")
rep("tickWind(dt);spaceRestore();lookTick(dt);","tickWind(dt);spaceRestore();lookTick(dt);ecoTick(dt);")

# ---------------- 💻 micro:bit style programs: several waits at once, sticks as inputs
rep("function apWait(test,timeout,label){return new Promise((res,rej)=>{const t0=performance.now();AP.wait={test,res,rej,t0,timeout:(timeout||20)*1000,label};});}",
    "function apWait(test,timeout,label){return new Promise((res,rej)=>{const t0=performance.now();const w={test,res,rej,t0,timeout:(timeout||20)*1000,label};AP.wait=w;(AP.waits=AP.waits||[]).push(w);});}\n"
    "function apWaitTick(){const L=AP.waits||[];AP.waits=[];const keep=[];for(const W of L){try{apCheck();if(W.test())W.res();else if(performance.now()-W.t0>W.timeout){W.res();apLog('⏱ gave up waiting: '+W.label);}else keep.push(W);}catch(e){W.rej(e);}}AP.waits=keep.concat(AP.waits);AP.wait=AP.waits[AP.waits.length-1]||null;}")
rep("  if(!(ST.elec&&!ST.elec.rx)&&Math.max(Math.abs(rawIn.lx),Math.abs(rawIn.ly),Math.abs(rawIn.rx),Math.abs(rawIn.ry))>0.7){apStop('🎮 You grabbed the sticks — program stopped');return;}",
    "  AP.lastInp={lx:inp.lx,ly:inp.ly,rx:inp.rx,ry:inp.ry};if(AP.ev){mbTick(dt);const dr=AP.drive;if(dr&&performance.now()-dr.t<400){inp.lx=dr.lx;inp.ly=dr.ly;inp.rx=dr.rx;inp.ry=dr.ry;}if(!AP.tgt){apWaitTick();return;}}\n"
    "  else if(!(ST.elec&&!ST.elec.rx)&&Math.max(Math.abs(rawIn.lx),Math.abs(rawIn.ly),Math.abs(rawIn.rx),Math.abs(rawIn.ry))>0.7){apStop('🎮 You grabbed the sticks — program stopped');return;}")
rep("  const W=AP.wait;if(W){try{apCheck();if(W.test()){AP.wait=null;W.res();}else if(performance.now()-W.t0>W.timeout){AP.wait=null;W.res();apLog('⏱ gave up waiting: '+W.label);}}catch(e){AP.wait=null;W.rej(e);}}\n}",
    "  apWaitTick();\n}")
rep("function apStop(msg){if(!AP.on)return;AP.stop=true;AP.tgt=null;","function apStop(msg){if(!AP.on)return;AP.stop=true;AP.tgt=null;(AP.waits||[]).forEach(w=>{if(w!==AP.wait)try{w.rej(new Error('stopped'));}catch(e){}});AP.waits=[];if(AP.evDone){const f=AP.evDone;AP.evDone=null;setTimeout(f,0);}mbEnd();")
# run: after the top of the program, keep going while there are 'on start / forever / on input' blocks
rep("    if(tab!=='py')await fn(droneAPI,()=>{apCheck();return new Promise(r=>setTimeout(r,0));});",
    "    mbBegin();\n    if(tab!=='py')await fn(droneAPI,()=>{apCheck();return new Promise(r=>setTimeout(r,0));});\n    if(tab!=='py'&&!AP.stop)await mbRun();")
rep("  AP.on=false;AP.tgt=null;AP.wait=null;$('apBar').style.display='none';\n}","  AP.on=false;AP.tgt=null;AP.wait=null;AP.waits=[];mbEnd();$('apBar').style.display='none';\n}")
rep("const API_ACT=['takeoff',","const API_ACT=['pause','takeoff',")
rep("  const C='#3a7bd5',S='#2e9c5a',L='#bf5af2';\n  Blockly.defineBlocksWithJsonArray([","  const C='#3a7bd5',S='#2e9c5a',L='#bf5af2';mbDefine();\n  Blockly.defineBlocksWithJsonArray([")
rep("  if(!BL.ws.getAllBlocks(false).length)blExample('square');","  mbFirstOpen();")
rep("B('📚 Examples',()=>progExamples());","B('🎮 Sticks preset',()=>mbPreset());B('🎓 Teach switches',()=>mbTeach());B('📚 Examples',()=>progExamples());")
rep("<b style=\"color:#33ff66\">Sensors</b><br>","<b style=\"color:#33ff66\">micro:bit style inputs</b><br><code>on_start(async()=>{…})</code><br><code>forever(async()=>{…})</code><br><code>on_button(\"Ⓐ\", async()=>{…})</code><br><code>on_switch(\"A\",\"down\", async()=>{…})</code><br><code>fly(yaw, throttle, roll, pitch)</code> −100…100<br><code>stick(\"throttle\")</code> yaw/roll/pitch<br><code>button(\"Ⓐ\")</code> <code>switch_pos(\"A\")</code> <code>knob(\"R\")</code> <code>pause(ms)</code> <code>show(\"hi\")</code><br><b style=\"color:#33ff66\">Sensors</b><br>")
rep("BL.ws=Blockly.inject('blk',{toolbox:BL_TOOLBOX,","BL.ws=Blockly.inject('blk',{toolbox:mbToolbox(),")
rep("const theme=Blockly.Theme.defineTheme('wds',{base:Blockly.Themes.Classic,componentStyles:","const theme=Blockly.Theme.defineTheme('wds',{base:Blockly.Themes.Classic,blockStyles:{loop_blocks:{colourPrimary:'#00AA00'},logic_blocks:{colourPrimary:'#00A4A6'},math_blocks:{colourPrimary:'#9400D3'},text_blocks:{colourPrimary:'#B8860B'},variable_blocks:{colourPrimary:'#DC143C'},procedure_blocks:{colourPrimary:'#3455DB'}},componentStyles:")
import json as _j
rep("  '🌀 Spiral up':{js:","  '🎮 Sticks fly it (micro:bit style)':{js:"+_j.dumps(open('mb_example.js').read(),ensure_ascii=False)+",py:"+_j.dumps("# micro:bit style events (on start / forever / on button) work in Blocks and JavaScript.\n# Switch to the Blocks or JavaScript tab for this one.\n")+"},\n  '🌀 Spiral up':{js:")
rep("...(D.state==='down'||DR.props.some(P=>P.state!=='ok')?[mItem('🔧 Fix the drone'","...(D.state==='down'||DR.props.some(P=>P.state!=='ok')||dmgAny()?[mItem('🔧 Fix the drone'")

# ---------------- 🧪 COMBO: every kind of motor works at once (props + rockets/jets boost + wheels drive + water props + wings glide)
rep("o.flyAs=['auto','drone','plane','car','boat'].includes(s.flyAs)?s.flyAs:'auto';","o.flyAs=['auto','drone','plane','car','boat','combo'].includes(s.flyAs)?s.flyAs:'auto';")
rep("function resolveFlyAs(sp,I){const want=sp.flyAs||'auto';if(want!=='auto')return want;","function resolveFlyAs(sp,I){const want=sp.flyAs||'auto';if(want==='combo')return'drone';if(want!=='auto')return want;")
rep("  const fa=resolveFlyAs(sp,I);st.flyAs=fa;","  const fa=resolveFlyAs(sp,I);st.flyAs=fa;st.combo=fa==='drone'&&(sp.flyAs==='combo'||((sp.flyAs||'auto')==='auto'&&(I.rFwd>0||I.wheels.length>=2||I.wp>0)));")
rep("if(k==='flyas'){const L=['auto','drone','plane','car','boat'];","if(k==='flyas'){const L=['auto','drone','plane','car','boat','combo'];")
rep("B('✈ flies like…',()=>wsTool('flyas'),'wide','auto / drone / plane / car / boat');","B('✈ flies like…',()=>wsTool('flyas'),'wide','auto / drone / plane / car / boat / 🧪 COMBO (everything at once)');")
rep("const faTxt={drone:'🚁 hovers like a drone',plane:'✈️ flies like a plane',car:'🚙 drives like a car',boat:'🚤 floats like a boat'}[st.flyAs]||'';",
    "const faTxt=st.combo?'🧪 COMBO: '+comboDesc(st):{drone:'🚁 hovers like a drone',plane:'✈️ flies like a plane',car:'🚙 drives like a car',boat:'🚤 floats like a boat'}[st.flyAs]||'';")
rep("function floats(){return isWaterproof()||!isReal();}","function floats(){return isWaterproof()||!isReal()||!!(ST&&ST.combo&&ST.info&&ST.info.wp>0);}")
rep("function doAct(a,down){\n","function doAct(a,down){\n  if(a==='boost'){CB.act=down===false?false:!CB.act;return;}\n")
rep("const ACT_ORDER=['takeoff',","const ACT_ORDER=['boost','takeoff',")
rep("  gimbal:{n:'🎥 Camera tilt knob',t:'axis'},","  boost:{n:'🚀 Rocket / jet BOOST (hold) — combo builds',t:'mom'},gimbal:{n:'🎥 Camera tilt knob',t:'axis'},")
rep("    if(D.state==='flying'||D.state==='takeoff')u=k==='plane'?D.thr:","    if(ST&&ST.combo)u=Math.max(CB.u,D.state==='flying'?0.12:0);else if(D.state==='flying'||D.state==='takeoff')u=k==='plane'?D.thr:")
# alt-tab: let go of every key when the window loses focus (it kept flying)
rep("addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyP')shutter(false);});",
    "addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyP')shutter(false);});\nfunction letGoAll(){for(const k in keys)keys[k]=false;try{touch.lx=touch.ly=touch.rx=touch.ry=0;}catch(e){}CB.act=false;}\naddEventListener('blur',letGoAll);document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')letGoAll();});")

# ---------------- ⭕ cage guard (guards the prop in every direction) · 🚀 much stronger rockets · 🔓 ACRO (triple-tap 🏠)
rep("stOK={camera:['gimbal','fpv','action','box','pod'],","stOK={guard:['ring','cage'],camera:['gimbal','fpv','action','box','pod'],")
rep("const ST0={body:p.t==='body'?'box':null,","const ST0={guard:'ring',body:p.t==='body'?'box':null,")
rep("{t:'guard',ic:'⭕',n:'Prop guard'}","{t:'guard',ic:'⭕',n:'Prop guard'},{t:'guard',ic:'🔘',n:'Cage guard (all round)',o:{style:'cage'}}")
rep("p.t==='guard'){const o=add(new THREE.TorusGeometry(p.r*cm,0.004,6,28),mat(p.col));o.rotation.x=Math.PI/2;}",
    "p.t==='guard'){const o=add(new THREE.TorusGeometry(p.r*cm,0.004,6,28),mat(p.col));o.rotation.x=Math.PI/2;if(p.style==='cage'){for(let k=0;k<3;k++){const v=add(new THREE.TorusGeometry(p.r*cm,0.0028,5,28),mat(p.col));v.rotation.y=k*Math.PI/3;v.scale.y=0.42;v.position.y=0.012;}const t2=add(new THREE.TorusGeometry(p.r*cm*0.72,0.0028,5,24),mat(p.col),0,0.012+p.r*cm*0.3,0);t2.rotation.x=Math.PI/2;const b2=add(new THREE.TorusGeometry(p.r*cm*0.72,0.0028,5,24),mat(p.col),0,0.012-p.r*cm*0.3,0);b2.rotation.x=Math.PI/2;}}")
rep("p.t==='guard'?[p.r,-0.4,0.4,p.r]:","p.t==='guard'?(p.style==='cage'?[p.r,-p.r*0.3,p.r*0.55,p.r]:[p.r,-0.4,0.4,p.r]):")
rep("else if(p.t==='guard')add(p.r*2.2,p.x,p.y);","else if(p.t==='guard')add(p.r*(p.style==='cage'?4:2.2),p.x,p.y);")
rep("  const guarded=am.filter(m=>P.some(g=>g.t==='guard'&&Math.hypot(g.x-m.x,g.y-m.y)<2&&g.r>=m.r*0.9)).length;",
    "  const guarded=am.filter(m=>P.some(g=>g.t==='guard'&&Math.hypot(g.x-m.x,g.y-m.y)<2&&g.r>=m.r*0.9)).length,caged=am.filter(m=>P.some(g=>g.t==='guard'&&g.style==='cage'&&Math.hypot(g.x-m.x,g.y-m.y)<2&&g.r>=m.r*0.9)).length;")
rep("guards:n>0&&guarded>=n,","guards:n>0&&guarded>=n,cage:n>0&&caged>=n,")
rep("st.guards=I.guards;","st.guards=I.guards;st.cage=I.cage;")
rep("bmax=(2.5+t*0.35+(ST.guards||SPEC.guards?2.6:0))*tk,cmax","bmax=(2.5+t*0.35+(ST.guards||SPEC.guards?(ST.cage?4.5:2.6):0))*tk,cmax")
rep("if((ST.guards||SPEC.guards)&&Math.random()<0.55){bump();toast('🛡 The prop guards saved it!',1000);return;}","if((ST.guards||SPEC.guards)&&Math.random()<(ST.cage?0.92:0.55)){bump();toast(ST.cage?'🔘 Bounced off — the cage guards saved it!':'🛡 The prop guards saved it!',1000);return;}")
rep("const F=(p.t==='rocket'?60:45)*p.pow*","const F=(p.t==='rocket'?240:45)*p.pow*")
rep("const a=n>1?M.rth2:M.rth;if(a==='rth'){rth=null;rthPress();}","const a=n>2?'acro':n>1?M.rth2:M.rth;if(a==='acro'){rth=null;acroToggle();}else if(a==='rth'){rth=null;rthPress();}")

# ---------------- 🐟 underwater world + 🌊 sea
rep("if(e<1.4)h=lerp(h,-1.7,smooth(1.22,0.9,e));","if(e<1.4)h=lerp(h,-1.7,smooth(1.22,0.9,e));if(e<0.95)h-=Math.pow(1-e/0.95,0.7)*9*(0.88+0.12*Math.sin(x*0.13)*Math.cos(z*0.11));")
rep("D.depth=clamp(D.depth-inp.ry*1.6*dt,0,4)","D.depth=clamp(D.depth-inp.ry*2.2*dt,0,subMaxDepth())")
rep("lookTick(dt);ecoTick(dt);WX.tick(dt);","lookTick(dt);ecoTick(dt);WX.tick(dt);uwTick(dt);fireTick(dt);")

# ---------------- 🛤 extra trails: no trees on them + dirt colour
rep("  if(fldBlocked(x,z))return true;\n","  if(fldBlocked(x,z))return true;\n  if(XT&&XT.n&&xtDist(x,z)<3.4)return true;\n")
rep("if(Math.hypot(x,z+10)<175){const td=trailDist(x,z);if(td<2.6)c.lerp(C_DIRT,smooth(2.6,1.0,td));}","if(Math.hypot(x,z+10)<175){const td=trailDist(x,z);if(td<2.6)c.lerp(C_DIRT,smooth(2.6,1.0,td));}if(XT&&XT.n){const t2=xtDist(x,z);if(t2<2.6)c.lerp(C_DIRT,smooth(2.6,1.0,t2));}")

# ---------------- 🏁 tracks: delete / copy+edit built-in, more piece types, hide other tracks' hoops · 🦘 jumps that launch you
r=r.replace("myGroup.add(ring)","cg.add(ring)").replace("myGroup.add(post)","cg.add(post)").replace("myGroup.add(pole)","cg.add(pole)").replace("myGroup.add(beam)","cg.add(beam)")
rep("LS.get('mycourses',[]).forEach((def,i)=>{const cps=[],G=def.g;","LS.get('mycourses',[]).forEach((def,i)=>{const cps=[],G=def.g,cg=new THREE.Group();myGroup.add(cg);")
rep("custom:true};});","custom:true,grp:cg};trkExtras(def,cg,'my'+i);});")
rep("if(g.t==='hoop'){const R=g.s","if(g.t==='hoop'||g.t==='tunnel'){const R=g.s")
rep("B(sg?(sg.t==='hoop'?'⭕ hoop':'🚩 gate'):(MED.nextT||K.t)==='hoop'?'next: ⭕ hoop':'next: 🚩 gate',()=>{if(sg){medSave();sg.t=sg.t==='hoop'?'gate':'hoop';}else MED.nextT=(MED.nextT||K.t)==='hoop'?'gate':'hoop';});",
    "B((sg?'':'next: ')+(MTN[sg?sg.t:(MED.nextT||K.t)]||'🚩 gate')+' ▸',()=>{const nx=t=>MTL[(MTL.indexOf(t)+1)%MTL.length];if(sg){medSave();sg.t=nx(sg.t);}else MED.nextT=nx(MED.nextT||K.t);toast((sg?'':'Next piece: ')+MTN[sg?sg.t:MED.nextT],900);},'Tap to change the piece type');")
rep("const L=4*s,W=3*s,h=1.3*s,","const L=4*s*(o.long||1),W=3*s,h=(o.steep||1.3)*s,")
rep("RAMPS.push({x:o.x,z:o.z,fx:-fx,fz:-fz,len:L,w:W,h,obj:o.id});","RAMPS.push({x:o.x,z:o.z,fx:-fx,fz:-fz,len:L,w:W,h,obj:o.id,pow:o.pow||2});rampDeco(g,o.x,gy,o.z,-fx,-fz,L,W,h,o.col);")
rep("if(D.pos.y+climb*dt>gNext+S.legs+0.04&&climb<-3){D.air=true;v.y=D.vy||0;toast('',1);}",
    "if((D.pos.y+climb*dt>gNext+S.legs+0.04&&climb<-3)||(D.onRamp&&gNext<gNow-0.12)){D.air=true;v.y=D.vy||0;toast('',1);const rp=D.onRamp;if(rp){const sp=Math.hypot(v.x,v.z),pw=rp.pow||1.6;v.y=Math.max(v.y,sp*rp.h/rp.len*(0.8+pw*0.35)+pw*0.8);const k=1+pw*0.06;v.x*=k;v.z*=k;D.airT0=1;D.airS=0;beep(500,0.15,0.06);D.onRamp=null;}}")
rep("else{D.vy=climb;D.pos.y=gNext+S.legs;v.y=climb;}","else{D.vy=climb;D.pos.y=gNext+S.legs;v.y=climb;D.onRamp=rampAt(D.pos.x,D.pos.z)||(D.onRamp&&rampAt(D.pos.x-v.x*0.15,D.pos.z-v.z*0.15));}")
rep("const o={id:mp.id+Date.now().toString(36)+Math.floor(Math.random()*999),type,","const o={...(type==='ramp'?{steep:RAMPSET.steep,pow:RAMPSET.pow,long:RAMPSET.long}:{}),id:mp.id+Date.now().toString(36)+Math.floor(Math.random()*999),type,")
rep("const lim=6+S.susp*40;","const lim=6+S.susp*40+(D.airT0?16:0);")
rep("D.pv+=(thr*3.2)*dt;","D.pv+=(thr*(D.airT0?1.0:3.2))*dt;if(D.airT0&&SPEC.assist!==false){D.pitch*=1-dt*2.5;D.roll*=1-dt*2.5;D.pv*=1-dt*3;D.rv*=1-dt*3;}")

# ---------------- 🎥 camera tilt all the way down/up · 🏷 named cameras you cycle through
r=r.replace("CFG.fpvT=lerp(-30,70,(v+1)/2)","CFG.fpvT=lerp(-90,90,(v+1)/2)").replace("D.gimbal=lerp(-Math.PI/2,0.35,(v+1)/2)","D.gimbal=lerp(-Math.PI/2,Math.PI/2,(v+1)/2)")
r=r.replace("CFG.fpvT=clamp(fpvTilt()+a.gim*45*dt,-30,70)","CFG.fpvT=clamp(fpvTilt()+a.gim*40*dt,-90,90)").replace("CFG.fpvT=clamp(-e.target.value,-30,70)","CFG.fpvT=clamp(-e.target.value,-90,90)")
r=r.replace("v=>{CFG.fpvT=v;saveCfg();},-30,70,5,","v=>{CFG.fpvT=v;saveCfg();},-90,90,5,")
rep("let camP=null;","let camP=null;const camList=[];")
rep("else if(p.t==='camera'&&!camP)camP=[x,p.h*cm,z-0.02];","else if(p.t==='camera'){if(!camP)camP=[x,p.h*cm,z-0.02];camList.push({n:p.nm||'',x,y:p.h*cm,z:z-0.02,a:p.a||0,rx:p.rx||0});}")
rep("camLocal:new V3(camP[0]*VS,camP[1]*VS,camP[2]*VS),sp,layout};","camLocal:new V3(camP[0]*VS,camP[1]*VS,camP[2]*VS),cams:camList,sp,layout};")
rep("function mountPos(out){out.copy(DR.camLocal);","function mountPos(out){const cc=camCur();if(cc)out.set(cc.x*VS,cc.y*VS,cc.z*VS);else out.copy(DR.camLocal);")
rep("else if(c==='FPV'){mountPos(cam.position);const up=fpvTilt()*Math.PI/180;cam.quaternion.setFromEuler(_e.set(D.pitch*0.6+up,D.yaw,D.roll*0.6,'YXZ'));",
    "else if(c==='FPV'){mountPos(cam.position);const up=fpvTilt()*Math.PI/180,cc=camCur();cam.quaternion.setFromEuler(_e.set(D.pitch*0.6+up-(cc?(cc.rx||0)*D2R:0),D.yaw-(cc?(cc.a||0)*D2R:0),D.roll*0.6,'YXZ'));")
# ---------------- 🛠 build ANYTHING: cars, boats, submarines, tanks in the same workshop
rep("gun:'paint'},stOK={guard:['ring','cage'],","gun:'paint',wheel:'wheel'},stOK={wheel:['wheel','tread'],guard:['ring','cage'],")
rep("{t:'wheel',ic:'🛞',n:'Wheel'}","{t:'wheel',ic:'🛞',n:'Wheel'},{t:'wheel',ic:'🪖',n:'Tank tread',o:{style:'tread',r:3,w:5,len:28,col:'#555555'}}")
rep("else if(p.t==='wheel'){const R=p.r*cm,W=p.w*cm;","else if(p.t==='wheel'&&p.style==='tread'){const R=p.r*cm,W=p.w*cm,L=Math.max(p.len*cm,R*2.2),dk=mat('#1b1b1b');add(new THREE.BoxGeometry(W,R*2,L-R*2),dk);for(const e of[-1,1]){const c2=add(new THREE.CylinderGeometry(R,R,W,14),dk,0,0,e*(L/2-R));c2.rotation.z=Math.PI/2;}for(let k=0;k<4;k++){const wv=add(new THREE.CylinderGeometry(R*0.7,R*0.7,W*1.06,12),mat(p.col),0,0,-L/2+R+k*(L-2*R)/3);wv.rotation.z=Math.PI/2;}g.userData.wheel=true;}\n  else if(p.t==='wheel'){const R=p.r*cm,W=p.w*cm;")
rep("p.t==='wheel'?[p.w/2,-p.r,p.r,p.r]:","p.t==='wheel'?(p.style==='tread'?[p.w/2,-p.r,p.r,Math.max(p.len,p.r*2.2)/2]:[p.w/2,-p.r,p.r,p.r]):")
rep("if(p.t==='wheel')wheels.push(","if(p.t==='wheel'&&p.style!=='tread')wheels.push(")
rep("const S=ST,v=D.vel,st=SPEC.style;","const S=ST,v=D.vel,st=SPEC.style||(ST.sub?'sub':undefined);")
rep("if(I.wheels.length>=3)return'car';","if(I.wheels.length>=3||I.wheels.filter(w=>w.style==='tread').length>=2)return'car';")
rep("if(want==='combo')return'drone';","if(want==='combo')return'drone';if(want==='tank')return'car';if(want==='sub')return'boat';")
rep("why:I.wheels.length<3?'cars need 3+ wheels':''});}","why:I.wheels.length<3?'cars need 3+ wheels':''});if(sp.flyAs==='tank'||I.wheels.some(w=>w.style==='tread')){const nt=I.wheels.filter(w=>w.style==='tread').length;Object.assign(st,{skid:true,climb:true,tough:10,tank:true,grip:12,why:nt>=2||I.wheels.length>=3?'':'tanks need 2 treads'});st.top*=0.65;}}")
rep("st.combo=fa==='drone'&&","st.sub=sp.flyAs==='sub';st.combo=fa==='drone'&&")
r=r.replace("o.flyAs=['auto','drone','plane','car','boat','combo'].includes(s.flyAs)","o.flyAs=['auto','drone','plane','car','boat','combo','sub','tank'].includes(s.flyAs)")
r=r.replace("if(k==='flyas'){const L=['auto','drone','plane','car','boat','combo'];","if(k==='flyas'){const L=['auto','drone','plane','car','boat','sub','tank','combo'];")
rep("B('✈ flies like…',()=>wsTool('flyas'),'wide','auto / drone / plane / car / boat / 🧪 COMBO (everything at once)');",
    "B('✈ flies like… (tap to change)',()=>wsTool('flyas'),'wide','auto / drone / plane / car / boat / submarine / tank / 🧪 MIX');B('🧪 MIX — every part works at once',()=>{WS.flyAs='combo';wsChanged();toast('🧪 MIX: props hover · rockets + jets BOOST (Shift / 🚀) · wheels drive · water props boat · wings glide',3500);},'wide');B('🏷 name this part (cameras too)',()=>wsName(),'wide');")
rep("const faTxt=st.combo?'🧪 COMBO: '+comboDesc(st):","const faTxt=st.combo?'🧪 MIX: '+comboDesc(st):st.tank?'🪖 drives like a tank':st.sub?'🌊 dives like a submarine':")
rep("mItem(()=>'🛠 Build your own '+KINDS[vkind()].n.toLowerCase()+' ▸',()=>{if(vkind()==='drone'||SPEC.parts)menuPush('🛠 Build your own',buildItems());else openBuilder(vkind());}),",
    "mItem('🛠 Build anything (drones, cars, boats, subs, tanks…) ▸',()=>menuPush('🛠 Build anything',buildItems())),")

# ---------------- 🧗 stand on things + ladder · 🪨 crawler climbs anything
rep("const g=H(WALK.pos.x,WALK.pos.z);WALK.vy-=9.8*dt;","const g=Math.max(H(WALK.pos.x,WALK.pos.z),surfY(WALK.pos.x,WALK.pos.z,WALK.pos.y+0.4));WALK.vy-=9.8*dt;")
rep("if(!hitTest(_p,0.3)&&!(inWater(nx,nz)&&H(nx,nz)<WATER_Y-0.6)){WALK.pos.x=nx;WALK.pos.z=nz;}","if(!hitTest(_p,0.3)&&!(inWater(nx,nz)&&H(nx,nz)<WATER_Y-0.6)){WALK.pos.x=nx;WALK.pos.z=nz;}else{const st=surfY(nx,nz,WALK.pos.y+1.3);if(st>WALK.pos.y+0.05&&st<WALK.pos.y+1.3){WALK.pos.x=nx;WALK.pos.z=nz;WALK.pos.y=st;WALK.vy=0;}}")
rep("if(hit){const sp=Math.hypot(v.x,v.z);D.pos.x=prev.x;D.pos.z=prev.z;v.x*=-0.35;v.z*=-0.35;","if(hit&&S.crawl&&thr>0.1){D.pos.x=prev.x;D.pos.z=prev.z;D.pos.y+=(1.6+Math.hypot(v.x,v.z)*0.5)*dt;D.climbing=0.35;D.air=false;v.y=0;D.pitch=lerp(D.pitch,-1.2,Math.min(1,dt*6));}\n  else if(hit){const sp=Math.hypot(v.x,v.z);D.pos.x=prev.x;D.pos.z=prev.z;v.x*=-0.35;v.z*=-0.35;")
rep("else{D.vy=climb;D.pos.y=gNext+S.legs;v.y=climb;D.onRamp=","else if(D.climbing>0&&D.pos.y>gNext+S.legs){D.climbing-=dt;v.y=0;}\n    else if(D.pos.y>gNext+S.legs+0.45&&climb<0){D.air=true;v.y=0;}\n    else{D.vy=climb;D.pos.y=gNext+S.legs;v.y=climb;D.onRamp=")
rep("const cabT=new THREE.Mesh(GEO.box,MAT.wood);cabT.scale.set(4,2.4,4);cabT.position.set(fx,fy+19.2,fz);scene.add(cabT);addBox(fx-2,fy+18,fz-2,fx+2,fy+20.4,fz+2);","ftCab(fx,fy,fz);")

# ---------------- 🟪 everything board · ↔ widen / thin / longer / shorter / squash ANY part
rep("board:['f4','f7'],shape:SHAPES","board:['f4','f7','any'],shape:SHAPES")
rep("outs:b.style==='f7'?8:4,","outs:b.style==='any'?99:b.style==='f7'?8:4,")
rep("max=bd.style==='f7'?8:4;","max=bd.style==='any'?99:bd.style==='f7'?8:4;")
rep("if(['body','arm','leg','skid','pad','guard','antenna','shape','wing','wheel','model'].includes(o.t)){toast('That part has no electronics to plug in',1500);return false;}","if(bd.style!=='any'&&['body','arm','leg','skid','pad','guard','antenna','shape','wing','wheel','model'].includes(o.t)){toast('That part has no electronics to plug in (the 🟪 Everything board takes anything)',1800);return false;}")
rep("WS.parts.filter(p=>['battery','rx','gps','sensor','buzzer','light','strip','camera'].includes(p.t))","WS.parts.filter(p=>bd.style==='any'?(p.t!=='board'&&p.t!=='motor'):['battery','rx','gps','sensor','buzzer','light','strip','camera'].includes(p.t))")
rep("{t:'board',ic:'🟢',n:'Flight board F7 (8 motors)',o:{style:'f7'}}","{t:'board',ic:'🟢',n:'Flight board F7 (8 motors)',o:{style:'f7'}},{t:'board',ic:'🟪',n:'EVERYTHING board (plug in anything, any number)',o:{style:'any',col:'#8a2be2'}}")
rep("sq:clamp(n(p.sq,1),0.15,6),","sq:clamp(n(p.sq,1),0.15,6),sx:clamp(n(p.sx,1),0.15,8),sz:clamp(n(p.sz,1),0.15,8),")
rep("if(p.sq&&p.sq!==1&&p.t!=='shape'&&p.t!=='wing'){r[1]*=p.sq;r[2]*=p.sq;}","if(p.sq&&p.sq!==1&&p.t!=='shape'&&p.t!=='wing'){r[1]*=p.sq;r[2]*=p.sq;}if(p.sx&&p.sx!==1)r[0]*=p.sx;if(p.sz&&p.sz!==1&&r[3]!==null)r[3]*=p.sz;")
rep("if(p.sq&&p.sq!==1&&p.t!=='shape'&&p.t!=='wing')g.scale.y*=p.sq;","if(p.sq&&p.sq!==1&&p.t!=='shape'&&p.t!=='wing')g.scale.y*=p.sq;if(p.sx&&p.sx!==1)g.scale.x*=p.sx;if(p.sz&&p.sz!==1)g.scale.z*=p.sz;")

# ---------------- 🔽 shrink / 🔼 expand (one part, or the whole build) — small parts weigh less
rep("const add=(g,x,y)=>{W+=g;cx+=g*x;cy+=g*y;};","let _mf=1;const add=(g,x,y)=>{g*=_mf;W+=g;cx+=g*x;cy+=g*y;};")
rep("P.forEach(p=>{if(p.t==='body')add(p.w*p.len*1.1,p.x,p.y);","P.forEach(p=>{_mf=['board','rx','gps','sensor','buzzer','camera','light','antenna','pad'].includes(p.t)?(p.sx||1)*(p.sz||1)*(p.sq||1):(p.t==='motor'||p.t==='sprop')?Math.min(1,Math.pow(p.r/6,1.2))*(p.sq||1):1;if(p.t==='body')add(p.w*p.len*1.1,p.x,p.y);")
rep("else if(p.t==='model')add(30*p.sc,p.x,p.y);});","else if(p.t==='model')add(30*p.sc,p.x,p.y);});_mf=1;")
rep("B('➖ shorter / smaller',()=>wsTool('short'));","B('➖ shorter / smaller',()=>wsTool('short'));B('🔽 SHRINK part',()=>wsTool('shrink'));B('🔼 EXPAND part',()=>wsTool('expand'));B('🔽 shrink WHOLE build',()=>wsTool('shrinkAll'));B('🔼 expand WHOLE build',()=>wsTool('expandAll'));")
rep("else if(p.t==='motor'||p.t==='sprop'){const sp=p.t==='sprop';add(new THREE.CylinderGeometry(0.012,0.012,0.02,10),","else if(p.t==='motor'||p.t==='sprop'){const sp=p.t==='sprop',hk=p.r<3?Math.max(0.2,p.r/3):1;add(new THREE.CylinderGeometry(0.012*hk,0.012*hk,0.02*hk,10),")
r=r.replace("const pr=p.r*cm,bg=new THREE.BoxGeometry(pr,0.003,Math.max(0.008,pr*0.18));","const pr=p.r*cm,bg=new THREE.BoxGeometry(pr,0.003,Math.max(0.002,pr*0.18));")
rep("let Tm=(I.rFwd+I.mFwd)/1000*9.8;","let Tm=Math.min((I.rFwd+I.mFwd)/1000*9.8,(I.W/1000)*9.8*4);")
# the new section
anchor="// ---------------------------------------------------------------- main loop"
rep(anchor,open('v9_section.js').read()+"\n"+open('uw_section.js').read()+"\n"+open('extra_section.js').read()+"\n"+open('track_section.js').read()+"\n"+open('build_section.js').read()+"\n"+open('surf_section.js').read()+"\n"+open('med3d_section.js').read()+"\n"+open('fire_section.js').read()+"\n"+open('island_section.js').read()+"\n"+open('camp_section.js').read()+"\n"+open('ai_section.js').read()+"\n"+open('camp2_section.js').read()+"\n"+open('misc2_section.js').read()+"\n"+open('danger_section.js').read()+"\n"+open('ai2_section.js').read()+"\n"+open('v23_section.js').read()+"\n"+open('v24_section.js').read()+"\n"+open('v25_section.js').read()+"\n"+open('v26_section.js').read()+"\n"+open('v27_section.js').read()+"\n"+open('v28_section.js').read()+"\n"+open('v29_section.js').read()+"\n"+open('v30_section.js').read()+"\n"+open('v31_section.js').read()+"\n"+open('v32_section.js').read()+"\n"+open('v33_section.js').read()+"\n"+open('v34_section.js').read()+"\n"+open('v35_section.js').read()+"\n"+open('v36_section.js').read()+"\n"+open('v37_section.js').read()+"\n"+open('v38_section.js').read()+"\n"+open('v39_section.js').read()+"\n"+open('v40_section.js').read()+"\n"+open('v41_section.js').read()+"\n"+open('v42_section.js').read()+"\n"+open('v43_section.js').read()+"\n"+open('v44_section.js').read()+"\n"+open('v45_section.js').read()+"\n"+open('v46_section.js').read()+"\n"+open('v47_section.js').read()+"\n"+open('v48_section.js').read()+"\n"+open('v49_section.js').read()+"\n"+open('v50_section.js').read()+"\n"+open('v51_section.js').read()+"\n"+open('v52_section.js').read()+"\n"+open('v53_section.js').read()+"\n"+open('v54_section.js').read()+"\n"+open('v55_section.js').read()+"\n"+open('v56_section.js').read()+"\n"+open('v57_section.js').read()+"\n"+open('v58_section.js').read()+"\n"+open('v59_section.js').read()+"\n"+anchor)
rep("get RCMAP(){return RCMAP;},","get RCMAP(){return RCMAP;},ECO,DMG,award,CB,comboTick,acroToggle,UW,SEA,seaEnter,seaExit,seaH,XT,xtAdd,aptDice,FIRE,fireStart,fireAdd,ISL,truckGoto,TRUCK,CAMPERS,AIB,aiSet,campAdd,aiHear,CONS,HURT,heal,DZ,dzSet,aiWhy,aiCanShare,AIREQ,aiFlip,BOTNET,ONL,onlHost,onlJoin,onlLeave,smartHear,cbOpen,cbClose,mapPanScreen,map3dOn,MAP3C,phoneShow,phoneUrl,trainDerail,trainRerail,putBackItems,TED,tedOpen,tedDone,boomStatic,GONE,AIX,aiChat,campApply,BM,bmSet,bmPlace,bmSwap,ASSIST,asSet,asRapid,CHUTE,chuteToggle,LOGS,logHit,TRAIN,trainToggle,MEGA,aiListModels,aiUrlFix,aiSwitch,aiApply,aiPlaces,dzDie,dzBotDie,XTRA,TROPHY,hikerStart,pkgStart,fireworks,shopItems,dmgAdd,ecoRestock,MB,mbPreset,mbIn,")
rep("if(f.t>4)f.m.position.y-=dt*0.6;","if(f.t>(f.stay||4))f.m.position.y-=dt*0.6;")
rep("Math.abs(fwd)>0.92?5.2:2.6","Math.abs(fwd)>0.92?12:6.5")
rep("if(!pe.tag)pe.tag=label(pe.name,0,0,0,1.5,'rgba(0,0,0,0.6)');pe.tag.position.set(pe.p.x,pe.p.y+Math.max(1.1,pe.rad*1.6),pe.p.z);","if(!pe.tag){pe.tag=label(pe.name,0,0,0,3.4,'rgba(0,0,0,0.65)');pe.tag.userData.s0=pe.tag.scale.clone();if(pe.tag.material){pe.tag.material.depthTest=false;pe.tag.material.depthWrite=false;pe.tag.material.fog=false;pe.tag.material.needsUpdate=true;}pe.tag.renderOrder=50;}{const dd=cam.position.distanceTo(pe.p),k=Math.max(1,dd/8);pe.tag.scale.copy(pe.tag.userData.s0).multiplyScalar(k);pe.tag.position.set(pe.p.x,pe.p.y+Math.max(1.6,pe.rad*1.6)+0.6*k,pe.p.z);}")
rep("const w=mapToWorld(e.clientX,e.clientY);MAP.px-=w.x-drag.w.x;MAP.pz-=w.z-drag.w.z;mapApply();});","const ddx=(e.clientX-(drag.lx!=null?drag.lx:drag.x))*(MAP.dpr||1),ddy=(e.clientY-(drag.ly!=null?drag.ly:drag.y))*(MAP.dpr||1);drag.lx=e.clientX;drag.ly=e.clientY;mapPanScreen(ddx,ddy);});")
rep("cx=D.pos.x+MAP.px,cz=D.pos.z+MAP.pz,","cx=(MAP.anc?MAP.anc.x:D.pos.x)+MAP.px,cz=(MAP.anc?MAP.anc.z:D.pos.z)+MAP.pz,")
rep("else if(a==='center'){MAP.px=MAP.pz=0;}","else if(a==='center'){MAP.px=MAP.pz=0;MAP.anc=null;}")
rep("if(MAP.mode==='corner'){MAP.px=MAP.pz=0;if(MED.on)medClose();}","if(MAP.mode==='corner'){MAP.px=MAP.pz=0;MAP.anc=null;if(MED.on)medClose();}")
rep("const show=CHAT.filter(c=>open||all||now-c.t<14000).slice(open?-12:-6);","const show=CHAT.filter(c=>open||all||now-c.t<30000).slice(open?-12:-5);")
rep("clamp(WPN.blast,0.5,CFG.real!==false?20:300),dr=clamp(WPN.destroy,0,CFG.real!==false?12:200)","clamp(WPN.blast,0.5,1e6),dr=clamp(WPN.destroy,0,1e6)")
rep("const lt=new THREE.PointLight(0xffaa55,3,r*6);lt.position.copy(p);scene.add(lt);","const lt=boomLight(p,r);")
rep("if(f.light)scene.remove(f.light);if(f.m.material&&f.m.material.dispose&&!f.keepMat)f.m.material.dispose();","if(f.light&&performance.now()>=f.light.userData.until-60)f.light.intensity=0;")
rep("if(hitTest(P,0.05)||P.y<gy||wet||objHitTest(P)){","if(hitTest(P,0.05)||P.y<gy||(wet&&s.w!=='rocket')||objHitTest(P)){")
rep("vf-=vf*(0.25+(Math.abs(thr)<0.02?0.6:0))*dt;","vf-=vf*(0.25+(Math.abs(thr)<0.02?((SPEC&&(SPEC.style==='tank'||SPEC.kit==='tank'))?0.75:0.32):0))*dt;")
rep("const yr=S.skid?steer*1.7*(vf<-0.3?-1:1):vf*Math.tan(sa)/S.wb;","let yr=S.skid?steer*1.7*(vf<-0.3?-1:1):vf*Math.tan(sa)/S.wb;{const gM=(S.grip||6)*2.4/Math.max(2,Math.abs(vf));if(!S.skid&&Math.abs(yr)>gM){const ex=Math.abs(yr)-gM;yr=Math.sign(yr)*(gM+ex*0.2);}}")
rep("if(splats.length>60){const o=splats.shift();scene.remove(o);}}","if(splats.length>60){const o=splats.shift();scene.remove(o);try{o.geometry.dispose();o.material.dispose();}catch(e){}}}")
rep("if(splats.length>60){const o=splats.shift();scene.remove(o);o.geometry.dispose();}}","if(splats.length>60){const o=splats.shift();scene.remove(o);o.geometry.dispose();try{o.material.dispose();}catch(e){}}}")
rep("if(f.t>=f.life){scene.remove(f.m);if(f.light&&","if(f.t>=f.life){scene.remove(f.m);if(!f.tree)geoDisp(f.m);if(f.light&&")
rep("function killShot(s){scene.remove(s.m);","function killShot(s){scene.remove(s.m);geoDisp(s.m);")
rep("function tntDel(T){scene.remove(T.g);","function tntDel(T){scene.remove(T.g);geoDisp(T.g);")
rep("if(f.t>=f.life){scene.remove(f.m);BIG.L.splice(i,1);}}","if(f.t>=f.life){scene.remove(f.m);geoDisp(f.m);BIG.L.splice(i,1);}}")
rep("if(BIG.L.length>60){BIG.L.splice(0,30).forEach(f=>scene.remove(f.m));}","if(BIG.L.length>60){BIG.L.splice(0,30).forEach(f=>{scene.remove(f.m);geoDisp(f.m);});}")
rep("' g · 🌀 '+I.n+' motors · 🛡 '","' g'+(I.n?' · 🌀 '+I.n+' motors':'')+' · 🛡 '")
rep("(I.topHeavy>4?' · <span style=\"color:#ff9f0a\">🏗 top-heavy — wobbly</span>':'')","(I.topHeavy>4&&I.n>0?' · <span style=\"color:#ff9f0a\">🏗 top-heavy — wobbly</span>':'')")
rep("' · ⚡ '+Math.round(st.top)+' m/s","' · ⚡ '+Math.round(/tank/.test(faTxt)&&st.top>8?Math.max(3.5,Math.min(8,st.top*0.36)):st.top)+' m/s")
open('rc.html','w').write(r);print('ok',len(r))
