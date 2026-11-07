// ================================================================ 🐟 UNDERWATER: a deep lake with weeds, lily pads, rocks, fish, a sunken boat + treasure,
// and a glowing tunnel on the bottom that takes the submarine to the 🌊 SEA (coral reef, kelp forest, shipwreck, shark, whale, turtles, jellyfish, an island).
const UW={g:null,fish:[],uT:{value:0},on:false,saved:null,hid:[],bub:[],chests:[],portal:null,sea:null,fade:0};
const SEA={y:-400,R:340,x:LAKE.x,z:LAKE.z,g:null,hid:null,built:false};
function uwRnd(s){let a=s|0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
// one geometry from several (all made non-indexed, position + normal + optional colour)
function uwMerge(list){let n=0;const parts=list.map(([g,col])=>{const q=g.index?g.toNonIndexed():g;n+=q.attributes.position.count;return[q,col];});
  const P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Float32Array(n*3);let o=0;const c=new THREE.Color();
  parts.forEach(([q,col])=>{const k=q.attributes.position.count;P.set(q.attributes.position.array,o*3);N.set(q.attributes.normal.array,o*3);c.set(col||'#ffffff');for(let i=0;i<k;i++){C[(o+i)*3]=c.r;C[(o+i)*3+1]=c.g;C[(o+i)*3+2]=c.b;}o+=k;});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));return g;}
// weeds/kelp that sway in the current
function uwSwayMat(col,amt){const m=new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide});
  m.onBeforeCompile=sh=>{sh.uniforms.uT=UW.uT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*0.7+instanceMatrix[3].z*0.5;\n#else\nfloat ph=0.0;\n#endif\nfloat k=pow(max(position.y,0.0),1.5);transformed.x+=sin(uT*1.4+ph)*k*'+amt.toFixed(3)+';transformed.z+=cos(uT*1.1+ph*1.3)*k*'+(amt*0.6).toFixed(3)+';');};
  m.customProgramCacheKey=()=>'uwsway'+amt;return m;}
function uwWeeds(g,pts,hFn,col,amt){const geo=new THREE.PlaneGeometry(0.22,1,1,6);geo.translate(0,0.5,0);const im=new THREE.InstancedMesh(geo,uwSwayMat(col,amt),pts.length);
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new V3(),p=new V3(),c=new THREE.Color();
  pts.forEach((pt,i)=>{const h=hFn(pt);m.compose(p.set(pt[0],pt[1],pt[2]),q.setFromAxisAngle(UP,pt[3]*6.28),s.set(0.6+pt[3]*0.8,h,1));im.setMatrixAt(i,m);c.set(col).offsetHSL((pt[3]-0.5)*0.06,0,(pt[3]-0.5)*0.15);im.setColorAt(i,c);});g.add(im);return im;}
// fish: body + tail + fin, coloured; a school swims a looping path and scatters from you
function uwFishGeo(len){const b=new THREE.SphereGeometry(0.5,10,7);b.scale(0.36,0.5,1);const t=new THREE.ConeGeometry(0.26,0.4,4);t.rotateX(-Math.PI/2);t.scale(0.25,1,1);t.translate(0,0,0.62);
  const f=new THREE.ConeGeometry(0.12,0.3,3);f.translate(0,0.32,0.05);const e1=new THREE.SphereGeometry(0.06,6,4);e1.translate(0.15,0.08,-0.3);const e2=e1.clone();e2.translate(-0.3,0,0);
  const g=uwMerge([[b,'#ffffff'],[t,'#dddddd'],[f,'#cccccc'],[e1,'#111111'],[e2,'#111111']]);g.scale(len,len,len);return g;}
function uwSchool(g,o){const n=o.n,im=new THREE.InstancedMesh(uwFishGeo(o.len),new THREE.MeshLambertMaterial({vertexColors:true}),n);const c=new THREE.Color(),r=uwRnd(o.seed);
  const F=[];for(let i=0;i<n;i++){F.push({ox:(r()-0.5)*o.spread,oy:(r()-0.5)*o.spread*0.4,oz:(r()-0.5)*o.spread,ph:r()*6.28,sp:0.8+r()*0.4});c.set(o.cols[i%o.cols.length]).offsetHSL(0,0,(r()-0.5)*0.12);im.setColorAt(i,c);}
  im.frustumCulled=false;g.add(im);const S=Object.assign({im,F,scare:new V3(),t:r()*100,pos:new V3(),dir:new V3()},o);UW.fish.push(S);return S;}
const _fm=new THREE.Matrix4(),_fq=new THREE.Quaternion(),_fs=new V3(1,1,1),_fp=new V3(),_fd=new V3(),_fe=new THREE.Euler();
function uwFishTick(dt,camP){for(const S of UW.fish){if(!S.im.parent||!S.im.parent.visible)continue;S.t+=dt*S.speed;
    const prevX=S.pos.x,prevY=S.pos.y,prevZ=S.pos.z;S.path(S.t,S.pos);S.dir.set(S.pos.x-prevX,S.pos.y-prevY,S.pos.z-prevZ);
    if(S.pos.distanceTo(camP)>S.view)continue;
    // the sub scares them: they scatter away, then drift back
    const dd=S.pos.distanceTo(D.pos);if(dd<S.spread*1.2+2.5){_fd.copy(S.pos).sub(D.pos).setLength((S.spread*1.2+2.5-dd)*0.9);S.scare.lerp(_fd,Math.min(1,dt*3));}else S.scare.multiplyScalar(Math.exp(-dt*0.6));
    const yaw=Math.atan2(-S.dir.x,-S.dir.z);
    for(let i=0;i<S.F.length;i++){const f=S.F[i],w=Math.sin(S.t*8*f.sp+f.ph);
      _fp.set(S.pos.x+f.ox+S.scare.x*(1+f.sp*0.5)+Math.sin(S.t*0.7+f.ph)*0.4,S.pos.y+f.oy+S.scare.y*0.3+Math.sin(S.t*1.1+f.ph)*0.15,S.pos.z+f.oz+S.scare.z*(1+f.sp*0.5)+Math.cos(S.t*0.6+f.ph)*0.4);
      if(S.floor){const fl=S.floor(_fp.x,_fp.z)+0.4;if(_fp.y<fl)_fp.y=fl;}if(S.top!=null&&_fp.y>S.top)_fp.y=S.top;
      _fq.setFromEuler(_fe.set(0,yaw+w*0.18,0,'YXZ'));_fm.compose(_fp,_fq,_fs);S.im.setMatrixAt(i,_fm);}
    S.im.instanceMatrix.needsUpdate=true;}}
function uwChest(g,x,y,z,coins){const c=new THREE.Group();const wood=new THREE.MeshLambertMaterial({color:0x6b4423}),gold=new THREE.MeshLambertMaterial({color:0xffc83d,emissive:0x553300});
  const b=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.5,0.6),wood);b.position.y=0.25;c.add(b);const band=new THREE.Mesh(new THREE.BoxGeometry(0.94,0.08,0.64),gold);band.position.y=0.42;c.add(band);
  const lid=new THREE.Group();lid.position.set(0,0.5,-0.3);const lm=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.9,10,1,false,0,Math.PI),wood);lm.rotation.z=Math.PI/2;lm.position.z=0.3;lid.add(lm);c.add(lid);
  const glow=new THREE.Mesh(new THREE.SphereGeometry(0.25,10,8),new THREE.MeshBasicMaterial({color:0xffe066,transparent:true,opacity:0}));glow.position.y=0.5;c.add(glow);
  c.position.set(x,y,z);c.rotation.y=x*0.37;g.add(c);const C={g:c,lid,glow,x,y:y+0.3,z,coins,open:false};UW.chests.push(C);return C;}
function uwPortal(g,x,y,z,toSea){const P=new THREE.Group();P.position.set(x,y,z);
  const stone=new THREE.MeshLambertMaterial({color:0x6d6a63});const ring=new THREE.Mesh(new THREE.TorusGeometry(2.3,0.45,10,28),stone);ring.position.y=2.6;P.add(ring);
  for(let k=0;k<10;k++){const a=k/10*Math.PI*2,r=new THREE.Mesh(new THREE.DodecahedronGeometry(0.55+((k*7)%3)*0.15,0),stone);r.position.set(Math.cos(a)*2.3,2.6+Math.sin(a)*2.3,0);r.rotation.set(k,k*2,0);P.add(r);}
  const glow=new THREE.Mesh(new THREE.TorusGeometry(2.05,0.12,8,40),new THREE.MeshBasicMaterial({color:0x5ff2ff}));glow.position.y=2.6;P.add(glow);
  const sw=new THREE.Mesh(new THREE.CircleGeometry(2.0,40),new THREE.MeshBasicMaterial({color:toSea?0x1b6fd1:0x48a860,transparent:true,opacity:0.75,side:THREE.DoubleSide,depthWrite:false}));sw.position.y=2.6;P.add(sw);
  const lb=label(toSea?'🌊 TUNNEL TO THE SEA':'🏞 BACK TO THE LAKE',0,0,0,5,toSea?'rgba(10,60,120,0.85)':'rgba(20,90,40,0.85)');scene.remove(lb);lb.position.set(0,5.6,0);P.add(lb);
  g.add(P);return{g:P,sw,glow,x,y:y+2.6,z,toSea};}
// ---------------------------------------------------------------- the lake
function uwLakeFloor(x,z){return H(x,z);}
function uwBuildLake(){if(UW.g)return;const g=new THREE.Group();UW.g=g;scene.add(g);const r=uwRnd(4242);
  const inLake=(e)=>{for(let t=0;t<40;t++){const a=r()*6.28,rr=Math.sqrt(r())*e,x=LAKE.x+Math.cos(a)*LAKE.rx*rr,z=LAKE.z+Math.sin(a)*LAKE.rz*rr;return[x,z];}};
  // weeds: short bunches near the edge, tall ones in the deep
  const pts=[];for(let i=0;i<520;i++){const p=inLake(0.95),y=H(p[0],p[1]);if(y>WATER_Y-0.4)continue;pts.push([p[0],y-0.05,p[1],r()]);}
  uwWeeds(g,pts,pt=>Math.min(WATER_Y-pt[1]-0.3,1+pt[3]*2.5+Math.max(0,(WATER_Y-pt[1])-3)*0.55),'#3f7f2c',0.28);
  const pts2=[];for(let i=0;i<220;i++){const p=inLake(0.98),y=H(p[0],p[1]);if(y>WATER_Y-0.25)continue;pts2.push([p[0],y-0.05,p[1],r()]);}
  uwWeeds(g,pts2,pt=>Math.min(WATER_Y-pt[1]-0.1,0.5+pt[3]*1.0),'#6f8f2a',0.35);
  // lily pads + flowers on top
  const lp=new THREE.InstancedMesh(new THREE.CircleGeometry(0.45,10,0.3,5.6).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({color:0x3f8f3a,side:THREE.DoubleSide}),60);const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new V3(),p=new V3();
  for(let i=0;i<60;i++){const a=r()*6.28,rr=0.72+r()*0.22,x=LAKE.x+Math.cos(a)*LAKE.rx*rr,z=LAKE.z+Math.sin(a)*LAKE.rz*rr;const sc=0.6+r()*0.9;m.compose(p.set(x,WATER_Y+0.03,z),q.setFromAxisAngle(UP,r()*6.28),s.set(sc,1,sc));lp.setMatrixAt(i,m);
    if(r()<0.25){const f=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.16,6),new THREE.MeshLambertMaterial({color:r()<0.5?0xff8fc8:0xffffff}));f.rotation.x=Math.PI;f.position.set(x,WATER_Y+0.1,z);g.add(f);}}
  g.add(lp);
  // rocks (you can bump them)
  const rockM=new THREE.MeshLambertMaterial({color:0x6e665a});for(let i=0;i<46;i++){const pp=inLake(0.92),y=H(pp[0],pp[1]);if(y>WATER_Y-0.8)continue;const sz=0.4+r()*1.4,rk=new THREE.Mesh(new THREE.DodecahedronGeometry(sz,0),rockM);rk.position.set(pp[0],y+sz*0.3,pp[1]);rk.rotation.set(r()*3,r()*3,0);rk.scale.y=0.6+r()*0.5;g.add(rk);addSph(pp[0],y+sz*0.3,pp[1],sz*0.9);}
  // sunken rowboat with a treasure chest next to it
  const bx=LAKE.x+LAKE.rx*0.35,bz=LAKE.z-LAKE.rz*0.3,by=H(bx,bz);const boat=new THREE.Group();const bw=new THREE.MeshLambertMaterial({color:0x5a3e26});
  const hull=new THREE.Mesh(new THREE.SphereGeometry(1,12,8,0,Math.PI*2,Math.PI/2,Math.PI/2),bw);hull.scale.set(0.9,0.6,2.2);hull.rotation.x=Math.PI;hull.position.y=0.6;boat.add(hull);
  for(const sz of[-0.8,0.2,1.0]){const seat=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.08,0.3),bw);seat.position.set(0,0.45,sz);boat.add(seat);}
  boat.position.set(bx,by,bz);boat.rotation.set(0.15,0.8,0.35);g.add(boat);addBox(bx-1.6,by,bz-1.6,bx+1.6,by+0.9,bz+1.6);
  uwChest(g,bx+2.2,H(bx+2.2,bz+1),bz+1,25);
  {const cx=LAKE.x-LAKE.rx*0.5,cz=LAKE.z+LAKE.rz*0.45;uwChest(g,cx,H(cx,cz),cz,15);}
  // fish
  const lk=(cx,cz,rx,rz,dep)=>(t,o)=>{const x=LAKE.x+cx+Math.cos(t*0.11)*rx,z=LAKE.z+cz+Math.sin(t*0.13)*rz,fl=H(x,z);o.set(x,Math.max(fl+0.8,WATER_Y-dep-Math.sin(t*0.07)*0.8),z);};
  uwSchool(g,{n:16,len:0.28,spread:2.2,cols:['#c9d2d6','#9fb0b8'],speed:1,seed:1,view:70,path:lk(-8,4,LAKE.rx*0.45,LAKE.rz*0.4,2.5),floor:H,top:WATER_Y-0.2});
  uwSchool(g,{n:10,len:0.42,spread:2.6,cols:['#d9a23a','#c7802b'],speed:0.7,seed:2,view:70,path:lk(10,-6,LAKE.rx*0.35,LAKE.rz*0.5,5),floor:H,top:WATER_Y-0.2});
  uwSchool(g,{n:8,len:0.55,spread:3,cols:['#5f7a3c','#4c6331'],speed:0.5,seed:3,view:70,path:lk(0,0,LAKE.rx*0.25,LAKE.rz*0.3,7),floor:H,top:WATER_Y-0.2});
  // the tunnel at the deepest spot
  const px=LAKE.x+LAKE.rx*0.06,pz=LAKE.z+LAKE.rz*0.05;UW.portal=uwPortal(g,px,H(px,pz)-0.4,pz,true);
  // light shafts from the surface
  const sm=new THREE.MeshBasicMaterial({color:0xbfefff,transparent:true,opacity:0.07,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});UW.shafts=[];
  for(let i=0;i<14;i++){const pp=inLake(0.8),sh=new THREE.Mesh(new THREE.CylinderGeometry(0.6+r()*0.8,1.2+r(),10,8,1,true),sm);sh.position.set(pp[0],WATER_Y-5,pp[1]);sh.rotation.z=0.18;sh.visible=false;g.add(sh);UW.shafts.push(sh);}}
// ---------------------------------------------------------------- the sea (its own world, deep under the lake, reached through the tunnel)
function seaH(x,z){const dx=x-SEA.x,dz=z-SEA.z,d=Math.hypot(dx,dz);
  let h=SEA.y-16+Math.sin(x*0.045)*1.6+Math.cos(z*0.038)*1.4+Math.sin((x+z)*0.11)*0.5;
  h+=Math.max(0,1-d/70)*7;                                  // reef plateau around the tunnel
  const tr=Math.abs(dz+90+Math.sin(dx*0.02)*20);if(tr<45)h-=(1-tr/45)**2*26; // deep trench
  const ix=dx-150,iz=dz+40,id=Math.hypot(ix,iz);if(id<70)h=Math.max(h,SEA.y+5-id*id*0.0045-Math.max(0,id-30)*0.12); // island
  const e=d/SEA.R;if(e>0.9)h+=(e-0.9)*90;                    // walls of the bay
  return h;}
function seaReef(x,z){return Math.hypot(x-SEA.x,z-SEA.z)<75;}
function seaBuild(){if(SEA.built)return;SEA.built=true;const g=new THREE.Group();SEA.g=g;scene.add(g);const r=uwRnd(777);
  // sea floor + island
  const N=200,S=SEA.R*2+60,geo=new THREE.PlaneGeometry(S,S,N,N);geo.rotateX(-Math.PI/2);const pa=geo.attributes.position,col=new Float32Array(pa.count*3),c=new THREE.Color();
  for(let i=0;i<pa.count;i++){const x=pa.getX(i)+SEA.x,z=pa.getZ(i)+SEA.z,h=seaH(x,z);pa.setX(i,x);pa.setZ(i,z);pa.setY(i,h);
    const above=h>SEA.y-0.3;if(above)c.set(h>SEA.y+1.5?0x4a7029:0xe8d9a8);else{c.set(0xd8c690);c.lerp(new THREE.Color(0x46606a),clamp((SEA.y-12-h)/22,0,1));if(seaReef(x,z))c.lerp(new THREE.Color(0xb98a7a),0.25);}
    c.offsetHSL(0,0,(Math.sin(x*1.7)*Math.cos(z*1.3))*0.03);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();const fl=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}));fl.receiveShadow=true;g.add(fl);
  // ocean surface out to the horizon
  const sw=new THREE.Mesh(new THREE.PlaneGeometry(8000,8000,1,1).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({color:0x125a8f,transparent:true,opacity:0.9,side:THREE.DoubleSide}));sw.position.set(SEA.x,SEA.y,SEA.z);g.add(sw);SEA.surf=sw;
  const pick=(fn,tries)=>{for(let t=0;t<(tries||60);t++){const a=r()*6.28,d=Math.sqrt(r())*SEA.R*0.88,x=SEA.x+Math.cos(a)*d,z=SEA.z+Math.sin(a)*d;if(fn(x,z,seaH(x,z)))return[x,z,seaH(x,z)];}return null;};
  // kelp forest (tall) + sea grass
  const kp=[];for(let i=0;i<900;i++){const p=pick((x,z,h)=>h<SEA.y-6&&!seaReef(x,z)&&Math.sin(x*0.02+z*0.015)>0.1);if(p)kp.push([p[0],p[2]-0.1,p[1],r()]);}
  uwWeeds(g,kp,pt=>Math.min(SEA.y-pt[1]-1,5+pt[3]*9),'#6b7a1f',0.12);
  const sg=[];for(let i=0;i<900;i++){const p=pick((x,z,h)=>h<SEA.y-1.5);if(p)sg.push([p[0],p[2]-0.05,p[1],r()]);}uwWeeds(g,sg,pt=>0.4+pt[3]*0.9,'#3d8a45',0.35);
  // coral reef: brain coral, branching coral, fans, anemones — bright colours
  const CC=['#ff6f61','#ff9f1c','#ffd166','#c77dff','#ff5d8f','#4cc9f0','#f72585','#80ed99'];
  const brain=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,2),new THREE.MeshLambertMaterial(),260),m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new V3(),p=new V3();
  for(let i=0;i<260;i++){const pp=pick((x,z,h)=>seaReef(x,z)&&h<SEA.y-1.5)||[SEA.x,SEA.z,SEA.y-10];const sz=0.3+r()*0.9;m.compose(p.set(pp[0],pp[2]+sz*0.3,pp[1]),q.identity(),s.set(sz,sz*0.6,sz));brain.setMatrixAt(i,m);brain.setColorAt(i,c.set(CC[i%CC.length]));}g.add(brain);
  const br=new THREE.InstancedMesh(uwMerge([[new THREE.CylinderGeometry(0.05,0.08,1,5).translate(0,0.5,0),'#fff'],[new THREE.CylinderGeometry(0.04,0.06,0.7,5).translate(0,0.35,0).rotateZ(0.6).translate(0,0.4,0),'#fff'],[new THREE.CylinderGeometry(0.04,0.06,0.6,5).translate(0,0.3,0).rotateZ(-0.7).translate(0,0.55,0),'#fff'],[new THREE.CylinderGeometry(0.03,0.05,0.5,5).translate(0,0.25,0).rotateX(0.7).translate(0,0.3,0),'#fff']]),new THREE.MeshLambertMaterial({vertexColors:true}),340);
  for(let i=0;i<340;i++){const pp=pick((x,z,h)=>seaReef(x,z)&&h<SEA.y-1.2)||[SEA.x,SEA.z,SEA.y-10];const sz=0.6+r()*1.4;m.compose(p.set(pp[0],pp[2],pp[1]),q.setFromAxisAngle(UP,r()*6.28),s.set(sz,sz,sz));br.setMatrixAt(i,m);br.setColorAt(i,c.set(CC[(i*3)%CC.length]));}g.add(br);
  const fan=new THREE.InstancedMesh(new THREE.CircleGeometry(0.8,12,0,Math.PI).translate(0,0,0),new THREE.MeshLambertMaterial({side:THREE.DoubleSide}),120);
  for(let i=0;i<120;i++){const pp=pick((x,z,h)=>seaReef(x,z)&&h<SEA.y-1.5)||[SEA.x,SEA.z,SEA.y-10];const sz=0.6+r()*1.0;m.compose(p.set(pp[0],pp[2],pp[1]),q.setFromAxisAngle(UP,r()*6.28),s.set(sz,sz,sz));fan.setMatrixAt(i,m);fan.setColorAt(i,c.set(CC[(i*5+2)%CC.length]));}g.add(fan);
  const anem=new THREE.InstancedMesh(uwMerge([[new THREE.CylinderGeometry(0.18,0.22,0.25,8).translate(0,0.12,0),'#ff7aa2'],...[0,1,2,3,4,5,6,7].map(k=>[new THREE.CylinderGeometry(0.02,0.03,0.35,4).translate(0,0.17,0).rotateZ(0.5).rotateY(k*0.785).translate(0,0.22,0),'#ffc1d6'])]),new THREE.MeshLambertMaterial({vertexColors:true}),120);
  for(let i=0;i<120;i++){const pp=pick((x,z,h)=>seaReef(x,z)&&h<SEA.y-1.5)||[SEA.x,SEA.z,SEA.y-10];m.compose(p.set(pp[0],pp[2],pp[1]),q.identity(),s.set(1.5,1.5,1.5));anem.setMatrixAt(i,m);}g.add(anem);
  // starfish + rocks on the sand
  const star=new THREE.InstancedMesh(new THREE.CircleGeometry(0.25,5).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({side:THREE.DoubleSide}),90);
  for(let i=0;i<90;i++){const pp=pick((x,z,h)=>h<SEA.y-1);if(!pp)continue;m.compose(p.set(pp[0],pp[2]+0.04,pp[1]),q.setFromAxisAngle(UP,r()*6.28),s.set(1,1,1));star.setMatrixAt(i,m);star.setColorAt(i,c.set(['#ff7b00','#ff3d68','#b5179e','#ffd166'][i%4]));}g.add(star);
  const rockM=new THREE.MeshLambertMaterial({color:0x5c5850});for(let i=0;i<80;i++){const pp=pick((x,z,h)=>h<SEA.y-2);if(!pp)continue;const sz=0.8+r()*3;const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(sz,0),rockM);rk.position.set(pp[0],pp[2]+sz*0.2,pp[1]);rk.rotation.set(r()*3,r()*3,0);rk.scale.y=0.5+r()*0.4;g.add(rk);addSph(pp[0],pp[2]+sz*0.2,pp[1],sz*0.8);}
  // shipwreck (with treasure inside)
  {const wx=SEA.x-95,wz=SEA.z+60,wy=seaH(wx,wz);const w=new THREE.Group(),wm=new THREE.MeshLambertMaterial({color:0x4a3a2a}),dm=new THREE.MeshLambertMaterial({color:0x3a2e22});
    const hull=new THREE.Mesh(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,Math.PI/2,Math.PI/2),wm);hull.scale.set(3.2,2.4,10);hull.rotation.x=Math.PI;hull.position.y=2.2;w.add(hull);
    const deck=new THREE.Mesh(new THREE.BoxGeometry(5.4,0.25,17),dm);deck.position.y=2.1;w.add(deck);const cab=new THREE.Mesh(new THREE.BoxGeometry(3.5,2,4),wm);cab.position.set(0,3.2,5.5);w.add(cab);
    const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.25,9,8),dm);mast.position.set(0,6,-2);mast.rotation.z=0.5;w.add(mast);const mast2=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,4,8),dm);mast2.position.set(0.8,3.5,-7);mast2.rotation.z=-0.2;w.add(mast2);
    for(const sd of[-1,1])for(const cz of[-4,-1,2]){const cn=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.2,1.4,8),new THREE.MeshLambertMaterial({color:0x222222}));cn.rotation.z=Math.PI/2;cn.position.set(sd*2.9,2.6,cz);w.add(cn);}
    w.position.set(wx,wy,wz);w.rotation.set(0.05,0.6,0.28);g.add(w);addBox(wx-6,wy,wz-6,wx+6,wy+3.4,wz+6);uwChest(g,wx+5,seaH(wx+5,wz-7),wz-7,50);
    const lb=label('⚓ SHIPWRECK',wx,wy+9,wz,5,'rgba(60,40,20,0.85)');scene.remove(lb);g.add(lb);}
  // more treasure
  [[SEA.x+60,SEA.z-90],[SEA.x-30,SEA.z+150],[SEA.x+200,SEA.z+120],[SEA.x-170,SEA.z-110]].forEach(([x,z],i)=>uwChest(g,x,seaH(x,z),z,[30,20,40,35][i]));
  // island: palm trees + a lighthouse
  {const ix=SEA.x+150,iz=SEA.z-40,trunkM=new THREE.MeshLambertMaterial({color:0x8a6a45}),leafM=new THREE.MeshLambertMaterial({color:0x2f8f3a,side:THREE.DoubleSide});
    for(let i=0;i<14;i++){const a=r()*6.28,d=5+r()*24,x=ix+Math.cos(a)*d,z=iz+Math.sin(a)*d,y=seaH(x,z);if(y<SEA.y+0.6)continue;const P=new THREE.Group(),hh=5+r()*4;
      for(let k=0;k<6;k++){const sg2=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.2,hh/6,7),trunkM);sg2.position.set(Math.sin(k*0.25)*k*0.15,hh/6*(k+0.5),0);P.add(sg2);}
      for(let k=0;k<7;k++){const lf=new THREE.Mesh(new THREE.PlaneGeometry(0.6,3.2,1,4),leafM);lf.geometry.translate(0,1.6,0);lf.position.set(0.7,hh,0);lf.rotation.set(0,k*0.9,1.1+r()*0.3,'YXZ');P.add(lf);}
      P.position.set(x,y,z);P.rotation.y=r()*6.28;g.add(P);addVCyl(x,z,0.3,y,y+hh);}
    const ly=seaH(ix,iz),lh=new THREE.Group();for(let k=0;k<6;k++){const s2=new THREE.Mesh(new THREE.CylinderGeometry(1.4-k*0.12,1.5-k*0.12,2,14),new THREE.MeshLambertMaterial({color:k%2?0xd7263d:0xf4f4f4}));s2.position.y=1+k*2;lh.add(s2);}
    const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.8,12,8),new THREE.MeshBasicMaterial({color:0xfff2a8}));lamp.position.y=12.8;lh.add(lamp);lh.position.set(ix,ly,iz);g.add(lh);addVCyl(ix,iz,1.5,ly,ly+13);
    const lb=label('🏝 ISLAND',ix,ly+16,iz,5,'rgba(20,80,120,0.85)');scene.remove(lb);g.add(lb);}
  // sea creatures
  const sp=(cx,cz,rx,rz,y0,amp,w)=>(t,o)=>{const x=SEA.x+cx+Math.cos(t*w)*rx,z=SEA.z+cz+Math.sin(t*w*1.13)*rz;o.set(x,Math.max(seaH(x,z)+1.5,SEA.y-y0-Math.sin(t*0.09)*amp),z);};
  const reefFish=[['#ffd60a','#ffb703'],['#ff7b00','#ffffff'],['#4361ee','#4cc9f0'],['#f72585','#b5179e'],['#c0c7cf','#8d99ae'],['#80ed99','#57cc99'],['#ff595e','#ffca3a']];
  reefFish.forEach((cols,i)=>uwSchool(g,{n:16+(i%3)*6,len:0.3+(i%3)*0.12,spread:2.5+i*0.3,cols,speed:0.8+(i%2)*0.3,seed:20+i,view:110,path:sp((i-3)*12,(i%2?1:-1)*15,25+i*6,20+i*5,5+i*1.3,2,0.05+i*0.008),floor:seaH,top:SEA.y-0.3}));
  uwSchool(g,{n:60,len:0.22,spread:7,cols:['#d9e2e8','#aebfca'],speed:1.2,seed:40,view:140,path:sp(-60,-40,90,70,9,3,0.03),floor:seaH,top:SEA.y-0.3});
  // shark, whale, turtles, jellyfish
  const big=(geo,cols,o)=>uwSchool(g,Object.assign({n:1,spread:0.01,cols,seed:o.seed,view:260,floor:seaH,top:SEA.y-1},o,{len:o.len}));
  SEA.shark=big(null,['#7d8a96'],{len:2.6,speed:0.9,seed:50,path:sp(20,10,55,40,7,3,0.06)});
  {const fin=new THREE.ConeGeometry(0.25,0.7,3);fin.translate(0,0.75,0.1);SEA.shark.im.geometry=uwMerge([[uwFishGeo(1).clone(),'#7d8a96'],[fin,'#6a7884']]);SEA.shark.im.geometry.scale(2.6,2.6,2.6);}
  SEA.whale=big(null,['#3d5a73'],{len:12,speed:0.25,seed:51,path:sp(-40,80,160,120,14,4,0.02),top:SEA.y-3});
  uwSchool(g,{n:5,len:1.1,spread:30,cols:['#5b7f3f','#6b8f4f'],speed:0.35,seed:52,view:200,path:sp(30,-30,70,60,6,2,0.04),floor:seaH,top:SEA.y-0.5}); // turtles
  {const jm=new THREE.MeshLambertMaterial({color:0xff9ad5,emissive:0x662244,transparent:true,opacity:0.6}),jg=uwMerge([[new THREE.SphereGeometry(0.5,12,8,0,6.29,0,Math.PI/2),'#ff9ad5'],...[0,1,2,3,4,5].map(k=>[new THREE.CylinderGeometry(0.02,0.01,1.2,3).translate(0,-0.6,0).translate(Math.cos(k)*0.3,0,Math.sin(k)*0.3),'#ffd1ea'])]);
    const J=new THREE.InstancedMesh(jg,jm,40);J.frustumCulled=false;g.add(J);SEA.jelly={im:J,P:[]};for(let i=0;i<40;i++){const pp=pick((x,z,h)=>h<SEA.y-6)||[SEA.x,SEA.z,SEA.y-10];SEA.jelly.P.push([pp[0],SEA.y-2-r()*(SEA.y-pp[2]-4),pp[1],r()*6.28,0.6+r()*0.8]);}}
  // way home
  SEA.portal=uwPortal(g,SEA.x+8,seaH(SEA.x+8,SEA.z+8)-0.4,SEA.z+8,false);
  const lb=label('🌊 THE SEA — explore the reef, the wreck and the island',SEA.x,SEA.y-1,SEA.z-20,9,'rgba(10,60,120,0.85)');scene.remove(lb);g.add(lb);
  g.visible=false;}
// ---------------------------------------------------------------- going through the tunnel
function uwFade(msg){let el=$('uwFade');if(!el){el=document.createElement('div');el.id='uwFade';el.style.cssText='position:fixed;inset:0;z-index:30;pointer-events:none;background:radial-gradient(circle,#2aa7ff 0%,#06204a 70%);opacity:0;transition:opacity .45s;display:flex;align-items:center;justify-content:center;font:900 28px system-ui,sans-serif;color:#fff;text-shadow:0 2px 8px #000';document.body.appendChild(el);}
  el.textContent=msg;el.style.opacity=1;setTimeout(()=>{el.style.opacity=0;},1300);}
function seaEnter(){if(D.sea)return;seaBuild();uwFade('🌀 whooosh… through the tunnel…');beep(300,0.6,0.06);setTimeout(()=>beep(600,0.5,0.05),300);
  setTimeout(()=>{SEA.hid=[];const keep=new Set([SEA.g,DR&&DR.g,shadow,UW.bubG]);scene.children.forEach(o=>{if(keep.has(o)||o.isLight||o.isCamera)return;if(o.material&&o.material.side===THREE.BackSide)return;if(o.visible){o.visible=false;SEA.hid.push(o);}});
    SEA.g.visible=true;D.sea=true;const P=SEA.portal;D.pos.set(P.x,P.y,P.z-4.5);D.depth=SEA.y-D.pos.y;D.vel.set(0,0,0);D.yaw=0;
    toast('🌊 You found THE SEA! Coral reef, a shipwreck with treasure, a shark, a whale… the glowing ring takes you back',5000);award('🌊 Discovered the sea!',20,'sea',300);},450);}
function seaExit(){if(!D.sea)return;uwFade('🌀 back to the lake…');setTimeout(()=>{(SEA.hid||[]).forEach(o=>o.visible=true);SEA.hid=null;SEA.g.visible=false;D.sea=false;
  const P=UW.portal;if(P){D.pos.set(P.x,P.y,P.z+4.5);D.depth=WATER_Y-D.pos.y;D.yaw=Math.PI;}D.vel.set(0,0,0);toast('🏞 Back in the lake',1800);},450);}
// the sub in the sea: same controls as the lake, but deep water everywhere (the island is the shore)
{const b0=tickBoat;tickBoat=function(dt,inp,prev){if(!D.sea)return b0.apply(this,arguments);return seaBoat(dt,inp,prev);};}
function seaBoat(dt,inp,prev){const S=ST,v=D.vel;if(D.state==='landed'){D.state='flying';D.armed=true;}
  let thr=Math.abs(inp.ly)>0.02?inp.ly:0,steer=Math.abs(inp.rx)>0.02?inp.rx:inp.lx;if(D.lock||!D.armed)thr=0;if(D.batt<=0)thr=Math.min(thr,0.1);
  if(rth){rth=null;seaExit();return;}
  const fx=-Math.sin(D.yaw),fz=-Math.cos(D.yaw);let vf=v.x*fx+v.z*fz;const top=S.top*1.4*CFG.speedPct/100;
  if(thr>0.02)vf+=thr*S.acc*1.3*(1-clamp(vf/top,0,1))*dt;else if(thr<-0.02)vf=Math.max(-top*0.4,vf+thr*S.acc*0.8*dt);vf-=vf*(0.3+(Math.abs(thr)<0.02?0.5:0))*dt;
  D.yaw-=steer*S.turn*clamp(Math.abs(vf)/3+Math.abs(thr)*0.6+0.3,0,1.4)*dt*(vf<-0.2?-1:1);
  const nx=-Math.sin(D.yaw),nz=-Math.cos(D.yaw);v.x=nx*vf;v.z=nz*vf;
  const X=D.pos.x+v.x*dt,Z=D.pos.z+v.z*dt,fl=seaH(X,Z);
  if(fl>SEA.y-0.5&&D.depth<1){v.x*=-0.25;v.z*=-0.25;if(Math.abs(vf)>2){bump();toast('🏝 That\'s the island beach',900);}}
  else if(Math.hypot(X-SEA.x,Z-SEA.z)>SEA.R*0.97){v.x*=-0.3;v.z*=-0.3;toast('🌊 The open ocean is too rough out there — turn back',1200);}
  else{D.pos.x=X;D.pos.z=Z;}
  const t=performance.now()/1000,bob=Math.sin(t*2.1+D.pos.x*0.3)*0.03;
  const maxD=Math.max(0,SEA.y-seaH(D.pos.x,D.pos.z)-0.8);D.depth=clamp((D.depth||0)-inp.ry*2.6*dt,0,maxD);D.pos.y=SEA.y-D.depth+(D.depth<0.05?0.05+bob:0);
  D.pitch=lerp(D.pitch,-inp.ry*0.25+bob,Math.min(1,dt*4));D.roll=lerp(D.roll,clamp(-steer*Math.abs(vf)*0.025,-0.3,0.3),Math.min(1,dt*4));
  _p.set(D.pos.x,D.pos.y+0.2,D.pos.z);const hit=hitTest(_p,S.rad);if(hit){const sp=Math.abs(vf);D.pos.x=prev.x;D.pos.z=prev.z;v.x*=-0.3;v.z*=-0.3;if(sp>2)bump();}
  DR.props.forEach(P=>{if(P.state!=='none')P.g.rotation.y+=(Math.abs(thr)*60+3)*dt;});
  D.batt=Math.max(0,D.batt-dt*100/(S.mins*60)*(0.25+Math.abs(thr)*0.9)*CFG.drain/100);}
{const h0=H;H=function(x,z){return D.sea?seaH(x,z):h0(x,z);};}
{const c0=chunkTick;chunkTick=function(){if(D.sea)return;return c0.apply(this,arguments);};}
// the sub can go much deeper now (the lake is about 10 m deep in the middle)
function subMaxDepth(){return Math.max(0,Math.min(14,WATER_Y-H(D.pos.x,D.pos.z)-0.7));}
// ---------------------------------------------------------------- every frame
const _uwc=new V3();
function uwTick(dt){if(typeof CES!=='undefined'&&CES.on)return;UW.uT.value+=dt;
  if(!UW.g&&started)uwBuildLake();if(!UW.g)return;
  if(D.sea&&(vkind()!=='boat'||!isSubNow()))seaExit();
  const cp=cam.getWorldPosition(_uwc),near=D.sea||Math.hypot(cp.x-LAKE.x,cp.z-LAKE.z)<LAKE.rx+80;
  if(near)uwFishTick(dt,cp);
  // jellyfish bob
  if(D.sea&&SEA.jelly){const J=SEA.jelly,m=_fm;J.P.forEach((p,i)=>{const t=UW.uT.value*p[4]+p[3],s=1+Math.sin(t*2)*0.12;_fp.set(p[0]+Math.sin(t*0.3)*2,p[1]+Math.sin(t*0.8)*1.2,p[2]+Math.cos(t*0.25)*2);_fs.set(s,1/s,s);m.compose(_fp,_fq.identity(),_fs);J.im.setMatrixAt(i,m);});_fs.set(1,1,1);J.im.instanceMatrix.needsUpdate=true;}
  // treasure chests
  for(const C of UW.chests){if(!C.g.parent||!C.g.parent.visible)continue;if(!C.open&&vkind()==='boat'&&Math.hypot(D.pos.x-C.x,D.pos.y-C.y,D.pos.z-C.z)<2.4){C.open=true;award('💰 Treasure chest!',C.coins);toast('💰 You found treasure! +'+C.coins+' coins',2200);}
    if(C.open){C.lid.rotation.x=lerp(C.lid.rotation.x,-1.9,Math.min(1,dt*3));C.glow.material.opacity=0.5+Math.sin(UW.uT.value*4)*0.3;}}
  // tunnel rings
  for(const P of [UW.portal,SEA.portal]){if(!P||!P.g.parent||!P.g.parent.visible)continue;P.sw.rotation.z+=dt*1.5;P.glow.material.color.setHSL(0.52+Math.sin(UW.uT.value*2)*0.04,1,0.6);
    if(vkind()==='boat'&&isSubNow()&&Math.hypot(D.pos.x-P.x,D.pos.y-P.y,D.pos.z-P.z)<2.6&&!UW.busy){UW.busy=true;setTimeout(()=>UW.busy=false,2500);if(P.toSea)seaEnter();else seaExit();}}
  // bubbles from the sub
  if(vkind()==='boat'&&isSubNow()&&(D.depth||0)>0.3){UW.bt=(UW.bt||0)-dt;if(UW.bt<=0){UW.bt=0.08+0.25/(0.3+Math.hypot(D.vel.x,D.vel.z));uwBubble();}}
  for(let i=UW.bub.length-1;i>=0;i--){const b=UW.bub[i];b.m.position.y+=dt*(0.8+b.s*3);b.m.position.x+=Math.sin(UW.uT.value*5+i)*dt*0.1;const top=D.sea?SEA.y:WATER_Y;if(b.m.position.y>top-0.05){scene.remove(b.m);UW.bub.splice(i,1);}}
  // looking from under the water
  const surf=D.sea?SEA.y:WATER_Y,under=cp.y<surf-0.05&&(D.sea||!!inWater(cp.x,cp.z));if(under!==UW.on)uwSwitch(under);
  if(under){const deep=clamp((surf-cp.y)/(D.sea?40:12),0,1),col=D.sea?new THREE.Color(0x1478a8).lerp(new THREE.Color(0x06243f),deep):new THREE.Color(0x2c6b5a).lerp(new THREE.Color(0x0d2a26),deep);
    if(scene.fog){scene.fog.color.copy(col);if(scene.fog.isFog){scene.fog.near=0.3;scene.fog.far=D.sea?55:24;}else scene.fog.density=D.sea?0.03:0.07;}if(scene.background&&scene.background.isColor)scene.background.copy(col);else scene.background=col.clone();
    if(UW.shafts)UW.shafts.forEach((s,i)=>{s.material.opacity=0.05+Math.sin(UW.uT.value*0.7+i)*0.02;});}}
function uwBubble(){if(UW.bub.length>50)return;const m=new THREE.Mesh(UW.bgeo||(UW.bgeo=new THREE.SphereGeometry(0.04,6,4)),UW.bmat||(UW.bmat=new THREE.MeshBasicMaterial({color:0xdff6ff,transparent:true,opacity:0.6})));const s=Math.random();m.scale.setScalar(0.6+s*1.6);
  m.position.set(D.pos.x+Math.sin(D.yaw)*0.6+(Math.random()-0.5)*0.2,D.pos.y+0.1,D.pos.z+Math.cos(D.yaw)*0.6+(Math.random()-0.5)*0.2);scene.add(m);UW.bub.push({m,s});}
function uwSwitch(on){UW.on=on;let fx=$('uwFx');if(!fx){fx=document.createElement('div');fx.id='uwFx';fx.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;display:none;background:radial-gradient(ellipse at 50% 0%,rgba(160,230,255,0.18),transparent 55%),radial-gradient(circle,transparent 45%,rgba(0,25,40,0.55) 100%)';document.body.appendChild(fx);}
  fx.style.display=on?'block':'none';
  if(on){UW.saved={bg:scene.background,fc:scene.fog&&scene.fog.color.clone(),fn:scene.fog&&scene.fog.near,ff:scene.fog&&scene.fog.far,fd:scene.fog&&scene.fog.density,ws:MAT.water.side};if(scene.background&&scene.background.isColor)scene.background=scene.background.clone();
    UW.hid=[];scene.traverse(o=>{if(o.material&&o.material.side===THREE.BackSide&&o.visible&&(o.material.isShaderMaterial)){o.visible=false;UW.hid.push(o);}});MAT.water.side=THREE.DoubleSide;MAT.water.needsUpdate=true;if(UW.shafts)UW.shafts.forEach(s=>s.visible=!D.sea);}
  else{const s=UW.saved;if(s){scene.background=s.bg;if(scene.fog&&s.fc){scene.fog.color.copy(s.fc);if(scene.fog.isFog){scene.fog.near=s.fn;scene.fog.far=s.ff;}else scene.fog.density=s.fd;}MAT.water.side=s.ws;MAT.water.needsUpdate=true;}UW.hid.forEach(o=>o.visible=true);UW.hid=[];if(UW.shafts)UW.shafts.forEach(s=>s.visible=false);}}
