const H0=require('./harness');
H0(async({mk})=>{const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
const P=await mk('ls','http://127.0.0.1:8765/woods-rc-sim.html',{width:852,height:393});P.on('pageerror',e=>console.log('ERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(800);takeoff();await W(300);
 D.pos.set(ARN.x+30,ARN.flat()+18,ARN.z+ARN.bz-25);D.yaw=0.3;D.vel.set(0,0,0);await W(2500);return 'ok '+MG.gates.length;}));
await P.screenshot({path:S+'mega1.png'});
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const o=[];
 for(let i=0;i<MG.gates.length+1;i++){const G=MG.gates[i%MG.gates.length];const f=new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0),G.yaw);D.vel.set(0,0,0);D.pos.set(G.x-f.x*3,G.y,G.z-f.z*3);await W(120);D.pos.set(G.x+f.x*3,G.y,G.z+f.z*3);await W(120);o.push(MG.next);}
 o.push($('megaHud').textContent+' best '+MG.best);
 // tunnel
 D.pos.set(TUN.x,tunSurf(TUN.z0+40)-tunDepth(TUN.z0+40)+2,TUN.z0+40);D.yaw=Math.PI;D.vel.set(0,0,5);await W(1500);return o.join(' ');}));
await P.screenshot({path:S+'tun1.png'});});
