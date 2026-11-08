import re,pickle,collections,json,os
from wordfreq import zipf_frequency as zf
syn,lem=pickle.load(open('/home/claude/wn/wn.pkl','rb'))
D='/home/claude/wn/wordnet/';rank={}
for pos,f in [('n','noun'),('v','verb'),('a','adj'),('r','adv')]:
  for line in open(D+'index.'+f):
    if line.startswith('  '):continue
    t=line.split();w=t[0];sc=int(t[2]);pc=int(t[3]);i=4+pc;tag=int(t[i+1]);offs=t[i+2:i+2+sc]
    for r,o in enumerate(offs):rank.setdefault(w,[]).append((tag,pos,r,(pos,o)))
P={'n':'noun','v':'verb','a':'adj','r':'adv'}
out=collections.defaultdict(dict)
for w,L in rank.items():
  if not re.fullmatch(r"[a-z][a-z'_-]{1,40}",w) or w.count("_")>3:continue
  tagp={p:tg for tg,p,_,_ in L};posc=collections.Counter(p for _,p,_,_ in L)
  po=sorted(tagp,key=lambda p:(-tagp[p],-posc[p]))
  senses=sorted(L,key=lambda x:(x[2],po.index(x[1])))
  cand=[];A=[];parts={}
  for _,p,r,k in senses:
    s=syn.get(k)
    if not s:continue
    pri=r*2+po.index(p)
    for x in s['w']:cand.append((pri,x))
    for sym,pp,o,st in s['p']:
      if sym=='&' and r<=1 and (pp,o) in syn:
        for x in syn[(pp,o)]['w']:cand.append((pri+0.5,x))
      if sym=='!':
        a=syn.get((pp,o))
        if a:
          x=a['w'][int(st[2:],16)-1] if st[2:]!='00' else a['w'][0]
          if x not in A and '_' not in x:A.append(x)
    if r==0 and p not in parts:
      g=re.split(r';|, "| "',s['g'])[0].strip().strip('"').strip(',')
      if len(g)>110:g=g[:107].rsplit(' ',1)[0]+'…'
      parts[p]=P[p]+': '+g
  G=[parts[p] for p in po if p in parts][:2]
  S=[];seen=set()
  for pri,x in sorted(cand,key=lambda c:(c[0],-zf(c[1],'en'))):
    if x==w or '_' in x or x in seen or zf(x,'en')<2.0:continue
    seen.add(x);S.append(x)
    if len(S)>=6:break
  w=w.replace('_',' ')
  out[w[0]][w]=' ¦ '.join(G)+('|'+','.join(S) if S or A else '')+('|'+','.join(A[:3]) if A else '')
exc=0
for f in ['noun','verb','adj','adv']:
  for line in open(D+f+'.exc'):
    t=line.split()
    if len(t)>=2 and re.fullmatch(r"[a-z][a-z'-]{1,24}",t[0]) and t[0] not in out[t[0][0]] and t[1] in out.get(t[1][0],{}):
      out[t[0][0]][t[0]]='@'+t[1];exc+=1
print('irregular forms',exc)
for f in os.listdir('/home/claude/wn/out'):os.remove('/home/claude/wn/out/'+f)
tot=0;n=0
import collections as C
two=C.defaultdict(dict)
for L,d in out.items():
  for k,v in d.items():
    p=(k+'_')[:2];p=''.join(c if c.isalpha() else '_' for c in p);two[p][k]=v
for p,d in two.items():
  js='AIW_ADD('+json.dumps(p)+','+json.dumps(d,ensure_ascii=False,separators=(',',':'))+');'
  open('/home/claude/wn/out/ai-words-'+p+'.js','w').write(js);tot+=len(js);n+=len(d)
print('shards',len(two))
print(n,tot)
for w in ['fast','ascend','hover','run']:print(w,'=>',out[w[0]].get(w))
