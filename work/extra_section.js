// ================================================================ 🛤 more trails (➕ button adds one each click) · 🎲 dice: roll a brand-new airport
var XT={list:LS.get('xtrails',[]),T:[],grid:{},n:0};
function xtMake(seed,idx){const r=uwRnd(seed);let cx,cz;for(let t=0;t<60;t++){const a=r()*6.28,d=230+r()*520;cx=Math.cos(a)*d;cz=Math.sin(a)*d;if(lakeE(cx,cz)>3&&Math.hypot(cx-FLD.x,cz-FLD.z)>160)break;}
  const n=9+Math.floor(r()*6),R=45+r()*75,pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,rr=R*(0.65+r()*0.7);pts.push(new V3(cx+Math.cos(a)*rr,0,cz+Math.sin(a)*rr*(0.7+r()*0.5)));}
  const curve=new THREE.CatmullRomCurve3(pts,true,'catmullrom',0.5),L=curve.getLength(),S=curve.getSpacedPoints(Math.max(60,Math.round(L/1.5)));S.pop();
  const T={seed,idx,S,curve,cx,cz,name:'🛤️ Trail '+(idx+2)+' '+['(pines)','(twisty)','(ridge)','(creek)','(deep woods)','(loop)'][seed%6]};
  S.forEach((p,i)=>{const k=Math.floor(p.x/12)+','+Math.floor(p.z/12);(XT.grid[k]=XT.grid[k]||[]).push(p);});return T;}
function xtDist(x,z){if(!XT.n)return 1e9;let best=1e9;const cx=Math.floor(x/12),cz=Math.floor(z/12);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=XT.grid[(cx+a)+','+(cz+b)];if(L)for(const p of L){const d=(p.x-x)*(p.x-x)+(p.z-z)*(p.z-z);if(d<best)best=d;}}return Math.sqrt(best);}
function xtCourse(T){const key='xt'+T.seed;if(courses[key])return;const as=[],S=T.S,k0=12+Math.floor(S.length/30);
  for(let k=0;k<k0;k++){const i=Math.floor((k+0.3)/k0*S.length),p=S[i],q=S[(i+3)%S.length];as.push(makeGate(new V3(p.x,0,p.z),q.clone().sub(p),4.4,3.6,'arch'));}
  const s0=S[0],s1=S[4];courses[key]={key,name:T.name,cps:as,start:{x:s0.x-(s1.x-s0.x)*3,z:s0.z-(s1.z-s0.z)*3,yaw:Math.atan2(-(s1.x-s0.x),-(s1.z-s0.z))}};if(!COURSE_ORDER.includes(key))COURSE_ORDER.splice(3+T.idx,0,key);
  const lb=label(T.name+' — start here',s0.x,H(s0.x,s0.z)+3.4,s0.z,5);T.label=lb;}
function xtBuildAll(){XT.grid={};XT.T=XT.list.map((sd,i)=>xtMake(sd,i));XT.n=XT.T.length;XT.T.forEach(xtCourse);}
function xtAdd(fromNet){const sd=1+Math.floor(Math.random()*2e9);XT.list.push(sd);LS.set('xtrails',XT.list);const T=xtMake(sd,XT.list.length-1);XT.T.push(T);XT.n=XT.T.length;xtCourse(T);
  if(typeof CES==='undefined'||!CES.on)aptAfter();toast('🛤️ New trail made: '+T.name+' — Menu → 🏁 Races & games to race it, or follow the dirt path on the map',3500);beep(900,0.1,0.05);}
function xtClear(){XT.list=[];LS.set('xtrails',[]);toast('🗑 Extra trails removed — restarting…',1500);setTimeout(()=>location.reload(),900);}
{const w0=worldState;worldState=function(){const w=w0();w.xt=XT.list.slice();return w;};}
{const a0=applyWorld;applyWorld=function(w){const r=a0.apply(this,arguments);if(w&&Array.isArray(w.xt)&&JSON.stringify(w.xt)!==JSON.stringify(XT.list)){const add=w.xt.filter(s=>!XT.list.includes(s));if(add.length&&w.xt.length>=XT.list.length){add.forEach(sd=>{XT.list.push(sd);const T=xtMake(sd,XT.list.length-1);XT.T.push(T);XT.n=XT.T.length;xtCourse(T);});LS.set('xtrails',XT.list);if(typeof CES==='undefined'||!CES.on)aptAfter();toast('🛤️ Someone made a new trail',2000);}}return r;};}
xtBuildAll();
// ---- 🎲 roll a new airport: random spot, direction, length, width, surface and style
function aptDice(){const r=Math.random;let x=0,z=0;for(let t=0;t<80;t++){const a=r()*6.28,d=60+r()*380;x=Math.cos(a)*d;z=Math.sin(a)*d;if(lakeE(x,z)>1.8&&Math.hypot(x-PAD.x,z-PAD.z)>45&&rectD(x,z,ARENA)>60&&(!XT.n||xtDist(x,z)>40))break;}
  Object.assign(FLD,{on:true,x:+x.toFixed(1),z:+z.toFixed(1),yaw:+(r()*Math.PI*2).toFixed(3),len:Math.round(70+r()*170),w:Math.round(8+r()*14),surf:r()<0.6?'paved':'grass',pits:r()<0.8,style:r()<0.5?'old':'club'});
  fldSave();fldBuild();beep(700,0.06,0.05);setTimeout(()=>beep(1000,0.06,0.05),90);toast('🎲 New airport! '+(FLD.style==='old'?'🏚 old-style':'🏟 club field')+' · '+FLD.len+' m '+(FLD.surf==='paved'?'paved':'grass')+' runway — it\'s on the map',3200);}
{const f0=fldItems;fldItems=function(){const L=f0();L.splice(1,0,mItem('🎲 Roll a brand-new airport (random spot, size + style)',()=>aptDice()));return L;};}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Races & games/.test(it.label());}catch(e){return false;}});
  L.splice(i+1,0,mItem(()=>'➕ 🛤️ Add another trail'+(XT.n?' ('+XT.n+' extra so far)':''),()=>xtAdd()),mItem('🎲 Roll a new airport',()=>aptDice()));
  if(XT.n){const j=L.findIndex(it=>{try{return /Add another trail/.test(it.label());}catch(e){return false;}});}return L;};}
{const r0=raceItems;raceItems=function(){const L=r0();L.push(mItem('➕ Add another trail (each click = one more)',()=>xtAdd()));if(XT.n)L.push(mItem('🗑 Remove the extra trails',()=>xtClear()));return L;};}
