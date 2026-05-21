import React, { useState } from 'react';
import { type Rental } from '../types';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px' }}>Active Rentals Monitor</h2>
        <div className="f-badge f-badge-available">{Object.keys(groupedRentals).length} Active Cases ({filteredRentals.length} Items)</div>
      </div>

      {/* Premium Project View Filter Section */}
      <div className="f-card" style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>🔍 View Filter:</span>
            <input 
              type="text"
              placeholder="Search by project, case ID, renter..."
              className="f-input"
              style={{ width: '260px', height: '36px', fontSize: '13px', margin: 0 }}
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <button 
              className="f-button"
              type="button"
              style={{ 
                height: '32px', 
                fontSize: '12px', 
                padding: '0 14px',
                borderRadius: '16px',
                border: '1px solid #5B5FC7',
                backgroundColor: selectedProjectTab === 'All' ? '#5B5FC7' : 'transparent',
                color: selectedProjectTab === 'All' ? 'white' : '#5B5FC7',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedProjectTab('All')}
            >
              All Projects
            </button>
            {uniqueProjects.map(proj => (
              <button 
                key={proj}
                className="f-button"
                type="button"
                style={{ 
                  height: '32px', 
                  fontSize: '12px', 
                  padding: '0 14px',
                  borderRadius: '16px',
                  border: '1px solid #5B5FC7',
                  backgroundColor: selectedProjectTab === proj ? '#5B5FC7' : 'transparent',
                  color: selectedProjectTab === proj ? 'white' : '#5B5FC7',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedProjectTab(proj || '')}
              >
                {proj}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '20px' }}>
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
              className="f-card" 
              style={{ 
                borderTop: isOverdue ? '4px solid var(--f-error)' : '4px solid var(--f-primary)',
                padding: '20px'
              }}
            >
              {/* Case Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--f-border)', paddingBottom: '12px' }}>
                <div style={{ width: '100%' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#1e293b' }}>{caseId}</h3>
                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      <span>👤 Renter: <strong style={{ color: '#334155' }}>{userEmail}</strong></span>
                      <span>🔑 PM: <strong style={{ color: '#334155' }}>{pmEmail}</strong></span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                      <span>🏢 Project: <strong style={{ color: '#334155' }}>{projectName}</strong></span>
                    </div>
                  </div>
                </div>
                {isOverdue && <span className="f-badge" style={{ background: 'var(--f-error)', color: 'white', alignSelf: 'flex-start', marginLeft: '8px' }}>OVERDUE</span>}
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Return Date: {expectedDate}</span>
                  <span style={{ fontWeight: 'bold', color: isOverdue ? 'var(--f-error)' : '#3b82f6' }}>
                    {isOverdue ? `${Math.abs(daysLeft)} Days Past Due` : `${daysLeft} Days Left`}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${isOverdue ? 100 : progress}%`, 
                      height: '100%', 
                      background: isOverdue ? 'var(--f-error)' : '#3b82f6',
                    }} 
                  />
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rented Assets ({items.length})</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {items.map(item => (
                    <li key={item.assetCode} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #cbd5e1' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {item.assetCode}
                        {item.assetCode.startsWith('NON-INV-') && (
                          <span style={{ 
                            fontSize: '10px', 
                            backgroundColor: '#ffedd5', 
                            color: '#9a3412', 
                            border: '1px solid #fed7aa', 
                            padding: '2px 6px', 
                            borderRadius: '3px',
                            fontWeight: 'bold'
                          }}>
                            NON-INVENTORY
                          </span>
                        )}
                        <span style={{ color: '#64748b', fontWeight: 'normal' }}>- {(item as any).model || 'Unknown Model'}</span>
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
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
                          style={{ fontSize: '11px', padding: '4px 8px', background: 'white', border: '1px solid #3b82f6', borderRadius: '4px', cursor: 'pointer', color: '#3b82f6', fontWeight: '500' }}
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
                          style={{ fontSize: '11px', padding: '4px 8px', background: 'white', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', color: '#ef4444', fontWeight: '500' }}
                        >
                          Return
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Actions (Case Level) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="f-button" 
                  style={{ flex: 1, border: '1px solid #3b82f6', background: 'white', color: '#3b82f6', fontSize: '13px', fontWeight: '500' }}
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
                  className="f-button" 
                  style={{ flex: 1, background: '#10b981', color: 'white', fontSize: '13px', border: 'none', fontWeight: '500' }}
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
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="f-card" style={{ width: '550px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>
              ↩️ {assetsToReturn.length > 1 ? 'Bulk Return' : 'Partial Return'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Case ID: {returnCaseId}
            </p>
            
            <form onSubmit={handleReturn}>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                    <tr>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Asset Code</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Model</th>
                      <th style={{ padding: '10px', textAlign: 'left', width: '220px' }}>Return Photo (1:1 Required)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetsToReturn.map(item => (
                      <tr key={item.assetCode} style={{ borderBottom: '1px solid #cbd5e1' }}>
                        <td style={{ padding: '10px', fontWeight: '600' }}>
                          {item.assetCode}
                          {item.assetCode.startsWith('NON-INV-') && (
                            <div style={{ fontSize: '10px', color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '3px', display: 'inline-block', marginTop: '4px', fontWeight: 'bold' }}>
                              Non-Inventory
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '10px', color: '#475569' }}>{item.model}</td>
                        <td style={{ padding: '10px' }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            style={{ fontSize: '11px' }}
                            onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              setAssetsToReturn(prev => prev.map(a => 
                                a.assetCode === item.assetCode ? { ...a, photo: file } : a
                              ));
                            }}
                            required
                          />
                          {item.photo && (
                            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                              ✓ Ready
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="f-button" 
                  style={{ flex: 1, background: 'white', border: '1px solid var(--f-border)' }}
                  onClick={() => {
                    setReturnCaseId(null);
                    setAssetsToReturn([]);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="f-button f-button-primary" 
                  style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', height: '38px', fontSize: '14px', fontWeight: 'bold' }}
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
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="f-card" style={{ width: '580px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>
              🗓️ {assetsToExtend.length > 1 ? 'Bulk Extend Rental' : 'Partial Extend Rental'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Case ID: {extendCaseId}
            </p>

            <form onSubmit={handleExtend}>
              {/* Batch Date Setter for multiple items */}
              {assetsToExtend.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0369a1' }}>
                    ⚡ Batch New Return Date:
                  </span>
                  <input 
                    type="date"
                    className="f-input"
                    style={{ flex: 1, padding: '4px 8px', fontSize: '13px', height: '32px' }}
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

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                    <tr>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Asset Code</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Current Return</th>
                      <th style={{ padding: '10px', textAlign: 'left', width: '180px' }}>New Return Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetsToExtend.map(item => (
                      <tr key={item.assetCode} style={{ borderBottom: '1px solid #cbd5e1' }}>
                        <td style={{ padding: '10px', fontWeight: '600' }}>
                          {item.assetCode}
                          <div style={{ fontSize: '11px', fontWeight: 'normal', color: '#64748b' }}>{item.model}</div>
                        </td>
                        <td style={{ padding: '10px', color: '#ef4444', fontWeight: '500' }}>{item.currentReturnDate}</td>
                        <td style={{ padding: '10px' }}>
                          <input 
                            type="date" 
                            className="f-input"
                            style={{ height: '32px', padding: '4px', fontSize: '12px' }}
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

              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="f-button" 
                  style={{ flex: 1, background: 'white', border: '1px solid var(--f-border)' }}
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
                  className="f-button f-button-primary" 
                  style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', border: 'none', height: '38px', fontSize: '14px', fontWeight: 'bold' }}
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
