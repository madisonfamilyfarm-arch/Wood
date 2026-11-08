// ================================================================ v53: 📱 builder with the phone UPRIGHT: picture on top, parts in a sideways row (slide = scroll, swipe up = grab), tools/sliders underneath
(function(){const st=document.createElement('style');st.textContent=`
body.pt #ws #wsMid{left:0!important;right:0!important;top:0!important;bottom:auto!important;height:46%!important}
body.pt #ws #wsTray{top:46%!important;left:0!important;right:0!important;bottom:auto!important;width:auto!important;height:84px!important;flex-direction:row!important;overflow-x:auto!important;overflow-y:hidden!important;padding:4px calc(4px + env(safe-area-inset-right)) 4px calc(4px + env(safe-area-inset-left))!important;border-right:0!important;border-top:1px solid #2f4a37;border-bottom:1px solid #2f4a37;align-items:stretch;gap:4px!important}
body.pt #ws #wsTray .wsPart{width:74px!important;min-width:74px!important;flex:0 0 74px!important;touch-action:pan-x!important;font-size:9.5px!important}
body.pt #ws #wsTray .wsHead{writing-mode:vertical-rl;transform:rotate(180deg);flex:0 0 auto;margin:0!important;font-size:8px!important}
body.pt #ws #wsTools,body.pt #ws #ezPanel{top:calc(46% + 84px)!important;left:0!important;right:0!important;bottom:0!important;width:auto!important;border-left:0!important;padding:6px calc(6px + env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) calc(6px + env(safe-area-inset-left))!important}
body.pt #ws #wsTools{grid-template-columns:repeat(3,minmax(0,1fr))!important}body.pt #ws #wsTools,body.pt #ws #ezPanel,body.pt #ws #wsTray{background:#0f1913!important}body.pt #ws.ez #wsMid,body.ph.pt #ws.ez #wsMid,body.pt #ws.ez.noTools #wsMid{left:0!important;right:0!important}
body.pt #ws.ez #wsTools{display:none!important}body.pt #ws.ez #wsTray{display:none!important}body.pt #ws.ez #ezPanel{top:46%!important}
body.pt #ws .wsFold{display:none!important}body.pt #ws.noTray #wsTray{display:flex!important}body.pt #ws.noTools #wsTools{display:grid!important}`;document.head.appendChild(st);})();
// upright: the parts row scrolls sideways, so a sideways slide = scroll and an upward swipe = grab the part
(function(){let P=null;addEventListener('pointerdown',e=>{if(!WS.open||e.pointerType==='mouse'||!document.body.classList.contains('pt'))return;const t=e.target.closest&&e.target.closest('.wsPart');if(!t||!$('wsTray').contains(t))return;
    e.stopImmediatePropagation();P={id:e.pointerId,x:e.clientX,y:e.clientY,i:+t.dataset.i,st:$('wsTray').scrollLeft,dec:null};},true);
  const start=e=>{const it=WSI[P.i];if(!it)return;WS.tray=P.i;WS.drag={kind:'new',item:it,sx:P.x,sy:P.y,moved:false};const g=$('wsGhost');g.textContent=it.ic;g.style.left=e.clientX+'px';g.style.top=e.clientY+'px';try{wsHL();}catch(x){}};
  addEventListener('pointermove',e=>{if(!P||e.pointerId!==P.id||P.dec)return;const dx=e.clientX-P.x,dy=e.clientY-P.y;if(Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*0.9){P.dec='scroll';return;}if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)*1.15){P.dec='drag';start(e);}},true);
  addEventListener('pointerup',e=>{if(!P||e.pointerId!==P.id)return;const p=P;P=null;if(!p.dec&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<10&&Math.abs($('wsTray').scrollLeft-p.st)<4){P=p;start(e);P=null;}},true);
  addEventListener('pointercancel',e=>{if(P&&e.pointerId===P.id){if(P.dec!=='drag'){WS.drag=null;$('wsGhost').style.display='none';}P=null;}},true);})();
// keep the 3D picture sized right when the phone turns
addEventListener('resize',()=>{if(WS.open)setTimeout(()=>{try{window.dispatchEvent(new Event('wsresize'));}catch(e){}},60);});
