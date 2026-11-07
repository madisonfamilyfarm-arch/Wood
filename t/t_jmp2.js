const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  await A.evaluate(()=>{useSpec(sanitize(Object.values(VPRESETS.car)[0]));});await A.waitForTimeout(1500);
  console.log(await A.evaluate(()=>{const o={id:'tj',type:'ramp',x:-40,y:0,z:60,yaw:Math.PI/2,s:1,steep:1.6,pow:3,long:1};objAdd(o);const out=[];
    for(let x=-42;x<=-39;x+=0.25){const g=carGround(x,60);for(const dy of[0.2,0.5,0.8]){const h=hitTest(new THREE.Vector3(x,g+ST.legs+dy,60),ST.rad);if(h)out.push(x+' dy'+dy+' '+JSON.stringify(h).slice(0,140));}}
    return 'rad '+ST.rad+' legs '+ST.legs+'\n'+out.slice(0,8).join('\n');}));
});
