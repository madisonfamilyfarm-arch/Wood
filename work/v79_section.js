// v79: the 🚶 button says what it does — "🚶 Walk" while driving/flying, and "🚗 Drive" / "🚁 Fly" / "⛵ Sail" while walking to get back in.
//      Walk up to the train → a big "🚂 Ride the train" button (like the fire truck); while riding → "🚶 Hop off".
function walkBtnLabel(){try{const b=$('bWalk');if(!b)return;let t;if(!WALK.on)t='🚶 Walk';else{const k=(typeof vhKind==='function'?vhKind():vkind());t=k==='tank'?'🪖 Drive':k==='car'?'🚗 Drive':k==='boat'||k==='sub'?'⛵ Sail':k==='plane'?'✈️ Fly':'🚁 Fly';}if(b.textContent!==t)b.textContent=t;b.title=WALK.on?'get back in and '+t.split(' ')[1].toLowerCase()+' (K)':'get out and walk around (K)';}catch(e){}}
setInterval(walkBtnLabel,300);
function trainRideBtn(){let b=$('trainRideB');if(!b){b=document.createElement('button');b.id='trainRideB';b.className='btn';b.style.cssText='position:fixed;left:50%;bottom:calc(230px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:23;font:900 18px system-ui,sans-serif;padding:12px 18px;border-radius:14px;background:rgba(10,90,40,0.92);color:#fff;border:2px solid #fff;display:none;touch-action:manipulation';
    b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();try{trainToggle();}catch(err){}});document.body.appendChild(b);}
  let show=false,t='';try{if(started&&WALK.on&&!(TRUCK&&TRUCK.in)&&!(menu&&menu.open)){if(TRAIN.ride){show=true;t='🚶 Hop off the train';}else if(trainNear()){show=true;t='🚂 Ride the train';}}}catch(e){}
  b.style.display=show?'':'none';if(show&&b.textContent!==t)b.textContent=t;}
setInterval(trainRideBtn,250);
{const w0=walkToggle;walkToggle=function(){const r=w0.apply(this,arguments);setTimeout(walkBtnLabel,0);setTimeout(walkBtnLabel,200);return r;};}
