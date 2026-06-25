import type { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
// Using 'export const' but ensuring types are correctly handled for Vite/ESBuild
export const msalConfig: Configuration = {
  auth: {
    clientId: "9798f928-e293-41dc-9db9-a492b67207b4", 
    authority: "https://login.microsoftonline.com/15ccb6d1-d335-4996-b6f9-7b6925f08121", 
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

// Scopes for API calls
export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "openid", "profile", "Files.ReadWrite.All"],
};
