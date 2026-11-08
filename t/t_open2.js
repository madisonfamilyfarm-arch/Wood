const H0=require('./harness');const fs=require('fs');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
await P.evaluate(async()=>{startGame('free');await new Promise(r=>setTimeout(r,300));openWorkshop(false);});
const [fc]=await Promise.all([P.waitForEvent('filechooser'),P.evaluate(()=>{const b=[...document.querySelectorAll('#wsTools button')].find(b=>/open file/.test(b.textContent));b.click();})]);
await fc.setFiles('/mnt/user-data/outputs/GIANT-Squid-Quad.drone.json');await P.waitForTimeout(1500);
console.log(await P.evaluate(async()=>{const st=stats(wsSpec());const b=[...document.querySelectorAll('#wsTools button')].find(b=>/FLY IT/.test(b.textContent));b.click();await new Promise(r=>setTimeout(r,1200));return 'bigF '+(SPEC.bigF||1)+' size '+new THREE.Box3().setFromObject(DR.g).getSize(new THREE.Vector3()).x.toFixed(0)+' m, parts '+WS.parts.length+' wires '+WS.wires.length+' why="'+(st.why||'')+'" name '+WS.name;}));
/*=await Promise.all([P.waitForEvent('filechooser'),P.evaluate(()=>importModel())]);await fc2.setFiles('/mnt/user-data/outputs/GIANT-Squid-Quad.drone.json');await P.waitForTimeout(1500);
*/console.log(await P.evaluate(()=>'end: parts '+WS.parts.length+' wires '));});
