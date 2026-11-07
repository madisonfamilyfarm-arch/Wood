// =====================================================================================
// ===== 🎨 REALISTIC LOOK (RealFlight-style): real sky + sun + clouds, photo grass, baked 3D trees, shiny water,
// =====     soft sun shadows, filmic colour, long view. Menu → ⚙️ → 🎨 Graphics switches it off on slow computers.
// =====================================================================================
const LOOK={on:CFG.look!=='fast'&&CFG.map!=='classic',mobile:/iPhone|iPad|iPod|Android/i.test(navigator.userAgent),bg:[],t:0,envT:-1,tex:{}};
function lkCanvas(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);return c;}
function lkRand(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000;};}
if(LOOK.on){
  // ---- longer view (real airfields: you can see the tree line far away)
  Object.assign(QUALS.low,{r:2,fogN:60,fogF:240});Object.assign(QUALS.normal,{r:3,fogN:90,fogF:330});Object.assign(QUALS.high,{r:4,fogN:120,fogF:440});
  Q=QUALS[CFG.quality]||QUALS.normal;if(LOOK.mobile&&CFG.quality!=='high')Q=QUALS.low;
  scene.fog.near=Q.fogN;scene.fog.far=Q.fogF;cam.far=Math.max(cam.far,1200);cam.updateProjectionMatrix();
  // ---- filmic colour + soft sun shadows
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  sun.castShadow=true;const SM=LOOK.mobile?1024:2048;sun.shadow.mapSize.set(SM,SM);const sc=sun.shadow.camera;sc.left=-60;sc.right=60;sc.top=60;sc.bottom=-60;sc.near=1;sc.far=400;sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.03;scene.add(sun.target);
  // ---- everything gets real-looking (physically based) materials
  (function(){const L=THREE.MeshLambertMaterial;THREE.MeshLambertMaterial=function(p){p=Object.assign({},p||{});const m=new THREE.MeshStandardMaterial(Object.assign({roughness:0.8,metalness:0.02},p));m.envMapIntensity=0.7;return m;};THREE.MeshLambertMaterial.prototype=L.prototype;})();
}
// ---------------------------------------------------------------- the sky (Preetham daylight model, like real flight sims) + clouds
const lkSky=(function(){if(!LOOK.on)return null;
  const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false,
    uniforms:{turbidity:{value:2.6},rayleigh:{value:1.2},mieCoefficient:{value:0.005},mieDirectionalG:{value:0.8},sunPosition:{value:new V3(0,1,0)},up:{value:new V3(0,1,0)},expo:{value:0.62},grey:{value:0},greyCol:{value:new THREE.Color(0x8a939c)},haze:{value:new THREE.Color(0xc9d8e6)},space:{value:0}},
    vertexShader:`uniform vec3 sunPosition;uniform float rayleigh;uniform float turbidity;uniform float mieCoefficient;uniform vec3 up;
varying vec3 vWorldPosition;varying vec3 vSunDirection;varying float vSunfade;varying vec3 vBetaR;varying vec3 vBetaM;varying float vSunE;
const float e=2.718281828459045;const vec3 totalRayleigh=vec3(5.804542996261093E-6,1.3562911419845635E-5,3.0265902468824876E-5);
const vec3 MieConst=vec3(1.8399918514433978E14,2.7798023919660528E14,4.0790479543861094E14);const float cutoffAngle=1.6110731556870734;const float steepness=1.5;const float EE=1000.0;
float sunIntensity(float c){c=clamp(c,-1.0,1.0);return EE*max(0.0,1.0-pow(e,-((cutoffAngle-acos(c))/steepness)));}
vec3 totalMie(float T){float c=(0.2*T)*10E-18;return 0.434*c*MieConst;}
void main(){vec4 wp=modelMatrix*vec4(position,1.0);vWorldPosition=wp.xyz-cameraPosition;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position.z=gl_Position.w;
vSunDirection=normalize(sunPosition);vSunE=sunIntensity(dot(vSunDirection,up));vSunfade=1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);
float rc=rayleigh-(1.0*(1.0-vSunfade));vBetaR=totalRayleigh*rc;vBetaM=totalMie(turbidity)*mieCoefficient;}`,
    fragmentShader:`varying vec3 vWorldPosition;varying vec3 vSunDirection;varying float vSunfade;varying vec3 vBetaR;varying vec3 vBetaM;varying float vSunE;
uniform float mieDirectionalG;uniform vec3 up;uniform float expo;uniform float grey;uniform vec3 greyCol;uniform vec3 haze;uniform float space;
const float pi=3.141592653589793;const float rayleighZenithLength=8.4E3;const float mieZenithLength=1.25E3;const float sunAngularDiameterCos=0.99995;
float rayleighPhase(float c){return 0.05968310365946075*(1.0+pow(c,2.0));}
float hgPhase(float c,float g){float g2=pow(g,2.0);float inv=1.0/pow(1.0-2.0*g*c+g2,1.5);return 0.07957747154594767*((1.0-g2)*inv);}
void main(){vec3 direction=normalize(vWorldPosition);float dy=direction.y;direction=normalize(vec3(direction.x,max(direction.y,0.0)+0.002,direction.z));
float zenithAngle=acos(max(0.0,dot(up,direction)));float inverse=1.0/(cos(zenithAngle)+0.15*pow(93.885-((zenithAngle*180.0)/pi),-1.253));
float sR=rayleighZenithLength*inverse;float sM=mieZenithLength*inverse;vec3 Fex=exp(-(vBetaR*sR+vBetaM*sM));
float cosTheta=dot(direction,vSunDirection);float rPhase=rayleighPhase(cosTheta*0.5+0.5);vec3 betaRTheta=vBetaR*rPhase;float mPhase=hgPhase(cosTheta,mieDirectionalG);vec3 betaMTheta=vBetaM*mPhase;
vec3 Lin=pow(vSunE*((betaRTheta+betaMTheta)/(vBetaR+vBetaM))*(1.0-Fex),vec3(1.5));
Lin*=mix(vec3(1.0),pow(vSunE*((betaRTheta+betaMTheta)/(vBetaR+vBetaM))*Fex,vec3(0.5)),clamp(pow(1.0-dot(up,vSunDirection),5.0),0.0,1.0));
vec3 L0=vec3(0.1)*Fex;float sundisk=smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);L0+=(vSunE*19000.0*Fex)*sundisk*(1.0-grey);
vec3 tc=(Lin+L0)*0.04+vec3(0.0,0.0003,0.00075);vec3 c=pow(tc,vec3(1.0/(1.2+(1.2*vSunfade))));
c=vec3(1.0)-exp(-c*expo*2.2); // own exposure (the sky is HDR)
c=mix(c,greyCol,grey);
if(dy<0.0)c=mix(c,haze,clamp(-dy*12.0,0.0,1.0)); // below the horizon: distant haze
c=mix(c,vec3(0.0,0.0,0.01),space);
gl_FragColor=vec4(c,1.0);
#include <encodings_fragment>
}`});
  const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat);m.scale.setScalar(5000);m.frustumCulled=false;m.renderOrder=-20;
  m.onBeforeRender=function(r,s,c){this.position.copy(c.position);this.updateMatrixWorld(true);};scene.add(m);LOOK.bg.push(m);return m;})();
const lkClouds=(function(){if(!LOOK.on)return null;
  const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,transparent:true,fog:false,toneMapped:false,
    uniforms:{t:{value:0},cover:{value:0.35},sunDir:{value:new V3(0,1,0)},sunCol:{value:new THREE.Color(1,0.97,0.9)},shadeCol:{value:new THREE.Color(0.62,0.66,0.72)},bright:{value:1},space:{value:0}},
    vertexShader:'varying vec3 vD;void main(){vD=(modelMatrix*vec4(position,1.0)).xyz-cameraPosition;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position.z=gl_Position.w*0.99999;}',
    fragmentShader:`varying vec3 vD;uniform float t;uniform float cover;uniform vec3 sunDir;uniform vec3 sunCol;uniform vec3 shadeCol;uniform float bright;uniform float space;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<6;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=0.5;}return v;}
void main(){vec3 d=normalize(vD);if(d.y<0.01)discard;vec2 p=d.xz/(d.y+0.08)*1.3+vec2(t*0.004,t*0.0015);
float f=fbm(p);float base=1.0-cover;float a=smoothstep(base,base+0.28,f);if(a<0.01)discard;
float f2=fbm(p+sunDir.xz*0.06);float lit=clamp(0.55+(f-f2)*4.0,0.0,1.0);
vec3 col=mix(shadeCol,sunCol,lit)*bright;col=mix(col,shadeCol*bright*0.9,smoothstep(0.3,0.9,cover)*0.6);
a*=smoothstep(0.01,0.18,d.y)*(1.0-space);gl_FragColor=vec4(col,a*0.96);}`});
  const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI*0.5),mat);m.scale.setScalar(4000);m.frustumCulled=false;m.renderOrder=-19;
  m.onBeforeRender=function(r,s,c){this.position.copy(c.position);this.updateMatrixWorld(true);};scene.add(m);LOOK.bg.push(m);return m;})();
if(LOOK.on){const old=scene.children.find(o=>window.skyM&&o.material===skyM);if(old){old.visible=false;old.userData.lkHidden=true;}}
// image-based light from the sky (reflections on paint, water, glass)
const lkEnv=LOOK.on?{pm:new THREE.PMREMGenerator(renderer),scene:new THREE.Scene(),rt:null}:null;
function lkEnvUpdate(){if(!lkEnv||!lkSky)return;const s=lkEnv.scene;if(!s.children.length){const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),lkSky.material);m.scale.setScalar(100);s.add(m);
    const g=new THREE.Mesh(new THREE.CircleGeometry(60,24),new THREE.MeshBasicMaterial({color:0x3d4a2c}));g.rotation.x=-Math.PI/2;g.position.y=-8;s.add(g);lkEnv.ground=g;}
  lkEnv.ground.material.color.setRGB(0.12,0.16,0.09).multiplyScalar(0.4+0.6*clamp(sun.intensity,0,1));
  const tm=renderer.toneMapping;renderer.toneMapping=THREE.NoToneMapping;const old=lkEnv.rt;lkEnv.rt=lkEnv.pm.fromScene(s,0.02);renderer.toneMapping=tm;scene.environment=lkEnv.rt.texture;if(old)old.dispose();}
// called at the end of applyTOD(): sun position, sky, fog colour, light balance
function lookTOD(h){if(!LOOK.on||!lkSky)return;const ang=(h-6)/12*Math.PI,up=Math.sin(ang);
  const sd=new V3(Math.cos(ang),up,0.35).normalize();lkSky.material.uniforms.sunPosition.value.copy(sd).multiplyScalar(450000);
  lkClouds.material.uniforms.sunDir.value.copy(sd);const day=clamp(up*2.2+0.25,0,1),dusk=clamp(1-Math.abs(up)*4,0,1)*(up>-0.15?1:0);
  lkClouds.material.uniforms.sunCol.value.setRGB(1,0.96-dusk*0.3,0.9-dusk*0.5);lkClouds.material.uniforms.bright.value=0.08+0.92*day;
  lkClouds.material.uniforms.shadeCol.value.setRGB(0.6,0.64,0.7).lerp(new THREE.Color(0.55,0.42,0.45),dusk*0.6);
  // the sun light follows the sky
  sun.color.setRGB(1,0.93-dusk*0.25,0.82-dusk*0.4);sun.intensity=up>0?(0.25+1.55*clamp(up*1.6,0,1)):0.05;hemiL.intensity=0.22+0.5*day;hemiL.color.setRGB(0.78,0.86,1.0).lerp(new THREE.Color(0.45,0.55,0.9),1-day);hemiL.groundColor.setRGB(0.32,0.3,0.22);
  // haze / fog colour = the horizon colour of the sky
  const hz=new THREE.Color().setRGB(0.70,0.80,0.90).multiplyScalar(0.1+0.9*day).lerp(new THREE.Color(0.95,0.62,0.42),dusk*0.55);
  scene.fog.color.copy(hz);scene.background.copy(hz);lkSky.material.uniforms.haze.value.copy(hz);
  LOOK.sunDir=sd;LOOK.envDirty=true;}
// ---------------------------------------------------------------- photo-real ground (grass photo + normal map, dirt keeps its colour)
if(LOOK.on){
  const tl=new THREE.TextureLoader(),an=renderer.capabilities.getMaxAnisotropy();
  const gt=tl.load(TEXD.grass),gn=tl.load(TEXD.grassN),wn=tl.load(TEXD.water);[gt,gn].forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(CH/9,CH/9);t.anisotropy=an;});
  wn.wrapS=wn.wrapT=THREE.RepeatWrapping;wn.repeat.set(3,3);LOOK.tex={grass:gt,grassN:gn,water:wn};
  MAT.ground=new THREE.MeshStandardMaterial({vertexColors:true,map:gt,normalMap:gn,normalScale:new THREE.Vector2(0.7,0.7),roughness:0.97,metalness:0});
  MAT.ground.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>',`
    vec4 t1=texture2D(map,vUv);vec4 t2=texture2D(map,vUv*0.137+vec2(0.31,0.71));vec4 tx=mix(t1,t2,0.42);
    float gr=clamp((vColor.g-vColor.r)*6.0,0.0,1.0);float lum=dot(tx.rgb,vec3(0.3,0.59,0.11));
    vec3 g=tx.rgb*(vColor/vec3(0.27,0.40,0.16));diffuseColor.rgb*=mix(vColor*lum*2.2,g*vec3(0.56,0.72,0.36),gr);`).replace('#include <color_fragment>','');};
  MAT.water=new THREE.MeshStandardMaterial({color:0x1a3640,roughness:0.06,metalness:0.1,normalMap:wn,normalScale:new THREE.Vector2(0.35,0.35),transparent:true,opacity:0.92});MAT.water.envMapIntensity=1.4;
  MAT.rock=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.92,metalness:0});GEO.rock=new THREE.DodecahedronGeometry(1,1);
}
// ---------------------------------------------------------------- 🌳 baked 3D trees: real branch + leaf models are built once, photographed,
// and the photos are used as light-weight "impostor" trees (the same trick RealFlight and flight sims use for forests)
const LKT=(function(){if(!LOOK.on)return null;
  const R=lkRand(4242);let CELL=512;
  const leafC=lkCanvas(128,128,(x)=>{for(let i=0;i<30;i++){const px=18+R()*92,py=18+R()*92,a=R()*6.28,l=13+R()*11;x.save();x.translate(px,py);x.rotate(a);x.fillStyle='hsl('+(88+R()*30)+','+(38+R()*25)+'%,'+(20+R()*18)+'%)';x.beginPath();x.ellipse(0,0,l/2,l/4.3,0,0,7);x.fill();x.strokeStyle='rgba(0,0,0,0.22)';x.lineWidth=1;x.beginPath();x.moveTo(-l/2,0);x.lineTo(l/2,0);x.stroke();x.restore();}});
  const needC=lkCanvas(128,128,(x)=>{x.strokeStyle='#3a2a1a';x.lineWidth=2.5;x.beginPath();x.moveTo(64,126);x.lineTo(64,4);x.stroke();for(let y=6;y<124;y+=1.6)for(const s of[-1,1]){const l=(14+R()*9)*(0.35+0.65*Math.sin((y/128)*Math.PI));x.strokeStyle='hsl('+(98+R()*28)+','+(28+R()*20)+'%,'+(14+R()*14)+'%)';x.lineWidth=1.6;x.beginPath();x.moveTo(64,y);x.lineTo(64+s*l,y-l*0.55);x.stroke();}});
  const leafT=new THREE.CanvasTexture(leafC),needT=new THREE.CanvasTexture(needC);
  const bark=new THREE.MeshLambertMaterial({color:0x4a3826}),barkL=new THREE.MeshLambertMaterial({color:0x6e665c});
  function card(g,mat,w,l,pos,dir,spin,shade){const geo=new THREE.PlaneGeometry(w,l);geo.translate(0,l/2,0);const c=new Float32Array(geo.attributes.position.count*3).fill(shade);geo.setAttribute('color',new THREE.BufferAttribute(c,3));
    const m=new THREE.Mesh(geo,mat);m.position.copy(pos);m.quaternion.setFromUnitVectors(new V3(0,1,0),dir.clone().normalize());m.rotateY(spin);g.add(m);}
  let LIMBS=[];
  function limb(g,mat,a,b,r0,r1){LIMBS.push({a:a.clone(),b:b.clone(),r:(r0+r1)/2});const d=b.clone().sub(a),L=d.length();const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r0,L,7,1,true),mat);m.position.copy(a).addScaledVector(d,0.5);m.quaternion.setFromUnitVectors(new V3(0,1,0),d.normalize());g.add(m);}
  function spruce(seed){const r=lkRand(seed),g=new THREE.Group(),H=14,Rb=3.0,nm=new THREE.MeshLambertMaterial({map:needT,alphaTest:0.4,side:THREE.DoubleSide,vertexColors:true});
    limb(g,bark,new V3(0,0,0),new V3(0,H,0),0.3,0.03);
    for(let y=H*0.1;y<H-0.3;y+=0.34+r()*0.1){const f=(y-H*0.1)/(H*0.9),len=Rb*Math.pow(1-f,0.9)*(0.8+r()*0.35)+0.3,n=7+Math.floor(r()*3);
      for(let k=0;k<n;k++){const a=(k/n)*6.283+r()*0.5,dir=new V3(Math.cos(a),-0.12-0.25*(1-f)-r()*0.15,Math.sin(a)).normalize(),side=new V3(-Math.sin(a),0,Math.cos(a));
        for(let s=0;s<4;s++){const t=(s+0.5)/4,c=new V3(0,y,0).addScaledVector(dir,len*t),cl=len*0.42,cw=0.95+len*0.3*(1-t*0.5);
          const out=Math.min(1,(t*len)/Rb+0.25),shade=(0.5+0.5*out)*(0.82+0.3*r())*(0.8+0.2*f);
          // a flat-ish pad of twigs: lies along the branch, tipped a bit
          const geo=new THREE.PlaneGeometry(cw,cl);geo.translate(0,0,0);const col=new Float32Array(12).fill(shade);geo.setAttribute('color',new THREE.BufferAttribute(col,3));
          const m=new THREE.Mesh(geo,nm);m.position.copy(c);const nrm=new V3().crossVectors(dir,side).normalize();if(nrm.y<0)nrm.negate();
          const tilt=(r()-0.5)*2.2;const n2=nrm.clone().applyAxisAngle(dir,tilt);const basis=new THREE.Matrix4().makeBasis(side.clone().applyAxisAngle(dir,tilt),dir,n2);m.quaternion.setFromRotationMatrix(basis);g.add(m);
          if(r()<0.7){const m2=m.clone();m2.rotateY(Math.PI/2*(r()<0.5?1:-1)*0.8);g.add(m2);}}}}
    for(let k=0;k<6;k++)card(g,nm,0.5,1.1,new V3(0,H-1,0),new V3((r()-0.5)*0.3,1,(r()-0.5)*0.3),k*0.6,1);
    return{g,H:H+0.2,W:Rb*2.15};}
  function broad(seed){const r=lkRand(seed),g=new THREE.Group(),H=13,lm=new THREE.MeshLambertMaterial({map:leafT,alphaTest:0.4,side:THREE.DoubleSide,vertexColors:true});
    const top=new V3(0,H*0.3,0);limb(g,bark,new V3(0,0,0),top,0.42,0.3);const tips=[];
    function br(p,d,len,rad,depth){const q=p.clone().addScaledVector(d,len);limb(g,bark,p,q,rad,rad*0.65);if(depth>=3){tips.push(q);return;}
      const n=depth<1?4:3;for(let k=0;k<n;k++){const a=r()*6.283,nd=d.clone().add(new V3(Math.cos(a),0.35+r()*0.5,Math.sin(a)).multiplyScalar(0.5+r()*0.3)).normalize();br(q,nd,len*(0.68+r()*0.15),rad*0.65,depth+1);}
      tips.push(p.clone().lerp(q,0.5));if(depth>=1)tips.push(p.clone().lerp(q,0.85));}
    for(let k=0;k<5;k++){const a=k/5*6.283+r()*0.6;br(top,new V3(Math.cos(a)*0.45,1,Math.sin(a)*0.45).normalize(),H*0.2,0.25,0);}
    const ctr=new V3(0,H*0.62,0);
    tips.forEach(t=>{for(let k=0;k<7;k++){const d=new V3(r()-0.5,r()-0.3,r()-0.5).normalize(),p=t.clone().addScaledVector(d,r()*0.8);
      const out=Math.min(1,p.distanceTo(ctr)/(H*0.38)),shade=(0.38+0.62*out)*(0.82+0.3*(p.y/H))*(0.85+r()*0.25);card(g,lm,1.5+r()*0.7,1.4+r()*0.6,p,new V3(r()-0.5,r()-0.2,r()-0.5),r()*6,shade);}});
    const bb=new THREE.Box3().setFromObject(g);return{g,H:bb.max.y+0.2,W:Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)};}
  // photograph each tree from the side and from above into one picture (atlas: 4 trees x [side, top])

  const bs=new THREE.Scene(),hl=new THREE.HemisphereLight(0xfff8ec,0x4a5a2a,0.8),dl=new THREE.DirectionalLight(0xfff0d8,1.15);dl.position.set(-0.6,1,0.9);bs.add(hl,dl);
  const info=[];
  // real trees from EZ-Tree (photo bark + photo leaves) when it's there, else the home-made ones
  const useEZ=typeof EZ!=='undefined';
  const trees=useEZ?[['pine_large',3],['pine_large',29],['pine_medium',7],['oak_large',5],['oak_large',21],['oak_medium',2],['oak_medium',13],['ash_large',9],['aspen_medium',4],['aspen_medium',17]].map(([n,sd])=>{const tr=new EZ.Tree();const o=JSON.parse(JSON.stringify(EZ.presets[n]));o.seed=(o.seed||0)+sd*977;tr.options.copy(o);tr.generate();tr.updateMatrixWorld(true);
      const bb=new THREE.Box3().setFromObject(tr);return{g:tr,H:bb.max.y,W:Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)*1.02,limbs:tr.limbs.filter(L=>L.l<=2),ez:tr};})
    :[[spruce,11],[spruce,23],[broad,37],[broad,51]].map(([f,sd])=>{LIMBS=[];const T=f(sd);T.limbs=LIMBS;return T;});
  // + 3D trees from 0 A.D. (willow, birch, oak, poplar) for variety
  let ZPEND=0;
  if(typeof ZADT!=='undefined')ZADT.forEach(z=>{const b64=(str,T)=>{const bin=atob(str),u=new Uint8Array(bin.length);for(let k=0;k<bin.length;k++)u[k]=bin.charCodeAt(k);return new T(u.buffer);};
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(b64(z.pos,Float32Array),3));const nr=b64(z.nor,Int8Array),nf=new Float32Array(nr.length);for(let k=0;k<nr.length;k++)nf[k]=nr[k]/127;
    g.setAttribute('normal',new THREE.BufferAttribute(nf,3));g.setAttribute('uv',new THREE.BufferAttribute(b64(z.uv,Float32Array),2));g.computeBoundingBox();const bb=g.boundingBox,cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2;g.translate(-cx,-bb.min.y,-cz);g.computeBoundingBox();g.computeBoundingSphere();
    ZPEND++;const tx=new THREE.TextureLoader().load(z.tex,()=>{ZPEND--;});tx.anisotropy=8;const m=new THREE.MeshStandardMaterial({map:tx,alphaTest:0.4,side:THREE.DoubleSide,roughness:0.9,metalness:0});m.envMapIntensity=0.35;
    const grp=new THREE.Group();grp.add(new THREE.Mesh(g,m));const B=g.boundingBox;trees.push({g:grp,H:B.max.y,W:Math.max(B.max.x-B.min.x,B.max.z-B.min.z)*1.02,limbs:[],zad:z.name,geo:g,mat:m});});
  trees.forEach(T=>info.push({H:T.H,W:T.W}));
  const NT=trees.length,NP=useEZ?3:2;if(NT>4)CELL=256;
  const atlas=document.createElement('canvas');atlas.width=CELL*NT;atlas.height=CELL*2;const ax=atlas.getContext('2d');
  function bake(){const rt=new THREE.WebGLRenderTarget(CELL,CELL),buf=new Uint8Array(CELL*CELL*4);
  const tm=renderer.toneMapping,se=renderer.shadowMap.enabled,oldC=renderer.getClearColor(new THREE.Color()),oldA=renderer.getClearAlpha(),oldEnv=scene.environment;
  renderer.toneMapping=THREE.NoToneMapping;renderer.setClearColor(0x000000,0);
  trees.forEach((T,i)=>{bs.add(T.g);[0,1].forEach(view=>{const S=view?T.W*1.02:T.H*1.03,c=new THREE.OrthographicCamera(-S/2,S/2,S/2,-S/2,0.1,200);
      c.far=S*12;if(view){c.position.set(0,T.H+S*2,0);c.up.set(0,0,-1);c.lookAt(0,0,0);}else{c.position.set(0,S/2,S*3);c.lookAt(0,S/2,0);}c.updateProjectionMatrix();
      renderer.setRenderTarget(rt);renderer.clear();renderer.render(bs,c);renderer.readRenderTargetPixels(rt,0,0,CELL,CELL,buf);
      const id=ax.createImageData(CELL,CELL);let sr=0,sg=0,sb=0,sn=0;for(let y=0;y<CELL;y++)for(let x=0;x<CELL;x++){const s=((CELL-1-y)*CELL+x)*4,d=(y*CELL+x)*4;id.data[d]=buf[s];id.data[d+1]=buf[s+1];id.data[d+2]=buf[s+2];id.data[d+3]=buf[s+3];if(buf[s+3]>200){sr+=buf[s];sg+=buf[s+1];sb+=buf[s+2];sn++;}}
      sn=sn||1;for(let k=0;k<id.data.length;k+=4)if(id.data[k+3]<40){id.data[k]=sr/sn;id.data[k+1]=sg/sn;id.data[k+2]=sb/sn;} // no dark fringes far away
      ax.putImageData(id,i*CELL,view?0:CELL);});
    bs.remove(T.g);});
  renderer.setRenderTarget(null);renderer.toneMapping=tm;renderer.setClearColor(oldC,oldA);rt.dispose();tex.needsUpdate=true;LOOK.baked=true;
}
  const tex=new THREE.CanvasTexture(atlas);tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  (function wait(n){if((typeof EZ==='undefined'||EZ.pending()<=0)&&ZPEND<=0||n>80){bake();}else setTimeout(()=>wait(n+1),100);})(0);
  // impostor geometry: two crossed upright cards + one flat card for the crown seen from above
  function impGeo(sp){const I=info[sp?NP:0],S=1,topS=(I.W*1.02)/(I.H*1.03),topY=sp?0.72:0.5,pos=[],uv=[],part=[],idx=[];
    const quad=(pts,u,p)=>{const b=pos.length/3;pts.forEach(q=>pos.push(...q));u.forEach(q=>uv.push(...q));for(let k=0;k<4;k++)part.push(p);idx.push(b,b+1,b+2,b,b+2,b+3);};
    for(let k=0;k<2;k++){const a=k*Math.PI/2,c=Math.cos(a)*S/2,s=Math.sin(a)*S/2;quad([[-c,0,-s],[c,0,s],[c,S,s],[-c,S,-s]],[[0,0],[1,0],[1,1],[0,1]],0);}
    const t=topS*S/2;quad([[-t,topY,-t],[-t,topY,t],[t,topY,t],[t,topY,-t]],[[0,1],[0,0],[1,0],[1,1]],1);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('part',new THREE.Float32BufferAttribute(part,1));
    const nrm=[];for(let k=0;k<pos.length/3;k++)nrm.push(0,1,0);g.setAttribute('normal',new THREE.Float32BufferAttribute(nrm,3));g.setIndex(idx);return g;}
  // side cards fade out when you look straight down, the top card fades in (and the other way round from the ground)
  const patch=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float part;attribute float iv;varying float vLkF;').replace('#include <uv_vertex>','#include <uv_vertex>\nvUv=vec2((uv.x+iv)*'+(1/NT).toFixed(6)+',uv.y*0.5+(1.0-part)*0.5);')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 lkw=modelMatrix*instanceMatrix*vec4(position,1.0);float lkk=-normalize(lkw.xyz-cameraPosition).y;vLkF=part>0.5?smoothstep(0.45,0.78,lkk):1.0-smoothstep(0.8,0.97,lkk)*0.85;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vLkF;').replace('#include <alphatest_fragment>','diffuseColor.a*=vLkF;\n#include <alphatest_fragment>').replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\nnormal=normalize(vNormal);');};
  const mat=new THREE.MeshStandardMaterial({map:tex,alphaTest:0.42,side:THREE.DoubleSide,roughness:1,metalness:0,color:0xb4b4b4});mat.envMapIntensity=0.25;mat.onBeforeCompile=patch;
  const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:tex,alphaTest:0.42,side:THREE.DoubleSide});depth.onBeforeCompile=patch;
  // ---- the same trees as real 3D models (used close to you): merged wood + merged foliage, limbs kept for collision
  function merge(meshes){let n=0;const parts=meshes.map(m=>{const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrixWorld);n+=g.attributes.position.count;return g;});
    const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2),col=new Float32Array(n*3);let o=0;
    parts.forEach(g=>{const c=g.attributes.position.count;pos.set(g.attributes.position.array,o*3);nor.set(g.attributes.normal.array,o*3);uv.set(g.attributes.uv.array,o*2);if(g.attributes.color)col.set(g.attributes.color.array,o*3);else col.fill(1,o*3,(o+c)*3);o+=c;g.dispose();});
    const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(pos,3));G.setAttribute('normal',new THREE.BufferAttribute(nor,3));G.setAttribute('uv',new THREE.BufferAttribute(uv,2));G.setAttribute('color',new THREE.BufferAttribute(col,3));G.computeBoundingSphere();return G;}
  const barkC=lkCanvas(128,256,(x,w,h)=>{x.fillStyle='#4d3b2a';x.fillRect(0,0,w,h);for(let i=0;i<70;i++){x.fillStyle='rgba('+(20+R()*30)+','+(14+R()*20)+','+(8+R()*14)+','+(0.3+R()*0.5)+')';x.fillRect(R()*w,0,1+R()*4,h);}for(let i=0;i<40;i++){x.fillStyle='rgba(150,140,120,'+(0.1+R()*0.15)+')';x.fillRect(R()*w,R()*h,2+R()*6,8+R()*30);}});
  const barkT=new THREE.CanvasTexture(barkC);barkT.wrapS=barkT.wrapT=THREE.RepeatWrapping;barkT.repeat.set(2,3);
  const woodM=new THREE.MeshStandardMaterial({map:barkT,roughness:0.95,metalness:0});woodM.envMapIntensity=0.3;
  const swayT={value:0};
  const folM=[needT,leafT].map(tx=>{const m=new THREE.MeshStandardMaterial({map:tx,alphaTest:0.4,side:THREE.DoubleSide,vertexColors:true,roughness:0.9,metalness:0});m.envMapIntensity=0.35;
    m.onBeforeCompile=sh=>{sh.uniforms.lkT=swayT;sh.vertexShader='uniform float lkT;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat sw=sin(lkT*1.7+position.x*0.9+position.z*0.7)*0.05*max(0.0,position.y-2.0);transformed.x+=sw;transformed.z+=sw*0.6;');
      sh.fragmentShader=sh.fragmentShader.replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\nnormal=normalize(vNormal);');};m.customProgramCacheKey=()=>'lkfol';return m;});
  const folD=[needT,leafT].map(tx=>new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:tx,alphaTest:0.4,side:THREE.DoubleSide}));
  const full=trees.map((T,i)=>{if(T.zad)return{wood:(()=>{const e=new THREE.BufferGeometry();e.setAttribute('position',new THREE.BufferAttribute(new Float32Array(9),3));e.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(9),3));e.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(6),2));return e;})(),fol:T.geo,fm:T.mat,fd:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:T.mat.map,alphaTest:0.4,side:THREE.DoubleSide}),H:T.H,limbs:[],zad:T.zad};
    if(T.ez){const fm=T.ez.leavesMesh.material;return{wood:T.ez.branchesMesh.geometry,fol:T.ez.leavesMesh.geometry,wm:T.ez.branchesMesh.material,fm,fd:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:fm.map,alphaTest:0.5,side:THREE.DoubleSide}),H:T.H,limbs:T.limbs};}
    T.g.updateMatrixWorld(true);const wood=[],fol=[];T.g.traverse(o=>{if(o.isMesh)(o.material.map?fol:wood).push(o);});
    const fg=merge(fol),wg=merge(wood);
    // foliage normals point out of the crown (soft, round lighting like real leaves)
    const ctr=new V3(0,T.H*(i<2?0.45:0.62),0),P=fg.attributes.position,N=fg.attributes.normal,t=new V3();for(let k=0;k<P.count;k++){t.set(P.getX(k),P.getY(k),P.getZ(k)).sub(ctr);t.y=t.y*0.6+Math.abs(t.length())*0.4;t.normalize();N.setXYZ(k,t.x,t.y,t.z);}
    return{wood:wg,fol:fg,fm:folM[i<2?0:1],fd:folD[i<2?0:1],H:T.H,limbs:T.limbs.filter(L=>L.r>0.035)};});
  return{tex,mat,depth,geo:[impGeo(0),impGeo(1)],info,full,woodM,swayT,NT,NP,willow:trees.findIndex(T=>T.zad==='willow_a_1')};})();
function lkVariant(t){const np=LKT.NP,nl=LKT.NT-np;if(!t.pine&&LKT.willow>=0){const p=pondOf(t.x,t.z);if(p&&Math.hypot(t.x-p.x,t.z-p.z)<p.r+16)return LKT.willow;}return t.pine?Math.min(np-1,Math.floor(t.shade*np)):np+Math.min(nl-1,Math.floor(((t.shade*7.31)%1)*nl));}
const LK_LEAF=[[1,1,1],[0.88,1.04,0.84],[1.1,1.08,0.8],[0.82,0.95,0.92],[0.8,0.9,0.76],[1.05,1.12,0.92],[0.95,1,0.85],[1.35,1.05,0.65],[1.5,0.95,0.6]];
function lkLeafCol(t,c){const r=(((t.shade*13.7+t.x*0.013)%1)+1)%1,k=t.pine?Math.floor(r*5):Math.floor(r*LK_LEAF.length);const q=LK_LEAF[k],v=0.9+((t.shade*3.3)%1)*0.2;return c.setRGB(q[0]*v,q[1]*v,q[2]*v);}
// one instanced mesh per tree kind per chunk (pines: atlas 0-1, leafy: 2-3)
function lkTrees(list,objs){if(!LKT)return false;
  [true,false].forEach(pine=>{const L=list.filter(t=>t.pine===pine);if(!L.length)return;const geo=LKT.geo[pine?0:1].clone();
    const iv=new THREE.InstancedBufferAttribute(new Float32Array(L.length),1);geo.setAttribute('iv',iv);
    const im=new THREE.InstancedMesh(geo,LKT.mat,L.length);im.customDepthMaterial=LKT.depth;im.castShadow=true;im.receiveShadow=false;im.userData.lk=1;
    const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new V3(),p=new V3(),c=new THREE.Color();
    L.forEach((t,k)=>{const S=t.h*(pine?1.12:1.05);m.compose(p.set(t.x,t.y-0.15,t.z),q.setFromAxisAngle(UP,t.shade*6.283),s.set(S,S,S));im.setMatrixAt(k,m);t.im=im;t.k=k;t.S=S;t.iv=lkVariant(t);iv.setX(k,t.iv);lkLeafCol(t,c);t.col=c.clone();im.setColorAt(k,c);});
    scene.add(im);objs.push(im);});return true;}
// single tree for decorations (airfield edge)
function lkTree(g,x,z,h,pine){if(!LKT)return false;const geo=LKT.geo[pine?0:1].clone();geo.setAttribute('iv',new THREE.InstancedBufferAttribute(new Float32Array([pine?0:LKT.NP]),1));
  const im=new THREE.InstancedMesh(geo,LKT.mat,1);im.customDepthMaterial=LKT.depth;im.castShadow=true;const S=h*(pine?1.12:1.05);im.setMatrixAt(0,new THREE.Matrix4().compose(new V3(x,-0.15,z),new THREE.Quaternion(),new V3(S,S,S)));im.setColorAt(0,new THREE.Color().setHSL(0.3,0.25,0.56));g.add(im);return true;}
// ---------------------------------------------------------------- far forest all the way to the horizon
const lkFar=(function(){if(!LOOK.on)return null;
  const c=lkCanvas(512,512,(x,w,h)=>{x.fillStyle='#1f2f17';x.fillRect(0,0,w,h);const r=lkRand(77);for(let i=0;i<900;i++){const px=r()*w,py=r()*h,rr=6+r()*14;const g=x.createRadialGradient(px-rr*0.3,py-rr*0.3,1,px,py,rr);const l=16+r()*14;g.addColorStop(0,'hsl('+(90+r()*30)+',35%,'+(l+10)+'%)');g.addColorStop(1,'hsla(100,40%,'+(l-8)+'%,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,rr,0,7);x.fill();}});
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(160,160);t.anisotropy=8;
  const inner=Q.r*CH,m=new THREE.Mesh(new THREE.RingGeometry(inner,6000,64,1),new THREE.MeshStandardMaterial({map:t,roughness:1,metalness:0}));m.rotation.x=-Math.PI/2;m.userData.noCast=true;m.receiveShadow=false;
  // world-locked texture while the ring follows you
  m.material.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvUv=(modelMatrix*vec4(position,1.0)).xz/38.0;');};
  scene.add(m);LOOK.bg.push(m);return m;})();
// ---------------------------------------------------------------- every frame: shadows follow you, water moves, clouds drift, sky follows weather
const _lkc=new V3();
function lookTick(dt){if(!LOOK.on)return;LOOK.t+=dt;
  const cesOn=typeof CES!=='undefined'&&CES.on;
  if(!cesOn){const agl=cam.position.y-H(cam.position.x,cam.position.z);scene.fog.far=Math.max(scene.fog.far,Q.fogF+clamp(agl,0,500)*3.5);}
  if(lkFar){lkFar.visible=!cesOn;const fc=D.pos;lkFar.position.set(Math.round(fc.x/38)*38,-1.4,Math.round(fc.z/38)*38);}
  // sun shadow box around what you're looking at (the aircraft if it's close, else in front of the camera)
  if(LOOK.sunDir){const tgt=DR&&D.pos.distanceTo(cam.position)<90?D.pos:_lkc.set(0,0,-45).applyQuaternion(cam.quaternion).add(cam.position);
    const snap=1;sun.target.position.set(Math.round(tgt.x/snap)*snap,Math.round(tgt.y/snap)*snap,Math.round(tgt.z/snap)*snap);sun.position.copy(sun.target.position).addScaledVector(LOOK.sunDir,200);sun.target.updateMatrixWorld();}
  if(LOOK.tex.water)LOOK.tex.water.offset.set(LOOK.t*0.012,LOOK.t*0.007);
  // weather → clouds + overcast sky
  if(lkClouds&&typeof WX!=='undefined'&&WX.W){const W=WX.W,mode=W.mode==='real'?(W.liveMode||'clear'):W.mode,amt=W.mode==='real'?(W.liveAmt||0.5):(W.amount==null?0.5:W.amount);
    const cov={clear:0.32,windy:0.38,cloudy:0.62+0.25*amt,rain:0.85,storm:0.95,snow:0.8,fog:0.7}[mode]||0.32,grey={clear:0,windy:0,cloudy:0.25+0.35*amt,rain:0.7,storm:0.85,snow:0.6,fog:0.7}[mode]||0;
    const u=lkClouds.material.uniforms;u.cover.value+=(cov-u.cover.value)*Math.min(1,dt*0.5);u.t.value+=dt*(1+Math.hypot(wind.x,wind.z)*0.3);lkSky.material.uniforms.grey.value+=(grey-lkSky.material.uniforms.grey.value)*Math.min(1,dt*0.5);
    const day=clamp(sun.intensity/1.5,0,1);lkSky.material.uniforms.greyCol.value.setRGB(0.55,0.6,0.66).multiplyScalar(0.12+0.88*day);}
  // going to space: fade the sky to black
  const sp=clamp((cam.position.y-1500)/6000,0,1);if(lkSky){lkSky.material.uniforms.space.value=sp;lkClouds.material.uniforms.space.value=sp;}
  // the fake round shadow isn't needed with real shadows
  if(typeof shadow!=='undefined'&&!cesOn)shadow.visible=false;
  // new things cast + catch shadows (aircraft, buildings, props, other players)
  if((LOOK.sweep=(LOOK.sweep||0)-dt)<=0){LOOK.sweep=0.5;lkSweep();}
  if(LOOK.envDirty&&LOOK.t-LOOK.envT>2){LOOK.envDirty=false;LOOK.envT=LOOK.t;lkEnvUpdate();}
  lookTick2();if(!cesOn&&typeof chunks!=='undefined')lkNearTick(dt);}
function lkSweep(){for(const o of scene.children){if(o.userData.lkSw||LOOK.bg.includes(o)||o.isLight||o.isSprite||o.isPoints)continue;o.userData.lkSw=1;
  o.traverse(m=>{if(!m.isMesh||m.userData.lk)return;const mt=Array.isArray(m.material)?m.material[0]:m.material;if(!mt)return;
    if(mt.isMeshBasicMaterial&&mt.transparent||mt.isShaderMaterial||mt.depthWrite===false)return;
    const ground=m.material===MAT.ground||m.userData.noCast;m.receiveShadow=true;m.castShadow=!ground&&!(mt.transparent&&mt.opacity<0.6);});}}
// things added later (a new aircraft, a peer's mesh) have to be re-checked: forget the flag when they change
function lkResweep(o){if(o)o.userData.lkSw=0;}
// ---------------------------------------------------------------- sun glare in the lens (hidden behind trees and buildings) + shadows on the real-world map
const lkFlare=(function(){if(!LOOK.on||!THREE.Lensflare||LOOK.mobile)return null;
  const glow=(r,a,col)=>new THREE.CanvasTexture(lkCanvas(256,256,(x,w,h)=>{const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba('+col+','+a+')');g.addColorStop(r,'rgba('+col+','+(a*0.35)+')');g.addColorStop(1,'rgba('+col+',0)');x.fillStyle=g;x.fillRect(0,0,w,h);}));
  const ring=new THREE.CanvasTexture(lkCanvas(128,128,(x)=>{const g=x.createRadialGradient(64,64,30,64,64,62);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(0.7,'rgba(180,220,255,0.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);}));
  const f=new THREE.Lensflare(),main=glow(0.15,1,'255,250,235'),soft=glow(0.4,0.5,'255,230,190');
  f.addElement(new THREE.LensflareElement(main,420,0,new THREE.Color(1,1,1)));f.addElement(new THREE.LensflareElement(soft,900,0,new THREE.Color(1,0.95,0.85)));
  [[60,0.6,[0.6,0.8,1]],[90,0.75,[1,0.85,0.6]],[140,0.9,[0.7,1,0.8]],[70,1.0,[1,0.7,0.6]]].forEach(([s,d,c])=>f.addElement(new THREE.LensflareElement(ring,s,d,new THREE.Color(...c))));
  const o=new THREE.Object3D();o.add(f);scene.add(o);LOOK.bg.push(o);return o;})();
const lkCatch=(function(){if(!LOOK.on)return null;const m=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.ShadowMaterial({opacity:0.38}));m.rotation.x=-Math.PI/2;m.receiveShadow=true;m.visible=false;m.userData.lk=1;scene.add(m);return m;})();
function lookTick2(){if(!LOOK.on)return;const cesOn=typeof CES!=='undefined'&&CES.on;
  if(lkFlare){const up=LOOK.sunDir&&LOOK.sunDir.y>0.02;lkFlare.visible=!!up&&!cesOn&&lkSky.material.uniforms.grey.value<0.5&&cam.position.y<1500;if(up)lkFlare.position.copy(cam.position).addScaledVector(LOOK.sunDir,2000);}
  if(lkCatch){lkCatch.visible=cesOn&&!!DR;if(lkCatch.visible){lkCatch.position.set(D.pos.x,H(D.pos.x,D.pos.z)+0.06,D.pos.z);if(typeof shadow!=='undefined')shadow.visible=false;}}}

// ---------------------------------------------------------------- 🌳 real 3D trees close to you: limbs in every direction, fly between them
// (the light "photo" trees stay farther away; each limb is solid, the leaves you can brush through)
const LKN={near:new Map(),pool:null,t:0,R:LOOK.mobile?30:50,max:LOOK.mobile?3:9};
function lkNearInit(){if(LKN.pool||!LKT||!LKT.full)return;LKN.pool=LKT.full.map(F=>{
    const w=new THREE.InstancedMesh(F.wood,F.wm||LKT.woodM,LKN.max),f=new THREE.InstancedMesh(F.fol,F.fm,LKN.max);f.customDepthMaterial=F.fd;
    for(let k=0;k<LKN.max;k++)f.setColorAt(k,_white);
    [w,f].forEach(o=>{o.count=0;o.castShadow=true;o.receiveShadow=true;o.userData.lk=1;o.frustumCulled=false;scene.add(o);});return{w,f,F,used:[]};});}
const _white=new THREE.Color(1,1,1),_nm=new THREE.Matrix4(),_nq=new THREE.Quaternion(),_ns=new V3(),_np=new V3(),_zero=new THREE.Matrix4().makeScale(0,0,0),_la=new V3(),_lb=new V3();
function lkNearTick(dt){if(!LKT||!LKT.full)return;LKT.swayT.value+=dt;LKT.full.forEach(F=>{const sh=F.fm&&F.fm.userData&&F.fm.userData.shader;if(sh&&sh.uniforms.uTime)sh.uniforms.uTime.value=LKT.swayT.value;});if((LKN.t-=dt)>0)return;LKN.t=0.25;lkNearInit();
  const c=D.pos,want=[];
  for(const ch of chunks.values()){const cx=(ch.i+0.5)*CH,cz=(ch.j+0.5)*CH;if(Math.abs(cx-c.x)>LKN.R+CH||Math.abs(cz-c.z)>LKN.R+CH)continue;
    for(const t of ch.trees){if(t.im===undefined)continue;const d=Math.hypot(t.x-c.x,t.z-c.z);if(d<LKN.R)want.push([d,t,ch]);}}
  want.sort((a,b)=>a[0]-b[0]);const per=new Array(LKT.NT).fill(0),keep=new Set();
  for(const [d,t] of want){if(per[t.iv]>=LKN.max)continue;per[t.iv]++;keep.add(t);}
  // trees that left (or whose chunk was thrown away) go back to flat
  for(const [t,e] of LKN.near){if(keep.has(t)&&chunks.get(e.ch.i+','+e.ch.j)===e.ch)continue;lkFar3(t,e);LKN.near.delete(t);}
  for(const t of keep)if(!LKN.near.has(t)){const ch=want.find(w=>w[1]===t)[2];LKN.near.set(t,lkNear3(t,ch));}
  // write the instance lists
  LKN.pool.forEach(p=>{p.w.count=p.f.count=0;});
  for(const [t] of LKN.near){const p=LKN.pool[t.iv],k=p.w.count,sc=(t.S/1.03)/p.F.H;_nm.compose(_np.set(t.x,t.y-0.15,t.z),_nq.setFromAxisAngle(UP,t.shade*6.283),_ns.set(sc,sc,sc));p.w.setMatrixAt(k,_nm);p.f.setMatrixAt(k,_nm);p.f.setColorAt(k,t.col||_white);p.w.count=p.f.count=k+1;}
  LKN.pool.forEach(p=>{p.w.instanceMatrix.needsUpdate=true;p.f.instanceMatrix.needsUpdate=true;if(p.f.instanceColor)p.f.instanceColor.needsUpdate=true;});}
function lkNear3(t,ch){const e={ch,cols:[]};const p=LKN.pool[t.iv];if(t.im){t.im.setMatrixAt(t.k,_zero);t.im.instanceMatrix.needsUpdate=true;}
  // leafy trees: real limbs instead of one solid ball of leaves
  if(!t.pine&&t.cc&&p.F.limbs.length){e.sw=true;gridRemove(t.cc);const sc=(t.S/1.03)/p.F.H,q=_nq.setFromAxisAngle(UP,t.shade*6.283),o=_np.set(t.x,t.y-0.15,t.z);
    for(const L of p.F.limbs){const r=L.r*sc;if(r<0.06)continue;_la.copy(L.a).multiplyScalar(sc).applyQuaternion(q).add(o);_lb.copy(L.b).multiplyScalar(sc).applyQuaternion(q).add(o);e.cols.push(addHCyl(_la,_lb,r));}}
  return e;}
function lkFar3(t,e){if(t.im&&t.im.instanceMatrix){_nm.compose(_np.set(t.x,t.y-0.15,t.z),_nq.setFromAxisAngle(UP,t.shade*6.283),_ns.set(t.S,t.S,t.S));t.im.setMatrixAt(t.k,_nm);t.im.instanceMatrix.needsUpdate=true;}
  e.cols.forEach(gridRemove);if(e.sw&&chunks.get(e.ch.i+','+e.ch.j)===e.ch)gridAdd(t.cc,t.cc.x,t.cc.z,t.cc.r);}
