// ================================================================ v40: 🛡 ARMOR + realistic damage. A tank takes a bunch of hits (cracked camera, slower, broken track…) — only a MASSIVE blast kills it in one go. Every vehicle breaks its own way.
Object.assign(DMG,{
  track:{n:'🪖 Track broken',fix:'🪖 Put the track back on',hold:'HOLD to fix the track',msg:'🪖 A track broke — it pulls to one side and goes slower!'},
  tire:{n:'🛞 Flat tire',fix:'🛞 Change the tire',hold:'HOLD to change the tire',msg:'🛞 Flat tire — it pulls to one side!'},
  engine:{n:'🔥 Engine damaged',fix:'🔧 Fix the engine',hold:'HOLD to fix the engine',msg:'🔥 Engine hit — it\'s smoking and slower!'},
  wing:{n:'🪽 Wing damaged',fix:'🪽 Patch the wing',hold:'HOLD to patch the wing',msg:'🪽 Wing hit — it keeps rolling to one side!'},
  leak:{n:'💧 Leaking',fix:'🩹 Plug the leak',hold:'HOLD to plug the leak',msg:'💧 It\'s leaking — sitting lower and slower!'},
  turret:{n:'🎯 Turret jammed',fix:'🎯 Unjam the turret',hold:'HOLD to unjam the turret',msg:'🎯 Turret jammed — shooting is slower!'}});
const VHP={tank:120,car:45,monster:60,boat:45,sub:55,plane:30,heli:30,drone:22,combo:40,walk:0};
const VBREAK={tank:['cam','track','engine','turret','ant'],car:['tire','cam','engine','ant'],monster:['tire','cam','engine','ant'],boat:['leak','cam','engine'],sub:['leak','cam','engine'],plane:['wing','engine','cam'],heli:['motor','cam','frame','ant'],drone:['motor','cam','frame','ant','gps'],combo:['motor','cam','frame','engine']};
function vhKind(){const k=vkind();if(k==='car'&&SPEC&&(SPEC.flyAs==='tank'||SPEC.kit==='tank'||(SPEC.parts||[]).filter(p=>p.style==='tread').length>=2))return'tank';if(k==='car'&&SPEC&&SPEC.kit==='monster')return'monster';if(SPEC&&SPEC.flyAs==='sub')return'sub';return VHP[k]?k:'drone';}
function vhArmor(){const a=SPEC&&SPEC.armor!=null?SPEC.armor:(vhKind()==='tank'?8:5);const plates=SPEC&&SPEC.parts?SPEC.parts.filter(p=>p.t==='shape'&&p.mat==='metal').length:0;return clamp(0.55+a*0.09+plates*0.05,0.6,2.2);}
const VH={hp:0,max:0,sig:''};
function vhReset(){VH.max=Math.round((VHP[vhKind()]||22)*vhArmor());VH.hp=VH.max;VH.sig=vhKind()+':'+(SPEC&&SPEC.name);vhBar();}
function vhBar(){let b=$('vhBar');if(!b){b=document.createElement('div');b.id='vhBar';b.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:calc(84px + env(safe-area-inset-top));z-index:21;background:rgba(0,0,0,0.6);border-radius:10px;padding:3px 8px;font:800 12px system-ui;color:#fff;display:none;pointer-events:none;min-width:130px;text-align:center';document.body.appendChild(b);}
  if(!VH.max||VH.hp>=VH.max||WALK.on){b.style.display='none';return;}const f=VH.hp/VH.max,col=f>0.6?'#34c759':f>0.3?'#ffd60a':'#ff3b30';b.style.display='block';
  b.innerHTML='🛡 '+Math.round(f*100)+'% <div style="height:5px;background:#333;border-radius:3px;margin-top:2px"><div style="height:5px;width:'+Math.round(f*100)+'%;background:'+col+';border-radius:3px"></div></div>';}
{const r0=rebuildDrone;rebuildDrone=function(){const r=r0.apply(this,arguments);try{vhReset();}catch(e){}return r;};}
{const r0=dzRespawn;dzRespawn=function(){const r=r0.apply(this,arguments);try{vhReset();}catch(e){}return r;};}
{const q0=quickFix;quickFix=function(){const r=q0.apply(this,arguments);try{vhReset();}catch(e){}return r;};}
setTimeout(()=>{try{vhReset();}catch(e){}},2500);
// how hard a blast hits you: big blasts + close = lots of damage
const HIT={ctx:null};
{const e0=explode;explode=function(p,r,dr,own,byName,byId){const was=HIT.ctx;HIT.ctx={p:p.clone?p.clone():new V3().copy(p),r:Math.max(0.5,r||4),by:byName,id:byId};try{return e0.apply(this,arguments);}finally{HIT.ctx=was;}};}
function vhBlastDmg(){const c=HIT.ctx;if(!c)return 999;const me=dzMe()||D.pos;const d=me.distanceTo(c.p),k=clamp(1-0.65*d/c.r,0.25,1);
  // MASSIVE blasts (4× a normal rocket or more) wreck anything that's in the middle of them
  if(c.r>=24&&d<c.r*0.6)return 9999;return c.r*4*k;}
function vhBreak(n,quiet){const pool=(VBREAK[vhKind()]||VBREAK.drone).filter(k=>!(D.dmg&&D.dmg[k]));const got=[];
  while(n-->0&&pool.length){const k=pool.splice(Math.floor(Math.random()*pool.length),1)[0];if(k==='motor'){const L=(DR&&DR.props||[]).filter(P=>P.state==='ok'||P.state==='chip');if(L.length){try{setPropState(L[Math.floor(Math.random()*L.length)],'chip');}catch(e){}}}
    if(dmgAdd(k,true))got.push(k);}
  if(got.length&&!quiet)toast('💥 '+got.map(k=>DMG[k].n).join(' + '),2600);if(got.includes('track')||got.includes('tire'))D.pull=(Math.random()<0.5?-1:1);if(got.includes('wing'))D.rollBias=(Math.random()<0.5?-1:1);return got;}
// a blast that would have "killed" you now does damage instead — unless it's big enough
{const z0=dzDie;dzDie=function(txt,byId,byName){if(HIT.ctx&&!WALK.on&&DR&&VH.max&&/Blown up/.test(String(txt))&&!DZ.dead&&!(D.shield>performance.now())){
      if(VH.sig!==vhKind()+':'+(SPEC&&SPEC.name))vhReset();const dmg=vhBlastDmg();VH.hp-=dmg;
      if(VH.hp>0){const f=dmg/VH.max;vhBreak(f>0.35?2:f>0.12?1:(Math.random()<0.5?1:0));shake=Math.max(shake,0.6);beep(180,0.15,0.08);vhBar();
        try{puff(D.pos.clone(),0x444444,0.6,1.5);if(typeof sparks==='function')sparks(D.pos,0xffaa44);}catch(e){}
        const k=vhKind();toast((k==='tank'?'🛡 The armor held! ':'💥 Hit! ')+Math.round(VH.hp/VH.max*100)+'% left',1800);return;}
      VH.hp=0;vhBar();}
    return z0.apply(this,arguments);};}
// machine guns barely scratch a tank, chip away at everything else
{const g0=gotHit;gotHit=function(m,pe){const k=vhKind();if(m&&m.w==='mg'&&WPN.dmg&&DR&&!WALK.on&&k!=='drone'&&k!=='heli'){if(VH.sig!==k+':'+(SPEC&&SPEC.name))vhReset();VH.hp-=k==='tank'?0.4:1.6/vhArmor();sparks(D.pos,0xffdd66);beep(260,0.05,0.06);
      if(Math.random()<(k==='tank'?0.03:0.12))vhBreak(1);vhBar();if(VH.hp<=0&&DZ.on)dzDie('Shot down by '+(pe&&pe.name||'someone')+'!',pe&&pe.id,pe&&pe.name);return;}return g0.apply(this,arguments);};}
// what the damage does while you drive / fly
{const t0=tickDrone;tickDrone=function(dt,inp){const r=t0.apply(this,arguments);try{const g=D.dmg||{};if(WALK.on||!DR||D.state==='down')return r;const sp=Math.hypot(D.vel.x,D.vel.z);
    let slow=1;if(g.engine)slow*=0.65;if(g.track)slow*=0.55;if(g.tire)slow*=0.75;if(g.leak)slow*=0.7;
    if(slow<1&&sp>1){const k=1-(1-slow)*dt*2.2;D.vel.x*=k;D.vel.z*=k;}
    if((g.track||g.tire)&&sp>1.2)D.yaw+=(D.pull||1)*dt*(g.track?0.5:0.3)*Math.min(1,sp/6);
    if(g.wing&&vkind()==='plane'&&D.state==='flying')D.roll=(D.roll||0)+(D.rollBias||1)*dt*0.35;
    if(g.leak){if(vhKind()==='sub')D.vel.y-=dt*0.5;else if(vkind()==='boat'&&Math.random()<dt*2)try{puff(D.pos.clone(),0x9fd3ff,0.3,1);}catch(e){}}
    if(g.engine&&Math.random()<dt*5)try{puff(D.pos.clone().add(new V3(0,0.4,0)),0x333333,0.4,1.6);}catch(e){}}catch(e){}return r;};}
// a jammed turret shoots slower
{const f0=fire;fire=function(){if(D.dmg&&D.dmg.turret){const now=performance.now();if(now-(fire.jt||0)<900)return;fire.jt=now;}return f0.apply(this,arguments);};}
// fixing a part gives back some health; fixing everything = full
{const f0=dmgFix;dmgFix=function(k){const r=f0.apply(this,arguments);try{VH.hp=Math.min(VH.max,VH.hp+VH.max*0.25);if(!dmgAny())VH.hp=VH.max;vhBar();}catch(e){}return r;};}
{const c0=dmgClear;dmgClear=function(){const r=c0.apply(this,arguments);try{VH.hp=VH.max;vhBar();}catch(e){}return r;};}
// ---------------------------------------------------------------- 🤖 AI vehicles have armor too (a rocket won't always finish an AI tank)
{const b0=dzBotDie;dzBotDie=function(B,txt){if(HIT.ctx&&B&&!B.dead){const hp0=VHP[B.kind==='car'&&B.tank?'tank':B.kind]||22;if(B.hpMax==null){B.hpMax=hp0;B.hp=hp0;}
    const d=B.p.distanceTo(HIT.ctx.p),dmg=HIT.ctx.r*4*clamp(1-0.65*d/HIT.ctx.r,0.25,1);B.hp-=dmg;if(B.hp>0){try{sparks(B.p,0xffaa44);puff(B.p.clone(),0x444444,0.5,1.4);}catch(e){}B.say=PICK(['Ouch! 😵','I\'m hit!','That one stung!','Still going! 💪']);return;}B.hpMax=null;}
  return b0.apply(this,arguments);};}
setInterval(()=>{try{for(const B of AIB.L){if(!B.dead&&B.hpMax&&B.hp<B.hpMax)B.hp=Math.min(B.hpMax,B.hp+B.hpMax*0.03);}}catch(e){}},2000);
