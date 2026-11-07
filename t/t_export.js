const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});const A=await b.newPage();
A.on('pageerror',e=>console.log('ERR',e.message));
await A.goto('file://'+__dirname+'/view/export.html');await A.waitForTimeout(1500);
const list=[['oak_large',5,16,'Oak big'],['oak_medium',2,11,'Oak medium'],['ash_large',9,17,'Ash'],['aspen_medium',4,13,'Aspen fall colors'],['pine_large',3,20,'Pine tall'],['pine_medium',7,14,'Pine medium'],['bush_1',1,2.5,'Bush']];
for(const [n,sd,h,label] of list){
  const b64=await A.evaluate(async([n,sd,h])=>{const EZ=window.EZG;const tr=new EZ.Tree();const o=JSON.parse(JSON.stringify(EZ.presets[n]));o.seed=(o.seed||0)+sd*977;tr.options.copy(o);tr.generate();
    await new Promise(r=>setTimeout(r,300));while(EZ.pending()>0)await new Promise(r=>setTimeout(r,100));
    const bb=new THREE.Box3().setFromObject(tr);const g=new THREE.Group();tr.scale.setScalar(h/bb.max.y);g.add(tr);g.name=n;
    const ab=await new Promise(res=>new THREE.GLTFExporter().parse(g,res,{binary:true,embedImages:true}));let s='';const u=new Uint8Array(ab);for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s);},[n,sd,h]);
  const f='/home/claude/trees/'+label.replace(/ /g,'-')+'.glb';require('fs').writeFileSync(f,Buffer.from(b64,'base64'));console.log(f,(b64.length*0.75/1024|0)+'KB');}
await b.close();})();
