const H=require('./harness');
H(async({mk})=>{const U='http://127.0.0.1:8765/woods-rc-sim.html';const PJ='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/pj_test.js';
  const A=await mk('A',U);const B=await mk('B',U);
  for(const P of [A,B]){await P.route('**/peerjs.min.js',r=>r.fulfill({path:PJ,contentType:'text/javascript'}));}
  await A.waitForTimeout(3000);
  for(const P of [A,B]){await P.evaluate(()=>{startGame('free');mp.want=false;mpConnect(null);});}await A.waitForTimeout(1000);console.log('pre',await A.evaluate(()=>'mpOpen '+mpOpen()));
  // point PeerJS at the local test broker
  const patch=()=>{const iv=setInterval(()=>{if(window.Peer&&!window.Peer.__p){const P0=window.Peer;window.Peer=function(id,o){if(typeof id==='object'||id===undefined){o=id;id=undefined;}o=Object.assign({host:'127.0.0.1',port:9000,path:'/',secure:false},o||{});return id?new P0(id,o):new P0(o);};window.Peer.__p=1;}},50);};
  
  await A.evaluate(()=>onlHost());await A.waitForTimeout(4000);const code=await A.evaluate(()=>ONL.code+' on '+ONL.on);console.log('host',code);
  await B.evaluate(()=>{const l0=onlLeave;onlLeave=function(q){console.error('LEAVE '+q+' '+new Error().stack.split('\n').slice(1,4).join(' | '));return l0.apply(this,arguments);};});await B.evaluate(c=>onlJoin(c),code.split(' ')[0]);await B.waitForTimeout(6000);
  console.log('B',await B.evaluate(()=>'hc '+(ONL.hc&&ONL.hc.open)+' peer '+(ONL.peer&&ONL.peer.open)+' toast '+$('toast').textContent+' on '+ONL.on+' peers '+Object.keys(mp.peers).filter(id=>!id.startsWith('bot')).length+' mpOpen '+mpOpen()));
  console.log('A',await A.evaluate(()=>'conns '+ONL.conns.length+' peers '+Object.keys(mp.peers).filter(id=>!id.startsWith('bot')).length));
  await B.evaluate(()=>chatSend('hello from phone B'));await A.waitForTimeout(1500);
  console.log('A chat',await A.evaluate(()=>CHAT.slice(-4).map(c=>c.who+': '+c.txt).join(' / ')));
  await A.evaluate(()=>aiSet(2));await A.waitForTimeout(5000);
  console.log('B sees A bots',await B.evaluate(()=>Object.keys(mp.peers).filter(id=>id.includes('~')).map(id=>mp.peers[id].name).join(' | ')));
  console.log('flip',await A.evaluate(async()=>{const B=AIB.L[0];smartHear(B.name.replace('🤖 ','')+' do a flip');const q0=B.q.clone();await new Promise(r=>setTimeout(r,500));return 'flipT '+B.flipT.toFixed(2)+' rotated '+(1-Math.abs(q0.dot(B.q))).toFixed(3);}));
  await A.evaluate(()=>{LS.set('devMode','phone');PHONE=true;takeoff();});await A.waitForTimeout(3000);console.log('flip btn',await A.evaluate(()=>$('flipBtn').style.display+' state '+D.state));
  await A.evaluate(()=>{$('flipBtn').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));$('flipBtn').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));});await A.waitForTimeout(300);console.log('flipping',await A.evaluate(()=>'flip '+JSON.stringify(D.flip||D.flipT||D.trick||null)));
  await A.evaluate(()=>LS.set('devMode','auto'));
});
