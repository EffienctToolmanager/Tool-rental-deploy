import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export const getGraphToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      console.warn("Silent token acquisition failed, moving to popup", error);
      const response = await msalInstance.acquireTokenPopup(loginRequest);
      return response.accessToken;
    }
  }
  return null;
};

export const fetchSharePointList = async (siteUrl: string, listName: string) => {
  const token = await getGraphToken();
  if (!token) throw new Error("No access token available");

  // Extract site ID from URL (This is a simplified version, usually requires a separate Graph call)
  // format: graph.microsoft.com/v1.0/sites/{site-id}/lists/{list-id}/items?expand=fields
  
  const siteDomain = new URL(siteUrl).hostname;
  const sitePath = new URL(siteUrl).pathname;
  
  const siteIdResponse = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${siteDomain}:${sitePath}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const siteData = await siteIdResponse.json();
  const siteId = siteData.id;

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listName}/items?expand=fields`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Prefer: "HonorNonIndexedQueriesWarningMayFail",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch list items");
  const data = await response.json();
  return data.value.map((item: any) => item.fields);
};

export const updateSharePointItem = async (siteId: string, listId: string, itemId: string, fields: any) => {
  const token = await getGraphToken();
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}/fields`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    }
  );
  return response.ok;
};
