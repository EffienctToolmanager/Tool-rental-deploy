import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [displayHeaders, setDisplayHeaders] = useState<string[]>([]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Inventory');
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

  const baseFormUrl = "https://forms.office.com/r/yourformid"; 

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
    window.open(url, '_blank');
  };

  return (
    <div className="container">
      <header>
        <div className="logo-area">
          <h1>GEV TOOL Master</h1>
          <nav className="nav-tabs">
            <button className={activeTab === 'Inventory' ? 'active' : ''} onClick={() => setActiveTab('Inventory')}>Master Inventory</button>
            <button className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}>System Stats</button>
          </nav>
        </div>
        
        {selectedTools.size > 0 ? (
          <button onClick={handleBatchRental} className="rental-btn batch-btn">
             🚀 Rent Selected ({selectedTools.size} items)
          </button>
        ) : (
          <a href={baseFormUrl} target="_blank" rel="noreferrer" className="rental-btn">
            + New Request Form
          </a>
        )}
      </header>

      <main className="main-content">
        {activeTab === 'Dashboard' ? (
          <section className="dashboard-view animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card"><h3>Total Assets</h3><div className="value">{tools.length}</div></div>
              <div className="stat-card"><h3>Warehouse</h3><div className="value" style={{ color: 'var(--status-available)' }}>{tools.filter(t => t.Status === 'Available').length}</div></div>
              <div className="stat-card"><h3>On Site</h3><div className="value" style={{ color: 'var(--status-inuse)' }}>{tools.filter(t => t.Status === 'In Use').length}</div></div>
            </div>
          </section>
        ) : (
          <>
            <div className="control-bar">
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="search-input"
                style={{ flex: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="search-input">
                <option value="All">All Status</option>
                <option value="Warehouse">Warehouse (Available)</option>
                <option value="On Site">On Site (In Use)</option>
              </select>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>Select</th>
                    <th>Status</th>
                    {displayHeaders.map((label, idx) => (
                      <th key={idx}>{label}</th>
                    ))}
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((tool, idx) => (
                    <tr key={idx} className={selectedTools.has(tool[dataKeys[0]]) ? 'selected-row' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        {tool.Status === 'Available' && (
                          <input 
                            type="checkbox" 
                            className="tool-checkbox"
                            checked={selectedTools.has(tool[dataKeys[0]])}
                            onChange={() => toggleSelection(tool[dataKeys[0]])}
                          />
                        )}
                      </td>
                      <td>
                        <span className={`status-tag ${tool.Status === 'Available' ? 'tag-available' : 'tag-inuse'}`}>
                          {tool.Status === 'Available' ? '● Warehouse' : '● On Site'}
                        </span>
                      </td>
                      {dataKeys.map((key, kIdx) => (
                        <td key={kIdx} style={{ 
                          fontWeight: (kIdx === 0 || kIdx === 8) ? 800 : 400,
                          color: (kIdx === 2 && tool.Status === 'In Use') ? 'var(--status-inuse)' : 'inherit'
                        }}>
                          {tool[key]}
                        </td>
                      ))}
                      <td style={{ textAlign: 'center' }}>
                        {tool.Status === 'Available' ? (
                          <button 
                            onClick={() => { setSelectedTools(new Set([tool[dataKeys[0]]])); handleBatchRental(); }} 
                            className="rent-link" 
                            style={{ background: 'none', border: 'none', padding: 0 }}
                          >
                            Quick Rent
                          </button>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>-</span>
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
