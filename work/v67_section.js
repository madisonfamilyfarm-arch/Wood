// v67: stop pestering the network (HTML-viewer apps pop up "blocked" boxes), Undo/Redo clear of the stats text on a phone,
//      parts snap ON when you drop them near the build (tank treads go right onto the side), 🧲 fix loose parts, ✈️ airliner + 🛸 flying tank kits
const NET_WEB=/^https?:$/.test(location.protocol);
// ---------------------------------------------------------------- 🌐 the AI-computer search only runs when it can work, and backs off after a miss
{const f0=aiFetchJ;let missT=0;aiFetchJ=function(url,opt,ms){try{const same=String(url).startsWith(location.origin)&&NET_WEB;const act=navigator.userActivation&&navigator.userActivation.isActive;
  if(!same&&!act){if(!NET_WEB)return Promise.reject(new Error('offline file — tap "Test the AI computer" in the AI menu to try'));if(performance.now()<missT)return Promise.reject(new Error('AI computer not found (will retry later)'));}}catch(e){}
  return f0.apply(this,arguments).catch(e=>{missT=performance.now()+10*60000;throw e;});};}
// ---------------------------------------------------------------- 📱 Undo/Redo sit at the bottom of the picture when the phone is upright (the stats line can be long)
(function(){const st=document.createElement('style');st.textContent=`body.pt #ws #wsUR{top:auto!important;bottom:8px!important}`;document.head.appendChild(st);})();
// ---------------------------------------------------------------- 🧲 snapping: a part dropped near the build sticks to it
const SNAPAX=(()=>{let m=null;return function(){if(m)return m;try{const p=cleanPart({t:'shape',style:'box',w:2,len:2,d:2,x:0,y:0,h:0});const b0=partBox(p);m={};for(const k of ['x','y','h']){const q=Object.assign({},p);q[k]+=1;const b1=partBox(q);for(let i=0;i<3;i++){const d=b1.mn[i]-b0.mn[i];if(Math.abs(d)>0.5){m[k]=[i,Math.sign(d)];}}}}catch(e){m={x:[0,1],h:[1,1],y:[2,1]};}return m;};})();
function snapLooseIdx(){try{return partsInfo({parts:WS.parts,wires:WS.wires}).loose||[];}catch(e){return [];}}
function snapAttach(p,maxGap){const ax=SNAPAX();let cs;try{cs=connectedParts(WS.parts);}catch(e){cs=null;}const others=WS.parts.filter((q,i)=>q!==p&&(!cs||cs.has(i)));if(!others.length)return false;let pb;try{pb=partBox(p);}catch(e){return false;}
  let best=null,bd=1e9;for(const q of others){let qb;try{qb=partBox(q);}catch(e){continue;}const g=[0,0,0];for(let i=0;i<3;i++){if(pb.mx[i]<qb.mn[i])g[i]=qb.mn[i]-pb.mx[i]+0.15;else if(pb.mn[i]>qb.mx[i])g[i]=qb.mx[i]-pb.mn[i]-0.15;}const d=Math.hypot(g[0],g[1],g[2]);if(d<bd){bd=d;best=g;}}
  if(!best||bd>(maxGap||1e9))return false;for(const k of ['x','y','h']){const [i,s]=ax[k];p[k]=+(p[k]+best[i]*s).toFixed(2);}return true;}
// treads and wheels line up with the ones already there and hug the side of the hull
function snapWheel(p){if(p.t!=='wheel')return;const sib=WS.parts.filter(q=>q!==p&&q.t==='wheel'&&(q.style==='tread')===(p.style==='tread'));if(!sib.length)return;
  const s=sib.reduce((a,q)=>Math.abs(q.x+p.x)<Math.abs(a.x+p.x)?q:a,sib[0]);   // the mirror one on the other side, if there is one
  if(Math.hypot(p.h-s.h,0)<20){p.h=s.h;if(p.style==='tread')p.y=s.y;}
  const hull=WS.parts.filter(q=>q.t==='shape'||q.t==='body').sort((a,b)=>(b.w||0)*(b.len||0)-(a.w||0)*(a.len||0))[0];
  if(hull&&p.style==='tread'){const side=p.x<hull.x?-1:1;const want=hull.x+side*((hull.w||10)/2+(p.w||4)/2);if(Math.abs(p.x-want)<14)p.x=+want.toFixed(1);}}
{const s0=wsSnap;wsSnap=function(p){const r=s0.apply(this,arguments);try{if(p&&WS.parts.includes(p)){snapWheel(p);const i=WS.parts.indexOf(p);if(snapLooseIdx().includes(i))snapAttach(p,14);}}catch(e){}return r;};}
function fixLoose(){const L=snapLooseIdx();if(!L.length){toast('🧲 Nothing loose — everything is attached!',1600);return;}let n=0;
  for(let pass=0;pass<3;pass++){const idx=snapLooseIdx();if(!idx.length)break;idx.forEach(i=>{const p=WS.parts[i];if(!p)return;snapWheel(p);if(snapAttach(p))n++;});}
  wsChanged();const left=snapLooseIdx().length;toast(left?'🧲 Attached '+n+' — '+left+' still loose':'🧲 All loose parts snapped back on!',2000);}
{const u0=wsBuildUI;wsBuildUI=function(){const r=u0.apply(this,arguments);try{const T=$('wsTools');if(T&&!$('wsFixLoose')){const b=document.createElement('button');b.id='wsFixLoose';b.className='btn wide';b.textContent='🧲 snap loose parts back on';b.onclick=()=>fixLoose();const ref=[...T.querySelectorAll('.btn')].find(x=>/How it moves/.test(x.textContent));if(ref)ref.after(b);else T.appendChild(b);}}catch(e){}return r;};}
// ---------------------------------------------------------------- ✈️ airliner + 🛸 flying tank
KITS.jet={n:'✈️ Passenger jet',flyAs:'plane',wp:false,parts:[
  // fuselage, nose, tail cone
  {t:'shape',style:'capsule',w:10,len:72,d:10,h:0,col:'#f4f6f8'},{t:'shape',style:'cone',w:9,len:10,d:9,y:-38,h:0.3,rx:-90,col:'#f4f6f8'},{t:'shape',style:'cone',w:7,len:12,d:7,y:39,h:1.5,rx:90,col:'#dfe3e8'},
  // cockpit windows + cabin window stripe + red/blue cheat lines
  {t:'shape',style:'wedge',mat:'glass',w:6,len:4,d:2,y:-33,h:3.2,col:'#1b2a3a'},{t:'strip',x:-5.1,y:-4,h:1.5,len:52,col:'#9fd3ff'},{t:'strip',x:5.1,y:-4,h:1.5,len:52,col:'#9fd3ff'},
  {t:'strip',x:-5.2,y:-2,h:-0.6,len:58,col:'#c8102e'},{t:'strip',x:5.2,y:-2,h:-0.6,len:58,col:'#c8102e'},{t:'strip',x:-5.1,y:-2,h:-1.8,len:58,col:'#0a3a8c'},{t:'strip',x:5.1,y:-2,h:-1.8,len:58,col:'#0a3a8c'},
  // main wing, flaps, slats, winglets
  {t:'wing',w:96,len:15,d:1.5,y:2,h:-3,col:'#c9ced6'},
  {t:'shape',style:'box',w:22,len:3.5,d:0.6,x:-16,y:10.5,h:-3.4,col:'#9aa3ad'},{t:'shape',style:'box',w:22,len:3.5,d:0.6,x:16,y:10.5,h:-3.4,col:'#9aa3ad'},
  {t:'shape',style:'box',w:14,len:3,d:0.5,x:-36,y:10.2,h:-3.2,col:'#b0b8c2'},{t:'shape',style:'box',w:14,len:3,d:0.5,x:36,y:10.2,h:-3.2,col:'#b0b8c2'},
  {t:'shape',style:'box',w:40,len:2,d:0.5,x:-27,y:-6,h:-2.7,col:'#e2e6ea'},{t:'shape',style:'box',w:40,len:2,d:0.5,x:27,y:-6,h:-2.7,col:'#e2e6ea'},
  {t:'wing',w:9,len:7,d:1,x:-48,y:4,h:1,rz:80,col:'#0a3a8c'},{t:'wing',w:9,len:7,d:1,x:48,y:4,h:1,rz:-80,col:'#0a3a8c'},
  // two big jet engines on pylons
  {t:'shape',style:'box',w:1.6,len:8,d:3,x:-18,y:-1,h:-5,col:'#c9ced6'},{t:'shape',style:'box',w:1.6,len:8,d:3,x:18,y:-1,h:-5,col:'#c9ced6'},
  {t:'jet',x:-18,y:-2,h:-8,w:6,len:14,pow:6},{t:'jet',x:18,y:-2,h:-8,w:6,len:14,pow:6},
  // tail: stabilizers + tall fin in red/white/blue stripes
  {t:'wing',w:34,len:10,d:1,y:33,h:2,col:'#c9ced6'},{t:'wing',w:16,len:13,d:1.2,y:33,h:10,rz:90,col:'#f4f6f8'},
  {t:'shape',style:'box',w:1.4,len:10,d:3,y:34,h:13,col:'#c8102e'},{t:'shape',style:'box',w:1.4,len:10,d:3,y:34,h:10,col:'#f4f6f8'},{t:'shape',style:'box',w:1.4,len:10,d:3,y:34,h:7,col:'#0a3a8c'},
  // landing gear
  {t:'leg',y:-26,h:-6},{t:'wheel',x:0,y:-26,h:-9,r:1.8,w:1.4},{t:'leg',x:-5,y:4,h:-6},{t:'leg',x:5,y:4,h:-6},{t:'wheel',x:-5,y:4,h:-9,r:2.2,w:2},{t:'wheel',x:5,y:4,h:-9,r:2.2,w:2},
  // nav lights (red left, green right, white tail strobe), crazy extras: belly rocket boosters
  {t:'light',x:-48,y:2,h:-2.5,col:'#ff2020'},{t:'light',x:48,y:2,h:-2.5,col:'#20ff40'},{t:'light',style:'strobe',y:40,h:3,col:'#ffffff'},{t:'light',y:-2,h:5.4,col:'#ff3030'},
  {t:'rocket',x:-4,y:24,h:-5,w:3,len:10,pow:3},{t:'rocket',x:4,y:24,h:-5,w:3,len:10,pow:3},
  {t:'antenna',y:-10,h:5.5},{t:'battery',h:-2,w:5,len:10},
  {t:'camera',style:'fpv',y:-34,h:3,nm:'Cockpit cam'},{t:'camera',style:'fpv',x:-46,y:3,h:-1.5,nm:'Left wingtip cam'},{t:'camera',style:'fpv',y:30,h:15,nm:'Tail cam'}]};
KITS.ftank={n:'🛸 Flying tank',flyAs:'combo',wp:true,parts:[
  {t:'shape',style:'box',w:22,len:34,d:8,h:3,col:'#5b6b3a'},{t:'shape',style:'wedge',w:22,len:6,d:4,y:-19,h:2,col:'#4f5e33'},
  {t:'wheel',style:'tread',x:-14,y:0,h:0,r:3.5,w:6,len:34,col:'#3a4428'},{t:'wheel',style:'tread',x:14,y:0,h:0,r:3.5,w:6,len:34,col:'#3a4428'},
  {t:'shape',style:'cyl',w:14,len:14,d:5,h:9.5,col:'#4f5e33'},{t:'gun',style:'rocket',y:-12,h:10,len:16},{t:'gun',style:'mg',x:4,y:-4,h:13,len:8},
  {t:'hover',x:-14,y:-13,h:-4.5},{t:'hover',x:14,y:-13,h:-4.5},{t:'hover',x:-14,y:13,h:-4.5},{t:'hover',x:14,y:13,h:-4.5},
  {t:'wing',w:56,len:10,d:1.2,y:4,h:5,col:'#4a5530'},{t:'jet',x:-7,y:20,h:4,w:5,len:12,pow:6},{t:'jet',x:7,y:20,h:4,w:5,len:12,pow:6},
  {t:'light',x:-28,y:4,h:5.5,col:'#ff2020'},{t:'light',x:28,y:4,h:5.5,col:'#20ff40'},{t:'strip',x:-11.3,y:0,h:3,len:30,col:'#00e5ff'},{t:'strip',x:11.3,y:0,h:3,len:30,col:'#00e5ff'},
  {t:'battery',h:7.5,w:5,len:9,x:-4,y:8},{t:'battery',h:7.5,w:5,len:9,x:4,y:8},{t:'antenna',x:-5,y:6,h:13},
  {t:'camera',style:'fpv',y:-7,h:13,nm:'Turret cam'},{t:'camera',style:'fpv',y:-20,h:2,nm:'Front cam'}]};
{const b0=buildItems;buildItems=function(){const L=b0();try{const i=L.findIndex(it=>{try{return String(it.label?it.label():'')===KITS.plane.n||String(it.label?it.label():'').startsWith(KITS.plane.n.split(' — ')[0]);}catch(e){return false;}});
  const add=[mItem(KITS.jet.n,()=>{menuToggle(false);bsStart('jet');}),mItem(KITS.ftank.n,()=>{menuToggle(false);bsStart('ftank');})];if(i>=0)L.splice(i+1,0,...add);else L.push(...add);}catch(e){}return L;};}
// new kits: anything that ended up not touching gets snapped on
{const o0=openKit;openKit=function(k){const r=o0.apply(this,arguments);try{if(k==='jet'||k==='ftank'){for(let pass=0;pass<3;pass++){const idx=snapLooseIdx();if(!idx.length)break;idx.forEach(i=>{const p=WS.parts[i];if(p)snapAttach(p);});}wsChanged();}}catch(e){}return r;};}
