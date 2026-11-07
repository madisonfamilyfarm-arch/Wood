const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.route(/World_Imagery\/MapServer\/tile/,r=>r.fulfill({path:__dirname+'/forest.png',contentType:'image/png',headers:{'Access-Control-Allow-Origin':'*'}}));
  await A.route(/overpass-api/,async r=>{const o=await A.evaluate(()=>CES.origin);const m=111320,c=Math.cos(o.lat*Math.PI/180);const sq=(x,z,w,d)=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d],[x,z]].map(([a,b])=>({lat:o.lat-b/m,lon:o.lon+a/(m*c)}));
    r.fulfill({contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({elements:[{type:'way',id:11,tags:{building:'house'},geometry:sq(30,-40,12,9)},{type:'way',id:12,tags:{building:'barn'},geometry:sq(-50,-30,20,14)},{type:'way',id:13,tags:{building:'yes','building:levels':'4'},geometry:sq(40,30,25,18)}]})});});
  await A.waitForTimeout(3000);await A.evaluate(()=>startGame('free'));
  await A.waitForFunction(()=>CES.ready,null,{timeout:120000});await A.waitForTimeout(15000);
  console.log(await A.evaluate(()=>JSON.stringify({cells:SAT.cells.size,trees:[...SAT.cells.values()].reduce((a,c)=>a+c.trees.length,0),blds:SAT.blds&&SAT.blds.length,tiles:SAT.tiles.size,okTiles:[...SAT.tiles.values()].filter(t=>t.ok).length,objs:[...SAT.cells.values()].reduce((a,c)=>a+c.objs.length,0)})));
  await A.evaluate(()=>{takeoff();});await A.waitForTimeout(3000);await A.evaluate(()=>{__wds.step({ly:1},2.5);__wds.setCam('CHASE');});await A.waitForTimeout(3000);
  await A.screenshot({path:'sat1.png'});
  console.log('hit tree?',await A.evaluate(()=>{const c=[...SAT.cells.values()].find(c=>c.trees.length);if(!c)return 'none';const t=c.trees[0];return !!hitTest(new THREE.Vector3(t.x,t.y+1,t.z),0.2);}));
  console.log('menu',await A.evaluate(()=>cesItems().slice(-2).map(i=>i.label()).join(' | ')));
});
