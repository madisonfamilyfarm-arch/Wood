// ================================================================ v58: 🌐 AI pilots in REAL multiplayer — they answer your friends too, and everybody sees what they say
// 1) whatever my AI pilots say goes to everyone in the room
{const c0=chatAdd;chatAdd=function(who,txt,col){const r=c0.apply(this,arguments);try{if(!chatAdd.remote&&typeof who==='string'&&/^🤖 /.test(who)&&mpOpen()&&AIB.L.some(B=>B.name===who))mpSend({t:'botchat',who,txt:String(txt).slice(0,200),col});}catch(e){}return r;};}
MPH.botchat=function(m,pe){chatAdd.remote=true;const f0=chatAdd.force;chatAdd.force=true;try{chatAdd(String(m.who||'🤖').slice(0,40)+' ('+pe.name+'\'s AI)',String(m.txt||'').slice(0,200),m.col);}finally{chatAdd.remote=false;chatAdd.force=f0;}};
// 2) a friend talks → MY AI pilots answer them (as if they were "me" for that message)
const PEERCTX={on:false,name:'',p:null};
{const n0=meName;meName=function(){return PEERCTX.on?PEERCTX.name:n0.apply(this,arguments);};}
{const d0=dzMe;dzMe=function(){if(PEERCTX.on&&PEERCTX.p)return PEERCTX.p.clone();return d0.apply(this,arguments);};}
{const h0=MPH.chat;MPH.chat=function(m,pe){const r=h0.apply(this,arguments);try{if(!AIB.L.length||!m.txt)return r;const t=String(m.txt);
    // only answer if the message is for the AI: it names one of my pilots, or nobody else in the room could answer
    const s=nNorm(t);const mine=AIB.L.some(B=>s.indexOf(' '+pbName(B).toLowerCase()+' ')>=0);const humans=Object.values(mp.peers).filter(x=>x.name&&!/^🤖/.test(x.name));
    if(!mine&&humans.length>1)return r;
    setTimeout(()=>{PEERCTX.on=true;PEERCTX.name=String(pe.name||'friend').replace(/ \(.*\)$/,'');PEERCTX.p=pe.p?pe.p.clone():null;const was=NLU.sync;NLU.sync=true;
      const g0=AIB.L.map(B=>B.goal&&B.goal.kind);try{smartHear(t);}catch(e){console.warn('peer hear',e);}finally{PEERCTX.on=false;NLU.sync=was;}
      AIB.L.forEach((B,i)=>{const g=B.goal&&B.goal.kind;if(g==='chase'&&g0[i]!=='chase'){B.folPeer=pe.id;B.folPeerT=performance.now()+90000;B.hunt=null;B.huntCmd=false;B.fol=null;}else if(g!=='chase')B.folPeer=null;});},350);}catch(e){}return r;};}
// 3) on a phone with NO AI pilots of its own, a message to someone else's AI shouldn't get answered by the campers
{const s0=smartHear;smartHear=function(txt){try{if(!AIB.L.length&&mpOpen()){const s=nNorm(String(txt||''));const remote=Object.values(mp.peers).some(pe=>pe.name&&/^🤖 /.test(pe.name)&&s.indexOf(' '+pe.name.replace(/^🤖 /,'').replace(/ \(.*\)$/,'').toLowerCase()+' ')>=0);if(remote)return true;}}catch(e){}return s0.apply(this,arguments);};}
// send an AI pilot somewhere whatever it's driving (drones/helis take off first)
function aiGoTo(B,x,z,h){if(B.kind==='drone'||B.kind==='heli'){if(B.mode!=='fly'&&B.mode!=='takeoff')B.mode='takeoff';B.goal={x,z,h:h||10,kind:'go'};B.t=20;}else if(B.kind==='plane')B.wp={x,z,alt:25};else B.wp={x,z};B.wpT=25;}
// following a FRIEND (not me): keep heading to their drone
setInterval(()=>{try{const now=performance.now();for(const B of AIB.L){if(!B.folPeer)continue;B.hunt=null;const pe=mp.peers[B.folPeer];if(!pe||!pe.p||now>B.folPeerT||B.dead){B.folPeer=null;continue;}
  aiGoTo(B,pe.p.x+Math.sin(B.i*2.1)*4,pe.p.z+Math.cos(B.i*2.1)*4,Math.max(3,pe.p.y-H(pe.p.x,pe.p.z)+1));}}catch(e){}},400);
// an AI pilot that's busy doing what someone asked doesn't randomly hop into another vehicle (that also teleported it home!)
{const a0=aiSwitch;aiSwitch=function(B,kind,why){try{if(B&&!kind&&!why&&(pbBusy(B)||(B.hunt&&B.huntCmd))){B.swT=30+Math.random()*30;return;}}catch(e){}return a0.apply(this,arguments);};}
// a friend joins the room → one of my AI pilots says hi to them (and goodbye when they leave)
{const c0=chatSys;chatSys=function(t){const r=c0.apply(this,arguments);try{const s=String(t||'');let m=s.match(/^👥 (.+) joined$/);if(m&&AIB.L.length&&!/^🤖/.test(m[1])){const nm=m[1];setTimeout(()=>{const B=pbAlive()[Math.floor(Math.random()*pbAlive().length)];if(B)pbSay(B,PICK(['Welcome, '+nm+'! 👋','Hey '+nm+'! Wanna battle? 😎','Yo '+nm+'! Race you! 🏁']),true);},2500);}
  m=s.match(/^👋 (.+) left/);if(m&&AIB.L.length&&!/^🤖/.test(m[1])){const nm=m[1];setTimeout(()=>{const B=pbAlive()[0];if(B)pbSay(B,PICK(['Bye '+nm+'! 👋','See ya, '+nm+'!']),true);},1500);}}catch(e){}return r;};}
