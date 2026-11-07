import shutil
shutil.copy('rc.html','rc_pre_apt.html')
r=open('rc.html').read()
assert 'function fldBuild' not in r, 'already patched'
def rep(a,b,cnt=1):
    global r
    n=r.count(a)
    if n!=cnt: raise SystemExit('count %d for %r'%(n,a[:120]))
    r=r.replace(a,b)
rep("const AIRCLEAR={x0:-205,x1:-18,z0:-96,z1:-42};\n","const AIRCLEAR={x0:-205,x1:-18,z0:-96,z1:-42};\n"+open('apt_core.js').read())
rep("function H(x,z){\n  let h=rawH(x,z);","function H(x,z){return fldFlat(x,z,H0(x,z));}\nfunction H0(x,z){\n  let h=rawH(x,z);")
rep("function blocked(x,z){\n","function blocked(x,z){\n  if(fldBlocked(x,z))return true;\n")
# the old runway/hangar/windsock are now built by the airport section (realistic)
i=r.index("  const asph=new THREE.MeshLambertMaterial({color:0x50565e}),white=new THREE.MeshLambertMaterial({color:0xf2f2f2});")
j=r.index("  // dirt track ribbon")
r=r[:i]+"  if(CFG.map==='classic'){ // 🌲 classic map: the original airstrip, hangar and windsock\n"+r[i:j]+"  }\n"+r[j:]
anchor="// ---------------------------------------------------------------- main loop"
rep(anchor,open('apt_build.js').read().replace("  const rm=aptRealMap();if(!FLD.on||","  const rm=aptRealMap();if(CFG.map==='classic'){aptAfter();return;}if(!FLD.on||")+"\nsetTimeout(fldBuild,0);\n"+anchor)
rep("function kindStart(){const k=vkind();if(k==='boat')return{x:LAKE.x-LAKE.rx+7,z:LAKE.z,yaw:-Math.PI/2};if(k==='plane')return{",
    "function kindStart(){const k=vkind();if(k==='boat')return{x:LAKE.x-LAKE.rx+7,z:LAKE.z,yaw:-Math.PI/2};if(k==='plane'&&FLD.on&&FU.built)return fldStart('plane');if(k==='plane')return{")
rep("function pilotPos(){return WALK.on?WALK.pos:(WALK.pilotAt||_pp.set(D.home.x+1.8,D.home.y,D.home.z+2.6));}",
    "function pilotPos(){return WALK.on?WALK.pos:(WALK.pilotAt||(vkind()==='plane'&&FU.station&&FU.station.distanceTo(D.home)<120?FU.station:_pp.set(D.home.x+1.8,D.home.y,D.home.z+2.6)));}")
rep("  tickMixers(dt);tickFlames(dt);","  fldTick(t);tickMixers(dt);tickFlames(dt);")
# same airport for everyone
rep("tod:CFG.tod,real:CFG.real!==false};}","tod:CFG.tod,real:CFG.real!==false,fld:Object.assign({},FLD)};}")
rep("  if(w.real!=null&&w.real!==(CFG.real!==false)){CFG.real=w.real;saveCfg();realChanged(true);}\n",
    "  if(w.real!=null&&w.real!==(CFG.real!==false)){CFG.real=w.real;saveCfg();realChanged(true);}\n  if(w.fld&&JSON.stringify(w.fld)!==JSON.stringify(FLD)){Object.assign(FLD,w.fld);fldSave();fldBuild();}\n")
rep("if(a.real!==b.real)L.push(b.real?'🌍 real-world mode ON':'🌍 real-world mode OFF (anything goes)');return L.join(', ');}",
    "if(a.real!==b.real)L.push(b.real?'🌍 real-world mode ON':'🌍 real-world mode OFF (anything goes)');if(b.fld&&a.fld&&JSON.stringify(a.fld)!==JSON.stringify(b.fld))L.push('the airport');return L.join(', ');}")
rep("  mItem('⚙️ Flight settings ▸',()=>menuPush('⚙️ Flight settings',flightItems())),",
    "  mItem(()=>'🛫 Airport: '+(FLD.style==='old'?'old airport':'RC club field')+' ▸',()=>menuPush('🛫 Airport',fldItems())),\n  mItem('⚙️ Flight settings ▸',()=>menuPush('⚙️ Flight settings',flightItems())),")
rep("get RCMAP(){return RCMAP;},","get RCMAP(){return RCMAP;},FLD,FU,fldBuild,aptPick,fldStart,")
open('rc.html','w').write(r);print('ok',len(r))
