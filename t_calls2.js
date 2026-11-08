const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
await P.evaluate(()=>{startGame('free');aiSet(3);});await P.waitForTimeout(4000);
console.log(await P.evaluate(()=>{const fr=new THREE.Frustum();cam.updateMatrixWorld();fr.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse));
 const by={};scene.children.forEach(top=>{let n=0;top.traverse(x=>{if((x.isMesh||x.isSprite||x.isPoints||x.isLine)&&x.visible){let vis=true;let p=x;while(p){if(!p.visible){vis=false;break;}p=p.parent;}if(!vis)return;if(x.frustumCulled&&x.geometry){if(!x.geometry.boundingSphere)x.geometry.computeBoundingSphere();const s=x.geometry.boundingSphere.clone().applyMatrix4(x.matrixWorld);if(!fr.intersectsSphere(s))return;}n++;}});
  if(!n)return;const k=(top.name||top.type)+(top.userData&&top.userData.kind?':'+top.userData.kind:'')+(top.children.length?'['+top.children.length+']':'');by[k]=(by[k]||0)+n;});
 return Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,v])=>v+' '+k).join('\n');}));});
