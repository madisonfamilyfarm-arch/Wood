const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(500);bsOpen('plane',null);bsClose();await W(500);
 const it=WSI.find(x=>x.t==='camera');const o=[];o.push('cam item '+JSON.stringify(it).slice(0,150));
 for(const [x,y,h] of [[-35,0,0],[35,0,0],[0,-24,3],[0,20,0],[0,0,-4],[8,-10,0]]){const p=wsDefault(it,x,y,h);p.x=x;p.y=y;p.h=h;p.nm='';WS.parts.push(cleanPart(p));wsChanged();}
 o.push('parts cams '+JSON.stringify(WS.parts.filter(p=>p.t==='camera').map(p=>[p.x,p.y,p.h,p.nm])));
 // close any name prompt (none in headless)
 const fly=[...document.querySelectorAll('#wsTools button')].find(b=>/FLY IT|DRIVE IT/.test(b.textContent));fly&&fly.click();await W(1500);
 o.push('ws open '+WS.open+' DR.cams '+JSON.stringify((DR&&DR.cams||[]).map(c=>Object.assign({},c,{o:undefined,g:undefined}))).slice(0,400));
 const keys=DR&&DR.cams&&DR.cams[0]?Object.keys(DR.cams[0]):[];o.push('cam keys '+keys);
 for(let i=0;i<8;i++){nextCam(1);o.push($('camName').textContent);}
 return o.join('\n');}));});
