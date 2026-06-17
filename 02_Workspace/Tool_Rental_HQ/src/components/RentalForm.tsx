import React, { useState, useEffect } from 'react';
import { type Asset } from '../types';
import './RentalForm.css';

interface RentalFormProps {
  assets: Asset[];
  selectedToolCodes: string[];
  setSelectedToolCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onSuccess: () => void;
}

type CartItemType = {
  toolCode: string;
  toolModel: string;
  photo: File | null;
};

const RentalForm: React.FC<RentalFormProps> = ({ 
  assets, 
  selectedToolCodes, 
  setSelectedToolCodes, 
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

  // Synchronize local cart with global selectedToolCodes
  useEffect(() => {
    const currentCartCodes = cart.map(item => item.toolCode);
    
    // Items selected in global state but not in local cart
    const addedItems = selectedToolCodes
      .filter(code => !currentCartCodes.includes(code))
      .map(code => {
        const asset = assets.find(a => a.toolCode === code);
        return {
          toolCode: code,
          toolModel: asset ? asset.model : 'Unknown Model',
          photo: null
        };
      });

    // Items that exist in both global state and local cart (preserving file attachment state)
    const keptItems = cart.filter(item => selectedToolCodes.includes(item.toolCode));

    if (addedItems.length > 0 || keptItems.length !== cart.length) {
      setCart([...keptItems, ...addedItems]);
    }
  }, [selectedToolCodes, assets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter available assets based on search term (using serial number index)
  const filteredAssets = assets.filter(asset => 
    (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.brand && asset.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCheckboxChange = (asset: Asset, checked: boolean) => {
    if (checked) {
      setSelectedToolCodes(prev => [...prev, asset.toolCode]);
    } else {
      setSelectedToolCodes(prev => prev.filter(code => code !== asset.toolCode));
    }
  };

  const handleFileChangeForAsset = (toolCode: string, file: File | null) => {
    setCart(prev => prev.map(item => 
      item.toolCode === toolCode ? { ...item, photo: file } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("No assets selected in the cart. Please check assets to rent from the inventory list above.");
      return;
    }

    // Check if all selected items have a photo attached
    const missingPhotos = cart.filter(item => !item.photo);
    if (missingPhotos.length > 0) {
      const codes = missingPhotos.map(item => item.toolCode).join(', ');
      alert(`⚠️ The following assets are missing individual condition photos:\n${codes}\n\nPlease attach a 1:1 condition photo for all tools.`);
      return;
    }

    setIsSubmitting(true);

    // Generate Case ID: TR-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const caseId = `TR-${dateStr}-${randomSuffix}`;

    const mappedItems = cart.map(item => ({
      toolCode: item.toolCode,
      photoUrl: item.photo ? item.photo.name : 'Unknown'
    }));

    const payload = {
      caseId,
      items: mappedItems,
      projectName: formData.projectName,
      projectCode: formData.projectCode,
      returnDate: formData.expectedReturnDate,
      pmEmail: formData.pmEmail,
      userEmail: formData.userEmail
    };

    try {
      const response = await fetch("/api/sharepoint/rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      
      alert(`✅ Bulk rental request has been successfully submitted!\nCase ID: ${result.caseId}`);
      
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
      alert("An error occurred while processing your rental. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="f-card rental-form-container">
      <h2 className="rental-form-title">
        🛒 Smart Bulk Rental Checkout
      </h2>
      
      {/* SECTION 1: Catalog Selector */}
      <div className="catalog-selector-card">
        <div className="catalog-header">
          <h3 className="cart-title">
            1. Select Tools from Catalog ({assets.length} Available)
          </h3>
          <input 
            type="text"
            className="f-input catalog-search-input"
            placeholder="🔍 Search Serial or Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="catalog-table-wrapper">
          <table className="catalog-table">
            <thead className="catalog-table-thead">
              <tr>
                <th className="catalog-th-select">Select</th>
                <th className="catalog-th-left">Serial Number</th>
                <th className="catalog-th-left">Brand</th>
                <th className="catalog-th-left">Model</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map(asset => {
                  const isChecked = cart.some(item => item.toolCode === asset.toolCode);
                  return (
                    <tr 
                      key={asset.toolCode} 
                      className={`catalog-tr ${isChecked ? 'selected' : ''}`}
                    >
                      <td className="catalog-td-center">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          className="catalog-checkbox"
                          onChange={(e) => handleCheckboxChange(asset, e.target.checked)}
                        />
                      </td>
                      <td className="catalog-td-code">{asset.serialNumber || 'N/A'}</td>
                      <td className="catalog-td-brand">{asset.brand || 'N/A'}</td>
                      <td className="catalog-td-model">{asset.model}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="catalog-td-model" style={{ textAlign: 'center', padding: '16px' }}>
                    No matching available assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Dynamic Cart Table (Photo Upload) */}
      {cart.length > 0 && (
        <div className="cart-section">
          <h3 className="cart-title">
            📦 Selected Items & Condition Photos ({cart.length})
          </h3>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead className="cart-table-thead">
                <tr>
                  <th className="cart-th-code">Serial Number</th>
                  <th className="cart-th-model">Model</th>
                  <th className="cart-th-photo">Condition Photo (1:1 Required)</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => {
                  const asset = assets.find(a => a.toolCode === item.toolCode);
                  return (
                    <tr key={item.toolCode} className="cart-tr">
                      <td className="cart-td-code">{asset?.serialNumber || item.toolCode}</td>
                      <td className="cart-td-model">{item.toolModel}</td>
                      <td className="cart-td-photo">
                        <input 
                          type="file" 
                          accept="image/jpeg, image/png"
                          className="cart-file-input"
                          onChange={(e) => handleFileChangeForAsset(item.toolCode, e.target.files ? e.target.files[0] : null)}
                        />
                        {item.photo && (
                          <div className="cart-attached-indicator">
                            ✓ Attached: {item.photo.name}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: Project Form */}
      <form onSubmit={handleSubmit}>
        <h3 className="form-section-title">
          2. Project & Requester Details
        </h3>
        
        <div className="f-form-group">
          <label className="f-label" htmlFor="project-name">Project Name</label>
          <input 
            type="text" 
            name="projectName"
            id="project-name"
            className="f-input" 
            value={formData.projectName}
            onChange={handleInputChange}
            required 
            placeholder="e.g. Samsung Austin Semiconductor"
          />
        </div>

        <div className="form-row">
          <div className="f-form-group">
            <label className="f-label" htmlFor="project-code">Project Code</label>
            <input 
              type="text" 
              name="projectCode"
              id="project-code"
              className="f-input" 
              value={formData.projectCode}
              onChange={handleInputChange}
              required 
              placeholder="GE-XXXX"
            />
          </div>
          <div className="f-form-group">
            <label className="f-label" htmlFor="user-email">Requester Email</label>
            <input 
              type="email" 
              name="userEmail"
              id="user-email"
              className="f-input" 
              value={formData.userEmail}
              onChange={handleInputChange}
              required 
              placeholder="user@ge.com"
            />
          </div>
          <div className="f-form-group">
            <label className="f-label" htmlFor="pm-email">PM Email</label>
            <input 
              type="email" 
              name="pmEmail"
              id="pm-email"
              className="f-input" 
              value={formData.pmEmail}
              onChange={handleInputChange}
              required 
              placeholder="pm@ge.com"
            />
          </div>
        </div>

        <div className="f-form-group">
          <label className="f-label" htmlFor="expected-return-date">Expected Return Date</label>
          <input 
            type="date" 
            name="expectedReturnDate"
            id="expected-return-date"
            className="f-input" 
            value={formData.expectedReturnDate}
            onChange={handleInputChange}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="f-button f-button-primary rental-submit-btn" 
          disabled={isSubmitting || cart.length === 0}
        >
          {isSubmitting ? 'Processing Bulk Request...' : '🚀 Submit Bulk Rental Request'}
        </button>
      </form>
    </div>
  );
};

export default RentalForm;

