const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:393,height:852});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
for(const mode of ['free','kit']){
console.log(await P.evaluate(async(mode)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));if(!window.__st){startGame('free');window.__st=1;}if(mode==='free')openWorkshop(false);else{bsOpen(Object.keys(KITS)[0],null);bsClose();}await W(800);
 const add=()=>{const it=WSI.find(x=>!x.imp&&x.t!=='body')||WSI[1];const xy=wsFreeSpot(it.t);const p=wsDefault(it,xy[0],xy[1],xy[2]);wsSnap(p);WS.parts.push(p);WS.sel=WS.parts.length-1;wsChanged();};
 const o=[];const btns=[...document.querySelectorAll('#wsTools button, #ws button')].filter(b=>b.offsetParent&&!/FLY IT|DRIVE IT|close|✕|Undo|Redo|undo|redo|in the woods|import|Import|save|Save|share|Share|load|Load/.test(b.textContent));
 for(const b of btns){add();add();await W(100);const u0=HIST.u.length,n0=WS.parts.length;const txt=b.textContent.trim().slice(0,30);try{b.click();}catch(e){o.push('ERR '+txt);}await W(250);try{if($('bsBox').style.display==='flex')bsClose();}catch(e){}
   if(!WS.open){o.push('CLOSED WS: '+txt);if(mode==='free')openWorkshop(false);else{bsOpen(Object.keys(KITS)[0],null);bsClose();}await W(500);continue;}
   const u1=HIST.u.length;if(u1<u0)o.push('HIST RESET by: '+txt+' ('+u0+'→'+u1+')');
   if(histSnap()!==HIST.cur)o.push('UNRECORDED change by: '+txt);
   // can we undo the button's change?
   if(u1>u0){const before=HIST.cur;histUndo();await W(50);const ok=WS.parts.length===n0;histRedo();if(!ok)o.push('undo mismatch '+txt);}}
 const r=mode+': '+btns.length+' buttons tested\n'+o.join('\n');try{closeWorkshop();}catch(e){}return r;},mode));}});
