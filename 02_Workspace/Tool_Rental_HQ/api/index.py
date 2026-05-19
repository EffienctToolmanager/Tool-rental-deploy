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
# 서버리스 컨테이너 수명 주기 동안 대여 신청 내역이 동적으로 프론트엔드와 실시간 유지되게 설계
INITIAL_ITEMS = [
    {"id": "1", "equipmentCode": "DSP01", "name": "Control System DSP01", "projectName": "A 현장", "returnDate": "2026-05-20", "status": "대여중", "userEmail": "pm@ge.com", "caseId": "TR-20260515-ABCD"},
    {"id": "2", "equipmentCode": "LTS02", "name": "Laser Tracker LTS02", "projectName": "A 현장", "returnDate": "2026-05-20", "status": "대여중", "userEmail": "pm@ge.com", "caseId": "TR-20260515-ABCD"},
    {"id": "3", "equipmentCode": "CAM11", "name": "4K Action Camera Set", "projectName": "B 현장", "returnDate": "2026-05-25", "status": "대여중", "userEmail": "tech@ge.com", "caseId": "TR-20260516-WXYZ"}
]

# 20개의 여유 보관중 공구 대량 로드
for i in range(4, 25):
    INITIAL_ITEMS.append({
        "id": str(i), 
        "equipmentCode": f"TOOL{i:02d}", 
        "name": f"Generic Test Tool {i}", 
        "projectName": "", 
        "returnDate": "", 
        "status": "보관중",
        "userEmail": "",
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

@app.post("/api/sharepoint/rental")
async def create_rental_record(rental: BulkRentalRequest):
    logger.info(f"Rental request received for Case {rental.caseId}")
    
    # 동적 데이터 갱신: 장바구니에 담겨 들어온 장비 코드들을 찾아 대여 상태로 즉시 변경
    requested_codes = {item.equipmentCode for item in rental.items}
    
    updated_items = []
    for item in db_storage["items"]:
        if item["equipmentCode"] in requested_codes:
            # 보관중인 장비를 대여중으로 동적 스위칭
            updated_items.append({
                "id": item["id"],
                "equipmentCode": item["equipmentCode"],
                "name": item["name"],
                "projectName": rental.projectName,
                "returnDate": rental.returnDate,
                "status": "대여중",
                "userEmail": rental.pmEmail,
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

@app.post("/api/sharepoint/upload")
async def upload_file_to_sharepoint(filename: str, file: UploadFile = File(...)):
    # 파일 이미지 모크 업로드 지원
    logger.info(f"Mocking upload of image: {filename}")
    return {
        "status": "success", 
        "webUrl": f"https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300"
    }

# --- Analytics & Compliance Dashboard API Mocking [NEW] ---
# 차트가 Loading에서 평생 멈추지 않고 미려하게 표현되도록 분석 통계 라우트 추가

@app.get("/api/reports/analytics")
async def get_analytics_data():
    # 현재 데이터베이스 상태를 기준으로 동적 차트 통계치 연산
    rented_count = sum(1 for x in db_storage["items"] if x["status"] == "대여중")
    available_count = sum(1 for x in db_storage["items"] if x["status"] == "보관중")
    
    # 프로젝트별 카운트 계산
    project_map = {}
    for item in db_storage["items"]:
        if item["status"] == "대여중" and item["projectName"]:
            proj = item["projectName"]
            project_map[proj] = project_map.get(proj, 0) + 1
            
    rentals_by_project = [{"name": proj, "count": count} for proj, count in project_map.items()]
    if not rentals_by_project:
        rentals_by_project = [{"name": "A 현장", "count": 2}, {"name": "B 현장", "count": 1}]
        
    return {
        "rentals_by_project": rentals_by_project,
        "calibration_status": [
            {"name": "Safe (정상)", "value": available_count + 1, "color": "#4CAF50"},
            {"name": "Warning (점검 요망)", "value": 2, "color": "#FFC107"},
            {"name": "Expired (검교정 누락)", "value": 1, "color": "#F44336"}
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
