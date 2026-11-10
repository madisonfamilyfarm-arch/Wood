const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(500);const o=[];
 const pre=VPRESETS.car.tank;o.push('preset '+(pre&&pre.name));
 // find the menu item that picks the Tank \(turret
 let found=null;for(const c of [['car']]){for(const it of vPresetItems('car')){let l='';try{l=it.label();}catch(e){}if(/Tank \(turret/.test(l))found=[c[0],l,it];}}o.push('menu '+(found?found[0]+': '+found[1]:'none'));
 if(found){const it=found[2];(it.act||it.fn||it.f||it.run||(()=>{}))();}else if(pre)useSpec(JSON.parse(JSON.stringify(pre)));await W(1500);o.push('now: '+SPEC.name+' parts '+(SPEC.parts?SPEC.parts.length:0)+' turret '+!!(DR.g.userData&&DR.g.userData.tur));return o.join('\n');}));});
