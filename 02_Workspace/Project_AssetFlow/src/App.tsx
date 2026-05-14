import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import RentalForm from './components/RentalForm';
import ActiveRentals from './components/ActiveRentals';
import InventoryTable from './components/InventoryTable';
import AnalyticsTab from './components/AnalyticsTab';
import { type Asset, type Rental } from './types';

const API_BASE = "http://localhost:8000/api";
const USE_AUTH = import.meta.env.VITE_USE_AUTH === 'true';

const App: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  
  const [activeTab, setActiveTab] = useState<'checkout' | 'dashboard' | 'inventory' | 'analytics'>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [assetsRes, rentalsRes] = await Promise.all([
        fetch(`${API_BASE}/assets`),
        fetch(`${API_BASE}/rentals`)
      ]);
      if (!assetsRes.ok || !rentalsRes.ok) throw new Error("API Fetch failed");
      
      const assetsData = await assetsRes.json();
      const rentalsData = await rentalsRes.json();
      setAssets(assetsData);
      setRentals(rentalsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!USE_AUTH || isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => console.error(e));
  };

  const getChartData = () => {
    const available = assets.filter(a => (a as any).Current_Status === 'Available').length;
    const rented = assets.filter(a => (a as any).Current_Status === 'Rented').length;
    return [
      { name: 'Available', value: available, color: '#4CAF50' },
      { name: 'Rented', value: rented, color: '#5B5FC7' },
      { name: 'Maintenance', value: 0, color: '#FF9800' }
    ];
  };

  // Auth Guard
  if (USE_AUTH && !isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5' }}>
        <div className="f-card" style={{ textAlign: 'center', width: '350px', padding: '40px' }}>
          <div style={{ width: '48px', height: '48px', background: '#5B5FC7', borderRadius: '8px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>A</div>
          <h2 style={{ marginBottom: '8px' }}>Project AssetFlow</h2>
          <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Please sign in with your corporate account to access the dashboard.</p>
          <button className="f-button f-button-primary" style={{ width: '100%' }} onClick={handleLogin}>
            Sign in with Microsoft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--f-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyItems: 'center', color: 'white', fontWeight: 'bold', justifyContent: 'center' }}>A</div>
            <h1 style={{ fontSize: '20px' }}>Project AssetFlow</h1>
          </div>
          {isAuthenticated && (
            <div style={{ fontSize: '12px', color: 'var(--f-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{accounts[0]?.name}</span>
              <button onClick={() => instance.logoutPopup()} style={{ background: 'none', border: 'none', color: '#5B5FC7', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>Logout</button>
            </div>
          )}
        </div>

        <nav className="f-tabs">
          {['checkout', 'dashboard', 'inventory', 'analytics'].map((tab) => (
            <div 
              key={tab}
              className={`f-tab ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('checkout', 'Smart Rental').replace('dashboard', 'Live Dashboard').replace('inventory', 'Master Inventory').replace('analytics', 'Analytics & Reports')}
            </div>
          ))}
        </nav>
      </header>

      <main>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading real-time data...</div>
        ) : (
          <>
            {activeTab === 'checkout' && (
              <RentalForm 
                assets={assets.filter(a => (a as any).Current_Status === 'Available')} 
                onSuccess={fetchData}
              />
            )}
            
            {activeTab === 'dashboard' && (
              <div className="f-fade-in">
                <div className="f-card" style={{ marginBottom: '24px', height: '300px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Assets Status Overview</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ActiveRentals rentals={rentals} onRefresh={fetchData} />
              </div>
            )}
            
            {activeTab === 'inventory' && <InventoryTable assets={assets} />}
            
            {activeTab === 'analytics' && <AnalyticsTab />}
          </>
        )}
      </main>

      <footer style={{ marginTop: '40px', padding: '20px 0', borderTop: '1px solid var(--f-border)', textAlign: 'center', color: 'var(--f-text-secondary)', fontSize: '12px' }}>
        © 2026 Project AssetFlow • Microsoft Teams Enterprise Edition
      </footer>
    </div>
  );
};

export default App;
