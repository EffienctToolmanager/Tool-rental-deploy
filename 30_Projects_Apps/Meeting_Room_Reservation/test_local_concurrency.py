import subprocess
import time
import requests
import threading
import json
import os
import sys

# Target directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_SCRIPT = os.path.join(BASE_DIR, "..", "..", "05_Scripts", "run_room_server.py")
DB_FILE = os.path.join(BASE_DIR, "reservations.json")
LOCAL_ENDPOINT = "http://localhost:8000/reservations.json"

def clean_database():
    # Set standard initial data with a stable baseline timestamp
    initial_data = {
      "lastUpdated": "BASELINE-V1.0",
      "reservations": [
        {
          "id": "RES-001",
          "roomId": "1",
          "title": "Design Guideline Review",
          "organizer": "KimPro",
          "dept": "Design",
          "date": "2026-06-01",
          "startTime": "10:00",
          "endTime": "12:00",
          "isBlocked": False
        }
      ]
    }
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(initial_data, f, indent=2, ensure_ascii=False)
    print("[TEST SETUP] Database initialized with clean baseline 'BASELINE-V1.0'.")

def simulate_user_booking(user_name, room_id, date, start_time, end_time, results):
    print(f"[User {user_name}] Hitting Submit Form...")
    try:
        # 1. Fetch current database state and retrieve the baseline timestamp
        response = requests.get(LOCAL_ENDPOINT, params={"nocache": str(time.time())}, timeout=5)
        if response.status_code != 200:
            results.append((user_name, "Fail (Server Get Error)"))
            return
            
        db_wrapper = response.json()
        baseline_timestamp = db_wrapper.get("lastUpdated", "")
        db = db_wrapper.get("reservations", [])
        
        print(f"[User {user_name}] Read baseline version: '{baseline_timestamp}'")
        
        # Simulate network delay/UI interaction before post (0.4s)
        time.sleep(0.4)
        
        # 2. Local check: mathematically, it was free when we read it!
        def to_mins(t_str):
            h, m = map(int, t_str.split(':'))
            return h * 60 + m

        new_start = to_mins(start_time)
        new_end = to_mins(end_time)
        
        overlap = False
        for res in db:
            if res['roomId'] == room_id and res['date'] == date:
                peer_start = to_mins(res['startTime'])
                peer_end = to_mins(res['endTime'])
                if max(new_start, peer_start) < min(new_end, peer_end):
                    overlap = True
                    break
                    
        if overlap:
            print(f"[LOCAL REJECTION] [User {user_name}] Stale overlap check failed.")
            results.append((user_name, "Rejected (Local Conflict)"))
            return
            
        # 3. Try to save: send our baseline timestamp along with new booking
        new_booking = {
            "id": f"RES-SIM-{user_name.upper()}",
            "roomId": room_id,
            "title": f"Concurrent Meeting: {user_name}",
            "organizer": user_name,
            "dept": "Development",
            "date": date,
            "startTime": start_time,
            "endTime": end_time,
            "isBlocked": False
        }
        
        # Append to our local read copy
        db.append(new_booking)
        payload = {
            "lastUpdated": baseline_timestamp, # Send read baseline for OCC verification
            "reservations": db
        }
        
        print(f"[User {user_name}] Attempting database write with baseline '{baseline_timestamp}'...")
        save_response = requests.post(LOCAL_ENDPOINT, json=payload, timeout=5)
        
        if save_response.status_code == 200:
            res_data = save_response.json()
            new_version = res_data.get("lastUpdated", "")
            print(f"[SUCCESS] [User {user_name}] Write accepted! Server updated version to '{new_version}'")
            results.append((user_name, "Success"))
        elif save_response.status_code == 409:
            print(f"[OCC CONFLICT] [User {user_name}] Server rejected write with HTTP 409 Conflict!")
            results.append((user_name, "OCC Conflict (Rejected)"))
        else:
            print(f"[FAIL] [User {user_name}] Server returned HTTP {save_response.status_code}")
            results.append((user_name, f"HTTP Error {save_response.status_code}"))
            
    except Exception as e:
        print(f"[ERROR] [User {user_name}] Exception during transaction: {e}")
        results.append((user_name, f"Exception: {e}"))

def main():
    print("==================================================")
    print(" GEV MULTI-USER LOCAL CONCURRENCY INTEGRATION TEST")
    print("==================================================")
    
    # 1. Clear state
    clean_database()
    
    # 2. Launch Local HTTP Server in a background subprocess
    print("Starting local HTTP server...")
    server_process = subprocess.Popen(
        [sys.executable, SERVER_SCRIPT],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=os.path.dirname(SERVER_SCRIPT)
    )
    
    # Wait for server to bind to port 8000
    time.sleep(2)
    
    # Verify server is alive
    try:
        test_get = requests.get("http://localhost:8000/index.html", timeout=3)
        if test_get.status_code == 200:
            print("[INFO] Server successfully verified as active at http://localhost:8000/")
        else:
            print(f"[ERROR] Server returned status code {test_get.status_code}, aborting.")
            server_process.terminate()
            return
    except Exception as e:
        print(f"[ERROR] Failed to connect to server: {e}. Aborting.")
        server_process.terminate()
        return
        
    results = []
    
    # Create two threads representing two employees hitting the booking save button simultaneously
    # Thread A tries to book Room 1: 14:00 - 15:00
    # Thread B tries to book Room 1: 14:00 - 15:00 (Conflict)
    thread_a = threading.Thread(target=simulate_user_booking, args=("A_Manager", "1", "2026-06-01", "14:00", "15:00", results))
    thread_b = threading.Thread(target=simulate_user_booking, args=("B_Director", "1", "2026-06-01", "14:00", "15:00", results))
    
    print("\n[TEST RUN] Firing concurrent booking operations...")
    thread_a.start()
    time.sleep(0.2)  # Simulate Manager A clicking 0.2 seconds before Director B
    thread_b.start()
    
    thread_a.join()
    thread_b.join()
    
    # 3. Clean up server process
    print("\nShutting down local server...")
    server_process.terminate()
    server_process.wait()
    print("Server process successfully terminated.")
    
    # 4. Analyze results
    print("\n--- INTEGRATION AUDIT RESULTS ---")
    for name, status in results:
        print(f"Employee: {name:12} | Transaction Result: {status}")
        
    # Read final state on disk
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        final_db = json.load(f)
        
    print("\n--- FINAL DATABASE FILE CONTENT (reservations.json) ---")
    print(json.dumps(final_db, indent=2, ensure_ascii=False))
    print("==================================================")

if __name__ == "__main__":
    main()
