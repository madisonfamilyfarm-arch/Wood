const H0=require('./harness');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:560});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(500);const o=[];
 o.push('depth profile: '+[300,320,350,380,420,460,500,520,540].map(z=>(H(TUN.x,z)-tunSurf(z)).toFixed(1)).join(' '));
 useSpec(JSON.parse(JSON.stringify(VPRESETS.car[Object.keys(VPRESETS.car)[0]])));await W(800);resetDrone({x:TUN.x,z:TUN.z0-15,yaw:Math.PI});await W(1500);
 const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));kd('ArrowUp');
 for(let i=0;i<8;i++){await W(1500);o.push('z '+D.pos.z.toFixed(0)+' x '+D.pos.x.toFixed(0)+' below surface '+(tunSurf(D.pos.z)-D.pos.y).toFixed(1)+' state '+D.state);}ku('ArrowUp');return o.join('\n');}));
await P.screenshot({path:S+'tunnel.png'});});
