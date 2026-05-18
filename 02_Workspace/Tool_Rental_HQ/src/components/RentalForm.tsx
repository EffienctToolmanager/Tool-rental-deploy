import React, { useState, useEffect } from 'react';
import { type Asset } from '../types';

interface RentalFormProps {
  assets: Asset[];
  selectedAssetCodes: string[];
  setSelectedAssetCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onSuccess: () => void;
}

type CartItemType = {
  assetCode: string;
  assetModel: string;
  photo: File | null;
};

const RentalForm: React.FC<RentalFormProps> = ({ 
  assets, 
  selectedAssetCodes, 
  setSelectedAssetCodes, 
  onSuccess 
}) => {
  // Catalog & Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cart & Project Form State
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    userEmail: '',
    pmEmail: '',
    expectedReturnDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize local cart with global selectedAssetCodes
  useEffect(() => {
    const currentCartCodes = cart.map(item => item.assetCode);
    
    // Items selected in global state but not in local cart
    const addedItems = selectedAssetCodes
      .filter(code => !currentCartCodes.includes(code))
      .map(code => {
        const asset = assets.find(a => a.assetCode === code);
        return {
          assetCode: code,
          assetModel: asset ? asset.model : 'Unknown Model',
          photo: null
        };
      });

    // Items that exist in both global state and local cart (preserving file attachment state)
    const keptItems = cart.filter(item => selectedAssetCodes.includes(item.assetCode));

    if (addedItems.length > 0 || keptItems.length !== cart.length) {
      setCart([...keptItems, ...addedItems]);
    }
  }, [selectedAssetCodes, assets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter available assets based on search term
  const filteredAssets = assets.filter(asset => 
    asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.brand && asset.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCheckboxChange = (asset: Asset, checked: boolean) => {
    if (checked) {
      setSelectedAssetCodes(prev => [...prev, asset.assetCode]);
    } else {
      setSelectedAssetCodes(prev => prev.filter(code => code !== asset.assetCode));
    }
  };

  const handleFileChangeForAsset = (assetCode: string, file: File | null) => {
    setCart(prev => prev.map(item => 
      item.assetCode === assetCode ? { ...item, photo: file } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("장바구니에 선택된 장비가 없습니다. 위 목록에서 대여할 장비를 체크해주세요.");
      return;
    }

    // Check if all selected items have a photo attached
    const missingPhotos = cart.filter(item => !item.photo);
    if (missingPhotos.length > 0) {
      const codes = missingPhotos.map(item => item.assetCode).join(', ');
      alert(`⚠️ 다음 장비의 개별 상태 사진이 누락되었습니다:\n${codes}\n\n모든 장비에 1:1 개별 사진을 첨부해 주세요.`);
      return;
    }

    setIsSubmitting(true);

    // Generate Case ID: TR-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const caseId = `TR-${dateStr}-${randomSuffix}`;

    const mappedItems = cart.map(item => ({
      equipmentCode: item.assetCode,
      photoUrl: item.photo ? item.photo.name : 'Unknown'
    }));

    const payload = {
      caseId,
      items: mappedItems,
      projectName: formData.projectName,
      returnDate: formData.expectedReturnDate,
      pmEmail: formData.pmEmail,
      userEmail: formData.userEmail
    };

    try {
      const response = await fetch("http://localhost:5000/api/sharepoint/rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      
      alert(`✅ 묶음 대여 신청이 성공적으로 완료되었습니다!\nCase ID: ${result.caseId}`);
      
      // Clear form & Cart
      setCart([]);
      setFormData({
        projectName: '',
        projectCode: '',
        userEmail: '',
        pmEmail: '',
        expectedReturnDate: '',
      });
      setSearchTerm('');
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting bulk rental:", error);
      alert("대여 처리 중 오류가 발생했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="f-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
        🛒 Smart Bulk Rental Checkout
      </h2>
      
      {/* SECTION 1: Catalog Selector */}
      <div style={{ marginBottom: '25px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>
            1. Select Tools from Catalog ({assets.length} Available)
          </h3>
          <input 
            type="text"
            className="f-input"
            style={{ width: '220px', height: '32px', fontSize: '13px', margin: 0 }}
            placeholder="🔍 Search Code or Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', zIndex: 1 }}>
              <tr>
                <th style={{ width: '40px', padding: '8px', textAlign: 'center' }}>Select</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Asset Code</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Brand</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Model</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map(asset => {
                  const isChecked = cart.some(item => item.assetCode === asset.assetCode);
                  return (
                    <tr 
                      key={asset.assetCode} 
                      style={{ 
                        borderBottom: '1px solid #e2e8f0', 
                        backgroundColor: isChecked ? '#eff6ff' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          onChange={(e) => handleCheckboxChange(asset, e.target.checked)}
                        />
                      </td>
                      <td style={{ padding: '8px', fontWeight: '600' }}>{asset.assetCode}</td>
                      <td style={{ padding: '8px' }}>{asset.brand || 'N/A'}</td>
                      <td style={{ padding: '8px', color: '#475569' }}>{asset.model}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                    일치하는 보관 중인 장비가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Dynamic Cart Table (Photo Upload) */}
      {cart.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '10px' }}>
            📦 Selected Items & Condition Photos ({cart.length})
          </h3>
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left', width: '120px' }}>Asset Code</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Model</th>
                  <th style={{ padding: '10px', textAlign: 'left', width: '300px' }}>Condition Photo (1:1 Required)</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.assetCode} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{item.assetCode}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{item.assetModel}</td>
                    <td style={{ padding: '10px' }}>
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png"
                        style={{ fontSize: '12px' }}
                        onChange={(e) => handleFileChangeForAsset(item.assetCode, e.target.files ? e.target.files[0] : null)}
                      />
                      {item.photo && (
                        <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                          ✓ Attached: {item.photo.name}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Project Form */}
      <form onSubmit={handleSubmit}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          2. Project & Requester Details
        </h3>
        
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
            <label className="f-label">Requester Email</label>
            <input 
              type="email" 
              name="userEmail"
              className="f-input" 
              value={formData.userEmail}
              onChange={handleInputChange}
              required 
              placeholder="user@ge.com"
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

        <button 
          type="submit" 
          className="f-button f-button-primary" 
          style={{ width: '100%', marginTop: '20px', height: '48px', fontSize: '15px', fontWeight: 'bold', backgroundColor: '#3b82f6' }}
          disabled={isSubmitting || cart.length === 0}
        >
          {isSubmitting ? 'Processing Bulk Request...' : '🚀 Submit Bulk Rental Request'}
        </button>
      </form>
    </div>
  );
};

export default RentalForm;
