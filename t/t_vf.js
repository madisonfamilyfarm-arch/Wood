const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(()=>{startGame('free');aiSet(3);return [String(SW_OBJ.find(([k])=>new RegExp(' '+k+'(s|es)? ').test(' do not blow up the trees ')))].concat(["don't blow up the trees","i don't like that","i like you","I really like you ace"].map(t=>t+' => ['+vFix(t)+'] => ['+swNorm(vFix(t))+'] clean ['+cleanSpeech(t)+']')).join('\n');}));});
