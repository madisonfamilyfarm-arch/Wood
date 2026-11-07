const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','file:///home/claude/t/srv/real.html');
  A.on('console',m=>console.log('C',m.type(),m.text().slice(0,250)));
  A.on('requestfailed',r=>{console.log('FAIL',r.url().slice(0,150),r.failure()&&r.failure().errorText);});
  await A.waitForTimeout(15000);
  await A.screenshot({path:'filemode.png'});console.log(await A.evaluate(()=>JSON.stringify({x:1,tiles0:CES.viewer.scene.globe._surface._tilesToRender.length,tName:CES.tName,style:CES.style,tp:CES.viewer.scene.terrainProvider&&CES.viewer.scene.terrainProvider.constructor.name})));
});
