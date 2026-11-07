const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.addInitScript(()=>{});
  await A.evaluate(()=>{window.FGP={id:'Spektrum InterLink DX (Vendor: 0b6d)',index:0,connected:true,axes:[0,0,0,0,0,0],buttons:Array.from({length:10},()=>({pressed:false,value:0}))};navigator.getGamepads=()=>[window.FGP];});
  await A.waitForTimeout(2000);await A.evaluate(()=>{startGame('free');localStorage.removeItem('wds_rcmap');});
  const ev=(f,a)=>A.evaluate(f,a),w=ms=>A.waitForTimeout(ms);
  const ax=(i,v)=>ev(([i,v])=>{FGP.axes[i]=v;},[i,v]),bt=(i,on)=>ev(([i,on])=>{FGP.buttons[i]={pressed:on,value:on?1:0};},[i,on]);
  await ev(()=>{rcSetup();rcwBtn('p:rc');});await w(400);
  // teach all 4 sticks: roll=axis1, pitch=axis0 reversed, thr=axis3, yaw=axis2
  await ev(()=>rcwBtn('axall'));await w(1500);
  for(const [i,v] of [[1,1],[0,-1],[3,1],[2,1]]){await ax(i,v);await w(2500);await ax(i,0);await w(1500);}
  console.log('axes',await ev(()=>JSON.stringify(RCMAP.ax)));
  // momentary: camera on button 2
  await ev(()=>rcwBtn('set:cam'));await w(1200);await bt(2,true);await w(1500);await bt(2,false);await w(2500);
  // switch: obstacle braking on button 5 (stays pressed = ON)
  await ev(()=>rcwBtn('set:braking'));await w(800);await bt(5,true);await w(400);await ev(()=>{[...$('rcw2').querySelectorAll('button')].find(b=>b.textContent.includes('Got it')).click();});await w(600);
  await bt(5,false);await w(400);await ev(()=>{[...$('rcw2').querySelectorAll('button')].find(b=>b.textContent.includes('Got it')).click();});await w(600);
  // 3-position speed switch on axis 4: -1 cine, 0 normal, 1 sport
  await ev(()=>rcwBtn('set:speed'));await w(600);
  for(const v of [-1,0,1]){await ax(4,v);await w(400);await ev(()=>{[...$('rcw2').querySelectorAll('button')].find(b=>b.textContent.includes('Got it')).click();});await w(600);}
  // camera knob: axis 5
  await ev(()=>rcwBtn('set:gimbal'));await w(1000);await ax(5,0.8);await w(2000);
  await A.screenshot({path:'ctl_setup.png'});
  console.log('ctl',await ev(()=>JSON.stringify(Object.fromEntries(Object.entries(RCMAP.ctl).map(([k,c])=>[k,ctlTxt(k,c)])))));
  await ev(()=>rcwBtn('done'));await w(1500);
  // use it
  const cam0=await ev(()=>camName());await bt(2,true);await w(2500);await bt(2,false);await w(2500);console.log('camera changed:',cam0,'->',await ev(()=>camName()));
  await ax(4,1);await w(2500);console.log('speed switch SPORT:',await ev(()=>D.speed));await ax(4,-1);await w(2500);console.log('speed switch CINE:',await ev(()=>D.speed));
  await bt(5,true);await w(2500);console.log('braking ON:',await ev(()=>CFG.avoid));await bt(5,false);await w(2500);console.log('braking off:',await ev(()=>CFG.avoid));
  // throttle up = climb with sticks via mapping
  await ev(()=>{takeoff();});await ax(3,0.8);await w(4000);console.log('throttle -> climbing VS',await ev(()=>D.vel.y.toFixed(2)),'state',await ev(()=>D.state));
  // DJI: double-tap Fn while right stick pushed right = flip right
  await ev(()=>{CFG.useRemote=true;dji.on=true;});
  const pk=(fn)=>ev(fn=>{const s=new Uint8Array(38);s[0]=0x55;s[1]=38;for(const o of[13,16,19,22,25]){s[o]=1024&255;s[o+1]=1024>>8;}const v=1024+600;s[13]=v&255;s[14]=v>>8;dji.ax.rx=0;djiFeed(s);const b=new Uint8Array(58);b[0]=0x55;b[1]=58;b[28]=0x10;b[29]=fn?0x02:0;djiFeed(b);dji.last=performance.now();},fn);
  await ev(()=>{D.pos.y=H(D.pos.x,D.pos.z)+8;D.state='flying';D.armed=true;});
  console.log('flip:',await ev(()=>{const feed=fn=>{const b=new Uint8Array(58);b[0]=0x55;b[1]=58;b[28]=0x10;b[29]=fn?0x02:0;djiFeed(b);dji.last=performance.now();};const busy=ms=>{const t=performance.now();while(performance.now()-t<ms);};
    __wds.setRaw({lx:0,ly:0,rx:0.9,ry:0,gim:0});tickDjiButtons();
    feed(1);tickDjiButtons();busy(80);feed(0);tickDjiButtons();busy(120);feed(1);tickDjiButtons();busy(80);feed(0);tickDjiButtons();busy(450);tickDjiButtons();
    return D.flip?D.flip.way:(D.flipQ||'none');}));
});
