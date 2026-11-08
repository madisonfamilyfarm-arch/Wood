const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const o=[];startGame('free');await W(500);
 const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));
 for(const mode of ['two','one']){bsOpen('tank',null);bsClose();await W(300);if(mode==='one'){const i=WS.parts.findIndex(p=>p.style==='tread'&&p.x>0);WS.parts.splice(i,1);wsChanged();}
  const sp=wsSpec();closeWorkshop();useSpec(sp);await W(800);const y0=D.yaw,p0=D.pos.clone();kd('ArrowUp');await W(5000);ku('ArrowUp');
  o.push(mode+' tread: moved '+D.pos.distanceTo(p0).toFixed(1)+' m, turned '+((D.yaw-y0)*57.3).toFixed(0)+'°');}
 // barrel
 bsOpen('tank',null);bsClose();await W(300);const it=WSI.find(x=>/Tank barrel/.test(x.n));o.push('barrel item '+!!it+' tray idx ok '+(WSI.indexOf(it)>=0));let p;try{p=wsDefault(it,0,-10,10);}catch(e){o.push('wsDefault err '+e.message);p={t:'gun',style:'barrel',len:18,x:0,y:-10,h:10};}WS.parts.push(cleanPart(p));wsChanged();const sp=wsSpec();closeWorkshop();useSpec(sp);await W(800);
 o.push('guns '+JSON.stringify(DR.guns.map(g=>g.w))+' types '+JSON.stringify(weaponTypes()));
 let shots=0;const s0=window.tickShots;try{takeoff();}catch(e){}firing=true;try{fire();}catch(e){o.push('fire err '+e.message);}await W(500);firing=false;
 // save
 let dl=0;const c0=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download)dl++;};saveDroneFile(SPEC);HTMLAnchorElement.prototype.click=c0;o.push('save fallback download '+dl);
 return o.join('\n');}));});
