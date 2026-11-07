// ================================================================ v37: 📐 Screen: Auto / Landscape (sideways) / Portrait (upright) — layout fits each way the phone is held
const SCR={mode:LS.get('scrMode','auto')};
const SCR_N={auto:'🔄 Auto (turns with the phone)',land:'↔️ Landscape (sideways)',port:'↕️ Portrait (upright)'};
(function(){const st=document.createElement('style');st.textContent=`
body.pt #asBox{top:calc(124px + env(safe-area-inset-top))!important}
body.pt #cbBtn{left:calc(12px + env(safe-area-inset-left))!important;right:auto!important;transform:none!important;bottom:calc(190px + env(safe-area-inset-bottom))!important;top:auto!important}
body.pt #tntBtn{right:calc(12px + env(safe-area-inset-right))!important;bottom:calc(190px + env(safe-area-inset-bottom))!important}
body.pt #flipBtn{right:calc(12px + env(safe-area-inset-right))!important;bottom:calc(240px + env(safe-area-inset-bottom))!important}
body.pt #onlBadge{top:calc(76px + env(safe-area-inset-top))!important;font-size:12px!important}
#scrTurn{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.88);color:#fff;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;font:800 20px system-ui;padding:20px;gap:14px}
#scrTurn .ph{font-size:70px;animation:scrSpin 1.6s ease-in-out infinite}
@keyframes scrSpin{0%,20%{transform:rotate(0)}60%,100%{transform:rotate(var(--rot,90deg))}}
#scrTurn button{font:700 15px system-ui;padding:8px 14px;border-radius:12px;border:2px solid #fff;background:#0a84ff;color:#fff}`;document.head.appendChild(st);
  const o=document.createElement('div');o.id='scrTurn';o.innerHTML='<div class="ph">📱</div><div id="scrMsg"></div><div style="font:500 14px system-ui;opacity:0.8">If it won\'t turn: swipe down from the top-right corner and turn off 🔒 Portrait Lock.</div><button id="scrAuto">Use 🔄 Auto instead</button>';
  document.body.appendChild(o);o.querySelector('#scrAuto').onclick=()=>scrSet('auto');})();
function scrTall(){return innerHeight>innerWidth;}
function scrApply(){const tall=scrTall();document.body.classList.toggle('pt',tall);const o=$('scrTurn');if(!o)return;
  const wrong=(SCR.mode==='land'&&tall)||(SCR.mode==='port'&&!tall);o.style.display=wrong?'flex':'none';
  if(wrong){o.style.setProperty('--rot',SCR.mode==='land'?'90deg':'-90deg');$('scrMsg').textContent=SCR.mode==='land'?'Turn your phone sideways ↔️':'Turn your phone upright ↕️';}
  try{if(SCR.mode!=='auto'&&screen.orientation&&screen.orientation.lock)screen.orientation.lock(SCR.mode==='land'?'landscape':'portrait').catch(()=>{});else if(SCR.mode==='auto'&&screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(e){}}
function scrSet(m){SCR.mode=m||{auto:'land',land:'port',port:'auto'}[SCR.mode];LS.set('scrMode',SCR.mode);scrApply();toast('📐 Screen: '+SCR_N[SCR.mode],1800);try{renderMenu();}catch(e){}}
addEventListener('resize',()=>setTimeout(scrApply,50));addEventListener('orientationchange',()=>setTimeout(scrApply,250));setTimeout(scrApply,300);setInterval(scrApply,1500);
{const m0=mainItems;mainItems=function(){const L=m0();let i=L.findIndex(x=>/Playing on/.test(String(x.label())));if(i<0)i=1;
  L.splice(i+1,0,mItem(()=>'📐 Screen: '+SCR_N[SCR.mode]+'  ◀ ▶',()=>scrSet(),d=>{const o=['auto','land','port'];scrSet(o[(o.indexOf(SCR.mode)+d+3)%3]);}));return L;};}
