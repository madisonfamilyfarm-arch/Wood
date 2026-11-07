// =====================================================================================
// ===== ✈️ THE AIRPORT: pick the OLD AIRPORT (runway + red-roof hangar, made realistic) or the RC CLUB FIELD
// =====  (flight line, pits, clubhouse). Menu → 🛫 Airport. Same airport for everyone in multiplayer.
// =====================================================================================
// ---- painted textures
function cvTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function noise(x,w,h,n,a,col){for(let i=0;i<n;i++){x.fillStyle=col(Math.random());x.globalAlpha=a*Math.random();x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2);}x.globalAlpha=1;}
const FTEX={};
function corrTex(base,dark,light,rust,horiz){return cvTex(256,256,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);const n=16;for(let i=0;i<w;i++){const s=Math.sin(i/w*Math.PI*2*n);x.fillStyle=s>0?light:dark;x.globalAlpha=Math.abs(s)*0.55;if(horiz)x.fillRect(0,i,w,1);else x.fillRect(i,0,1,h);}x.globalAlpha=1;
  if(rust){for(let i=0;i<26;i++){const px=Math.random()*w,g=x.createLinearGradient(px,0,px,h);g.addColorStop(0,'rgba(120,60,20,0)');g.addColorStop(0.6,'rgba(120,60,20,'+(0.08+Math.random()*0.12)+')');g.addColorStop(1,'rgba(90,50,20,0.25)');x.fillStyle=g;x.fillRect(px,h*Math.random()*0.5,2+Math.random()*5,h);}}
  noise(x,w,h,6000,0.15,r=>r<0.5?'#000':'#fff');},[1,1]);}
function ribBump(horiz){return cvTex(256,256,(x,w,h)=>{for(let i=0;i<w;i++){const s=0.5+0.5*Math.sin(i/w*Math.PI*2*16);const v=Math.round(s*255);x.fillStyle='rgb('+v+','+v+','+v+')';if(horiz)x.fillRect(0,i,w,1);else x.fillRect(i,0,1,h);}},[1,1]);}
function fldTextures(){if(FTEX.grass)return;
  FTEX.grass=cvTex(512,512,(x,w,h)=>{x.fillStyle='#38521f';x.fillRect(0,0,w,h);for(let i=0;i<8;i++){x.fillStyle=i%2?'rgba(255,255,220,0.035)':'rgba(0,20,0,0.05)';x.fillRect(i*w/8,0,w/8,h);}noise(x,w,h,60000,0.45,r=>r<0.33?'#26401a':r<0.66?'#4a6a2a':'#5d7a33');noise(x,w,h,3000,0.3,r=>r<0.5?'#6b6a3a':'#2c3a18');},[1,1]);
  FTEX.asph=cvTex(256,256,(x,w,h)=>{x.fillStyle='#4a4d50';x.fillRect(0,0,w,h);noise(x,w,h,30000,0.5,r=>r<0.5?'#2f3134':'#6c6f72');for(let i=0;i<6;i++){x.strokeStyle='rgba(20,20,20,0.35)';x.lineWidth=1;x.beginPath();let px=Math.random()*w,py=Math.random()*h;x.moveTo(px,py);for(let k=0;k<6;k++){px+=(Math.random()-0.5)*50;py+=(Math.random()-0.5)*50;x.lineTo(px,py);}x.stroke();}},[1,1]);
  FTEX.det=cvTex(256,256,(x,w,h)=>{x.fillStyle='#808080';x.fillRect(0,0,w,h);noise(x,w,h,40000,0.6,r=>r<0.5?'#3a3a3a':'#c8c8c8');for(let i=0;i<5;i++){x.strokeStyle='rgba(30,30,30,0.5)';x.lineWidth=1.2;x.beginPath();let px=Math.random()*w,py=Math.random()*h;x.moveTo(px,py);for(let k=0;k<7;k++){px+=(Math.random()-0.5)*40;py+=(Math.random()-0.5)*40;x.lineTo(px,py);}x.stroke();}},[1,1]);
  FTEX.conc=cvTex(256,256,(x,w,h)=>{x.fillStyle='#8d8a83';x.fillRect(0,0,w,h);noise(x,w,h,26000,0.35,r=>r<0.5?'#6d6a63':'#a9a69f');x.strokeStyle='rgba(40,40,40,0.5)';x.lineWidth=2;x.strokeRect(1,1,w-2,h-2);for(let i=0;i<10;i++){x.fillStyle='rgba(30,30,25,'+(0.05+Math.random()*0.1)+')';x.beginPath();x.ellipse(Math.random()*w,Math.random()*h,10+Math.random()*30,6+Math.random()*16,Math.random()*3,0,7);x.fill();}},[1,1]);
  FTEX.gravel=cvTex(256,256,(x,w,h)=>{x.fillStyle='#6e675d';x.fillRect(0,0,w,h);noise(x,w,h,50000,0.7,r=>r<0.33?'#4a443c':r<0.66?'#8f877b':'#a39b8e');},[1,1]);
  FTEX.edge=cvTex(256,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#000');g.addColorStop(0.12,'#fff');g.addColorStop(0.88,'#fff');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,w,h);x.globalCompositeOperation='multiply';const g2=x.createLinearGradient(0,0,0,h);g2.addColorStop(0,'#000');g2.addColorStop(0.12,'#fff');g2.addColorStop(0.88,'#fff');g2.addColorStop(1,'#000');x.fillStyle=g2;x.fillRect(0,0,w,h);});
  FTEX.chain=cvTex(64,64,(x,w,h)=>{x.clearRect(0,0,w,h);x.strokeStyle='rgba(190,195,200,0.95)';x.lineWidth=2;for(let i=-64;i<128;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i+64,64);x.stroke();x.beginPath();x.moveTo(i+64,0);x.lineTo(i,64);x.stroke();}},[1,1]);
  FTEX.wood=cvTex(128,128,(x,w,h)=>{x.fillStyle='#9a7246';x.fillRect(0,0,w,h);for(let i=0;i<40;i++){x.strokeStyle='rgba(60,35,10,'+(0.1+Math.random()*0.2)+')';x.beginPath();const y=Math.random()*h;x.moveTo(0,y);x.bezierCurveTo(w/3,y+4,w*2/3,y-4,w,y+2);x.stroke();}},[1,1]);
  FTEX.metal=cvTex(128,128,(x,w,h)=>{x.fillStyle='#b8bcc0';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=8){x.fillStyle='rgba(0,0,0,0.12)';x.fillRect(i,0,2,h);x.fillStyle='rgba(255,255,255,0.2)';x.fillRect(i+2,0,1,h);}},[1,1]);
  FTEX.galv=corrTex('#a7adb2','#6f757a','#dfe4e8',true);FTEX.red=corrTex('#8e2a1f','#5a1510','#c0473a',true,true);FTEX.rib=ribBump();FTEX.ribH=ribBump(true);}
function texRep(t,u,v){const c=t.clone();c.wrapS=c.wrapT=THREE.RepeatWrapping;c.repeat.set(u,v);c.needsUpdate=true;return c;}
// asphalt / concrete get a fine detail texture on top of the painted markings (sharp up close)
function aptDetail(mat,rep){mat.onBeforeCompile=sh=>{sh.uniforms.det={value:FTEX.det};sh.uniforms.drep={value:new THREE.Vector2(rep[0],rep[1])};
  sh.fragmentShader='uniform sampler2D det;uniform vec2 drep;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nvec3 lkd=texture2D(det,vUv*drep).rgb;vec3 lkd2=texture2D(det,vUv*drep*0.21+0.37).rgb;diffuseColor.rgb*=0.62+lkd*0.5+lkd2*0.25;');};mat.customProgramCacheKey=()=>'aptdet';return mat;}
function runwayTex(len,w){const PX=10,W=Math.round(w*PX*2),L=Math.round(Math.min(len,260)*PX);
  return cvTex(L,W,(x)=>{const sx=L/len,sy=W/w;
    if(FLD.surf==='grass'){x.fillStyle='#456b28';x.fillRect(0,0,L,W);for(let i=0;i<len;i+=6){x.fillStyle=(i/6)%2?'rgba(255,255,220,0.08)':'rgba(0,40,0,0.08)';x.fillRect(i*sx,0,3*sx,W);}noise(x,L,W,L*W/40,0.4,r=>r<0.5?'#4c7a2a':'#8fbc58');
      x.fillStyle='rgba(255,255,255,0.85)';for(let i=0;i<len;i+=8){x.fillRect(i*sx,1,3*sx,0.35*sy);x.fillRect(i*sx,W-1-0.35*sy,3*sx,0.35*sy);}return;}
    x.fillStyle='#43464a';x.fillRect(0,0,L,W);noise(x,L,W,L*W/14,0.35,r=>r<0.5?'#2e3033':'#5f6266');
    const tg=x.createLinearGradient(0,0,0,W);tg.addColorStop(0,'rgba(0,0,0,0)');tg.addColorStop(0.35,'rgba(0,0,0,0.12)');tg.addColorStop(0.5,'rgba(0,0,0,0.18)');tg.addColorStop(0.65,'rgba(0,0,0,0.12)');tg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=tg;x.fillRect(0,0,L,W); // darker where the wheels roll
    for(let i=0;i<18;i++){x.fillStyle='rgba(15,15,15,'+(0.1+Math.random()*0.15)+')';x.fillRect(Math.random()*L,Math.random()*W,30+Math.random()*120,6+Math.random()*18);} // patches / oil
    for(let i=0;i<30;i++){x.strokeStyle='rgba(10,10,10,0.35)';x.lineWidth=1+Math.random();x.beginPath();let px=Math.random()*L,py=Math.random()*W;x.moveTo(px,py);for(let k=0;k<5;k++){px+=(Math.random()-0.5)*60;py+=(Math.random()-0.5)*25;x.lineTo(px,py);}x.stroke();} // cracks
    for(let k=0;k<2;k++){const u0=k?len-30:6,u1=k?len-6:30;for(let i=0;i<14;i++){x.strokeStyle='rgba(8,8,8,'+(0.15+Math.random()*0.2)+')';x.lineWidth=2+Math.random()*3;const yy=W/2+(Math.random()-0.5)*W*0.4;x.beginPath();x.moveTo((u0+Math.random()*6)*sx,yy);x.lineTo((u1-Math.random()*6)*sx,yy+(Math.random()-0.5)*8);x.stroke();}} // tyre marks at the ends
    x.fillStyle='#dcdcd4';x.fillRect(0,0.25*sy,L,0.3*sy);x.fillRect(0,W-0.55*sy,L,0.3*sy); // edge lines
    for(let u=14;u<len-14;u+=8)x.fillRect(u*sx,W/2-0.15*sy,4*sx,0.3*sy); // centre dashes
    const bars=Math.max(4,Math.floor(w/1.6));for(let k=0;k<bars;k++){const yy=(0.9+k*(w-1.8)/bars+0.2)*sy;x.fillRect(1.5*sx,yy,5*sx,0.55*sy);x.fillRect(L-6.5*sx,yy,5*sx,0.55*sy);} // piano keys
    const n1=((Math.round((90-FLD.yaw*180/Math.PI)/10)%36)+36)%36||36,n2=((n1+17)%36)+1;x.font='bold '+Math.round(w*0.55*sy)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.save();x.translate(10*sx,W/2);x.rotate(Math.PI/2);x.fillText(String(n2).padStart(2,'0'),0,0);x.restore();x.save();x.translate(L-10*sx,W/2);x.rotate(-Math.PI/2);x.fillText(String(n1).padStart(2,'0'),0,0);x.restore();
    for(let k=0;k<2;k++){const u=k?len-26:26;x.fillRect((u-3)*sx,0.18*W,6*sx,0.18*W);x.fillRect((u-3)*sx,0.64*W,6*sx,0.18*W);} // aiming points
    noise(x,L,W,L*W/30,0.18,r=>r<0.5?'#000':'#777'); // weathering over the paint
  });}
function signTex(txt,bg,fg,w,h){return cvTex(w||512,h||128,(x,W,H)=>{x.fillStyle=bg;x.fillRect(0,0,W,H);x.strokeStyle=fg;x.lineWidth=6;x.strokeRect(6,6,W-12,H-12);x.fillStyle=fg;x.font='bold '+Math.round(H*0.42)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,W/2,H/2+2);});}
// ---- building helpers (local airport space: x = along the runway, z = towards the pilots, y = up)
function fBox(g,w,h,d,mat,x,y,z,ry){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;g.add(m);return m;}
function fCol(u,v,w,d,y0,y1){const a=fldW(u-w/2,v-d/2),b=fldW(u+w/2,v+d/2),c=fldW(u-w/2,v+d/2),e=fldW(u+w/2,v-d/2);FU.cols.push(gridAdd({t:'b',x0:Math.min(a.x,b.x,c.x,e.x),z0:Math.min(a.z,b.z,c.z,e.z),x1:Math.max(a.x,b.x,c.x,e.x),z1:Math.max(a.z,b.z,c.z,e.z),y0:FU.h+y0,y1:FU.h+y1},(a.x+b.x)/2,(a.z+b.z)/2,Math.max(w,d)/2+1));}
function fPost(u,v,r,h){const p=fldW(u,v);FU.cols.push(gridAdd({t:'v',x:p.x,z:p.z,r,y0:FU.h-1,y1:FU.h+h},p.x,p.z,r));}
function fTree(g,x,z,s,pine){if(typeof lkTree==='function'&&lkTree(g,x,z,(pine?13:11)*s,pine)){fPost(x,z,0.4*s,9*s);return;}
  const tr=new THREE.Mesh(GEO.trunk,new THREE.MeshLambertMaterial({color:0x5b3d22}));tr.scale.set(0.25*s,(pine?4:3.5)*s,0.25*s);tr.position.set(x,0,z);g.add(tr);
  const c=new THREE.MeshLambertMaterial({color:pine?0x2f5a26:0x4f7a2e});if(pine){[0,1,2].forEach(k=>{const m=new THREE.Mesh(GEO.cone,c);m.scale.set((2.4-k*0.6)*s,3*s,(2.4-k*0.6)*s);m.position.set(x,(1.6+k*1.9)*s,z);g.add(m);});}
  else{[[0,4.2,0,2.6],[1.2,3.6,0.5,1.8],[-1,3.8,-0.6,1.9]].forEach(q=>{const m=new THREE.Mesh(GEO.ball,c);m.scale.setScalar(q[3]*s);m.position.set(x+q[0]*s,q[1]*s,z+q[2]*s);g.add(m);});}fPost(x,z,0.35*s,7*s);}
function fCar(g,x,z,col,ry){const c=new THREE.Group();c.position.set(x,0,z);c.rotation.y=ry||0;const body=new THREE.MeshPhysicalMaterial({color:col,roughness:0.25,metalness:0.55,clearcoat:1,clearcoatRoughness:0.08});
  const b=new THREE.Mesh(new THREE.BoxGeometry(4.4,0.75,1.8,1,1,1),body);b.position.y=0.68;c.add(b);fBox(c,2.4,0.62,1.66,body,-0.25,1.33,0);const gl=new THREE.MeshStandardMaterial({color:0x10161c,roughness:0.05,metalness:0.9});fBox(c,2.44,0.44,1.62,gl,-0.25,1.35,0);fBox(c,0.05,0.4,1.4,gl,0.98,1.33,0);
  const tm=new THREE.MeshStandardMaterial({color:0x111111,roughness:0.9}),rim=new THREE.MeshStandardMaterial({color:0xbfc4c8,roughness:0.3,metalness:0.9});
  [[-1.4,-0.85],[1.4,-0.85],[-1.4,0.85],[1.4,0.85]].forEach(([a,bb])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.36,0.25,18),tm);w.rotation.x=Math.PI/2;w.position.set(a,0.36,bb);c.add(w);const h=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.27,12),rim);h.rotation.x=Math.PI/2;h.position.set(a,0.36,bb);c.add(h);});
  const lt=new THREE.MeshStandardMaterial({color:0xfff6dd,emissive:0x332a10,roughness:0.2});[-0.6,0.6].forEach(k=>fBox(c,0.05,0.15,0.35,lt,2.21,0.8,k));const tl=new THREE.MeshStandardMaterial({color:0x8a0000,roughness:0.3});[-0.6,0.6].forEach(k=>fBox(c,0.05,0.15,0.35,tl,-2.21,0.8,k));
  g.add(c);fCol(x,z,4.6,2.2,0,1.7);}
function fCanopy(g,x,z,col){const c=new THREE.Group();c.position.set(x,0,z);const leg=new THREE.MeshStandardMaterial({color:0xcfcfcf,metalness:0.8,roughness:0.3});[[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]].forEach(([a,b])=>fBox(c,0.05,2.3,0.05,leg,a,1.15,b));
  const cm=new THREE.MeshStandardMaterial({color:col,side:THREE.DoubleSide,roughness:0.85});const roof=new THREE.Mesh(new THREE.ConeGeometry(2.2,0.6,4,1,true),cm);roof.rotation.y=Math.PI/4;roof.position.y=2.6;c.add(roof);
  [[0,-1.52,0],[0,1.52,0],[-1.52,0,1],[1.52,0,1]].forEach(([a,b,r])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(3.04,0.25),cm);p.position.set(a,2.2,b);if(r)p.rotation.y=Math.PI/2;c.add(p);});g.add(c);}
function fTable(g,x,z,len){const wd=new THREE.MeshStandardMaterial({map:FTEX.wood,roughness:0.8}),dk=new THREE.MeshStandardMaterial({color:0x333333});fBox(g,len,0.06,0.9,wd,x,0.8,z);[[-len/2+0.15,-0.35],[len/2-0.15,-0.35],[-len/2+0.15,0.35],[len/2-0.15,0.35]].forEach(([a,b])=>fBox(g,0.06,0.8,0.06,dk,x+a,0.4,z+b));
  // field box + transmitter on the table
  fBox(g,0.5,0.3,0.3,new THREE.MeshStandardMaterial({color:0x1c3d7a,roughness:0.5}),x-len/2+0.5,0.98,z);fBox(g,0.22,0.08,0.18,new THREE.MeshStandardMaterial({color:0x222222,roughness:0.4}),x+len/2-0.4,0.87,z);fCol(x,z,len,0.9,0,0.85);}
function fFlag(g,x,z){const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,8,10),new THREE.MeshStandardMaterial({color:0xdddddd,metalness:0.8,roughness:0.25}));pole.position.set(x,4,z);g.add(pole);fPost(x,z,0.1,8);
  const tex=cvTex(256,136,(c,W,H)=>{for(let i=0;i<13;i++){c.fillStyle=i%2?'#fff':'#b22234';c.fillRect(0,i*H/13,W,H/13+1);}c.fillStyle='#3c3b6e';c.fillRect(0,0,W*0.4,H*7/13);c.fillStyle='#fff';for(let r=0;r<9;r++)for(let k=0;k<(r%2?5:6);k++){c.beginPath();c.arc(8+k*17+(r%2?8:0),6+r*7.4,1.8,0,7);c.fill();}});
  const geo=new THREE.PlaneGeometry(1.9,1,16,6);geo.translate(0.95,0,0);const f=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide,roughness:0.9}));f.position.set(x,7.4,z);g.add(f);FU.flag=f;FU.flag0=geo.attributes.position.array.slice();}
function fSock(g,x,z){const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.06,5,8),new THREE.MeshStandardMaterial({color:0xeeeeee,roughness:0.5}));pole.position.set(x,2.5,z);g.add(pole);fPost(x,z,0.08,5);
  const sock=new THREE.Group();sock.rotation.order='YZX';sock.position.set(x,4.9,z);const tex=cvTex(64,64,(c,W,H)=>{for(let i=0;i<5;i++){c.fillStyle=i%2?'#ffffff':'#ff5a00';c.fillRect(i*W/5,0,W/5+1,H);}});
  const sm=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.3,1.8,14,1,true),new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide,roughness:0.9}));sm.rotation.z=Math.PI/2;sm.position.x=0.9;sock.add(sm);const ring=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.02,6,16),new THREE.MeshStandardMaterial({color:0x999999,metalness:0.8}));ring.rotation.y=Math.PI/2;sock.add(ring);g.add(sock);(FU.socks=FU.socks||[]).push(sock);}
// the clubhouse (RC club field)
function fHangar(g,x,z,club){const wl=new THREE.MeshStandardMaterial({map:texRep(FTEX.galv,3,1),bumpMap:texRep(FTEX.rib,3,1),bumpScale:0.04,roughness:0.45,metalness:0.6,color:0xffffff}),rf=new THREE.MeshStandardMaterial({map:texRep(FTEX.red,3,1),roughness:0.55,metalness:0.4}),dk=new THREE.MeshStandardMaterial({color:0x1c1c1c,roughness:0.9});
  const W=12,D=9,Hh=4.2;const h=new THREE.Group();h.position.set(x,0,z);
  fBox(h,W,Hh,0.2,wl,0,Hh/2,D/2);fBox(h,0.2,Hh,D,wl,-W/2,Hh/2,0);fBox(h,0.2,Hh,D,wl,W/2,Hh/2,0);fBox(h,3,Hh,0.2,wl,-W/2+1.5,Hh/2,-D/2);fBox(h,3,Hh,0.2,wl,W/2-1.5,Hh/2,-D/2);fBox(h,W-6,0.9,0.2,wl,0,Hh-0.45,-D/2);
  fBox(h,W-6.2,Hh-0.9,0.1,dk,0,(Hh-0.9)/2,-D/2+0.4);
  const shp=new THREE.Shape();shp.moveTo(-W/2-0.4,0);shp.lineTo(0,2.2);shp.lineTo(W/2+0.4,0);shp.lineTo(-W/2-0.4,0);const rg=new THREE.ExtrudeGeometry(shp,{depth:D+0.8,bevelEnabled:false});rg.translate(0,0,-(D+0.8)/2);const roof=new THREE.Mesh(rg,rf);roof.position.y=Hh;h.add(roof);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(7,1.1),new THREE.MeshStandardMaterial({map:signTex(club,'#0d3b66','#ffffff',1024,160),roughness:0.6}));sign.position.set(0,Hh+0.65,-D/2-0.46);sign.rotation.y=Math.PI;h.add(sign);
  const win=new THREE.MeshStandardMaterial({color:0x22313d,roughness:0.03,metalness:0.9});[-3,3].forEach(a=>fBox(h,1.6,1,0.06,win,a,2.2,D/2+0.11));
  g.add(h);fCol(x,z,W+0.4,D+0.4,0,Hh+2.2);}
// the old airport's hangar, like the one at the farm: corrugated metal, red arched roof, big sliding doors
function fQuonset(g,x,z,club){const W=14,D=9,Hw=3.4,R=D/2;const h=new THREE.Group();h.position.set(x,0,z);
  const wl=new THREE.MeshStandardMaterial({map:texRep(FTEX.galv,4,1),bumpMap:texRep(FTEX.rib,4,1),bumpScale:0.05,roughness:0.42,metalness:0.65});
  const wlS=new THREE.MeshStandardMaterial({map:texRep(FTEX.galv,3,1),bumpMap:texRep(FTEX.rib,3,1),bumpScale:0.05,roughness:0.42,metalness:0.65});
  const rf=new THREE.MeshStandardMaterial({map:texRep(FTEX.red,1.5,4.6),bumpMap:texRep(FTEX.ribH,1.5,4.6),bumpScale:0.06,roughness:0.5,metalness:0.45,side:THREE.DoubleSide});
  const dk=new THREE.MeshStandardMaterial({color:0x121314,roughness:1}),trim=new THREE.MeshStandardMaterial({color:0xe8e8e2,roughness:0.5,metalness:0.3});
  // side walls + back wall
  fBox(h,W,Hw,0.15,wl,0,Hw/2,-D/2);fBox(h,0.15,Hw,D,wlS,-W/2,Hw/2,0);fBox(h,0.15,Hw,D,wlS,W/2,Hw/2,0);
  // arched roof (ribs run over the top) + the half-round gable ends
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(R+0.12,R+0.12,W+0.5,40,1,true,-Math.PI/2,Math.PI),rf);roof.rotation.z=Math.PI/2;roof.rotation.x=-Math.PI/2;roof.position.y=Hw;h.add(roof);
  [-1,1].forEach(sd=>{const cap=new THREE.Mesh(new THREE.CircleGeometry(R,40,0,Math.PI),wlS);cap.rotation.y=sd*Math.PI/2;cap.position.set(sd*W/2,Hw,0);h.add(cap);});
  // front: big door opening, one sliding door pushed aside, dark inside, a plane inside
  const front=new THREE.Group();front.position.z=D/2;h.add(front);
  fBox(front,2.2,Hw,0.15,wl,-W/2+1.1,Hw/2,0);fBox(front,2.2,Hw,0.15,wl,W/2-1.1,Hw/2,0);
  fBox(front,W-4.4,0.5,0.15,trim,0,Hw-0.25,0.02);
  fBox(h,W-4.6,Hw-0.5,0.1,dk,0,(Hw-0.5)/2,D/2-0.6); // shadowy inside
  fBox(front,4.6,Hw-0.55,0.12,wl,-2.4,(Hw-0.55)/2,0.25); // closed half
  fBox(front,4.6,Hw-0.55,0.12,wl,W/2-2.0,(Hw-0.55)/2,0.45); // the other half slid open
  fBox(front,W,0.08,0.08,trim,0,Hw-0.5,0.55); // door track
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(7.5,1.05),new THREE.MeshStandardMaterial({map:signTex(club,'#7a1c14','#f5efe0',1024,150),roughness:0.6}));sign.position.set(0,Hw+0.58,-0.02);sign.rotation.x=-0.16;front.add(sign);
  const lamp=new THREE.Mesh(new THREE.ConeGeometry(0.25,0.3,12,1,true),new THREE.MeshStandardMaterial({color:0x2b4d2b,roughness:0.5,metalness:0.5,side:THREE.DoubleSide}));lamp.position.set(0,Hw+0.4,0.4);front.add(lamp);
  // windows on the sides
  const win=new THREE.MeshStandardMaterial({color:0x1f2a33,roughness:0.03,metalness:0.9});[-3.5,0,3.5].forEach(a=>{fBox(h,1.2,0.9,0.06,win,a,2.1,-D/2-0.09);});
  // gutters and a downspout
  const gut=new THREE.MeshStandardMaterial({color:0xcfd3d6,metalness:0.8,roughness:0.3});[-1,1].forEach(s=>fBox(h,W+0.4,0.12,0.12,gut,0,Hw,s*(R+0.15)));fBox(h,0.08,Hw,0.08,gut,W/2+0.1,Hw/2,R+0.15);
  // a plane parked just inside
  try{const pl=buildDrone(sanitize(VPRESETS.plane.trainer),{});pl.g.scale.multiplyScalar(0.9);pl.g.position.set(-1,0.35,D/2-2.2);pl.g.rotation.y=Math.PI;h.add(pl.g);}catch(e){}
  g.add(h);fCol(x,z,W+0.6,D+0.6,0,Hw+R+0.3);}
function fPotty(g,x,z){const m=new THREE.MeshStandardMaterial({color:0x2f6fd6,roughness:0.6});fBox(g,1.2,2.3,1.2,m,x,1.15,z);fBox(g,1.3,0.12,1.3,new THREE.MeshStandardMaterial({color:0xeeeeee}),x,2.36,z);fCol(x,z,1.3,1.3,0,2.4);}
function fBench(g,x,z){const wd=new THREE.MeshStandardMaterial({map:FTEX.wood,roughness:0.8});fBox(g,2,0.06,0.4,wd,x,0.45,z);fBox(g,2,0.4,0.06,wd,x,0.75,z+0.2);[-0.85,0.85].forEach(a=>fBox(g,0.06,0.45,0.4,new THREE.MeshStandardMaterial({color:0x333333}),x+a,0.22,z));}
function fPad(g,w,d,tex,x,z,y,rep){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),aptDetail(new THREE.MeshStandardMaterial({map:texRep(tex,rep?rep[0]:w/6,rep?rep[1]:d/6),roughness:0.95}),[w/3,d/3]));m.rotation.x=-Math.PI/2;m.position.set(x,y||0.04,z);m.renderOrder=2;m.userData.noCast=true;g.add(m);return m;}
function fHelipad(g,x,z){const hp=new THREE.Group();hp.position.set(x,0,z);const hd=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.3,0.08,36),new THREE.MeshStandardMaterial({color:0x2b2f33,roughness:0.9}));hd.position.y=0.04;hp.add(hd);
  const hr=new THREE.Mesh(new THREE.TorusGeometry(1.8,0.08,6,40),new THREE.MeshStandardMaterial({color:0xffd60a,roughness:0.6}));hr.rotation.x=-Math.PI/2;hr.position.y=0.09;hp.add(hr);[-0.45,0.45].forEach(a=>{const b=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.01,1.4),new THREE.MeshStandardMaterial({color:0xffffff}));b.position.set(a,0.09,0);hp.add(b);});const hb=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.01,0.18),new THREE.MeshStandardMaterial({color:0xffffff}));hb.position.y=0.09;hp.add(hb);g.add(hp);}
function fFlightLine(g,fenceL,vS,vF){const conc=aptDetail(new THREE.MeshStandardMaterial({map:FTEX.conc,roughness:0.95}),[1,1]),posts=new THREE.MeshStandardMaterial({color:0x9aa0a6,metalness:0.75,roughness:0.3});
  for(let k=0;k<5;k++){const u=(k-2)*6;const pad=fBox(g,2,0.06,2,conc,u,0.06,vS);pad.renderOrder=3;pad.userData.noCast=true;
    fBox(g,0.08,1.2,0.08,new THREE.MeshStandardMaterial({color:0x333333}),u-1.1,0.6,vS+0.9);const sn=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5),new THREE.MeshStandardMaterial({map:signTex(String(k+1),'#ffd60a','#111111',128,128),roughness:0.6}));sn.position.set(u-1.1,1.35,vS+0.92);sn.rotation.y=Math.PI;g.add(sn);}
  for(let u=-fenceL/2;u<=fenceL/2+0.01;u+=3){fBox(g,0.07,1.4,0.07,posts,u,0.7,vF);fPost(u,vF,0.08,1.4);}
  const rail=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,fenceL,8),posts);rail.rotation.z=Math.PI/2;rail.position.set(0,1.38,vF);g.add(rail);
  const ch=new THREE.Mesh(new THREE.PlaneGeometry(fenceL,1.3),new THREE.MeshStandardMaterial({map:texRep(FTEX.chain,fenceL/0.6,1.3/0.6),transparent:true,alphaTest:0.3,side:THREE.DoubleSide,metalness:0.6,roughness:0.4}));ch.position.set(0,0.7,vF);g.add(ch);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(6,0.9),new THREE.MeshStandardMaterial({map:signTex('⚠ PILOTS ONLY PAST THIS FENCE','#ffffff','#c1121f',1024,150),roughness:0.6}));fl.position.set(0,1.0,vF+0.08);g.add(fl);}
// mowed grass under the airport: the photo grass with light/dark mowing stripes
function fApron(g,aw,ad,cz){const photo=LOOK.on&&LOOK.tex.grass,t=photo?LOOK.tex.grass:texRep(FTEX.grass,aw/14,ad/14);
  // the photo grass is shared with the ground (no copy, so it's ready as soon as the picture loads): the plane's uv is scaled to metres instead
  const mat=new THREE.MeshStandardMaterial({map:t,roughness:0.97,metalness:0,color:photo?0x9aa874:0xffffff});if(photo&&LOOK.tex.grassN){mat.normalMap=LOOK.tex.grassN;mat.normalScale=new THREE.Vector2(0.6,0.6);}
  mat.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nfloat st=sin(vUv.x*6.2832);diffuseColor.rgb*=1.0+0.085*sign(st);diffuseColor.rgb*=mix(0.9,1.06,texture2D(map,vUv*0.09).g*1.25);');};mat.customProgramCacheKey=()=>'apron';
  const geo=new THREE.PlaneGeometry(aw,ad);if(photo){const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*aw/CH,uv.getY(i)*ad/CH);}
  const a=new THREE.Mesh(geo,mat);a.rotation.x=-Math.PI/2;a.position.set(0,0.02,cz);a.renderOrder=1;a.userData.noCast=true;g.add(a);}
function fRunway(g,L,W){const rw=new THREE.Mesh(new THREE.PlaneGeometry(L,W),aptDetail(new THREE.MeshStandardMaterial({map:runwayTex(L,W),roughness:0.88,metalness:0}),[L/3,W/3]));rw.rotation.x=-Math.PI/2;rw.position.y=0.05;rw.renderOrder=2;rw.userData.noCast=true;g.add(rw);
  // runway edge lights
  const lm=new THREE.MeshStandardMaterial({color:0xfff7d6,emissive:0x2a2410,roughness:0.2}),lp=new THREE.MeshStandardMaterial({color:0x2a2c2e,roughness:0.6});for(let u=-L/2;u<=L/2+0.1;u+=10)[-1,1].forEach(s=>{fBox(g,0.05,0.22,0.05,lp,u,0.11,s*(W/2+0.8));fBox(g,0.1,0.07,0.1,lm,u,0.25,s*(W/2+0.8));});}
function aptRealMap(){return typeof CES!=='undefined'&&CES.on&&!!CES.ENU;}
// ---- build it
function fldBuild(){
  if(FU.g){scene.remove(FU.g);FU.g=null;}FU.cols.forEach(gridRemove);FU.cols=[];FU.socks=[];FU.flag=null;FU.built=false;FU.station=null;
  const rm=aptRealMap();if(!FLD.on||(typeof CES!=='undefined'&&CES.on&&!CES.ENU)){aptAfter();return;}fldTextures();
  // level height: middle of the ground under the airport
  const hs=[];for(let u=-FLD.len/2;u<=FLD.len/2;u+=FLD.len/4)for(let v=-10;v<=20;v+=15){const p=fldW(u,v);hs.push(rm?cesH0(p.x,p.z):H0(p.x,p.z));}hs.sort((a,b)=>a-b);FU.h=hs[Math.floor(hs.length/2)]||0;
  const g=new THREE.Group();g.position.set(FLD.x,FU.h,FLD.z);g.rotation.y=-FLD.yaw;COLLECT=null;
  const L=FLD.len,W=FLD.w;
  if(FLD.style==='old')aptOld(g,L,W);else aptClub(g,L,W);
  g.traverse(o=>{if(o.isMesh){o.userData.field=true;const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m&&m.envMapIntensity!==undefined&&!m.isMeshPhysicalMaterial)m.envMapIntensity=Math.min(m.envMapIntensity,0.6);});}});scene.add(g);FU.g=g;FU.built=true;
  FU.station=(()=>{const p=fldW(0,FLD.style==='old'?10:13.5);return new V3(p.x,FU.h,p.z);})();
  if(rm&&!WALK.on)WALK.pilotAt=FU.station.clone();
  aptAfter();}
// after the airport changes: the ground + trees around it are rebuilt
function aptAfter(){if(typeof CES!=='undefined'&&CES.on){CES.cache.clear();return;}if(typeof chunks!=='undefined'&&chunks.size){for(const ch of chunks.values())unloadChunk(ch);chunks.clear();chunkTick(true);}}
// 🏚 the OLD AIRPORT: one runway, the red-roof hangar on the north side, pilots + a few tables on the south side
function aptOld(g,L,W){const club='MADISON FAMILY FARM';
  fApron(g,L+66,58,-2.5);fRunway(g,L,W);
  // hangar, its concrete pad and the taxiway to the runway
  fQuonset(g,14,-19.5,club);fPad(g,16,6,FTEX.conc,14,-12,0.045,[4,1.5]);fPad(g,6,4.2,FTEX.asph,14,-7.2,0.042);
  fSock(g,40,-12);fSock(g,-L/2+4,W/2+6);
  // pilots stand south of the runway behind a low fence, start tables under canopies behind them
  fFlightLine(g,64,10,12.5);
  [[-20,0xd62828],[-8,0x1d3557],[4,0x2a9d8f]].forEach(([u,c])=>{fCanopy(g,u,18,c);fTable(g,u,18,2.4);});
  for(let k=0;k<3;k++)fBench(g,-22+k*11,22);
  fFlag(g,-32,15);fPotty(g,26,20);fHelipad(g,-22,-16);
  // parking at the west end
  fPad(g,22,14,FTEX.gravel,-L/2-18,10,0.04,[6,4]);const cols=[0xb00020,0x1d4ed8,0xe5e7eb,0x111827];for(let k=0;k<4;k++)fCar(g,-L/2-26+k*5.5,10,cols[k],Math.PI/2);
  // a couple of planes waiting on the tables
  [[-20,0],[4,2]].forEach(([u,i])=>{const pl=buildDrone(sanitize(Object.values(VPRESETS.plane)[i]),{});pl.g.scale.multiplyScalar(0.55);pl.g.position.set(u,1.0,18);pl.g.rotation.y=Math.PI/2;g.add(pl.g);});
  const board=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.2),new THREE.MeshStandardMaterial({map:signTex('FIELD RULES · STAY BEHIND THE FENCE','#1b4332','#ffffff',768,200),roughness:0.6}));board.position.set(-28,1.6,14.1);board.rotation.y=Math.PI;g.add(board);
  if(aptRealMap())[[-L/2-30,-26,1.1,1],[L/2+24,-28,1.2,0],[L/2+26,22,1,1],[-L/2-34,24,1.1,0]].forEach(([u,v,s,p])=>fTree(g,u,v,s,!!p));}
// 🏟 the RC CLUB FIELD: flight line, pits with tables + canopies, clubhouse, parking
function aptClub(g,L,W){const club='MADISON FAMILY FARM R/C FIELD';
  fApron(g,L+56,82,18);fRunway(g,L,W);fPad(g,5,14,FTEX.asph,0,W/2+6.5,0.045);
  fFlightLine(g,Math.min(L,90),13.5,16.2);
  fSock(g,-L/2+4,-W/2-6);fSock(g,L/2-4,-W/2-6);fHelipad(g,-L/2-14,8);
  if(FLD.pits){
    [[-14,0xd62828],[-4,0x1d3557],[6,0x2a9d8f],[16,0xf4a261]].forEach(([u,c])=>{fCanopy(g,u,22,c);fTable(g,u,22,2.4);});
    for(let k=0;k<4;k++)fBench(g,-18+k*11,26.5);
    fFlag(g,-24,18.5);fHangar(g,26,34,club);fPotty(g,40,30);
    const cols=[0xb00020,0x1d4ed8,0xe5e7eb,0x111827,0x6b7280];for(let k=0;k<5;k++)fCar(g,-30+k*6.5,44,cols[k],Math.PI/2);
    fPad(g,38,9,FTEX.gravel,-17,44,0.03,[9,2]);
    const posts=new THREE.MeshStandardMaterial({color:0x9aa0a6,metalness:0.75,roughness:0.3});
    const board=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.2),new THREE.MeshStandardMaterial({map:signTex('FIELD RULES · STAY BEHIND THE FENCE','#1b4332','#ffffff',768,200),roughness:0.6}));board.position.set(-28,1.6,17.6);board.rotation.y=Math.PI;g.add(board);fBox(g,0.1,1.6,0.1,posts,-29,0.8,17.7);fBox(g,0.1,1.6,0.1,posts,-27,0.8,17.7);
    [[-14,0],[6,2]].forEach(([u,i])=>{const pl=buildDrone(sanitize(Object.values(VPRESETS.plane)[i]),{});pl.g.scale.multiplyScalar(0.55);pl.g.position.set(u,1.0,22);pl.g.rotation.y=Math.PI/2;g.add(pl.g);});
    [[-L/2-20,56,1.1,1],[-L/2-6,62,0.9,0],[L/2+18,58,1.2,1],[L/2+4,64,1,0],[-10,66,1.1,1],[14,68,0.9,0],[-L/2-24,-24,1,1],[L/2+22,-26,1.1,0]].forEach(([u,v,s,p])=>fTree(g,u,v,s,!!p));}}
function fldTick(t){if(!FU.g)return;if(FU.flag){const a=FU.flag.geometry.attributes.position,b=FU.flag0,m=Math.hypot(wind.x,wind.z);for(let i=0;i<a.count;i++){const x=b[i*3];a.array[i*3+2]=Math.sin(x*3-t*(3+m))*0.12*x*(0.4+m*0.12);a.array[i*3+1]=b[i*3+1]-x*Math.max(0,0.25-m*0.04);}a.needsUpdate=true;FU.flag.rotation.y=Math.atan2(-wind.z,wind.x)+FLD.yaw;}
  (FU.socks||[]).forEach(s=>{const m=Math.hypot(wind.x,wind.z);s.rotation.y=Math.atan2(-wind.z,wind.x)+FLD.yaw;s.rotation.z=-clamp(1.25-m*0.16,0,1.25);});}
// where things start at the airport
function fldStart(k){const r=fldR();if(k==='plane'){const p=fldW(-FLD.len/2+9,0);return{x:p.x,z:p.z,yaw:Math.atan2(-r.rx,-r.rz)};}
  if(k==='car'){const p=FLD.style==='old'?fldW(-FLD.len/2+20,0):fldW(0,FLD.w/2+9);return FLD.style==='old'?{x:p.x,z:p.z,yaw:Math.atan2(-r.rx,-r.rz)}:{x:p.x,z:p.z,yaw:Math.atan2(r.px,r.pz)};}
  const p=FLD.style==='old'?fldW(-22,-16):fldW(-FLD.len/2-14,8);return{x:p.x,z:p.z,yaw:Math.atan2(-r.rx,-r.rz)};}
function aptPick(st){const real=aptRealMap();Object.assign(FLD,st==='old'?{style:'old',len:real?110:100,w:12}:{style:'club',len:real?120:110,w:10});FLD.on=true;fldSave();fldBuild();if(started&&D.state!=='flying')resetDrone(kindStart());toast(st==='old'?'🏚 The old airport':'🏟 The RC club field',1500);}
function fldItems(){return[
  mInfo(()=>FLD.style==='old'?'🏚 The old airport: one runway, the red-roof hangar, pilots stand on the south side':'🏟 The RC club field: runway, flight line with 5 pilot stations, pits, clubhouse, parking'),
  mItem(()=>(FLD.style==='old'?'✅ ':'▫️ ')+'🏚 Old airport (runway + red hangar)',()=>aptPick('old')),
  mItem(()=>(FLD.style!=='old'?'✅ ':'▫️ ')+'🏟 RC club field (pits + clubhouse)',()=>aptPick('club')),
  mItem(()=>'🛫 Airport: '+(FLD.on?'ON':'off (just grass)'),()=>{FLD.on=!FLD.on;fldSave();fldBuild();}),
  mItem('📍 Move the airport to where I am',()=>{const src=WALK.on?WALK.pos:D.pos;FLD.x=+src.x.toFixed(1);FLD.z=+src.z.toFixed(1);fldSave();fldBuild();toast('📍 Airport moved here',1500);}),
  mItem(()=>'↻ Runway direction: '+Math.round(((90-FLD.yaw*180/Math.PI)%360+360)%360)+'°  ◀ ▶',()=>{},d=>{FLD.yaw+=d*Math.PI/12;fldSave();fldBuild();}),
  mItem('🌬 Point the runway into the wind',()=>{const m=Math.hypot(wind.x,wind.z);if(m<0.3){toast('No wind right now');return;}FLD.yaw=Math.atan2(-wind.z,-wind.x);fldSave();fldBuild();toast('🌬 Runway turned into the wind',1500);}),
  mRange('📏 Runway length',()=>FLD.len,v=>{FLD.len=v;fldSave();fldBuild();},50,260,10,v=>v+' m'),
  mRange('↔ Runway width',()=>FLD.w,v=>{FLD.w=v;fldSave();fldBuild();},5,30,1,v=>v+' m'),
  mItem(()=>'🛣 Runway: '+(FLD.surf==='paved'?'paved':'mowed grass'),()=>{FLD.surf=FLD.surf==='paved'?'grass':'paved';fldSave();fldBuild();}),
  ...(FLD.style!=='old'?[mItem(()=>'🏠 Pits, clubhouse, cars: '+(FLD.pits?'ON':'off'),()=>{FLD.pits=!FLD.pits;fldSave();fldBuild();})]:[]),
  mItem('↺ Put the airport back where it was',()=>{const st=FLD.style;Object.assign(FLD,FLD_DEF);aptPick(st==='old'?'old':'club');}),
  mInfo('Everyone in multiplayer gets the same airport.'),mItem('◀ Back',()=>menuBack())];}
