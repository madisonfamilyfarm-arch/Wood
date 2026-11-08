const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
for(const k of ['plane','tank']){
console.log(await P.evaluate(async(k)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));if(!window.__s){startGame('free');window.__s=1;}await W(500);
 bsOpen(k,null);bsClose();await W(800);const sp=wsSpec(),st=stats(sp);const I=partsInfo({parts:WS.parts,wires:WS.wires});
 const out=[k+' parts '+WS.parts.length+' flyAs '+st.flyAs+' why="'+(st.why||'')+'" loose '+I.loose.map(i=>WS.parts[i].t+'@'+i).join(',')+' kg '+(st.kg||st.mass||'')];
 ED.dist=ED.dist;try{wsTool&&0;}catch(e){}
 return out.join('\n');},k));
await P.screenshot({path:'/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/kit_'+k+'.png'});
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const fly=[...document.querySelectorAll('#wsTools button')].find(b=>/FLY IT|DRIVE IT/.test(b.textContent));fly.click();await W(1500);
 const y0=D.pos.y;const p0=D.pos.clone();try{D.armed=true;}catch(e){}const o=[];
 // full throttle forward for 12 s using the virtual sticks
 const inp=window.INP||window.STK;const t0=performance.now();
 const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));
 kd('ArrowUp');await W(5000);kd('KeyS');await W(2500);ku('KeyS');kd('KeyW');await W(600);ku('KeyW');await W(5000);const mx=D.vel?D.vel.length():0;ku('ArrowUp');
 o.push('state '+D.state+' kind '+vhKind()+' moved '+Math.round(D.pos.distanceTo(p0))+' alt gain '+(D.pos.y-y0).toFixed(1)+' maxspeed '+(D.vel?D.vel.length().toFixed(1):''));
 return o.join(' ');}));
await P.screenshot({path:'/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/kit_'+k+'_fly.png'});}});
