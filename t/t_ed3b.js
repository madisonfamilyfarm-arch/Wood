const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  const errs=[];P.on('pageerror',e=>errs.push(e.message));
  for(const k of Object.keys(await P.evaluate(()=>KITS)).concat(['drone'])){
    const r=await P.evaluate(k=>{const out=[];try{bsOpen(k,null);bsClose();const s0=histSnap();
      // add every part in the list by "tapping" it
      let added=0,bad=[];for(let i=0;i<WSI.length;i++){const it=WSI[i];if(it.imp)continue;try{const xy=wsFreeSpot(it.t);const p=wsDefault(it,xy[0],xy[1],xy[2]);wsSnap(p);WS.parts.push(p);WS.sel=WS.parts.length-1;wsChanged();added++;}catch(e){bad.push(it.n+':'+e.message);}}
      // every tool on the last part
      const tools=['rotL','rotR','tiltF','tiltB','rollL','rollR','level','long','short','shrink','expand','wide','thin','up','down','left','right','fwd','back','shrinkAll','expandAll','mat','type','power','copyArms','del'];let tbad=[];
      for(const t of tools){try{WS.sel=Math.max(0,WS.parts.length-1);wsTool(t);}catch(e){tbad.push(t+':'+e.message);}}
      const sp=wsSpec(),st=stats(sp);
      // undo everything back to the start, then redo all
      let n=0;while(HIST.u.length&&n<400){histUndo();n++;}const back=histSnap()===s0;let df="";if(!back){const a=s0,c=histSnap();for(let i=0;i<Math.max(a.length,c.length);i++)if(a[i]!==c[i]){df=a.slice(i-40,i+40)+" VS "+c.slice(i-40,i+40);break;}}let m=0;while(HIST.r.length&&m<400){histRedo();m++;}
      out.push(k.padEnd(8)+' parts+'+added+(bad.length?' BAD '+bad.slice(0,3):'')+' tools'+(tbad.length?' BAD '+tbad.slice(0,3):' ok')+' | why="'+(st.why||'')+'" | undo x'+n+' back to start: '+back+' '+df+' | redo x'+m);
      closeWorkshop();}catch(e){out.push(k+' ERR '+e.message+' '+(e.stack||'').split('\n')[1]);}return out.join('');},k);console.log(r);}
  console.log('page errors:',errs.slice(0,5));
});
