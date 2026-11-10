const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(()=>{const o=[];try{o.push('places '+JSON.stringify(aiPlaces().map(p=>[p.n,Math.round(p.x),Math.round(p.z)])));}catch(e){o.push('noplaces '+e.message);}
 o.push('RUNWAY '+JSON.stringify(typeof RUNWAY!=='undefined'?RUNWAY:null)+' TRACKC '+JSON.stringify(typeof TRACKC!=='undefined'?TRACKC:null));
 // coarse map of blocked + water across +-1200
 const rows=[];for(let z=-1200;z<=1200;z+=100){let r='';for(let x=-1200;x<=1200;x+=100){const h=H(x,z);r+=(typeof inWater==='function'&&inWater(x,z))?'~':blocked(x,z)?'#':h>14?'^':h>6?'+':'.';}rows.push(z.toString().padStart(6)+' '+r);}o.push(rows.join('\n'));return o.join('\n');}));});
