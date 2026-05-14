import os
import io
import csv
import time
import random
import datetime
import sqlite3
import asyncio
import aiofiles
import httpx
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi import Header
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler
from graph_api import upload_to_sharepoint

import config

app = FastAPI(title="Project AssetFlow Backend")

# --- Auth Middleware Scaffold ---
# In Stage 4, this is a placeholder that can be bypassed via feature flags.
async def verify_token(token: Optional[str] = None):
    """
    Placeholder for Microsoft Entra ID (Azure AD) JWT token validation.
    In MVP mode, this returns a guest user.
    """
    if not token:
        return {"user": "guest_user", "role": "tester"}
    # TODO: Implement actual JWT validation logic here in Stage 5
    return {"user": "verified_user", "role": "admin"}

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Helper ---
def get_db_connection():
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Asset_Master (
                Asset_Code TEXT PRIMARY KEY,
                Brand TEXT,
                Asset_Model TEXT,
                Location_Zone TEXT,
                Location_Rack TEXT,
                Current_Location TEXT,
                Calibration_Date TEXT,
                Current_Status TEXT DEFAULT 'Available'
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Transaction_Logs (
                Case_ID TEXT PRIMARY KEY,
                Asset_Code TEXT,
                Project_Name TEXT,
                Project_Code TEXT,
                User_Email TEXT,
                PM_Email TEXT,
                Rental_Date TEXT,
                Expected_Return_Date TEXT,
                Rental_Photo_URL TEXT,
                Return_Date TEXT,
                Return_Photo_URL TEXT,
                Status TEXT DEFAULT 'OPEN'
            )
        ''')
        cursor.execute("SELECT COUNT(*) FROM Asset_Master")
        if cursor.fetchone()[0] == 0:
            mock_assets = [
                ("MM-001", "Fluke", "115 Multimeter", "Zone A", "Rack 3", "Warehouse", "2026-06-15", "Available"),
                ("OS-002", "Tektronix", "TBS1052B Oscilloscope", "Zone B", "Rack 1", "Project Site A", "2024-05-10", "Rented"),
                ("TL-005", "Bosch", "GLM 50 Laser Measure", "Zone A", "Rack 2", "Warehouse", "2026-09-01", "Available"),
                ("CAL-009", "Mitutoyo", "Digital Caliper", "Zone C", "Rack 4", "Warehouse", "2026-05-20", "Available")
            ]
            cursor.executemany("INSERT INTO Asset_Master VALUES (?,?,?,?,?,?,?,?)", mock_assets)
            cursor.execute("""
                INSERT INTO Transaction_Logs (Case_ID, Asset_Code, Project_Name, Project_Code, User_Email, PM_Email, Rental_Date, Expected_Return_Date, Status)
                VALUES ('RNT-20260512-0A1B', 'OS-002', 'GE-Power-Link', 'GE-001', 'taegyu.kim@ge.com', 'pm@ge.com', '2026-05-12 09:00:00', '2024-05-10', 'OPEN')
            """)
        conn.commit()
    finally:
        conn.close()

# --- Teams Notification Engine ---
async def send_teams_notification(payload: dict):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(config.TEAMS_WEBHOOK_URL, json=payload)
            response.raise_for_status()
    except Exception as e:
        print(f"[!] Teams Webhook Error: {e}")

def create_adaptive_card(title: str, text: str, color: str = "Attention"):
    return {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "body": [
                        {"type": "TextBlock", "size": "Medium", "weight": "Bolder", "text": title, "color": color},
                        {"type": "TextBlock", "text": text, "wrap": True}
                    ],
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "version": "1.0"
                }
            }
        ]
    }

# --- Scheduled Jobs ---
async def daily_compliance_check():
    today = datetime.datetime.now().date()
    cal_threshold = today + datetime.timedelta(days=30)
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Transaction_Logs WHERE Status = 'OPEN' AND Expected_Return_Date < ?", (today.isoformat(),))
        overdue = cursor.fetchall()
        if overdue:
            msg = f"Found {len(overdue)} overdue rentals."
            await send_teams_notification(create_adaptive_card("🚨 Overdue Alert", msg, "Attention"))
        cursor.execute("SELECT * FROM Asset_Master WHERE Calibration_Date <= ?", (cal_threshold.isoformat(),))
        cal_due = cursor.fetchall()
        if cal_due:
            msg = f"{len(cal_due)} assets require calibration within 30 days."
            await send_teams_notification(create_adaptive_card("⚠️ Calibration Warning", msg, "Warning"))
    finally:
        conn.close()

def run_scheduled_job():
    asyncio.run(daily_compliance_check())

# --- Background Workers ---
async def monitor_link_files():
    while True:
        try:
            for filename in os.listdir(config.LINK_DIR):
                if filename.endswith(".txt"):
                    file_path = os.path.join(config.LINK_DIR, filename)
                    parts = filename.replace(".txt", "").split("_")
                    if len(parts) < 2: continue
                    case_id, action = parts[0], parts[1]
                    async with aiofiles.open(file_path, mode='r') as f:
                        url = (await f.read()).strip()
                    conn = get_db_connection()
                    try:
                        cursor = conn.cursor()
                        if action == "rent":
                            cursor.execute("UPDATE Transaction_Logs SET Rental_Photo_URL = ? WHERE Case_ID = ?", (url, case_id))
                        elif action == "return":
                            cursor.execute("UPDATE Transaction_Logs SET Return_Photo_URL = ? WHERE Case_ID = ?", (url, case_id))
                        conn.commit()
                        os.remove(file_path)
                    finally:
                        conn.close()
        except Exception as e:
            print(f"[!] Background Worker Error: {e}")
        await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    init_db()
    asyncio.create_task(monitor_link_files())
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_scheduled_job, 'cron', hour=8, minute=0)
    scheduler.start()

# --- API Endpoints ---
@app.get("/api/assets")
async def get_assets():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Asset_Master")
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

@app.get("/api/rentals")
async def get_rentals():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.*, a.Asset_Model as model 
            FROM Transaction_Logs t 
            JOIN Asset_Master a ON t.Asset_Code = a.Asset_Code 
            WHERE t.Status = 'OPEN'
        """)
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

# --- Analytics & Reports ---
@app.get("/api/reports/analytics")
async def get_analytics(user=Depends(verify_token)):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # 1. Rentals by Project
        cursor.execute("SELECT Project_Code as name, COUNT(*) as count FROM Transaction_Logs GROUP BY Project_Code")
        rentals_by_project = [dict(row) for row in cursor.fetchall()]
        
        # 2. Calibration Status
        today = datetime.datetime.now().date()
        warning_date = today + datetime.timedelta(days=30)
        
        cursor.execute("SELECT Calibration_Date FROM Asset_Master")
        cals = cursor.fetchall()
        
        safe = 0
        warning = 0
        expired = 0
        
        for row in cals:
            date_str = row['Calibration_Date']
            if not date_str: continue
            cal_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
            if cal_date < today:
                expired += 1
            elif cal_date <= warning_date:
                warning += 1
            else:
                safe += 1
                
        calibration_status = [
            {"name": "Safe", "value": safe, "color": "#4CAF50"},
            {"name": "Warning", "value": warning, "color": "#FFC107"},
            {"name": "Expired", "value": expired, "color": "#F44336"}
        ]
        
        return {
            "rentals_by_project": rentals_by_project,
            "calibration_status": calibration_status
        }
    finally:
        conn.close()

@app.get("/api/reports/export")
async def export_csv(user=Depends(verify_token)):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Transaction_Logs")
        rows = cursor.fetchall()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        if rows:
            writer.writerow(rows[0].keys())
            # Write data
            for row in rows:
                writer.writerow(list(row))
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=assetflow_report.csv"}
        )
    finally:
        conn.close()

@app.post("/api/rent")
async def rent_asset(
    background_tasks: BackgroundTasks,
    assetCode: str = Form(...),
    projectName: str = Form(...),
    projectCode: str = Form(...),
    userEmail: str = Form(...),
    pmEmail: str = Form(...),
    expectedReturnDate: str = Form(...),
    conditionPhoto: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    date_str = datetime.datetime.now().strftime("%Y%m%d")
    random_hex = hex(random.getrandbits(16))[2:].zfill(4).upper()
    case_id = f"RNT-{date_str}-{random_hex}"
    file_ext = os.path.splitext(conditionPhoto.filename)[1]
    save_path = os.path.join(config.IMAGE_DIR, f"{case_id}_rent{file_ext}")
    try:
        async with aiofiles.open(save_path, "wb") as out_file:
            photo_bytes = await conditionPhoto.read()
            await out_file.write(photo_bytes)
        
        # Stage 5: Optional Graph API Upload
        cloud_url = None
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            cloud_url = await upload_to_sharepoint(photo_bytes, f"{case_id}_rent{file_ext}", token)

        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO Transaction_Logs (
                    Case_ID, Asset_Code, Project_Name, Project_Code, 
                    User_Email, PM_Email, Rental_Date, Expected_Return_Date, Status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')
            """, (case_id, assetCode, projectName, projectCode, userEmail, pmEmail, 
                  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), expectedReturnDate))
            cursor.execute("UPDATE Asset_Master SET Current_Status = 'Rented' WHERE Asset_Code = ?", (assetCode,))
            conn.commit()
            background_tasks.add_task(send_teams_notification, {"text": f"✅ **{userEmail}** checked out **{assetCode}**."})
            return {"status": "success", "case_id": case_id}
        finally:
            conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/return/{case_id}")
async def return_asset(
    case_id: str, 
    background_tasks: BackgroundTasks, 
    returnPhoto: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    file_ext = os.path.splitext(returnPhoto.filename)[1]
    save_path = os.path.join(config.IMAGE_DIR, f"{case_id}_return{file_ext}")
    try:
        async with aiofiles.open(save_path, "wb") as out_file:
            photo_bytes = await returnPhoto.read()
            await out_file.write(photo_bytes)
        
        # Stage 5: Optional Graph API Upload
        cloud_url = None
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            cloud_url = await upload_to_sharepoint(photo_bytes, f"{case_id}_return{file_ext}", token)

        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT Asset_Code FROM Transaction_Logs WHERE Case_ID = ?", (case_id,))
            row = cursor.fetchone()
            if not row: raise HTTPException(status_code=404, detail="Case ID not found")
            asset_code = row['Asset_Code']
            cursor.execute("UPDATE Transaction_Logs SET Status = 'CLOSED', Return_Date = ? WHERE Case_ID = ?", 
                           (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), case_id))
            cursor.execute("UPDATE Asset_Master SET Current_Status = 'Available' WHERE Asset_Code = ?", (asset_code,))
            conn.commit()
            background_tasks.add_task(send_teams_notification, {"text": f"🔄 Asset **{case_id}** returned."})
            return {"status": "success", "case_id": case_id}
        finally:
            conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Static File Serving (Production Mode) ---
# Note: Ensure 'npm run build' is executed so 'dist' folder exists.
if os.path.exists("dist"):
    # Serve static assets (js, css, images)
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    # Catch-all route for SPA: Returns index.html for any route not matched by API
    @app.get("/{catchall:path}")
    async def serve_spa(catchall: str):
        # Exclude API routes from catch-all just in case
        if catchall.startswith("api"):
            raise HTTPException(status_code=404)
        return FileResponse("dist/index.html")
else:
    @app.get("/")
    async def root_warning():
        return {"message": "Project AssetFlow Backend is running. Frontend 'dist' folder not found. Run 'npm run build'."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
