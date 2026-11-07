// ---------------------------------------------------------------- ✈️ the airport (old airport or RC club field) — where it is, levelled ground, no trees on it
const FLD_KEY='fld',FLD_DEF={on:true,x:-110,z:-68,yaw:0,len:100,w:12,surf:'paved',pits:true,style:'old'};
const FLD=Object.assign({},FLD_DEF,LS.get(FLD_KEY,{}));
function fldSave(){LS.set(FLD_KEY,FLD);}
function fldR(){return{rx:Math.cos(FLD.yaw),rz:Math.sin(FLD.yaw),px:-Math.sin(FLD.yaw),pz:Math.cos(FLD.yaw)};}
function fldW(u,v){const r=fldR();return{x:FLD.x+r.rx*u+r.px*v,z:FLD.z+r.rz*u+r.pz*v};}
function fldUV(x,z){const r=fldR(),dx=x-FLD.x,dz=z-FLD.z;return{u:dx*r.rx+dz*r.rz,v:dx*r.px+dz*r.pz};}
const FU={h:0,cols:[],g:null,station:null,built:false};
function fldExt(){return FLD.style==='old'?{u:FLD.len/2+34,v0:-32,v1:27}:{u:FLD.len/2+28,v0:-22,v1:58};}
// the ground of the airport is levelled (like a real mowed field) and blends into the hills around it
function fldFlat(x,z,h){if(!FLD.on||!FU.built)return h;const q=fldUV(x,z),E=fldExt();const du=Math.max(0,Math.abs(q.u)-E.u),dv=Math.max(0,q.v>E.v1?q.v-E.v1:E.v0-q.v);const d=Math.hypot(du,dv);if(d>12)return h;return lerp(FU.h,h,smooth(0,12,d));}
function fldBlocked(x,z){if(!FLD.on||!FU.built)return false;const q=fldUV(x,z),E=fldExt();return Math.abs(q.u)<E.u+4&&q.v>E.v0-4&&q.v<E.v1+4;}
