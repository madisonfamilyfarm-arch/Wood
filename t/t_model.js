const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html'),B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');
  for(const p of [A,B]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}
  await A.waitForTimeout(4000);
  // make an animated .glb in the page (spinning windmill), "import" it, bolt it on top of a drone
  const mid=await A.evaluate(async()=>{await loadScriptOnce('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js');
    const g=new THREE.Group();const post=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,2,8),new THREE.MeshStandardMaterial({color:0xffffff}));post.position.y=1;g.add(post);
    const blades=new THREE.Group();blades.name='blades';blades.position.y=2;for(let k=0;k<3;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.2,1.4,0.05),new THREE.MeshStandardMaterial({color:0xff3030}));b.position.y=0.7;const h=new THREE.Group();h.rotation.z=k*2.09;h.add(b);blades.add(h);}g.add(blades);
    const clip=new THREE.AnimationClip('spin',2,[new THREE.QuaternionKeyframeTrack('blades.quaternion',[0,1,2],[0,0,0,1, 0,0,1,0, 0,0,0,1])]);
    const buf=await new Promise(res=>new THREE.GLTFExporter().parse(g,res,{binary:true,animations:[clip]}));
    const mid=midOf(buf,'windmill');MODELS[mid]={buf,name:'windmill'};parseModel(mid);
    const sp={name:'Windmill drone',parts:presetToParts(__wds.PRESETS.mini).concat([cleanPart({t:'model',mid,sc:1.5,h:12,nm:'windmill'})])};useSpec(sp);return mid;});
  await A.waitForTimeout(4000);
  console.log('A model loaded:',await A.evaluate(mid=>!!(MODELS[mid]&&MODELS[mid].gltf),mid),'mixers',await A.evaluate(()=>MIXERS.length));
  await B.waitForTimeout(6000);
  console.log('B got model:',await B.evaluate(mid=>!!(MODELS[mid]&&MODELS[mid].gltf),mid));
  await A.evaluate(()=>{takeoff();__wds.step({ly:0.6},2);__wds.setCam('CHASE');});
  await B.evaluate(()=>{__wds.setCam('PILOT');});
  await A.waitForTimeout(3000);await A.screenshot({path:'model_a.png'});await B.screenshot({path:'model_b.png'});
});
