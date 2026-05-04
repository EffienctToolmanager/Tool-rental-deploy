import { useEffect, useState } from "react";
import "./App.css";

// PowerShell 스크립트에 의해 생성될 데이터 파일 경로
const DATA_URL = "./data.json";

interface Equipment {
  id: string;
  name: string;
  category: string;
  status: string;
  lastRenter: string;
}

function Dashboard({ userName }: { userName: string }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    // 실시간 데이터 로드 (로컬 JSON 파일 읽기)
    fetch(DATA_URL)
      .then(res => res.json())
      .then(data => setEquipment(data))
      .catch(() => {
        // 데이터 파일이 없을 경우 예시 데이터 표시
        setEquipment([
          { id: "RNT-001", name: "전동 드릴 (Makita)", category: "Tools", status: "Available", lastRenter: "-" },
          { id: "RNT-002", name: "MacBook Pro", category: "Laptop", status: "In Use", lastRenter: "김철수" }
        ]);
      });
  }, []);

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
            <span className="stat-value">{equipment.length}</span>
            <span className="stat-label">전체 장비</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{equipment.filter(e => e.status === 'Available').length}</span>
            <span className="stat-label">대여 가능</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-value">{equipment.filter(e => e.status === 'In Use').length}</span>
            <span className="stat-label">대여 중</span>
          </div>
        </section>

        <section className="inventory-section">
          <h2>장비 인벤토리</h2>
          <div className="equipment-grid">
            {equipment.map(item => (
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
