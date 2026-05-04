import { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import "./App.css";

function App() {
  const { instance } = useMsal();
  const [teamsContext, setTeamsContext] = useState<microsoftTeams.app.Context | null>(null);

  useEffect(() => {
    // Teams SDK 초기화
    microsoftTeams.app.initialize().then(() => {
      microsoftTeams.app.getContext().then((context) => {
        setTeamsContext(context);
        console.log("Teams Context loaded:", context);
        
        // 팀즈 테마에 따른 CSS 변수 적용
        if (context.app.theme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.setAttribute("data-theme", "light");
        }
      });
    });
  }, []);

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return (
    <div className="app-container">
      <AuthenticatedTemplate>
        <header className="app-header">
          <h1>🛠️ 사내 공구 대여 시스템</h1>
          {teamsContext && (
            <p className="user-info">안녕하세요, {teamsContext.user?.displayName}님!</p>
          )}
        </header>
        
        <main className="app-content">
          {/* Dashboard 컴포넌트가 들어갈 자리 */}
          <div className="placeholder-card">
            <h3>대여 대시보드 로딩 중...</h3>
            <p>SharePoint 데이터를 불러오고 있습니다.</p>
          </div>
        </main>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <div className="login-container">
          <h2>로그인이 필요합니다</h2>
          <p>사내 Microsoft 365 계정으로 로그인해 주세요.</p>
          <button className="cta-btn" onClick={handleLogin}>
            MS 계정으로 로그인
          </button>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
