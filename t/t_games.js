// plays tag + hide and seek + race with an AI pilot and logs what happens
const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(2);DZ.ai=false;D.state='flying';D.armed=true;D.pos.y+=8;await new Promise(r=>setTimeout(r,2500));const o=[];const c0=chatAdd;chatAdd=function(n,t){o.push('   '+String(n).slice(0,12)+': '+t);return c0.apply(this,arguments);};
 const w=ms=>new Promise(r=>setTimeout(r,ms));const me=()=>dzMe();
 for(const q of ['lets play tag','lets play hide and seek','race me to the lake']){o.push('>> '+q);smartHear(q);const d=[];for(let i=0;i<10;i++){await w(2000);const B=GAME.B||AIB.L[0];d.push(Math.round(B.p.distanceTo(me())));}o.push('   game='+GAME.on+' dist over 20s: '+d.join(','));if(GAME.on)gameStop();await w(500);}
 return o.join('\n');}));});
