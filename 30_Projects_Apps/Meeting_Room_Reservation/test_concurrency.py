import threading
import requests
import json
import time

KVDB_ENDPOINT = 'https://kvdb.io/buckets/gev_rooms_db_debe718e/keys/reservations'

def fetch_db():
    try:
        response = requests.get(KVDB_ENDPOINT, timeout=10)
        if response.status_code == 200:
            return response.json()
        return []
    except Exception as e:
        print(f"Error fetching: {e}")
        return []

def save_db(data):
    try:
        response = requests.post(KVDB_ENDPOINT, json=data, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"Error saving: {e}")
        return False

def simulate_user_booking(user_name, room_id, date, start_time, end_time, result_list):
    print(f"[User {user_name}] Attempting to book Room {room_id} for {date} {start_time} - {end_time}...")
    
    # 1. Fetch current database state (Read phase)
    db = fetch_db()
    
    # 2. Check for mathematical overlap (Conflict detection phase)
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
                print(f"[CONFLICT] [User {user_name}] Already booked by {res['organizer']} for {res['title']}")
                break
                
    if overlap:
        result_list.append((user_name, "Rejected (Conflict)"))
        return
        
    # 3. Add booking (Write phase)
    new_booking = {
        "id": f"RES-SIM-{user_name.upper()}",
        "roomId": room_id,
        "title": f"Simulation Meeting: {user_name}",
        "organizer": user_name,
        "dept": "Development",
        "date": date,
        "startTime": start_time,
        "endTime": end_time,
        "isBlocked": False
    }
    
    db.append(new_booking)
    success = save_db(db)
    
    if success:
        print(f"[SUCCESS] [User {user_name}] Reservation SUCCESSFUL!")
        result_list.append((user_name, "Success"))
    else:
        print(f"[FAIL] [User {user_name}] Save failed due to network/server error.")
        result_list.append((user_name, "Failed (Network)"))

def run_concurrency_test():
    print("==================================================")
    print("  GEV REAL-TIME DATABASE CONCURRENCY TEST ENGINE   ")
    print("==================================================")
    
    # Reset KVDB to mock data or empty
    print("Resetting database...")
    initial_data = [
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
    save_db(initial_data)
    time.sleep(1)
    
    results = []
    
    # Create two threads representing two users trying to book the SAME slot simultaneously
    # User A tries to book 13:00 - 14:00
    # User B tries to book 13:00 - 14:00
    thread_a = threading.Thread(target=simulate_user_booking, args=("A_Staff", "1", "2026-06-01", "13:00", "14:00", results))
    thread_b = threading.Thread(target=simulate_user_booking, args=("B_Staff", "1", "2026-06-01", "13:00", "14:00", results))
    
    # Fire them at the exact same millisecond
    thread_a.start()
    thread_b.start()
    
    thread_a.join()
    thread_b.join()
    
    print("\n--- CONCURRENCY RESULTS ---")
    for name, status in results:
        print(f"User: {name:10} | Result: {status}")
        
    # Verify final database content
    final_db = fetch_db()
    print("\n--- FINAL DATABASE ENTRIES ---")
    print(json.dumps(final_db, indent=2))
    print("==================================================")

if __name__ == "__main__":
    run_concurrency_test()
