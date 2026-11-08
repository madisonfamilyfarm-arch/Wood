// v71: lots more things to build — RC classics + crazy inventions that never really worked (they do here!)
Object.assign(KITS,{
 saucer:{n:'🛸 Flying saucer',flyAs:'combo',wp:true,parts:[{t:'shape',style:'disc',mat:'metal',w:40,len:40,d:6,col:'#b8c2cc'},{t:'shape',style:'sphere',mat:'glass',w:14,len:14,d:10,h:4,col:'#9fd3ff'},
   {t:'hover',x:-12,y:-12,h:-3.5},{t:'hover',x:12,y:-12,h:-3.5},{t:'hover',x:-12,y:12,h:-3.5},{t:'hover',x:12,y:12,h:-3.5},{t:'strip',x:-19,y:0,h:0,len:20,col:'#39ff14'},{t:'strip',x:19,y:0,h:0,len:20,col:'#39ff14'},
   {t:'light',style:'strobe',y:-19,h:0,col:'#39ff14'},{t:'light',y:19,h:0,col:'#ff00ff'},{t:'battery',h:-2,w:5,len:9},{t:'camera',style:'fpv',y:-6,h:6,nm:'Alien cam'}]},
 screw:{n:'🌀 Da Vinci air screw (1489 invention!)',flyAs:'combo',wp:false,parts:[{t:'shape',style:'box',w:22,len:22,d:3,col:'#8b5a2b'},{t:'shape',style:'cyl',w:3,len:3,d:22,h:12,col:'#6b4423'},
   {t:'shape',style:'cone',w:36,len:36,d:10,h:20,col:'#f2e3c6'},{t:'shape',style:'torus',w:34,len:34,d:2,h:16,col:'#a0522d'},{t:'shape',style:'torus',w:24,len:24,d:2,h:22,col:'#a0522d'},
   {t:'sprop',x:0,y:0,h:26},{t:'hover',x:-8,y:-8,h:-2.5},{t:'hover',x:8,y:-8,h:-2.5},{t:'hover',x:-8,y:8,h:-2.5},{t:'hover',x:8,y:8,h:-2.5},{t:'battery',h:2,w:5,len:9},{t:'camera',style:'fpv',y:-11,h:3,nm:'Leonardo cam'}]},
 hovercraft:{n:'🛥 Hovercraft',flyAs:'combo',wp:true,parts:[{t:'shape',style:'box',w:20,len:32,d:5,h:2,col:'#ff9f0a'},{t:'shape',style:'torus',w:26,len:38,d:5,h:-1,col:'#222222'},
   {t:'shape',style:'box',w:10,len:10,d:6,y:-6,h:6,mat:'glass',col:'#9fd3ff'},{t:'hover',x:-7,y:-10,h:-2},{t:'hover',x:7,y:-10,h:-2},{t:'hover',x:-7,y:10,h:-2},{t:'hover',x:7,y:10,h:-2},
   {t:'jet',x:-5,y:17,h:6,w:6,len:8,pow:4},{t:'jet',x:5,y:17,h:6,w:6,len:8,pow:4},{t:'wing',w:2,len:6,d:8,y:20,h:8,rz:90,col:'#ff3b30'},{t:'battery',h:5,w:5,len:9},{t:'camera',style:'fpv',y:-10,h:9,nm:'Driver cam'}]},
 blimp:{n:'🎈 Blimp',flyAs:'drone',wp:false,parts:[{t:'shape',style:'capsule',w:22,len:60,d:22,h:14,col:'#e8e8e8'},{t:'shape',style:'box',w:8,len:14,d:5,h:0,col:'#333333'},
   {t:'wing',w:2,len:10,d:14,y:28,h:18,rz:90,col:'#0a84ff'},{t:'wing',w:24,len:10,d:1.4,y:28,h:14,col:'#0a84ff'},{t:'sprop',x:-6,y:4,h:0},{t:'sprop',x:6,y:4,h:0},{t:'sprop',x:0,y:-20,h:20},{t:'sprop',x:0,y:20,h:20},
   {t:'light',style:'strobe',y:-30,h:14,col:'#ffffff'},{t:'battery',h:2,w:5,len:9},{t:'camera',style:'fpv',y:-7,h:-1,nm:'Gondola cam'}]},
 glider:{n:'🪁 Glider',flyAs:'plane',wp:false,parts:[{t:'shape',style:'capsule',w:6,len:44,d:6,col:'#ffffff'},{t:'wing',w:110,len:10,d:1,h:2,col:'#ffd60a'},{t:'wing',w:22,len:7,d:0.8,y:20,h:1},
   {t:'wing',w:9,len:7,d:0.8,y:20,h:5,rz:90,col:'#ffd60a'},{t:'jet',y:-22,h:0,w:3,len:6,pow:4},{t:'wheel',y:-2,h:-3.5,r:2},{t:'battery',h:-1,w:4,len:8},{t:'camera',style:'fpv',y:-16,h:3,nm:'Cockpit'}]},
 biplane:{n:'🛩 Biplane',flyAs:'plane',wp:false,parts:[{t:'shape',style:'box',w:8,len:34,d:8,col:'#c8102e'},{t:'wing',w:60,len:12,d:1.4,h:-3,col:'#f4e4c1'},{t:'wing',w:60,len:12,d:1.4,h:9,col:'#f4e4c1'},
   {t:'shape',style:'cyl',w:1,len:1,d:12,x:-20,h:3,col:'#6b4423'},{t:'shape',style:'cyl',w:1,len:1,d:12,x:20,h:3,col:'#6b4423'},{t:'wing',w:20,len:8,d:1,y:15,h:1},{t:'wing',w:8,len:8,d:1,y:15,h:5,rz:90,col:'#c8102e'},
   {t:'jet',y:-19,h:0,w:5,len:4,pow:7},{t:'wheel',x:-6,y:-8,h:-7,r:2.5},{t:'wheel',x:6,y:-8,h:-7,r:2.5},{t:'leg',x:-5,y:-8,h:-5},{t:'leg',x:5,y:-8,h:-5},{t:'battery',h:0,w:4,len:8},{t:'camera',style:'fpv',y:-6,h:6,nm:'Pilot cam'}]},
 spacerocket:{n:'🚀 Space rocket',flyAs:'combo',wp:false,parts:[{t:'shape',style:'cyl',w:10,len:10,d:60,h:30,col:'#f2f2f2'},{t:'shape',style:'cone',w:10,len:10,d:14,h:67,col:'#ff3030'},
   {t:'rocket',h:-4,w:6,len:12,pow:8,rx:90},{t:'rocket',x:-7,h:2,w:3,len:10,pow:5,rx:90},{t:'rocket',x:7,h:2,w:3,len:10,pow:5,rx:90},
   {t:'wing',w:24,len:10,d:1,h:4,col:'#0a84ff'},{t:'wing',w:24,len:10,d:1,h:4,rz:90,col:'#0a84ff'},{t:'shape',style:'box',w:10.4,len:10.4,d:2,h:50,col:'#111111'},{t:'battery',h:20,w:5,len:9},{t:'camera',style:'fpv',y:-6,h:55,nm:'Window cam'}]},
 crawler:{n:'🧗 Rock crawler',flyAs:'car',wp:true,parts:[{t:'shape',style:'box',w:14,len:26,d:4,h:6,col:'#34c759'},{t:'shape',style:'box',w:12,len:12,d:6,y:-2,h:11,mat:'glass',col:'#9fd3ff'},
   {t:'wheel',x:-10,y:-9,h:0,r:6,w:5},{t:'wheel',x:10,y:-9,h:0,r:6,w:5},{t:'wheel',x:-10,y:9,h:0,r:6,w:5},{t:'wheel',x:10,y:9,h:0,r:6,w:5},{t:'light',x:-5,y:-13,h:9,col:'#ffffff'},{t:'light',x:5,y:-13,h:9,col:'#ffffff'},
   {t:'battery',h:8,w:5,len:9},{t:'camera',style:'fpv',y:-12,h:7,nm:'Bumper cam'}]},
 ornithopter:{n:'🦅 Ornithopter (flapping-wing machine)',flyAs:'plane',wp:false,parts:[{t:'shape',style:'capsule',w:7,len:30,d:7,col:'#8b5a2b'},{t:'wing',w:34,len:14,d:1,x:-17,h:2,rz:-14,col:'#d2b48c'},{t:'wing',w:34,len:14,d:1,x:17,h:2,rz:14,col:'#d2b48c'},
   {t:'wing',w:16,len:8,d:1,y:15,h:1,col:'#d2b48c'},{t:'wing',w:7,len:6,d:1,y:15,h:4,rz:90,col:'#8b5a2b'},{t:'jet',y:-16,h:0,w:3,len:5,pow:6},{t:'wheel',y:4,h:-4,r:2},{t:'battery',h:0,w:4,len:8},{t:'camera',style:'fpv',y:-12,h:4,nm:'Beak cam'}]}});
const NEWKITS=['saucer','screw','hovercraft','blimp','glider','biplane','spacerocket','crawler','ornithopter'];
{const o0=openKit;openKit=function(k){const r=o0.apply(this,arguments);try{if(NEWKITS.includes(k)){for(let pass=0;pass<3;pass++){const idx=snapLooseIdx();if(!idx.length)break;idx.forEach(i=>{const p=WS.parts[i];if(p)snapAttach(p);});}wsChanged();}}catch(e){}return r;};}
{const b0=buildItems;buildItems=function(){const L=b0();try{const i=L.findIndex(it=>{try{return String(it.label?it.label():'')===KITS.ftank.n;}catch(e){return false;}});
  const add=NEWKITS.map(k=>mItem(KITS[k].n,()=>{menuToggle(false);bsStart(k);}));if(i>=0)L.splice(i+1,0,...add);else L.push(...add);}catch(e){}return L;};}
// 📱 short landscape screens (HTML viewer apps, small phones): the map shrinks and sits above the left stick instead of on top of it
(function(){const st=document.createElement('style');st.textContent=`
body.shortL #mapBox{width:66px!important;height:66px!important}
body.shortL #mapBox canvas{width:66px!important;height:66px!important}
body.shortL #mapBtns{left:80px!important;transform:scale(0.8);transform-origin:top left}`;document.head.appendChild(st);
  const fit=()=>{try{const land=innerWidth>innerHeight;const stl=$('stL'),mb=$('mapBox');let short=land&&innerHeight<430;
    if(short&&stl&&mb){document.body.classList.add('shortL');const a=mb.getBoundingClientRect(),b=stl.getBoundingClientRect();if(b.height&&a.bottom>b.top-4){const room=b.top-4-a.top;const s=Math.max(44,Math.min(66,room));mb.style.setProperty('width',s+'px','important');mb.style.setProperty('height',s+'px','important');}}
    else{document.body.classList.remove('shortL');if(mb){mb.style.removeProperty('width');mb.style.removeProperty('height');}}}catch(e){}};
  addEventListener('resize',()=>setTimeout(fit,120));setInterval(fit,2000);setTimeout(fit,1500);})();
// 🦅 the ornithopter really flaps: its wings hinge at the body and beat faster with more throttle
{const tk=()=>{try{if(started&&DR&&DR.g&&SPEC&&(SPEC.kit==='ornithopter'||/ornithopter|flapp/i.test(SPEC.name||''))&&SPEC.parts){const g=DR.g;
    if(!g.userData.flap){const piv=[];SPEC.parts.forEach((p,i)=>{if(p.t==='wing'&&Math.abs(p.x||0)>3&&!(Math.abs(p.rz||0)>60)){const c=g.children[i];if(!c)return;const pv=new THREE.Group();pv.position.set(0,c.position.y,c.position.z);g.add(pv);const off=c.position.clone().sub(pv.position);g.remove(c);c.position.copy(off);pv.add(c);piv.push({pv,side:Math.sign(p.x)});}});g.userData.flap={piv,ph:0};}
    const F=g.userData.flap,thr=vkind()==='plane'?(D.thr||0):0.5,fly=D.state==='flying';F.ph+=(fly?(2.2+thr*7):0.6)*0.016*6.283;const a=Math.sin(F.ph)*(fly?0.55:0.15);F.piv.forEach(o=>{o.pv.rotation.z=o.side*a;});}}catch(e){}requestAnimationFrame(tk);};requestAnimationFrame(tk);}
