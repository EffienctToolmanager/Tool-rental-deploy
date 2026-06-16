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
        "datasheetUrl": "https://www.fluke.com/en-us/product/electrical-testing/digital-multimeters/fluke-87v",
        "serialNumber": "SN-FLK87V-93812", "zone": "CCP01", "rack": "A1",
        "specSummary": {
            "equipmentType": "Industrial Digital Multimeter",
            "measurementRange": "DC/AC Voltage: 1000V, Current: 10A (20A for 30s max), Resistance: 50 MΩ, Capacitance: 9,999 µF, Frequency: 200 kHz",
            "accuracy": "DC Voltage: ±0.05% + 1 digit, AC Voltage: ±0.7% + 2 digits (True-RMS)",
            "voltageRating": "1000 V AC/DC",
            "currentRating": "10 A continuous (20 A overload protection for 30s max)",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "None (Optical-to-USB optional adapter)",
            "powerSource": "9V Alkaline battery (approx. 400 hours continuous without backlight)",
            "calibrationCycle": "12 Months",
            "keyFeatures": [
                "Unique low-pass filter for accurate voltage and frequency measurements on adjustable speed motor drives (VFDs)",
                "Peak capture for intermittent signals and glitches as short as 250 µs",
                "Large, high-contrast two-level backlit display with analog bar graph"
            ],
            "typicalUse": "General industrial troubleshooting, motor drive and power distribution cabinet maintenance"
        },
    },
    {
        "id": "2", "equipmentCode": "FLK-1738-01", "brand": "Fluke", "model": "1738",
        "name": "Fluke 1738 Power Logger", "equipmentType": "Power Quality Logger",
        "projectName": "Project Site A", "returnDate": "2026-06-30", "status": "Rented",
        "userEmail": "pm@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0001",
        "datasheetUrl": "https://example.com/mock-datasheets/fluke-1738.pdf",
        "serialNumber": "SN-FLK1738-48291", "zone": "CCP02", "rack": "A1",
        "specSummary": {
            "equipmentType": "Power Quality Logger",
            "measurementRange": "Voltage: 1000 V, Current Range: 4 A to 6000 A (sensor dependent), Power/Energy Trend",
            "accuracy": "Voltage: ±0.1% of nominal, Current: ±0.2% of range, Power: ±0.2% of range",
            "voltageRating": "1000 V CAT III / 600 V CAT IV",
            "currentRating": "Supports flexible current probes up to 6000 A",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "USB, Wi-Fi, Ethernet, Bluetooth",
            "powerSource": "100 V to 500 V line power or rechargeable Li-ion battery backup",
            "calibrationCycle": "12 Months",
            "keyFeatures": [
                "Automatically measure and log voltage, current, power, harmonics, and associated values",
                "Power instrument directly from the measured circuit",
                "Convenient in-field setup through touch screen and wireless download link"
            ],
            "typicalUse": "Load studies, energy assessments, and power quality analysis in distribution boards"
        },
    },
    {
        "id": "3", "equipmentCode": "KEY-U1282A-01", "brand": "Keysight", "model": "U1282A",
        "name": "Keysight U1282A Handheld Digital Multimeter", "equipmentType": "Handheld Digital Multimeter",
        "projectName": "Project Site B", "returnDate": "2026-07-05", "status": "Rented",
        "userEmail": "tech@ge.com", "pmEmail": "pm@ge.com", "caseId": "TR-20260613-0002",
        "datasheetUrl": "https://example.com/mock-datasheets/keysight-u1282a.pdf",
        "serialNumber": "SN-KEYU1282A-39128", "zone": "PSU01", "rack": "B2",
        "specSummary": {
            "equipmentType": "Handheld Digital Multimeter",
            "measurementRange": "DC/AC Voltage: 1000V, Current: 10A, Resistance: 600 MΩ, Capacitance: 10 mF, Frequency: 20 MHz",
            "accuracy": "DC Voltage: ±0.025% + 5 digits, AC Voltage: ±0.3% + 25 digits (True-RMS)",
            "voltageRating": "1000 V AC/DC",
            "currentRating": "10 A continuous",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "IR-to-USB / Bluetooth optional adapter",
            "powerSource": "4 x AAA batteries (approx. 800 hours battery life)",
            "calibrationCycle": "12 Months",
            "keyFeatures": [
                "60,000 counts dual display with analog bar graph",
                "Built-in frequency counter and square wave generator",
                "IP67 certified water and dust protection with rugged shell design"
            ],
            "typicalUse": "Precision bench and field electrical measurements and device tuning"
        },
    },
    {
        "id": "4", "equipmentCode": "KEY-U1461A-01", "brand": "Keysight", "model": "U1461A",
        "name": "Keysight U1461A Insulation Resistance Tester", "equipmentType": "Insulation Resistance Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/keysight-u1461a.pdf",
        "serialNumber": "SN-KEYU1461A-28491", "zone": "PSU02", "rack": "B2",
        "specSummary": {
            "equipmentType": "Insulation Resistance Tester",
            "measurementRange": "Test Voltage: 50V to 1000V, Resistance range up to 200 GΩ",
            "accuracy": "Insulation Resistance: ±5% of reading, Test Voltage: +20% / -0%",
            "voltageRating": "1000 V insulation class",
            "currentRating": "Leakage current: 1 nA to 2 mA",
            "safetyCategory": "CAT III 1000V, CAT IV 600V",
            "connectivity": "USB style mock export",
            "powerSource": "Battery powered",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["PI/DAR style test", "Timed insulation test", "Continuity check"],
            "typicalUse": "Motor, cable, and panel insulation condition check"
        },
    },
    {
        "id": "5", "equipmentCode": "HIO-IR4056-01", "brand": "Hioki", "model": "IR4056",
        "name": "Hioki IR4056 Insulation Tester", "equipmentType": "Insulation Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/hioki-ir4056.pdf",
        "serialNumber": "SN-HIOIR4056-59102", "zone": "CCP03", "rack": "B1",
        "specSummary": {
            "equipmentType": "Insulation Tester",
            "measurementRange": "Test Voltage: 50V to 1000V, Resistance range up to 4000 MΩ",
            "accuracy": "Insulation Resistance: ±4% of reading, Test Voltage: ±10%",
            "voltageRating": "1000 V insulation class",
            "currentRating": "Continuity current function",
            "safetyCategory": "CAT III 600V",
            "connectivity": "No connectivity in mock profile",
            "powerSource": "Battery powered",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["Fast comparator style judgement", "Bright indication", "Continuity test"],
            "typicalUse": "Routine electrical insulation screening"
        },
    },
    {
        "id": "6", "equipmentCode": "HIO-CM4375-01", "brand": "Hioki", "model": "CM4375",
        "name": "Hioki CM4375 AC/DC Clamp Meter", "equipmentType": "AC/DC Clamp Meter",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/hioki-cm4375.pdf",
        "serialNumber": "SN-HIOCM4375-72819", "zone": "CCP04", "rack": "C2",
        "specSummary": {
            "equipmentType": "AC/DC Clamp Meter",
            "measurementRange": "AC/DC Current: 1000 A, AC/DC Voltage: 1000 V",
            "accuracy": "Current: ±1.3% rdg + 3 dgt, Voltage: ±0.9% rdg + 3 dgt",
            "voltageRating": "1000 V AC/DC",
            "currentRating": "1000 A clamp jaw rating",
            "safetyCategory": "CAT III 1000 V, CAT IV 600 V",
            "connectivity": "Bluetooth-style mock connectivity",
            "powerSource": "Battery powered",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["Clamp current measurement", "Inrush style capture", "Rugged jaw design"],
            "typicalUse": "Current measurement without circuit interruption"
        },
    },
    {
        "id": "7", "equipmentCode": "MEG-MIT525-01", "brand": "Megger", "model": "MIT525",
        "name": "Megger MIT525 Insulation Resistance Tester", "equipmentType": "High Voltage Insulation Tester",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/megger-mit525.pdf",
        "serialNumber": "SN-MEGMIT525-48291", "zone": "MEG01", "rack": "D1",
        "specSummary": {
            "equipmentType": "High Voltage Insulation Tester",
            "measurementRange": "Test Voltage: up to 5 kV, Resistance range up to 10 TΩ",
            "accuracy": "Insulation Resistance: ±5% of reading, Test Voltage: +20% / -0%",
            "voltageRating": "5000 V high-voltage class",
            "currentRating": "Leakage current display",
            "safetyCategory": "CAT IV 600V",
            "connectivity": "USB style mock result transfer",
            "powerSource": "Rechargeable battery / mains",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["PI/DAR/DD style tests", "Guard terminal", "Large asset diagnostics"],
            "typicalUse": "Generator, transformer, cable insulation verification"
        },
    },
    {
        "id": "8", "equipmentCode": "MEG-DLRO10HD-01", "brand": "Megger", "model": "DLRO10HD",
        "name": "Megger DLRO10HD Low Resistance Ohmmeter", "equipmentType": "Low Resistance Ohmmeter",
        "projectName": "", "returnDate": "", "status": "Available", "userEmail": "", "pmEmail": "", "caseId": "",
        "datasheetUrl": "https://example.com/mock-datasheets/megger-dlro10hd.pdf",
        "serialNumber": "SN-MEGDLRO10HD-28190", "zone": "MEG02", "rack": "D2",
        "specSummary": {
            "equipmentType": "Low Resistance Ohmmeter",
            "measurementRange": "micro-ohm to low-ohm resistance checks",
            "accuracy": "bonding/contact resistance grade",
            "voltageRating": "low-voltage resistance test output",
            "currentRating": "10 A class test current",
            "safetyCategory": "CAT III 300 V",
            "connectivity": "No connectivity in mock profile",
            "powerSource": "Rechargeable battery / mains",
            "calibrationCycle": "12 Months",
            "keyFeatures": ["High current continuity test", "Bidirectional measurement", "Rugged field case"],
            "typicalUse": "Grounding, bonding, breaker contact, and busbar resistance checks"
        },
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
    # Determine typical ranges and accuracies based on type
    if "Multimeter" in equipment_type:
        range_val = "DC/AC Voltage: 1000V, Current: 10A, Resistance: 50 MΩ, Frequency: 100 kHz"
        acc_val = "DC Voltage: ±0.09% + 2 digits, AC Voltage: ±1.0% + 3 digits (True-RMS)"
        volt_rating = "1000 V AC/DC"
        curr_rating = "10 A fused protection"
        safety = "CAT III 1000 V, CAT IV 600 V"
        power = "9V Battery or AAA battery powered"
        features = ["True-RMS measurement class", "Auto/Manual range selectable", "Backlit digital display"]
        typical_use = f"General electrical troubleshooting and circuit analysis for {product_name}."
    elif "Insulation" in equipment_type or "Tester" in equipment_type:
        range_val = "Test Voltage: 50V to 1000V, Resistance range up to 200 GΩ" if "High Voltage" not in equipment_type else "Test Voltage: up to 5 kV, Resistance range up to 10 TΩ"
        acc_val = "Insulation Resistance: ±5% of reading, Test Voltage: +20% / -0%"
        volt_rating = "1000 V insulation class" if "High Voltage" not in equipment_type else "5000 V high-voltage class"
        curr_rating = "Leakage current: 1 nA to 2 mA"
        safety = "CAT IV 600 V"
        power = "Battery powered or rechargeable cells"
        features = ["Polarization Index (PI) and Dielectric Absorption Ratio (DAR) tests", "Auto-discharge safety function", "Guard terminal to minimize surface leakage"]
        typical_use = f"Insulation testing and motor winding diagnostics for {product_name}."
    elif "Clamp" in equipment_type:
        range_val = "AC/DC Current: 600 A or 2000 A, AC/DC Voltage: 1000 V"
        acc_val = "Current: ±1.5% rdg + 5 dgt, Voltage: ±0.9% rdg + 3 dgt"
        volt_rating = "1000 V AC/DC"
        curr_rating = "600 A / 2000 A clamp jaw rating"
        safety = "CAT III 1000 V, CAT IV 600 V"
        power = "AAA battery powered (approx. 45 hours continuous use)"
        features = ["Non-contact voltage detection (NCV)", "True-RMS AC current measurement", "Inrush current capture for motor start-ups"]
        typical_use = f"High-current testing and cable current surveys for {product_name} without breaking circuits."
    elif "Analyzer" in equipment_type or "Logger" in equipment_type:
        range_val = "Voltage: 1000 V, Current Range: up to 6000 A with sensors, 3-phase logging"
        acc_val = "Voltage: ±0.1% of nominal voltage, Harmonic Accuracy: ±1.0% of reading"
        volt_rating = "1000 V CAT III / 600 V CAT IV"
        curr_rating = "Supports active and flexible current probes"
        safety = "CAT III 1000 V, CAT IV 600 V"
        power = "Rechargeable Li-ion battery or auxiliary mains power"
        features = ["Harmonic distortion and power factor analysis", "In-field setup wizard with wiring error detection", "Event waveform capture for voltage sags and swells"]
        typical_use = f"Energy studies, load profiling, and power quality diagnostics for {product_name}."
    else:
        # Fallback to realistic generic specifications
        range_val = f"Custom range tailored for {equipment_type} standard field application."
        acc_val = "Standard industrial accuracy class (±1.5% of reading)"
        volt_rating = "600 V AC/DC electrical rating"
        curr_rating = "Standard sensor input or fused terminal protection"
        safety = "CAT III 600 V safety standard"
        power = "Battery powered (rechargeable or dry cells)"
        features = ["Rugged protective case for field operations", "Data logging capability with built-in memory", "LCD high-visibility backlit display"]
        typical_use = f"Field calibration, verification, and diagnostics for {product_name}."

    return {
        "equipmentType": equipment_type,
        "measurementRange": range_val,
        "accuracy": acc_val,
        "voltageRating": volt_rating,
        "currentRating": curr_rating,
        "safetyCategory": safety,
        "connectivity": "USB, Wi-Fi or Bluetooth (class-specific)" if "FC" in model or "BT" in model or "CM" in model or "PQ" in model else "None or USB data cable connection",
        "powerSource": power,
        "calibrationCycle": "12 Months",
        "keyFeatures": features,
        "typicalUse": typical_use,
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
        "serialNumber": f"SN-{prefix}{code_model}-{idx:04d}",
        "zone": f"CCP{idx % 5 + 1:02d}" if idx % 2 == 0 else f"PSU{idx % 3 + 1:02d}",
        "rack": f"A{idx % 4 + 1}" if idx % 2 == 0 else f"B{idx % 3 + 1}",
        "specSummary": build_mock_spec(brand, model, product_name, equipment_type),
    })


INITIAL_SCHEDULED_CASES = [
    {
        "id": "SCH-202606-0001",
        "equipmentCode": "FLK-87V-01",
        "model": "87V",
        "sequenceOrder": 0,
        "stage": "active_rental",
        "destination": "Project Site A",
        "startDate": "2026-06-10",
        "endDate": "2026-06-30",
        "status": "In_Progress",
        "userEmail": "pm@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Current active checkout on Project Site A",
        "handoverPic": "John Doe",
        "handoverPhoto": "inspection-flk87-siteA.png",
        "checklistVerified": True
    },
    {
        "id": "SCH-202606-0002",
        "equipmentCode": "FLK-87V-01",
        "model": "87V",
        "sequenceOrder": 1,
        "stage": "calibration",
        "destination": "Fluke Cal Lab",
        "startDate": "2026-07-01",
        "endDate": "2026-07-03",
        "status": "Scheduled",
        "userEmail": "cal-specialist@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Annual calibration checkup scheduled immediately after Site A return",
        "handoverPic": "Cal Specialist Lead",
        "handoverPhoto": "cal-cert-pending.png",
        "checklistVerified": True
    },
    {
        "id": "SCH-202606-0003",
        "equipmentCode": "FLK-87V-01",
        "model": "87V",
        "sequenceOrder": 2,
        "stage": "ongoing",
        "destination": "Samsung Austin Site",
        "startDate": "2026-07-04",
        "endDate": "2026-07-25",
        "status": "Scheduled",
        "userEmail": "samsung-lead@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Next project deployment scheduled to ship post-calibration"
    },
    {
        "id": "SCH-202606-0004",
        "equipmentCode": "FLK-1738-01",
        "model": "1738",
        "sequenceOrder": 0,
        "stage": "active_rental",
        "destination": "Project Site A",
        "startDate": "2026-06-10",
        "endDate": "2026-06-30",
        "status": "In_Progress",
        "userEmail": "pm@ge.com",
        "pmEmail": "pm@ge.com",
        "notes": "Running load studies",
        "handoverPic": "Jane Smith",
        "handoverPhoto": "pre-checkout-calibration-1738.png",
        "checklistVerified": True
    }
]

db_storage = {
    "items": INITIAL_ITEMS,
    "schedules": INITIAL_SCHEDULED_CASES
}

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
    projectCode: Optional[str] = None
    returnDate: str
    pmEmail: str
    userEmail: str

@app.post("/api/sharepoint/rental")
async def create_rental_record(rental: BulkRentalRequest):
    logger.info(f"Rental request received for Case {rental.caseId}")
    
    import random
    from datetime import datetime
    date_str = datetime.now().strftime("%y%m%d")
    schedules = db_storage.get("schedules", [])
    
    for idx, item in enumerate(rental.items):
        # find model
        model = "Unknown Model"
        for i in db_storage.get("items", []):
            if i["equipmentCode"] == item.equipmentCode:
                model = i.get("model", "Unknown Model")
                break
                
        # find max sequence
        item_schedules = [s for s in schedules if s["equipmentCode"] == item.equipmentCode]
        max_seq = -1
        for s in item_schedules:
            if s.get("sequenceOrder", 0) > max_seq:
                max_seq = s["sequenceOrder"]
        new_seq = max_seq + 1
        
        # generate id
        rand_num = random.randint(1000, 9999)
        new_id = f"SCH-{date_str}-{rand_num}-{idx}"
        
        new_case = {
            "id": new_id,
            "equipmentCode": item.equipmentCode,
            "model": model,
            "sequenceOrder": new_seq,
            "stage": "active_rental",
            "destination": rental.projectName,
            "startDate": datetime.now().strftime("%Y-%m-%d"),
            "endDate": rental.returnDate,
            "status": "Pending_Approval",
            "userEmail": rental.userEmail,
            "pmEmail": rental.pmEmail,
            "notes": f"Checkout Case ID: {rental.caseId}",
            "projectCode": rental.projectCode,
            "handoverPic": "Renter Checkout",
            "handoverPhoto": item.photoUrl,
            "checklistVerified": True
        }
        schedules.append(new_case)
        
    db_storage["schedules"] = schedules
    
    # Sync states for all items
    for item in rental.items:
        sync_asset_state(item.equipmentCode)
        
    logger.info(f"Database updated. Case {rental.caseId} schedules loaded as Pending_Approval.")
    
    return {
        "status": "success", 
        "message": f"Bulk Rental schedules created dynamically for Case {rental.caseId}", 
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


# --- Successive Scheduling Case API Endpoints [NEW] ---

class ScheduledCase(BaseModel):
    id: str
    equipmentCode: str
    model: str
    sequenceOrder: int
    stage: str
    destination: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    status: str
    userEmail: str
    pmEmail: str
    notes: Optional[str] = None
    projectCode: Optional[str] = None
    handoverPic: Optional[str] = None
    handoverPhoto: Optional[str] = None
    checklistVerified: Optional[bool] = None

from fastapi import Form

@app.post("/api/sharepoint/calibration/clear")
async def clear_calibration_case(
    schedule_id: str = Form(...),
    calibration_date: str = Form(...),
    pdf_file: UploadFile = File(...),
    image_file: UploadFile = File(...)
):
    import shutil
    import re
    logger.info(f"Clearing calibration for schedule: {schedule_id} with date {calibration_date}")
    schedules = db_storage.get("schedules", [])
    
    # Find the target schedule
    target_schedule = None
    for s in schedules:
        if s["id"] == schedule_id:
            target_schedule = s
            break
            
    if not target_schedule:
        raise HTTPException(status_code=404, detail="Scheduled case not found")
        
    equipment_code = target_schedule["equipmentCode"]
    model = target_schedule["model"]
    
    # Find serial number of the asset and update calibration date in database
    serial_number = "UNKNOWN"
    for item in db_storage.get("items", []):
        if item.get("equipmentCode") == equipment_code:
            serial_number = item.get("serialNumber") or item.get("Serial_Number") or "UNKNOWN"
            item["calDate"] = calibration_date
            if "Calibration_Date" in item:
                item["Calibration_Date"] = calibration_date
            break

    # Determine OneDrive save directory
    onedrive_base = "C:\\Users\\cfpcl\\OneDrive"
    target_dir = os.path.join(onedrive_base, "Calibration_Reports")
    
    if not os.path.exists(onedrive_base):
        # Fallback to local workspace folder
        target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "OneDrive_Calibration_Reports"))
        
    os.makedirs(target_dir, exist_ok=True)
    
    # Naming template: (검교정날짜_툴코드_툴모델명_시리얼넘버.pdf)
    def sanitize(val):
        return re.sub(r'[^a-zA-Z0-9_\-]', '_', val)
        
    sanitized_model = sanitize(model)
    sanitized_serial = sanitize(serial_number)
    sanitized_code = sanitize(equipment_code)
    
    pdf_filename = f"{calibration_date}_{sanitized_code}_{sanitized_model}_{sanitized_serial}.pdf"
    
    _, ext = os.path.splitext(image_file.filename or "")
    if not ext:
        ext = ".jpg"
    image_filename = f"{calibration_date}_{sanitized_code}_{sanitized_model}_{sanitized_serial}_photo{ext}"
    
    pdf_path = os.path.join(target_dir, pdf_filename)
    image_path = os.path.join(target_dir, image_filename)
    
    try:
        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(pdf_file.file, buffer)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image_file.file, buffer)
    except Exception as e:
        logger.error(f"Failed to save files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save certificate files: {str(e)}")
        
    # Mark this calibration schedule as Completed
    for s in schedules:
        if s["id"] == schedule_id:
            s["status"] = "Completed"
            s["handoverPic"] = "System Calibration"
            s["handoverPhoto"] = f"{pdf_filename}; {image_filename}"
            s["checklistVerified"] = True
            break
            
    db_storage["schedules"] = schedules
    sync_asset_state(equipment_code)
    
    return {
        "status": "success",
        "message": "Calibration successfully cleared and certificate files saved.",
        "pdf_filename": pdf_filename,
        "image_filename": image_filename,
        "saved_path": target_dir
    }

@app.post("/api/sharepoint/schedule/approve/{schedule_id}")
async def approve_schedule_case(schedule_id: str):
    logger.info(f"Approving scheduled case: {schedule_id}")
    schedules = db_storage.get("schedules", [])
    target = None
    for s in schedules:
        if s["id"] == schedule_id:
            s["status"] = "In_Progress"
            target = s
            break
            
    if not target:
        raise HTTPException(status_code=404, detail="Scheduled case not found")
        
    db_storage["schedules"] = schedules
    sync_asset_state(target["equipmentCode"])
    return {
        "status": "success",
        "message": f"Scheduled case {schedule_id} approved.",
        "data": target
    }

def sync_asset_state(equipment_code: str):
    schedules = [s for s in db_storage.get("schedules", []) if s["equipmentCode"] == equipment_code]
    if not schedules:
        for item in db_storage["items"]:
            if item["equipmentCode"] == equipment_code:
                case_id = item.get("caseId", "")
                if item.get("status") == "Rented" and case_id and not case_id.startswith("SCH-"):
                    return
                item.update({
                    "projectName": "Warehouse",
                    "returnDate": "",
                    "status": "Available",
                    "userEmail": "",
                    "pmEmail": "",
                    "caseId": ""
                })
        return

    # Filter out completed cases to find active scheduling
    active_schedules = [s for s in schedules if s.get("status") != "Completed"]
    if not active_schedules:
        for item in db_storage["items"]:
            if item["equipmentCode"] == equipment_code:
                item.update({
                    "projectName": "Warehouse",
                    "returnDate": "",
                    "status": "Available",
                    "userEmail": "",
                    "pmEmail": "",
                    "caseId": ""
                })
        return

    # Sort active schedules by sequenceOrder to find the first upcoming step
    selected_case = sorted(active_schedules, key=lambda x: x.get("sequenceOrder", 0))[0]
    
    stage = selected_case["stage"]
    if stage == "active_rental":
        # If it's a rental request but not approved/active yet, mark as Reserved
        if selected_case.get("status") == "In_Progress":
            status = "Rented"
        else:
            status = "Reserved"
        project_name = selected_case["destination"]
    elif stage == "calibration":
        status = "Calibration"
        project_name = selected_case.get("destination") or "Calibration Lab"
    else:  # ongoing
        status = "Reserved"
        project_name = selected_case.get("destination") or "Warehouse"

    for item in db_storage["items"]:
        if item["equipmentCode"] == equipment_code:
            item.update({
                "status": status,
                "projectName": project_name,
                "returnDate": selected_case.get("endDate") or "",
                "userEmail": selected_case.get("userEmail") or "",
                "pmEmail": selected_case.get("pmEmail") or "",
                "caseId": selected_case["id"]
            })
            break

@app.get("/api/sharepoint/schedule/list")
async def get_schedule_list():
    logger.info("Fetching scheduling cases list.")
    return {
        "status": "success",
        "data": db_storage.get("schedules", [])
    }

@app.post("/api/sharepoint/schedule/create-bulk")
async def create_schedule_cases_bulk(cases: List[ScheduledCase]):
    logger.info(f"Bulk creating {len(cases)} scheduled cases.")
    schedules = db_storage.get("schedules", [])
    eq_codes_to_sync = set()
    for case in cases:
        schedules.append(case.dict())
        eq_codes_to_sync.add(case.equipmentCode)
    db_storage["schedules"] = schedules
    for code in eq_codes_to_sync:
        sync_asset_state(code)
    return {
        "status": "success",
        "message": f"Successfully created {len(cases)} scheduled cases.",
        "count": len(cases)
    }

@app.post("/api/sharepoint/schedule/create")
async def create_schedule_case(case: ScheduledCase):
    logger.info(f"Creating scheduled case: {case.id}")
    schedules = db_storage.get("schedules", [])
    schedules.append(case.dict())
    db_storage["schedules"] = schedules
    sync_asset_state(case.equipmentCode)
    return {
        "status": "success",
        "message": f"Scheduled case {case.id} created.",
        "data": case
    }

@app.put("/api/sharepoint/schedule/update-bulk")
async def update_schedule_cases_bulk(cases: List[ScheduledCase]):
    logger.info(f"Bulk updating {len(cases)} scheduled cases.")
    schedules = db_storage.get("schedules", [])
    updated_ids = {c.id: c for c in cases}
    
    eq_codes_to_sync = set()
    for idx, s in enumerate(schedules):
        if s["id"] in updated_ids:
            case_data = updated_ids[s["id"]].dict()
            schedules[idx] = case_data
            eq_codes_to_sync.add(case_data["equipmentCode"])
            
    db_storage["schedules"] = schedules
    for code in eq_codes_to_sync:
        sync_asset_state(code)
        
    return {
        "status": "success",
        "message": f"Successfully updated {len(cases)} scheduled cases."
    }

@app.post("/api/sharepoint/schedule/delete-bulk")
async def delete_schedule_cases_bulk(case_ids: List[str]):
    logger.info(f"Bulk deleting {len(case_ids)} scheduled cases.")
    schedules = db_storage.get("schedules", [])
    
    eq_codes_to_sync = set()
    for s in schedules:
        if s["id"] in case_ids:
            eq_codes_to_sync.add(s["equipmentCode"])
            
    filtered = [s for s in schedules if s["id"] not in case_ids]
    db_storage["schedules"] = filtered
    
    for code in eq_codes_to_sync:
        sync_asset_state(code)
        
    return {
        "status": "success",
        "message": f"Successfully deleted {len(case_ids)} scheduled cases."
    }

@app.put("/api/sharepoint/schedule/update")
async def update_schedule_case(case: ScheduledCase):
    logger.info(f"Updating scheduled case: {case.id}")
    schedules = db_storage.get("schedules", [])
    updated = False
    
    for idx, s in enumerate(schedules):
        if s["id"] == case.id:
            schedules[idx] = case.dict()
            updated = True
            break
            
    if not updated:
        raise HTTPException(status_code=404, detail="Scheduled case not found")
        
    db_storage["schedules"] = schedules
    sync_asset_state(case.equipmentCode)
    return {
        "status": "success",
        "message": f"Scheduled case {case.id} updated and assets synced.",
        "data": case
    }


@app.delete("/api/sharepoint/schedule/delete/{case_id}")
async def delete_schedule_case(case_id: str):
    logger.info(f"Deleting scheduled case: {case_id}")
    schedules = db_storage.get("schedules", [])
    
    deleted_case = None
    for s in schedules:
        if s["id"] == case_id:
            deleted_case = s
            break
            
    filtered = [s for s in schedules if s["id"] != case_id]
    if len(filtered) == len(schedules):
        raise HTTPException(status_code=404, detail="Scheduled case not found")
        
    db_storage["schedules"] = filtered
    if deleted_case:
        sync_asset_state(deleted_case["equipmentCode"])
        
    return {
        "status": "success",
        "message": f"Scheduled case {case_id} deleted."
    }
