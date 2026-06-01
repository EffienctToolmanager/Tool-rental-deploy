import os
import shutil
import json
import zipfile
import sys

# Configure UTF-8 encoding
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SOURCE_ICONS_DIR = os.path.join(BASE_DIR, "30_Projects_Apps", "Tool_Rental_App", "teams-app", "App_Package")
TARGET_APP_DIR = os.path.join(BASE_DIR, "30_Projects_Apps", "Meeting_Room_Reservation")
PACKAGE_DIR = os.path.join(TARGET_APP_DIR, "App_Package")

manifest_data = {
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.15/MicrosoftTeams.schema.json",
  "manifestVersion": "1.15",
  "version": "1.0.0",
  "id": "b7549be1-0d2a-43c9-8d7e-97cddabcb222",
  "packageName": "com.gev.roomreservation",
  "developer": {
    "name": "GEV Innovation Team",
    "websiteUrl": "https://localhost:8000",
    "privacyUrl": "https://localhost:8000/privacy",
    "termsOfUseUrl": "https://localhost:8000/terms"
  },
  "icons": {
    "color": "color.png",
    "outline": "outline.png"
  },
  "name": {
    "short": "GEV Room Booking",
    "full": "GEV Meeting Room Reservation System"
  },
  "description": {
    "short": "Real-time meeting room timeline tracker and reservation booking engine.",
    "full": "A premium enterprise-grade system for booking meeting rooms A & B featuring real-time collision detection, admin lockers, and M365 serialization sync."
  },
  "accentColor": "#054141",
  "staticTabs": [
    {
      "entityId": "reservation_dashboard",
      "name": "Room Reservation",
      "contentUrl": "https://effiencttoolmanager.github.io/Tool-rental-deploy/30_Projects_Apps/Meeting_Room_Reservation/index.html",
      "websiteUrl": "https://effiencttoolmanager.github.io/Tool-rental-deploy/30_Projects_Apps/Meeting_Room_Reservation/index.html",
      "scopes": ["personal"]
    }
  ],
  "permissions": ["identity"],
  "validDomains": [
    "localhost",
    "effiencttoolmanager.github.io",
    "spoteamsite.ge.com",
    "login.microsoftonline.com",
    "*.sharepoint.com",
    "*.ge.com"
  ]
}

from urllib.parse import urlparse

def make_package(custom_url=None):
    print("🔄 Building GEV Meeting Room Reservation Teams App Package...", flush=True)
    
    if custom_url:
        print(f"🔗 Using custom hosting URL: {custom_url}", flush=True)
        manifest_data["staticTabs"][0]["contentUrl"] = custom_url
        manifest_data["staticTabs"][0]["websiteUrl"] = custom_url
        
        # Parse domain to add to validDomains
        parsed = urlparse(custom_url)
        domain = parsed.netloc
        if domain and domain not in manifest_data["validDomains"]:
            manifest_data["validDomains"].append(domain)
            print(f"🛡️ Added '{domain}' to validDomains", flush=True)
            
    # Ensure Package Directory exists
    os.makedirs(PACKAGE_DIR, exist_ok=True)
    
    # Write manifest.json
    manifest_path = os.path.join(PACKAGE_DIR, "manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)
    print(f"🟢 Written manifest.json to {manifest_path}", flush=True)
    
    # Copy icons from existing Tool Rental package if present
    color_src = os.path.join(SOURCE_ICONS_DIR, "color.png")
    outline_src = os.path.join(SOURCE_ICONS_DIR, "outline.png")
    
    color_dst = os.path.join(PACKAGE_DIR, "color.png")
    outline_dst = os.path.join(PACKAGE_DIR, "outline.png")
    
    if os.path.exists(color_src) and os.path.exists(outline_src):
        shutil.copy(color_src, color_dst)
        shutil.copy(outline_src, outline_dst)
        print("🟢 Copied standard GEV brand icons into the app package.", flush=True)
    else:
        # Fallback dummy files if not found
        with open(color_dst, 'wb') as f: f.write(b'')
        with open(outline_dst, 'wb') as f: f.write(b'')
        print("⚠️ Warning: Source icons not found. Created empty placeholders.", flush=True)
        
    # Zip the files
    zip_path = os.path.join(TARGET_APP_DIR, "GEV_Room_App.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(manifest_path, "manifest.json")
        zipf.write(color_dst, "color.png")
        zipf.write(outline_dst, "outline.png")
        
    print(f"🎉 SUCCESS! Created GEV Teams App Manifest Package at: {zip_path}", flush=True)
    print(f"👉 You can upload this ZIP file directly into MS Teams ('Upload a custom app' flow)!", flush=True)

if __name__ == "__main__":
    # If custom URL is provided as argument, use it
    target_url = sys.argv[1] if len(sys.argv) > 1 else None
    make_package(target_url)
