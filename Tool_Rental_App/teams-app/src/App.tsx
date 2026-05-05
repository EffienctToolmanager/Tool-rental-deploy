import React, { useState, useEffect } from 'react';

// Build Version: 2026-05-05-2026 (Force Refresh)
const App: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [assigningLogs, setAssigningLogs] = useState<any[]>([]);
  const [displayHeaders, setDisplayHeaders] = useState<string[]>([]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Inventory');
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [copyMsg, setCopyMsg] = useState('');
  
  // Auth & Debug States
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('Initializing...');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [clickCount, setClickCount] = useState<number>(0);

  const handleTitleClick = () => {
    setClickCount((prev: number) => prev + 1);
    if (clickCount >= 4) {
      alert(`Debug: ${debugInfo}`);
      setClickCount(0);
    }
  };

  const baseFormUrl = "https://forms.office.com/Pages/ResponsePage.aspx?id=0bbMFTXTlkm2-XtpJfCBIYcZG22FI4NKt0EK7qOu0vRUMllQUVRSOUEwNFI5UElWVlRBWDM5RUxZRy4u"; 

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMsg(`Copied: ${text}`);
    setTimeout(() => setCopyMsg(''), 2000);
  };

  const openForms = (url: string) => {
    const { microsoftTeams } = window as any;
    if (microsoftTeams) {
      console.log("Teams Open Attempt:", url);
      try {
        if (microsoftTeams.app && microsoftTeams.app.openLink) {
          // SDK v2 expects a string URL
          microsoftTeams.app.openLink(url);
        } else if (microsoftTeams.executeDeepLink) {
          microsoftTeams.executeDeepLink(url);
        } else {
          window.open(url, '_blank');
        }
      } catch (e) {
        alert("Link Error: " + e);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const { microsoftTeams } = window as any;
    
    const initializeApp = async () => {
      if (microsoftTeams) {
        try {
          await microsoftTeams.app.initialize();
          const context = await microsoftTeams.app.getContext();
          
          const rawUPN = (context.user?.userPrincipalName || context.upn || context.loginHint || "Unknown");
          const upn = rawUPN.toLowerCase().trim();
          const uid = (context.user?.id || context.user?.aadObjectId || "").trim();
          
          setCurrentUserEmail(upn);
          setDebugInfo(`UPN:${upn} | ID:${uid}`);

          // Exact Match based on user debug info
          const isAdminUser = upn.includes("223132739") || uid === "6d1b1987-2385-4a83-b741-0aeea3aed2f4";
          
          if (isAdminUser) {
            setIsAdmin(true);
          }
          
          await Promise.all([fetchData(), fetchLogs()]);
        } catch (err) {
          console.error("Init failed", err);
        } finally {
          setTimeout(() => setIsLoading(false), 500);
        }
      } else {
        setIsLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (data.length > 0) {
          const firstRow = data[0];
          const keys = Object.keys(firstRow).filter(k => k !== 'Status' && k !== 'Location');
          setDisplayHeaders(keys.map(k => firstRow[k]));
          setDataKeys(keys);
          setTools(data.slice(1));
        }
      } catch (e) { 
        console.error("Data fetch error, using dummy");
        // Fallback dummy for testing
        setDisplayHeaders(["Code", "Tool Name", "Category"]);
        setDataKeys(["Code", "Name", "Category"]);
        setTools([
          { Code: "T001", Name: "Hydraulic Jack", Category: "Lifting", Status: "Available" },
          { Code: "T002", Name: "Impact Wrench", Category: "Power Tools", Status: "In Use" },
          { Code: "T003", Name: "Torque Wrench", Category: "Precision", Status: "Available" }
        ]);
      }
    };

    const fetchLogs = async () => {
      try {
        const response = await fetch('./assigning.json');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setAssigningLogs(data);
      } catch (e) { 
        console.error("Logs fetch error, using dummy");
        setAssigningLogs([
          { Date: "2026-05-05", CaseID: "CASE-101", UserName: "Test User", ToolCode: "T001", Project: "GEV-Solar", Action: "Rental", PhotoUrl: "#" }
        ]);
      }
    };

    initializeApp();
  }, []);


  const handleBatchRental = () => {
    const codes = Array.from(selectedTools).join(', ');
    const url = `${baseFormUrl}&id=${encodeURIComponent(codes)}`;
    openForms(url);
  };

  const filteredTools = tools.filter(tool => {
    const searchStr = Object.values(tool).join(' ').toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || 
                          (filter === 'Warehouse' && tool.Status === 'Available') ||
                          (filter === 'On Site' && tool.Status === 'In Use');
    return matchesSearch && matchesFilter;
  });

  const filteredLogs = assigningLogs.filter(log => {
    const searchStr = Object.values(log).join(' ').toLowerCase();
    return searchStr.includes(adminSearchTerm.toLowerCase());
  });

  const StatusIcon = ({ color }: { color: string }) => (
    <svg width="10" height="10" style={{ marginRight: '6px' }}>
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#054141', color: 'white' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>Synchronizing M365 Security Context...</p>
        <style>{`
          .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <style>{`
        :root {
          --evergreen: #054141;
          --evergreen-light: #086363;
          --admin-gold: #fbbf24;
          --status-available: #22c55e;
          --status-inuse: #ef4444;
          --bg-light: #f8fafc;
        }
        header {
          background: var(--evergreen) !important;
          padding: 1rem;
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .header-content { display: flex; justify-content: space-between; alignItems: center; }
        
        .nav-tabs { margin-top: 0.8rem; display: flex; gap: 0.2rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .nav-tabs::-webkit-scrollbar { display: none; }
        .nav-tabs button {
          background: none; border: none; color: rgba(255,255,255,0.6);
          cursor: pointer; padding: 0.5rem 0.8rem; font-weight: 600;
          transition: 0.2s; white-space: nowrap; font-size: 0.9rem;
        }
        .nav-tabs button.active {
          color: white; border-bottom: 3px solid white;
        }
        .nav-tabs button.admin-tab { color: var(--admin-gold); opacity: 0.8; }
        .nav-tabs button.admin-tab.active { opacity: 1; border-bottom-color: var(--admin-gold); }
        
        .main-content { flex: 1; overflow-y: auto; padding: 1rem; background: var(--bg-light); }
        
        .stat-card { background: white; padding: 1.2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .table-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        
        table { width: 100%; border-collapse: collapse; }
        th { background: #f1f5f9; padding: 0.8rem; text-align: left; font-size: 0.75rem; font-weight: 800; color: #475569; }
        td { padding: 0.8rem; border-top: 1px solid #f1f5f9; font-size: 0.85rem; }
        
        .mobile-card {
          background: white; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 5px solid transparent;
        }
        .mobile-card.available { border-left-color: var(--status-available); }
        .mobile-card.inuse { border-left-color: var(--status-inuse); }

        .status-pill { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .status-pill.rented { background: #fee2e2; color: #b91c1c; }
        .status-pill.returned { background: #dcfce7; color: #15803d; }
        
        .photo-btn {
          background: var(--evergreen); color: white; border: none; 
          padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
          width: 100%; margin-top: 0.5rem;
        }
        .debug-footer { background: #e2e8f0; padding: 0.5rem; font-size: 0.65rem; color: #64748b; text-align: center; border-top: 1px solid #cbd5e1; }

        @media (max-width: 768px) {
          header h1 { font-size: 1.1rem !important; }
          .desktop-only { display: none !important; }
          .control-bar { flex-direction: column !important; }
          .control-bar > * { width: 100% !important; }
          .nav-tabs button { font-size: 0.8rem; padding: 0.5rem 0.6rem; }
          .main-content { padding: 0.8rem; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
      
      <header>
        <div className="header-content">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }} onClick={handleTitleClick}>
              <h1 style={{ margin: 0, fontSize: '1.3rem', cursor: 'pointer' }}>GEV ASSET</h1>
              {copyMsg && (
                <span className="animate-fade-in" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                  ✅ {copyMsg}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {selectedTools.size > 0 ? (
              <button onClick={handleBatchRental} style={{ background: 'white', color: 'var(--evergreen)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                 🚀 Rent ({selectedTools.size})
              </button>
            ) : (
              <button onClick={() => openForms(baseFormUrl)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                + Request
              </button>
            )}
          </div>
        </div>
        <nav className="nav-tabs">
          <button className={activeTab === 'Inventory' ? 'active' : ''} onClick={() => setActiveTab('Inventory')}>Dashboard</button>
          <button className={activeTab === 'Stats' ? 'active' : ''} onClick={() => setActiveTab('Stats')}>Stats</button>
          {isAdmin && (
            <button 
              className={`admin-tab ${activeTab === 'Assigning' ? 'active' : ''}`} 
              onClick={() => setActiveTab('Assigning')}
            >
              🔒 Admin: Log
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'Stats' ? (
          <section className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="stat-card"><h3>Total Assets</h3><div style={{ fontSize: '2rem', fontWeight: 700 }}>{tools.length}</div></div>
            <div className="stat-card"><h3>In Warehouse</h3><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--status-available)' }}>{tools.filter(t => t.Status === 'Available').length}</div></div>
            <div className="stat-card"><h3>On Site</h3><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--status-inuse)' }}>{tools.filter(t => t.Status === 'In Use').length}</div></div>
          </section>
        ) : activeTab === 'Assigning' && isAdmin ? (
          <section className="animate-fade-in">
            <div className="control-bar" style={{ marginBottom: '1.5rem' }}>
              <input 
                type="text" placeholder="Search by Case ID, Project, or User..." 
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                value={adminSearchTerm} onChange={(e) => setAdminSearchTerm(e.target.value)}
              />
            </div>
            <div className="table-container desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Case ID</th>
                    <th>UserName</th>
                    <th>Tool Code</th>
                    <th>Project</th>
                    <th>Action</th>
                    <th style={{ textAlign: 'center' }}>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.Date}</td>
                      <td style={{ fontWeight: 700 }}>{log.CaseID}</td>
                      <td>{log.UserName}</td>
                      <td style={{ color: 'var(--evergreen)', fontWeight: 600 }}>{log.ToolCode}</td>
                      <td>{log.Project}</td>
                      <td><span className={`status-pill ${log.Action === 'Return' ? 'returned' : 'rented'}`}>{log.Action}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="photo-btn" onClick={() => window.open(log.PhotoUrl, '_blank')}>📸 Photo</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-only">
              {filteredLogs.map((log, i) => (
                <div key={i} className="mobile-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.Date}</span>
                    <span className={`status-pill ${log.Action === 'Return' ? 'returned' : 'rented'}`}>{log.Action}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.3rem' }}>{log.CaseID}</div>
                  <div style={{ fontSize: '0.85rem' }}>User: {log.UserName}</div>
                  <div style={{ fontSize: '0.85rem' }}>Tool: <strong>{log.ToolCode}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Proj: {log.Project}</div>
                  <button className="photo-btn" onClick={() => window.open(log.PhotoUrl, '_blank')}>📸 View Evidence</button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            <div className="control-bar" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <input 
                type="text" placeholder="Search tools..." 
                style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <option value="All">All Status</option>
                <option value="Warehouse">Warehouse</option>
                <option value="On Site">On Site</option>
              </select>
            </div>
            <div className="table-container desktop-only">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>Sel</th>
                    <th>Status</th>
                    {displayHeaders.map((h, i) => <th key={i}>{h}</th>)}
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'center' }}>
                        {tool.Status === 'Available' && <input type="checkbox" checked={selectedTools.has(tool[dataKeys[0]])} onChange={() => {
                          const n = new Set(selectedTools);
                          n.has(tool[dataKeys[0]]) ? n.delete(tool[dataKeys[0]]) : n.add(tool[dataKeys[0]]);
                          setSelectedTools(n);
                        }} />}
                      </td>
                      <td>
                        <span style={{ color: tool.Status === 'Available' ? 'var(--status-available)' : 'var(--status-inuse)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                          <StatusIcon color={tool.Status === 'Available' ? 'var(--status-available)' : 'var(--status-inuse)'} />
                          {tool.Status === 'Available' ? 'Warehouse' : 'On Site'}
                        </span>
                      </td>
                      {dataKeys.map((k, ki) => (
                        <td key={ki} onClick={() => ki === 0 && copyToClipboard(tool[k])} style={{ cursor: ki === 0 ? 'pointer' : 'default', fontWeight: ki === 0 ? 700 : 400 }}>
                          {tool[k]}
                        </td>
                      ))}
                      <td style={{ textAlign: 'center' }}>
                        {tool.Status === 'Available' ? (
                          <button onClick={() => { setSelectedTools(new Set([tool[dataKeys[0]]])); handleBatchRental(); }} style={{ background: 'none', border: 'none', color: 'var(--evergreen)', fontWeight: 800, textDecoration: 'underline', cursor: 'pointer' }}>Rent Now</button>
                        ) : <span style={{ color: '#cbd5e1' }}>Rented</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-only">
              {filteredTools.map((tool, i) => (
                <div key={i} className={`mobile-card ${tool.Status === 'Available' ? 'available' : 'inuse'}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div onClick={() => copyToClipboard(tool[dataKeys[0]])} style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--evergreen)' }}>
                      {tool[dataKeys[0]]}
                    </div>
                    {tool.Status === 'Available' && (
                      <input type="checkbox" style={{ transform: 'scale(1.5)' }} checked={selectedTools.has(tool[dataKeys[0]])} onChange={() => {
                        const n = new Set(selectedTools);
                        n.has(tool[dataKeys[0]]) ? n.delete(tool[dataKeys[0]]) : n.add(tool[dataKeys[0]]);
                        setSelectedTools(n);
                      }} />
                    )}
                  </div>
                  <div style={{ margin: '0.5rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {dataKeys.slice(1).map((k, ki) => (
                      <div key={ki} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        <strong>{displayHeaders[ki+1]}:</strong> {tool[k]}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: tool.Status === 'Available' ? 'var(--status-available)' : 'var(--status-inuse)' }}>
                      ● {tool.Status === 'Available' ? 'Warehouse' : 'On Site'}
                    </span>
                    {tool.Status === 'Available' ? (
                      <button onClick={() => { setSelectedTools(new Set([tool[dataKeys[0]]])); handleBatchRental(); }} style={{ background: 'var(--evergreen)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700 }}>
                        Rent Now
                      </button>
                    ) : <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Currently Rented</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="debug-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          User: <strong>{currentUserEmail}</strong> | Role: {isAdmin ? <span style={{color:'var(--admin-gold)'}}>Admin</span> : 'User'}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#cbd5e1', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.6rem' }}>Reload App</button>
          <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>{debugInfo}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
