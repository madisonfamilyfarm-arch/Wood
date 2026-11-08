// opens EVERY submenu (2 levels deep) in every category and renders it; logs any error
const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(2);});await P.waitForTimeout(1000);
console.log(await P.evaluate(async()=>{const errs=[];let n=0;menuToggle(true);const isSub=it=>{try{return /▸|▶\s*$/.test(String(it.label()));}catch(e){return false;}};
 const visit=async(title,items,depth)=>{for(let i=0;i<items.length;i++){const it=items[i];let lab='';try{lab=String(it.label());if(it.range)it.range.get();if(it.swatch)it.swatch();}catch(e){errs.push(title+' > item '+i+': '+e.message);continue;}
   if(depth<2&&isSub(it)&&it.act){const before=menu.stack?menu.stack.length:0;const t0=menu.title;try{it.act();n++;renderMenu();}catch(e){errs.push(title+' > '+lab.slice(0,30)+': '+e.message);}
     if(menu.title!==t0){const sub=menu.items.slice();await visit(title+' > '+lab.slice(0,20),sub,depth+1);try{menuBack();}catch(e){}}}}};
 for(const c of MCAT){menuPush(c[1],mCatItems(c[0]));renderMenu();await visit(c[0],menu.items.slice(),0);while(menu.title!==c[1]&&menu.stack&&menu.stack.length)try{menuBack();}catch(e){break;}menuBack();}
 menuToggle(false);return 'submenus opened '+n+'\nerrors:\n'+(errs.join('\n')||'none');}));});
