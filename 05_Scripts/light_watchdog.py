import os
import time
import subprocess
from datetime import datetime
from watchdog.observers.polling import PollingObserver
from watchdog.events import FileSystemEventHandler

# Configuration
MONITOR_DIR = r"c:\Users\cfpcl\OneDrive\Desktop\AI_OS_HQ\00_Raw"
LOG_FILE = r"c:\Users\cfpcl\OneDrive\Desktop\AI_OS_HQ\03_Auto_Memory\watchdog_log.md"
SYNC_SCRIPT = r"c:\Users\cfpcl\OneDrive\Desktop\AI_OS_HQ\05_Scripts\sync_master.py"

class RawFolderHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            self.log_event("CREATED", event.src_path)
            self.trigger_sync()

    def on_moved(self, event):
        if not event.is_directory:
            self.log_event("MOVED", event.dest_path)
            self.trigger_sync()
            
    def on_modified(self, event):
        if not event.is_directory:
            self.log_event("MODIFIED", event.src_path)
            self.trigger_sync()

    def log_event(self, event_type, file_path):
        filename = os.path.basename(file_path)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Log to markdown for Kim-Dae-Pyo to read
        log_entry = f"- **[{timestamp}]** {event_type}: `{filename}` 파일이 감지되었습니다. (분석 대기 중)\n"
        
        try:
            with open(LOG_FILE, "a", encoding="utf-8") as f:
                f.write(log_entry)
            print(f"Log updated: {filename}")
        except Exception as e:
            print(f"Error writing log: {e}")

    def trigger_sync(self):
        try:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Triggering sync_master.py...")
            subprocess.Popen(["python", SYNC_SCRIPT])
        except Exception as e:
            print(f"Error triggering sync: {e}")

if __name__ == "__main__":
    if not os.path.exists(MONITOR_DIR):
        os.makedirs(MONITOR_DIR)
        
    event_handler = RawFolderHandler()
    observer = PollingObserver()
    observer.schedule(event_handler, MONITOR_DIR, recursive=True)
    
    print(f"🚀 Watchdog started on: {MONITOR_DIR}")
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
