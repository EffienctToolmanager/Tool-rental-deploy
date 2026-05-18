import os
import shutil
import stat
from datetime import datetime

# Path Configuration
LOCAL_BASE = r"c:\Users\cfpcl\OneDrive\Desktop\AI_OS_HQ"
CLOUD_BASE = r"G:\내 드라이브\Family_Archive"
HANDOFF_SRC = os.path.join(LOCAL_BASE, "03_Auto_Memory", "handoff.md")
HANDOFF_DEST = os.path.join(CLOUD_BASE, "05_AI communication_Anti_Gemini pro", "Current_Issue_Handoff.md")

IGNORE_DIRS = {".git", "__pycache__", ".venv", "node_modules", "deploy_tmp", ".obsidian"}

def get_snapshot_path(filepath):
    """Generates an append-only snapshot filename with timestamp"""
    dir_name = os.path.dirname(filepath)
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return os.path.join(dir_name, f"{name}_{timestamp}{ext}")

def sync_folders():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting Full Hybrid Sync (Append-Only Snapshot Mode)")
    
    if not os.path.exists(LOCAL_BASE):
        print(f"Local base {LOCAL_BASE} does not exist.")
        return
        
    if not os.path.exists(CLOUD_BASE):
        os.makedirs(CLOUD_BASE, exist_ok=True)
        
    local_files = get_all_files(LOCAL_BASE)
    cloud_files = get_all_files(CLOUD_BASE)
    
    all_files = set(local_files.keys()).union(set(cloud_files.keys()))
    
    for rel_file in all_files:
        l_file = os.path.join(LOCAL_BASE, rel_file)
        c_file = os.path.join(CLOUD_BASE, rel_file)
        
        l_exists = rel_file in local_files
        c_exists = rel_file in cloud_files
        
        try:
            if l_exists and not c_exists:
                copy_file_snapshot(l_file, c_file, "Local -> Cloud (New)")
            elif c_exists and not l_exists:
                copy_file_snapshot(c_file, l_file, "Cloud -> Local (New)")
            else:
                l_mtime = local_files[rel_file]
                c_mtime = cloud_files[rel_file]
                
                # If modified within the last 2 seconds, ignore to prevent infinite loop
                if abs(l_mtime - c_mtime) <= 2:
                    continue
                    
                if l_mtime > c_mtime:
                    copy_file_snapshot(l_file, c_file, "Local -> Cloud (Update Snapshot)")
                elif c_mtime > l_mtime:
                    copy_file_snapshot(c_file, l_file, "Cloud -> Local (Update Snapshot)")
        except Exception as e:
            print(f"  [ERROR] Failed to sync {rel_file}: {e}")
            
    print("Sync Complete.")

def perform_handoff():
    if os.path.exists(HANDOFF_SRC):
        os.makedirs(os.path.dirname(HANDOFF_DEST), exist_ok=True)
        try:
            with open(HANDOFF_SRC, 'r', encoding='utf-8') as src, \
                 open(HANDOFF_DEST, 'w', encoding='utf-8') as dst:
                 
                content = src.read()
                header = f"# 🤝 Handoff for Kim Pro (Gemini)\n\n"
                header += f"**Synchronized At:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
                header += f"**Source:** Antigravity (Local C: Workspace)\n\n"
                header += "---\n\n"
                
                dst.write(header + content)
            print(f"✅ Handoff file created at {HANDOFF_DEST}")
        except Exception as e:
            print(f"  [ERROR] Failed to perform handoff: {e}")

def get_all_files(base_path):
    files_dict = {}
    for root, dirs, files in os.walk(base_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_path)
            
            # Ignore existing snapshot files to avoid endless replication storms
            # By skipping any file that already matches the _YYYYMMDD_HHMMSS pattern heuristically
            if rel_path.startswith('.git') or '_202' in rel_path: 
                continue
            try:
                mtime = os.stat(full_path).st_mtime
                files_dict[rel_path] = mtime
            except FileNotFoundError:
                pass
    return files_dict

def copy_file_snapshot(src, dst, direction):
    """Copies file but appends timestamp to the destination to prevent split-brain"""
    snapshot_dst = get_snapshot_path(dst)
    os.makedirs(os.path.dirname(snapshot_dst), exist_ok=True)
    shutil.copy2(src, snapshot_dst)
    print(f"  [{direction}] {os.path.basename(snapshot_dst)}")

def update_index():
    index_path = os.path.join(CLOUD_BASE, "20_Meta", "Index.md")
    if not os.path.exists(os.path.dirname(index_path)):
        os.makedirs(os.path.dirname(index_path), exist_ok=True)
    with open(index_path, 'a', encoding='utf-8') as f:
        now = datetime.now().strftime("%Y-%m-%d %H:%M")
        f.write(f"\n- **[{now}]** Hybrid Full Sync (Append-Only Snapshot) & Handoff Completed.\n")
    print("Index.md updated on Cloud.")

if __name__ == "__main__":
    sync_folders()
    perform_handoff()
    update_index()
