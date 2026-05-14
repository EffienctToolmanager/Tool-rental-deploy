import httpx
import logging

logger = logging.getLogger(__name__)

async def upload_to_sharepoint(file_bytes: bytes, filename: str, token: str):
    """
    Directly uploads a file to Microsoft Graph API (SharePoint/OneDrive).
    Target: Operation_public/Tool_Rental/Images/{filename}
    """
    # Microsoft Graph API endpoint for file upload
    url = f"https://graph.microsoft.com/v1.0/me/drive/root:/Operation_public/Tool_Rental/Images/{filename}:/content"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/octet-stream"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(url, content=file_bytes, headers=headers)
            
            if response.status_code in [200, 201]:
                data = response.json()
                logger.info(f"Successfully uploaded {filename} to Graph API.")
                return data.get("webUrl")
            else:
                logger.error(f"Graph API Upload failed: {response.status_code} - {response.text}")
                return None
    except Exception as e:
        logger.error(f"Error during Graph API upload: {str(e)}")
        return None
