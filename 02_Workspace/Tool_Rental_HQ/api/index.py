import os
import time
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vercel_serverless_backend")

app = FastAPI(title="Staging Tool Rental Serverless Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TENANT_ID = os.getenv("MS_TENANT_ID", "dummy_tenant_id")
CLIENT_ID = os.getenv("MS_CLIENT_ID", "dummy_client_id")
CLIENT_SECRET = os.getenv("MS_CLIENT_SECRET", "dummy_client_secret")

def get_msal_token():
    if TENANT_ID == "dummy_tenant_id":
        return "dummy_access_token_12345"
    return "real_token"

# --- In-Memory Persistent Database for Premium Staging Demo ---
# In-memory mock database to allow seamless serverless state updates
INITIAL_ITEMS = [
    {"id": "1", "equipmentCode": "DSP01", "name": "Control System DSP01", "projectName": "Project Site A", "returnDate": "2026-05-20", "status": "Rented", "userEmail": "pm@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260515-ABCD"},
    {"id": "2", "equipmentCode": "LTS02", "name": "Laser Tracker LTS02", "projectName": "Project Site A", "returnDate": "2026-05-20", "status": "Rented", "userEmail": "pm@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260515-ABCD"},
    {"id": "3", "equipmentCode": "CAM11", "name": "4K Action Camera Set", "projectName": "Project Site B", "returnDate": "2026-05-25", "status": "Rented", "userEmail": "tech@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260516-WXYZ"}
]

# Dynamic loading of 20 available generic tools
for i in range(4, 25):
    INITIAL_ITEMS.append({
        "id": str(i), 
        "equipmentCode": f"TOOL{i:02d}", 
        "name": f"Generic Test Tool {i}", 
        "projectName": "", 
        "returnDate": "", 
        "status": "Available",
        "userEmail": "",
        "pmEmail": "",
        "caseId": ""
    })

db_storage = {"items": INITIAL_ITEMS}

# --- API Routes ---

@app.get("/api/sharepoint/list")
async def get_sharepoint_list():
    logger.info("Fetching SharePoint items list.")
    return {
        "status": "success", 
        "data": db_storage["items"]
    }

class CartItem(BaseModel):
    equipmentCode: str
    photoUrl: Optional[str] = None

class BulkRentalRequest(BaseModel):
    caseId: str
    items: List[CartItem]
    projectName: str
    returnDate: str
    pmEmail: str
    userEmail: str

@app.post("/api/sharepoint/rental")
async def create_rental_record(rental: BulkRentalRequest):
    logger.info(f"Rental request received for Case {rental.caseId}")
    
    # Dynamic database update: switch requested items to Rented status
    requested_codes = {item.equipmentCode for item in rental.items}
    
    updated_items = []
    for item in db_storage["items"]:
        if item["equipmentCode"] in requested_codes:
            updated_items.append({
                "id": item["id"],
                "equipmentCode": item["equipmentCode"],
                "name": item["name"],
                "projectName": rental.projectName,
                "returnDate": rental.returnDate,
                "status": "Rented",
                "userEmail": rental.userEmail,
                "pmEmail": rental.pmEmail,
                "caseId": rental.caseId
            })
        else:
            updated_items.append(item)
            
    db_storage["items"] = updated_items
    logger.info(f"Database updated. Case {rental.caseId} live loaded.")
    
    return {
        "status": "success", 
        "message": f"Bulk Rental created dynamically for Case {rental.caseId}", 
        "caseId": rental.caseId
    }

class ExtendItem(BaseModel):
    equipmentCode: str
    newReturnDate: str

class BulkExtendRequest(BaseModel):
    caseId: str
    items: List[ExtendItem]

@app.post("/api/sharepoint/extend")
async def extend_rental_record(request: BulkExtendRequest):
    logger.info(f"Extension request received for Case {request.caseId}")
    extend_map = {item.equipmentCode: item.newReturnDate for item in request.items}
    
    updated_items = []
    for item in db_storage["items"]:
        if item["equipmentCode"] in extend_map:
            item_copy = item.copy()
            item_copy["returnDate"] = extend_map[item["equipmentCode"]]
            updated_items.append(item_copy)
        else:
            updated_items.append(item)
            
    db_storage["items"] = updated_items
    logger.info(f"Extension processed successfully in db. Case {request.caseId} extended.")
    return {
        "status": "success", 
        "message": f"Case {request.caseId} extended and items new return dates synchronized."
    }

@app.post("/api/sharepoint/upload")
async def upload_file_to_sharepoint(filename: str, file: UploadFile = File(...)):
    # 파일 이미지 모크 업로드 지원
    logger.info(f"Mocking upload of image: {filename}")
    return {
        "status": "success", 
        "webUrl": f"https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300"
    }

class ReturnItem(BaseModel):
    equipmentCode: str

class BulkReturnRequest(BaseModel):
    caseId: str
    items: List[ReturnItem]

@app.post("/api/sharepoint/return")
async def return_rental_record(request: BulkReturnRequest):
    logger.info(f"Return request received for Case {request.caseId}")
    returned_codes = {item.equipmentCode for item in request.items}
    
    updated_items = []
    for item in db_storage["items"]:
        if item["equipmentCode"] in returned_codes:
            # Restore status to Available, clearing out metadata
            updated_items.append({
                "id": item["id"],
                "equipmentCode": item["equipmentCode"],
                "name": item["name"],
                "projectName": "",
                "returnDate": "",
                "status": "Available",
                "userEmail": "",
                "pmEmail": "",
                "caseId": ""
            })
        else:
            updated_items.append(item)
            
    db_storage["items"] = updated_items
    logger.info(f"Return processed successfully in db. Case {request.caseId} returned.")
    return {
        "status": "success", 
        "message": f"Case {request.caseId} returned and items status restored to Available."
    }

# --- Analytics & Compliance Dashboard API Mocking [NEW] ---
# 차트가 Loading에서 평생 멈추지 않고 미려하게 표현되도록 분석 통계 라우트 추가

@app.get("/api/reports/analytics")
async def get_analytics_data():
    # Dynamic calculations based on current status (Rented vs Available)
    rented_count = sum(1 for x in db_storage["items"] if x["status"] == "Rented")
    available_count = sum(1 for x in db_storage["items"] if x["status"] == "Available")
    
    project_map = {}
    for item in db_storage["items"]:
        if item["status"] == "Rented" and item["projectName"]:
            proj = item["projectName"]
            project_map[proj] = project_map.get(proj, 0) + 1
            
    rentals_by_project = [{"name": proj, "count": count} for proj, count in project_map.items()]
    if not rentals_by_project:
        rentals_by_project = [{"name": "Project Site A", "count": 2}, {"name": "Project Site B", "count": 1}]
        
    return {
        "rentals_by_project": rentals_by_project,
        "calibration_status": [
            {"name": "Safe", "value": available_count + 1, "color": "#4CAF50"},
            {"name": "Warning", "value": 2, "color": "#FFC107"},
            {"name": "Expired", "value": 1, "color": "#F44336"}
        ]
    }

@app.get("/api/reports/export")
async def export_monthly_report():
    # 실시간 모크 CSV 다운로드 내보내기 스트림 구현
    from fastapi.responses import StreamingResponse
    import io
    
    output = io.StringIO()
    output.write("Asset Code,Asset Name,Project Name,Status,User Email,Return Date\n")
    for item in db_storage["items"]:
        output.write(f"{item['equipmentCode']},{item['name']},{item['projectName']},{item['status']},{item['userEmail']},{item['returnDate']}\n")
        
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=AssetFlow_Report_Staging.csv"
    return response
