import { useEffect } from "react";
import "./App.css";

// --- 가짜 데이터 (Mock Data) ---
const MOCK_EQUIPMENT = [
  { id: 1, name: "MacBook Pro 16\"", category: "Laptop", status: "Available", lastRenter: "-" },
  { id: 2, name: "Galaxy S24 Ultra", category: "Mobile", status: "In Use", lastRenter: "김철수" },
  { id: 3, name: "Oculus Quest 3", category: "VR", status: "Available", lastRenter: "-" },
  { id: 4, name: "Dell 27 Monitor", category: "Monitor", status: "Maintenance", lastRenter: "박영희" },
  { id: 5, name: "Sony A7 IV", category: "Camera", status: "Available", lastRenter: "-" },
  { id: 6, name: "iPad Pro 12.9", category: "Tablet", status: "In Use", lastRenter: "이민수" },
];

function Dashboard({ userName }: { userName: string }) {
  return (
    <div className="dashboard-view">
      <header className="app-header">
        <div className="header-content">
          <h1>🛠️ Tool Rental Hub</h1>
          <div className="user-badge">안녕하세요, <strong>{userName}</strong>님</div>
        </div>
      </header>
      
      <main className="app-content">
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">12</span>
            <span className="stat-label">전체 장비</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">8</span>
            <span className="stat-label">대여 가능</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-value">4</span>
            <span className="stat-label">대여 중</span>
          </div>
        </section>

        <section className="inventory-section">
          <h2>장비 인벤토리</h2>
          <div className="equipment-grid">
            {MOCK_EQUIPMENT.map(item => (
              <div key={item.id} className={`equipment-card ${item.status.replace(' ', '-').toLowerCase()}`}>
                <div className="card-header">
                  <span className="category-tag">{item.category}</span>
                  <span className="status-dot"></span>
                </div>
                <h3>{item.name}</h3>
                <p className="renter-info">마지막 대여자: {item.lastRenter}</p>
                <div className="card-footer">
                  <p>상태: <strong>{item.status}</strong></p>
                  <button className="action-btn">
                    {item.status === 'Available' ? '대여 신청' : '상세 보기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    // 테마 설정 (시스템 설정 반영)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  return <Dashboard userName="관리자" />;
}

export default App;
