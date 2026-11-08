const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const tm=async()=>{let a=performance.now();await new Promise(r=>setTimeout(r,0));return (performance.now()-a).toFixed(0);};const pre=await tm();startGame('free');aiSet(3);await new Promise(r=>setTimeout(r,2000));const o=[];NLU.sync=true;
for(const t of ['Ace whats your favorite color','ace follow me','hey blaze whats the capital of france','how many feet in a mile','i like turtels and dinosores']){let a=performance.now();smartHear(t);o.push((performance.now()-a).toFixed(0)+'ms hear: '+t);a=performance.now();vFix(t);o.push((performance.now()-a).toFixed(0)+'ms vFix');a=performance.now();cleanSpeech(t);o.push((performance.now()-a).toFixed(0)+'ms clean');}
let a=performance.now();await new Promise(r=>setTimeout(r,0));o.push('timeout0 '+(performance.now()-a).toFixed(0));
a=performance.now();await new Promise(r=>requestAnimationFrame(r));o.push('raf '+(performance.now()-a).toFixed(0));
o.push('pre '+pre);let n=0;const st=setTimeout;let cnt=0;window.setTimeout=function(f,d){cnt++;return st.apply(this,arguments);};await new Promise(r=>st(r,3000));o.push('setTimeouts in 3s: '+cnt);window.setTimeout=st;return o.join('\n');}));});
