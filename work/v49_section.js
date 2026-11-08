// ================================================================ v49: 🌊 TORPEDOES — a rocket underwater becomes a torpedo (slow, bubbles, no flame). When it leaves the water it turns into a rocket; when it dives in again it's a torpedo again.
const TORP={spd:14};
{const t0=tickShots;tickShots=function(dt){const pre=[];try{for(const s of shots){if(s.w!=='rocket'||!s.m)continue;const P=s.m.position,inW=inWater(P.x,P.z)&&P.y<WATER_Y;
      if(inW&&!s.torp){s.torp=true;s.v.y*=0.35;if(s.v.length()>TORP.spd)s.v.setLength(TORP.spd);if(s.m.userData.flame)s.m.userData.flame.visible=false;if(s.age3>0.05){try{sfx('splash',P.clone(),0.6);puff(new V3(P.x,WATER_Y,P.z),0xe8f6ff,0.5,1.2);}catch(e){}}}
      else if(!inW&&s.torp){s.torp=false;if(s.m.userData.flame)s.m.userData.flame.visible=true;try{sfx('rocket',P.clone());puff(new V3(P.x,WATER_Y,P.z),0xe8f6ff,0.6,1.2);}catch(e){}if(s.v.y<3)s.v.y=3;}
      s.age3=(s.age3||0)+dt;if(s.torp){s.puff=1;pre.push(s);}}}catch(e){}
  const r=t0.apply(this,arguments);
  // torpedo: stays slow, floats level (no sinking), leaves a bubble trail, runs longer
  for(const s of pre){if(shots.indexOf(s)<0)continue;try{const T=WTYPES[s.w];s.v.y+=T.g*dt;if(s.v.length()>TORP.spd)s.v.setLength(TORP.spd);s.life+=dt*0.6;s.bub=(s.bub||0)-dt;if(s.bub<=0){s.bub=0.06;puff(s.m.position.clone(),0xd6f0ff,0.07,0.9);}}catch(e){}}return r;};}
// big underwater blasts throw up a water column
{const e0=explode;explode=function(p,r){const res=e0.apply(this,arguments);try{if(inWater(p.x,p.z)&&p.y<WATER_Y+1.5){const n=Math.min(18,5+(r||4));for(let i=0;i<n;i++)puff(new V3(p.x+(Math.random()-0.5)*r*0.4,WATER_Y+Math.random()*r*0.9,p.z+(Math.random()-0.5)*r*0.4),0xf2fbff,0.4+r*0.08,1.6+Math.random());sfx('splash',p,1.6);}}catch(e){}return res;};}
// subs call their rockets torpedoes
{const f0=fire;fire=function(){const r=f0.apply(this,arguments);try{if(vhKind()==='sub'&&curWeapon&&curWeapon()==='rocket'&&!fire.told){fire.told=1;toast('🌊 Torpedo away! (it turns into a rocket if it leaves the water)',2500);}}catch(e){}return r;};}
