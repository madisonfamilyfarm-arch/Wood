// v81: 🏠 pad finder — a badge that tells you how far you are from your take-off pad, with an arrow pointing back to it
(function(){const st=document.createElement('style');st.textContent=`#padFind{position:fixed;left:50%;transform:translateX(-50%);top:calc(52px + env(safe-area-inset-top));z-index:13;display:none;align-items:center;gap:6px;padding:5px 12px 5px 8px;border-radius:18px;background:rgba(15,20,30,.62);border:1.5px solid rgba(255,255,255,.5);color:#fff;font:700 14px system-ui,sans-serif;text-shadow:0 1px 2px #000;pointer-events:auto;user-select:none}
#padFind .ar{display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#30d158;color:#fff;font-size:15px;transition:transform .1s linear}
#padFind.far .ar{background:#ff9f0a}#padFind.vfar .ar{background:#ff453a}
body.pt #padFind{top:calc(170px + env(safe-area-inset-top));left:auto;right:calc(10px + env(safe-area-inset-right));transform:none}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='padFind';d.title='Tap to fly home';d.innerHTML='<span class="ar">↑</span><span class="tx">🏠 Pad 0 m</span>';document.body.appendChild(d);
  const ar=d.querySelector('.ar'),tx=d.querySelector('.tx');
  d.addEventListener('click',()=>{try{toast('🏠 Your pad is '+tx.textContent.replace('🏠 Pad ','')+' away — follow the arrow (or tap 🏠 to go home)',3500);}catch(e){}});
  const fm=m=>m>=1000?(m/1000).toFixed(m>=10000?0:1)+' km':Math.round(m)+' m';
  const tk=()=>{try{const show=started&&D&&D.home&&!(menu&&menu.open)&&!(WS&&WS.open)&&!document.body.classList.contains('vr');d.style.display=show?'flex':'none';
    if(show){const p=WALK&&WALK.on&&WALK.pos?WALK.pos:D.pos;const dx=D.home.x-p.x,dz=D.home.z-p.z,m=Math.hypot(dx,dz);
      tx.textContent=m<4?'🏠 On the pad':'🏠 Pad '+fm(m);d.className=m>600?'vfar':m>200?'far':'';
      // arrow: direction of the pad relative to where the camera looks
      const f=new THREE.Vector3();cam.getWorldDirection(f);const camA=Math.atan2(f.x,-f.z),padA=Math.atan2(dx,-dz);ar.style.transform='rotate('+((padA-camA)*180/Math.PI)+'deg)';ar.style.visibility=m<4?'hidden':'visible';}}catch(e){}
    requestAnimationFrame(tk);};requestAnimationFrame(tk);})();
