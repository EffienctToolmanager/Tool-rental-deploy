import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [displayHeaders, setDisplayHeaders] = useState<string[]>([]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Inventory');
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [copyMsg, setCopyMsg] = useState('');

  // Use the verified short URL
  const baseFormUrl = "https://forms.office.com/r/HQfa3nDmZu"; 

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMsg(`Copied: ${text}`);
    setTimeout(() => setCopyMsg(''), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./data.json');
        const data = await response.json();
        if (data.length > 0) {
          const firstRow = data[0];
          const keys = Object.keys(firstRow).filter(k => k !== 'Status' && k !== 'Location');
          const labels = keys.map(k => firstRow[k]);
          setDisplayHeaders(labels);
          setDataKeys(keys);
          setTools(data.slice(1));
        }
      } catch (e) {
        console.error("Data fetch error");
      }
    };
    fetchData();
  }, []);

  const toggleSelection = (code: string) => {
    const newSelection = new Set(selectedTools);
    if (newSelection.has(code)) {
      newSelection.delete(code);
    } else {
      newSelection.add(code);
    }
    setSelectedTools(newSelection);
  };

  const filteredTools = tools.filter(tool => {
    const searchStr = Object.values(tool).join(' ').toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || 
                          (filter === 'Warehouse' && tool.Status === 'Available') ||
                          (filter === 'On Site' && tool.Status === 'In Use');
    return matchesSearch && matchesFilter;
  });

  const handleBatchRental = () => {
    const codes = Array.from(selectedTools).join(', ');
    const url = `${baseFormUrl}?id=${encodeURIComponent(codes)}`;
    // Using window.open with _blank but also providing a fallback for mobile Teams
    window.open(url, '_blank');
  };

  // SVG Icon Components to avoid encoding issues (??)
  const StatusIcon = ({ color }: { color: string }) => (
    <svg width="10" height="10" style={{ marginRight: '6px' }}>
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );

  return (
    <div className="container">
      <style>{`
        :root {
          --evergreen: #054141;
          --evergreen-light: #086363;
          --status-available: #22c55e;
          --status-inuse: #ef4444;
        }
        header {
          background: var(--evergreen) !important;
          padding: 1.5rem 2rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .rental-btn {
          background: white !important;
          color: var(--evergreen) !important;
          font-weight: 700;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .rental-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .nav-tabs button.active {
          border-bottom: 3px solid white;
          opacity: 1;
        }
        .status-tag {
          display: flex;
          align-items: center;
          font-weight: 600;
        }
        .tag-available { color: var(--status-available); }
        .tag-inuse { color: var(--status-inuse); }
        .rent-link {
          color: var(--evergreen);
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
      
      <header>
        <div className="logo-area">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>GEV TOOL Master</h1>
            {copyMsg && (
              <div className="animate-fade-in" style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.4rem 1rem', 
                borderRadius: '20px', 
                fontSize: '0.8rem',
                color: '#fff'
              }}>
                ✅ {copyMsg}
              </div>
            )}
          </div>
          <nav className="nav-tabs" style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem' }}>
            <button 
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: activeTab === 'Inventory' ? 1 : 0.6, paddingBottom: '4px' }}
              className={activeTab === 'Inventory' ? 'active' : ''} 
              onClick={() => setActiveTab('Inventory')}
            >
              Master Inventory
            </button>
            <button 
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: activeTab === 'Dashboard' ? 1 : 0.6, paddingBottom: '4px' }}
              className={activeTab === 'Dashboard' ? 'active' : ''} 
              onClick={() => setActiveTab('Dashboard')}
            >
              System Stats
            </button>
          </nav>
        </div>
        
        {selectedTools.size > 0 ? (
          <button onClick={handleBatchRental} className="rental-btn">
             🚀 Rent Selected ({selectedTools.size})
          </button>
        ) : (
          <a href={baseFormUrl} target="_blank" rel="noreferrer" className="rental-btn">
            + New Request
          </a>
        )}
      </header>

      <main className="main-content" style={{ padding: '2rem' }}>
        {activeTab === 'Dashboard' ? (
          <section className="dashboard-view animate-fade-in">
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Assets</h3>
                <div className="value" style={{ fontSize: '2rem', fontWeight: 700 }}>{tools.length}</div>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Warehouse</h3>
                <div className="value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--status-available)' }}>{tools.filter(t => t.Status === 'Available').length}</div>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>On Site</h3>
                <div className="value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--status-inuse)' }}>{tools.filter(t => t.Status === 'In Use').length}</div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <div className="control-bar" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Search tools..." 
                style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <option value="All">All Status</option>
                <option value="Warehouse">Warehouse</option>
                <option value="On Site">On Site</option>
              </select>
            </div>

            <div className="table-container" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '1rem', width: '40px' }}>Sel</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                    {displayHeaders.map((label, idx) => (
                      <th key={idx} style={{ padding: '1rem', textAlign: 'left' }}>{label}</th>
                    ))}
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {tool.Status === 'Available' && (
                          <input 
                            type="checkbox" 
                            checked={selectedTools.has(tool[dataKeys[0]])}
                            onChange={() => toggleSelection(tool[dataKeys[0]])}
                          />
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status-tag ${tool.Status === 'Available' ? 'tag-available' : 'tag-inuse'}`}>
                          <StatusIcon color={tool.Status === 'Available' ? 'var(--status-available)' : 'var(--status-inuse)'} />
                          {tool.Status === 'Available' ? 'Warehouse' : 'On Site'}
                        </span>
                      </td>
                      {dataKeys.map((key, kIdx) => (
                        <td 
                          key={kIdx} 
                          style={{ 
                            padding: '1rem',
                            fontWeight: (kIdx === 0) ? 700 : 400,
                            cursor: kIdx === 0 ? 'pointer' : 'default'
                          }}
                          onClick={() => kIdx === 0 && copyToClipboard(tool[key])}
                        >
                          {tool[key]}
                        </td>
                      ))}
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {tool.Status === 'Available' ? (
                          <button 
                            onClick={() => { setSelectedTools(new Set([tool[dataKeys[0]]])); handleBatchRental(); }} 
                            className="rent-link"
                            style={{ background: 'none', border: 'none', padding: 0 }}
                          >
                            Rent Now
                          </button>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>Rented</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
