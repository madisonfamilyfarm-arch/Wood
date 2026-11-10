// v80: 🌍 more world — two new long runways (with edge lights, centre lines, windsocks) and an UNDERGROUND TUNNEL you drive/fly
//      down into: a ramp digs down into the ground, a long covered underground stretch with lights, then a ramp back up.
const RW2=[{n:'the north runway',x:-330,z:-350,len:360,w:40,ax:'x'},{n:'the valley runway',x:450,z:-200,len:300,w:30,ax:'z'}];
const TUN={n:'the underground tunnel',x:-300,z0:300,z1:540,w:14,D:10,ramp:50,cov0:80,cov1:160};
const _H=H;   // the original ground
function rwLocal(r,x,z){const dx=x-r.x,dz=z-r.z;return r.ax==='x'?{u:dx,v:dz}:{u:dz,v:dx};}
function rwFlat(r){if(r.fh==null){let s=0,n=0;for(let i=-4;i<=4;i++){const u=i*r.len/8;const x=r.ax==='x'?r.x+u:r.x,z=r.ax==='x'?r.z:r.z+u;s+=_H(x,z);n++;}r.fh=Math.max(0.3,s/n);}return r.fh;}
function tunDepth(z){const t=z-TUN.z0,L=TUN.z1-TUN.z0;if(t<0||t>L)return 0;return TUN.D*Math.min(1,smooth(0,TUN.ramp,t)*1,smooth(0,TUN.ramp,L-t));}
function tunSurf(z){return _H(TUN.x,z);}
H=function(x,z){let h=_H(x,z);
  for(const r of RW2){const p=rwLocal(r,x,z);const d=Math.max(Math.abs(p.u)-r.len/2,Math.abs(p.v)-r.w/2);if(d<28){h=lerp(rwFlat(r),h,smooth(0,28,d));}}
  const dx=Math.abs(x-TUN.x);if(dx<TUN.w/2+3&&z>TUN.z0-2&&z<TUN.z1+2){const dep=tunDepth(z);if(dep>0){const k=1-smooth(TUN.w/2-0.5,TUN.w/2+2.5,dx);h=lerp(h,tunSurf(z)-dep,k);}}
  return h;};
{const b0=blocked;blocked=function(x,z){for(const r of RW2){const p=rwLocal(r,x,z);if(Math.abs(p.u)<r.len/2+40&&Math.abs(p.v)<r.w/2+40)return true;}if(Math.abs(x-TUN.x)<TUN.w/2+14&&z>TUN.z0-20&&z<TUN.z1+20)return true;return b0(x,z);};}
// ---- runways: dark strip, white centre line + numbers, blue edge lights, windsock, sign
(function(){const asph=new THREE.MeshLambertMaterial({color:0x2a2b2e}),white=new THREE.MeshBasicMaterial({color:0xffffff}),blue=new THREE.MeshBasicMaterial({color:0x3b8cff}),red=new THREE.MeshBasicMaterial({color:0xff3b30}),orange=new THREE.MeshLambertMaterial({color:0xff7a00});
  RW2.forEach(r=>{const y=rwFlat(r)+0.06;const G=new THREE.Group();G.position.set(r.x,0,r.z);if(r.ax==='z')G.rotation.y=Math.PI/2;scene.add(G);
    const strip=new THREE.Mesh(new THREE.BoxGeometry(r.len,0.2,r.w),asph);strip.position.y=y;G.add(strip);
    const dashes=Math.floor(r.len/12);const dm=new THREE.InstancedMesh(new THREE.BoxGeometry(6,0.05,0.7),white,dashes);const o=new THREE.Object3D();for(let i=0;i<dashes;i++){o.position.set(-r.len/2+6+i*12,y+0.11,0);o.updateMatrix();dm.setMatrixAt(i,o.matrix);}G.add(dm);
    for(const s of [-1,1]){const th=new THREE.InstancedMesh(new THREE.BoxGeometry(10,0.05,1.2),white,6);for(let i=0;i<6;i++){o.position.set(s*(r.len/2-8),y+0.11,(i-2.5)*(r.w/7));o.updateMatrix();th.setMatrixAt(i,o.matrix);}G.add(th);}
    const nL=Math.floor(r.len/20)+1;const lm=new THREE.InstancedMesh(new THREE.BoxGeometry(0.5,0.5,0.5),blue,nL*2);let k=0;for(let i=0;i<nL;i++)for(const s of [-1,1]){o.position.set(-r.len/2+i*20,y+0.3,s*(r.w/2+1));o.updateMatrix();lm.setMatrixAt(k++,o.matrix);}G.add(lm);
    const em=new THREE.InstancedMesh(new THREE.BoxGeometry(0.5,0.5,0.5),red,10);k=0;for(const s of [-1,1])for(let i=0;i<5;i++){o.position.set(s*(r.len/2+1),y+0.3,(i-2)*(r.w/5));o.updateMatrix();em.setMatrixAt(k++,o.matrix);}G.add(em);
    // windsock + sign
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,7,8),new THREE.MeshLambertMaterial({color:0xdddddd}));pole.position.set(r.len/2-20,y+3.5,r.w/2+12);G.add(pole);
    const sock=new THREE.Mesh(new THREE.ConeGeometry(0.7,3.2,12,1,true),orange);sock.rotation.z=Math.PI/2;sock.position.set(r.len/2-21.6,y+6.6,r.w/2+12);G.add(sock);
    try{const wp=new THREE.Vector3(0,y+6,r.w/2+8);G.updateMatrixWorld(true);wp.applyMatrix4(G.matrixWorld);label('🛬 '+r.n.replace('the ','').replace(/^./,c=>c.toUpperCase()),wp.x,wp.y,wp.z,14);}catch(e){}});})();
// ---- the tunnel: concrete floor + walls following the dug ground, roof over the middle, lamps
(function(){const conc=new THREE.MeshLambertMaterial({color:0x8e8e93}),floorM=new THREE.MeshLambertMaterial({color:0x4a4a4c}),roofM=new THREE.MeshLambertMaterial({color:0x5e7d3a}),lampM=new THREE.MeshBasicMaterial({color:0xffe9a8}),stripe=new THREE.MeshBasicMaterial({color:0xffd60a});
  const step=4,N=Math.ceil((TUN.z1-TUN.z0)/step),o=new THREE.Object3D();const fl=new THREE.InstancedMesh(new THREE.BoxGeometry(TUN.w,0.3,step+0.2),floorM,N),wl=new THREE.InstancedMesh(new THREE.BoxGeometry(0.8,1,step+0.2),conc,N*2),st=new THREE.InstancedMesh(new THREE.BoxGeometry(0.3,0.05,2),stripe,N);
  let k=0,lamps=[];for(let i=0;i<N;i++){const z=TUN.z0+step*(i+0.5),dep=tunDepth(z),s=tunSurf(z),fy=s-dep;
    o.position.set(TUN.x,fy-0.05,z);o.scale.set(1,1,1);o.rotation.set(0,0,0);o.updateMatrix();fl.setMatrixAt(i,o.matrix);o.position.y=fy+0.12;o.updateMatrix();st.setMatrixAt(i,o.matrix);
    const hgt=Math.max(0.6,dep+0.6);for(const sd of [-1,1]){o.position.set(TUN.x+sd*(TUN.w/2+0.4),fy+hgt/2-0.1,z);o.scale.set(1,hgt,1);o.updateMatrix();wl.setMatrixAt(k++,o.matrix);}
    if(i%3===0&&dep>2)lamps.push([z,fy+Math.min(dep-0.6,5)]);}
  [fl,wl,st].forEach(m=>{m.frustumCulled=false;scene.add(m);});
  const lm=new THREE.InstancedMesh(new THREE.BoxGeometry(0.3,0.5,1.2),lampM,lamps.length*2);k=0;lamps.forEach(([z,y])=>{for(const sd of [-1,1]){o.position.set(TUN.x+sd*(TUN.w/2-0.1),y,z);o.scale.set(1,1,1);o.updateMatrix();lm.setMatrixAt(k++,o.matrix);}});lm.frustumCulled=false;scene.add(lm);
  // roof: grass-topped concrete slabs over the covered part, at ground level
  const rN=Math.ceil((TUN.cov1-TUN.cov0)/step);const rf=new THREE.InstancedMesh(new THREE.BoxGeometry(TUN.w+2.4,0.8,step+0.05),roofM,rN);for(let i=0;i<rN;i++){const z=TUN.z0+TUN.cov0+step*(i+0.5);o.position.set(TUN.x,tunSurf(z)+0.1,z);o.updateMatrix();rf.setMatrixAt(i,o.matrix);}rf.frustumCulled=false;scene.add(rf);
  // portal frames where the roof starts/ends + signs
  for(const zz of [TUN.z0+TUN.cov0,TUN.z0+TUN.cov1]){const s=tunSurf(zz),fy=s-tunDepth(zz);const fr=new THREE.Mesh(new THREE.BoxGeometry(TUN.w+2,1.2,1),new THREE.MeshLambertMaterial({color:0xffd60a}));fr.position.set(TUN.x,s-0.3,zz);scene.add(fr);}
  try{for(const zz of [TUN.z0-6,TUN.z1+6])label('⛏ Underground tunnel',TUN.x+TUN.w/2+5,tunSurf(zz)+4,zz,12);}catch(e){}})();
// ---- the roof is solid: under the covered part you can't pop up through it
{let last=performance.now();const tk=()=>{try{if(started&&D&&D.pos){const p=D.pos;const z=p.z-TUN.z0;if(Math.abs(p.x-TUN.x)<TUN.w/2+0.5&&z>TUN.cov0&&z<TUN.cov1){const roof=tunSurf(p.z)-0.35-(ST&&ST.rad?Math.min(ST.rad,1):0.3);if(p.y>roof&&p.y<roof+2.5){p.y=roof;if(D.vel&&D.vel.y>0)D.vel.y=0;}}}}catch(e){}requestAnimationFrame(tk);};requestAnimationFrame(tk);}
// ---- the AI knows these places ("go to the north runway", "take me to the tunnel")
{const a0=aiPlaces;aiPlaces=function(){const L=a0.apply(this,arguments).slice();RW2.forEach(r=>L.push({n:r.n,x:r.x,z:r.z}));L.push({n:TUN.n,x:TUN.x,z:TUN.z0-10});L.push({n:'the tunnel',x:TUN.x,z:TUN.z0-10});return L;};}
