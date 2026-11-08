// v64: word games & grammar — syllables, word starting with a letter, "word that means X", anagrams, first letter, palindromes, plurals, past tense
const IRRV={be:'was/were',beat:'beat',become:'became',begin:'began',bend:'bent',bet:'bet',bite:'bit',blow:'blew',break:'broke',bring:'brought',build:'built',burn:'burned/burnt',buy:'bought',catch:'caught',choose:'chose',come:'came',cost:'cost',cut:'cut',dig:'dug',dive:'dived/dove',do:'did',draw:'drew',dream:'dreamed/dreamt',drink:'drank',drive:'drove',eat:'ate',fall:'fell',feed:'fed',feel:'felt',fight:'fought',find:'found',fly:'flew',forget:'forgot',forgive:'forgave',freeze:'froze',get:'got',give:'gave',go:'went',grow:'grew',hang:'hung',have:'had',hear:'heard',hide:'hid',hit:'hit',hold:'held',hurt:'hurt',keep:'kept',know:'knew',lay:'laid',lead:'led',learn:'learned/learnt',leave:'left',lend:'lent',let:'let',lie:'lay',light:'lit',lose:'lost',make:'made',mean:'meant',meet:'met',pay:'paid',put:'put',quit:'quit',read:'read',ride:'rode',ring:'rang',rise:'rose',run:'ran',say:'said',see:'saw',sell:'sold',send:'sent',set:'set',shake:'shook',shine:'shone',shoot:'shot',show:'showed',shut:'shut',sing:'sang',sink:'sank',sit:'sat',sleep:'slept',slide:'slid',speak:'spoke',spend:'spent',spin:'spun',stand:'stood',steal:'stole',stick:'stuck',sting:'stung',strike:'struck',swim:'swam',swing:'swung',take:'took',teach:'taught',tear:'tore',tell:'told',think:'thought',throw:'threw',understand:'understood',wake:'woke',wear:'wore',win:'won',write:'wrote'};
const IRRN={mouse:'mice',goose:'geese',man:'men',woman:'women',child:'children',tooth:'teeth',foot:'feet',person:'people',ox:'oxen',sheep:'sheep',deer:'deer',fish:'fish',moose:'moose',cactus:'cacti',octopus:'octopuses (or octopi)',knife:'knives',wife:'wives',life:'lives',leaf:'leaves',wolf:'wolves',half:'halves',calf:'calves',shelf:'shelves',elf:'elves',loaf:'loaves',thief:'thieves',potato:'potatoes',tomato:'tomatoes',hero:'heroes',echo:'echoes',volcano:'volcanoes',torpedo:'torpedoes',louse:'lice',die:'dice',crisis:'crises',fungus:'fungi',dwarf:'dwarfs',roof:'roofs',chief:'chiefs',aircraft:'aircraft',series:'series',species:'species'};
function plural(w){if(IRRN[w])return IRRN[w];if(/(s|x|z|ch|sh)$/.test(w))return w+'es';if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+'ies';return w+'s';}
function pastT(w){if(IRRV[w])return IRRV[w];if(/e$/.test(w))return w+'d';if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+'ied';if(/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(w))return w+w.slice(-1)+'ed';return w+'ed';}
function sylN(w){w=w.toLowerCase().replace(/[^a-z]/g,'');if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/,'').replace(/^y/,'');const m=w.match(/[aeiouy]{1,2}/g);let n=m?m.length:1;if(/[^aeiou]le$/.test(w))n++;return Math.max(1,n);}
const WGOOD=w=>/^[a-z]{4,9}$/.test(w)&&SPEECH_KEEP_BASE.has(w);
let WARR=null;function wArr(){if(!WARR)WARR=[...SPEECH_KEEP_BASE].filter(WGOOD);return WARR;}
function anag(w){const k=w.split('').sort().join('');return [...SPEECH_KEEP_BASE].filter(x=>x!==w&&x.length===w.length&&/^[a-z]+$/.test(x)&&x.split('').sort().join('')===k).slice(0,6);}
let CSRAW='';{const c0=cleanSpeech;cleanSpeech=function(t){CSRAW=String(t||'');return c0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const B=(nWho(s).find(w=>w.B)||{}).B||aiNear(1e9)[0];if(!B)return s0.apply(this,arguments);let m;
  const say=t=>{sbSay({B},t);return true;};
  if(m=s.match(/ (?:who is|who s|whos|who are you) (\w+) $/)){const me=AIB.L.find(x=>!x.dead&&pbName(x).toLowerCase()===m[1]);if(me){sbSay({B:me},PICK(['That\'s me! 👋 I\'m '+pbName(me)+', an AI pilot 🤖','Right here! I\'m '+pbName(me)+' — I fly, race and fight 😎']));return true;}}
  if(m=s.match(/ how many syllables (?:are )?(?:in|does) (?:the word )?([a-z]+)(?: have)? $/))return say('👏 "'+m[1]+'" has '+sylN(m[1])+' syllable'+(sylN(m[1])>1?'s':'')+' (I think!)');
  if(m=s.match(/ (?:give me|tell me|say|what s|whats|what is|name) (?:a|an|some) words? (?:that )?(?:starts?|starting|begins?|beginning) with (?:an? |the letter )?([a-z]) $/)){const L=wArr().filter(x=>x[0]===m[1]).sort(()=>Math.random()-.5).slice(0,60);if(!L.length)return say('🤔 Hmm, I can\'t think of one!');const P=[...new Set(L.map(aiwPre))].slice(0,3);let left=P.length;const done=()=>{if(--left>0)return;const ok=L.filter(x=>{const r=aiwGet(x);return r&&r.ex&&!r.from;}).slice(0,3);const out=ok.length?ok:L.slice(0,3);sbSay({B},'🔤 How about: '+out.join(', ')+'!');};P.forEach(p=>aiwLoad(L.find(x=>aiwPre(x)===p),done));return true;}
  if(m=s.match(/ (?:give me |tell me |what s |whats |what is )?(?:a|another) word (?:that means|for|meaning) ([a-z]+) $/)||s.match(/ (?:what s |whats |what is )?(?:another|a different) word for ([a-z]+) $/)){const w=m[1];aiwLoad(w,()=>{const r=aiwGet(w);const sy=r&&r.s&&String(r.s).split(/[,;]\s*/).filter(x=>x&&x!==w).slice(0,5);sbSay({B},sy&&sy.length?'💡 Words that mean "'+w+'": '+sy.join(', '):'🤔 I don\'t know another word for "'+w+'" yet');});return true;}
  if(m=s.match(/ (?:what s |whats |what is |give me |find )?(?:an |the )?anagrams? (?:of|for) ([a-z]+) $/)){const a=anag(m[1]);return say(a.length?'🔀 "'+m[1]+'" → '+a.join(', '):'🔀 I couldn\'t find a real-word anagram of "'+m[1]+'"');}
  if(m=s.match(/ what letter (?:does|do) ([a-z]+) (?:start|begin) with $/))return say('🔤 "'+m[1]+'" starts with '+m[1][0].toUpperCase());
  if(m=s.match(/ what letter (?:does|do) ([a-z]+) end with $/))return say('🔤 "'+m[1]+'" ends with '+m[1].slice(-1).toUpperCase());
  if(m=s.match(/ is ([a-z ]+?) a palindrome $/)){const rm=String(CSRAW||'').toLowerCase().match(/is ([a-z ]+?) a palindrome/);if(rm)m=rm;const w=m[1].replace(/ /g,''),y=w.split('').reverse().join('')===w;return say(y?'🔁 Yes! "'+w+'" reads the same backwards!':'🔁 Nope — backwards it\'s "'+w.split('').reverse().join('')+'"');}
  if(/ (what is|whats|what s) a palindrome $/.test(s))return say('🔁 A word that reads the same backwards — like racecar, kayak, level, mom!');
  if(m=s.match(/ (?:what s |whats |what is )?(?:the )?plural (?:of|for) (?:a |an )?([a-z]+) $/))return say('🔢 One '+m[1]+', two '+plural(m[1])+'!');
  if(m=s.match(/ (?:what s |whats |what is )?(?:the )?past (?:tense )?(?:of|for) ([a-z]+) $/)){const w=m[1].replace(/^to /,'');return say('⏪ Today I '+w+', yesterday I '+pastT(w)+'!');}
  if(m=s.match(/ how many vowels (?:are )?(?:in|does) ([a-z]+)(?: have)? $/)){const n=(m[1].match(/[aeiou]/g)||[]).length;return say('🅰️ "'+m[1]+'" has '+n+' vowel'+(n===1?'':'s'));}
  if(/ (what are|whats|what s|what is) (the )?vowels $/.test(s))return say('🅰️ A, E, I, O, U (and sometimes Y)!');
  if(/ (what is|whats|what s) an? (adjective|describing word) $/.test(s))return say('🎨 A word that describes something — like big, red, fast or shiny!');
  if(/ (what is|whats|what s) an? adverb $/.test(s))return say('🏃 A word that tells HOW something happens — like quickly, loudly or gently!');
  if(/ (what is|whats|what s) a pronoun $/.test(s))return say('👉 A word that stands in for a noun — like he, she, it, they, we!');
  if(/ (what is|whats|what s) a (compound word) $/.test(s))return say('🧩 Two words stuck together — like sunflower, airplane, rainbow!');
  if(/ how many letters (are )?(in|does) the alphabet( have)? $/.test(s))return say('🔤 26 letters!');
  if(/ (what is|whats|what s) the (longest|biggest) word $/.test(s))return say('📏 "Pneumonoultramicroscopicsilicovolcanoconiosis" — 45 letters! (a lung disease from volcano dust)');
}catch(e){}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}

// numbers & units
const UNITS={mm:['L',.001],millimeter:['L',.001],cm:['L',.01],centimeter:['L',.01],m:['L',1],meter:['L',1],metre:['L',1],km:['L',1000],kilometer:['L',1000],inch:['L',.0254],in:['L',.0254],foot:['L',.3048],ft:['L',.3048],yard:['L',.9144],mile:['L',1609.344],
 second:['T',1],sec:['T',1],minute:['T',60],min:['T',60],hour:['T',3600],hr:['T',3600],day:['T',86400],week:['T',604800],year:['T',31536000],decade:['T',315360000],century:['T',3153600000],
 gram:['W',1],g:['W',1],kilogram:['W',1000],kg:['W',1000],kilo:['W',1000],ounce:['W',28.3495],oz:['W',28.3495],pound:['W',453.592],lb:['W',453.592],ton:['W',907184.7],
 milliliter:['V',1],ml:['V',1],liter:['V',1000],litre:['V',1000],cup:['V',236.588],pint:['V',473.176],quart:['V',946.353],gallon:['V',3785.41],teaspoon:['V',4.929],tablespoon:['V',14.787]};
function unitK(u){u=String(u||'').toLowerCase().replace(/^an? /,'').trim();const al={feet:'foot',inches:'inch',centuries:'century',kms:'km',mph:null};if(al[u]!==undefined)return al[u];if(UNITS[u])return u;if(/ies$/.test(u)&&UNITS[u.slice(0,-3)+'y'])return u.slice(0,-3)+'y';if(/s$/.test(u)&&UNITS[u.slice(0,-1)])return u.slice(0,-1);if(/es$/.test(u)&&UNITS[u.slice(0,-2)])return u.slice(0,-2);return null;}
function fmtN(x){if(!isFinite(x))return '∞';if(Math.abs(x)>=1e6)return Math.round(x).toLocaleString('en-US');return (Math.round(x*1000)/1000).toLocaleString('en-US');}
function isPrime(n){if(n<2||n%1)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;}
{const s0=smartHear;smartHear=function(txt){try{const raw=' '+String(CSRAW||txt||'').toLowerCase().replace(/[?!,]/g,' ').replace(/\s+/g,' ')+' ';const s=nNorm(String(txt||''));const B=(nWho(s).find(w=>w.B)||{}).B||aiNear(1e9)[0];if(!B)return s0.apply(this,arguments);let m;const say=t=>{sbSay({B},t);return true;};
  if(m=raw.match(/ how many ([a-z]+) (?:are )?(?:in|per) (?:a |an |one |1 )?([a-z]+) /)){const a=unitK(m[1]),b=unitK(m[2]);if(a&&b&&UNITS[a][0]===UNITS[b][0]){if(a==='day'&&b==='year')return say('📅 365 days (366 in a leap year)!');if(a==='week'&&b==='year')return say('📅 52 weeks (and 1 extra day)!');const em={L:'📏',T:'⏱',W:'⚖️',V:'🥛'}[UNITS[a][0]];return say(em+' '+fmtN(UNITS[b][1]/UNITS[a][1])+' '+m[1]+' in '+(/^[aeiouh]/.test(b)&&b!=='yard'?'an ':'a ')+b+'!');}}
  if(m=raw.match(/ (?:convert |what is |whats |what s |how much is |how many [a-z]+ (?:is|are) )?(-?[\d.]+) ([a-z]+) (?:to|in|into) ([a-z]+) /)){const a=unitK(m[2]),b=unitK(m[3]),n=parseFloat(m[1]);
    if(/^(c|celsius|degrees?)$/.test(m[2])&&/^(f|fahrenheit)$/.test(m[3]))return say('🌡 '+n+' °C = '+fmtN(n*9/5+32)+' °F');if(/^(f|fahrenheit)$/.test(m[2])&&/^(c|celsius)$/.test(m[3]))return say('🌡 '+n+' °F = '+fmtN((n-32)*5/9)+' °C');
    if(a&&b&&UNITS[a][0]===UNITS[b][0]&&isFinite(n))return say('📏 '+n+' '+m[2]+' = '+fmtN(n*UNITS[a][1]/UNITS[b][1])+' '+m[3]);}
  if(m=raw.match(/ (-?[\d.]+) (?:to the power of|to the|\^|raised to) (-?[\d.]+)(?:th|st|nd|rd)?(?: power)? /)){const r=Math.pow(+m[1],+m[2]);return say('🧮 '+m[1]+'^'+m[2]+' = '+fmtN(r));}
  if(m=raw.match(/ (\d+) (?:squared) /))return say('🧮 '+m[1]+'² = '+fmtN((+m[1])**2));
  if(m=raw.match(/ (\d+) (?:cubed) /))return say('🧮 '+m[1]+'³ = '+fmtN((+m[1])**3));
  if(m=raw.match(/ is (\d+) (?:a )?prime(?: number)? /)){const n=+m[1];return say(isPrime(n)?'✅ Yes! '+n+' is prime':'❌ No — '+n+(n>1?' can be divided by '+(()=>{for(let i=2;i<n;i++)if(n%i===0)return i;})():' isn\'t prime'));}
  if(m=raw.match(/ is (\d+) (?:an? )?(even|odd)(?: number)? /)){const n=+m[1],ev=n%2===0;return say((ev===(m[2]==='even')?'✅ Yes, ':'❌ No, ')+n+' is '+(ev?'even':'odd'));}
  if(m=raw.match(/ what (?:number )?comes (after|before) (-?\d+) /)){const n=+m[2];return say('🔢 '+(m[1]==='after'?n+1:n-1));}
  if(m=raw.match(/ (?:what s |whats |what is |which is )?(bigger|larger|greater|smaller|less|more) (-?[\d.]+) or (-?[\d.]+) /)){const a=+m[2],b=+m[3],big=/bigger|larger|greater|more/.test(m[1]);if(a===b)return say('⚖️ They\'re the same!');return say('⚖️ '+(big?(a>b?m[2]:m[3]):(a<b?m[2]:m[3]))+' is '+m[1]+'!');}
  if(/ how (much|many) is a dozen /.test(raw))return say('🥚 A dozen is 12! (a baker\'s dozen is 13)');
  if(/ how many (is|in) a (score) /.test(raw))return say('🔢 A score is 20!');
  if(/ (what is|whats|what s) pi /.test(raw))return say('🥧 Pi ≈ 3.14159… — how many times a circle\'s width fits around its edge!');
  if(/ what is (infinity) /.test(raw))return say('♾ Something that never ends — bigger than any number!');
  if(/ (what is|whats|what s) the (biggest|largest) number /.test(raw))return say('♾ There isn\'t one — you can always add 1! (A googol is 1 with 100 zeros)');
  if(/ (what is|whats|what s) a (googol) /.test(raw))return say('🔢 1 followed by 100 zeros!');
  if(/ how many (zeros|zeroes) (are )?in a (million) /.test(raw))return say('🔢 6 zeros: 1,000,000');
  if(/ how many (zeros|zeroes) (are )?in a (billion) /.test(raw))return say('🔢 9 zeros: 1,000,000,000');
  if(/ how many (zeros|zeroes) (are )?in a (trillion) /.test(raw))return say('🔢 12 zeros!');
}catch(e){}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
// replies to the player jump the chat queue (they used to wait behind battle chatter for 5-10 s, or get dropped)
const REPLYT=new Set();let HEARING=0;
{const s0=smartHear;smartHear=function(){HEARING++;try{return s0.apply(this,arguments);}finally{HEARING--;}};}
const REPLYB={};
{const s0=sbSay;sbSay=function(w,t,d){try{if((HEARING||(typeof PEERCTX!=='undefined'&&PEERCTX.on))&&w){const n=w.B?w.B.name.replace('🤖 ',''):w.C?w.C.name:'';if(n)REPLYB[n]=(REPLYB[n]||0)+1;}}catch(e){}return s0.apply(this,arguments);};}
{const p0=SAYQ.push;SAYQ.push=function(m){try{if(m&&REPLYB[m[0]]>0&&aiSayAs.__raw){REPLYB[m[0]]--;aiSayAs.__raw(m[0],m[1]);return this.length;}}catch(e){}return p0.apply(this,arguments);};}
// trivia quiz: "quiz me" / "trivia" — the AI asks, you answer
const QZQ=[['What is the biggest planet?',/jupiter/,'Jupiter'],['How many legs does a spider have?',/\b(8|eight)\b/,'8'],['What is the fastest land animal?',/cheetah/,'the cheetah'],['How many continents are there?',/\b(7|seven)\b/,'7'],['What do bees make?',/honey/,'honey'],['Which planet is called the Red Planet?',/mars/,'Mars'],['What is the tallest animal?',/giraffe/,'the giraffe'],['How many days are in a week?',/\b(7|seven)\b/,'7'],['What gas do plants give us to breathe?',/oxygen/,'oxygen'],['What is frozen water called?',/\bice\b/,'ice'],
 ['What is the biggest ocean?',/pacific/,'the Pacific'],['Who was the first person on the moon?',/armstrong|neil/,'Neil Armstrong'],['How many sides does a triangle have?',/\b(3|three)\b/,'3'],['What color do blue and yellow make?',/green/,'green'],['What is the capital of France?',/paris/,'Paris'],['Can penguins fly?',/\b(no|nope|nah)\b/,'no'],['What is 7 times 8?',/\b(56|fifty six)\b/,'56'],['What is the closest star to Earth?',/\bsun\b/,'the sun'],['What animal says moo?',/\bcows?\b/,'a cow'],['How many hours are in a day?',/\b(24|twenty four)\b/,'24'],
 ['Which is bigger, the sun or the moon?',/\bsun\b/,'the sun'],['What do caterpillars turn into?',/butterfl|moth/,'butterflies (or moths)'],['How many wheels does a car usually have?',/\b(4|four)\b/,'4'],['What is the hottest planet?',/venus/,'Venus'],['How many letters are in the alphabet?',/\b(26|twenty six)\b/,'26'],['What do you call a baby dog?',/pupp/,'a puppy'],['What do you call a baby cat?',/kitt/,'a kitten'],['What is the largest animal ever?',/blue whale|whale/,'the blue whale'],['How many planets are in our solar system?',/\b(8|eight)\b/,'8'],['What do we call a scientist who studies dinosaurs?',/paleontolog/,'a paleontologist']];
const QZ={on:false,B:null,q:null,t:0,n:0,ok:0,used:[]};
function qzAsk(B){let L=QZQ.filter((x,i)=>!QZ.used.includes(i));if(!L.length){QZ.used=[];L=QZQ;}const q=PICK(L);QZ.used.push(QZQ.indexOf(q));QZ.q=q;QZ.B=B;QZ.t=performance.now();QZ.n++;sbSay({B},'❓ Q'+QZ.n+': '+q[0]);}
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const B=(nWho(s).find(w=>w.B)||{}).B||aiNear(1e9)[0];if(!B)return s0.apply(this,arguments);
  if(/ (quiz me|trivia|ask me (a |some )?(trivia |quiz )?questions?|lets play (a )?(quiz|trivia)|play (a )?(quiz|trivia)( game)?|give me a quiz) /.test(s)){QZ.on=true;QZ.n=0;QZ.ok=0;sbSay({B},'🧠 Trivia time! Say "stop quiz" to end.');qzAsk(B);return true;}
  if(QZ.on){if(performance.now()-QZ.t>120000){QZ.on=false;}
    else if(/ (stop|end|quit|no more|enough)( the)? (quiz|trivia|questions)? $/.test(s)||/ (stop quiz|end quiz|quit quiz) /.test(s)){QZ.on=false;sbSay({B:QZ.B||B},'🏁 Quiz over! You got '+QZ.ok+' out of '+Math.max(0,QZ.n-(QZ.q?1:0))+' 🎉');QZ.q=null;return true;}
    else if(QZ.q){const q=QZ.q,b=QZ.B||B;const words=s.trim().split(/\s+/).length;
      if(/ (i don t know|idk|dunno|i give up|skip|pass|tell me) /.test(s)){QZ.q=null;sbSay({B:b},'💡 It was '+q[2]+'!');setTimeout(()=>{if(QZ.on)qzAsk(b);},2500);return true;}
      if(q[1].test(s)){QZ.ok++;QZ.q=null;sbSay({B:b},PICK(['✅ Correct!','✅ Yes! Nice one!','✅ You got it! 🎉','✅ Smart pilot! 🧠'])+' ('+QZ.ok+'/'+QZ.n+')');setTimeout(()=>{if(QZ.on)qzAsk(b);},2500);return true;}
      if(words<=4&&!/ (follow|come|land|race|tag|attack|shoot|fly|go|help|hide|seek|take off|switch|battle|menu) /.test(s)){QZ.q=null;sbSay({B:b},'❌ Not quite — it was '+q[2]+'! ('+QZ.ok+'/'+QZ.n+')');setTimeout(()=>{if(QZ.on)qzAsk(b);},2500);return true;}}}
  if(/ (what do you know about|tell me (something|a fact|facts) about) (space|planets|stars) /.test(s)){const L=KB.filter(([re])=>/planet|moon|sun|star|mars|jupiter|galax|comet|space|saturn/.test(re.source)).map(x=>x[1]).filter(a=>a!=='ANIMSAY');sbSay({B},PICK(L));return true;}
  if(/ (what do you know about|tell me (something|a fact|facts) about) (animals|dinosaurs|nature) /.test(s)){const L=KB.filter(([re])=>/dinosaur|whale|cheetah|dog|cat|bird|penguin|bee|turtle|octopus|elephant|giraffe|snake|bat|raccoon/.test(re.source)).map(x=>x[1]).filter(a=>a!=='ANIMSAY');sbSay({B},PICK(L));return true;}
}catch(e){}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
{const s0=smartHear;smartHear=function(){HEARING++;try{return s0.apply(this,arguments);}finally{HEARING--;}};}
