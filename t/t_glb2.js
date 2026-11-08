const H0=require('./harness');const fs=require('fs');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:600});P.on('pageerror',e=>console.log('PAGEERR',e.message));await P.waitForTimeout(3000);
const b64=fs.readFileSync('/mnt/user-data/outputs/Squidrocket.glb').toString('base64');
console.log(await P.evaluate(async(b64)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);openWorkshop(false);
 const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const buf=u.buffer;const mid=midOf(buf,'Squidrocket.glb');MODELS[mid]={buf,name:'Squidrocket'};parseModel(mid);await W(1500);
 WS.parts.push(cleanPart({t:'model',mid,nm:'Squidrocket',sc:1,x:0,y:0,h:6}));WS.sel=WS.parts.length-1;wsChanged();await W(1500);
 const tl=$('wsTools');if(tl)tl.style.display='none';$('wsTray').style.display='none';$('wsMid').style.left='0';$('wsMid').style.right='0';window.dispatchEvent(new Event('resize'));await W(800);
 return 'model ok '+!!(MODELS[mid]&&(MODELS[mid].obj||MODELS[mid].scene||MODELS[mid].gltf))+' keys '+Object.keys(MODELS[mid]);},b64));
await P.screenshot({path:'/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/squid.png'});});
