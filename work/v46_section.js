// ================================================================ v46: 📏 every kind of TNT has its OWN size (set it right in 💣 TNT type)
const TNT_SZ0={classic:30,cluster:30,sticky:20,timer:30,mega:120,bouncy:20,homing:20,rocket:20,mine:15,depth:30,fire:20,freeze:25,shock:30,carpet:15,smoke:25,party:15,nuke:300};
TNT.sz=Object.assign({},TNT_SZ0,TNT.sz||{});
function tntR(k){return TNT.sz[k||TNT.kind]!=null?TNT.sz[k||TNT.kind]:30;}
function tntSyncR(){TNT.r=tntR(TNT.kind);}
tntSyncR();
// changing kind → the size follows that kind
{const n0=tntKindNext;tntKindNext=function(){const r=n0.apply(this,arguments);tntSyncR();saveTnt();return r;};}
// MEGA and NUKE now use their own size (no hidden ×4 / ×10)
{const d0=tntDrop;tntDrop=function(){tntSyncR();const n0=TNTS.length;const r=d0.apply(this,arguments);for(let i=n0;i<TNTS.length;i++){const T=TNTS[i];if(T.own&&!T.bi&&!T.small&&(T.kind==='mega'||T.kind==='nuke')){T.r=tntR(T.kind);T.dr=Math.max(TNT.dr,T.r*0.4);}}return r;};}
// the blast-size slider in Explosion settings now sets the size of the kind you have picked
{const i0=exItems;exItems=function(){const L=i0();const j=L.findIndex(x=>/TNT blast size/.test(String(x.label())));if(j>=0)L[j]=mBig('💣 Size of '+TNTK[TNT.kind].n+' TNT',()=>tntR(),v=>{TNT.sz[TNT.kind]=v;tntSyncR();saveTnt();},1,Math.max(200,TNT_SZ0[TNT.kind]*2),1,v=>v+' m'+(WPN.blast>0?'  ('+Math.round(v/WPN.blast*10)/10+'× a rocket)':''));return L;};}
// 💣 TNT type: size slider for the one you picked + every kind shows its size; ◀ ▶ on a kind changes its size
tntTypeItems=function(){return[mInfo('💣 Pick your TNT, and set how BIG each one is. Then tap the 💣 button (or press 0) to drop it.'),
  mBig(()=>'📏 Size of '+TNTK[TNT.kind].n,()=>tntR(),v=>{TNT.sz[TNT.kind]=v;tntSyncR();saveTnt();renderMenu();},1,Math.max(200,TNT_SZ0[TNT.kind]*2),1,v=>v+' m'+(WPN.blast>0?' ('+Math.round(v/WPN.blast*10)/10+'× rocket)':'')),
  mBig('🎯 Throw distance (where you face)',()=>TNT.throwD,v=>{TNT.throwD=v;saveTnt();},0,150,1,v=>v?v+' m  (×4 walking)':'just drop it'),
  ...Object.keys(TNTK).map(k=>mItem(()=>(TNT.kind===k?'✅ ':'')+TNTK[k].n+' · '+tntR(k)+' m — '+TNTK[k].d,()=>{TNT.kind=k;tntSyncR();saveTnt();tntBtnLabel();toast(TNTK[k].n+' TNT ready · '+tntR(k)+' m',1400);renderMenu();},
    d=>{const st=tntR(k)>=100?10:tntR(k)>=30?5:1;TNT.sz[k]=Math.max(1,tntR(k)+d*st);if(k===TNT.kind)tntSyncR();saveTnt();renderMenu();})),
  mItem('↩️ All TNT sizes back to normal',()=>{TNT.sz=Object.assign({},TNT_SZ0);tntSyncR();saveTnt();toast('↩️ TNT sizes reset',1200);renderMenu();}),
  mItem('💥 More explosion settings (fuse, rockets…) ▸',()=>menuPush('💥 Explosion settings',exItems())),mItem('◀ Back',()=>menuBack())];};
