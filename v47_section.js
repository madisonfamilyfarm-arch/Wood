// ================================================================ v47: 🔊 REAL SOUND — every vehicle has its own engine (drone whine, heli chop, plane prop, car with gears + tires + skids, tank diesel + track clank, boat outboard, sub hum),
// wind, footsteps, guns, rockets, layered explosions (far = muffled + delayed), crashes, splashes, metal clangs, TNT fuse hiss, fire crackle, AI vehicles you can hear, birds by day + crickets at night.
const SFX={on:false,set:Object.assign({eng:100,fx:100,amb:60,ai:true,steps:true},LS.get('sfxSet',{}))};
function sfxSave(){LS.set('sfxSet',SFX.set);}
function sfxVol(){return (typeof CFG!=='undefined'?CFG.vol:100)/100;}
function sfxInit(){if(SFX.on)return;try{const A=beep.a||(beep.a=new (window.AudioContext||window.webkitAudioContext)());if(A.state==='suspended')A.resume();SFX.A=A;
  const comp=A.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=12;comp.ratio.value=5;comp.attack.value=0.004;comp.release.value=0.25;comp.connect(A.destination);
  const master=A.createGain();master.gain.value=1;master.connect(comp);SFX.master=master;
  // shared noise (made once — cheap on phones)
  const mk=(len,brown)=>{const b=A.createBuffer(1,A.sampleRate*len,A.sampleRate),d=b.getChannelData(0);let x=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;if(brown){x=(x+0.02*w)/1.02;d[i]=x*3.5;}else d[i]=w;}return b;};
  SFX.wn=mk(2,false);SFX.bn=mk(3,true);
  const loop=(buf)=>{const s=A.createBufferSource();s.buffer=buf;s.loop=true;s.start(0,Math.random()*1.5);return s;};
  const G=(v,to)=>{const g=A.createGain();g.gain.value=v;if(to)g.connect(to);return g;};const F=(type,f,q,to)=>{const x=A.createBiquadFilter();x.type=type;x.frequency.value=f;if(q!=null)x.Q.value=q;if(to)x.connect(to);return x;};const O=(type,f)=>{const o=A.createOscillator();o.type=type;o.frequency.value=f;o.start();return o;};
  SFX.G=G;SFX.F=F;SFX.O=O;SFX.loop=loop;
  // ---- the player's engine voice: 3 oscillators + noise → AM (chop / firing pulses) → low-pass → out
  const E={};E.out=G(0,master);E.lp=F('lowpass',1500,0.7,E.out);E.am=G(1,E.lp);E.amDepth=G(0,E.am.gain);E.lfo=O('sine',0);E.lfo.connect(E.amDepth);
  E.o1=O('sawtooth',120);E.g1=G(0.5,E.am);E.o1.connect(E.g1);E.o2=O('sawtooth',121);E.g2=G(0.3,E.am);E.o2.connect(E.g2);E.o3=O('sine',60);E.g3=G(0.3,E.am);E.o3.connect(E.g3);
  E.ns=loop(SFX.wn);E.nf=F('bandpass',900,0.9);E.ng=G(0.2,E.am);E.ns.connect(E.nf);E.nf.connect(E.ng);
  E.bs=loop(SFX.bn);E.bf=F('lowpass',300,0.7);E.bg=G(0,E.am);E.bs.connect(E.bf);E.bf.connect(E.bg);SFX.E=E;
  // ---- wind, tires, skid, tank tracks, water
  const W={};W.g=G(0,master);W.f=F('lowpass',400,0.5,W.g);loop(SFX.bn).connect(W.f);SFX.W=W;
  const T={};T.g=G(0,master);T.f=F('bandpass',700,0.6,T.g);loop(SFX.wn).connect(T.f);SFX.T=T;
  const S={};S.g=G(0,master);S.f=F('bandpass',1800,6,S.g);S.o=O('sawtooth',850);S.o2=O('sawtooth',913);S.o.connect(S.f);S.o2.connect(S.f);SFX.S=S;
  const K={};K.g=G(0,master);K.am=G(0,K.g);K.f=F('highpass',1800,0.7,K.am);loop(SFX.wn).connect(K.f);K.lfo=O('square',4);K.ld=G(0,K.am.gain);K.lfo.connect(K.ld);SFX.K=K;
  const Wa={};Wa.g=G(0,master);Wa.f=F('bandpass',500,0.5,Wa.g);loop(SFX.bn).connect(Wa.f);SFX.Wa=Wa;
  // ---- ambience bed + fuse hiss + fire crackle bed
  const Am={};Am.g=G(0,master);Am.f=F('lowpass',260,0.5,Am.g);loop(SFX.bn).connect(Am.f);SFX.Am=Am;
  const Fu={};Fu.g=G(0,master);Fu.f=F('highpass',3500,0.7,Fu.g);loop(SFX.wn).connect(Fu.f);SFX.Fu=Fu;
  const Fi={};Fi.g=G(0,master);Fi.f=F('bandpass',1400,0.6,Fi.g);loop(SFX.bn).connect(Fi.f);SFX.Fi=Fi;
  // ---- 2 voices for nearby AI vehicles / the train (with left-right panning)
  SFX.V=[0,1].map(()=>{const v={};v.out=G(0,master);v.pan=A.createStereoPanner?A.createStereoPanner():null;v.lp=F('lowpass',1200,0.7);if(v.pan){v.lp.connect(v.pan);v.pan.connect(v.out);}else v.lp.connect(v.out);
    v.am=G(1,v.lp);v.ad=G(0,v.am.gain);v.lfo=O('sine',0);v.lfo.connect(v.ad);v.o=O('sawtooth',150);v.og=G(0.5,v.am);v.o.connect(v.og);v.o2=O('sawtooth',151);v.og2=G(0.3,v.am);v.o2.connect(v.og2);v.n=loop(SFX.bn);v.ng=G(0,v.am);v.n.connect(v.ng);return v;});
  SFX.on=true;}catch(e){console.warn('sfx',e);}}
{const s0=sndInit;sndInit=function(){const r=s0.apply(this,arguments);sfxInit();return r;};}
addEventListener('pointerdown',()=>{try{if(SFX.A&&SFX.A.state==='suspended')SFX.A.resume();}catch(e){}},{passive:true});
document.addEventListener('visibilitychange',()=>{try{if(SFX.A){if(document.visibilityState==='visible')SFX.A.resume();else SFX.A.suspend();}}catch(e){}});
// ---------------------------------------------------------------- where a sound is: distance, delay (speed of sound), muffling, left/right
function sfxWhere(p){if(!p)return{g:1,delay:0,lp:20000,pan:0,d:0};const d=cam.position.distanceTo(p);const g=1/(1+d*0.035);const lp=clamp(18000/(1+d*0.03),500,18000);
  let pan=0;try{const v=p.clone().sub(cam.position).normalize();const r=new V3(1,0,0).applyQuaternion(cam.quaternion);pan=clamp(v.dot(r),-1,1)*0.85;}catch(e){}return{g,delay:Math.min(2,d/343),lp,pan,d};}
function sfxChain(w,vol){const A=SFX.A,t=A.currentTime+w.delay;const g=SFX.G(vol*w.g*sfxVol()*SFX.set.fx/100);const f=SFX.F('lowpass',w.lp,0.7);f.connect(g);let out=g;if(A.createStereoPanner){const p=A.createStereoPanner();p.pan.value=w.pan;g.connect(p);p.connect(SFX.master);}else g.connect(SFX.master);return{t,in:f,g};}
function sfxNoise(ch,t,dur,type,f0,f1,q,v0,brown){const A=SFX.A;const s=A.createBufferSource();s.buffer=brown?SFX.bn:SFX.wn;const f=SFX.F(type,f0,q);const g=SFX.G(0);s.connect(f);f.connect(g);g.connect(ch.in);
  if(f1!=null)f.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v0,t+0.004);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.start(t,Math.random()*1.0);s.stop(t+dur+0.05);}
function sfxTone(ch,t,dur,type,f0,f1,v0){const o=SFX.A.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=SFX.G(0);o.connect(g);g.connect(ch.in);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v0,t+0.005);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.start(t);o.stop(t+dur+0.05);}
// ---------------------------------------------------------------- one-shot sound effects
function sfx(type,p,k){if(!SFX.on||SFX.A.state!=='running')return;try{const w=sfxWhere(p);if(w.g<0.02&&type!=='boom')return;k=k||1;let ch;
  switch(type){
    case 'mg':ch=sfxChain(w,0.55);sfxNoise(ch,ch.t,0.05,'highpass',2200,null,0.7,0.9);sfxNoise(ch,ch.t,0.09,'lowpass',500,150,0.7,0.8,true);break;
    case 'rocket':ch=sfxChain(w,0.7);sfxNoise(ch,ch.t,0.65,'bandpass',300,3200,1.2,0.9);sfxNoise(ch,ch.t,0.25,'lowpass',260,80,0.7,0.9,true);sfxTone(ch,ch.t,0.4,'sawtooth',180,520,0.08);break;
    case 'paint':ch=sfxChain(w,0.5);sfxTone(ch,ch.t,0.08,'sine',700,180,0.7);sfxNoise(ch,ch.t,0.05,'bandpass',1500,null,1,0.3);break;
    case 'crash':ch=sfxChain(w,0.9*k);sfxNoise(ch,ch.t,0.35,'lowpass',380,90,0.8,1,true);sfxNoise(ch,ch.t+0.02,0.5,'bandpass',2600,900,1.5,0.35);for(let i=0;i<5;i++)sfxTone(ch,ch.t+0.05+i*0.06,0.08,'square',900+Math.random()*1800,null,0.05);break;
    case 'thump':ch=sfxChain(w,0.6*k);sfxNoise(ch,ch.t,0.18,'lowpass',260,70,0.8,0.9,true);break;
    case 'clang':ch=sfxChain(w,0.7);[523,1311,2413,3517].forEach((f,i)=>sfxTone(ch,ch.t,1.2-i*0.2,'sine',f*(0.97+Math.random()*0.06),null,0.25/(i+1)));sfxNoise(ch,ch.t,0.04,'highpass',3000,null,0.7,0.6);break;
    case 'chip':ch=sfxChain(w,0.5);sfxTone(ch,ch.t,0.12,'triangle',3100,2400,0.4);sfxTone(ch,ch.t+0.03,0.1,'triangle',4200,3600,0.25);break;
    case 'splash':ch=sfxChain(w,0.8*k);sfxNoise(ch,ch.t,0.7,'bandpass',2500,350,0.8,1);sfxNoise(ch,ch.t,0.25,'lowpass',500,120,0.8,0.7,true);break;
    case 'step':ch=sfxChain(w,0.35*k);sfxNoise(ch,ch.t,0.07,'lowpass',320,120,0.8,0.8,true);sfxNoise(ch,ch.t,0.09,'highpass',3500,null,0.7,0.12);break;
    case 'stepw':ch=sfxChain(w,0.4*k);sfxNoise(ch,ch.t,0.22,'bandpass',1400,500,0.9,0.7);break;
    case 'whoosh':ch=sfxChain(w,0.5*k);sfxNoise(ch,ch.t,0.5,'bandpass',600,2500,1,0.8);break;
    case 'freeze':ch=sfxChain(w,0.5);for(let i=0;i<7;i++)sfxTone(ch,ch.t+i*0.05,0.6,'sine',1800+i*420,null,0.12);break;
    case 'bubble':ch=sfxChain(w,0.3);sfxTone(ch,ch.t,0.08,'sine',400+Math.random()*500,1200+Math.random()*600,0.4);break;
    case 'chirp':{ch=sfxChain(w,0.12*SFX.set.amb/60);const b=2400+Math.random()*1800,n=2+Math.floor(Math.random()*5),s=0.06+Math.random()*0.06;for(let i=0;i<n;i++)sfxTone(ch,ch.t+i*s*1.6,s,'sine',b*(1+Math.random()*0.25),b*(1.3+Math.random()*0.3),0.6);break;}
    case 'cricket':{ch=sfxChain(w,0.07*SFX.set.amb/60);for(let i=0;i<3;i++)sfxTone(ch,ch.t+i*0.07,0.04,'sine',4400+Math.random()*200,null,0.6);break;}
    case 'crackle':ch=sfxChain(w,0.25*k);sfxNoise(ch,ch.t,0.015+Math.random()*0.03,'highpass',2000+Math.random()*3000,null,0.7,1);break;
    case 'click':ch=sfxChain(w,0.25);sfxTone(ch,ch.t,0.03,'square',1800,null,0.2);break;}}catch(e){}}
// layered explosion: sharp crack + deep body + long rumble. Size changes everything; far away = later, softer, more muffled.
function sfxBoom(p,r){if(!SFX.on||SFX.A.state!=='running')return;try{r=r||6;const w=sfxWhere(p);const big=clamp(Math.log2(1+r/6),0.6,5);const ch=sfxChain(w,Math.min(2.2,0.9*big));
    sfxNoise(ch,ch.t,0.06,'highpass',1200,null,0.7,w.d<r*4?1:0.4);
    sfxNoise(ch,ch.t,0.5+big*0.35,'lowpass',clamp(1200/big,160,900),45,0.9,1,true);
    sfxNoise(ch,ch.t+0.05,1.4+big*1.1,'lowpass',clamp(400/big,70,260),30,0.6,0.7,true);
    if(r>=12)for(let i=0;i<Math.min(10,3+r/8);i++)sfxNoise(ch,ch.t+0.3+Math.random()*(0.8+big*0.3),0.06+Math.random()*0.08,'bandpass',600+Math.random()*1600,null,1.2,0.25,true);}catch(e){}}
boomSound=function(dist,big){if(HIT.ctx)sfxBoom(HIT.ctx.p,HIT.ctx.r);else sfxBoom(null,big?30:6);};
// guns + rockets (yours, friends' and the AI's)
{const s0=spawnShot;spawnShot=function(w,p){const r=s0.apply(this,arguments);try{const now=performance.now();if(w==='mg'){if(now-(sfx.mgT||0)>45){sfx.mgT=now;sfx('mg',p);}}else if(w==='rocket')sfx('rocket',p);else if(w==='paint')sfx('paint',p);}catch(e){}return r;};}
// hits: tanks clang, everything else crunches; chipped props clink
{const b0=vhBreak;vhBreak=function(){const r=b0.apply(this,arguments);try{sfx(vhKind()==='tank'?'clang':'crash',D.pos,0.6);}catch(e){}return r;};}
{const s0=setPropState;setPropState=function(P,st){const r=s0.apply(this,arguments);try{if(st==='chip'||st==='none')sfx('chip',D.pos);}catch(e){}return r;};}
// freeze / shockwave / smoke / party get their own sounds
{const f0=tntFxK;tntFxK=function(k,p,r){const res=f0.apply(this,arguments);try{if(k==='freeze')sfx('freeze',p);else if(k==='shock'){sfxBoom(p,r*0.4);sfx('whoosh',p,1.5);}else if(k==='smoke')sfx('whoosh',p,0.8);}catch(e){}return res;};}
// ---------------------------------------------------------------- every frame: engines, wind, tires, skids, tracks, water, fuse, fire, AI vehicles, footsteps, crashes, splashes
const SFXS={state:'',wet:false,stepD:0,last:new V3(),amb:0,water:0,waterT:0,ai:[null,null]};
function sfxGear(sp){const G=[0,7,14,23,33,46,62];let i=0;while(i<G.length-2&&sp>G[i+1])i++;const u=clamp((sp-G[i])/(G[i+1]-G[i]),0,1);return 0.28+0.72*u-(i?0:0.1);}
function sfxEngine(dt){const E=SFX.E,A=SFX.A,t=A.currentTime,k=WALK.on?'walk':vhKind(),fly=D.state==='flying'||D.state==='takeoff',sp=Math.hypot(D.vel.x,D.vel.z),air=D.vel.length();
  let thr=0,f=120,lp=1500,ng=0.2,bg=0,am=0,amHz=0,o2k=1.007,g2=0.3,o3k=0.5,g3=0.3,vol=0.5,nf=900;
  const alive=!(D.state==='tumble'||D.state==='down')&&(fly||D.armed)&&started&&!menu.open&&CFG.engSnd!==false&&!(typeof DZ!=='undefined'&&DZ.dead);
  if(k==='walk'||!alive)thr=0;
  else if(k==='drone'||k==='combo'){const I=WALK.inp||Z0;thr=fly?clamp(0.45+Math.abs(I.ly)*0.35+Math.hypot(I.rx,I.ry)*0.25,0,1):0.15;const sz=clamp((ST.L||0.3)/0.3,0.4,3);f=(150+300*thr)/Math.sqrt(sz);o2k=1.012;g2=0.45;o3k=2;g3=0.12;lp=1400+thr*4200;ng=0.22;nf=f*3;vol=0.5;}
  else if(k==='heli'){thr=fly?clamp(0.55+Math.abs(D.vel.y)*0.06+sp*0.01,0,1):0.3;f=55+thr*20;o2k=2.01;g2=0.15;o3k=22;g3=0.05;lp=380+thr*500;ng=0.1;nf=1200;bg=1.1;am=SPEC&&SPEC.style==='blimp'?0:0.85;amHz=(11+thr*5);vol=0.7;}
  else if(k==='plane'){thr=clamp(D.thr||0,0,1);const fir=38+thr*120;f=fir;o2k=2;g2=0.35;o3k=0.5;g3=0.4;lp=700+thr*2600;ng=0.12;nf=fir*6;am=0.35;amHz=fir/2;vol=0.7;}
  else if(k==='car'||k==='monster'){const rpm=D.armed?clamp(sfxGear(sp)+(Math.abs((WALK.inp||Z0).ly)>0.3?0.08:0),0.2,1.05):0;thr=rpm;f=45+rpm*175;o2k=2;g2=0.35;o3k=0.5;g3=0.35;lp=650+rpm*2600;ng=0.05;nf=f*4;am=0.3;amHz=f/2;vol=0.42;}
  else if(k==='tank'){const rpm=D.armed?clamp(0.3+sp/12,0.3,1):0;thr=rpm;f=26+rpm*50;o2k=1.5;g2=0.45;o3k=0.5;g3=0.5;lp=320+rpm*700;ng=0.04;bg=0.8;am=0.45;amHz=f/2;vol=0.75;}
  else if(k==='boat'){thr=D.armed?0.15+clamp(sp/Math.max(1,ST.top||10),0,1)*0.85:0;f=70+thr*240;o2k=2;g2=0.4;o3k=0.5;g3=0.2;lp=900+thr*2400;ng=0.12;nf=f*5;am=0.4;amHz=f;vol=0.5;}
  else if(k==='sub'){thr=D.armed?0.3+clamp(air/6,0,0.7):0;f=40+thr*35;o2k=3;g2=0.15;o3k=0.5;g3=0.6;lp=240+thr*200;ng=0.05;bg=0.6;vol=0.6;}
  const near=clamp(3/(1+cam.position.distanceTo(D.pos)*0.22),0,1);const g=thr>0.01?vol*near*(0.35+0.65*thr)*sfxVol()*SFX.set.eng/100*0.42:0;
  E.out.gain.setTargetAtTime(g,t,0.08);E.o1.frequency.setTargetAtTime(f,t,0.05);E.o2.frequency.setTargetAtTime(f*o2k,t,0.05);E.o3.frequency.setTargetAtTime(f*o3k,t,0.05);E.g2.gain.setTargetAtTime(g2,t,0.1);E.g3.gain.setTargetAtTime(g3,t,0.1);
  E.lp.frequency.setTargetAtTime(lp,t,0.08);E.ng.gain.setTargetAtTime(ng,t,0.1);E.nf.frequency.setTargetAtTime(Math.min(8000,nf),t,0.1);E.bg.gain.setTargetAtTime(bg,t,0.1);E.bf.frequency.setTargetAtTime(k==='heli'?260:180,t,0.2);
  E.lfo.frequency.setTargetAtTime(amHz,t,0.05);E.amDepth.gain.setTargetAtTime(am,t,0.1);
  // the old single-tone engine is replaced
  if(typeof SND!=='undefined'&&SND.on)SND.out.gain.setTargetAtTime(0,t,0.05);
  // wind grows with air speed (louder in fast planes / dives)
  const ws=(k==='walk'?0:air);const wv=clamp((ws-4)/40,0,1);SFX.W.g.gain.setTargetAtTime(alive&&(fly||k==='plane')?Math.pow(wv,1.5)*0.6*sfxVol():0,t,0.15);SFX.W.f.frequency.setTargetAtTime(250+wv*1800,t,0.2);
  // tires + skid (cars) · tracks clank (tank)
  const ground=(k==='car'||k==='monster'||k==='tank')&&alive;const tg=ground?clamp(sp/25,0,1)*0.22*sfxVol():0;SFX.T.g.gain.setTargetAtTime(tg,t,0.1);SFX.T.f.frequency.setTargetAtTime(300+sp*25,t,0.2);
  let slip=0;if(ground&&k!=='tank'&&sp>4){const fx=-Math.sin(D.yaw),fz=-Math.cos(D.yaw);slip=Math.abs(D.vel.x*fz-D.vel.z*fx);}SFX.S.g.gain.setTargetAtTime(slip>3.5?clamp((slip-3.5)/8,0,1)*0.12*sfxVol():0,t,0.05);
  SFX.K.g.gain.setTargetAtTime(k==='tank'&&alive?clamp(sp/6,0,1)*0.35*sfxVol():0,t,0.1);SFX.K.lfo.frequency.setTargetAtTime(1.5+sp*2.2,t,0.1);SFX.K.ld.gain.setTargetAtTime(k==='tank'?0.5:0,t,0.1);
  // water (boats moving, subs underwater)
  const wet=(k==='boat'||k==='sub')&&alive;SFX.Wa.g.gain.setTargetAtTime(wet?clamp(0.05+sp/20,0,1)*0.3*sfxVol():0,t,0.15);SFX.Wa.f.frequency.setTargetAtTime(k==='sub'?220:400+sp*30,t,0.2);
  if(k==='sub'&&alive&&Math.random()<dt*1.5)sfx('bubble',D.pos.clone().add(new V3((Math.random()-0.5)*2,1,(Math.random()-0.5)*2)));}
function sfxEvents(dt){const k=WALK.on?'walk':vhKind();
  // crash / hard landing / splash
  const st=D.state;if(st!==SFXS.state){if((st==='tumble'||st==='down')&&SFXS.state!=='tumble'&&SFXS.state!=='down')sfx('crash',D.pos,clamp(D.vel.length()/8,0.5,1.6));else if(st==='landed'&&SFXS.state==='flying')sfx('thump',D.pos,0.7);SFXS.state=st;}
  const me=dzMe()||D.pos;const inW=inWater(me.x,me.z)&&me.y<WATER_Y+0.2;if(inW&&!SFXS.wet&&k!=='boat'&&k!=='sub')sfx('splash',me,clamp(Math.abs(D.vel.y)/6+0.5,0.5,1.6));SFXS.wet=inW;
  // footsteps
  if(WALK.on&&SFX.set.steps){const d=Math.hypot(me.x-SFXS.last.x,me.z-SFXS.last.z);if(d<5)SFXS.stepD+=d;const stride=Math.abs((WALK.inp||Z0).ly)>0.92?1.25:0.75;if(SFXS.stepD>stride){SFXS.stepD=0;sfx(inW?'stepw':'step',me.clone().add(new V3(0,-1.5,0)),0.9+Math.random()*0.2);}}
  SFXS.last.copy(me);}
function sfxWorld(dt){const t=SFX.A.currentTime,v=sfxVol();
  // TNT fuse hiss (loudest nearby fuse)
  let fz=0;for(const T of TNTS){const d=cam.position.distanceTo(T.p);fz=Math.max(fz,1/(1+d*0.15));}SFX.Fu.g.gain.setTargetAtTime(fz*0.08*v,t,0.05);
  // fire crackle
  let fi=0;if(typeof FIRE!=='undefined')for(const F of FIRE.L){const d=Math.hypot(cam.position.x-F.x,cam.position.z-F.z);fi=Math.max(fi,1/(1+d*0.05));}SFX.Fi.g.gain.setTargetAtTime(fi*0.12*v,t,0.2);if(fi>0.15&&Math.random()<dt*fi*25)sfx('crackle',null,fi);
  // ambience: gentle outdoor wind bed, birds by day, crickets at night, water lapping by the lake
  const amb=SFX.set.amb/100;SFX.Am.g.gain.setTargetAtTime(started&&!menu.open?0.05*amb*v:0,t,0.5);const h=todHour();SFXS.amb-=dt;
  if(SFXS.amb<=0&&started&&amb>0){SFXS.amb=1+Math.random()*3.5;const p=cam.position.clone().add(new V3((Math.random()-0.5)*60,6+Math.random()*10,(Math.random()-0.5)*60));if(h>5.5&&h<19.5){if(Math.random()<0.7)sfx('chirp',p);}else sfx('cricket',p);}
  SFXS.waterT-=dt;if(SFXS.waterT<=0){SFXS.waterT=1;let w=0;const c=cam.position;for(let i=0;i<8;i++){const a=i/8*6.28;for(const r of [8,20]){if(inWater(c.x+Math.cos(a)*r,c.z+Math.sin(a)*r))w=Math.max(w,r===8?1:0.5);}}SFXS.water=w;}
  if(vhKind()!=='boat'&&vhKind()!=='sub'){SFX.Wa.g.gain.setTargetAtTime(SFXS.water*0.06*amb*v,t,0.5);SFX.Wa.f.frequency.setTargetAtTime(350,t,0.5);}}
// nearby AI vehicles (and the train) — the 2 closest get a voice with left/right panning
function sfxAI(dt){const t=SFX.A.currentTime,v=sfxVol();const C=[];if(SFX.set.ai){for(const B of AIB.L){if(B.dead)continue;const d=cam.position.distanceTo(B.p);if(d<70)C.push({p:B.p,k:B.kind,d,sp:B.v?B.v.length():8});}
    try{if(typeof TRAIN!=='undefined'&&TRAIN.mesh&&!TRAIN.derailed){const p=TRAIN.mesh.position,d=cam.position.distanceTo(p);if(d<90)C.push({p,k:'train',d,sp:Math.abs(TRAIN.v||6)});}}catch(e){}}
  C.sort((a,b)=>a.d-b.d);SFX.V.forEach((V,i)=>{const c=C[i];if(!c){V.out.gain.setTargetAtTime(0,t,0.2);return;}const w=sfxWhere(c.p);let f=200,am=0,amHz=0,lp=1500,ng=0,o2=1.01,vol=0.35;
    if(c.k==='drone'){f=230+c.sp*8;lp=3000;o2=1.013;vol=0.3;}else if(c.k==='heli'){f=60;am=0.85;amHz=13;lp=450;ng=1;vol=0.5;}else if(c.k==='plane'){f=50+c.sp*2;am=0.3;amHz=f/2;lp=1400;vol=0.5;}
    else if(c.k==='car'){f=60+sfxGear(c.sp)*160;am=0.3;amHz=f/2;lp=1200;vol=0.35;}else if(c.k==='boat'){f=90+c.sp*10;am=0.4;amHz=f;lp=1500;vol=0.35;}else if(c.k==='sub'){f=45;lp=250;vol=0.3;}else if(c.k==='train'){f=34;am=0.6;amHz=1.2+c.sp*0.5;lp=500;ng=0.8;vol=0.6;}
    V.o.frequency.setTargetAtTime(f,t,0.1);V.o2.frequency.setTargetAtTime(f*o2,t,0.1);V.lp.frequency.setTargetAtTime(Math.min(lp,w.lp),t,0.1);V.lfo.frequency.setTargetAtTime(amHz,t,0.1);V.ad.gain.setTargetAtTime(am,t,0.1);V.ng.gain.setTargetAtTime(ng,t,0.1);
    if(V.pan)V.pan.pan.setTargetAtTime(w.pan,t,0.1);V.out.gain.setTargetAtTime(started&&!menu.open?vol*w.g*1.4*v*SFX.set.eng/100:0,t,0.15);});}
{const t0=tickSound;tickSound=function(dt){if(!SFX.on)return t0.apply(this,arguments);try{sfxEngine(dt);sfxEvents(dt);sfxWorld(dt);sfxAI(dt);}catch(e){if(!sfxEngine.err){sfxEngine.err=1;console.warn('sfx tick',e);}}};}
// a soft tick on menu taps
{const r0=renderMenu;renderMenu=function(){const r=r0.apply(this,arguments);try{if(menu.open)sfx('click');}catch(e){}return r;};}
// ---------------------------------------------------------------- 🔊 Sound menu
function sfxItems(){return[mInfo('🔊 Sound — every vehicle, weapon and place has its own sounds now.'),
  mRange('🔊 Master volume',()=>CFG.vol,v=>{CFG.vol=v;saveCfg();},0,200,10,v=>v?v+'%':'muted'),
  mRange('🚁 Engines',()=>SFX.set.eng,v=>{SFX.set.eng=v;sfxSave();},0,200,10,v=>v?v+'%':'off'),
  mRange('💥 Guns + explosions + effects',()=>SFX.set.fx,v=>{SFX.set.fx=v;sfxSave();},0,200,10,v=>v?v+'%':'off'),
  mRange('🌲 Nature (birds, crickets, wind, water)',()=>SFX.set.amb,v=>{SFX.set.amb=v;sfxSave();},0,200,10,v=>v?v+'%':'off'),
  mItem(()=>'🤖 Hear AI vehicles + the train: '+(SFX.set.ai?'ON':'off'),()=>{SFX.set.ai=!SFX.set.ai;sfxSave();}),
  mItem(()=>'👣 Footsteps: '+(SFX.set.steps?'ON':'off'),()=>{SFX.set.steps=!SFX.set.steps;sfxSave();}),
  mItem(()=>'🔊 Engine sound: '+(CFG.engSnd!==false?'ON':'off'),()=>{CFG.engSnd=CFG.engSnd===false;saveCfg();}),
  mItem('▶ Test: explosion (near → far)',()=>{const p=cam.position.clone();[3,40,200].forEach((d,i)=>setTimeout(()=>sfxBoom(p.clone().add(new V3(d,0,0)),8),i*1500));}),
  mItem('▶ Test: machine gun · rocket · clang · splash',()=>{const p=cam.position.clone().add(new V3(4,0,0));for(let i=0;i<6;i++)setTimeout(()=>sfx('mg',p),i*90);setTimeout(()=>sfx('rocket',p),800);setTimeout(()=>sfx('clang',p),1700);setTimeout(()=>sfx('splash',p),2600);}),
  mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(x=>/Smoothness/.test(String(x.label())));L.splice(i>=0?i+1:4,0,mItem('🔊 Sound ▸',()=>menuPush('🔊 Sound',sfxItems())));return L;};}
