import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Acquires an access token for Microsoft Graph API.
 * Tries silent acquisition first, then falls back to popup if required.
 */
export async function getGraphToken(): Promise<string | null> {
  try {
    // We must ensure initialize() is called, but main.tsx usually handles this.
    // However, for standalone utility usage, we check if it's initialized.
    // In MSAL v3, initialize() is required.
    
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    try {
      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await msalInstance.acquireTokenPopup(request);
        return response.accessToken;
      }
      console.error("Token acquisition failed:", error);
      return null;
    }
  } catch (e) {
    console.error("Error in getGraphToken:", e);
    return null;
  }
}
