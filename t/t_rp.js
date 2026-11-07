const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(()=>{const sp={name:'Rocket plane',parts:[{t:'shape',style:'capsule',w:8,len:50,d:8,col:'#ff3030'},{t:'wing',w:80,len:16,d:1.5,h:0,col:'#f2f2f2'},{t:'wing',w:24,len:10,d:1,y:22,h:0},{t:'wing',w:12,len:10,d:1,y:22,h:6,rz:90},{t:'rocket',y:30,w:4,len:14,pow:6},{t:'wheel',x:-10,y:-4,h:-7,r:3},{t:'wheel',x:10,y:-4,h:-7,r:3},{t:'wheel',x:0,y:-22,h:-7,r:3}]};
    useSpec(sanitize(sp));takeoff();takeoff();const o=[];for(let i=0;i<12;i++){__wds.step({},1);o.push(i+'s '+D.state+' alt '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)+' v '+D.vel.length().toFixed(1)+' x '+D.pos.x.toFixed(0));}return o.join('\n');}));
});
