import os

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths
IMAGE_DIR = os.path.join(BASE_DIR, "assets")
LINK_DIR = os.path.join(BASE_DIR, "links")
DB_PATH = os.path.join(BASE_DIR, "asset_flow.db")

# Ensure directories exist
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(LINK_DIR, exist_ok=True)

# Microsoft Teams Webhook URL
TEAMS_WEBHOOK_URL = "https://outlook.office.com/webhook/placeholder"
