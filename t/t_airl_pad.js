const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:1000,height:620});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(800);airlinerGo();await W(800);resetDrone({x:PAD.x,z:PAD.z+40,yaw:0});await W(1500);
 const A=DR.g.userData.airliner;const bb=new THREE.Box3().setFromObject(A);const sz=bb.getSize(new THREE.Vector3());
 return 'ST.airl '+ST.airliner+' giga '+ST.giga+' legs '+(ST.legs||0).toFixed(2)+' L '+ST.L+' S '+ST.S+' Tm '+ST.Tm+' top '+ST.top+' spec airliner '+!!SPEC.airliner+' kind '+vkind()+' size '+sz.x.toFixed(1)+' x '+sz.y.toFixed(1)+' x '+sz.z.toFixed(1)+' groundgap '+(bb.min.y-H(D.pos.x,D.pos.z)).toFixed(2)+' state '+D.state;}));
await P.screenshot({path:S+'airl_1.png'});
// orbit-ish views via camera modes
await P.evaluate(()=>{try{nextCam(1);}catch(e){}});await P.waitForTimeout(800);await P.screenshot({path:S+'airl_2.png'});
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));
 const y0=D.pos.y,p0=D.pos.clone();let mx=0;const iv=setInterval(()=>{mx=Math.max(mx,D.vel?D.vel.length():0);},200);const log=[];{const i0=impact;impact=function(v,what){log.push('IMPACT v'+(+v).toFixed(1)+' '+what+' @'+new Error().stack.split('\n').slice(2,4).map(x=>x.trim().slice(0,70)).join('<'));return i0.apply(this,arguments);};}{let st=D.state;Object.defineProperty(D,'state',{get(){return st;},set(v){if(v==='tumble'&&st!=='tumble')log.push('TUMBLE@'+new Error().stack.split('\n').slice(2,5).map(x=>x.trim().slice(0,60)).join('<'));st=v;},configurable:true});}kd('ArrowUp');for(let i=0;i<10;i++){await W(1000);log.push(D.state+' v'+(D.vel?D.vel.length().toFixed(0):'')+' y'+(D.pos.y-y0).toFixed(0));}try{takeoff();}catch(e){}for(let i=0;i<10;i++){await W(1000);log.push(D.state+' v'+(D.vel?D.vel.length().toFixed(0):'')+' y'+(D.pos.y-y0).toFixed(0));}clearInterval(iv);console.log(log.join(' | '));
 return log.join(' | ')+'\nmoved '+Math.round(D.pos.distanceTo(p0))+' alt '+(D.pos.y-y0).toFixed(1)+' max '+mx.toFixed(1)+' state '+D.state;}));
await P.screenshot({path:S+'airl_3.png'});});
