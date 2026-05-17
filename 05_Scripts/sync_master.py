import os
import shutil
import stat
from datetime import datetime

# Path Configuration
LOCAL_BASE = r"c:\Users\cfpcl\OneDrive\Desktop\AI_OS_HQ"
CLOUD_BASE = r"G:\내 드라이브\Family_Archive"

FOLDERS_TO_SYNC = ["00_Raw", "10_Wiki", "20_Meta", "03_Auto_Memory", "04_Sync_Brainstorm", "05_Scripts"]

def sync_folders():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting Hybrid Sync: Local <-> Cloud")
    
    for folder in FOLDERS_TO_SYNC:
        local_path = os.path.join(LOCAL_BASE, folder)
        cloud_path = os.path.join(CLOUD_BASE, folder)
        
        # Ensure base directories exist
        if not os.path.exists(local_path):
            os.makedirs(local_path, exist_ok=True)
        if not os.path.exists(cloud_path):
            os.makedirs(cloud_path, exist_ok=True)
            
        print(f"Syncing: {folder}...")
        
        # Collect all relative file paths from both sides
        local_files = get_all_files(local_path)
        cloud_files = get_all_files(cloud_path)
        
        all_files = set(local_files.keys()).union(set(cloud_files.keys()))
        
        for rel_file in all_files:
            l_file = os.path.join(local_path, rel_file)
            c_file = os.path.join(cloud_path, rel_file)
            
            l_exists = rel_file in local_files
            c_exists = rel_file in cloud_files
            
            try:
                if l_exists and not c_exists:
                    # Copy Local to Cloud
                    copy_file(l_file, c_file, "Local -> Cloud")
                elif c_exists and not l_exists:
                    # Copy Cloud to Local
                    copy_file(c_file, l_file, "Cloud -> Local")
                else:
                    # Both exist, check modification time
                    l_mtime = local_files[rel_file]
                    c_mtime = cloud_files[rel_file]
                    
                    # Threshold for time difference (2 seconds) to avoid floating point precision issues
                    if l_mtime - c_mtime > 2:
                        copy_file(l_file, c_file, "Local -> Cloud (Updated)")
                    elif c_mtime - l_mtime > 2:
                        copy_file(c_file, l_file, "Cloud -> Local (Updated)")
            except Exception as e:
                print(f"  [ERROR] Failed to sync {rel_file}: {e}")
                
    print("Sync Complete.")

def get_all_files(base_path):
    files_dict = {}
    for root, _, files in os.walk(base_path):
        for file in files:
            # Exclude git or hidden files if needed
            if ".git" in root:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_path)
            # get modification time
            mtime = os.stat(full_path).st_mtime
            files_dict[rel_path] = mtime
    return files_dict

def copy_file(src, dst, direction):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    print(f"  [{direction}] {os.path.basename(src)}")

def update_index():
    index_path = os.path.join(CLOUD_BASE, "20_Meta", "Index.md")
    if not os.path.exists(os.path.dirname(index_path)):
        os.makedirs(os.path.dirname(index_path), exist_ok=True)
    with open(index_path, 'a', encoding='utf-8') as f:
        now = datetime.now().strftime("%Y-%m-%d %H:%M")
        f.write(f"\n- **[{now}]** Hybrid Sync Completed. (Local <-> Cloud)\n")
    print("Index.md updated on Cloud.")

if __name__ == "__main__":
    sync_folders()
    update_index()
