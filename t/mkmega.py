import json,copy,sys
import os
AF=float(os.environ.get('AF','1'))
f=float(sys.argv[1]);r=float(sys.argv[2]);pw=float(sys.argv[3]);bk=float(sys.argv[4]);out=sys.argv[5];bs=float(sys.argv[6]) if len(sys.argv)>6 else 2
J=json.load(open('Giant-X8-v2.drone.json'));s=J['spec'];s['name']='MEGA Smasher'
for p in s['parts']:
    t=p['t']
    if t in('motor','guard'):
        p['x']=round(p['x']*f,2);p['y']=round(p['y']*f,2);p['r']=min(200,r if t=='motor' else r*1.06)
        if t=='motor':p['pow']=pw
    elif t=='arm':p['len']=min(400,round(p['len']*f*AF,2));p['x']=round(p['x']*f,2);p['y']=round(p['y']*f,2)
    elif t=='body':p['len']=round(p['len']*bs,2);p['w']=round(p['w']*bs,2)
    elif t=='battery':p['len']=round(p['len']*bk,2);p['w']=round(p['w']*bk,2)
    else:
        for k in('x','y'):p[k]=round(p[k]*bs,2)
        p['h']=round(p['h']*bs,2)

s['colors']['body']='#1c1c1e'
for p in s['parts']:
    if p['t']=='body':p['col']='#1c1c1e'
    if p['t']=='arm':p['col']='#3a3a3c';p['mat']='metal'
json.dump(J,open(out,'w'),indent=1)
