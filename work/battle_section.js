// =====================================================================================
// ===== ⚔️ BATTLE: shoot the other players (like a race, but you hunt each other) · ⭐ shared hangar =====
// =====================================================================================
const BATTLE={on:false,end:0,mode:'guns',score:{},lastSent:0};
function battleNames(){const n={};n[mp.id]=CFG.name;for(const id in mp.peers)n[id]=mp.peers[id].name;return n;}
function battleStart(dur,mode,fromNet,at){BATTLE.on=true;BATTLE.mode=mode||'guns';BATTLE.end=(at||Date.now())+dur*1000;BATTLE.score={};BATTLE.dur=dur;
  if(course){startCourse('free',true);}D.bDown=false;D.lastHit=null;if(D.state==='down'||D.state==='tumble'){quickFix(false);}
  shotMode='gun';wCur=0;updBadge();
  if(!fromNet)mpSend({t:'battle',op:'start',dur,mode:BATTLE.mode,at:BATTLE.end-dur*1000});
  toast(BATTLE.mode==='paint'?'🎨 PAINT BATTLE! Every paint hit = 1 point · '+Math.round(dur/60)+' min':'⚔️ BATTLE! Shoot the others down — each one you crash = 1 point · '+Math.round(dur/60)+' min',4000);chatSys('⚔️ Battle started ('+(BATTLE.mode==='paint'?'paint':'guns + rockets')+', '+Math.round(dur/60)+' min)');beep(880,0.3,0.1);}
function battleStop(fromNet,why){if(!BATTLE.on)return;BATTLE.on=false;$('battle').style.display='none';if(!fromNet)mpSend({t:'battle',op:'stop'});
  const nm=battleNames(),L=Object.entries(BATTLE.score).sort((a,b)=>b[1]-a[1]);const txt=L.length?L.map(([id,s])=>(nm[id]||'?')+' '+s).join(' · '):'nobody scored';
  const win=L.length&&(L.length<2||L[0][1]>L[1][1])?(nm[L[0][0]]||'?'):null;toast('🏁 Battle over! '+(win?'🏆 '+win+' wins! ':'')+txt,6000);chatSys('🏁 Battle over: '+txt);beep(1320,0.4,0.1);}
function battlePoint(id,n){BATTLE.score[id]=(BATTLE.score[id]||0)+(n||1);}
function battleNoteHit(byId,byName){if(byId&&byId!==mp.id)D.lastHit={id:byId,name:byName,t:performance.now()};}
function battleDown(){if(!BATTLE.on||D.bDown)return;D.bDown=true;const lh=D.lastHit;
  if(lh&&performance.now()-lh.t<8000&&BATTLE.mode!=='paint'){battlePoint(lh.id);mpSend({t:'battle',op:'kill',by:lh.id,who:mp.id});toast('💀 '+lh.name+' got you! Back in 3 s…',2500);}
  else toast('💥 Back in 3 s…',2000);
  setTimeout(()=>{if(!BATTLE.on){D.bDown=false;return;}quickFix(false);const a=Math.random()*Math.PI*2,r=20+Math.random()*40;resetDrone({x:Math.cos(a)*r,z:Math.sin(a)*r,yaw:a+Math.PI});
    if(vkind()==='drone'||vkind()==='heli'){D.armed=true;D.state='flying';D.pos.y+=6;}D.bDown=false;D.lastHit=null;D.shield=performance.now()+2500;toast('🛡 Back in! 2 s of shield',1500);},3000);}
function battleTick(){if(!BATTLE.on)return;const left=Math.max(0,(BATTLE.end-Date.now())/1000);if(left<=0){battleStop(true);return;}
  const el=$('battle'),nm=battleNames();el.style.display='block';const ids=Object.keys(nm);
  el.innerHTML=(BATTLE.mode==='paint'?'🎨 ':'⚔️ ')+fmt(left).replace(/\.\d$/,'')+' · '+ids.sort((a,b)=>(BATTLE.score[b]||0)-(BATTLE.score[a]||0)).map(id=>'<b style="color:'+(id===mp.id?'#ffd60a':'#fff')+'">'+esc(nm[id])+' '+(BATTLE.score[id]||0)+'</b>').join(' · ')+' <button class="x" onclick="battleStop()">✕</button>';}
setInterval(battleTick,250);
MPH.battle=function(m,pe){if(m.op==='start')battleStart(m.dur,m.mode,true,m.at);else if(m.op==='stop')battleStop(true);else if(m.op==='kill'){battlePoint(m.by);const nm=battleNames();chatSys('💥 '+(nm[m.by]||'someone')+' shot down '+(nm[m.who]||'someone'));}
  else if(m.op==='state'&&!BATTLE.on&&m.end>Date.now()){BATTLE.on=true;BATTLE.mode=m.mode;BATTLE.end=m.end;BATTLE.score=m.score||{};shotMode='gun';updBadge();toast('⚔️ A battle is on — join in!',2500);}};
function battleItems(){return[mInfo(()=>mpOpen()?'Everyone in the game plays. Your own weapons are used; if you have none you get a built-in machine gun + rockets (or paint).':'⚠ Battles are for multiplayer — join a game first (👥 Multiplayer).'),
  mItem('⚔️ Battle — guns + rockets, 3 minutes',()=>{menuToggle(false);battleStart(180,'guns');}),mItem('⚔️ Battle — guns + rockets, 5 minutes',()=>{menuToggle(false);battleStart(300,'guns');}),
  mItem('🎨 Paint battle (nothing breaks, every hit = 1 point), 3 minutes',()=>{menuToggle(false);battleStart(180,'paint');}),
  mItem('⏹ Stop the battle',()=>{battleStop();menuToggle(false);}),mItem('◀ Back',()=>menuBack())];}
// ---- ⭐ hangar: whatever anyone saves shows up in everyone's hangar (nobody is switched into it)
function hangarStore(list){LS.set('hangar',list);const sp=list[0];if(sp&&mpOpen())mpSend({t:'hangar',spec:sp});}
MPH.hangar=function(m,pe){if(!m.spec||!m.spec.name)return;let sp;try{sp=sanitize(m.spec);}catch(e){return;}sp.name=String(sp.name).replace(/ \(from .*\)$/,'').slice(0,20)+' (from '+pe.name+')';sp.name=sp.name.slice(0,40);
  const h=LS.get('hangar',[]).filter(x=>x.name!==sp.name);h.unshift(sp);LS.set('hangar',h.slice(0,40));chatSys('⭐ '+pe.name+' put "'+m.spec.name+'" in your hangar');};
