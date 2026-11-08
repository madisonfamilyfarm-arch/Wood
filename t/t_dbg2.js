const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(3);await new Promise(r=>setTimeout(r,2000));const o=[];const T0=performance.now();const tt=()=>((performance.now()-T0)/1000).toFixed(1)+'s ';
const s0=sbSay;sbSay=function(w,t){o.push(tt()+'SB '+t);return s0.apply(this,arguments);};const a0=aiSayAs.__raw;aiSayAs.__raw=function(n,t){o.push(tt()+'RAW '+n+': '+t);return a0.apply(this,arguments);};
const pe={name:'Sister',id:'p1',p:new THREE.Vector3(0,5,0)};mp.peers['p1']=pe;
try{const h=smartHear;smartHear=function(t){o.push(tt()+'HEAR '+t+' peer='+PEERCTX.on);return h.apply(this,arguments);};o.push('ret '+MPH.chat({txt:'Ace whats your favorite color',n:'Sister'},pe));;}catch(e){o.push('ERR '+e.message);}
await new Promise(r=>setTimeout(r,3000));
try{chatSend('Ace follow me');}catch(e){o.push('ERR '+e.message);}
await new Promise(r=>setTimeout(r,12000));
return o.join('\n');}));});
