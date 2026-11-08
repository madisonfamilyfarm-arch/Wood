const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
await P.evaluate(()=>{startGame('free');aiSet(3);});await P.waitForTimeout(4000);
console.log(await P.evaluate(async()=>{const o=[];const m=()=>{const r=renderer.info.render;return 'calls '+r.calls+' tris '+Math.round(r.triangles/1000)+'k';};o.push('pad view: '+m());
 D.pos.y+=40;D.state='flying';D.armed=true;await new Promise(r=>setTimeout(r,1500));o.push('40 m up: '+m());
 const lk=aiPlaces().find(p=>/campsite|camp/.test(p.n));if(lk){D.pos.set(lk.x,H(lk.x,lk.z)+5,lk.z);await new Promise(r=>setTimeout(r,1500));o.push('campsite: '+m());}
 let n=0;scene.traverse(x=>{if(x.isMesh&&x.visible)n++;});o.push('visible meshes '+n+' scene children '+scene.children.length+' look '+(typeof LOOK!=='undefined'&&LOOK.on));return o.join('\n');}));});
