const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(3);D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+5;});await P.waitForTimeout(2500);
  const say=async t=>{await P.evaluate(t=>chatSend(t),t);await P.waitForTimeout(2800);};
  for(const t of ['hi','my name is Madison','I like raccoons','what do you know about me','how are you','lets play a game','yes'])await say(t);
  console.log(await P.evaluate(()=>'game '+GAME.on+' it '+GAME.it+' B '+(GAME.B&&GAME.B.name+':'+GAME.B.kind)));
  // simulate chase: move AI next to me
  console.log(await P.evaluate(()=>{const B=GAME.B;GAME.cool=0;B.p.copy(dzMe()).add(new V3(1,0,0));aiTick(0.05);return 'after touch it='+GAME.it+' score '+JSON.stringify(GAME.score);}));
  await P.waitForTimeout(3000);
  for(const t of ['stop playing','hide and seek'])await say(t);
  console.log(await P.evaluate(()=>'game '+GAME.on+' hide '+JSON.stringify(GAME.hide)));
  await say('where are you');await say('stop playing');await say('follow the leader');
  console.log(await P.evaluate(()=>{doFlip('back');return 'flipping';}));await P.waitForTimeout(3000);
  await say('be quiet');await say('blah blorp');
  await P.waitForTimeout(3000);console.log(await P.evaluate(()=>CHAT.slice(-30).map(c=>(c.who||'')+': '+c.txt).join('\n')));
});
