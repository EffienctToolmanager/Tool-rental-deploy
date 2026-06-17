import copy
import importlib
import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

api = importlib.import_module("api.index")
client = TestClient(api.app)


def reset_db():
    api.db_storage["items"] = copy.deepcopy(api.INITIAL_ITEMS)
    api.db_storage["schedules"] = copy.deepcopy(api.INITIAL_SCHEDULED_CASES)


def get_item(tool_code):
    return next(item for item in api.db_storage["items"] if item["toolCode"] == tool_code)


def visible_schedules(tool_code=None):
    data = client.get("/api/sharepoint/schedule/list").json()["data"]
    if tool_code:
        data = [s for s in data if s["toolCode"] == tool_code]
    return data


def test_checkout_approval_moves_asset_to_dashboard_without_active_kanban_duplicate():
    reset_db()
    tool_code = "CCP04"
    case_id = "TR-TDD-CHECKOUT"

    response = client.post("/api/sharepoint/rental", json={
        "caseId": case_id,
        "items": [{"toolCode": tool_code, "photoUrl": "checkout.jpg", "photoWebUrl": "https://example.test/checkout.jpg"}],
        "projectName": "OTP Project",
        "projectCode": "OTP",
        "returnDate": "2026-07-30",
        "pmEmail": "pm@example.test",
        "userEmail": "renter@example.test",
    })
    assert response.status_code == 200

    pending = [s for s in visible_schedules(tool_code) if s.get("caseId") == case_id]
    assert len(pending) == 1
    assert pending[0]["movementType"] == "checkout"
    assert pending[0]["displayCaseId"] == f"{case_id} (rental request)"

    approve = client.post(f"/api/sharepoint/schedule/approve/{pending[0]['id']}")
    assert approve.status_code == 200

    asset = get_item(tool_code)
    assert asset["status"] == "Rented"
    assert asset["projectName"] == "OTP Project"
    assert asset["projectCode"] == "OTP"
    assert asset["caseId"] == case_id

    # The approved checkout is represented by Dashboard/items only, not by an Active Kanban card.
    remaining = visible_schedules(tool_code)
    assert all(s.get("caseId") != case_id for s in remaining)
    assert all(s.get("stage") != "active_rental" for s in remaining)


def test_return_request_from_dashboard_clears_without_restoring_active_or_stale_next():
    reset_db()
    tool_code = "CCP04"
    case_id = "TR-TDD-RETURN"

    client.post("/api/sharepoint/rental", json={
        "caseId": case_id,
        "items": [{"toolCode": tool_code, "photoUrl": "checkout.jpg", "photoWebUrl": "https://example.test/checkout.jpg"}],
        "projectName": "OTP Project",
        "projectCode": "OTP",
        "returnDate": "2026-07-30",
        "pmEmail": "pm@example.test",
        "userEmail": "renter@example.test",
    })
    checkout = [s for s in visible_schedules(tool_code) if s.get("caseId") == case_id][0]
    client.post(f"/api/sharepoint/schedule/approve/{checkout['id']}")

    response = client.post("/api/sharepoint/return", json={
        "caseId": case_id,
        "items": [{"toolCode": tool_code}],
    })
    assert response.status_code == 200
    assert response.json()["count"] == 1

    pending_return = [s for s in visible_schedules(tool_code) if s.get("caseId") == case_id]
    assert len(pending_return) == 1
    assert pending_return[0]["movementType"] == "return"
    assert pending_return[0]["displayCaseId"] == f"{case_id} (return request)"
    assert pending_return[0]["stage"] == "ongoing"

    approve = client.post(f"/api/sharepoint/schedule/approve/{pending_return[0]['id']}")
    assert approve.status_code == 200

    asset = get_item(tool_code)
    assert asset["status"] == "Available"
    assert asset["projectName"] == "Warehouse"
    assert asset["caseId"] == ""

    # Return approval should leave no completed/active/return duplicate for Inventory next to read.
    remaining = visible_schedules(tool_code)
    assert remaining == []
