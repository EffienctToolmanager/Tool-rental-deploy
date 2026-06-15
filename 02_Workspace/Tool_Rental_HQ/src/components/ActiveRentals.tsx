import React, { useState } from 'react';
import { type Rental } from '../types';
import './ActiveRentals.css';

interface ActiveRentalsProps {
  rentals: Rental[];
  onRefresh: () => void;
}

type ReturnAssetItem = {
  assetCode: string;
  model: string;
  photo: File | null;
};

type ExtendAssetItem = {
  assetCode: string;
  model: string;
  currentReturnDate: string;
  newReturnDate: string;
};

const ActiveRentals: React.FC<ActiveRentalsProps> = ({ rentals, onRefresh }) => {
  // Return States
  const [returnCaseId, setReturnCaseId] = useState<string | null>(null);
  const [assetsToReturn, setAssetsToReturn] = useState<ReturnAssetItem[]>([]);
  
  // Extension States
  const [extendCaseId, setExtendCaseId] = useState<string | null>(null);
  const [assetsToExtend, setAssetsToExtend] = useState<ExtendAssetItem[]>([]);
  const [batchExtendDate, setBatchExtendDate] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectTab, setSelectedProjectTab] = useState('All');

  const calculateRemainingDays = (returnDate: string) => {
    const today = new Date();
    const target = new Date(returnDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnCaseId || assetsToReturn.length === 0) return;

    // Check if all selected items have a photo attached
    const missingPhotos = assetsToReturn.filter(item => !item.photo);
    if (missingPhotos.length > 0) {
      const codes = missingPhotos.map(item => item.assetCode).join(', ');
      alert(`⚠️ The following assets are missing individual return condition photos:\n${codes}\n\nPlease upload a 1:1 photo for all assets being returned.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 개별 장비별 반납 사진 업로드 API 호출
      for (const item of assetsToReturn) {
        if (item.photo) {
          const uploadPayload = new FormData();
          uploadPayload.append('file', item.photo);
          await fetch(`/api/sharepoint/upload?filename=${item.assetCode}_return.jpg`, {
            method: 'POST',
            body: uploadPayload
          });
        }
      }

      // 2. 백엔드 인메모리 DB 상태 원상 복귀(보관중 롤백) API 호출
      const returnResponse = await fetch('/api/sharepoint/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: returnCaseId,
          items: assetsToReturn.map(item => ({ equipmentCode: item.assetCode }))
        })
      });

      if (!returnResponse.ok) {
        throw new Error("Failed to process return on serverless database.");
      }

      alert(`✅ Return request and individual condition photo uploads for ${assetsToReturn.length} assets have been successfully processed in real-time!\n(Asset status has been instantly restored to 'Available'.)`);
      setReturnCaseId(null);
      setAssetsToReturn([]);
      onRefresh(); // Refresh data
    } catch (error) {
      console.error("Error returning asset:", error);
      alert("Error processing return. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendCaseId || assetsToExtend.length === 0) return;

    // Validate dates: newReturnDate must be after currentReturnDate
    const invalidDates = assetsToExtend.filter(item => {
      const curr = new Date(item.currentReturnDate);
      const next = new Date(item.newReturnDate);
      return next <= curr;
    });

    if (invalidDates.length > 0) {
      const codes = invalidDates.map(item => item.assetCode).join(', ');
      alert(`⚠️ The extension return date for the following assets is equal to or prior to the current return date:\n${codes}\n\nThe new expected return date must be after the current return date.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // API call to serverless backend to extend the rental period in real-time
      const extendResponse = await fetch('/api/sharepoint/extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: extendCaseId,
          items: assetsToExtend.map(item => ({
            equipmentCode: item.assetCode,
            newReturnDate: item.newReturnDate
          }))
        })
      });

      if (!extendResponse.ok) {
        throw new Error("Failed to process extension on serverless database.");
      }

      alert(`✅ The rental period for ${assetsToExtend.length} assets has been successfully extended!`);
      setExtendCaseId(null);
      setAssetsToExtend([]);
      setBatchExtendDate('');
      onRefresh(); // Refresh data
    } catch (error) {
      console.error("Error extending asset:", error);
      alert("Error processing extension. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique projects for quick filter pills
  const uniqueProjects = Array.from(new Set(rentals.map(r => r.projectName).filter(Boolean)));

  // Filter rentals by search keyword and selected project tab
  const filteredRentals = rentals.filter(rental => {
    const projName = rental.projectName || '';
    const caseId = rental.caseId || '';
    const userEmail = rental.userEmail || '';
    const matchesSearch = projName.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          caseId.toLowerCase().includes(projectSearch.toLowerCase()) ||
                          userEmail.toLowerCase().includes(projectSearch.toLowerCase());
    
    if (selectedProjectTab === 'All') return matchesSearch;
    return matchesSearch && projName === selectedProjectTab;
  });

  // Group filtered rentals by Case ID
  const groupedRentals = filteredRentals.reduce((acc, current) => {
    const caseId = current.caseId || (current as any).Case_ID || current.id || 'UNKNOWN-CASE';
    const key = caseId || 'UNKNOWN-CASE';
    if (!acc[key]) acc[key] = [];
    acc[key].push(current);
    return acc;
  }, {} as Record<string, Rental[]>);

  return (
    <div>
      <div className="active-rentals-header">
        <h2 className="active-rentals-title">Active Rentals Monitor</h2>
        <div className="f-badge f-badge-available">{Object.keys(groupedRentals).length} Active Cases ({filteredRentals.length} Items)</div>
      </div>

      {/* Premium Project View Filter Section */}
      <div className="f-card view-filter-card">
        <div className="view-filter-container">
          <div className="search-filter-wrapper">
            <span className="search-filter-label">🔍 View Filter:</span>
            <input 
              type="text"
              placeholder="Search by project, case ID, renter..."
              className="f-input search-filter-input"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>
          
          <div className="project-pills-wrapper">
            <button 
              className={`f-button project-pill ${selectedProjectTab === 'All' ? 'active' : ''}`}
              type="button"
              onClick={() => setSelectedProjectTab('All')}
            >
              All Projects
            </button>
            {uniqueProjects.map(proj => (
              <button 
                key={proj}
                className={`f-button project-pill ${selectedProjectTab === proj ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedProjectTab(proj || '')}
              >
                {proj}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rentals-grid">
        {Object.entries(groupedRentals).map(([caseId, items]) => {
          // Extract shared meta from the first item
          const firstItem = items[0];
          const expectedDate = (firstItem as any).expectedReturnDate || (firstItem as any).Expected_Return_Date || (firstItem as any).expectedReturn || '2026-05-30';
          const userEmail = (firstItem as any).userEmail || (firstItem as any).User_Email || (firstItem as any).user || 'Unknown Renter';
          const pmEmail = (firstItem as any).pmEmail || (firstItem as any).pm || 'Unknown PM';
          const projectName = firstItem.projectName || 'Unknown Project';

          const daysLeft = calculateRemainingDays(expectedDate);
          const isOverdue = daysLeft < 0;
          const progress = Math.max(0, Math.min(100, (daysLeft / 30) * 100));

          return (
            <div 
              key={caseId} 
              className={`f-card rental-case-card ${isOverdue ? 'overdue' : 'normal'}`}
            >
              {/* Case Header */}
              <div className="case-header">
                <div className="case-header-content">
                  <h3 className="case-title">{caseId}</h3>
                  <div className="case-meta">
                    <div className="case-meta-row">
                      <span>👤 Renter: <strong className="case-meta-value">{userEmail}</strong></span>
                      <span>🔑 PM: <strong className="case-meta-value">{pmEmail}</strong></span>
                    </div>
                    <div className="case-meta-row-sub">
                      <span>🏢 Project: <strong className="case-meta-value">{projectName}</strong></span>
                    </div>
                  </div>
                </div>
                {isOverdue && <span className="f-badge overdue-badge">OVERDUE</span>}
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>Return Date: {expectedDate}</span>
                  <span className={`progress-status ${isOverdue ? 'overdue' : 'normal'}`}>
                    {isOverdue ? `${Math.abs(daysLeft)} Days Past Due` : `${daysLeft} Days Left`}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className={`progress-bar-fill ${isOverdue ? 'overdue' : 'normal'}`}
                    style={{ width: `${isOverdue ? 100 : progress}%` }} 
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="assets-list-container">
                <h4 className="assets-list-title">Rented Assets ({items.length})</h4>
                <ul className="assets-list">
                  {items.map(item => (
                    <li key={item.assetCode} className="asset-item">
                      <span className="asset-info">
                        {item.assetCode} <span className="asset-info-model">- {(item as any).model || 'Unknown Model'}</span>
                      </span>
                      <div className="asset-item-actions">
                        <button 
                          type="button"
                          onClick={() => {
                            setExtendCaseId(caseId);
                            setAssetsToExtend([{
                              assetCode: item.assetCode,
                              model: (item as any).model || 'Unknown Model',
                              currentReturnDate: expectedDate,
                              newReturnDate: expectedDate
                            }]);
                          }}
                          className="btn-extend-item"
                        >
                          Extend
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setReturnCaseId(caseId);
                            setAssetsToReturn([{
                              assetCode: item.assetCode,
                              model: (item as any).model || 'Unknown Model',
                              photo: null
                            }]);
                          }}
                          className="btn-return-item"
                        >
                          Return
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Actions (Case Level) */}
              <div className="card-actions">
                <button 
                  className="f-button btn-extend-all" 
                  onClick={() => {
                    setExtendCaseId(caseId);
                    setAssetsToExtend(items.map(item => ({
                      assetCode: item.assetCode,
                      model: (item as any).model || 'Unknown Model',
                      currentReturnDate: expectedDate,
                      newReturnDate: expectedDate
                    })));
                  }}
                >
                  🗓️ Extend All
                </button>
                <button 
                  className="f-button btn-return-all" 
                  onClick={() => {
                    setReturnCaseId(caseId);
                    setAssetsToReturn(items.map(item => ({
                      assetCode: item.assetCode,
                      model: (item as any).model || 'Unknown Model',
                      photo: null
                    })));
                  }}
                >
                  ↩️ Return All
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Modal Overlay */}
      {returnCaseId && (
        <div className="modal-overlay">
          <div className="f-card modal-card">
            <h3 className="modal-title">
              ↩️ {assetsToReturn.length > 1 ? 'Bulk Return' : 'Partial Return'}
            </h3>
            <p className="modal-subtitle">
              Case ID: {returnCaseId}
            </p>
            
            <form onSubmit={handleReturn}>
              <div className="modal-table-wrapper">
                <table className="modal-table">
                  <thead className="modal-thead">
                    <tr>
                      <th className="modal-th">Asset Code</th>
                      <th className="modal-th">Model</th>
                      <th className="modal-th-photo">Return Photo (1:1 Required)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetsToReturn.map(item => (
                      <tr key={item.assetCode} className="modal-tr">
                        <td className="modal-td-code">{item.assetCode}</td>
                        <td className="modal-td-model">{item.model}</td>
                        <td className="modal-td">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="modal-file-input"
                            onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              setAssetsToReturn(prev => prev.map(a => 
                                a.assetCode === item.assetCode ? { ...a, photo: file } : a
                              ));
                            }}
                            required
                          />
                          {item.photo && (
                            <div className="modal-success-indicator">
                              ✓ Ready
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="f-button btn-modal-cancel" 
                  onClick={() => {
                    setReturnCaseId(null);
                    setAssetsToReturn([]);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="f-button f-button-primary btn-modal-confirm-return" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Return...' : `Confirm Return (${assetsToReturn.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Modal Overlay */}
      {extendCaseId && (
        <div className="modal-overlay">
          <div className="f-card modal-card-extend">
            <h3 className="modal-title">
              🗓️ {assetsToExtend.length > 1 ? 'Bulk Extend Rental' : 'Partial Extend Rental'}
            </h3>
            <p className="modal-subtitle">
              Case ID: {extendCaseId}
            </p>

            <form onSubmit={handleExtend}>
              {/* Batch Date Setter for multiple items */}
              {assetsToExtend.length > 1 && (
                <div className="batch-date-setter">
                  <span className="batch-date-setter-label">
                    ⚡ Batch New Return Date:
                  </span>
                  <input 
                    type="date"
                    className="f-input batch-date-input"
                    value={batchExtendDate}
                    onChange={(e) => {
                      const date = e.target.value;
                      setBatchExtendDate(date);
                      if (date) {
                        setAssetsToExtend(prev => prev.map(item => ({
                          ...item,
                          newReturnDate: date
                        })));
                      }
                    }}
                  />
                </div>
              )}

              <div className="modal-table-wrapper">
                <table className="modal-table">
                  <thead className="modal-thead">
                    <tr>
                      <th className="modal-th">Asset Code</th>
                      <th className="modal-th">Current Return</th>
                      <th className="modal-th-photo extend-table-th-new-date">New Return Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetsToExtend.map(item => (
                      <tr key={item.assetCode} className="modal-tr">
                        <td className="modal-td-code">
                          {item.assetCode}
                          <div className="extend-td-code-sub">{item.model}</div>
                        </td>
                        <td className="extend-td-current-date">{item.currentReturnDate}</td>
                        <td className="modal-td">
                          <input 
                            type="date" 
                            className="f-input extend-date-input"
                            value={item.newReturnDate}
                            min={item.currentReturnDate}
                            onChange={(e) => {
                              const date = e.target.value;
                              setAssetsToExtend(prev => prev.map(a => 
                                a.assetCode === item.assetCode ? { ...a, newReturnDate: date } : a
                              ));
                            }}
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="f-button btn-modal-cancel" 
                  onClick={() => {
                    setExtendCaseId(null);
                    setAssetsToExtend([]);
                    setBatchExtendDate('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="f-button f-button-primary btn-modal-confirm-extend" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Confirm Extension (${assetsToExtend.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRentals;
