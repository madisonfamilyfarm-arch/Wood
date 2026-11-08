// v73: 🪖🛸 ready-made FLYING TANK — drives like a tank, tap 🛸 FLY to take off, 🪖 DRIVE to land and roll again
function ftankSpec(mode){openKit('ftank');const sp=wsSpec();closeWorkshop();sp.name='🪖🛸 Flying tank';sp.flyAs=mode==='fly'?'combo':'tank';sp.ftank=true;return sp;}
{const z0=sanitize;sanitize=function(s){const o=z0.apply(this,arguments);try{if(s&&s.ftank&&o)o.ftank=true;}catch(e){}return o;};}
function ftankGo(){try{if(menu.open)menuToggle(false);}catch(e){}try{if(WALK.on)walkToggle(false);}catch(e){}useSpec(ftankSpec('drive'));toast('🪖 Flying tank ready! Drive it like a tank — tap 🛸 FLY to take off',3500);ftankBtn();}
const FTK={landing:false};
function ftankToTank(){const p=D.pos.clone(),yaw=D.yaw;const sp=JSON.parse(JSON.stringify(SPEC));sp.flyAs='tank';sp.ftank=true;useSpec(sp);try{D.pos.copy(p);D.pos.y=H(p.x,p.z)+(ST.legs||0.2);D.yaw=yaw;D.vel.set(0,0,0);D.state='landed';}catch(e){}FTK.landing=false;toast('🪖 Landed — chute packed away. DRIVE mode!',2200);ftankBtn();}
function ftankSwitch(){if(!SPEC||!SPEC.ftank)return;const flying=SPEC.flyAs==='combo';
  if(!flying){const p=D.pos.clone(),yaw=D.yaw;const sp=JSON.parse(JSON.stringify(SPEC));sp.flyAs='combo';sp.ftank=true;useSpec(sp);try{D.pos.copy(p);D.yaw=yaw;}catch(e){}
    setTimeout(()=>{try{takeoff();}catch(e){}},150);toast('🛸 FLY mode — taking off like a drone. Left stick up = climb, Shift / 🚀 = jet boost. Tap 🪂 LAND to come down.',3500);ftankBtn();return;}
  // 🪂 LAND: motors off, the parachute pops out, it floats down, then the chute folds away and it's a tank again
  if(FTK.landing)return;const h=D.pos.y-H(D.pos.x,D.pos.z);if(h<2.5){ftankToTank();return;}
  FTK.landing=true;try{D.thrCut=true;}catch(e){}const c0=chuteCan;chuteCan=()=>true;try{if(!CHUTE.on)chuteToggle();}finally{chuteCan=c0;}toast('🪂 Parachute out — gliding down…',2500);ftankBtn();}
setInterval(()=>{try{if(FTK.landing&&SPEC&&SPEC.ftank){if(D.vel.y>-2.5&&D.pos.y-H(D.pos.x,D.pos.z)>1)D.vel.y=Math.min(D.vel.y,-2.5);const h=D.pos.y-H(D.pos.x,D.pos.z);if(h<1.2||D.state==='landed'||D.state==='down'||D.state==='tumble'&&h<2){try{chuteOff();}catch(e){}try{D.thrCut=false;}catch(e){}ftankToTank();}}}catch(e){}},150);
function ftankBtn(){let b=$('ftFly');const on=!!(SPEC&&SPEC.ftank)&&started&&!WALK.on;if(!b){b=document.createElement('button');b.id='ftFly';b.className='btn';b.style.cssText='position:fixed;right:calc(12px + env(safe-area-inset-right));top:calc(50% - 30px);z-index:15;font:900 17px system-ui,sans-serif;padding:12px 16px;border-radius:16px;border:2px solid #fff;background:#0a84ff;color:#fff;touch-action:manipulation;box-shadow:0 4px 14px #0006';
    b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();ftankSwitch();});document.body.appendChild(b);}
  b.style.display=on&&!(menu&&menu.open)&&!(WS&&WS.open)?'':'none';if(on){const flying=SPEC.flyAs==='combo';b.textContent=FTK.landing?'🪂 landing…':flying?'🪂 LAND':'🛸 FLY';b.style.background=flying?'#ff9f0a':'#0a84ff';}}
setInterval(ftankBtn,700);
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Real-size airliner/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem('🪖🛸 Flying tank (ready to go)',()=>ftankGo()));return L;};}
{const b0=buildItems;buildItems=function(){const L=b0();try{L.splice(1,0,mItem('🪖🛸 Flying tank — ready to drive + FLY',()=>{menuToggle(false);ftankGo();}));}catch(e){}return L;};}
try{for(const c of MCAT){if(c[0]==='games'){const g0=window['mCatItems'];}}}catch(e){}
{const g0=mCatItems;mCatItems=function(k){const L=g0.apply(this,arguments);try{if(k==='games'||k==='fly'){L.splice(1,0,mItem('🪖🛸 Flying tank (ready to go)',()=>ftankGo()));if(k==='games')L.splice(2,0,mItem('✈️ Real-size airliner',()=>airlinerGo()));}}catch(e){}return L;};}
