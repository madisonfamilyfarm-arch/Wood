const H0=require('./harness');const fs=require('fs');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/mb/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:600});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
for(const f of ['/mnt/user-data/attachments/45cffd64-7151-5ab5-acd7-339a16c71f6a/15323568-My-build.drone.json',S+'Squid-Quad.drone.json']){
const j=JSON.parse(fs.readFileSync(f,'utf8'));
console.log(await P.evaluate(async(j)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));if(!window.__s){startGame('free');window.__s=1;}await W(300);
 const sp=sanitize(j.spec);const st=stats(sp);const I=partsInfo(sp);const el=I.el||{};
 const ss=propStrikes(sp.parts,connectedParts(sp.parts)).map(k=>sp.parts[k.i].t+'@'+sp.parts[k.i].x+','+sp.parts[k.i].y+','+sp.parts[k.i].h+' x '+sp.parts[k.j].t);const o=['strikes '+ss.join(' | ')+'\n'+sp.name+': why="'+(st.why||'')+'" flyAs '+st.flyAs+' loose '+I.loose.length+' motorsWired '+(el.motorsWired!=null?el.motorsWired+'/'+el.motorsAll:'?')+' mins '+(st.mins||'').toString().slice(0,4)];
 useSpec(sp);await W(800);const y0=D.pos.y;try{takeoff();}catch(e){}const kd=c=>dispatchEvent(new KeyboardEvent('keydown',{code:c,key:c}));const ku=c=>dispatchEvent(new KeyboardEvent('keyup',{code:c,key:c}));kd('ArrowUp');await W(3000);ku('ArrowUp');await W(1500);
 o.push('  climbed '+(D.pos.y-y0).toFixed(1)+' state '+D.state+' tilt '+Math.hypot(D.lean?D.lean.x:0,D.lean?D.lean.y:0).toFixed(2));try{resetDrone();}catch(e){}return o.join('\n');},j));}
// picture of the fixed one in the builder
await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));openWorkshop(true);await W(800);$('wsTools').style.display='none';$('wsTray').style.display='none';$('wsMid').style.left='0';$('wsMid').style.right='0';window.dispatchEvent(new Event('resize'));await W(800);});
await P.screenshot({path:S+'squidquad.png'});});
