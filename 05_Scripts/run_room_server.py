import http.server
import socketserver
import os
import sys

# Configure UTF-8 encoding for standard output on Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

PORT = 8000
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "30_Projects_Apps", "Meeting_Room_Reservation"))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    if not os.path.exists(DIRECTORY):
        print(f"❌ Error: Target directory does not exist: {DIRECTORY}", flush=True)
        return
        
    print(f"🔄 Starting GEV Room Reservation Server...", flush=True)
    print(f"📂 Serving files from: {DIRECTORY}", flush=True)
    
    # Enable dual-protocol (IPv4/IPv6) socket reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🟢 Server is active at: http://localhost:{PORT}/index.html", flush=True)
        print(f"💡 Press Ctrl+C to terminate.", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Server terminated by user.", flush=True)

if __name__ == "__main__":
    run()
