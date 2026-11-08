// v66: builder fixes — rock-solid UNDO/REDO, phone-upright layout (parts bar on top, editing tools at the bottom), cameras auto-named by where they sit
// ---------------------------------------------------------------- ↶ undo/redo: every finished gesture is its own step, and nothing slips past unrecorded
addEventListener('pointerdown',()=>{try{HIST.burst=false;}catch(e){}},true);   // a NEW tap/drag never merges into the last one
function histCommit(){try{if(!WS.open||HIST.lock||HIST.down)return;const s=histSnap();if(HIST.cur==null){HIST.cur=s;return;}if(s!==HIST.cur){HIST.u.push(HIST.cur);if(HIST.u.length>150)HIST.u.shift();HIST.cur=s;HIST.r=[];histBtns();}}catch(e){}}
addEventListener('pointerup',()=>setTimeout(histCommit,30),true);addEventListener('change',()=>setTimeout(histCommit,30),true);addEventListener('keyup',()=>setTimeout(histCommit,30),true);
setInterval(histCommit,800);   // anything that changed the build some other way still gets its own undo step
// the buttons fire on finger-lift (iPhone sometimes drops the click if your finger wiggles)
(function(){const fire=(id,fn)=>{const b=$(id);if(!b)return;let t=0;b.addEventListener('pointerup',e=>{e.stopPropagation();e.preventDefault();t=performance.now();histCommit();fn();},true);b.onclick=e=>{e.stopPropagation();if(performance.now()-t<600)return;histCommit();fn();};b.style.touchAction='manipulation';};
  fire('wsUndo',histUndo);fire('wsRedo',histRedo);
  const T=new MutationObserver(()=>{const r=$('wsRedoT');if(r&&!r.__v66){r.__v66=1;r.onclick=()=>{histCommit();histRedo();};}const u=[...document.querySelectorAll('#wsTools .btn')].find(b=>/↶ undo/.test(b.textContent));if(u&&!u.__v66){u.__v66=1;u.onclick=()=>{histCommit();histUndo();};}});
  try{T.observe($('wsTools'),{childList:true});}catch(e){}})();
addEventListener('keydown',e=>{if(!WS.open||!(e.ctrlKey||e.metaKey)||e.code!=='KeyZ'||e.shiftKey)return;histCommit();histUndo();e.preventDefault();e.stopImmediatePropagation();},true);
// ---------------------------------------------------------------- 📱 phone upright: parts bar along the TOP, 3D picture in the middle, editing tools at the BOTTOM (sideways is unchanged)
(function(){const st=document.createElement('style');st.textContent=`
body.pt #ws #wsTray{top:env(safe-area-inset-top)!important;border-top:0!important}
body.pt #ws #wsMid{top:calc(84px + env(safe-area-inset-top))!important;height:calc(46% - env(safe-area-inset-top))!important}
body.pt #ws #wsTools,body.pt #ws #ezPanel{top:calc(46% + 84px)!important}
body.pt #ws.ez #wsMid{top:env(safe-area-inset-top)!important;height:calc(46% - env(safe-area-inset-top))!important}
body.pt #ws.ez #ezPanel{top:46%!important}`;document.head.appendChild(st);})();
// ---------------------------------------------------------------- 📷 cameras get a name from where they sit ("Left wingtip cam", "Nose cam", "Belly cam"…) — you can still rename them
function camAutoName(p,parts){parts=parts||WS.parts;const others=parts.filter(q=>q!==p&&q.t!=='camera');
  let mx=1,my=1,mt=1;others.forEach(q=>{mx=Math.max(mx,Math.abs(q.x||0)+(q.w||0)/2);my=Math.max(my,Math.abs(q.y||0)+(q.len||0)/2);mt=Math.max(mt,(q.h||0)+(q.d||0)/2);});
  const x=p.x||0,y=p.y||0,h=p.h||0,kind=(WS.flyAs&&WS.flyAs!=='auto')?WS.flyAs:(()=>{try{return stats(wsSpec()).flyAs;}catch(e){return 'drone';}})();
  const wings=others.filter(q=>q.t==='wing');const span=wings.reduce((a,q)=>Math.max(a,Math.abs(q.x||0)+(q.w||0)/2),0);
  if(span>0&&Math.abs(x)>=span*0.6)return (x<0?'Left':'Right')+' wingtip cam';
  const side=x<-mx*0.35?'Left':x>mx*0.35?'Right':'';const fb=y<-my*0.45?'F':y>my*0.45?'B':'';const up=h>mt*0.7?'T':h<-0.5?'D':'';
  const front={plane:'Nose',car:'Bumper',tank:'Front',boat:'Bow',sub:'Bow'}[kind]||'Front',back={plane:'Tail',boat:'Stern',sub:'Stern'}[kind]||'Rear',low={plane:'Belly',boat:'Underwater',sub:'Belly'}[kind]||'Bottom';
  let n;if(fb==='F'&&!side)n=up==='T'?'Top front':up==='D'?low+' front':front;else if(fb==='B'&&!side)n=up==='T'?'Top rear':back;else if(side)n=side+(fb==='F'?' front':fb==='B'?' rear':up==='T'?' top':' side');else n=up==='T'?(kind==='car'||kind==='tank'?'Roof':'Top'):up==='D'?low:(kind==='plane'?'Cockpit':kind==='car'?'Driver':'Center');
  n+=' cam';const same=parts.filter(q=>q!==p&&q.t==='camera'&&q.nm&&q.nm.replace(/ \d+$/,'')===n).length;return same?n+' '+(same+1):n;}
{const c0=wsChanged;wsChanged=function(){try{if(WS.open)WS.parts.forEach(p=>{if(p.t==='camera'&&(!p.nm||p.autoNm)){const n=camAutoName(p);if(n!==p.nm){p.nm=n;p.autoNm=true;}}});}catch(e){}return c0.apply(this,arguments);};}
// the name box (pops up when you add a camera, or tap 🏷) starts with the auto name; type your own and it sticks
{const n0=wsName;wsName=function(i){i=i==null?WS.sel:i;const p=WS.parts[i];if(!p)return n0.apply(this,arguments);if(p.t==='camera'&&!p.nm)p.nm=camAutoName(p);const was=p.nm;const r=n0.apply(this,arguments);const q=WS.parts[i];if(q&&q.t==='camera'&&q.nm!==was){q.autoNm=false;if(!q.nm){q.nm=camAutoName(q);q.autoNm=true;}wsChanged();}return r;};}
// a camera you just added still gets the name box (it already has an automatic name now)
WS.camAsked=new Set();
{const c0=wsChanged;wsChanged=function(){const r=c0.apply(this,arguments);try{if(WS.open){const cam=WS.parts.find(p=>p.t==='camera'&&p.autoNm&&!WS.camAsked.has(p.id)&&!(WS.seen0&&WS.seen0.has(p.id)));if(cam){WS.camAsked.add(cam.id);setTimeout(()=>{const i=WS.parts.indexOf(cam);if(i>=0&&WS.open&&!HIST.down)wsName(i);},350);}}}catch(e){}return r;};}
{const o0=openWorkshop;openWorkshop=function(){const r=o0.apply(this,arguments);try{WS.seen0=new Set(WS.parts.map(p=>p.id));WS.camAsked=new Set();}catch(e){}return r;};}
{const b0=bsOpen;bsOpen=function(){const r=b0.apply(this,arguments);try{WS.seen0=new Set(WS.parts.map(p=>p.id));WS.camAsked=new Set();}catch(e){}return r;};}
// flying a build whose cameras never got names: name them from where they sit on the vehicle
{const l0=camLabel;camLabel=function(){try{const cc=camCur();if(cc&&!cc.n){const L=DR.cams;let mx=0.05,mz=0.05;L.forEach(c=>{mx=Math.max(mx,Math.abs(c.x));mz=Math.max(mz,Math.abs(c.z));});
  const s=cc.x<-0.08?'Left':cc.x>0.08?'Right':'',f=cc.z<-0.1?'front':cc.z>0.1?'rear':'';cc.n=((s?s+(f?' '+f:' side'):(f?f[0].toUpperCase()+f.slice(1):(cc.y>0.08?'Top':'Center')))+' cam');}}catch(e){}return l0.apply(this,arguments);};}
// a slider that applies its last change right after you let go still counts as the SAME step
addEventListener('pointerup',()=>{HIST.upT=performance.now();},true);
{const c0=wsChanged;wsChanged=function(){const late=HIST.burst&&!HIST.down&&performance.now()-(HIST.upT||0)<400;if(late)HIST.down=true;try{return c0.apply(this,arguments);}finally{if(late)HIST.down=false;}};}
