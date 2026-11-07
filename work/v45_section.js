// ================================================================ v45: ⚡ NO MORE FREEZES — explosions used to add + remove a light, which made the phone rebuild every shader (the "ding" stutter). Now 3 lights are always there and just switch on/off.
const BOOMLT=[];for(let i=0;i<3;i++){const l=new THREE.PointLight(0xffaa55,0,30);l.position.set(0,-500,0);l.userData.until=0;scene.add(l);BOOMLT.push(l);}
function boomLight(p,r){const l=BOOMLT.reduce((a,b)=>a.userData.until<b.userData.until?a:b);l.position.copy(p);l.distance=Math.min(400,r*6);l.intensity=3;l.userData.until=performance.now()+700;return l;}
// build the explosion / TNT / smoke shaders once at the start, so even the FIRST boom doesn't hitch
function fxPrewarm(){try{const g=new THREE.Group();const add=m=>{const x=new THREE.Mesh(GEO.ball,m);g.add(x);};
  add(new THREE.MeshBasicMaterial({color:0xff8a30,transparent:true,opacity:0.9,depthWrite:false}));add(new THREE.MeshBasicMaterial({color:0xff8a30,transparent:true,opacity:0.9,depthWrite:false,side:THREE.DoubleSide}));
  add(new THREE.MeshLambertMaterial({color:0x444444}));add(new THREE.MeshLambertMaterial({color:0x444444,transparent:true,opacity:0.5}));add(BIGMAT(0x333333));try{g.add(tntMesh());}catch(e){}
  g.position.copy(cam.position).add(new V3(0,0,-3).applyQuaternion(cam.quaternion));g.scale.setScalar(0.01);scene.add(g);renderer.compile(scene,cam);scene.remove(g);}catch(e){console.warn('prewarm',e);}}
{const s0=startGame;startGame=function(){const r=s0.apply(this,arguments);setTimeout(fxPrewarm,1200);return r;};}
