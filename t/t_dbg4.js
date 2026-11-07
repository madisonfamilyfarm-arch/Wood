const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));
 console.log(await A.evaluate(()=>{useSpec(__wds.VPRESETS.boat.speed);const r=[];for(let x=166;x<170;x+=0.3){const o=hitTest(new V3(x,D.pos.y+0.2,10.2),ST.rad);r.push(x.toFixed(1)+':'+(o?JSON.stringify(o).slice(0,90):'-'));}return r.join('\n')+'\nobjs '+OBJS.length+' ramps '+RAMPS.length;}));
});
