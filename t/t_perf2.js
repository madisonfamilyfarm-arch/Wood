const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(5000);
console.log(await P.evaluate(async()=>{const o=[];const lt=[];try{new PerformanceObserver(l=>l.getEntries().forEach(e=>lt.push(Math.round(e.duration)))).observe({entryTypes:['longtask']});}catch(e){o.push('no lt');}
let fr=0,last=performance.now(),mx=0;let run=true;const f=()=>{const n=performance.now();mx=Math.max(mx,n-last);last=n;fr++;if(run)requestAnimationFrame(f);};requestAnimationFrame(f);
const ts=[];for(let i=0;i<5;i++){const a=performance.now();await new Promise(r=>setTimeout(r,0));ts.push(Math.round(performance.now()-a));}
const mc=[];for(let i=0;i<5;i++){const a=performance.now();await new Promise(r=>{const c=new MessageChannel();c.port1.onmessage=r;c.port2.postMessage(0);});mc.push(Math.round(performance.now()-a));}
run=false;o.push('timeouts '+ts.join(','),'msgch '+mc.join(','),'frames '+fr+' maxgap '+Math.round(mx),'longtasks '+lt.slice(0,20).join(','));return o.join('\n');}));});
