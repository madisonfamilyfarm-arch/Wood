import json
from http.server import HTTPServer,BaseHTTPRequestHandler
class H(BaseHTTPRequestHandler):
    def cors(s):pass
    def do_OPTIONS(s):s.send_response(204);s.cors();s.end_headers()
    def j(s,o):b=json.dumps(o).encode();s.send_response(200);s.cors();s.send_header('content-type','application/json');s.end_headers();s.wfile.write(b)
    def do_GET(s):
        if s.path=='/api/tags':s.j({'models':[{'name':'llama3.1:8b','size':4900000000,'details':{'family':'llama','parameter_size':'8.0B'}},{'name':'mistral:7b','size':4100000000,'details':{'family':'mistral','parameter_size':'7B'}}]})
        else:s.send_response(404);s.end_headers()
    def do_POST(s):
        n=int(s.headers.get('content-length',0));body=json.loads(s.rfile.read(n));p=body['messages'][0]['content']
        import re;names=re.findall(r'"name":"([^"]+)","vehicle"',p)
        arr=[{'name':nm,'vehicle':['plane','boat','car'][i%3],'do':'place','place':'the meadow','say':'hi from llama'} for i,nm in enumerate(names[:3])]
        s.j({'message':{'role':'assistant','content':'Sure! '+json.dumps(arr)}})
    def log_message(s,*a):pass
HTTPServer(('127.0.0.1',11435),H).serve_forever()
