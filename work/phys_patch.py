import shutil
shutil.copy('rc.html','rc_pre_phys.html')
r=open('rc.html').read()
assert 'planeAir(' not in r, 'already patched'
def rep(a,b,cnt=1):
    global r
    n=r.count(a)
    if n!=cnt: raise SystemExit('count %d for %r'%(n,a[:120]))
    r=r.replace(a,b)
# ---- real airflow: lift and drag come from the AIR speed (wind + gusts + turbulence), not the ground speed
rep("function tickPlane(dt,inp,prev){",
"""// the air the plane flies in: wind (weaker close to the ground) + gusts + bumpy air near the trees
const _va=new V3(),_pwv=new V3();
function planeAir(dt){const agl=Math.max(0,D.pos.y-H(D.pos.x,D.pos.z)),m=Math.hypot(wind.x,wind.z),g=clamp(0.55+agl/30,0.55,1.1),t=performance.now()/1000;
  const tb=CFG.turb===false?0:(0.13*m+0.06)*(agl<25?1.5:1);
  return _pwv.set(wind.x*g+tb*(Math.sin(t*1.7+D.pos.x*0.05)+Math.sin(t*3.1)*0.5),tb*0.8*(Math.sin(t*2.3+D.pos.z*0.07)+Math.sin(t*4.7+1)*0.4),wind.z*g+tb*(Math.sin(t*1.3+2)+Math.sin(t*2.9+D.pos.z*0.03)*0.5));}
function tickPlane(dt,inp,prev){""")
rep("  const v=D.vel,V=v.length(),Vf=v.dot(_f),gy=planeG(D.pos.x,D.pos.z),onG=D.pos.y<=gy+S.legs+0.02;",
    "  const v=D.vel,va=_va.copy(v).sub(planeAir(dt)),V=va.length(),Vf=va.dot(_f),gy=planeG(D.pos.x,D.pos.z),onG=D.pos.y<=gy+S.legs+0.02;")
# ---- prop torque / P-factor (swings left on take-off, like a real trainer), spins, and the plane's own weight (it doesn't snap instantly)
rep("  _q.setFromEuler(_ve.set(pr*dt,-yr*dt,-rr*dt,'XYZ'));P.multiply(_q);\n  // the nose follows the airflow (weathervane)",
"""  if(CFG.realPhys!==false){
    if(!SPEC.assist&&!rth&&!D.autoTO&&SPEC.wing!=='jet'){const slow=clamp(1-V/(S.stall*1.4),0,1);yr-=D.thr*0.32*slow*(onG?1:0.5);if(!onG)rr-=D.thr*0.22*slow;}
    if(stalled&&Math.abs(rud)>0.4&&!SPEC.assist){yr+=rud*2.2;rr+=rud*4;pr-=0.4;} // full stall + rudder = spin
    const tau=0.045+S.m*0.035,k=1-Math.exp(-dt/tau);D.avp=(D.avp||0)+(pr-(D.avp||0))*k;D.avr=(D.avr||0)+(rr-(D.avr||0))*k;D.avy=(D.avy||0)+(yr-(D.avy||0))*k;pr=D.avp;rr=D.avr;yr=D.avy;}
  _q.setFromEuler(_ve.set(pr*dt,-yr*dt,-rr*dt,'XYZ'));P.multiply(_q);
  // the nose follows the airflow (weathervane)""")
rep("  if(V>2&&!onG){_a.copy(v).normalize();","  if(V>2&&!onG){_a.copy(va).normalize();")
rep("  const vu=v.dot(_u),alpha=","  const vu=va.dot(_u),alpha=")
# ground effect: more lift in the last metre or so (floats on landing like a real plane)
rep("const lift=0.6*S.S*cl*Vf*Math.abs(Vf),drag=","const lift=0.6*S.S*cl*Vf*Math.abs(Vf)*(1+0.3*Math.exp(-Math.max(0,D.pos.y-gy-S.legs)/(S.L*1.2+0.3))),drag=")
rep("  if(V>0.01)_a.addScaledVector(v,-drag/m/V);\n  _a.addScaledVector(_r,-v.dot(_r)*0.7); // side-slip damping","  if(V>0.01)_a.addScaledVector(va,-drag/m/V);\n  _a.addScaledVector(_r,-va.dot(_r)*0.7); // side-slip damping (against the air: crosswind makes it crab like a real plane)")
rep("  // wind\n  v.x+=wind.x*dt*0.3;v.z+=wind.z*dt*0.3;\n","")
# ---- settings
rep("function flightItems(){return[\n","""function flightItems(){return[
  mItem(()=>'🎨 Graphics: '+(LOOK.on?'REALISTIC (real sky, sun shadows, photo grass, 3D trees)':'FAST (simple look for slow computers)'),()=>{CFG.look=LOOK.on?'fast':'real';saveCfg();toast('🎨 Restarting with the new look…',1500);setTimeout(()=>location.reload(),900);}),
  mInfo('🌳 Trees: EZ-Tree by Daniel Greenheck (MIT) · willow/birch/oak/poplar from 0 A.D. by Wildfire Games (CC-BY-SA 3.0) · grass photo: three.js examples'),
  mItem(()=>'✈️ Real flight physics: '+(CFG.realPhys!==false?'ON (prop torque, spins, weight, ground effect)':'off (simpler)'),()=>{CFG.realPhys=CFG.realPhys===false;saveCfg();}),
  mItem(()=>'🌬 Gusts + bumpy air: '+(CFG.turb!==false?'ON':'off'),()=>{CFG.turb=CFG.turb===false;saveCfg();}),
""")
open('rc.html','w').write(r);print('ok',len(r))
