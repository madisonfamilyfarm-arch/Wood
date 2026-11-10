// free-form questions a kid would ask the AI pilots — prints each reply so I can judge it
const H=require('./harness');const fs=require('fs');const Q=fs.readFileSync(__dirname+'/'+(process.env.Q||'qa1.txt'),'utf8').split('\n').filter(l=>l.trim()&&!l.startsWith('#'));
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async(Q)=>{startGame('free');aiSet(4);await new Promise(r=>setTimeout(r,2500));const o=[];NLU.sync=true;let cur=[];
const c00=chatAdd;chatAdd=function(who,txt,col){if(typeof who==="string"&&/🤖/.test(who))cur.push(txt);return c00.apply(this,arguments);};const s0=sbSay;sbSay=function(w,t){return s0.apply(this,arguments);};const c0=chatSys;chatSys=function(t){cur.push('[sys] '+t);return c0.apply(this,arguments);};
for(const q of Q){cur=[];try{chatSend(q);}catch(e){cur.push('ERR '+e.message);}await new Promise(r=>setTimeout(r,700));o.push((cur.length?'  ':'✗ ')+q.padEnd(44)+' → '+(cur.slice(0,2).join(' ‖ ')||'(nothing)').slice(0,150));}
return o.join('\n');},Q));});
