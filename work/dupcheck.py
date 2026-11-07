import re,sys
s=open('rc.html').read()
for f in sys.argv[1:]:
  src=open(f).read()
  names=set(re.findall(r'^(?:const|let|function)\s+([A-Za-z_$][\w$]*)',src,re.M))|set(re.findall(r'^\s*(?:const|let)\s+([A-Za-z_$][\w$]*)=',src,re.M))
  for n in sorted(names):
    c=len(re.findall(r'(?:const|let|var|function)\s+'+re.escape(n)+r'\b',s))
    if c>1:print('DUP',f,n,c)
