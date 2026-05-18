import httpx
import logging

logger = logging.getLogger(__name__)

async def upload_to_sharepoint(file_bytes: bytes, filename: str):
    """
    Uploads a file to SharePoint via the Token Isolation Proxy.
    The proxy server automatically handles the MSAL Token injection.
    """
    # Local Token Isolation Proxy endpoint
    proxy_url = f"http://localhost:5000/api/sharepoint/upload?filename={filename}"
    
    # Send file to proxy as multipart/form-data
    files = {'file': (filename, file_bytes, 'application/octet-stream')}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(proxy_url, files=files)
            
            if response.status_code in [200, 201]:
                data = response.json()
                logger.info(f"Successfully uploaded {filename} via Proxy.")
                return data.get("webUrl")
            else:
                logger.error(f"Proxy Upload failed: {response.status_code} - {response.text}")
                return None
    except Exception as e:
        logger.error(f"Error during Proxy upload: {str(e)}")
        return None
