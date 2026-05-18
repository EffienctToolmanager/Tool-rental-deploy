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

# Reverse Handoff Configuration (G Drive)
KIMPRO_DIR = r"G:\내 드라이브\Family_Archive\05_AI communication_Anti_Gemini pro"

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
        
        log_entry = f"- **[{timestamp}]** {event_type}: `{filename}` 파일이 감지되었습니다.\n"
        
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

class KimProFeedbackHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.is_directory and "KimPro_Feedback.md" in event.src_path:
            self.popup_feedback(event.src_path)

    def on_created(self, event):
        if not event.is_directory and "KimPro_Feedback.md" in event.src_path:
            self.popup_feedback(event.src_path)

    def popup_feedback(self, filepath):
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Kim Pro feedback detected! Popping up...")
        try:
            # 윈도우 기본 텍스트 에디터(VSCode 등)로 즉시 팝업
            os.startfile(filepath)
        except Exception as e:
            print(f"Error popping up file: {e}")

if __name__ == "__main__":
    if not os.path.exists(MONITOR_DIR):
        os.makedirs(MONITOR_DIR)
        
    if not os.path.exists(KIMPRO_DIR):
        os.makedirs(KIMPRO_DIR, exist_ok=True)
        
    # Observer 1: Local Raw Folder
    event_handler = RawFolderHandler()
    observer = PollingObserver()
    observer.schedule(event_handler, MONITOR_DIR, recursive=True)
    
    # Observer 2: Kim Pro Feedback Folder on G Drive
    kimpro_handler = KimProFeedbackHandler()
    kimpro_observer = PollingObserver()
    kimpro_observer.schedule(kimpro_handler, KIMPRO_DIR, recursive=False)
    
    print(f"🚀 Watchdog started on: {MONITOR_DIR}")
    print(f"🔄 Reverse Handoff monitor started on: {KIMPRO_DIR}")
    
    observer.start()
    kimpro_observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        kimpro_observer.stop()
        
    observer.join()
    kimpro_observer.join()
