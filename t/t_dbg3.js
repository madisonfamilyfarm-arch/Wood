const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(3);});await P.waitForTimeout(2500);
  console.log(await P.evaluate(()=>{const log=[];const pp=CHAT.push;CHAT.push=function(){log.push('PUSH');return pp.apply(this,arguments);};const cd=chatDraw;
    const n0=CHAT.length;chatAdd.force=true;chatAdd('🤖 Ace','test1','#fff');chatAdd.force=false;chatAdd('Bob','plain','#fff');log.push('lastBot='+chatAdd.lastBot+' talk='+AIX.talk);
    return 'len '+n0+'→'+CHAT.length+' log '+log.join(',')+' | chatAdd src: '+chatAdd.toString().slice(0,200);}));
});
