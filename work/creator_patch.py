r=open('rc.html').read()
def rep(a,b,cnt=1):
    global r
    n=r.count(a)
    if n!=cnt: raise SystemExit('count %d for %r'%(n,a[:100]))
    r=r.replace(a,b)

# ---- part types + clean-up
rep("const PTYPES=['body','arm','motor','battery','camera','guard','light','leg','skid','pad','strip','antenna','board','rx','gps','sensor','buzzer'];",
"const PTYPES=['body','arm','motor','battery','camera','guard','light','leg','skid','pad','strip','antenna','board','rx','gps','sensor','buzzer','shape','rocket','jet','wprop','sprop','hover','wing','wheel','gun','model'];\nconst SHAPES=['box','sphere','cyl','cone','torus','disc','wedge','capsule','pyramid','ring'],SHAPEN={box:'🟥 box',sphere:'⚪ ball',cyl:'🥫 cylinder',cone:'🔺 cone',torus:'🍩 donut',disc:'🛸 saucer',wedge:'📐 wedge',capsule:'💊 capsule',pyramid:'🔻 pyramid',ring:'⭕ ring'},MATS=['solid','metal','glass','glow'];")
rep("const HDEF={board:3.4,","const HDEF={shape:0,rocket:0,jet:0,wprop:-2,sprop:1.4,hover:-3,wing:1,wheel:-6,gun:-3,model:0,board:3.4,")
old_clean=r[r.index("function cleanPart(p){"):r.index("function sanitize(s){")]
new_clean='''function cleanPart(p){const n=(v,d)=>isFinite(+v)&&v!==null&&v!==''?+v:d,t=p.t,big=400;
  const ST0={body:p.t==='body'?'box':null,board:'f4',camera:'gimbal',shape:'box',gun:'paint'},stOK={camera:['gimbal','fpv','action','box','pod'],body:['box','pod'],board:['f4','f7'],shape:SHAPES,gun:['paint','mg','rocket']};
  const style=stOK[t]&&stOK[t].includes(p.style)?p.style:(ST0[t]||(['gimbal','fpv','action','box','pod','f4','f7'].includes(p.style)?p.style:'gimbal'));
  return{t,x:clamp(n(p.x,0),-big,big),y:clamp(n(p.y,0),-big,big),h:clamp(n(p.h,HDEF[t]||0),-big,big),a:n(p.a,0),rx:n(p.rx,0),rz:n(p.rz,0),
  len:clamp(n(p.len,6),0.5,big),w:clamp(n(p.w,2),0.2,big),d:clamp(n(p.d,4),0.2,big),r:clamp(n(p.r,t==='pad'?1.5:6),0.3,200),pow:clamp(n(p.pow,5),1,50),col:String(p.col||'#9aa0a6').slice(0,9),bt:['LiPo','HV LiPo','Li-ion'].includes(p.bt)?p.bt:'LiPo',
  blades:[2,3,4,5].includes(+p.blades)?+p.blades:2,mode:['solid','strobe','rainbow'].includes(p.mode)?p.mode:'solid',style,mat:MATS.includes(p.mat)?p.mat:'solid',sc:clamp(n(p.sc,1),0.05,60),mid:String(p.mid||'').slice(0,40),nm:String(p.nm||'').slice(0,40),id:String(p.id||newPid()).slice(0,24)};}
'''
r=r.replace(old_clean,new_clean)
rep("if(Array.isArray(s.parts)){o.parts=s.parts.filter(p=>p&&PTYPES.includes(p.t)).slice(0,160).map(cleanPart);","if(Array.isArray(s.parts)){o.parts=s.parts.filter(p=>p&&PTYPES.includes(p.t)).slice(0,300).map(cleanPart);")

# ---- collision boxes for the new parts
rep("function partBox(p,strike){const r=(p.t==='body'?(p.style==='pod'?",
"function partBox(p,strike){const r=p.t==='shape'?[p.w/2,-p.d/2,p.d/2,p.len/2]:p.t==='rocket'||p.t==='jet'?[p.w/2,-p.w/2,p.w/2,p.len/2]:p.t==='wprop'?[p.r,-p.r,p.r,1.5]:p.t==='sprop'?[1.2,-1,1.9,1.2]:p.t==='hover'?[p.r,-1,1,p.r]:p.t==='wing'?[p.w/2,-p.d/2,p.d/2,p.len/2]:p.t==='wheel'?[p.w/2,-p.r,p.r,p.r]:p.t==='gun'?[1.6,-1.6,1.6,p.len/2]:p.t==='model'?[10*p.sc,-10*p.sc,10*p.sc,10*p.sc]:(p.t==='body'?(p.style==='pod'?")
# the old expression ends with ':[0.6,-0.4,0.4,0.6]);' -> needs a closing paren for the new ternary head
rep("p.t==='sensor'?[1,-0.5,0.5,0.5]:[0.6,-0.4,0.4,0.6]);","p.t==='sensor'?[1,-0.5,0.5,0.5]:[0.6,-0.4,0.4,0.6]));")

# ---- meshes for the new parts
rep("  else if(p.t==='motor'){add(new THREE.CylinderGeometry(0.012,0.012,0.02,10),mat('#202226'));",
"""  else if(p.t==='shape')g.add(shapeMesh(p,opt));
  else if(p.t==='rocket'){const R=p.w*cm/2,L=p.len*cm;const b=add(new THREE.CylinderGeometry(R,R,L*0.7,14),mat(p.col));b.rotation.x=Math.PI/2;const nz=add(new THREE.ConeGeometry(R,L*0.3,14),mat('#ff3030'),0,0,-L*0.5);nz.rotation.x=-Math.PI/2;
    const bell=add(new THREE.CylinderGeometry(R*0.6,R*0.95,L*0.12,14,1,true),mat('#333333'),0,0,L*0.41);bell.rotation.x=Math.PI/2;[0,1,2].forEach(k=>{const f=add(GEO.box,mat(p.col),Math.cos(k*2.1)*R*1.4,Math.sin(k*2.1)*R*1.4,L*0.28);f.scale.set(k===0?R*1.2:0.002,k===0?0.002:R*1.2,L*0.2);f.rotation.z=k*2.1;});
    if(!(opt&&opt.ghost)){const fl=add(new THREE.ConeGeometry(R*0.75,L*0.9,12),new THREE.MeshBasicMaterial({color:0xffa030,transparent:true,opacity:0.85,depthWrite:false}),0,0,L*0.92);fl.rotation.x=-Math.PI/2;g.userData.flame=fl;}}
  else if(p.t==='jet'){const R=p.w*cm/2,L=p.len*cm;const b=add(new THREE.CylinderGeometry(R,R*0.8,L,16),mat(p.col));b.rotation.x=Math.PI/2;const ring=add(new THREE.TorusGeometry(R*0.95,R*0.08,6,18),mat('#c0c0c0'),0,0,-L/2);
    const fan=add(new THREE.CylinderGeometry(R*0.85,R*0.85,0.002,12),mat('#555555'),0,0,-L/2+0.004);fan.rotation.x=Math.PI/2;
    if(!(opt&&opt.ghost)){const fl=add(new THREE.ConeGeometry(R*0.6,L*0.7,12),new THREE.MeshBasicMaterial({color:0x66b8ff,transparent:true,opacity:0.75,depthWrite:false}),0,0,L*0.85);fl.rotation.x=-Math.PI/2;g.userData.flame=fl;}}
  else if(p.t==='hover'){const R=p.r*cm;add(new THREE.CylinderGeometry(R,R*1.05,0.018,24),mat(p.col));const glow=add(new THREE.CylinderGeometry(R*0.8,R*0.8,0.004,24),new THREE.MeshBasicMaterial({color:0x55e0ff}),0,-0.011,0);g.userData.glow=glow;add(new THREE.TorusGeometry(R,0.004,6,28),new THREE.MeshBasicMaterial({color:0x55e0ff}),0,-0.006,0).rotation.x=Math.PI/2;}
  else if(p.t==='wing'){const w=add(GEO.box,mat(p.col),0,0,0);w.scale.set(p.w*cm,p.d*cm,p.len*cm);const lead=add(new THREE.CylinderGeometry(p.d*cm/2,p.d*cm/2,p.w*cm,8),mat(p.col),0,0,-p.len*cm/2);lead.rotation.z=Math.PI/2;
    [-1,1].forEach(s=>add(GEO.box,mat('#ff3030'),s*p.w*cm/2,0,0).scale.set(0.004,p.d*cm*1.3,p.len*cm*0.6));}
  else if(p.t==='wheel'){const R=p.r*cm,W=p.w*cm;const t=add(new THREE.CylinderGeometry(R,R,W,18),mat('#151515'));t.rotation.z=Math.PI/2;const hb=add(new THREE.CylinderGeometry(R*0.5,R*0.5,W*1.04,10),mat(p.col));hb.rotation.z=Math.PI/2;g.userData.wheel=true;}
  else if(p.t==='gun'){const L=p.len*cm;const gm=gunMesh(p.style,L);g.add(gm);const mz=new THREE.Object3D();mz.position.set(0,0,-L*0.65);g.add(mz);g.userData.gunW=p.style;g.userData.muzzle=mz;}
  else if(p.t==='model'){const o=modelObj(p,opt);g.add(o);}
  else if(p.t==='wprop'){const pr=p.r*cm;const hub=add(new THREE.CylinderGeometry(0.008,0.012,0.03,10),mat('#202226'));hub.rotation.x=Math.PI/2;const pg=new THREE.Group();pg.position.z=0.017;pg.rotation.x=Math.PI/2;g.add(pg);const bg=new THREE.BoxGeometry(pr,0.003,Math.max(0.008,pr*0.32));bg.translate(pr/2,0,0);for(let k=0;k<3;k++){const b=new THREE.Mesh(bg,mat(p.col));b.rotation.y=k*2*Math.PI/3;pg.add(b);}g.userData.wpg=pg;}
  else if(p.t==='motor'||p.t==='sprop'){const sp=p.t==='sprop';add(new THREE.CylinderGeometry(0.012,0.012,0.02,10),mat(sp?'#5a2b8a':'#202226'));if(sp){const rg=add(new THREE.TorusGeometry(p.r*cm*1.02,0.003,6,32),new THREE.MeshBasicMaterial({color:0xbf5af2}),0,0.016,0);rg.rotation.x=Math.PI/2;}""")
rep("""    for(let k=0;k<n;k++){const b=add(bg,mat(p.col),0,0.016,0);b.rotation.y=k*2*Math.PI/n;}
    add(new THREE.CylinderGeometry(pr,pr,0.001,24),""","""    for(let k=0;k<n;k++){const b=add(bg,mat(p.col),0,0.016,0);b.rotation.y=k*2*Math.PI/n;}
    add(new THREE.CylinderGeometry(pr,pr,0.001,24),""")
rep("const WCOL={motor:0xff4040,","function shapeMesh(p,opt){const cm=0.01,w=p.w*cm,l=p.len*cm,d=p.d*cm,st=p.style;let geo;\n  if(st==='sphere')geo=new THREE.SphereGeometry(0.5,20,14);else if(st==='cyl')geo=new THREE.CylinderGeometry(0.5,0.5,1,20);else if(st==='cone')geo=new THREE.ConeGeometry(0.5,1,20);else if(st==='pyramid')geo=new THREE.ConeGeometry(0.5,1,4);\n  else if(st==='torus')geo=new THREE.TorusGeometry(0.38,0.12,10,28).rotateX(Math.PI/2);else if(st==='ring')geo=new THREE.TorusGeometry(0.45,0.05,8,32).rotateX(Math.PI/2);else if(st==='disc'){const pts=[];for(let i=0;i<=12;i++){const a=i/12*Math.PI;pts.push(new THREE.Vector2(Math.sin(a)*0.5,Math.cos(a)*0.5*(i<6?0.55:0.3)));}geo=new THREE.LatheGeometry(pts,28);}\n  else if(st==='capsule'){const pts=[];for(let i=0;i<=16;i++){const a=i/16*Math.PI,y=Math.cos(a);pts.push(new THREE.Vector2(Math.sin(a)*0.5,y*0.5+(i<8?0:0)));}geo=new THREE.LatheGeometry(pts,18);}\n  else if(st==='wedge'){const s=new THREE.Shape();s.moveTo(-0.5,-0.5);s.lineTo(0.5,-0.5);s.lineTo(-0.5,0.5);s.closePath();geo=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false});geo.translate(0,0,-0.5);geo.rotateY(Math.PI/2);}\n  else geo=new THREE.BoxGeometry(1,1,1);\n  const col=new THREE.Color(p.col);let m;if(opt&&opt.ghost)m=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.33,depthWrite:false});else if(p.mat==='glow')m=new THREE.MeshBasicMaterial({color:col});else if(p.mat==='glass')m=new THREE.MeshPhongMaterial({color:col,transparent:true,opacity:0.42,shininess:90,depthWrite:false});else if(p.mat==='metal')m=new THREE.MeshPhongMaterial({color:col,shininess:110,specular:0x999999});else m=new THREE.MeshLambertMaterial({color:col});\n  const o=new THREE.Mesh(geo,m);o.scale.set(w,d,l);return o;}\nconst WCOL={motor:0xff4040,")
open('rc.html','w').write(r);print('ok')
