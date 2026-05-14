import json
import os
import shutil
from datetime import datetime
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(BASE_DIR, "20_Meta", "Index.md")
GRAPH_PATH = os.path.join(BASE_DIR, "20_Meta", "Graph.json")
G_DRIVE_PATH = r"G:\내 드라이브\Family_Archive"

def sync_to_gdrive():
    """
    10_Wiki와 20_Meta 폴더를 구글 드라이브로 동기화합니다.
    (모바일 열람 및 가족 공유용)
    """
    print(f"Syncing to Google Drive: {G_DRIVE_PATH}...")
    try:
        for folder in ["10_Wiki", "20_Meta"]:
            src = os.path.join(BASE_DIR, folder)
            dst = os.path.join(G_DRIVE_PATH, folder)
            if os.path.exists(src):
                # Python 3.8+ 이상에서 dirs_exist_ok=True 사용 가능
                shutil.copytree(src, dst, dirs_exist_ok=True)
        print("Google Drive Sync successful.")
    except Exception as e:
        print(f"Google Drive Sync error: {e}")

def update_dashboard(raw_filename: str, parsed_data: dict, output_path: str):
    """
    Updates the Index.md dashboard with a new log entry.
    """
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    log_entry = f"- **[{now}]** `00_Raw/{raw_filename}` 문서를 `{output_path}` 로 변환 및 배치 완료. (분류: {parsed_data.get('category')})\n"
    
    try:
        with open(INDEX_PATH, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        insert_idx = -1
        for i, line in enumerate(lines):
            if "> 옵시디언을 켰을 때 가장 먼저 확인하세요!" in line:
                insert_idx = i + 1
                break
                
        if insert_idx != -1:
            lines.insert(insert_idx, "\n" + log_entry)
            with open(INDEX_PATH, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print("Dashboard updated successfully.")
            # 업데이트 성공 시 구글 드라이브 동기화 실행
            sync_to_gdrive()
        else:
            print("Could not find the log section in Index.md.")
    except Exception as e:
        print(f"Error updating dashboard: {e}")

def update_graph(raw_filename: str, parsed_data: dict, output_path: str):
    """
    Updates the Graph.json file with new nodes and edges.
    """
    try:
        with open(GRAPH_PATH, 'r', encoding='utf-8') as f:
            graph = json.load(f)
            
        # Add new node
        new_node = {
            "id": parsed_data['id'],
            "path": output_path,
            "type": "wiki",
            "title": parsed_data.get('title'),
            "tags": parsed_data.get('tags', [])
        }
        graph["nodes"].append(new_node)
        
        # Add edges
        graph["edges"].append({
            "source": parsed_data['id'],
            "target": f"10_Wiki/{parsed_data['category']}",
            "relationship": "parent"
        })
        graph["edges"].append({
            "source": parsed_data['id'],
            "target": f"00_Raw/{raw_filename}",
            "relationship": "derived_from"
        })
        
        with open(GRAPH_PATH, 'w', encoding='utf-8') as f:
            json.dump(graph, f, ensure_ascii=False, indent=2)
        print("Graph updated successfully.")
        # 업데이트 성공 시 구글 드라이브 동기화 실행
        sync_to_gdrive()
    except Exception as e:
        print(f"Error updating graph: {e}")

def git_sync(title: str):
    """
    Commits and pushes changes to GitHub, and triggers Graphify analysis.
    """
    print("Starting Git sync and Project Analysis...")
    try:
        # 1. Graphify 분석 실행 (지식 그래프 최신화)
        print("Running Graphify analysis on Tool_Rental_App...")
        subprocess.run(["python", "-m", "graphify", "Tool_Rental_App", "--obsidian", "--wiki", "--no-viz"], cwd=BASE_DIR)
        
        # 2. Git 작업
        subprocess.run(["git", "add", "."], cwd=BASE_DIR, check=True)
        commit_msg = f"[P-Reinforce] auto: '{title}' 지식화 및 Graphify 분석 완료"
        subprocess.run(["git", "commit", "-m", commit_msg], cwd=BASE_DIR, check=True)
        
        print("Pushing to GitHub...")
        result = subprocess.run(["git", "push"], cwd=BASE_DIR, capture_output=True, text=True)
        if result.returncode == 0:
            print("Git Push and Analysis successful.")
        else:
            print(f"Git Push failed: {result.stderr}")
    except Exception as e:
        print(f"Git sync/Analysis error: {e}")


