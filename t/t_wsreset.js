const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:393,height:852});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const log=[];const t0=performance.now();const T=()=>((performance.now()-t0)/1000).toFixed(1)+'s ';
 for(const f of ['openWorkshop','closeWorkshop','bsOpen','histReset','resetDrone','rebuildDrone','wsRestore','histApply','startGame','dzRespawn','quickFix','breakApart']){const o=window[f];if(typeof o!=='function'){log.push('no '+f);continue;}window[f]=function(){if(WS.open||f==='closeWorkshop')log.push(T()+f+' open='+WS.open+' parts='+WS.parts.length+' '+(new Error().stack.split('\n').slice(2,4).map(x=>x.trim().slice(0,70)).join(' < ')));return o.apply(this,arguments);};}
 startGame('free');aiSet(6);try{dzSet(true);}catch(e){}await W(1500);bsOpen('plane',null);bsClose();await W(500);
 const add=()=>{const it=WSI.filter(x=>!x.imp)[Math.floor(Math.random()*20)];const xy=wsFreeSpot(it.t);const p=wsDefault(it,xy[0],xy[1],xy[2]);wsSnap(p);WS.parts.push(p);WS.sel=WS.parts.length-1;wsChanged();};
 let n=WS.parts.length,drops=0;for(let i=0;i<60;i++){add();await W(1000);if(WS.parts.length<n+1)drops++,log.push(T()+'PARTS DROPPED '+n+'→'+WS.parts.length);n=WS.parts.length;if(!WS.open){log.push(T()+'WS CLOSED');break;}}
 return log.slice(0,40).join('\n')+'\nfinal parts '+WS.parts.length+' drops '+drops;}));});
