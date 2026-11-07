// ================================================================ v44: 🎯 throw TNT where you're facing — distance slider (works from anything: walking, driving, flying). Walking throws get an automatic ×4 bonus.
if(TNT.throwD==null)TNT.throwD=25;
function tntAimDir(){const v=new V3(0,0,-1).applyQuaternion(cam.quaternion);v.y=0;if(v.lengthSq()<1e-4){const y=WALK.on?(WALK.yaw||0):D.yaw;v.set(-Math.sin(y),0,-Math.cos(y));}return v.normalize();}
function tntThrowDist(){return(TNT.throwD||0)*(WALK.on?4:1);}
{const d0=tntDrop;tntDrop=function(){const n0=TNTS.length;const r=d0.apply(this,arguments);try{const dist=tntThrowDist();
    for(let i=n0;i<TNTS.length;i++){const T=TNTS[i];if(!T.own||T.bi||T.kind==='rocket'||T.small)continue;if(dist<=0.5)continue;
      const dir=tntAimDir(),th=WALK.on?0.7:0.45,g=9.8,h=Math.max(0,T.p.y-H(T.p.x,T.p.z));
      // speed so it lands about `dist` away (accounts for dropping from up high)
      let v0=Math.sqrt(g*dist/Math.max(0.2,Math.sin(2*th)));if(h>2)v0*=Math.max(0.35,1-h/(dist+h)*0.8);
      const carry=WALK.on?new V3():new V3(D.vel.x,0,D.vel.z);T.v.set(dir.x*v0*Math.cos(th),v0*Math.sin(th),dir.z*v0*Math.cos(th)).add(carry);
      if(T.air||T.cust){T.rest=false;}T.landed=!!(T.air||T.cust);}}catch(e){console.warn('throw',e);}return r;};}
{const i0=tntTypeItems;tntTypeItems=function(){const L=i0();L.splice(1,0,mBig('🎯 Throw distance (where you face)',()=>TNT.throwD,v=>{TNT.throwD=v;saveTnt();},0,150,1,v=>v?v+' m'+(WALK.on?'  (×4 walking = '+v*4+' m)':'  (×4 when walking)'):'just drop it'));return L;};}
{const i0=exItems;exItems=function(){const L=i0();L.splice(5,0,mBig('🎯 TNT throw distance (where you face)',()=>TNT.throwD,v=>{TNT.throwD=v;saveTnt();},0,150,1,v=>v?v+' m (×4 walking)':'just drop it'));return L;};}
