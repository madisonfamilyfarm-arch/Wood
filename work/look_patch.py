import shutil
shutil.copy('rc.html','rc_pre_look.html')
r=open('rc.html').read()
assert 'REALISTIC LOOK' not in r, 'already patched'
def rep(a,b,cnt=1):
    global r
    n=r.count(a)
    if n!=cnt: raise SystemExit('count %d for %r'%(n,a[:120]))
    r=r.replace(a,b)
rep("const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});",
    "const renderer=new THREE.WebGLRenderer({canvas,antialias:CFG.look!=='fast',powerPreference:'high-performance'});")
# section goes right after the shared materials
a="function label(text,x,y,z,w,bg){"
rep(a,open('tex_data.js').read()+'if(CFG.look!=="fast"){\n'+open('lensflare_r128.js').read()+'\n}\n'+open('ez_bundle.js').read()+'\n'+open('zad_trees.js').read()+'\n'+open('look_section.js').read()+"\n"+a)
# time of day drives the real sky
rep("  document.body.classList.toggle('night',h<5.5||h>20.2);}","  document.body.classList.toggle('night',h<5.5||h>20.2);if(typeof lookTOD==='function')lookTOD(h);}")
# trees: baked impostors (collision stays the same)
i=r.index("  const nP=ch.trees.filter(t=>t.pine).length,nB=ch.trees.length-nP;")
j=r.index("  [trunks,cones,balls].forEach(o=>{if(o.count){scene.add(o);ch.objs.push(o);}});\n")+len("  [trunks,cones,balls].forEach(o=>{if(o.count){scene.add(o);ch.objs.push(o);}});\n")
old=r[i:j]
decl="  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new V3(),pp=new V3(),c=new THREE.Color();let ic=0,ib=0;\n"
assert old.count(decl)==1
old=old.replace(decl,"")
r=r[:i]+decl+"  if(LKT){ch.trees.forEach(t=>{const th=t.pine?t.h*0.45:t.h*0.32;addVCyl(t.x,t.z,t.tr,t.y-1,t.y+th);if(t.pine)t.cc=addCone(t.x,t.z,t.cr,t.y+t.h*0.22,t.y+t.h);else t.cc=addSph(t.x,t.y+t.h*0.72,t.z,t.cr);});lkTrees(ch.trees,ch.objs);}else{\n"+old+"  }\n"+r[j:]
# view distance + per-frame work
rep("  else if(cam.far!==260){cam.far=260;cam.updateProjectionMatrix();}}","  else{const f=camFar0();if(cam.far!==f){cam.far=f;cam.updateProjectionMatrix();}}}\nfunction camFar0(){return LOOK.on?2600:260;}")
rep("cam.far=lerp(260,9000,k);","cam.far=lerp(camFar0(),9000,k);")
rep("tickWind(dt);spaceRestore();WX.tick(dt);","tickWind(dt);spaceRestore();lookTick(dt);WX.tick(dt);")
# shiny painted RC models
rep("function vMat(c,opt){return opt&&opt.ghost?new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.33,depthWrite:false}):new THREE.MeshLambertMaterial({color:c});}",
    "function vMat(c,opt){return opt&&opt.ghost?new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.33,depthWrite:false}):LOOK.on?new THREE.MeshPhysicalMaterial({color:c,roughness:0.38,metalness:0.04,clearcoat:0.75,clearcoatRoughness:0.12}):new THREE.MeshLambertMaterial({color:c});}")
rep("get RCMAP(){return RCMAP;},","get RCMAP(){return RCMAP;},LOOK,LKT,LKN,lkSky,lkClouds,lkEnvUpdate,")
open('rc.html','w').write(r);print('ok',len(r))
