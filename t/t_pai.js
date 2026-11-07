const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(2);});
  console.log(await P.evaluate(async()=>{paiUse();await new Promise(r=>setTimeout(r,2500));return 'gpu '+!!navigator.gpu+' src '+AIB.src+' err '+PAI.err+' url '+AIB.url;}));
  console.log(await P.evaluate(async()=>{PAI.eng={chat:{completions:{create:async o=>({choices:[{message:{content:'{"replies":[{"name":"Ace","say":"hi from phone"}]}'}}]})}}};AIB.url='phone://ai';const t=await aiFetchJ('phone://ai/api/tags');const c=await aiFetchJ('phone://ai/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'user',content:'hi'}]})});return JSON.stringify(t).slice(0,120)+' | '+JSON.stringify(c);}));
});
