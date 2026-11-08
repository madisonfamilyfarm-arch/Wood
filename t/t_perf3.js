const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(3);});await P.waitForTimeout(1000);
const W='a an the tnt big boom fly drone car tank boat sub plane heli map night day rain snow fog color paint red blue size speed sound volume vr phone ai bot team race tag hide seek fire water fix undo redo save load build kit wheel motor prop battery rocket gun mg torpedo nuke mega cluster sticky ? ! 123 ✈️ 🚀 💣 <b> "quote" \' % & ### ... ;; emoji 😀 x'.split(' ');
const rnd=()=>Array.from({length:1+Math.floor(Math.random()*4)},()=>W[Math.floor(Math.random()*W.length)]).join(' ');
await P.evaluate(()=>menuToggle(true));const T=[];for(let i=0;i<15;i++){const q=rnd();T.push(await P.evaluate(q=>{const a=performance.now();const s=$('menuSearch');s.value=q;msRun();return Math.round(performance.now()-a)+' ms '+q;},q));}
await P.evaluate(()=>{$('menuSearch').value='';msRun();menuToggle(false);});for(let i=0;i<15;i++){const q=rnd();const a=Date.now();T.push(await P.evaluate(q=>{const a=performance.now();chatSend(q);return 'chat '+Math.round(performance.now()-a)+' ms '+q;},q)+' rt '+(Date.now()-a));}
console.log(T.join('\n'));});
