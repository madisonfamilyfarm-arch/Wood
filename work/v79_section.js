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
// 🪖 one tap to the tank: Menu → "🪖 Tank (drive it now)" — no builder needed
function tankGo(){try{if(menu.open)menuToggle(false);}catch(e){}try{if(WALK.on)walkToggle(false);}catch(e){}try{if(WS.open)closeWorkshop();}catch(e){}openKit('tank');const sp=wsSpec();closeWorkshop();sp.name='🪖 Tank';useSpec(sp);toast('🪖 Tank ready! Left stick = gas, right stick = steer, 🪖 turret stick = aim the barrel',4000);}
{const m0=mainItems;mainItems=function(){const L=m0();const i=Math.max(0,L.findIndex(it=>{try{return /Flying tank/.test(it.label());}catch(e){return false;}}));L.splice(i,0,mItem('🪖 Tank (drive it now)',()=>tankGo()));return L;};}
{const g0=mCatItems;mCatItems=function(k){const L=g0.apply(this,arguments);try{if(k==='games'||k==='fly'||k==='build'||k==='war')L.splice(0,0,mItem('🪖 Tank (drive it now)',()=>tankGo()));}catch(e){}return L;};}
{const b0=buildItems;buildItems=function(){const L=b0();try{L.splice(1,0,mItem('🪖 Tank — drive it now',()=>{menuToggle(false);tankGo();}));}catch(e){}return L;};}
// "give me a tank" / "i want to drive the tank" in chat
{const s0=smartHear;smartHear=function(txt){try{const s=' '+String(txt||'').toLowerCase()+' ';if(/ (give me|i want|let me|can i|i wanna|switch me to|put me in|get me|spawn) (a |the |to drive a |to drive the |drive a |drive the )?tank /.test(s)&&!/flying tank/.test(s)){tankGo();const B=aiNear(1e9)[0];if(B)sbSay({B},'🪖 Here\'s your tank! Use the turret stick to aim.');return true;}if(/ (give me|i want|let me|can i|spawn) (a |the )?flying tank /.test(s)){ftankGo();return true;}}catch(e){}return s0.apply(this,arguments);};}
// the old built-in "RC tank" (a car with a tank look) is replaced by the new tank everywhere you can pick it
function newTankSpec(){const keep=WS.open;openKit('tank');const sp=wsSpec();if(!keep)closeWorkshop();sp.name='🪖 Tank';return sp;}
{const u0=useSpec;useSpec=function(sp){try{if(sp&&!sp.parts&&sp.style==='tank'&&(sp.kind==='car'||!sp.kind)&&!WS.open){return u0.call(this,newTankSpec());}}catch(e){}return u0.apply(this,arguments);};}
{const g0=startGame;startGame=function(){const r=g0.apply(this,arguments);try{if(SPEC&&!SPEC.parts&&SPEC.style==='tank')setTimeout(()=>{try{useSpec(newTankSpec());}catch(e){}},300);}catch(e){}return r;};}
