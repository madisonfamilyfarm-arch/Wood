const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:400,height:400}});
p.on('pageerror',e=>console.log('ERR',e.message));
const L=[['Oak New','oak_new_1'],['Oak','oak_1'],['Euro Birch Tree','euro_birch_tree_1'],['Elm','elm_1'],['Fir Tree','fir_tree_1'],['Poplar','poplar_1'],['Temperate Maple Trees','temperate_maple_trees_1'],['Willow A','willow_a_1'],['Maple Autumn','maple_autumn_1'],['Oak New Aut','oak_new_aut_1'],['European Beech','european_beech_1']];
for(const [d,n] of L){await p.goto('file://'+__dirname+'/view/objview.html');console.log(n,await p.evaluate(([d,n])=>show(d,n,0.7),[d,n]));await p.screenshot({path:__dirname+'/view/obj_'+n+'.png'});}
await b.close();})();
