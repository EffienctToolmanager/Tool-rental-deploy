import React, { useState } from 'react';
import { type Asset } from '../types';
import { getGraphToken } from '../utils/graph';

interface RentalFormProps {
  assets: Asset[];
  onSuccess: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({ assets, onSuccess }) => {
  const [selectedAssetCode, setSelectedAssetCode] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    userEmail: 'current.user@ge.com', // Simulate current user
    pmEmail: '',
    expectedReturnDate: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAsset = assets.find(a => a.assetCode === selectedAssetCode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetCode || !photo) {
      alert('Please select an asset and upload a photo.');
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append('assetCode', selectedAssetCode);
    payload.append('projectName', formData.projectName);
    payload.append('projectCode', formData.projectCode);
    payload.append('userEmail', formData.userEmail);
    payload.append('pmEmail', formData.pmEmail);
    payload.append('expectedReturnDate', formData.expectedReturnDate);
    payload.append('conditionPhoto', photo);

    try {
      // Stage 5: Acquire Graph API token for cloud upload
      const token = await getGraphToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:8000/api/rent", {
        method: "POST",
        body: payload,
        headers: headers,
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      alert(`✅ Rental request submitted! Case ID: ${result.case_id}`);
      
      // Clear form
      setSelectedAssetCode('');
      setFormData({
        projectName: '',
        projectCode: '',
        userEmail: 'current.user@ge.com',
        pmEmail: '',
        expectedReturnDate: '',
      });
      setPhoto(null);
      
      onSuccess(); // Trigger parent refresh
    } catch (error) {
      console.error("Error submitting rental:", error);
      alert("Error submitting rental. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="f-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Smart Rental Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="f-form-group">
          <label className="f-label">Asset Code</label>
          <select 
            className="f-select" 
            value={selectedAssetCode} 
            onChange={(e) => setSelectedAssetCode(e.target.value)}
            required
          >
            <option value="">Select an asset...</option>
            {assets.map(asset => (
              <option key={asset.assetCode} value={asset.assetCode}>
                {asset.assetCode} - {asset.brand} {asset.model}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="f-form-group">
            <label className="f-label">Asset Model</label>
            <input 
              type="text" 
              className="f-input" 
              value={selectedAsset?.model || ''} 
              disabled 
              placeholder="Auto-filled"
            />
          </div>
          <div className="f-form-group">
            <label className="f-label">Calibration Date</label>
            <input 
              type="text" 
              className="f-input" 
              value={selectedAsset?.calDate || ''} 
              disabled 
              placeholder="Auto-filled"
            />
          </div>
        </div>

        <div className="f-form-group">
          <label className="f-label">Project Name</label>
          <input 
            type="text" 
            name="projectName"
            className="f-input" 
            value={formData.projectName}
            onChange={handleInputChange}
            required 
            placeholder="e.g. Samsung Austin Semiconductor"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="f-form-group">
            <label className="f-label">Project Code</label>
            <input 
              type="text" 
              name="projectCode"
              className="f-input" 
              value={formData.projectCode}
              onChange={handleInputChange}
              required 
              placeholder="GE-XXXX"
            />
          </div>
          <div className="f-form-group">
            <label className="f-label">PM Email</label>
            <input 
              type="email" 
              name="pmEmail"
              className="f-input" 
              value={formData.pmEmail}
              onChange={handleInputChange}
              required 
              placeholder="pm@ge.com"
            />
          </div>
        </div>

        <div className="f-form-group">
          <label className="f-label">Expected Return Date</label>
          <input 
            type="date" 
            name="expectedReturnDate"
            className="f-input" 
            value={formData.expectedReturnDate}
            onChange={handleInputChange}
            required 
          />
        </div>

        <div className="f-form-group">
          <label className="f-label">Condition Photo (Current State)</label>
          <input 
            type="file" 
            className="f-input" 
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="f-button f-button-primary" 
          style={{ width: '100%', marginTop: '12px', height: '40px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : '🚀 Submit Rental Request'}
        </button>
      </form>
    </div>
  );
};

export default RentalForm;
