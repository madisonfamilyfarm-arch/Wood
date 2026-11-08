// ================================================================ v51: 🛠 better builder — UNDO / REDO for every change · scroll vs drag in the parts list (up/down = scroll, sideways = grab) · autosave so a page reload never loses your build
// ---------------------------------------------------------------- ↶ ↷ undo / redo that records EVERY change (parts, wires, sliders, colour, how it moves…)
const HIST={u:[],r:[],cur:null,t:0,lock:false,down:false};
addEventListener('pointerdown',()=>{HIST.down=true;},true);addEventListener('pointerup',()=>{setTimeout(()=>{HIST.down=false;},0);},true);addEventListener('pointercancel',()=>{HIST.down=false;},true);
function histSnap(){return JSON.stringify({p:WS.parts,w:WS.wires,f:WS.flyAs,a:WS.armor,n:WS.name,c:!!WS.crazy,wp:!!WS.waterproof});}
function histReset(){HIST.u=[];HIST.r=[];HIST.cur=histSnap();histBtns();}
{const c0=wsChanged;wsChanged=function(){const r=c0.apply(this,arguments);try{if(!HIST.lock&&WS.open){const s=histSnap();if(HIST.cur==null)HIST.cur=s;else if(s!==HIST.cur){const now=performance.now();
        // a slider drag / part drag that keeps going counts as ONE step
        if(!(now-HIST.t<450&&HIST.u.length&&HIST.burst&&HIST.down)){HIST.u.push(HIST.cur);if(HIST.u.length>150)HIST.u.shift();}HIST.burst=true;HIST.t=now;HIST.cur=s;HIST.r=[];histBtns();clearTimeout(HIST.bt);HIST.bt=setTimeout(()=>{HIST.burst=false;},450);}}}catch(e){}return r;};}
function histApply(s){HIST.lock=true;try{const o=JSON.parse(s);WS.parts=o.p.map(cleanPart);WS.wires=o.w||[];WS.flyAs=o.f||WS.flyAs;if(o.a!=null)WS.armor=o.a;if(o.n)WS.name=o.n;WS.crazy=!!o.c;WS.waterproof=!!o.wp;WS.sel=-1;wsChanged();
    if(EZB.on){EZB.base=JSON.parse(JSON.stringify(WS.parts));Object.assign(EZB.v,{size:100,wid:100,len:100,hgt:100,wheel:100,pow:100});ezDraw();}}finally{HIST.lock=false;}HIST.cur=histSnap();histBtns();}
function histUndo(){if(!HIST.u.length){toast('Nothing to undo',900);return;}HIST.burst=false;HIST.r.push(HIST.cur);histApply(HIST.u.pop());sfx('click');toast('↶ Undone',700);}
function histRedo(){if(!HIST.r.length){toast('Nothing to redo',900);return;}HIST.burst=false;HIST.u.push(HIST.cur);histApply(HIST.r.pop());sfx('click');toast('↷ Redone',700);}
{const t0=wsTool;wsTool=function(k){if(k==='undo'){histUndo();return;}if(k==='redo'){histRedo();return;}return t0.apply(this,arguments);};}
addEventListener('keydown',e=>{if(!WS.open||!(e.ctrlKey||e.metaKey))return;if(e.code==='KeyY'||(e.code==='KeyZ'&&e.shiftKey)){histRedo();e.preventDefault();e.stopImmediatePropagation();}},true);
// big buttons always on screen (drag mode AND easy sliders)
(function(){const st=document.createElement('style');st.textContent=`#wsUR{position:absolute;left:50%;transform:translateX(-50%);top:46px;z-index:4;display:flex;gap:6px}
#wsUR button{padding:7px 14px;border-radius:12px;border:1px solid #3a5a44;background:rgba(19,32,26,0.92);color:#fff;font:800 14px system-ui;touch-action:manipulation}#wsUR button:disabled{opacity:0.35}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='wsUR';d.innerHTML='<button id="wsUndo">↶ Undo</button><button id="wsRedo">↷ Redo</button>';$('wsMid').appendChild(d);
  $('wsUndo').onclick=e=>{e.stopPropagation();histUndo();};$('wsRedo').onclick=e=>{e.stopPropagation();histRedo();};['pointerdown','pointerup'].forEach(ev=>d.addEventListener(ev,e=>e.stopPropagation()));})();
function histBtns(){const u=$('wsUndo'),r=$('wsRedo');if(!u)return;u.disabled=!HIST.u.length;r.disabled=!HIST.r.length;u.textContent='↶ Undo'+(HIST.u.length?' ('+HIST.u.length+')':'');}
{const o0=openWorkshop;openWorkshop=function(){const r=o0.apply(this,arguments);setTimeout(histReset,0);return r;};}
{const b0=bsOpen;bsOpen=function(){const r=b0.apply(this,arguments);histReset();return r;};}
// the old "↶ undo" button in Tools gets a redo partner
{const u0=wsBuildUI;wsBuildUI=function(){const r=u0.apply(this,arguments);try{const T=$('wsTools');const ub=[...T.querySelectorAll('.btn')].find(b=>/↶ undo/.test(b.textContent));if(ub&&!$('wsRedoT')){ub.classList.remove('wide');ub.style.gridColumn='';const rb=document.createElement('button');rb.id='wsRedoT';rb.className='btn';rb.textContent='↷ redo';rb.onclick=()=>histRedo();ub.after(rb);}}catch(e){}return r;};}
// ---------------------------------------------------------------- 👆 parts list: move up/down = SCROLL, move sideways = GRAB the part (a little wobble is fine)
(function(){const st=document.createElement('style');st.textContent='.wsPart{touch-action:pan-y!important}';document.head.appendChild(st);
  let P=null;const tray=()=>$('wsTray');
  addEventListener('pointerdown',e=>{if(!WS.open||e.pointerType==='mouse')return;const t=e.target.closest&&e.target.closest('.wsPart');if(!t||!tray().contains(t))return;
    e.stopImmediatePropagation();P={id:e.pointerId,x:e.clientX,y:e.clientY,i:+t.dataset.i,el:t,st:tray().scrollTop,dec:null};},true);
  const startDrag=(e)=>{const it=WSI[P.i];if(!it)return;WS.tray=P.i;WS.drag={kind:'new',item:it,sx:P.x,sy:P.y,moved:false};const g=$('wsGhost');g.textContent=it.ic;g.style.left=e.clientX+'px';g.style.top=e.clientY+'px';try{wsHL();}catch(x){}};
  addEventListener('pointermove',e=>{if(!P||e.pointerId!==P.id||P.dec)return;const dx=e.clientX-P.x,dy=e.clientY-P.y;
    if(Math.abs(dy)>9&&Math.abs(dy)>Math.abs(dx)*0.9){P.dec='scroll';return;}
    if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.15){P.dec='drag';startDrag(e);}},true);
  addEventListener('pointerup',e=>{if(!P||e.pointerId!==P.id)return;const p=P;P=null;if(!p.dec&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<10&&Math.abs(tray().scrollTop-p.st)<4){P=p;startDrag(e);P=null;}},true);
  addEventListener('pointercancel',e=>{if(P&&e.pointerId===P.id){if(P.dec!=='drag'){WS.drag=null;$('wsGhost').style.display='none';}P=null;}},true);})();
// ---------------------------------------------------------------- 💾 autosave: if the page reloads (phones do that to save memory), your build comes right back
{const c0=wsChanged;wsChanged=function(){const r=c0.apply(this,arguments);clearTimeout(wsChanged.live);wsChanged.live=setTimeout(()=>{try{if(WS.open){const sp=wsSpec();LS.set('wsLive',{sp,kit:WS.kit||null,crazy:!!WS.crazy,t:Date.now(),open:true});LS.set('wsCur_'+(WS.kit||'free'),sp);}}catch(e){}},300);return r;};}
{const c0=closeWorkshop;closeWorkshop=function(){const L=LS.get('wsLive',null);if(L){L.open=false;LS.set('wsLive',L);}return c0.apply(this,arguments);};}
function wsRestore(L){const sp=L.sp;if(L.kit){bsOpen(L.kit,sp);}else{openWorkshop(false);WS.parts=JSON.parse(JSON.stringify(sp.parts)).map(cleanPart);WS.wires=sp.wires||[];WS.name=sp.name||WS.name;WS.flyAs=sp.flyAs||WS.flyAs;if(sp.armor)WS.armor=sp.armor;WS.crazy=!!sp.crazy;wsChanged();histReset();}toast('🔧 Your build is back!',2000);}
{const s0=startGame;startGame=function(){const r=s0.apply(this,arguments);setTimeout(()=>{try{const L=LS.get('wsLive',null);if(L&&L.open&&L.sp&&L.sp.parts&&Date.now()-L.t<3*864e5&&!WS.open){
      bsAsk('🔧 You were building "'+(L.sp.name||'something')+'"',[{i:'🔧',t:'Keep building it',s:'Everything you made is still here',fn:()=>wsRestore(L)},{i:'✈️',t:'No thanks — just play',s:'(it\'s still saved: Build → Keep working)',fn:()=>{L.open=false;LS.set('wsLive',L);}}],true);}}catch(e){}},1500);return r;};}
