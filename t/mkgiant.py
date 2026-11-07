import json,copy,math,sys
def make(scale=1.0,r=100,pow_=10,blades=5,guard=True,bat=(50,30),armw=21.547,gstyle='ring',lo=-10,gh=0):
    J=json.load(open('Giant-X8.drone.json'));sp=J['spec']
    P=[p for p in sp['parts'] if p['id'] not in ('pmvsbb3fmk23b','pmvsbc8eil70s')]
    out=[]
    for p in P:
        p=copy.deepcopy(p)
        if p['t']=='arm': p['len']=round(161.618*scale,2); p['w']=armw
        if p['t']=='motor':
            p['x']=round(p['x']*scale,2);p['y']=round(p['y']*scale,2);p.update(r=r,pow=pow_,blades=blades,col='#ff2d55')
            if p['id'].endswith('lo'):p['h']=lo
        if p['t']=='battery':p.update(len=bat[0],w=bat[1])
        out.append(p)
    if guard:
        for p in [q for q in out if q['t']=='motor' and not q['id'].endswith('lo')]:
            g=copy.deepcopy(p);g.update(t='guard',style=gstyle,r=round(r*1.08,2),h=gh,id=p['id']+'g',col='#ffd60a',pow=5,blades=2);out.append(g)
    sp['parts']=out
    ids={p['id'] for p in out}
    sp['wires']=[w for w in sp['wires'] if w[1] in ids]
    sp['name']='Giant X8'
    return J
if __name__=='__main__':
    a=json.loads(sys.argv[1]);json.dump(make(**a),open(sys.argv[2],'w'),indent=1)
