const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  A.on('console',m=>{if(/Xq|rror/.test(m.text()))console.log('CONSOLE',m.type(),m.text().slice(0,300));});
  await A.waitForTimeout(8000);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(3000);
  console.log(await A.evaluate(()=>{const C=Cesium,cm=CES.viewer.camera,c=cm.positionCartographic;return JSON.stringify({lat:C.Math.toDegrees(c.latitude),lon:C.Math.toDegrees(c.longitude),h:c.height,dir:cm.direction,pitch:cm.pitch,heading:cm.heading,globe:CES.viewer.scene.globe.show,tiles:CES.viewer.scene.globe._surface._tilesToRender.length,layers:CES.viewer.imageryLayers.length,time:Cesium.JulianDate.toIso8601(CES.viewer.clock.currentTime)});}));
  await A.evaluate(()=>{CES.viewer.scene.terrainProvider=new Cesium.EllipsoidTerrainProvider();});await A.waitForTimeout(3000);await A.screenshot({path:'rdbg.png'});console.log('tiles now',await A.evaluate(()=>JSON.stringify({pos:D.pos,home:D.home,h00:cesH(0,0),gh:CES.viewer.scene.globe.getHeight(Cesium.Cartographic.fromDegrees(CES.origin.lon,CES.origin.lat)),cam:cam.position,camh:CES.viewer.camera.positionCartographic.height})));
});
