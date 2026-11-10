const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(500);const o=[];
 for(const c of MCAT){const L=mCatItems(c[0]).map(it=>{try{return it.label();}catch(e){return '';}}).filter(x=>/Tank/.test(x));if(L.length)o.push(c[0]+': '+L.join(' | '));}
 const it=mCatItems('fly').find(it=>/Tank \(drive/.test(it.label()));it.act?it.act():it.fn?it.fn():it.f&&it.f();await W(1200);o.push('after tap: kind '+vhKind()+' name '+SPEC.name+' turret '+!!(DR.g.userData.tur));
 aiSet(2);await W(1000);NLU.sync=true;resetDrone();await W(300);chatSend('give me a tank');await W(1000);o.push('chat: '+SPEC.name);return o.join('\n');}));});
