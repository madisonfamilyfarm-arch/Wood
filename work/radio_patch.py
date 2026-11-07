import shutil
shutil.copy('rc.html','rc_pre_radio.html')
r=open('rc.html').read()
assert 'radio: rates' not in r, 'already patched'
def rep(a,b,cnt=1):
    global r
    n=r.count(a)
    if n!=cnt: raise SystemExit('count %d for %r'%(n,a[:120]))
    r=r.replace(a,b)
# ---------- detailed plane with moving control surfaces
i=r.index('function buildPlane(sp,opt){');j=r.index('function buildBlimp(')
r=r[:i]+r'''function buildPlane(sp,opt){
  const g=new THREE.Group(),C=sp.colors,mb=vMat(C.body,opt),mw=vMat(C.wing,opt),mt=vMat(C.trim,opt),dark=vMat('#202226',opt),s=sp.span,L=s*0.75,w=sp.wing,surf={};
  const hinge=(par,px,py,pz,sx,sy,sz,m)=>{const h=new THREE.Group();h.position.set(px,py,pz);par.add(h);vBox(h,m,sx,sy,sz,0,0,sz/2);return h;}; // hinge line at the front edge, the surface trails behind it
  const glassM=opt&&opt.ghost?vMat('#9fd3ff',opt):new THREE.MeshLambertMaterial({color:'#9fd3ff',transparent:true,opacity:0.6});
  if(w!=='flying'){
    // round, tapered fuselage
    const f1=new THREE.Mesh(new THREE.CylinderGeometry(s*0.05,s*0.05,L*0.45,14),mb);f1.rotation.x=Math.PI/2;f1.scale.set(1,1,1.12);f1.position.z=-L*0.275;g.add(f1);
    const f2=new THREE.Mesh(new THREE.CylinderGeometry(s*0.018,s*0.05,L*0.55,14),mb);f2.rotation.x=Math.PI/2;f2.scale.set(1,1,1.12);f2.position.z=L*0.225;g.add(f2);
    vBox(g,mt,s*0.103,s*0.016,L*0.45,0,-s*0.005,-L*0.275);
    if(w==='jet'){const nose=new THREE.Mesh(new THREE.ConeGeometry(s*0.05,s*0.16,14),mb);nose.rotation.x=-Math.PI/2;nose.position.z=-L/2-s*0.08;g.add(nose);}
    else{const cowl=new THREE.Mesh(new THREE.CylinderGeometry(s*0.046,s*0.053,s*0.09,16),mt);cowl.rotation.x=Math.PI/2;cowl.position.z=-L/2-s*0.04;g.add(cowl);
      const spin=new THREE.Mesh(new THREE.ConeGeometry(s*0.03,s*0.065,14),mt);spin.rotation.x=-Math.PI/2;spin.position.z=-L/2-s*0.12;g.add(spin);}
    const cab=new THREE.Mesh(new THREE.SphereGeometry(s*0.045,12,8),glassM);cab.scale.set(1,0.85,2.1);cab.position.set(0,s*0.05,-L*0.16);g.add(cab);
    const head=new THREE.Mesh(new THREE.SphereGeometry(s*0.016,8,6),vMat('#d9a77f',opt));head.position.set(0,s*0.065,-L*0.15);g.add(head);}
  const chord=s*({flying:0.3,jet:0.22,ultra:0.13,glider:0.07}[w]||0.17),wy={high:s*0.06,low:-s*0.04,bi:s*0.08,ultra:s*0.11,jet:-s*0.02}[w]||0,wz=-L*0.12,th=s*0.018;
  if(w==='flying'){surf.elevon=[];
    [-1,1].forEach(sd=>{const wg=new THREE.Group();wg.position.set(sd*s/4,0,chord*0.35);wg.rotation.y=-sd*0.45;g.add(wg);vBox(wg,mw,s/2,s*0.03,chord*0.78,0,0,-chord*0.11);
      surf.elevon.push(hinge(wg,sd*s*0.1,0,chord*0.28,s*0.24,th,chord*0.22,mt));vBox(g,mt,s*0.012,s*0.08,chord*0.6,sd*s*0.46,s*0.03,chord*0.75);});
    vBox(g,mb,s*0.12,s*0.07,chord*1.1,0,0.01,0);const cab=new THREE.Mesh(new THREE.SphereGeometry(s*0.04,10,8),glassM);cab.scale.set(1,0.7,1.8);cab.position.set(0,s*0.04,-chord*0.2);g.add(cab);}
  else{
    vBox(g,mw,s,s*0.022,chord*0.74,0,wy,wz-chord*0.13);vBox(g,mw,s*0.1,th,chord*0.26,0,wy,wz+chord*0.37);
    [-1,1].forEach(sd=>vBox(g,mt,s*0.15,s*0.024,chord*0.745,sd*s*0.43,wy,wz-chord*0.13));
    surf.flap=[-1,1].map(sd=>hinge(g,sd*s*0.175,wy,wz+chord*0.24,s*0.25,th,chord*0.26,mw));
    surf.ail=[-1,1].map(sd=>hinge(g,sd*s*0.4,wy,wz+chord*0.24,s*0.2,th,chord*0.26,mt));
    if(w==='bi'){vBox(g,mw,s*0.92,s*0.022,chord,0,-s*0.06,-L*0.12+chord*0.15);[-1,1].forEach(sd=>vBox(g,mt,s*0.01,s*0.14,s*0.01,sd*s*0.33,s*0.01,-L*0.12));}
    if(w==='ultra'){[-1,1].forEach(sd=>{const st=vBox(g,dark,s*0.008,s*0.008,s*0.25,sd*s*0.12,s*0.05,-L*0.12);st.rotation.z=sd*0.9;});}
    if(w==='high')[-1,1].forEach(sd=>{const st=vBox(g,dark,s*0.007,Math.hypot(s*0.16,wy+s*0.03),s*0.007,sd*s*0.12,(wy-s*0.03)/2,wz);st.rotation.z=-sd*Math.atan2(s*0.16,wy+s*0.03);});
    // tail: fixed stabiliser + moving elevator, fixed fin + moving rudder
    const tz=L*0.45,tc=chord*0.6;vBox(g,mw,s*0.36,s*0.016,tc*0.6,0,s*0.01,tz-tc*0.2);surf.elev=hinge(g,0,s*0.01,tz+tc*0.1,s*0.36,s*0.014,tc*0.4,mt);
    vBox(g,mt,s*0.012,s*0.14,tc*0.6,0,s*0.08,tz-tc*0.2);surf.rud=hinge(g,0,s*0.08,tz+tc*0.1,s*0.011,s*0.14,tc*0.4,mb);}
  const props=[];
  if(w==='jet'){const duct=new THREE.Mesh(new THREE.CylinderGeometry(s*0.05,s*0.05,s*0.2,12,1,true),dark);duct.rotation.x=Math.PI/2;duct.position.set(0,s*0.04,L*0.35);g.add(duct);props.push(vProp(g,'#888888',s*0.045,7,opt,0,s*0.04,L*0.3,'z'));}
  else if(w==='flying'){props.push(vProp(g,C.trim,s*0.11,2,opt,0,0,chord*0.85,'z'));}
  else props.push(vProp(g,'#2a2a2a',s*0.13,2,opt,0,0,-L/2-s*0.11,'z'));
  const gh=0.12+s*0.05;if(w==='glider')props.length&&props[0].g.scale.setScalar(0.6);
  if(sp.gear!=='none'){const wheel=(x,z,r,pant)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,r*0.6,14),dark);t.rotation.z=Math.PI/2;t.position.set(x,-gh/PSC+r,z);g.add(t);
      const hub=new THREE.Mesh(new THREE.CylinderGeometry(r*0.4,r*0.4,r*0.62,8),vMat('#c8c8c8',opt));hub.rotation.z=Math.PI/2;hub.position.copy(t.position);g.add(hub);
      const leg=vBox(g,dark,0.01,gh/PSC-r,0.01,x,(-gh/PSC+r)/2,z);
      if(pant){const p=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),mb);p.scale.set(r*0.42,r*0.85,r*1.9);p.position.set(x,-gh/PSC+r*1.25,z+r*0.15);g.add(p);}};
    const r=s*0.035,pants=w!=='jet'&&w!=='glider'&&w!=='ultra';if(sp.gear==='trike'){wheel(-s*0.12,-L*0.08,r,pants);wheel(s*0.12,-L*0.08,r,pants);wheel(0,-L*0.42,r*0.85);}else{wheel(-s*0.12,-L*0.28,r,pants);wheel(s*0.12,-L*0.28,r,pants);wheel(0,L*0.47,r*0.5);}}
  const fx=[];[[-s/2,0xff3030],[s/2,0x30ff60]].forEach(q=>{const m=new THREE.MeshBasicMaterial({color:q[1]});const b=new THREE.Mesh(new THREE.SphereGeometry(s*0.015,6,4),m);b.position.set(q[0],wy,-L*0.12);g.add(b);fx.push({mode:'solid',col:'',m});});
  const strobe=new THREE.MeshBasicMaterial({color:0xffffff});const sb=new THREE.Mesh(new THREE.SphereGeometry(s*0.013,6,4),strobe);sb.position.set(0,s*0.16,L*0.47);g.add(sb);fx.push({mode:'strobe',col:'#ffffff',m:strobe});
  g.scale.setScalar(PSC);
  const ext=s*PSC/2,layout={scaled:true,bodies:[{x:0,z:0,w:s*0.1*PSC,l:L*PSC,rot:0,col:C.body},{x:0,z:-L*0.12*PSC,w:s*PSC,l:chord*PSC,rot:0,col:C.wing},{x:0,z:L*0.45*PSC,w:s*0.36*PSC,l:chord*0.6*PSC,rot:0,col:C.wing}],rods:[],bats:[],ext};
  props.forEach(P=>{P.p2=[P.g.position.x*PSC,P.g.position.z*PSC];});
  return{g,arms:[],props,fx,surf,camLocal:new V3(0,s*0.08*PSC,-L*0.25*PSC),sp,layout};}
'''+r[j:]
# ---------- plane flight: preflight surface check on the ground, radio rates/expo/trim, flaps, throttle cut, rescue
rep("    if(D.lock){return;}\n    if(!D.armed){","    if(D.lock){return;}\n    csSet(rdIn(inp.rx,'a'),rdIn(CFG.realElev?-inp.ry:inp.ry,'e'),rdIn(inp.lx,'r'),dt);\n    if(!D.armed){")
rep("  if(!D.armed)D.thr=0;\n  if(D.autoLand||D.batt<=0)D.thr=0;","  if(!D.armed||D.thrCut)D.thr=0;\n  if(D.autoLand||D.batt<=0)D.thr=0;")
rep("  let ail=inp.rx,ele=CFG.realElev?-inp.ry:inp.ry,rud=inp.lx;D.airT=","  let ail=rdIn(inp.rx,'a'),ele=rdIn(CFG.realElev?-inp.ry:inp.ry,'e'),rud=rdIn(inp.lx,'r');D.airT=")
rep("  const auth=clamp(Math.max(Vf/(S.stall*1.2),0)+D.thr*0.25,0.08,1),stalled=!onG&&Vf<S.stall*0.82;",
    "  if(D.rescue>0&&!onG){D.rescue-=dt;ail=clamp(-bank*2.5,-1,1);ele=clamp((0.25-pitchA)*2.5,-1,1);rud=0;if(!D.thrCut)D.thr=Math.max(D.thr,0.75);if(Math.abs(bank)<0.15&&pitchA>0.1&&D.rescue<2)D.rescue=0;}\n  const fl=D.flaps||0,stallK=0.82-fl*0.14;\n  const auth=clamp(Math.max(Vf/(S.stall*1.2),0)+D.thr*0.25,0.08,1),stalled=!onG&&Vf<S.stall*stallK;")
rep("  if(stalled){pr=pr*0.4-0.6;","  csSet(ail,ele,rud,dt);if(fl&&!onG&&!SPEC.assist)pr+=fl*0.12*auth;\n  if(stalled){pr=pr*0.4-0.6;")
rep("cl=stalled?clamp(alpha*2,-0.5,0.5):clamp(0.25+alpha*4.6,-S.clmax,S.clmax);","cl=stalled?clamp(alpha*2,-0.5,0.5):clamp(0.25+fl*0.35+alpha*4.6,-S.clmax,S.clmax+fl*0.45);")
rep("drag=S.kd*V*V+Math.abs(lift)*0.04+(onG?0:0);","drag=S.kd*V*V*(1+fl*0.9)+Math.abs(lift)*0.04;")
# ---------- frame: pause / slow motion, smoke, lessons
rep("  if(started&&$('gal').style.display!=='block')tickDrone(dt,WALK.on?Z0:inp);","  if(started&&$('gal').style.display!=='block'&&!SIM.pause)tickDrone(dt*SIM.speed,WALK.on?Z0:inp);")
rep("tickMixers(dt);tickFlames(dt);tickSound(dt);","tickMixers(dt);tickFlames(dt);tickSound(dt);tickSmoke(dt*(SIM.pause?0:SIM.speed));tickLessons(dt*(SIM.pause?0:SIM.speed));")
# ---------- multiplayer: control surfaces + smoke show on the other computer
rep("pr:DR.props.map(P=>P.state[0]).join(''),ab:","pr:DR.props.map(P=>P.state[0]).join(''),...(DR.surf?{cs:D.cs.map(r2)}:{}),...(D.smoke?{sm:RADIO.smokeCol}:{}),ab:")
rep("pe.sp=+m.sp||0;","pe.sp=+m.sp||0;pe.cs=m.cs||null;pe.sm=m.sm||'';")
rep("tickFx(pe.mesh,t);\n","tickFx(pe.mesh,t);if(pe.cs)csApply(pe.mesh,pe.cs);\n")
# ---------- switches / buttons / keys
rep("  ({takeoff:()=>takeoff(),","  ({smoke:smokeToggle,pause:pauseToggle,slowmo:slowCycle,rescue:rescue,flapcyc:flapCycle,takeoff:()=>takeoff(),")
rep("function applyStateAct(a,pos,quiet){\n","function applyStateAct(a,pos,quiet){\n  if(radioState(a,pos,quiet))return;\n")
rep("else if(k==='Digit3')setSpeed('SPORT');","else if(k==='Digit3')setSpeed('SPORT');else if(k==='KeyZ'||k==='Pause')pauseToggle();else if(k==='KeyN')slowCycle();else if(k==='KeyU')flapCycle();else if(k==='KeyO')cutSet(!D.thrCut);else if(k==='KeyY')smokeToggle();else if(k==='KeyI')ratesSet(RADIO.rate==='low'?'high':'low');else if(k==='KeyT')rescue();")
# ---------- menu
rep("  mItem('⚙️ Flight settings ▸',()=>menuPush('⚙️ Flight settings',flightItems())),",
    "  mItem('🎓 Flight lessons & challenges ▸',()=>menuPush('🎓 Flight lessons',lessonItems())),\n  mItem('📻 Radio: rates, trims, flaps, smoke, pause ▸',()=>menuPush('📻 Radio',radioItems())),\n  mItem('⚙️ Flight settings ▸',()=>menuPush('⚙️ Flight settings',flightItems())),")
# ---------- HUD
rep("+(SPEC.assist?'SAFE':'ACRO')+(D.autoTO?","+(SPEC.assist?'SAFE':'ACRO')+(RADIO.rate==='low'?' · LOW RATES':'')+(D.flaps?' · FLAPS '+(D.flaps>=1?'FULL':'HALF'):'')+(D.thrCut?' · ✋ CUT':'')+(D.smoke?' · 💨':'')+(D.autoTO?")
# ---------- section + test hooks
anchor="// ---------------------------------------------------------------- main loop"
rep(anchor,open('radio_section.js').read()+'\n'+anchor)
rep("get RCMAP(){return RCMAP;},","get RCMAP(){return RCMAP;},RADIO,SIM,LES,LESSONS,lesStart,lesStop,csApply,flapSet,cutSet,smokeToggle,pauseToggle,slowCycle,rescue,SMK,")
open('rc.html','w').write(r);print('ok',len(r))
