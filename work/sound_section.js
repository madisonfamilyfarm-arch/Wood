// ---------------------------------------------------------------- 🔊 engine sound: drone buzz, plane engine, heli chop, car whine — louder close up, pitch follows the throttle
const SND={on:false};
function sndInit(){if(SND.on)return;try{const A=beep.a||(beep.a=new (window.AudioContext||window.webkitAudioContext)());if(A.state==='suspended')A.resume();
  const out=A.createGain();out.gain.value=0;out.connect(A.destination);const lp=A.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;lp.connect(out);
  const o1=A.createOscillator(),o2=A.createOscillator(),g1=A.createGain(),g2=A.createGain();o1.type='sawtooth';o2.type='square';g1.gain.value=0.5;g2.gain.value=0.18;o1.connect(g1);o2.connect(g2);g1.connect(lp);g2.connect(lp);
  const len=A.sampleRate*2,nb=A.createBuffer(1,len,A.sampleRate),d=nb.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const ns=A.createBufferSource();ns.buffer=nb;ns.loop=true;const nf=A.createBiquadFilter();nf.type='bandpass';nf.frequency.value=900;nf.Q.value=0.8;const ng=A.createGain();ng.gain.value=0.25;ns.connect(nf);nf.connect(ng);ng.connect(lp);
  const chop=A.createGain();chop.gain.value=1;lp.disconnect();lp.connect(chop);chop.connect(out);const lfo=A.createOscillator(),lg=A.createGain();lfo.frequency.value=0;lg.gain.value=0;lfo.connect(lg);lg.connect(chop.gain);
  o1.start();o2.start();ns.start();lfo.start();Object.assign(SND,{on:true,A,out,lp,o1,o2,nf,ng,lfo,lg});}catch(e){}}
function tickSound(dt){if(!SND.on||!DR)return;const A=SND.A,t=A.currentTime,k=vkind(),fly=D.state==='flying'||D.state==='takeoff';let thr=0,base=200,span=200,noise=0.25,chopHz=0,vol=0.5;
  if(D.state==='tumble'||D.state==='down'||!(fly||D.armed)){thr=0;}
  else if(k==='plane'){thr=D.thr;base=55;span=110;noise=0.15;vol=0.7;}
  else if(k==='heli'){thr=fly?0.6+Math.abs(D.vel.y)*0.05:0.25;base=90;span=70;noise=0.5;chopHz=SPEC.style==='blimp'?0:12+thr*10;vol=0.6;}
  else if(k==='car'){const sp=Math.hypot(D.vel.x,D.vel.z);thr=D.armed?0.05+clamp(sp/Math.max(1,ST.top),0,1):0;base=120;span=900;noise=0.05;vol=0.35;}
  else if(k==='boat'){const sp=Math.hypot(D.vel.x,D.vel.z);thr=0.1+clamp(sp/Math.max(1,ST.top),0,1);base=80;span=260;noise=0.35;vol=0.45;}
  else{const I=WALK.inp||Z0;thr=fly?clamp(0.45+Math.abs(I.ly)*0.35+Math.hypot(I.rx,I.ry)*0.25,0,1):(D.armed?0.18:0);const sz=clamp((ST.L||0.3)/0.3,0.4,3);base=260/Math.sqrt(sz);span=260/Math.sqrt(sz);noise=0.3;vol=0.5;}
  const on=thr>0.01&&!menu.open&&started,dist=cam.position.distanceTo(D.pos),near=clamp(3/(1+dist*0.25),0,1);
  const g=on?vol*near*(0.35+0.65*thr)*CFG.vol/100*0.35:0,f=base+span*thr;
  SND.out.gain.setTargetAtTime(g,t,0.08);SND.o1.frequency.setTargetAtTime(f,t,0.06);SND.o2.frequency.setTargetAtTime(f*1.503,t,0.06);SND.nf.frequency.setTargetAtTime(f*4,t,0.1);SND.ng.gain.setTargetAtTime(noise,t,0.1);SND.lp.frequency.setTargetAtTime(600+thr*2600,t,0.1);
  SND.lfo.frequency.setTargetAtTime(chopHz,t,0.1);SND.lg.gain.setTargetAtTime(chopHz?0.6:0,t,0.1);}
