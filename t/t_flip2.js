const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+8;camI=CAMS.indexOf('FPV');});await P.waitForTimeout(600);
  console.log(await P.evaluate(()=>{doFlip('front');const out=[];for(const t of [0,0.2,0.33,0.5]){D.flip.t=t;updateCam(0.016);const v=new V3(0,1,0).applyQuaternion(cam.quaternion);out.push(t+':up.y='+v.y.toFixed(2));}camI=CAMS.indexOf('GIMBAL');D.flip.t=0.33;updateCam(0.016);out.push('gimbal up.y='+new V3(0,1,0).applyQuaternion(cam.quaternion).y.toFixed(2));return out.join(' ');}));
});
