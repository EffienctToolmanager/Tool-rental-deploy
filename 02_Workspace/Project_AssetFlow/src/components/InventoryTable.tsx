import React, { useState, useEffect } from 'react';
import { type Asset } from '../types';

interface InventoryTableProps {
  assets: Asset[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ assets: initialAssets }) => {
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
    setSortConfig({ key, direction });
  };

  return (
    <div>
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
              
              let rowStyle = {};
              if (daysLeft < 0) {
                rowStyle = { backgroundColor: 'var(--f-danger-bg)' };
              } else if (daysLeft < 30) {
                rowStyle = { backgroundColor: 'var(--f-warning)' };
              }

              return (
                <tr key={index} style={rowStyle}>
                  <td>
                    <span className={`f-badge ${status === 'Available' ? 'f-badge-available' : 'f-badge-rented'}`}>
                      {status?.toUpperCase()}
                    </span>
                  </td>
                  <td>{location}</td>
                  <td style={{ color: currentLocation === 'Warehouse' ? 'var(--f-text-secondary)' : 'var(--f-primary)', fontWeight: 600 }}>
                    {currentLocation}
                  </td>
                  <td style={{ fontWeight: 600 }}>{asset.Asset_Code || asset.assetCode}</td>
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
