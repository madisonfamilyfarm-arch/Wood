const H0=require('./harness');
H0(async({mk})=>{const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
const P=await mk('pt','http://127.0.0.1:8765/woods-rc-sim.html',{width:393,height:852});P.on('pageerror',e=>console.log('ERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(()=>[...document.querySelectorAll('#start button')].map(b=>b.textContent).filter(t=>/Arena/.test(t)).join(' | ')));
await P.screenshot({path:S+'start.png'});
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('mega');for(let i=0;i<30&&!cRun;i++)await W(500);const o=['order '+COURSE_ORDER.slice(0,6).join(','),'pos '+D.pos.x.toFixed(0)+','+D.pos.z.toFixed(0)+' cRun '+cRun+' count '+count.toFixed(1)];
 takeoff();await W(1500);for(let i=0;i<MG.gates.length;i++){const G=MG.gates[i],n=course.cps[i].n;D.pos.set(G.x-n.x*1.5,G.y,G.z-n.z*1.5);D.vel.set(n.x*12,0,n.z*12);await W(400);const a=D.pos.clone();D.pos.set(G.x+n.x*2,G.y,G.z+n.z*2);await W(150);if(i<2)o.push('g'+i+' at '+a.x.toFixed(1)+','+a.y.toFixed(1)+','+a.z.toFixed(1)+' G '+G.x.toFixed(1)+','+G.y.toFixed(1)+','+G.z.toFixed(1)+' now '+D.pos.x.toFixed(1)+','+D.pos.y.toFixed(1)+','+D.pos.z.toFixed(1)+' cpI '+cpI+' st '+D.state);}
 o.push('cpI '+cpI+'/'+course.cps.length+' best '+LS.get('best_mega',0));
 const m=raceItems?raceItems().map(x=>typeof x.label==='function'?x.label():x.textContent||'').join('|'):'';o.push(m.slice(0,300));return o.join('\n');}));});
