const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  console.log(await P.evaluate(()=>{const o=[];const T=mainItems();o.push('FRONT: '+T.map(x=>String(x.label()).replace(/<[^>]+>/g,'').slice(0,40)).join(' | '));for(const k of MCAT.map(c=>c[0]).concat(['other']))o.push(k.toUpperCase()+': '+mCatItems(k).map(x=>String(x.label()).replace(/<[^>]+>/g,'').slice(0,28)).join(' | '));
    menuToggle(true);const i=$('menuSearch');i.value='weather';msRun();o.push('search weather → '+menu.items.slice(0,2).map(x=>String(x.label()).replace(/<[^>]+>/g,'')).join(' | '));return o.join('\n');}));
});
