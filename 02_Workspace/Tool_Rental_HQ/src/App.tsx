import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import RentalForm from './components/RentalForm';
import ActiveRentals from './components/ActiveRentals';
import InventoryTable from './components/InventoryTable';
import AnalyticsTab from './components/AnalyticsTab';
import { type Asset, type Rental } from './types';

const API_BASE = "http://localhost:5000/api/sharepoint";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'dashboard' | 'inventory' | 'analytics'>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [selectedAssetCodes, setSelectedAssetCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/list`);
      if (!res.ok) throw new Error("API Fetch failed");
      const dataObj = await res.json();
      const items = dataObj.data || [];
      
      const mappedAssets = items.map((item: any) => ({
        assetCode: item.equipmentCode,
        model: item.name,
        Current_Status: item.status === '보관중' ? 'Available' : 'Rented',
        currentLocation: item.projectName || 'Warehouse',
        calDate: '2026-12-31',
        zone: 'HQ',
        rack: 'A1'
      }));

      const activeRentals = items.filter((item: any) => item.status === '대여중').map((item: any) => ({
         assetCode: item.equipmentCode,
         projectName: item.projectName,
         expectedReturnDate: item.returnDate,
         caseId: item.caseId,
         userEmail: item.userEmail,
         model: item.name
      }));

      setAssets(mappedAssets);
      setRentals(activeRentals);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getChartData = () => {
    const available = assets.filter(a => (a as any).Current_Status === 'Available').length;
    const rented = assets.filter(a => (a as any).Current_Status === 'Rented').length;
    return [
      { name: 'Available', value: available, color: '#4CAF50' },
      { name: 'Rented', value: rented, color: '#5B5FC7' },
      { name: 'Maintenance', value: 0, color: '#FF9800' }
    ];
  };

  return (
    <div className="app-container">
      <header style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--f-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyItems: 'center', color: 'white', fontWeight: 'bold', justifyContent: 'center' }}>T</div>
            <h1 style={{ fontSize: '20px' }}>Tool Rental HQ</h1>
          </div>
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
                selectedAssetCodes={selectedAssetCodes}
                setSelectedAssetCodes={setSelectedAssetCodes}
                onSuccess={() => {
                  setSelectedAssetCodes([]); // Clear selection on success
                  fetchData();
                }}
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
            
            {activeTab === 'inventory' && (
              <InventoryTable 
                assets={assets} 
                selectedAssetCodes={selectedAssetCodes}
                setSelectedAssetCodes={setSelectedAssetCodes}
                onNavigateToCheckout={() => setActiveTab('checkout')}
              />
            )}
            
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
