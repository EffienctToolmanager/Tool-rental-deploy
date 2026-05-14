import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import './index.css'
import App from './App.tsx'

const msalInstance = new PublicClientApplication(msalConfig);

const renderApp = async () => {
  try {
    // MSAL v3 requires initialize() before any other action
    await msalInstance.initialize();
    
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error("Critical: MSAL Initialization Failed", error);
    // Simple Error Boundary Fallback
    createRoot(document.getElementById('root')!).render(
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>System Error</h2>
        <p>Failed to initialize authentication. Please contact IT support.</p>
      </div>
    );
  }
};

renderApp();
