const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html',{width:393,height:852});await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));startGame('free');openWorkshop(false);await W(800);const a=histSnap();const u0=HIST.u.length;
const b=[...document.querySelectorAll('#wsTools button')].find(b=>/Easy sliders/.test(b.textContent));b.click();await W(1500);const c=histSnap();
let d='';for(let i=0;i<Math.max(a.length,c.length);i++)if(a[i]!==c[i]){d=a.slice(i-60,i+80)+'\n VS \n'+c.slice(i-60,i+80);break;}
return 'u '+u0+'→'+HIST.u.length+'\n'+d;}));});
