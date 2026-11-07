"""
DJI Phone Link  -  lets your DJI remote (plugged into this computer) fly the Farm Sim on your phone.

How it works: this program reads the remote over USB and passes its data over your home Wi-Fi
to the game. It also serves the game file, so your phone just opens one web address.

1. Put this file in the SAME folder as the farm-sim html file.
2. Plug in the remote (bottom USB-C port), turn it on, close DJI Fly / DJI Assistant.
3. Double-click "Start DJI Phone Link.bat" (or run:  py dji-phone-link.py).
4. On your phone (same Wi-Fi), open the web address it prints.
"""
import atexit, base64, hashlib, json, os, random, shutil, socket, struct, subprocess, sys, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get('DJI_PORT', '8765'))
FAKE = os.environ.get('DJI_FAKE') == '1'   # for testing without a remote

try:
    import serial, serial.tools.list_ports
except ImportError:
    if not FAKE:
        print('Installing pyserial (one time only)...')
        os.system('"%s" -m pip install pyserial' % sys.executable)
        try:
            import serial, serial.tools.list_ports
        except ImportError:   # newer Ubuntu blocks plain pip
            os.system('"%s" -m pip install --user --break-system-packages pyserial' % sys.executable)
            try:
                import serial, serial.tools.list_ports
            except ImportError:
                print('\n(!) Could not install pyserial. On Ubuntu / Linux type this in a terminal, then run me again:')
                print('      sudo apt install python3-serial')
                input('Press Enter to close...'); sys.exit(1)

HERE = os.path.dirname(os.path.abspath(__file__))
clients = set()
mp_clients = set()
links = {}          # other computers running DJI Phone Link on the same Wi-Fi (linked automatically)
HELPER_ID = '%08x' % random.getrandbits(32)
BEACON_PORT = int(os.environ.get('DJI_BEACON', '8766'))
BEACON_TO = [int(x) for x in os.environ.get('DJI_BEACON_TO', str(BEACON_PORT)).split(',') if x.strip()]
NO_REMOTE = False
MY_IP = ''
seen_info = set()
clients_lock = threading.Lock()
ser = None
ser_lock = threading.Lock()
stats = {'from_remote': 0, 'to_remote': 0}


# ---------------------------------------------------------------- remote (serial) side
REQ = bytes.fromhex('550d04330a06eb344006017424')

def probe(dev):
    """Ask a port for stick positions; the DJI remote answers with a 38-byte packet."""
    try:
        s = serial.Serial(dev, 921600, timeout=0.15)
    except Exception:
        return False
    try:
        s.reset_input_buffer()
        for _ in range(4):
            s.write(REQ); time.sleep(0.05)
        data = s.read(600)
        i = data.find(b'\x55')
        while 0 <= i < len(data) - 2:
            if (data[i + 1] | (data[i + 2] << 8)) & 0x3FF == 38:
                return True
            i = data.find(b'\x55', i + 1)
        return False
    finally:
        s.close()

def find_port():
    ports = list(serial.tools.list_ports.comports())
    good = ['V1 ACM Ctrl', 'VCOM For Protocol', 'DJI']
    for p in ports:   # Linux: DJI's USB id is 2ca3
        if getattr(p, 'vid', None) == 0x2CA3 and probe(p.device):
            return p.device, (p.description or 'DJI remote')
    for want in good:
        for p in ports:
            if want.lower() in (p.description or '').lower():
                return p.device, p.description
    # Windows often just calls it "USB Serial Device" -- ask each one, the remote answers
    usb = [p for p in ports if 'bluetooth' not in (p.description or '').lower() and not p.device.startswith('/dev/ttyS')]
    print('Looking for the remote on:', ', '.join(p.device for p in usb) or '(nothing)')
    for p in usb:
        if probe(p.device):
            return p.device, p.description
    print('\nCould not find the DJI remote automatically. Ports on this computer:')
    for i, p in enumerate(ports):
        print('  %d) %s  -  %s' % (i + 1, p.device, p.description))
    if not ports:
        print('  (none) -> is the remote plugged into the BOTTOM USB-C port and turned on?')
    n = input('Type the number of the remote, or just press Enter to run WITHOUT a remote (multiplayer only): ').strip()
    if not n or not n.isdigit() or not (1 <= int(n) <= len(ports)):
        return None, None
    p = ports[int(n) - 1]
    return p.device, p.description


class FakeRemote:
    """Pretends to be a remote: answers each request with a 38-byte stick packet (sticks wiggle)."""
    def __init__(self): self.out = bytearray(); self.t0 = time.time(); self.lock = threading.Lock()
    silent = False
    def write(self, b):
        if self.silent: return
        if len(b) >= 11 and b[0] == 0x55 and b[10] == 0x01:
            v = int(1024 + 600 * __import__('math').sin(time.time() - self.t0))
            p = bytearray(38); p[0] = 0x55; p[1] = 38
            for o in (13, 16, 19, 22, 25): p[o] = 1024 & 255; p[o + 1] = 1024 >> 8
            p[19] = v & 255; p[20] = v >> 8   # left stick up/down moves
            with self.lock: self.out += p
        if len(b) >= 11 and b[0] == 0x55 and b[10] == 0x27:
            q = bytearray(58); q[0] = 0x55; q[1] = 58
            if int(time.time() * 2) % 4 == 0: q[28] = 0x00; q[29] = 0x60   # PHOTO pressed now and then
            q[28] |= 0x10   # NORMAL
            with self.lock: self.out += q
    def read(self, n):
        time.sleep(0.005)
        with self.lock:
            d = bytes(self.out[:4096]); del self.out[:4096]; return d
    @property
    def in_waiting(self): return len(self.out)


def open_remote():
    global ser
    if FAKE:
        ser = FakeRemote(); print('FAKE remote (test mode)'); return
    global NO_REMOTE
    dev, desc = (None, None) if os.environ.get('DJI_NOREMOTE') == '1' else find_port()
    if dev is None:
        NO_REMOTE = True; ser = FakeRemote(); ser.silent = True
        print('Running without a remote - friends can still join multiplayer.'); return
    try:
        ser = serial.Serial(dev, 921600, timeout=0.02)
    except Exception as e:
        print('\n(!) Could not open the remote on %s: %s' % (dev, e))
        if 'ermission' in str(e) and sys.platform.startswith('linux'):
            print('    Linux needs permission for USB serial ports. In a terminal type:')
            print('      sudo usermod -a -G dialout $USER')
            print('    then log out and back in (or restart), and run me again.')
            print('    (Quick test without logging out:  sudo python3 dji-phone-link.py)')
        else:
            print('    Close Chrome/Edge tabs that are using the remote, DJI Fly and DJI Assistant, then run this again.')
        input('Press Enter to close...'); sys.exit(1)
    print('Remote found: %s (%s)' % (desc, dev))


REQ_BTN = bytes.fromhex('550d04330a06eb34400627406' + '0')
SIM_ON = bytes.fromhex('550e04660a06eb34400624' + '01d9ec')
latest = {'stick': None, 'btn': None, 'latch': 0, 'new': False}
latest_lock = threading.Lock()

def remote_poller():
    """Ask for sticks, then buttons, then sticks... as fast as the remote answers (no Wi-Fi in this loop)."""
    buf = bytearray()
    try:
        with ser_lock: ser.write(SIM_ON)
    except Exception: pass
    n = 0
    while True:
        want = 58 if n % 2 else 38
        req = REQ_BTN if want == 58 else REQ
        try:
            with ser_lock: ser.write(req)
            stats['to_remote'] += len(req)
        except Exception as e:
            print('\nLost the remote:', e); time.sleep(1); continue
        t0 = time.time(); got = False
        while time.time() - t0 < 0.05 and not got:
            try:
                k = ser.in_waiting if not FAKE else 1
                data = ser.read(max(1, k))
            except Exception:
                data = b''
            if not data: continue
            stats['from_remote'] += len(data); buf += data
            if len(buf) > 2000: del buf[:-600]
            while len(buf) >= 3:
                if buf[0] != 0x55: del buf[0]; continue
                ln = (buf[1] | (buf[2] << 8)) & 0x3FF
                if ln < 4 or ln > 600: del buf[0]; continue
                if len(buf) < ln: break
                pk = bytes(buf[:ln]); del buf[:ln]
                with latest_lock:
                    if ln == 38: latest['stick'] = pk; latest['new'] = True
                    elif ln == 58:
                        latest['btn'] = pk; latest['latch'] |= (pk[28] << 8) | pk[29]; latest['new'] = True
                if ln == want: got = True
        n += 1

def pusher():
    """~70 times a second: newest sticks + buttons (a short press is kept until it has been sent once)."""
    while True:
        time.sleep(0.014)
        with latest_lock:
            if not latest['new']: continue
            out = b''
            if latest['stick']: out += latest['stick']
            if latest['btn']:
                b = bytearray(latest['btn']); m = latest['latch']
                b[28] = (m >> 8) & 255; b[29] = m & 255; out += bytes(b)
                latest['latch'] = (latest['btn'][28] << 8) | latest['btn'][29]
            latest['new'] = False
        frame = ws_frame(out)
        with clients_lock:
            dead = []
            for c in clients:
                try: c.sendall(frame)
                except Exception: dead.append(c)
            for c in dead: clients.discard(c)

def remote_reader():
    while True:
        try:
            n = ser.in_waiting if not FAKE else 1
            data = ser.read(max(1, n))
        except Exception as e:
            print('Lost the remote:', e); time.sleep(1); continue
        if data:
            stats['from_remote'] += len(data)
            frame = ws_frame(data)
            with clients_lock:
                dead = []
                for c in clients:
                    try: c.sendall(frame)
                    except Exception: dead.append(c)
                for c in dead: clients.discard(c)


# ---------------------------------------------------------------- tiny websocket server
def ws_frame(payload, opcode=0x2):
    n = len(payload)
    if n < 126: head = struct.pack('!BB', 0x80 | opcode, n)
    elif n < 65536: head = struct.pack('!BBH', 0x80 | opcode, 126, n)
    else: head = struct.pack('!BBQ', 0x80 | opcode, 127, n)
    return head + payload


def recv_exact(sock, n):
    b = b''
    while len(b) < n:
        chunk = sock.recv(n - len(b))
        if not chunk: raise ConnectionError('closed')
        b += chunk
    return b


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=HERE, **k)
    def log_message(self, *a): pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        ip = self.client_address[0]
        if not self.path.startswith('/dji') and not self.path.startswith('/mp'):
            print('\nPhone visited %s  (from %s)' % (self.path[:60], ip))
        elif ip not in seen_info:
            seen_info.add(ip); print('\nGame is looking for the remote  (from %s)' % ip)
        if self.path.startswith('/dji-info'):
            body = json.dumps({'ok': True, 'name': 'DJI Phone Link', 'push': True, 'mp': True, 'remote': not NO_REMOTE, 'ip': MY_IP, 'port': PORT, 'stats': stats, 'links': len(links), 'hid': HELPER_ID}).encode()
            self.send_response(200); self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body); return
        if self.path.startswith('/mp') and self.headers.get('Upgrade', '').lower() == 'websocket':
            return self.websocket(mp=True)
        if self.path.startswith('/dji') and self.headers.get('Upgrade', '').lower() == 'websocket':
            return self.websocket()
        # anything that isn't a real file here (typos, /Play, old game names...) -> the newest game
        try:
            local = self.translate_path(self.path)
        except Exception:
            local = ''
        games = find_games()
        if self.path in ('', '/') and len(games) > 1:
            names = {'woods': '🌲 Woods RC Sim', 'real': '🌎 Real World RC Sim', 'farm': '🏡 Farm Sim'}
            btns = ''.join('<a href="/%s" style="display:block;margin:12px auto;max-width:520px;padding:18px;border-radius:16px;background:#1b2b20;border:2px solid #3a5;color:#fff;text-decoration:none;font:700 22px system-ui">%s<br><span style="font:13px system-ui;opacity:0.7">%s</span></a>' % (
                g.replace(os.sep, '/'), next((v for k, v in names.items() if k in g.lower()), '🎮 ' + os.path.basename(g)), os.path.basename(g)) for g in games)
            body = ('<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>DJI Phone Link</title></head><body style="background:#0b120d;color:#fff;font:16px system-ui;text-align:center;padding:20px">'
                    '<h2>Which game?</h2>%s<p style="opacity:0.6;font-size:13px">Everyone in multiplayer should pick the same one.</p></body></html>' % btns).encode()
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body); return
        if self.path in ('', '/') or not local or not os.path.isfile(local):
            g = find_game()
            if g:
                self.send_response(302); self.send_header('Location', '/' + g.replace(os.sep, '/')); self.end_headers(); return
            body = ('<html><body style="font:20px sans-serif;background:#111;color:#fff;padding:20px">'
                    '<h2>DJI Phone Link is working!</h2><p>But the game file is missing.</p>'
                    '<p>Put the <b>farm-sim4-....html</b> file in this folder on the computer:</p>'
                    '<p style="color:#ffd60a">%s</p><p>then refresh this page.</p></body></html>' % HERE).encode()
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body); return
        return super().do_GET()

    def websocket(self, mp=False):
        key = self.headers['Sec-WebSocket-Key']
        accept = base64.b64encode(hashlib.sha1((key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').encode()).digest()).decode()
        # written by hand: iPhone (Safari / Chrome) only accepts an HTTP/1.1 upgrade answer
        sock = self.connection
        sock.sendall(('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n'
                      'Sec-WebSocket-Accept: %s\r\n\r\n' % accept).encode())
        sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        if mp:
            return self.mp_loop(sock)
        with clients_lock: clients.add(sock)
        print('Game connected:', self.client_address[0])
        try:
            while True:
                b1, b2 = recv_exact(sock, 2)
                op = b1 & 0x0F; masked = b2 & 0x80; n = b2 & 0x7F
                if n == 126: n = struct.unpack('!H', recv_exact(sock, 2))[0]
                elif n == 127: n = struct.unpack('!Q', recv_exact(sock, 8))[0]
                mask = recv_exact(sock, 4) if masked else b'\0\0\0\0'
                data = bytearray(recv_exact(sock, n))
                for i in range(n): data[i] ^= mask[i % 4]
                if op == 0x8: break                      # close
                if op == 0x9: sock.sendall(ws_frame(bytes(data), 0xA)); continue  # ping -> pong
                pass                                     # game -> remote: not needed, this computer asks the remote itself
        except Exception:
            pass
        finally:
            with clients_lock: clients.discard(sock)
            print('Game disconnected:', self.client_address[0])
            self.close_connection = True


def ws_read(sock):
    b1, b2 = recv_exact(sock, 2)
    op = b1 & 0x0F; masked = b2 & 0x80; n = b2 & 0x7F
    if n == 126: n = struct.unpack('!H', recv_exact(sock, 2))[0]
    elif n == 127: n = struct.unpack('!Q', recv_exact(sock, 8))[0]
    mask = recv_exact(sock, 4) if masked else b'\0\0\0\0'
    data = bytearray(recv_exact(sock, n))
    for i in range(n): data[i] ^= mask[i % 4]
    return op, bytes(data)


def _mp_loop(self, sock):
    """Multiplayer: every message from one game is passed on to all the other games (here, and on linked computers)."""
    link_id = None
    if 'link=' in self.path:
        link_id = self.path.split('link=', 1)[1].split('&')[0][:16]
    if link_id:
        old = links.get(link_id)
        L = Link(sock, False, link_id, self.client_address[0])
        links[link_id] = L
        if old:
            old.close()
        print('\nLinked with the computer at %s - everyone is in the same game' % self.client_address[0])
    else:
        with clients_lock: mp_clients.add(sock)
        print('\nPilot joined multiplayer:', self.client_address[0])
    try:
        while True:
            op, data = ws_read(sock)
            if op == 0x8: break
            if op == 0x9: sock.sendall(ws_frame(data, 0xA)); continue
            if op == 0x1:
                if link_id: to_locals(data, None)          # from another computer: only to the games here
                else: relay_from_local(data, sock)         # from a game here: to the others here + other computers
    except Exception:
        pass
    finally:
        if link_id:
            if links.get(link_id) and links[link_id].sock is sock:
                del links[link_id]
                print('\nLost the link to', self.client_address[0])
        else:
            with clients_lock: mp_clients.discard(sock)
            print('\nPilot left multiplayer:', self.client_address[0])
        self.close_connection = True


def to_locals(data, skip):
    frame = ws_frame(data, 0x1)
    with clients_lock:
        others = [c for c in mp_clients if c is not skip]
    for c in others:
        try: c.sendall(frame)
        except Exception: pass


def relay_from_local(data, sock):
    to_locals(data, sock)
    for L in list(links.values()):
        L.send(data)


class Link:
    """A websocket to another DJI Phone Link. outgoing=True: we dialled it (we must mask what we send)."""
    def __init__(self, sock, outgoing, lid, ip):
        self.sock, self.outgoing, self.id, self.ip = sock, outgoing, lid, ip
        self.lock = threading.Lock()
    def send(self, data):
        try:
            with self.lock:
                if self.outgoing:
                    n = len(data); mask = os.urandom(4)
                    if n < 126: head = struct.pack('!BB', 0x81, 0x80 | n)
                    elif n < 65536: head = struct.pack('!BBH', 0x81, 0x80 | 126, n)
                    else: head = struct.pack('!BBQ', 0x81, 0x80 | 127, n)
                    m = (mask * (n // 4 + 1))[:n]
                    body = (int.from_bytes(data, 'big') ^ int.from_bytes(m, 'big')).to_bytes(n, 'big') if n else b''
                    self.sock.sendall(head + mask + body)
                else:
                    self.sock.sendall(ws_frame(data, 0x1))
        except Exception:
            self.close()
    def close(self):
        try: self.sock.close()
        except Exception: pass
        if links.get(self.id) is self: del links[self.id]


def dial_link(ip, port, their_id):
    """We have the smaller id, so we call them."""
    try:
        s = socket.create_connection((ip, port), timeout=4)
        key = base64.b64encode(os.urandom(16)).decode()
        s.sendall(('GET /mp?link=%s HTTP/1.1\r\nHost: %s:%d\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n'
                   'Sec-WebSocket-Key: %s\r\nSec-WebSocket-Version: 13\r\n\r\n' % (HELPER_ID, ip, port, key)).encode())
        resp = b''
        while b'\r\n\r\n' not in resp:
            ch = s.recv(1024)
            if not ch: raise ConnectionError('closed')
            resp += ch
        if b' 101 ' not in resp.split(b'\r\n', 1)[0]: raise ConnectionError('refused')
        s.settimeout(None); s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        L = Link(s, True, their_id, ip); links[their_id] = L
        print('\nLinked with the computer at %s - everyone is in the same game' % ip)
        while True:
            op, data = ws_read(s)
            if op == 0x8: break
            if op == 0x1: to_locals(data, None)
    except Exception:
        pass
    finally:
        L = links.get(their_id)
        if L and L.outgoing and L.ip == ip:
            L.close(); print('\nLost the link to', ip)


def beacon_loop():
    """Shout 'I'm here' on the Wi-Fi every 2 s and listen for other DJI Phone Links."""
    try:
        rx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        rx.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try: rx.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
        except Exception: pass
        rx.bind(('', BEACON_PORT)); rx.settimeout(0.5)
    except Exception as e:
        print('\n(auto-link off: %s)' % e); return
    tx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    tx.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    dialing = set(); last = 0
    while True:
        now = time.time()
        if now - last > 2:
            last = now
            msg = json.dumps({'djl': 1, 'id': HELPER_ID, 'ip': MY_IP, 'port': PORT}).encode()
            for dst in ('255.255.255.255', MY_IP.rsplit('.', 1)[0] + '.255' if MY_IP.count('.') == 3 else None, '127.0.0.1'):
                for bp in BEACON_TO:
                    if dst:
                        try: tx.sendto(msg, (dst, bp))
                        except Exception: pass
        try:
            data, addr = rx.recvfrom(2048)
            j = json.loads(data.decode())
        except Exception:
            continue
        if not isinstance(j, dict) or j.get('djl') != 1: continue
        tid = str(j.get('id', ''))[:16]; tport = int(j.get('port', PORT))
        tip = addr[0] if addr[0] and not addr[0].startswith('127.') else (j.get('ip') or addr[0])
        if str(tip).startswith('127.') or tip == MY_IP: tip = '127.0.0.1' if tport != PORT else tip
        if not tid or tid == HELPER_ID or tid in links or tid in dialing: continue
        if HELPER_ID < tid:
            dialing.add(tid)
            def go(ip=tip, port=tport, t=tid):
                dial_link(ip, port, t); dialing.discard(t)
            threading.Thread(target=go, daemon=True).start()


def keep_awake():
    """Stop the screen saver / sleep while this window is open (playing with a controller doesn't count as 'using' the computer)."""
    try:
        if sys.platform.startswith('win'):
            import ctypes
            ctypes.windll.kernel32.SetThreadExecutionState(0x80000000 | 0x00000002 | 0x00000001)
            return 'Windows'
        if sys.platform == 'darwin' and shutil.which('caffeinate'):
            p = subprocess.Popen(['caffeinate', '-d', '-i', '-w', str(os.getpid())]); atexit.register(p.terminate); return 'caffeinate'
        for cmd in (['gnome-session-inhibit', '--app-id', 'dji-phone-link', '--reason', 'Flying with DJI Phone Link', '--inhibit', 'idle:suspend', 'sleep', 'infinity'],
                    ['systemd-inhibit', '--what=idle:sleep', '--who=DJI Phone Link', '--why=Flying', 'sleep', 'infinity']):
            if shutil.which(cmd[0]):
                p = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                time.sleep(0.4)
                if p.poll() is None:
                    atexit.register(p.terminate); return cmd[0]
        if shutil.which('xdg-screensaver'):
            def poke():
                while True:
                    try: subprocess.call(['xdg-screensaver', 'reset'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    except Exception: pass
                    time.sleep(50)
            threading.Thread(target=poke, daemon=True).start(); return 'xdg-screensaver'
    except Exception:
        pass
    return None


Handler.mp_loop = _mp_loop


def status_loop():
    last = (0, 0)
    while True:
        time.sleep(3)
        with clients_lock: n = len(clients)
        now = (stats['from_remote'], stats['to_remote'])
        remote_ok = now[0] > last[0]
        with clients_lock: m = len(mp_clients)
        msg = 'Phones connected: %d   |   remote answering: %s   |   multiplayer pilots here: %d   |   linked computers: %d' % (
            n, 'NO REMOTE (multiplayer only)' if NO_REMOTE else 'YES' if remote_ok else ('no - is it ON?' if n else 'waiting for a phone'), m, len(links))
        print('\r' + msg + ' ' * 6, end='', flush=True)
        last = now

def find_games():
    out = []
    for root, dirs, files in os.walk(HERE):
        if root.count(os.sep) - HERE.count(os.sep) > 2: dirs[:] = []; continue
        for f in sorted(files):
            if f.lower().endswith('.html'):
                out.append(os.path.relpath(os.path.join(root, f), HERE))
    return out


def find_game():
    """Newest farm-sim .html in this folder or one folder below (zip extractors often add a folder)."""
    found = []
    for root, dirs, files in os.walk(HERE):
        if root.count(os.sep) - HERE.count(os.sep) > 2: dirs[:] = []; continue
        for f in files:
            if f.lower().endswith('.html'):
                rel = os.path.relpath(os.path.join(root, f), HERE)
                found.append((('farm' in f.lower()), f.lower(), rel))
    found.sort(reverse=True)
    return found[0][2] if found else None


def lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(('8.8.8.8', 80)); ip = s.getsockname()[0]; s.close(); return ip
    except Exception:
        return socket.gethostbyname(socket.gethostname())


def main():
    print('=== DJI Phone Link ===')
    open_remote()
    threading.Thread(target=remote_poller, daemon=True).start()
    threading.Thread(target=pusher, daemon=True).start()
    try:
        srv = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    except OSError:
        print('\n(!) Another DJI Phone Link window is already running. Close the other black window, then try again.')
        input('Press Enter to close...'); return
    global MY_IP
    game = find_game()
    ip = lan_ip(); MY_IP = ip
    print('Version 10 (auto-link + no screen saver + game chooser)   |   game file:', game or '(!) NOT FOUND')
    ka = keep_awake()
    print('Screen saver: ' + ('kept off while this window is open' if ka else 'could not turn it off (change it in your computer settings)'))
    threading.Thread(target=beacon_loop, daemon=True).start()
    print('Other computers running DJI Phone Link on this Wi-Fi join the same game by themselves.')
    print('\nOn THIS computer the game opens by itself (or go to  http://localhost:%d  in Firefox / Chrome / any browser).' % PORT)
    print('\nOn your PHONE or ANOTHER COMPUTER (same Wi-Fi), open:\n')
    print('    http://%s:%d\n' % (ip, PORT))
    if not game: print('  (!) No .html game file found next to this program - put the farm-sim file in this folder.')
    print('If Windows asks about the firewall, click "Allow" (private networks).')
    print('Leave this window open while you play. Close it to stop.\n')
    threading.Thread(target=status_loop, daemon=True).start()
    if '--no-browser' not in sys.argv:
        def _open():
            time.sleep(1.2)
            try:
                import webbrowser; webbrowser.open('http://localhost:%d' % PORT)
            except Exception: pass
        threading.Thread(target=_open, daemon=True).start()
    srv.serve_forever()


if __name__ == '__main__':
    main()
