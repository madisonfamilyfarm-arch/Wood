const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');await W(300);bsOpen('ornithopter',null);bsClose();const sp=wsSpec();closeWorkshop();useSpec(sp);await W(800);
 const o=[];o.push('name '+SPEC.name+' parts '+SPEC.parts.length+' kit '+SPEC.kit);const d=(g,dep)=>{if(dep>3)return;g.children.forEach((c,i)=>{o.push(' '.repeat(dep*2)+i+' '+c.type+' n'+c.children.length+' ud '+JSON.stringify(Object.keys(c.userData||{}))+' pos '+c.position.toArray().map(x=>x.toFixed(2)));if(c.children.length>3&&dep<1)d(c,dep+1);});};d(DR.g,0);return o.slice(0,40).join('\n');}));});
