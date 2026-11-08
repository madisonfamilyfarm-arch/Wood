const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  console.log(await P.evaluate(()=>{// find a lake spot
    let w=null;for(let r=0;r<600&&!w;r+=5)for(let a=0;a<6.28&&!w;a+=0.3){const x=PAD.x+Math.cos(a)*r,z=PAD.z+Math.sin(a)*r;if(inWater(x,z)&&H(x,z)<WATER_Y-3)w={x,z};}
    if(!w)return 'no deep water';const out=[];
    // 1) torpedo fired underwater, level
    let p=new V3(w.x,WATER_Y-1.2,w.z);spawnShot('rocket',p,new V3(20,0,0),0xffffff,true,'t1',mp.id);let s=shots[shots.length-1];let booms=0;const e0=explode;explode=function(){booms++;return e0.apply(this,arguments);};
    for(let i=0;i<30;i++)tickShots(0.03);out.push('underwater: alive '+(shots.includes(s))+' torp '+s.torp+' speed '+s.v.length().toFixed(1)+' y '+s.m.position.y.toFixed(2));
    // 2) aim it up → leaves water → rocket
    s.v.set(3,12,0);for(let i=0;i<20&&shots.includes(s);i++)tickShots(0.03);out.push('after surfacing: torp '+s.torp+' speed '+s.v.length().toFixed(1)+' y '+s.m.position.y.toFixed(1)+' alive '+shots.includes(s));
    // 3) rocket diving into water → torpedo again
    p=new V3(w.x,WATER_Y+6,w.z);spawnShot('rocket',p,new V3(10,-25,0),0xffffff,true,'t2',mp.id);s=shots[shots.length-1];for(let i=0;i<20&&shots.includes(s);i++)tickShots(0.03);
    out.push('dived in: alive '+shots.includes(s)+' torp '+s.torp+' speed '+s.v.length().toFixed(1)+' y '+s.m.position.y.toFixed(2)+' booms '+booms);explode=e0;return out.join('\n');}));
});
