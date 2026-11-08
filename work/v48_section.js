// ================================================================ v48: 📱 builder fits the iPhone for real — room for the notch side, small tidy top line, fold buttons at the bottom, tanks say "ready to drive"
(function(){const st=document.createElement('style');st.textContent=`
body.ph #wsTray{width:calc(80px + env(safe-area-inset-left))!important;padding-left:calc(3px + env(safe-area-inset-left))!important;padding-right:3px!important;overflow-x:hidden!important}
#wsTray,#wsTools,#ezPanel{box-sizing:border-box!important}body.ph .wsPart{flex-shrink:0!important}
body.ph #wsTray > *{min-width:0;max-width:100%;box-sizing:border-box}body.ph #wsTray > :first-child{font-size:8px!important;line-height:1.2;overflow:hidden}
body.ph .wsPart{word-break:break-word;line-height:1.15;white-space:normal!important;width:auto!important;min-width:0!important;max-width:100%!important;overflow:hidden}body.ph #wsMid{overflow:hidden}
body.ph #wsMid{left:calc(80px + env(safe-area-inset-left))!important;right:calc(186px + env(safe-area-inset-right))!important}
body.ph #wsTools{width:calc(186px + env(safe-area-inset-right))!important;padding-right:calc(4px + env(safe-area-inset-right))!important}
body.ph #ws.ez #wsMid{right:calc(220px + env(safe-area-inset-right))!important}body.ph #ezPanel{width:calc(220px + env(safe-area-inset-right))!important;padding-right:calc(6px + env(safe-area-inset-right))!important}
body.ph #ws.noTray #wsMid{left:env(safe-area-inset-left)!important}body.ph #ws.noTools #wsMid,body.ph #ws.ez.noTools #wsMid{right:env(safe-area-inset-right)!important}
body.ph #wsTop,body.ph #wsTop *{font-size:10px!important;line-height:1.25!important}body.ph #wsTop{max-height:40px;overflow:hidden;padding-left:4px!important;padding-right:4px!important}
body.ph #wsTop img,body.ph #wsTop svg{height:12px!important;width:auto!important}
.wsFold{top:auto!important;bottom:calc(8px + env(safe-area-inset-bottom))!important}`;document.head.appendChild(st);})();
// say the right thing for things that drive / float
function wsGoWord(){const f=WS.flyAs,k=WS.kit||'';const ground=/^(car|tank)$/.test(f)||(f==='auto'&&/^(tank|car|monster)$/.test(k)),water=/^(boat|sub)$/.test(f)||(f==='auto'&&/^(boat|sub)$/.test(k));return ground?['drive','DRIVE IT']:water?['sail','SAIL IT']:['fly','FLY IT'];}
{const d0=wsDraw;wsDraw=function(){const r=d0.apply(this,arguments);try{const [w,b]=wsGoWord();if(w!=='fly'){const s=$('wsStats');if(s&&/ready to fly/.test(s.innerHTML))s.innerHTML=s.innerHTML.replace(/ready to fly/g,'ready to '+w);
      const T=$('wsTools');if(T)for(const el of T.querySelectorAll('.btn')){if(/^\s*✅?\s*FLY IT/.test(el.textContent))el.textContent='✅ '+b;}}}catch(e){}return r;};}
{const t0=toast;toast=function(m){try{if(WS.open&&/FLY IT/.test(String(m))){const [w,b]=wsGoWord();if(w!=='fly')m=String(m).replace(/FLY IT/g,b);}}catch(e){}return t0.apply(this,[m].concat([].slice.call(arguments,1)));};}
