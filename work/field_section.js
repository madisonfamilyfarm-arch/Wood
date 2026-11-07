// =====================================================================================
// ===== ✈️ THE AIRFIELD: a realistic RC flying field where the game starts (like RealFlight's fields) =====
//  paved runway with markings · mowed grass · taxiway · flight line with numbered pilot stations · safety fence ·
//  pits with start tables and pop-up canopies · clubhouse/hangar · flag · wind socks · parking · helipad
// =====================================================================================
const FLD=Object.assign({on:true,x:0,z:0,yaw:0,len:120,w:10,surf:'paved',pits:true},LS.get('fld',{}));
function fldSave(){LS.set('fld',FLD);}
function fldR(){return{rx:Math.cos(FLD.yaw),rz:Math.sin(FLD.yaw),px:-Math.sin(FLD.yaw),pz:Math.cos(FLD.yaw)};}
function fldW(u,v){const r=fldR();return{x:FLD.x+r.rx*u+r.px*v,z:FLD.z+r.rz*u+r.pz*v};}
function fldUV(x,z){const r=fldR(),dx=x-FLD.x,dz=z-FLD.z;return{u:dx*r.rx+dz*r.rz,v:dx*r.px+dz*r.pz};}
const FU={h:0,cols:[],g:null,station:null};
// the ground of the field is levelled (like a real mowed field) and blends into the real hills around it
function fldFlat(x,z,h){if(!FLD.on||!FU.g)return h;const q=fldUV(x,z),L=FLD.len/2+28;const du=Math.max(0,Math.abs(q.u)-L),dv=Math.max(0,q.v>0?q.v-58:-q.v-22);const d=Math.hypot(du,dv);if(d>10)return h;return lerp(FU.h,h,smooth(0,10,d));}
// ---- painted textures
function cvTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=8;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function noise(x,w,h,n,a,col){for(let i=0;i<n;i++){x.fillStyle=col(Math.random());x.globalAlpha=a*Math.random();x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2);}x.globalAlpha=1;}
const FTEX={};
function fldTextures(){if(FTEX.grass)return;
  FTEX.grass=cvTex(512,512,(x,w,h)=>{x.fillStyle='#38521f';x.fillRect(0,0,w,h);for(let i=0;i<8;i++){x.fillStyle=i%2?'rgba(255,255,220,0.035)':'rgba(0,20,0,0.05)';x.fillRect(i*w/8,0,w/8,h);}noise(x,w,h,60000,0.45,r=>r<0.33?'#26401a':r<0.66?'#4a6a2a':'#5d7a33');noise(x,w,h,3000,0.3,r=>r<0.5?'#6b6a3a':'#2c3a18');},[1,1]);
  FTEX.edge=cvTex(256,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#000');g.addColorStop(0.12,'#fff');g.addColorStop(0.88,'#fff');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,w,h);x.globalCompositeOperation='multiply';const g2=x.createLinearGradient(0,0,0,h);g2.addColorStop(0,'#000');g2.addColorStop(0.12,'#fff');g2.addColorStop(0.88,'#fff');g2.addColorStop(1,'#000');x.fillStyle=g2;x.fillRect(0,0,w,h);});
  FTEX.asph=cvTex(256,256,(x,w,h)=>{x.fillStyle='#4a4d50';x.fillRect(0,0,w,h);noise(x,w,h,30000,0.5,r=>r<0.5?'#2f3134':'#6c6f72');for(let i=0;i<6;i++){x.strokeStyle='rgba(20,20,20,0.35)';x.lineWidth=1;x.beginPath();let px=Math.random()*w,py=Math.random()*h;x.moveTo(px,py);for(let k=0;k<6;k++){px+=(Math.random()-0.5)*50;py+=(Math.random()-0.5)*50;x.lineTo(px,py);}x.stroke();}},[1,1]);
  FTEX.chain=cvTex(64,64,(x,w,h)=>{x.clearRect(0,0,w,h);x.strokeStyle='rgba(190,195,200,0.95)';x.lineWidth=2;for(let i=-64;i<128;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i+64,64);x.stroke();x.beginPath();x.moveTo(i+64,0);x.lineTo(i,64);x.stroke();}},[1,1]);
  FTEX.wood=cvTex(128,128,(x,w,h)=>{x.fillStyle='#9a7246';x.fillRect(0,0,w,h);for(let i=0;i<40;i++){x.strokeStyle='rgba(60,35,10,'+(0.1+Math.random()*0.2)+')';x.beginPath();const y=Math.random()*h;x.moveTo(0,y);x.bezierCurveTo(w/3,y+4,w*2/3,y-4,w,y+2);x.stroke();}},[1,1]);
  FTEX.metal=cvTex(128,128,(x,w,h)=>{x.fillStyle='#b8bcc0';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=8){x.fillStyle='rgba(0,0,0,0.12)';x.fillRect(i,0,2,h);x.fillStyle='rgba(255,255,255,0.2)';x.fillRect(i+2,0,1,h);}},[1,1]);}
function runwayTex(len,w,name){const PX=8,W=Math.round(w*PX*2),L=Math.round(Math.min(len,260)*PX);
  return cvTex(L,W,(x)=>{const sx=L/len,sy=W/w;
    if(FLD.surf==='grass'){x.fillStyle='#456b28';x.fillRect(0,0,L,W);for(let i=0;i<len;i+=6){x.fillStyle=(i/6)%2?'rgba(255,255,220,0.08)':'rgba(0,40,0,0.08)';x.fillRect(i*sx,0,3*sx,W);}noise(x,L,W,L*W/40,0.4,r=>r<0.5?'#4c7a2a':'#8fbc58');
      x.fillStyle='rgba(255,255,255,0.85)';for(let i=0;i<len;i+=8){x.fillRect(i*sx,1,3*sx,0.35*sy);x.fillRect(i*sx,W-1-0.35*sy,3*sx,0.35*sy);}return;}
    x.fillStyle='#3a3c3f';x.fillRect(0,0,L,W);noise(x,L,W,L*W/14,0.45,r=>r<0.5?'#25272a':'#5a5d60');
    for(let i=0;i<14;i++){x.fillStyle='rgba(20,20,20,0.18)';x.fillRect(Math.random()*L,Math.random()*W,30+Math.random()*90,6+Math.random()*16);} // repairs / oil
    x.fillStyle='#d8d8d2';x.fillRect(0,0.25*sy,L,0.3*sy);x.fillRect(0,W-0.55*sy,L,0.3*sy); // edge lines
    for(let u=12;u<len-12;u+=8)x.fillRect(u*sx,W/2-0.15*sy,4*sx,0.3*sy); // centre dashes
    const bars=Math.max(4,Math.floor(w/1.6));for(let k=0;k<bars;k++){const yy=(0.9+k*(w-1.8)/bars+0.2)*sy;x.fillRect(1.5*sx,yy,5*sx,0.55*sy);x.fillRect(L-6.5*sx,yy,5*sx,0.55*sy);} // piano keys
    const n1=((Math.round((90-FLD.yaw*180/Math.PI)/10)%36)+36)%36||36,n2=((n1+17)%36)+1;x.font='bold '+Math.round(w*0.55*sy)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.save();x.translate(10*sx,W/2);x.rotate(Math.PI/2);x.fillText(String(n2).padStart(2,'0'),0,0);x.restore();x.save();x.translate(L-10*sx,W/2);x.rotate(-Math.PI/2);x.fillText(String(n1).padStart(2,'0'),0,0);x.restore();
    for(let k=0;k<2;k++){const u=k?len-26:26;x.fillRect((u-3)*sx,0.18*W,6*sx,0.18*W);x.fillRect((u-3)*sx,0.64*W,6*sx,0.18*W);} // aiming points
  });}
function signTex(txt,bg,fg,w,h){return cvTex(w||512,h||128,(x,W,H)=>{x.fillStyle=bg;x.fillRect(0,0,W,H);x.strokeStyle=fg;x.lineWidth=6;x.strokeRect(6,6,W-12,H-12);x.fillStyle=fg;x.font='bold '+Math.round(H*0.42)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,W/2,H/2+2);});}
// ---- building helpers (local field space: x = along the runway, z = towards the pilots, y = up)
function fBox(g,w,h,d,mat,x,y,z,ry){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;g.add(m);return m;}
function fCol(u,v,w,d,y0,y1){const a=fldW(u-w/2,v-d/2),b=fldW(u+w/2,v+d/2),c=fldW(u-w/2,v+d/2),e=fldW(u+w/2,v-d/2);FU.cols.push(gridAdd({t:'b',x0:Math.min(a.x,b.x,c.x,e.x),z0:Math.min(a.z,b.z,c.z,e.z),x1:Math.max(a.x,b.x,c.x,e.x),z1:Math.max(a.z,b.z,c.z,e.z),y0:FU.h+y0,y1:FU.h+y1},(a.x+b.x)/2,(a.z+b.z)/2,Math.max(w,d)/2+1));}
function fPost(u,v,r,h){const p=fldW(u,v);FU.cols.push(gridAdd({t:'v',x:p.x,z:p.z,r,y0:FU.h-1,y1:FU.h+h},p.x,p.z,r));}
function fTree(g,x,z,s,pine){const tr=new THREE.Mesh(GEO.trunk,new THREE.MeshLambertMaterial({color:0x5b3d22}));tr.scale.set(0.25*s,(pine?4:3.5)*s,0.25*s);tr.position.set(x,0,z);g.add(tr);
  const c=new THREE.MeshLambertMaterial({color:pine?0x2f5a26:0x4f7a2e});if(pine){[0,1,2].forEach(k=>{const m=new THREE.Mesh(GEO.cone,c);m.scale.set((2.4-k*0.6)*s,3*s,(2.4-k*0.6)*s);m.position.set(x,(1.6+k*1.9)*s,z);g.add(m);});}
  else{[[0,4.2,0,2.6],[1.2,3.6,0.5,1.8],[-1,3.8,-0.6,1.9]].forEach(q=>{const m=new THREE.Mesh(GEO.ball,c);m.scale.setScalar(q[3]*s);m.position.set(x+q[0]*s,q[1]*s,z+q[2]*s);g.add(m);});}fPost(x,z,0.35*s,7*s);}
function fCar(g,x,z,col,ry){const c=new THREE.Group();c.position.set(x,0,z);c.rotation.y=ry||0;const body=new THREE.MeshStandardMaterial({color:col,roughness:0.3,metalness:0.6});
  fBox(c,4.4,0.75,1.8,body,0,0.65,0);fBox(c,2.4,0.6,1.65,body,-0.2,1.3,0);const gl=new THREE.MeshStandardMaterial({color:0x223344,roughness:0.1,metalness:0.8});fBox(c,2.42,0.42,1.6,gl,-0.2,1.32,0);
  [[-1.4,-0.85],[1.4,-0.85],[-1.4,0.85],[1.4,0.85]].forEach(([a,b])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.36,0.25,16),new THREE.MeshLambertMaterial({color:0x111111}));w.rotation.x=Math.PI/2;w.position.set(a,0.36,b);c.add(w);});g.add(c);fCol(x,z,4.6,2.2,0,1.7);}
function fCanopy(g,x,z,col){const c=new THREE.Group();c.position.set(x,0,z);const leg=new THREE.MeshLambertMaterial({color:0xcfcfcf});[[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]].forEach(([a,b])=>fBox(c,0.06,2.3,0.06,leg,a,1.15,b));
  const roof=new THREE.Mesh(new THREE.ConeGeometry(2.2,0.6,4,1,true),new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide}));roof.rotation.y=Math.PI/4;roof.position.y=2.6;c.add(roof);
  const val=new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide});[[0,-1.52,0],[0,1.52,0],[-1.52,0,1],[1.52,0,1]].forEach(([a,b,r])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(3.04,0.25),val);p.position.set(a,2.2,b);if(r)p.rotation.y=Math.PI/2;c.add(p);});g.add(c);}
function fTable(g,x,z,len){const wd=new THREE.MeshLambertMaterial({map:FTEX.wood}),dk=new THREE.MeshLambertMaterial({color:0x333333});fBox(g,len,0.06,0.9,wd,x,0.8,z);[[-len/2+0.15,-0.35],[len/2-0.15,-0.35],[-len/2+0.15,0.35],[len/2-0.15,0.35]].forEach(([a,b])=>fBox(g,0.06,0.8,0.06,dk,x+a,0.4,z+b));fCol(x,z,len,0.9,0,0.85);}
function fFlag(g,x,z){const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,8,10),new THREE.MeshStandardMaterial({color:0xdddddd,metalness:0.7,roughness:0.3}));pole.position.set(x,4,z);g.add(pole);fPost(x,z,0.1,8);
  const tex=cvTex(256,136,(c,W,H)=>{for(let i=0;i<13;i++){c.fillStyle=i%2?'#fff':'#b22234';c.fillRect(0,i*H/13,W,H/13+1);}c.fillStyle='#3c3b6e';c.fillRect(0,0,W*0.4,H*7/13);c.fillStyle='#fff';for(let r=0;r<9;r++)for(let k=0;k<(r%2?5:6);k++){c.beginPath();c.arc(8+k*17+(r%2?8:0),6+r*7.4,1.8,0,7);c.fill();}});
  const geo=new THREE.PlaneGeometry(1.9,1,16,6);geo.translate(0.95,0,0);const f=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}));f.position.set(x,7.4,z);g.add(f);FU.flag=f;FU.flag0=geo.attributes.position.array.slice();}
function fSock(g,x,z){const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.06,5,8),new THREE.MeshLambertMaterial({color:0xeeeeee}));pole.position.set(x,2.5,z);g.add(pole);fPost(x,z,0.08,5);
  const sock=new THREE.Group();sock.rotation.order='YZX';sock.position.set(x,4.9,z);const tex=cvTex(64,64,(c,W,H)=>{for(let i=0;i<5;i++){c.fillStyle=i%2?'#ffffff':'#ff5a00';c.fillRect(i*W/5,0,W/5+1,H);}});
  const sm=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.3,1.8,14,1,true),new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}));sm.rotation.z=Math.PI/2;sm.position.x=0.9;sock.add(sm);const ring=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.02,6,16),new THREE.MeshLambertMaterial({color:0x999999}));ring.rotation.y=Math.PI/2;sock.add(ring);g.add(sock);(FU.socks=FU.socks||[]).push(sock);}
function fHangar(g,x,z,club){const wl=new THREE.MeshStandardMaterial({map:FTEX.metal,roughness:0.5,metalness:0.4,color:0xdfe3e6}),rf=new THREE.MeshStandardMaterial({color:0x8a2a1f,roughness:0.6,metalness:0.3}),dk=new THREE.MeshLambertMaterial({color:0x1c1c1c});
  const W=12,D=9,Hh=4.2;const h=new THREE.Group();h.position.set(x,0,z);
  fBox(h,W,Hh,0.2,wl,0,Hh/2,D/2);fBox(h,0.2,Hh,D,wl,-W/2,Hh/2,0);fBox(h,0.2,Hh,D,wl,W/2,Hh/2,0);fBox(h,3,Hh,0.2,wl,-W/2+1.5,Hh/2,-D/2);fBox(h,3,Hh,0.2,wl,W/2-1.5,Hh/2,-D/2);fBox(h,W-6,0.9,0.2,wl,0,Hh-0.45,-D/2);
  fBox(h,W-6.2,Hh-0.9,0.1,dk,0,(Hh-0.9)/2,-D/2+0.4);
  const shp=new THREE.Shape();shp.moveTo(-W/2-0.4,0);shp.lineTo(0,2.2);shp.lineTo(W/2+0.4,0);shp.lineTo(-W/2-0.4,0);const rg=new THREE.ExtrudeGeometry(shp,{depth:D+0.8,bevelEnabled:false});rg.translate(0,0,-(D+0.8)/2);const roof=new THREE.Mesh(rg,rf);roof.position.y=Hh;h.add(roof);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(7,1.1),new THREE.MeshBasicMaterial({map:signTex(club,'#0d3b66','#ffffff',1024,160)}));sign.position.set(0,Hh+0.65,-D/2-0.46);sign.rotation.y=Math.PI;h.add(sign);
  const win=new THREE.MeshStandardMaterial({color:0x9fc8e8,roughness:0.05,metalness:0.6});[-3,3].forEach(a=>fBox(h,1.6,1,0.06,win,a,2.2,D/2+0.11));
  g.add(h);fCol(x,z,W+0.4,D+0.4,0,Hh+2.2);}
function fPotty(g,x,z){const m=new THREE.MeshLambertMaterial({color:0x2f6fd6});fBox(g,1.2,2.3,1.2,m,x,1.15,z);fBox(g,1.3,0.12,1.3,new THREE.MeshLambertMaterial({color:0xeeeeee}),x,2.36,z);fCol(x,z,1.3,1.3,0,2.4);}
function fBench(g,x,z){const wd=new THREE.MeshLambertMaterial({map:FTEX.wood});fBox(g,2,0.06,0.4,wd,x,0.45,z);fBox(g,2,0.4,0.06,wd,x,0.75,z+0.2);[-0.85,0.85].forEach(a=>fBox(g,0.06,0.45,0.4,new THREE.MeshLambertMaterial({color:0x333333}),x+a,0.22,z));}
// ---- build it
function fldBuild(){
  if(FU.g){scene.remove(FU.g);FU.g=null;}FU.cols.forEach(gridRemove);FU.cols=[];FU.socks=[];FU.flag=null;if(!FLD.on||!CES.ENU)return;fldTextures();
  // level height: middle of the real ground under the field
  const hs=[];for(let u=-FLD.len/2;u<=FLD.len/2;u+=FLD.len/4)for(let v=-10;v<=40;v+=25){const p=fldW(u,v);hs.push(cesH0(p.x,p.z));}hs.sort((a,b)=>a-b);FU.h=hs[Math.floor(hs.length/2)]||0;
  const g=new THREE.Group();g.position.set(FLD.x,FU.h,FLD.z);g.rotation.y=-FLD.yaw;COLLECT=null;
  const L=FLD.len,W=FLD.w,club='MADISON FAMILY FARM R/C FIELD';
  // mowed grass apron that fades into the real ground at its edges
  const aw=L+56,ad=82,apron=new THREE.Mesh(new THREE.PlaneGeometry(aw,ad),new THREE.MeshLambertMaterial({map:FTEX.grass.clone()}));
  apron.material.map.wrapS=apron.material.map.wrapT=THREE.RepeatWrapping;apron.material.map.repeat.set(aw/14,ad/14);apron.material.map.needsUpdate=true;apron.rotation.x=-Math.PI/2;apron.position.set(0,0.02,18);apron.renderOrder=1;g.add(apron);
  // runway, taxiway, pads
  const rw=new THREE.Mesh(new THREE.PlaneGeometry(L,W),new THREE.MeshStandardMaterial({map:runwayTex(L,W),roughness:0.9,metalness:0}));rw.rotation.x=-Math.PI/2;rw.position.y=0.05;rw.renderOrder=2;g.add(rw);
  const asph=new THREE.MeshStandardMaterial({map:FTEX.asph,roughness:0.95});const tw=new THREE.Mesh(new THREE.PlaneGeometry(5,14),asph);tw.rotation.x=-Math.PI/2;tw.position.set(0,0.045,W/2+6.5);tw.renderOrder=2;g.add(tw);
  const conc=new THREE.MeshStandardMaterial({color:0x7d7a73,roughness:0.95});
  // flight line: numbered pilot stations, then the safety fence behind the pilots
  for(let k=0;k<5;k++){const u=(k-2)*6;const pad=fBox(g,2,0.06,2,conc,u,0.06,13.5);pad.renderOrder=3;
    const post=fBox(g,0.08,1.2,0.08,new THREE.MeshLambertMaterial({color:0x333333}),u-1.1,0.6,14.4);const sn=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5),new THREE.MeshBasicMaterial({map:signTex(String(k+1),'#ffd60a','#111111',128,128)}));sn.position.set(u-1.1,1.35,14.4);sn.rotation.y=Math.PI;g.add(sn);}
  const fenceL=Math.min(L,90),posts=new THREE.MeshStandardMaterial({color:0x9aa0a6,metalness:0.7,roughness:0.35});
  for(let u=-fenceL/2;u<=fenceL/2+0.01;u+=3){fBox(g,0.07,1.4,0.07,posts,u,0.7,16.2);fPost(u,16.2,0.08,1.4);}
  const rail=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,fenceL,8),posts);rail.rotation.z=Math.PI/2;rail.position.set(0,1.38,16.2);g.add(rail);
  const chainT=FTEX.chain.clone();chainT.wrapS=chainT.wrapT=THREE.RepeatWrapping;chainT.repeat.set(fenceL/0.6,1.3/0.6);chainT.needsUpdate=true;
  const ch=new THREE.Mesh(new THREE.PlaneGeometry(fenceL,1.3),new THREE.MeshLambertMaterial({map:chainT,transparent:true,alphaTest:0.3,side:THREE.DoubleSide}));ch.position.set(0,0.7,16.2);g.add(ch);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(6,0.9),new THREE.MeshBasicMaterial({map:signTex('⚠ PILOTS ONLY PAST THIS FENCE','#ffffff','#c1121f',1024,150)}));fl.position.set(0,1.0,16.28);g.add(fl);
  // wind socks at both ends + the helipad for drones and helis
  fSock(g,-L/2+4,-W/2-6);fSock(g,L/2-4,-W/2-6);
  const hp=new THREE.Group();hp.position.set(-L/2-14,0,8);const hd=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.3,0.08,36),new THREE.MeshStandardMaterial({color:0x2b2f33,roughness:0.9}));hd.position.y=0.04;hp.add(hd);
  const hr=new THREE.Mesh(new THREE.TorusGeometry(1.8,0.08,6,40),new THREE.MeshBasicMaterial({color:0xffd60a}));hr.rotation.x=-Math.PI/2;hr.position.y=0.09;hp.add(hr);[-0.45,0.45].forEach(a=>{const b=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.01,1.4),new THREE.MeshBasicMaterial({color:0xffffff}));b.position.set(a,0.09,0);hp.add(b);});const hb=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.01,0.18),new THREE.MeshBasicMaterial({color:0xffffff}));hb.position.y=0.09;hp.add(hb);g.add(hp);
  if(FLD.pits){
    // pits: start tables under pop-up canopies, benches, a flag, the clubhouse hangar, parking, a porta-potty
    [[-14,0xd62828],[-4,0x1d3557],[6,0x2a9d8f],[16,0xf4a261]].forEach(([u,c])=>{fCanopy(g,u,22,c);fTable(g,u,22,2.4);});
    for(let k=0;k<4;k++)fBench(g,-18+k*11,26.5);
    fFlag(g,-24,18.5);fHangar(g,26,34,club);fPotty(g,40,30);
    const cols=[0xb00020,0x1d4ed8,0xe5e7eb,0x111827,0x6b7280];for(let k=0;k<5;k++)fCar(g,-30+k*6.5,44,cols[k],Math.PI/2);
    const gravel=new THREE.Mesh(new THREE.PlaneGeometry(38,9),new THREE.MeshStandardMaterial({color:0x5f584e,roughness:1}));gravel.rotation.x=-Math.PI/2;gravel.position.set(-17,0.03,44);gravel.renderOrder=2;g.add(gravel);
    const board=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.2),new THREE.MeshBasicMaterial({map:signTex('FIELD RULES · STAY BEHIND THE FENCE','#1b4332','#ffffff',768,200)}));board.position.set(-28,1.6,17.6);board.rotation.y=Math.PI;g.add(board);fBox(g,0.1,1.6,0.1,posts,-29,0.8,17.7);fBox(g,0.1,1.6,0.1,posts,-27,0.8,17.7);
    // a few RC planes waiting on the tables
    [[-14,0],[6,2]].forEach(([u,i])=>{const pl=buildDrone(sanitize(Object.values(VPRESETS.plane)[i]),{});pl.g.scale.multiplyScalar(0.55);pl.g.position.set(u,1.0,22);pl.g.rotation.y=Math.PI/2;g.add(pl.g);});
    // trees around the edge
    [[-L/2-20,56,1.1,1],[-L/2-6,62,0.9,0],[L/2+18,58,1.2,1],[L/2+4,64,1,0],[-10,66,1.1,1],[14,68,0.9,0],[-L/2-24,-24,1,1],[L/2+22,-26,1.1,0]].forEach(([u,v,s,p])=>fTree(g,u,v,s,!!p));}
  // world-space collision for buildings needs world coords: done by fCol/fPost above
  g.traverse(o=>{if(o.isMesh){o.userData.field=true;const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m&&m.envMapIntensity!==undefined)m.envMapIntensity=0.3;});}});scene.add(g);FU.g=g;
  FU.station=(()=>{const p=fldW(0,13.5);return new V3(p.x,FU.h,p.z);})();if(!WALK.on)WALK.pilotAt=FU.station.clone();
  CES.cache.clear();}
function fldTick(t){if(!FU.g)return;if(FU.flag){const a=FU.flag.geometry.attributes.position,b=FU.flag0,m=Math.hypot(wind.x,wind.z);for(let i=0;i<a.count;i++){const x=b[i*3];a.array[i*3+2]=Math.sin(x*3-t*(3+m))*0.12*x*(0.4+m*0.12);a.array[i*3+1]=b[i*3+1]-x*Math.max(0,0.25-m*0.04);}a.needsUpdate=true;FU.flag.rotation.y=Math.atan2(-wind.z,wind.x)+FLD.yaw;}
  (FU.socks||[]).forEach(s=>{const m=Math.hypot(wind.x,wind.z);s.rotation.y=Math.atan2(-wind.z,wind.x)+FLD.yaw;s.rotation.z=-clamp(1.25-m*0.16,0,1.25);});}
// where things start at the field
function fldStart(k){const r=fldR();if(k==='plane'){const p=fldW(-FLD.len/2+9,0);return{x:p.x,z:p.z,yaw:Math.atan2(-r.rx,-r.rz)};}
  if(k==='car'){const p=fldW(0,FLD.w/2+9);return{x:p.x,z:p.z,yaw:Math.atan2(-(-r.px),-(-r.pz))};}
  const p=fldW(-FLD.len/2-14,8);return{x:p.x,z:p.z,yaw:Math.atan2(-r.rx,-r.rz)};}
function fldItems(){return[
  mInfo('✈️ Your flying field: runway, flight line, pits, clubhouse. Planes start at the end of the runway, drones and helis on the helipad, and you stand at pilot station 3.'),
  mItem(()=>'✈️ Airfield: '+(FLD.on?'ON':'off'),()=>{FLD.on=!FLD.on;fldSave();fldBuild();resetDrone(kindStart());}),
  mItem('📍 Move the airfield to where I am',()=>{const src=WALK.on?WALK.pos:D.pos;FLD.x=+src.x.toFixed(1);FLD.z=+src.z.toFixed(1);fldSave();fldBuild();toast('📍 Airfield moved here',1500);}),
  mItem(()=>'↻ Runway direction: '+Math.round(((90-FLD.yaw*180/Math.PI)%360+360)%360)+'°  ◀ ▶',()=>{},d=>{FLD.yaw+=d*Math.PI/12;fldSave();fldBuild();}),
  mItem('🌬 Point the runway into the wind',()=>{const m=Math.hypot(wind.x,wind.z);if(m<0.3){toast('No wind right now');return;}FLD.yaw=Math.atan2(-wind.z,-wind.x);fldSave();fldBuild();toast('🌬 Runway turned into the wind',1500);}),
  mRange('📏 Runway length',()=>FLD.len,v=>{FLD.len=v;fldSave();fldBuild();},50,260,10,v=>v+' m'),
  mRange('↔ Runway width',()=>FLD.w,v=>{FLD.w=v;fldSave();fldBuild();},5,30,1,v=>v+' m'),
  mItem(()=>'🛣 Runway: '+(FLD.surf==='paved'?'paved':'mowed grass'),()=>{FLD.surf=FLD.surf==='paved'?'grass':'paved';fldSave();fldBuild();}),
  mItem(()=>'🏠 Pits, clubhouse, cars: '+(FLD.pits?'ON':'off'),()=>{FLD.pits=!FLD.pits;fldSave();fldBuild();}),
  mItem('↺ Put the airfield back',()=>{Object.assign(FLD,{on:true,x:0,z:0,yaw:0,len:120,w:10,surf:'paved',pits:true});fldSave();fldBuild();resetDrone(kindStart());}),
  mInfo('Everyone in multiplayer gets the same airfield.'),mItem('◀ Back',()=>menuBack())];}
