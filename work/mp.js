const WebSocket=globalThis.WebSocket;const a=new WebSocket('ws://localhost:8765/mp'),b=new WebSocket('ws://localhost:8765/mp');
b.onmessage=e=>{console.log('B got',e.data);process.exit(0)};let n=0;const go=()=>{if(++n==2)a.send(JSON.stringify({t:'s',id:'x',name:'Madison'}))};a.onopen=go;b.onopen=go;setTimeout(()=>{console.log('timeout');process.exit(1)},5000);
