const H0=require('./harness');const fs=require('fs');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
await P.addScriptTag({path:__dirname+'/node_modules/three/examples/js/exporters/GLTFExporter.js'});const b64=await P.evaluate(async()=>{const G=new THREE.Group();G.name='Squidrocket';
 const M=(c,e)=>new THREE.MeshStandardMaterial({color:c,emissive:e||0x000000,metalness:0.3,roughness:0.5});
 // body: a striped dome + belly
 const body=new THREE.Mesh(new THREE.SphereGeometry(0.5,32,24),M(0x8e44ad));body.scale.set(1,1.25,1);body.position.y=0.55;G.add(body);
 for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(0.48-Math.abs(i-2)*0.08,0.03,10,40),M([0xff2d55,0xffd60a,0x30d158,0x0a84ff,0xff9f0a][i],[0x550010,0x554400,0x005510,0x002255,0x552200][i]));r.rotation.x=Math.PI/2;r.position.y=0.25+i*0.16;G.add(r);}
 // googly eyes
 for(const s of [-1,1]){const w=new THREE.Mesh(new THREE.SphereGeometry(0.16,20,16),M(0xffffff));w.position.set(s*0.2,0.85,-0.38);G.add(w);const p=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),M(0x111111));p.position.set(s*0.2+s*0.03,0.83,-0.52);G.add(p);}
 // propeller hat
 const hat=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.2,0.18,20),M(0xff2d55));hat.position.y=1.22;G.add(hat);
 for(let i=0;i<3;i++){const bl=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.02,0.1),M([0xffd60a,0x30d158,0x0a84ff][i]));bl.position.y=1.33;bl.rotation.y=i*Math.PI*2/3;G.add(bl);}
 // wiggly tentacles with rocket nozzles at the tips
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const pts=[];for(let k=0;k<=12;k++){const t=k/12;pts.push(new THREE.Vector3(Math.cos(a)*(0.3+t*0.45)+Math.sin(t*8+i)*0.08,0.15-t*0.9,Math.sin(a)*(0.3+t*0.45)+Math.cos(t*8+i)*0.08));}
  const tube=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,0.055*(1),10,false),M(0xbf5af2));G.add(tube);
  const nz=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.16,14,1,true),M(0x8e8e93));const end=pts[pts.length-1];nz.position.copy(end);G.add(nz);
  const fl=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.22,12),M(0xff9f0a,0xff5000));fl.position.copy(end).add(new THREE.Vector3(0,-0.16,0));fl.rotation.x=Math.PI;G.add(fl);}
 // side fins + a tiny cannon
 for(const s of [-1,1]){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(0.45,0.15);sh.lineTo(0.35,-0.2);sh.lineTo(0,0);const f=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.03,bevelEnabled:false}),M(0x0a84ff));f.position.set(s*0.45,0.55,0);f.rotation.y=s>0?0:Math.PI;G.add(f);}
 const can=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,0.4,14),M(0x3a3a3c));can.rotation.x=Math.PI/2;can.position.set(0,0.45,-0.6);G.add(can);
 G.position.y=0;G.updateMatrixWorld(true);
 return await new Promise((res,rej)=>{new THREE.GLTFExporter().parse(G,buf=>{const u=new Uint8Array(buf);let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));res(btoa(s));},{binary:true});});});
fs.writeFileSync('/mnt/user-data/outputs/Squidrocket.glb',Buffer.from(b64,'base64'));console.log('bytes',Buffer.from(b64,'base64').length);
// import it into the builder to check it loads and render a picture
await P.evaluate(async(b64)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);openWorkshop(false);window.__glb=b64;},b64);});
