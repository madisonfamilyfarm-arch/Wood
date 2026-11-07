const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(2);DZ.on=true;});await P.waitForTimeout(1500);
  console.log(await P.evaluate(()=>{const fns=Object.keys(window).filter(k=>/Items$/.test(k)&&typeof window[k]==='function');return fns.length+' menus: '+fns.join(',');}));
  console.log('index size',await P.evaluate(()=>msIndex().length));
  for(const q of ['weapons','tnt','armor','voice','room','rocket blast','smooth','phone','fix']){console.log(q,'→',await P.evaluate(q=>{menuToggle(true);const i=$('menuSearch');i.value=q;msRun();return menu.items.slice(0,5).map(x=>String(x.label()).replace(/<[^>]+>/g,'')).join(' | ');},q));}
  await P.screenshot({path:'ms.png'});
  console.log(await P.evaluate(()=>{const i=$('menuSearch');i.value='';msRun();menuToggle(false);chatSys('💥 Pilot blew up Ace');chatSys('hello sys');chatAdd('Ace','hi there');CHT.hide=true;chtDraw();chatAdd('Ace','second');chatAdd('Ace','third');chtDraw();return 'chat lines '+CHAT.map(c=>c.txt).slice(-4).join(' / ')+' | tog: '+$('chatTog').textContent+' | display '+$('chatTog').style.display;}));
});
