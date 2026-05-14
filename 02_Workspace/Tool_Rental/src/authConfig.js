// MSAL (Microsoft Authentication Library) Configuration
export const msalConfig = {
    auth: {
        clientId: "9798f928-e293-41dc-9db9-a492b67207b4", // GE International, Inc. App ID
        authority: "https://login.microsoftonline.com/15ccb6d1-d335-4996-b6f9-7b6925f08121", // GE Tenant ID
        redirectUri: "http://localhost:5173", // Vite 기본 포트
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    // 공구 대여 데이터가 있는 SharePoint List Endpoint (추후 세팅)
    toolRentalListEndpoint: "https://graph.microsoft.com/v1.0/sites/{site-id}/lists/{list-id}/items"
};
