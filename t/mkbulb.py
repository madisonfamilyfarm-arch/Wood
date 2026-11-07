import json,copy,sys
k=float(sys.argv[1]);bk=float(sys.argv[2]);out=sys.argv[3];pw=float(sys.argv[4]) if len(sys.argv)>4 else 6
J=json.load(open('/mnt/user-data/outputs/Nano-drone.drone.json'));s=J['spec'];s['name']='Bulb (tiny!)'
for p in s['parts']:
    for f in ('x','y','h','len','w','r'):
        if f=='len' and p['t'] in('motor','guard','board','rx','camera'):continue
        if f=='w' and p['t'] in('motor','guard','board','rx','camera'):continue
        p[f]=round(p[f]*k,3)
    for f in ('sq','sx','sz'):
        if p['t'] in('board','rx','camera'):p[f]=round(max(0.15,p[f]*k),3)
    if p['t']=='motor':p['pow']=pw
    if p['t']=='battery':p['len']=round(p['len']*bk,3);p['w']=round(p['w']*bk,3)
s['colors']['body']='#ffd60a'
json.dump(J,open(out,'w'),indent=1)
