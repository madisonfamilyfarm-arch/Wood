// v70: 🚀 rockets push the way the nose points (throttle = how hard) · smoke + fuel trail · 🌌 fly high enough and you reach SPACE
// ---------------------------------------------------------------- smoke trail behind rocket engines (fire when burning, grey smoke while it coasts/falls)
const RKT={last:0,burnT:0,spaceSaid:false,base:null,stars:null};
function rocketParts(){try{return DR&&DR.g?(DR.g.userData.rkParts||(DR.g.userData.rkParts=(()=>{const L=[];DR.g.traverse(o=>{if(o.userData&&o.userData.part&&o.userData.part.t==='rocket')L.push(o);});return L;})())):[];}catch(e){return [];}}
{let last=performance.now();const _p=new THREE.Vector3(),_b=new THREE.Vector3();const tk=()=>{const now=performance.now(),dt=Math.min(0.1,(now-last)/1000);last=now;
  try{if(started&&ST&&ST.combo&&DR&&DR.g&&!WALK.on){const burn=Math.max(CB.u||0,CB.rq||0),R=(ST.info&&ST.info.rFwd>0||ST.info&&ST.info.rUp>0);
    if(R&&D.state==='flying'){if(burn>0.1)RKT.burnT=now;const coast=now-RKT.burnT<12000&&D.vel.y<-2;RKT.last-=dt;
      if((burn>0.1||coast)&&RKT.last<=0){RKT.last=burn>0.1?0.04:0.09;_b.set(0,0,1).applyQuaternion(DR.g.quaternion);
        const L=rocketParts();const src=L.length?L[Math.floor(Math.random()*L.length)]:null;if(src)src.getWorldPosition(_p);else _p.copy(D.pos);_p.addScaledVector(_b,(ST.rad||0.3)*0.6);
        if(burn>0.1){puff(_p,Math.random()<0.5?0xffa020:0xff5010,0.12+burn*0.12,2.2);if(Math.random()<0.6)smokeAt(_p.clone().addScaledVector(_b,0.3),0xbfbfbf);}else smokeAt(_p,0x8a8a8a);}}}}catch(e){}
  // 🌌 space: the sky goes black and the stars come out up high
  try{const a=started&&!WALK.on?D.pos.y:0,k=clamp((a-700)/1300,0,1);
    if(k<=0){if(RKT.base){scene.background.copy(RKT.base.bg);scene.fog.color.copy(RKT.base.fog);scene.fog.far=RKT.base.far;RKT.base=null;if(RKT.stars)RKT.stars.visible=false;}}
    else{if(!RKT.base)RKT.base={bg:scene.background.clone(),fog:scene.fog.color.clone(),far:scene.fog.far};
      const blk=new THREE.Color(0x02030a);scene.background.copy(RKT.base.bg).lerp(blk,k);scene.fog.color.copy(RKT.base.fog).lerp(blk,k);scene.fog.far=RKT.base.far+k*20000;
      if(window.skyM&&skyM.uniforms){try{skyM.uniforms.top.value.lerp(blk,k*0.2);skyM.uniforms.hor.value.lerp(blk,k*0.2);}catch(e){}}
      if(!RKT.stars){const N=1500,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const u=Math.random()*2-1,t=Math.random()*6.283,r=Math.sqrt(1-u*u);pos[i*3]=r*Math.cos(t)*900;pos[i*3+1]=Math.abs(u)*900;pos[i*3+2]=r*Math.sin(t)*900;}
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));RKT.stars=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:2.2,sizeAttenuation:false,transparent:true,depthWrite:false,fog:false}));RKT.stars.frustumCulled=false;scene.add(RKT.stars);}
      RKT.stars.visible=true;RKT.stars.material.opacity=k;RKT.stars.position.copy(cam.position);
      if(k>0.6&&!RKT.spaceSaid){RKT.spaceSaid=true;toast('🌌 You made it to SPACE! '+Math.round(a)+' m up',3500);try{if(typeof chatSys==='function')chatSys('🌌 '+(CFG.name||'You')+' reached space!');}catch(e){}}
      if(k<0.2)RKT.spaceSaid=false;}}catch(e){}
  requestAnimationFrame(tk);};requestAnimationFrame(tk);}
// a new build = find its rocket engines again
{const r0=rebuildDrone;rebuildDrone=function(){const r=r0.apply(this,arguments);try{if(DR&&DR.g)DR.g.userData.rkParts=null;}catch(e){}return r;};}
