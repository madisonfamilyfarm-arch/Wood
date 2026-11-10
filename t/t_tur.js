const H0=require('./harness');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:560});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);bsOpen('tank',null);bsClose();const st=stats(wsSpec());const I=partsInfo(wsSpec());const o=['why "'+(st.why||'')+'" loose '+I.loose.length+' kind '+st.flyAs];
 const sp=wsSpec();closeWorkshop();useSpec(sp);await W(1500);camI=CAMS.indexOf('CHASE');CAMX=-1;const T=DR.g.userData.tur;o.push('turret '+!!T+' members '+(T?T.piv.children.length:0)+' guns '+(T?T.guns.length:0)+' stick shown '+($('turStick').style.display));
 // turn turret 90° and tilt barrel up
 TUR.stick.x=1;await W(1200);TUR.stick.x=0;TUR.stick.y=-1;await W(800);TUR.stick.y=0;o.push('yaw '+(TUR.yaw*57.3).toFixed(0)+'° pitch '+(TUR.pitch*57.3).toFixed(0)+'° gimbal '+(D.gimbal*57.3).toFixed(0)+'°');
 const d=aimDir(D.pos);o.push('aim dir '+d.toArray().map(x=>x.toFixed(2)));return o.join('\n');}));
await P.waitForTimeout(500);await P.screenshot({path:S+'tank_turret.png'});});
