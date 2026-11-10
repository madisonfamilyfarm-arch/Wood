const H0=require('./harness');
const S='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/';
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:900,height:600});await P.waitForTimeout(3000);
await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);bsOpen('tank',null);bsClose();await W(600);const tl=$('wsTools');if(tl)tl.style.display='none';$('wsTray').style.display='none';$('wsMid').style.left='0';$('wsMid').style.right='0';window.dispatchEvent(new Event('resize'));await W(800);});
await P.screenshot({path:S+'tank_ws.png'});
// in play: check where the model is vs D.pos, and child count
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const sp=wsSpec();closeWorkshop();useSpec(sp);await W(1200);const bb=new THREE.Box3().setFromObject(DR.g);return 'parts '+sp.parts.length+' kids '+DR.g.children.length+' box '+bb.min.toArray().map(x=>x.toFixed(2))+' / '+bb.max.toArray().map(x=>x.toFixed(2))+' pos '+D.pos.toArray().map(x=>x.toFixed(2))+' g.pos '+DR.g.position.toArray().map(x=>x.toFixed(2))+' scale '+DR.g.scale.x.toFixed(2);}));});
