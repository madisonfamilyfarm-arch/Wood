// v72: the AI understands "DON'T…" — don't blow up Ace, leave Blaze alone, don't shoot me, quit shooting, don't follow me
const PROT={};   // pilot name -> protected until (ms)
{const f0=dzBotFire;dzBotFire=function(B,tg){try{const now=performance.now();for(const n in PROT){if(PROT[n]<now){delete PROT[n];continue;}const X=AIB.L.find(b=>pbName(b).toLowerCase()===n);if(X&&tg&&X.p&&tg.distanceTo(X.p)<4)return;}if(PROT.me>now&&tg&&tg.distanceTo(D.pos)<4)return;}catch(e){}return f0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));
  const NEG=/ (don t|dont|do not|never|stop|quit|no more|please don t|please dont|pls dont|cease|leave) /;
  const ACT=/(blow(ing)? (up|me up)|blow \w+ up|shoot(ing)?|attack(ing)?|kill(ing)?|hurt(ing)?|bomb(ing)?|chas(e|ing)|hunt(ing)?|target(ing)?|hit(ting)?|destroy(ing)?|fight(ing)?|nuk(e|ing)|rocket(ing)?|tnt|explod(e|ing)|blast(ing)?|go(ing)? after|alone)/;
  if(NEG.test(s)&&ACT.test(s)&&!/ (start|let s|lets|go) (shoot|attack|fight)/.test(s)){
    const names=AIB.L.map(b=>pbName(b).toLowerCase());const tgtN=names.filter(n=>new RegExp(' '+n+' ').test(s.replace(/^ \w+ (don t|dont|do not)/,' ')));
    // who is being told (first word a pilot name = the speaker's addressee) vs who is being protected
    const first=(s.trim().split(' ')[0]||'');const speaker=names.includes(first)?first:null;const prot=tgtN.filter(n=>n!==speaker||/ (blow up|shoot|attack|kill|hurt|leave) \w+ $/.test(s)&&s.trim().endsWith(n));
    const meT=/ (me|us|my drone|my plane|my tank|my car|myself) /.test(s)||(!prot.length);
    const now=performance.now();const B=(speaker&&AIB.L.find(b=>pbName(b).toLowerCase()===speaker))||aiNear(1e9)[0];
    if(prot.length){prot.forEach(n=>{PROT[n]=now+180000;const X=AIB.L.find(b=>pbName(b).toLowerCase()===n);AIB.L.forEach(b=>{try{if(b.hunt&&(b.hunt===X||b.hunt.B===X||b.hunt.name===(X&&X.name)||b.hunt.id===(X&&X.id))){b.hunt=null;b.huntCmd=false;}if(b.goal&&b.goal.kind==='chase'&&b.goal.B===X)b.goal=null;}catch(e){}});});
      if(B)sbSay({B},PICK(['Okay! Nobody blows up '+prot.map(n=>n[0].toUpperCase()+n.slice(1)).join(' or ')+' 🤝','Got it — '+prot.map(n=>n[0].toUpperCase()+n.slice(1)).join(' and ')+' is safe 🛡','Fine, I\'ll leave '+prot.map(n=>n[0].toUpperCase()+n.slice(1)).join(' and ')+' alone 😇']));return true;}
    if(meT){PROT.me=now+180000;if(/ (follow|chas)/.test(s)&&!/ (shoot|blow|attack|kill|bomb)/.test(s))return s0.call(this,'stop following me');try{s0.call(this,'stop shooting me');}catch(e){}return true;}}
  if(/^ (don t|dont|do not|stop|quit) (follow(ing)?|chasing) me $/.test(s))return s0.call(this,'stop');
}catch(e){}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
{const s0=smartHear;smartHear=function(){HEARING++;try{return s0.apply(this,arguments);}finally{HEARING--;}};}
