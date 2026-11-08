const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(2);await new Promise(r=>setTimeout(r,2000));
const t="the sea";return JSON.stringify([vFix(t),nNorm(vFix(t)),cleanSpeech(t),nWho(nNorm(t)).map(w=>w.B&&w.B.name)]);}));});
