const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');DZ.on=true;});await P.waitForTimeout(1500);
 const st=()=>P.evaluate(()=>({shots:shots.length,tnts:TNTS.length,state:D.state,y:+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1),flip:D.flip||0,menu:menu.open}));
 const o=[];o.push('start '+JSON.stringify(await st()));
 await P.keyboard.press('Space');await P.waitForTimeout(2500);o.push('after Space '+JSON.stringify(await st()));await P.keyboard.down('w');await P.waitForTimeout(1500);await P.keyboard.up('w');o.push('after W hold '+JSON.stringify(await st()));
 await P.keyboard.press('r');await P.waitForTimeout(300);o.push('after R '+JSON.stringify(await st()));
 await P.keyboard.press('0');await P.waitForTimeout(300);o.push('after 0 '+JSON.stringify(await st()));
 // open chat box and type letters — nothing should fire
 const inp=await P.evaluate(()=>{const b=$('cbBtn');if(b)b.click();const i=[...document.querySelectorAll('input[type=text],textarea')].find(e=>e.offsetParent!==null&&e.id!=='jsEd');if(i)i.focus();return i?(i.id||i.className||i.placeholder||'input'):null;});
 o.push('chat input: '+inp);if(inp){const s0=await st();await P.keyboard.type('rrr000 frog');await P.waitForTimeout(300);const s1=await st();o.push('typing in chat fired? shots '+s0.shots+'→'+s1.shots+' tnt '+s0.tnts+'→'+s1.tnts);await P.keyboard.press('Escape');}
 await P.keyboard.press('Escape');await P.waitForTimeout(300);o.push('esc menu '+JSON.stringify(await st()));
 console.log(o.join('\n'));});
