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
      alert(`⚠️ 다음 반납 장비의 개별 상태 사진이 누락되었습니다:\n${codes}\n\n모든 반납 장비에 1:1 사진을 첨부해 주세요.`);
      return;
    }

    setIsSubmitting(true);
    const payload = new FormData();
    assetsToReturn.forEach(item => {
      if (item.photo) {
        payload.append('photos', item.photo, item.assetCode);
      }
    });

    try {
      // Mock backend processing
      await new Promise(resolve => setTimeout(resolve, 800));

      alert(`✅ ${assetsToReturn.length}개 장비의 반납 신청이 성공적으로 완료되었습니다!`);
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
      alert(`⚠️ 다음 장비의 연장 반납일이 현재 반납일보다 같거나 이전입니다:\n${codes}\n\n새 반납 예정일은 현재 반납일 이후여야 합니다.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock backend processing to simulate extension
      await new Promise(resolve => setTimeout(resolve, 800));

      alert(`✅ ${assetsToExtend.length}개 장비의 대여 기간이 성공적으로 연장되었습니다!`);
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

  // Group rentals by Case ID
  const groupedRentals = rentals.reduce((acc, current) => {
    const caseId = current.caseId || (current as any).Case_ID || current.id || 'UNKNOWN-CASE';
    const key = caseId || 'UNKNOWN-CASE';
    if (!acc[key]) acc[key] = [];
    acc[key].push(current);
    return acc;
  }, {} as Record<string, Rental[]>);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px' }}>Active Rentals Monitor</h2>
        <div className="f-badge f-badge-available">{Object.keys(groupedRentals).length} Active Cases ({rentals.length} Items)</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {Object.entries(groupedRentals).map(([caseId, items]) => {
          // Extract shared meta from the first item
          const firstItem = items[0];
          const expectedDate = (firstItem as any).expectedReturnDate || (firstItem as any).Expected_Return_Date || (firstItem as any).expectedReturn || '2026-05-30';
          const userEmail = (firstItem as any).userEmail || (firstItem as any).User_Email || firstItem.user || 'Unknown User';
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
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1e293b' }}>{caseId}</h3>
                  <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '12px' }}>
                    <span>👤 {userEmail}</span>
                    <span>🏢 {projectName}</span>
                  </div>
                </div>
                {isOverdue && <span className="f-badge" style={{ background: 'var(--f-error)', color: 'white', alignSelf: 'flex-start' }}>OVERDUE</span>}
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
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>
                        {item.assetCode} <span style={{ color: '#64748b', fontWeight: 'normal' }}>- {(item as any).model || 'Unknown Model'}</span>
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
                        <td style={{ padding: '10px', fontWeight: '600' }}>{item.assetCode}</td>
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
                    ⚡ 일괄 신규 반납일 지정:
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
