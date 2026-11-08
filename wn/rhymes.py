import pronouncing,wordfreq,re,json,collections,os
pronouncing.init_cmu()
top=[w for w in wordfreq.top_n_list('en',40000) if re.fullmatch(r'[a-z]{2,}',w)]
rank={w:i for i,w in enumerate(top)}
bykey=collections.defaultdict(list)
for w in top:
  ph=pronouncing.phones_for_word(w)
  if not ph:continue
  k=pronouncing.rhyming_part(ph[0]);bykey[k].append(w)
out=collections.defaultdict(dict);n=0
for k,ws in bykey.items():
  ws=sorted(ws,key=lambda w:rank[w])
  for w in ws:
    R=[x for x in ws if x!=w and not x.endswith(w) and not w.endswith(x)][:10]
    if R:out[(w+'_')[:2]][w]=','.join(R);n+=1
for f in os.listdir('rh'):os.remove('rh/'+f)
tot=0
for p,d in out.items():
  js='AIR_ADD('+json.dumps(p)+','+json.dumps(d,separators=(',',':'))+');';open('rh/ai-rhymes-'+p+'.js','w').write(js);tot+=len(js)
print(n,'words with rhymes',len(out),'files',tot,'bytes');print(out['fl'].get('fly'),out['ca'].get('cat'),out['dr'].get('drone'))
