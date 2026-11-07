import json
from http.server import HTTPServer,BaseHTTPRequestHandler
class H(BaseHTTPRequestHandler):
    def cors(s):pass
    def do_OPTIONS(s):s.send_response(204);s.cors();s.end_headers()
    def j(s,o):b=json.dumps(o).encode();s.send_response(200);s.cors();s.send_header('content-type','application/json');s.end_headers();s.wfile.write(b)
    def do_GET(s):
        if s.path=='/api/tags':s.j({'models':[{'name':'llama3.1:8b','size':4900000000,'details':{'family':'llama','parameter_size':'8.0B'}},{'name':'mistral:latest','size':4100000000,'details':{'family':'llama','parameter_size':'7.2B'}},{'name':'qwen3:8b','size':5000000000,'details':{'family':'qwen3','parameter_size':'8B'}}]})
        else:s.send_response(404);s.end_headers()
    def do_POST(s):
        n=int(s.headers.get('content-length',0));body=json.loads(s.rfile.read(n));p=body['messages'][-1]['content']
        import re;names=re.findall(r'"name":"([^"]+)","vehicle"',body['messages'][-1]['content'])
        if 'just typed' in p:
            return s.j({'message':{'role':'assistant','content':json.dumps({'replies':[{'name':'Sam','text':'On it, heading to the meadow!'}],'campers':[{'name':'Sam','do':'go','place':'the meadow'}],'pilots':[]})}})
        arr=[{'name':nm,'vehicle':['plane','boat','car'][i%3],'do':'place','place':'the meadow','say':'hi from llama'} for i,nm in enumerate(names[:3])]
        s.j({'message':{'role':'assistant','content':json.dumps({'pilots':arr})}}) if body.get('model')=='mistral:latest' else (s.send_response(404),s.end_headers())
    def log_message(s,*a):pass
HTTPServer(('127.0.0.1',11435),H).serve_forever()
