import React, { useState, useEffect } from 'react';
import { type Asset } from '../types';

interface InventoryTableProps {
  assets: Asset[];
  selectedAssetCodes: string[];
  setSelectedAssetCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onNavigateToCheckout: () => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  assets: initialAssets, 
  selectedAssetCodes, 
  setSelectedAssetCodes, 
  onNavigateToCheckout 
}) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Sync state when props change
  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  const calculateDaysUntilCal = (calDate: string) => {
    if (!calDate) return 999;
    const today = new Date();
    const target = new Date(calDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...assets].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setAssets(sorted);
    sortConfig && setSortConfig({ key, direction });
  };

  const handleCheckboxChange = (assetCode: string, checked: boolean) => {
    if (checked) {
      setSelectedAssetCodes(prev => [...prev, assetCode]);
    } else {
      setSelectedAssetCodes(prev => prev.filter(code => code !== assetCode));
    }
  };

  return (
    <div>
      {/* Sleek Floating Top Bar for Cart Selection */}
      {selectedAssetCodes.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#eff6ff',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          padding: '12px 20px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛒</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>
              대여 예정 장비 <strong>{selectedAssetCodes.length}개</strong>가 장바구니에 담겼습니다.
            </span>
          </div>
          <button 
            type="button"
            className="f-button"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 'bold',
              margin: 0,
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onClick={onNavigateToCheckout}
          >
            Smart 대여 신청하러 가기 ➜
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px' }}>Master Asset Inventory</h2>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--f-warning)', border: '1px solid var(--f-warning-border)' }}></div>
            <span>Cal &lt; 30 Days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--f-danger-bg)', border: '1px solid #D32F2F' }}></div>
            <span>Cal Expired</span>
          </div>
        </div>
      </div>

      <div className="f-table-container">
        <table className="f-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Select</th>
              <th onClick={() => handleSort('Current_Status')}>Status</th>
              <th onClick={() => handleSort('Location_Zone')}>Location (Zone/Rack)</th>
              <th onClick={() => handleSort('Current_Location')}>Current location</th>
              <th onClick={() => handleSort('Asset_Code')}>Asset Code</th>
              <th onClick={() => handleSort('Brand')}>Brand</th>
              <th onClick={() => handleSort('Asset_Model')}>Model</th>
              <th onClick={() => handleSort('Calibration_Date')}>Calibration Date</th>
              <th>Days Until Cal</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset: any, index) => {
              const daysLeft = calculateDaysUntilCal(asset.Calibration_Date || asset.calDate);
              const status = asset.Current_Status || asset.status;
              const location = `${asset.Location_Zone || asset.zone} / ${asset.Location_Rack || asset.rack}`;
              const currentLocation = asset.Current_Location || asset.currentLocation;
              const assetCode = asset.Asset_Code || asset.assetCode;
              
              const isSelected = selectedAssetCodes.includes(assetCode);
              const isAvailable = status === 'Available';
              
              let rowStyle = {};
              if (daysLeft < 0) {
                rowStyle = { backgroundColor: 'var(--f-danger-bg)' };
              } else if (daysLeft < 30) {
                rowStyle = { backgroundColor: 'var(--f-warning)' };
              }

              if (isSelected) {
                rowStyle = { ...rowStyle, backgroundColor: '#eff6ff' };
              }

              return (
                <tr key={index} style={rowStyle}>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isAvailable}
                      style={{ width: '16px', height: '16px', cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                      onChange={(e) => handleCheckboxChange(assetCode, e.target.checked)}
                      title={isAvailable ? '대여 장바구니에 담기' : '대여중인 장비는 선택할 수 없습니다.'}
                    />
                  </td>
                  <td>
                    <span className={`f-badge ${status === 'Available' ? 'f-badge-available' : 'f-badge-rented'}`}>
                      {status?.toUpperCase()}
                    </span>
                  </td>
                  <td>{location}</td>
                  <td style={{ color: currentLocation === 'Warehouse' ? 'var(--f-text-secondary)' : 'var(--f-primary)', fontWeight: 600 }}>
                    {currentLocation}
                  </td>
                  <td style={{ fontWeight: 600 }}>{assetCode}</td>
                  <td>{asset.Brand || asset.brand}</td>
                  <td>{asset.Asset_Model || asset.model}</td>
                  <td>{asset.Calibration_Date || asset.calDate}</td>
                  <td style={{ fontWeight: 'bold' }}>
                    {daysLeft < 0 ? (
                      <span style={{ color: 'var(--f-error)' }}>EXPIRED ({Math.abs(daysLeft)}d)</span>
                    ) : (
                      `${daysLeft}d`
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
