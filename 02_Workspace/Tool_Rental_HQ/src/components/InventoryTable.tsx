import React, { useState } from 'react';
import { type Asset, type ScheduledCase } from '../types';
import './InventoryTable.css';

interface InventoryTableProps {
  assets: Asset[];
  schedules?: ScheduledCase[];
  selectedToolCodes: string[];
  setSelectedToolCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onNavigateToCheckout: () => void;
}

const csvEscape = (value: unknown) => {
  const raw = value == null ? '' : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
};

const getToolCode = (asset: any) => asset.Tool_Code || asset.toolCode;
const getBrand = (asset: any) => asset.Brand || asset.brand || '—';
const getModel = (asset: any) => asset.Asset_Model || asset.model || '—';

const SpecSummaryCard: React.FC<{ asset: Asset; compact?: boolean }> = ({ asset, compact = false }) => {
  const spec = asset.specSummary;

  if (!spec) {
    return (
      <div className="datasheet-summary-card">
        <strong>Spec Summary</strong>
        <p>No mock datasheet summary saved yet.</p>
      </div>
    );
  }

  const rows = [
    ['Type', spec.equipmentType],
    ['Range', spec.measurementRange],
    ['Accuracy', spec.accuracy],
    ['Voltage', spec.voltageRating],
    ['Current', spec.currentRating],
    ['Safety', spec.safetyCategory],
    ['Connectivity', spec.connectivity],
    ['Power', spec.powerSource],
    ['Calibration', spec.calibrationCycle],
  ];

  return (
    <div className="datasheet-summary-card">
      <div className="summary-card-header">
        <div>
          <strong>Spec Summary</strong>
          <div className="summary-card-subtitle">{getBrand(asset)} {getModel(asset)}</div>
        </div>
        <span className="summary-card-chip">MOCK</span>
      </div>
      <div className={compact ? 'summary-card-grid compact' : 'summary-card-grid'}>
        {rows.map(([label, value]) => (
          <React.Fragment key={label}>
            <span className="summary-card-label">{label}</span>
            <span>{value}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="summary-card-features">
        <strong>Key features</strong>
        <ul>
          {spec.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </div>
      <p className="summary-card-use"><strong>Typical use:</strong> {spec.typicalUse}</p>
      {asset.datasheetUrl && (
        <a className="summary-card-link" href={asset.datasheetUrl} target="_blank" rel="noreferrer">
          Open mock datasheet PDF
        </a>
      )}
    </div>
  );
};

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  assets: initialAssets, 
  schedules = [],
  selectedToolCodes, 
  setSelectedToolCodes, 
  onNavigateToCheckout 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [detailsAsset, setDetailsAsset] = useState<Asset | null>(null);

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
    setSortConfig({ key, direction });
  };

  const handleCheckboxChange = (toolCode: string, checked: boolean) => {
    if (checked) {
      setSelectedToolCodes(prev => [...prev, toolCode]);
    } else {
      setSelectedToolCodes(prev => prev.filter(code => code !== toolCode));
    }
  };

  // Dynamically filter and sort assets on the fly
  const getSortedAndFilteredAssets = () => {
    let result = [...initialAssets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => {
        const code = (asset.Tool_Code || asset.toolCode || '').toLowerCase();
        const brand = (asset.Brand || asset.brand || '').toLowerCase();
        const model = (asset.Asset_Model || asset.model || '').toLowerCase();
        const type = (asset.specSummary?.equipmentType || '').toLowerCase();
        const serial = (asset.serialNumber || asset.Serial_Number || '').toLowerCase();
        const location = (asset.Location_Rack || asset.rack || '').toLowerCase();
        const currentLocation = (asset.Current_Location || asset.currentLocation || '').toLowerCase();

        return code.includes(query) ||
               brand.includes(query) ||
               model.includes(query) ||
               type.includes(query) ||
               serial.includes(query) ||
               location.includes(query) ||
               currentLocation.includes(query);
      });
    }

    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a: any, b: any) => {
        let av = a[key] || a[key.replace(/^[A-Z]/, (c) => c.toLowerCase())] || '';
        let bv = b[key] || b[key.replace(/^[A-Z]/, (c) => c.toLowerCase())] || '';

        if (key === 'rack') {
          av = a.Location_Rack || a.rack || '';
          bv = b.Location_Rack || b.rack || '';
        } else if (key === 'Location' || key === 'location') {
          av = a.Location_Rack || a.rack || '';
          bv = b.Location_Rack || b.rack || '';
        } else if (key === 'serialNumber' || key === 'Serial_Number') {
          av = a.serialNumber || a.Serial_Number || '';
          bv = b.serialNumber || b.Serial_Number || '';
        } else if (key === 'Current_Status' || key === 'status') {
          av = a.Current_Status || a.status || '';
          bv = b.Current_Status || b.status || '';
        } else if (key === 'Current_Location' || key === 'currentLocation') {
          av = a.Current_Location || a.currentLocation || '';
          bv = b.Current_Location || b.currentLocation || '';
        } else if (key === 'Tool_Code' || key === 'toolCode') {
          av = a.Tool_Code || a.toolCode || '';
          bv = b.Tool_Code || b.toolCode || '';
        } else if (key === 'Brand' || key === 'brand') {
          av = a.Brand || a.brand || '';
          bv = b.Brand || b.brand || '';
        } else if (key === 'Asset_Model' || key === 'model') {
          av = a.Asset_Model || a.model || '';
          bv = b.Asset_Model || b.model || '';
        } else if (key === 'Calibration_Date' || key === 'calDate') {
          av = a.Calibration_Date || a.calDate || '';
          bv = b.Calibration_Date || b.calDate || '';
        }

        if (av < bv) return direction === 'asc' ? -1 : 1;
        if (av > bv) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  const displayAssets = getSortedAndFilteredAssets();
  const selectedAssets = initialAssets.filter(asset => selectedToolCodes.includes(getToolCode(asset)));

  const downloadSelectedCsv = () => {
    const headers = [
      'Tool Code', 'Brand', 'Model', 'Serial Number', 'Rack', 'Equipment Type', 'Measurement Range', 'Accuracy',
      'Voltage Rating', 'Current Rating', 'Safety Category', 'Connectivity', 'Power Source',
      'Calibration Cycle', 'Key Features', 'Typical Use', 'Datasheet PDF URL'
    ];

    const rows = selectedAssets.map(asset => {
      const spec = asset.specSummary;
      const serial = asset.serialNumber || asset.Serial_Number || '';
      const rackVal = asset.Location_Rack || asset.rack || '';
      return [
        getToolCode(asset), getBrand(asset), getModel(asset), serial, rackVal, spec?.equipmentType, spec?.measurementRange,
        spec?.accuracy, spec?.voltageRating, spec?.currentRating, spec?.safetyCategory, spec?.connectivity,
        spec?.powerSource, spec?.calibrationCycle, spec?.keyFeatures.join('; '), spec?.typicalUse, asset.datasheetUrl
      ].map(csvEscape).join(',');
    });

    const csv = [headers.map(csvEscape).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ToolRental_Selected_Spec_Summary.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {selectedToolCodes.length > 0 && (
        <div className="inventory-selection-bar">
          <div className="selection-bar-info">
            <span style={{ fontSize: '18px' }}>🛒</span>
            <span className="selection-bar-text">
              <strong>{selectedToolCodes.length}</strong> planned rental assets selected.
            </span>
          </div>
          <div className="selection-bar-actions">
            <button 
              type="button" 
              className="f-button spec-export-button" 
              onClick={downloadSelectedCsv}
              data-agent-id="export-csv-btn"
              data-agent-action="export-csv"
            >
              ⬇ Export Spec CSV
            </button>
            <button 
              type="button" 
              className="f-button f-button-primary" 
              onClick={onNavigateToCheckout}
              data-agent-id="navigate-checkout-btn"
              data-agent-action="navigate-checkout"
            >
              Go to Smart Checkout ➜
            </button>
          </div>
        </div>
      )}

      <div className="inventory-header">
        <div>
          <h2 className="inventory-title">Master Asset Inventory</h2>
          <p className="inventory-subtitle">
            Hover or tap model text, or use ⋯ Details to preview the standardized mock datasheet summary.
          </p>
        </div>
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-color-box warning"></div>
            <span>Cal &lt; 30 Days</span>
          </div>
          <div className="legend-item">
            <div className="legend-color-box expired"></div>
            <span>Cal Expired</span>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by model, brand, code, serial, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-agent-id="inventory-search-input"
            data-agent-action="search"
          />
        </div>
      </div>

      <div className="f-table-container">
        <table className="f-table">
          <thead>
            <tr>
              <th className="table-th-select">Select</th>
              <th onClick={() => handleSort('Current_Status')}>Status</th>
              <th onClick={() => handleSort('Tool_Code')}>Tool Code</th>
              <th onClick={() => handleSort('rack')}>Rack</th>
              <th onClick={() => handleSort('Current_Location')}>Current location</th>
              <th onClick={() => handleSort('Brand')}>Brand</th>
              <th onClick={() => handleSort('Asset_Model')}>Model</th>
              <th onClick={() => handleSort('serialNumber')}>Serial Number</th>
              <th onClick={() => handleSort('Calibration_Date')}>Calibration Date</th>
              <th>Days Until Cal</th>
              <th className="table-th-more">More</th>
            </tr>
          </thead>
          <tbody>
            {displayAssets.map((asset: any, index) => {
              const daysLeft = calculateDaysUntilCal(asset.Calibration_Date || asset.calDate);
              const status = asset.Current_Status || asset.status;
              const rack = asset.Location_Rack || asset.rack || '';
              const currentLocation = asset.Current_Location || asset.currentLocation;
              const toolCode = getToolCode(asset);
              const isSelected = selectedToolCodes.includes(toolCode);
              const isAvailable = status === 'Available';
              const serialNumber = asset.serialNumber || asset.Serial_Number || '—';
              
              const assetSchedules = schedules.filter((s: any) => s.toolCode === toolCode && s.status !== 'Completed');
              const sortedSchedules = [...assetSchedules].sort((a: any, b: any) => {
                if (a.sequenceOrder !== b.sequenceOrder) {
                  return a.sequenceOrder - b.sequenceOrder;
                }
                const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                if (dateA !== dateB) return dateA - dateB;
                return a.id.localeCompare(b.id);
              });
              const currentCaseId = asset.caseId;
              const nextSchedules = sortedSchedules.filter((s: any) => s.id !== currentCaseId);

              let rowClass = '';
              if (daysLeft < 0) rowClass = 'row-calibration-expired';
              else if (daysLeft < 30) rowClass = 'row-calibration-warning';
              if (isSelected) rowClass += (rowClass ? ' ' : '') + 'row-selected';

              return (
                <tr key={toolCode || index} className={rowClass}>
                  <td className="table-td-select">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isAvailable}
                      className={`select-checkbox ${
                        isAvailable ? 'available' : 
                        status === 'Calibration' ? 'calibration' : 
                        status === 'Reserved' ? 'reserved' : 
                        'rented'
                      }`}
                      onChange={(e) => handleCheckboxChange(toolCode, e.target.checked)}
                      title={
                        isAvailable ? 'Add to rental cart' : 
                        status === 'Calibration' ? 'Equipment in Calibration cannot be rented.' :
                        status === 'Reserved' ? 'Reserved equipment cannot be rented.' :
                        'Rented assets cannot be selected.'
                      }
                      data-agent-id={`select-${toolCode}`}
                      data-agent-action="select-asset"
                    />
                  </td>
                  <td>
                    <span className={`f-badge ${
                      status === 'Available' ? 'f-badge-available' : 
                      status === 'Calibration' ? 'f-badge-calibration' : 
                      status === 'Reserved' ? 'f-badge-reserved' : 
                      'f-badge-rented'
                    }`}>
                      {status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-td-code">{toolCode}</td>
                  <td>{rack}</td>
                  <td className={`table-td-location ${currentLocation === 'Warehouse' ? 'warehouse' : 'field'}`}>
                    <div className="location-cell-content">
                      <span className="location-name">{currentLocation}</span>
                      {nextSchedules.length > 0 && (
                        <div className="next-use-badge-container">
                          <span className="next-use-badge-trigger">
                            <span className="next-use-label">Next: </span>
                            <span className={`next-use-badge next-use-badge-${nextSchedules[0].stage}`}>
                              {nextSchedules[0].stage === 'calibration' ? 'Calibration' : nextSchedules[0].destination}
                              {nextSchedules.length > 1 && ` (+${nextSchedules.length - 1})`}
                            </span>
                          </span>
                          
                          {/* Rich Tooltip Card */}
                          <div className="next-use-tooltip">
                            <div className="tooltip-header">Upcoming Schedules for {toolCode}</div>
                            <div className="tooltip-timeline">
                              {nextSchedules.map((s: any, idx: number) => (
                                <div key={s.id || idx} className="tooltip-timeline-item">
                                  <div className="timeline-dot-connector">
                                    <div className={`timeline-dot dot-${s.stage}`} />
                                    {idx < nextSchedules.length - 1 && <div className="timeline-connector" />}
                                  </div>
                                  <div className="timeline-details">
                                    <div className="timeline-header-row">
                                      <span className={`timeline-badge badge-${s.stage}`}>
                                        {s.stage === 'active_rental' ? 'Rental' : s.stage === 'calibration' ? 'Calibration' : 'Ongoing'}
                                      </span>
                                      <span className="timeline-destination">{s.destination || 'Calibration Lab'}</span>
                                    </div>
                                    {s.startDate && s.endDate ? (
                                      <div className="timeline-dates">{s.startDate} ~ {s.endDate}</div>
                                    ) : (
                                      <div className="timeline-dates" style={{ fontStyle: 'italic', color: 'var(--f-text-muted)' }}>No dates (Sequence Queue)</div>
                                    )}
                                    <div className="timeline-meta">
                                      {s.projectCode && <span>Code: {s.projectCode} · </span>}
                                      <span>PM: {s.pmEmail}</span>
                                    </div>
                                    {s.notes && <div className="timeline-notes">Note: {s.notes}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{getBrand(asset)}</td>
                  <td>
                    <span
                      className="model-hover-target"
                      role="button"
                      tabIndex={0}
                      aria-label={`Open specification summary for ${getBrand(asset)} ${getModel(asset)}`}
                      onClick={() => setDetailsAsset(asset)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setDetailsAsset(asset);
                        }
                      }}
                    >
                      {getModel(asset)}
                      <div className="model-hover-card"><SpecSummaryCard asset={asset} compact /></div>
                    </span>
                  </td>
                  <td>{serialNumber}</td>
                  <td>{asset.Calibration_Date || asset.calDate}</td>
                  <td className="table-td-cal-days">{daysLeft < 0 ? <span className="cal-expired-text">EXPIRED ({Math.abs(daysLeft)}d)</span> : `${daysLeft}d`}</td>
                  <td className="table-td-more">
                    <button 
                      className="row-more-button" 
                      type="button" 
                      onClick={() => setDetailsAsset(asset)} 
                      aria-label={`Open details for ${toolCode}`}
                      data-agent-id={`more-details-${toolCode}`}
                      data-agent-action="open-details"
                    >
                      ⋯
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {detailsAsset && (
        <div className="details-modal-backdrop" onClick={() => setDetailsAsset(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <div>
                <h3>{getBrand(detailsAsset)} {getModel(detailsAsset)}</h3>
                <p>{getToolCode(detailsAsset)} · standardized mock datasheet template</p>
              </div>
              <button 
                type="button" 
                className="details-close-button" 
                onClick={() => setDetailsAsset(null)}
                data-agent-id="close-details-btn"
                data-agent-action="close-details"
              >
                ×
              </button>
            </div>
            <SpecSummaryCard asset={detailsAsset} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
