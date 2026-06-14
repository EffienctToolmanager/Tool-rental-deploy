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
    {
        "id": "1", "equipmentCode": "FLK-87V-01", "brand": "Fluke", "model": "87V",
        "name": "Fluke 87V Industrial Multimeter", "equipmentType": "Industrial Digital Multimeter",
        "projectName": "Project Site A", "returnDate": "2026-06-30", "status": "Rented",
        "userEmail": "pm@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0001",
        "datasheetUrl": "https://example.com/mock-datasheets/fluke-87v.pdf",
        "specSummary": {"equipmentType": "Industrial Digital Multimeter", "measurementRange": "Mock range: AC/DC voltage, resistance, frequency, temperature", "accuracy": "Mock accuracy: high precision class for field diagnostics", "voltageRating": "Mock rating: low-voltage industrial systems", "currentRating": "Mock current input with fused protection", "safetyCategory": "Mock CAT III / CAT IV safety category", "connectivity": "No wireless connectivity in this mock profile", "powerSource": "Battery powered", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["True-RMS style reading", "Rugged field body", "Backlit display"], "typicalUse": "General electrical troubleshooting and maintenance checks"},
    },
    {
        "id": "2", "equipmentCode": "FLK-1738-01", "brand": "Fluke", "model": "1738",
        "name": "Fluke 1738 Power Logger", "equipmentType": "Power Quality Logger",
        "projectName": "Project Site A", "returnDate": "2026-06-30", "status": "Rented",
        "userEmail": "pm@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0001",
        "datasheetUrl": "https://example.com/mock-datasheets/fluke-1738.pdf",
        "specSummary": {"equipmentType": "Power Quality Logger", "measurementRange": "Mock range: 3-phase voltage/current/power trend logging", "accuracy": "Mock accuracy: site energy audit grade", "voltageRating": "Mock rating: distribution panel measurement", "currentRating": "Mock flexible current probe support", "safetyCategory": "Mock CAT III / CAT IV safety category", "connectivity": "USB / Wi-Fi style mock connectivity", "powerSource": "Rechargeable battery / line power", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["Power trend capture", "Event logging", "Energy study workflow"], "typicalUse": "Temporary power quality survey and load profiling"},
    },
    {
        "id": "3", "equipmentCode": "KEY-U1282A-01", "brand": "Keysight", "model": "U1282A",
        "name": "Keysight U1282A Handheld Digital Multimeter", "equipmentType": "Handheld Digital Multimeter",
        "projectName": "Project Site B", "returnDate": "2026-07-05", "status": "Rented",
        "userEmail": "tech@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0002",
        "datasheetUrl": "https://example.com/mock-datasheets/keysight-u1282a.pdf",
        "specSummary": {"equipmentType": "Handheld Digital Multimeter", "measurementRange": "Mock range: voltage, current, resistance, frequency, temperature", "accuracy": "Mock accuracy: high-count handheld measurement", "voltageRating": "Mock rating: industrial electrical panels", "currentRating": "Mock milliamp/amp measurement ranges", "safetyCategory": "Mock CAT III / CAT IV safety category", "connectivity": "Optional optical/USB style mock link", "powerSource": "Battery powered", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["High resolution display", "Data logging style memory", "Rugged case"], "typicalUse": "Bench and field electrical verification"},
    },
    {
        "id": "4", "equipmentCode": "KEY-U1461A-01", "brand": "Keysight", "model": "U1461A",
        "name": "Keysight U1461A Insulation Resistance Tester", "equipmentType": "Insulation Resistance Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/keysight-u1461a.pdf",
        "specSummary": {"equipmentType": "Insulation Resistance Tester", "measurementRange": "Mock range: selectable insulation test voltage and resistance", "accuracy": "Mock accuracy: maintenance screening grade", "voltageRating": "Mock test voltage profiles for motor/cable checks", "currentRating": "Mock leakage current indication", "safetyCategory": "Mock CAT III safety category", "connectivity": "USB style mock export", "powerSource": "Battery powered", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["PI/DAR style test", "Timed insulation test", "Continuity check"], "typicalUse": "Motor, cable, and panel insulation condition check"},
    },
    {
        "id": "5", "equipmentCode": "HIO-IR4056-01", "brand": "Hioki", "model": "IR4056",
        "name": "Hioki IR4056 Insulation Tester", "equipmentType": "Insulation Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/hioki-ir4056.pdf",
        "specSummary": {"equipmentType": "Insulation Tester", "measurementRange": "Mock range: low to high insulation resistance checks", "accuracy": "Mock accuracy: field maintenance grade", "voltageRating": "Mock selectable test voltage", "currentRating": "Mock continuity current function", "safetyCategory": "Mock CAT III safety category", "connectivity": "No connectivity in mock profile", "powerSource": "Battery powered", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["Fast comparator style judgement", "Bright indication", "Continuity test"], "typicalUse": "Routine electrical insulation screening"},
    },
    {
        "id": "6", "equipmentCode": "HIO-CM4375-01", "brand": "Hioki", "model": "CM4375",
        "name": "Hioki CM4375 AC/DC Clamp Meter", "equipmentType": "AC/DC Clamp Meter",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/hioki-cm4375.pdf",
        "specSummary": {"equipmentType": "AC/DC Clamp Meter", "measurementRange": "Mock range: AC/DC current clamp and voltage checks", "accuracy": "Mock accuracy: industrial current survey grade", "voltageRating": "Mock rating: panel and feeder checks", "currentRating": "Mock high-current clamp measurement", "safetyCategory": "Mock CAT III / CAT IV safety category", "connectivity": "Bluetooth-style mock connectivity", "powerSource": "Battery powered", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["Clamp current measurement", "Inrush style capture", "Rugged jaw design"], "typicalUse": "Current measurement without circuit interruption"},
    },
    {
        "id": "7", "equipmentCode": "MEG-MIT525-01", "brand": "Megger", "model": "MIT525",
        "name": "Megger MIT525 Insulation Resistance Tester", "equipmentType": "High Voltage Insulation Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/megger-mit525.pdf",
        "specSummary": {"equipmentType": "High Voltage Insulation Tester", "measurementRange": "Mock range: high-voltage insulation resistance testing", "accuracy": "Mock accuracy: asset commissioning grade", "voltageRating": "Mock 5 kV class profile", "currentRating": "Mock leakage current display", "safetyCategory": "Mock high energy safety profile", "connectivity": "USB style mock result transfer", "powerSource": "Rechargeable battery / mains", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["PI/DAR/DD style tests", "Guard terminal", "Large asset diagnostics"], "typicalUse": "Generator, transformer, cable insulation verification"},
    },
    {
        "id": "8", "equipmentCode": "MEG-DLRO10HD-01", "brand": "Megger", "model": "DLRO10HD",
        "name": "Megger DLRO10HD Low Resistance Ohmmeter", "equipmentType": "Low Resistance Ohmmeter",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/megger-dlro10hd.pdf",
        "specSummary": {"equipmentType": "Low Resistance Ohmmeter", "measurementRange": "Mock range: micro-ohm to low-ohm resistance checks", "accuracy": "Mock accuracy: bonding/contact resistance grade", "voltageRating": "Mock low-voltage resistance test output", "currentRating": "Mock 10 A class test current", "safetyCategory": "Mock industrial safety profile", "connectivity": "No connectivity in mock profile", "powerSource": "Rechargeable battery / mains", "calibrationCycle": "12 months mock cycle", "keyFeatures": ["High current continuity test", "Bidirectional measurement", "Rugged field case"], "typicalUse": "Grounding, bonding, breaker contact, and busbar resistance checks"},
    },
]

ADDITIONAL_MOCK_MODELS = [
    ("FLK", "Fluke", "179", "True-RMS Digital Multimeter", "Industrial Digital Multimeter"),
    ("FLK", "Fluke", "289", "Logging Multimeter", "Advanced Logging Multimeter"),
    ("FLK", "Fluke", "376 FC", "AC/DC Clamp Meter", "AC/DC Clamp Meter"),
    ("FLK", "Fluke", "1507", "Insulation Resistance Tester", "Insulation Tester"),
    ("FLK", "Fluke", "1587 FC", "Insulation Multimeter", "Insulation Multimeter"),
    ("FLK", "Fluke", "435-II", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("FLK", "Fluke", "1625-2", "Earth Ground Tester", "Earth Ground Tester"),
    ("FLK", "Fluke", "TiS75+", "Thermal Camera", "Thermal Imaging Camera"),
    ("FLK", "Fluke", "BT521", "Battery Analyzer", "Battery Analyzer"),
    ("FLK", "Fluke", "754", "Documenting Process Calibrator", "Process Calibrator"),
    ("KEY", "Keysight", "U1273A", "Handheld Digital Multimeter", "Handheld Digital Multimeter"),
    ("KEY", "Keysight", "U1242C", "Handheld Digital Multimeter", "Handheld Digital Multimeter"),
    ("KEY", "Keysight", "U1213A", "Clamp Meter", "Clamp Meter"),
    ("KEY", "Keysight", "U1453A", "Insulation Resistance Tester", "Insulation Tester"),
    ("KEY", "Keysight", "34465A", "Bench Digital Multimeter", "Bench Digital Multimeter"),
    ("KEY", "Keysight", "E4980AL", "Precision LCR Meter", "LCR Meter"),
    ("KEY", "Keysight", "N6705C", "DC Power Analyzer", "DC Power Analyzer"),
    ("KEY", "Keysight", "U5855A", "TrueIR Thermal Imager", "Thermal Imaging Camera"),
    ("KEY", "Keysight", "U8903B", "Audio Analyzer", "Signal Analyzer"),
    ("KEY", "Keysight", "DAQ970A", "Data Acquisition System", "Data Acquisition Unit"),
    ("HIO", "Hioki", "DT4282", "Digital Multimeter", "Industrial Digital Multimeter"),
    ("HIO", "Hioki", "DT4256", "Digital Multimeter", "Field Digital Multimeter"),
    ("HIO", "Hioki", "CM3289", "AC Clamp Meter", "AC Clamp Meter"),
    ("HIO", "Hioki", "CM7290", "Display Unit", "Clamp Sensor Display Unit"),
    ("HIO", "Hioki", "IR4057", "Insulation Tester", "Insulation Tester"),
    ("HIO", "Hioki", "BT3554", "Battery Tester", "Battery Tester"),
    ("HIO", "Hioki", "PQ3198", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("HIO", "Hioki", "PW3360", "Clamp Power Logger", "Power Logger"),
    ("HIO", "Hioki", "LR8450", "Memory HiLogger", "Data Logger"),
    ("HIO", "Hioki", "IM3536", "LCR Meter", "LCR Meter"),
    ("MEG", "Megger", "MIT1025", "Insulation Resistance Tester", "High Voltage Insulation Tester"),
    ("MEG", "Megger", "MIT1525", "Insulation Resistance Tester", "High Voltage Insulation Tester"),
    ("MEG", "Megger", "MFT1845+", "Multifunction Tester", "Multifunction Installation Tester"),
    ("MEG", "Megger", "DET4TC2", "Earth Tester", "Earth Ground Tester"),
    ("MEG", "Megger", "TDR2050", "Cable Fault Locator", "Cable Fault Locator"),
    ("MEG", "Megger", "BITE5", "Battery Tester", "Battery Impedance Tester"),
    ("MEG", "Megger", "MPQ1000", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("MEG", "Megger", "MOM2", "Micro-ohmmeter", "Low Resistance Ohmmeter"),
    ("MEG", "Megger", "S1-568", "Insulation Resistance Tester", "Insulation Tester"),
    ("MEG", "Megger", "PAT450", "Portable Appliance Tester", "Appliance Safety Tester"),
    ("YOK", "Yokogawa", "WT3000E", "Precision Power Analyzer", "Power Analyzer"),
    ("YOK", "Yokogawa", "WT5000", "Precision Power Analyzer", "Power Analyzer"),
    ("YOK", "Yokogawa", "CW500", "Power Quality Analyzer", "Power Quality Analyzer"),
    ("YOK", "Yokogawa", "CA500", "Multifunction Process Calibrator", "Process Calibrator"),
    ("YOK", "Yokogawa", "MY600", "Digital Insulation Tester", "Insulation Tester"),
    ("YOK", "Yokogawa", "TY720", "Digital Multimeter", "Digital Multimeter"),
    ("GOS", "GW Instek", "GDM-9061", "Bench Digital Multimeter", "Bench Digital Multimeter"),
    ("GOS", "GW Instek", "GPT-15012", "Electrical Safety Analyzer", "Electrical Safety Tester"),
    ("BK", "B&K Precision", "5493C", "Bench Digital Multimeter", "Bench Digital Multimeter"),
    ("AM", "Amprobe", "AMP-330", "Clamp Meter", "Clamp Meter"),
]


def build_mock_spec(brand: str, model: str, product_name: str, equipment_type: str):
    return {
        "equipmentType": equipment_type,
        "measurementRange": f"Mock range for {brand} {model}: representative field measurement ranges only.",
        "accuracy": "Mock accuracy: placeholder text for visual template testing only.",
        "voltageRating": "Mock voltage rating: suitable-looking internal demo text.",
        "currentRating": "Mock current rating: illustrative current/input capability text.",
        "safetyCategory": "Mock safety category: CAT-style placeholder, not verified.",
        "connectivity": "Mock connectivity: USB/Bluetooth/none depending on product class.",
        "powerSource": "Mock power source: battery or mains powered depending on tool type.",
        "calibrationCycle": "12 months mock cycle",
        "keyFeatures": [
            f"{equipment_type} workflow",
            "Standardized datasheet card layout",
            "Placeholder specification text",
        ],
        "typicalUse": f"Mock use case for {product_name}; for UI validation only, not technical reference.",
    }


for idx, (prefix, brand, model, product_name, equipment_type) in enumerate(ADDITIONAL_MOCK_MODELS, start=len(INITIAL_ITEMS) + 1):
    code_model = model.upper().replace(" ", "").replace("+", "P").replace("-", "")
    INITIAL_ITEMS.append({
        "id": str(idx),
        "equipmentCode": f"{prefix}-{code_model}-01",
        "brand": brand,
        "model": model,
        "name": f"{brand} {model} {product_name}",
        "equipmentType": equipment_type,
        "projectName": "",
        "returnDate": "",
        "status": "Available",
        "userEmail": "",
        "pmEmail": "",
        "caseId": "",
        "datasheetUrl": f"https://example.com/mock-datasheets/{brand.lower().replace(' ', '-')}-{model.lower().replace(' ', '-').replace('+', 'p')}.pdf",
        "specSummary": build_mock_spec(brand, model, product_name, equipment_type),
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
            item_copy = item.copy()
            item_copy.update({
                "projectName": rental.projectName,
                "returnDate": rental.returnDate,
                "status": "Rented",
                "userEmail": rental.userEmail,
                "pmEmail": rental.pmEmail,
                "caseId": rental.caseId
            })
            updated_items.append(item_copy)
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
            # Restore status to Available, clearing out rental metadata while keeping catalog/spec fields
            item_copy = item.copy()
            item_copy.update({
                "projectName": "",
                "returnDate": "",
                "status": "Available",
                "userEmail": "",
                "pmEmail": "",
                "caseId": ""
            })
            updated_items.append(item_copy)
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
