import time
import os
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

import brain
import meta_manager

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "00_Raw")
WIKI_DIR = os.path.join(BASE_DIR, "10_Wiki")

class RawFolderHandler(FileSystemEventHandler):
    def __init__(self):
        self.timers = {}

    def process_file(self, filepath):
        filename = os.path.basename(filepath)
        
        # Remove timer from dict
        if filepath in self.timers:
            del self.timers[filepath]
            
        print(f"\n[Watchdog] Processing file: {filename}")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                raw_text = f.read().strip()
                
            if not raw_text:
                print("File is empty, skipping.")
                return

            print("-> Sending to Ollama (P-Reinforce Brain)...")
            parsed_data = brain.generate_wiki_content(raw_text, filename)
            
            if not parsed_data:
                print("-> Failed to generate structured data from LLM.")
                return
                
            # Prepare Target Directory
            target_category = parsed_data.get('category', 'Topics/Uncategorized')
            target_dir = os.path.join(WIKI_DIR, target_category)
            os.makedirs(target_dir, exist_ok=True)
            
            # Prepare Target File
            # Windows에서 금지된 문자(:, ?, *, <, >, |, ") 등을 언더바로 대체
            safe_title = parsed_data.get('title', 'Untitled')
            for char in [' ', '/', ':', '?', '*', '<', '>', '|', '"', '\\']:
                safe_title = safe_title.replace(char, '_')
            output_filename = f"{safe_title}.md"
            output_path = os.path.join(target_dir, output_filename)

            relative_output_path = f"10_Wiki/{target_category}/{output_filename}"
            
            # Write Markdown
            md_content = brain.format_markdown(parsed_data, filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(md_content)
                
            print(f"-> Successfully saved to: {relative_output_path}")
            
            # Update Meta & Git
            meta_manager.update_dashboard(filename, parsed_data, relative_output_path)
            meta_manager.update_graph(filename, parsed_data, relative_output_path)
            
            # Git Sync (Optional)
            meta_manager.git_sync(parsed_data.get('title', 'Unknown'))
            print("[Watchdog] Waiting for new files...")
            
        except Exception as e:
            print(f"Error processing file {filename}: {e}")

    def on_modified(self, event):
        if event.is_directory:
            return
            
        filepath = event.src_path
        filename = os.path.basename(filepath)
        
        # Skip temporary, hidden, or .keep files
        if filename.startswith('.') or not filename.endswith('.md'):
            return
            
        # 타이머 캔슬 (사용자가 계속 타이핑 중이면 리셋)
        if filepath in self.timers:
            self.timers[filepath].cancel()
            
        # 타이핑을 멈추고 5초가 지나면 파일 처리를 시작함
        timer = threading.Timer(5.0, self.process_file, args=(filepath,))
        self.timers[filepath] = timer
        timer.start()

    def on_created(self, event):
        self.on_modified(event)

def start_watchdog():
    print("=========================================")
    print("🧠 P-Reinforce Agent Initialized")
    print(f"🤖 Brain Model: {brain.MODEL_NAME} (Ollama Local)")
    print(f"📂 Monitoring Directory: {RAW_DIR}")
    print("=========================================")
    
    event_handler = RawFolderHandler()
    observer = Observer()
    observer.schedule(event_handler, RAW_DIR, recursive=False)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\nAgent stopped.")
    observer.join()

if __name__ == "__main__":
    start_watchdog()
