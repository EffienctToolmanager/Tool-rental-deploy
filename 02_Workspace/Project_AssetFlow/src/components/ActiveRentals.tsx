import React, { useState } from 'react';
import { type Rental } from '../types';

interface ActiveRentalsProps {
  rentals: Rental[];
  onRefresh: () => void;
}

const ActiveRentals: React.FC<ActiveRentalsProps> = ({ rentals, onRefresh }) => {
  const [returnCaseId, setReturnCaseId] = useState<string | null>(null);
  const [returnPhoto, setReturnPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateRemainingDays = (returnDate: string) => {
    const today = new Date();
    const target = new Date(returnDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnCaseId || !returnPhoto) return;

    setIsSubmitting(true);
    const payload = new FormData();
    payload.append('returnPhoto', returnPhoto);

    try {
      const response = await fetch(`http://localhost:8000/api/return/${returnCaseId}`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error("Return failed");

      alert(`✅ Asset for ${returnCaseId} returned successfully!`);
      setReturnCaseId(null);
      setReturnPhoto(null);
      onRefresh(); // Refresh data
    } catch (error) {
      console.error("Error returning asset:", error);
      alert("Error processing return. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px' }}>Active Rentals Monitor</h2>
        <div className="f-badge f-badge-available">{rentals.length} Items Rented</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {rentals.map(rental => {
          // Backend uses Expected_Return_Date (PascalCase) or expectedReturn (CamelCase)? 
          // Let's check types.ts. In types.ts it was expectedReturn.
          // But Backend returns dict(row) from SQLite, so it's Expected_Return_Date.
          const expectedDate = (rental as any).Expected_Return_Date || (rental as any).expectedReturn;
          const daysLeft = calculateRemainingDays(expectedDate);
          const isOverdue = daysLeft < 0;
          const progress = Math.max(0, Math.min(100, (daysLeft / 30) * 100));

          return (
            <div 
              key={rental.caseId || (rental as any).Case_ID} 
              className="f-card" 
              style={{ 
                borderLeft: isOverdue ? '4px solid var(--f-error)' : '1px solid var(--f-border)',
                borderColor: isOverdue ? 'var(--f-error)' : 'var(--f-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--f-primary)' }}>
                  {rental.caseId || (rental as any).Case_ID}
                </span>
                {isOverdue && <span className="f-badge" style={{ background: 'var(--f-error)', color: 'white' }}>OVERDUE</span>}
              </div>

              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{(rental as any).model || (rental as any).Asset_Model}</h3>
              <p style={{ fontSize: '13px', color: 'var(--f-text-secondary)', marginBottom: '12px' }}>
                User: <strong>{(rental as any).User_Email || rental.user}</strong> • Code: {rental.assetCode || (rental as any).Asset_Code}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Time Remaining</span>
                  <span style={{ fontWeight: 'bold', color: isOverdue ? 'var(--f-error)' : 'inherit' }}>
                    {isOverdue ? `${Math.abs(daysLeft)} Days Past Due` : `${daysLeft} Days Left`}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${isOverdue ? 100 : progress}%`, 
                      height: '100%', 
                      background: isOverdue ? 'var(--f-error)' : 'var(--f-primary)',
                      transition: 'width 0.5s ease'
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="f-button" 
                  style={{ flex: 1, border: '1px solid var(--f-border)', background: 'white' }}
                >
                  🗓️ Extend
                </button>
                <button 
                  className="f-button" 
                  style={{ flex: 1, border: '1px solid var(--f-border)', background: 'white' }}
                  onClick={() => setReturnCaseId(rental.caseId || (rental as any).Case_ID)}
                >
                  ↩️ Return
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
          <div className="f-card" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Return Asset: {returnCaseId}</h3>
            <form onSubmit={handleReturn}>
              <div className="f-form-group">
                <label className="f-label">Return Photo (Asset Condition)</label>
                <input 
                  type="file" 
                  className="f-input" 
                  accept="image/*"
                  onChange={(e) => setReturnPhoto(e.target.files?.[0] || null)}
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="f-button" 
                  style={{ flex: 1, background: 'white', border: '1px solid var(--f-border)' }}
                  onClick={() => setReturnCaseId(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="f-button f-button-primary" 
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Return'}
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
