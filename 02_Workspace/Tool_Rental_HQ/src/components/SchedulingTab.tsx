import React, { useState, useEffect } from 'react';
import { type Asset, type ScheduledCase } from '../types';
import './SchedulingTab.css';

interface SchedulingTabProps {
  assets: Asset[];
  isAdmin: boolean;
  onRefreshAssets: () => void;
}

const API_BASE = "/api/sharepoint/schedule";

export const SchedulingTab: React.FC<SchedulingTabProps> = ({ assets, isAdmin, onRefreshAssets }) => {
  const [schedules, setSchedules] = useState<ScheduledCase[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ScheduledCase | null>(null);

  // Form states
  const [formSelectedAssets, setFormSelectedAssets] = useState<string[]>([]);
  const [formProjectCode, setFormProjectCode] = useState('');
  const [relaySteps, setRelaySteps] = useState<Array<{
    stage: 'active_rental' | 'calibration' | 'ongoing';
    destination: string;
    startDate: string;
    endDate: string;
  }>>([
    { stage: 'active_rental', destination: '', startDate: '', endDate: '' }
  ]);

  const [formEquipmentCode, setFormEquipmentCode] = useState('');
  const [formStage, setFormStage] = useState<'active_rental' | 'calibration' | 'ongoing'>('active_rental');
  const [formDestination, setFormDestination] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formPmEmail, setFormPmEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState<'Scheduled' | 'In_Progress' | 'Completed' | 'Delayed'>('Scheduled');
  const [formHandoverPic, setFormHandoverPic] = useState('');
  const [formHandoverPhoto, setFormHandoverPhoto] = useState('');
  const [formChecklistVerified, setFormChecklistVerified] = useState(false);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/list`);
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const dataObj = await res.json();
      setSchedules(dataObj.data || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openCreateModal = () => {
    if (!isAdmin) return;
    setEditingCase(null);
    setFormSelectedAssets([]);
    setFormProjectCode('');
    setFormDestination('');
    setFormStartDate('');
    setFormEndDate('');
    setFormUserEmail('');
    setFormPmEmail('');
    setFormNotes('');
    setFormStatus('Scheduled');
    setFormHandoverPic('');
    setFormHandoverPhoto('');
    setFormChecklistVerified(false);
    setRelaySteps([
      { stage: 'active_rental', destination: '', startDate: '', endDate: '' }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (sc: ScheduledCase) => {
    if (!isAdmin) return;
    setEditingCase(sc);
    setFormEquipmentCode(sc.equipmentCode);
    setFormStage(sc.stage);
    setFormDestination(sc.destination);
    setFormProjectCode(sc.projectCode || '');
    setFormStartDate(sc.startDate);
    setFormEndDate(sc.endDate);
    setFormUserEmail(sc.userEmail);
    setFormPmEmail(sc.pmEmail);
    setFormNotes(sc.notes || '');
    setFormStatus(sc.status);
    setFormHandoverPic(sc.handoverPic || '');
    setFormHandoverPhoto(sc.handoverPhoto || '');
    setFormChecklistVerified(sc.checklistVerified || false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingCase) {
      const selectedAsset = assets.find(a => a.assetCode === formEquipmentCode);
      const model = selectedAsset ? selectedAsset.model : 'Unknown';

      const payload = {
        id: editingCase.id,
        equipmentCode: formEquipmentCode,
        model,
        sequenceOrder: editingCase.sequenceOrder,
        stage: formStage,
        destination: formDestination,
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        userEmail: formUserEmail,
        pmEmail: formPmEmail,
        notes: formNotes,
        projectCode: formProjectCode,
        handoverPic: (formStage === 'active_rental' || formStage === 'calibration') ? formHandoverPic : undefined,
        handoverPhoto: (formStage === 'active_rental' || formStage === 'calibration') ? formHandoverPhoto : undefined,
        checklistVerified: (formStage === 'active_rental' || formStage === 'calibration') ? formChecklistVerified : undefined
      };

      try {
        const res = await fetch(`${API_BASE}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to save schedule");
        
        handleCloseModal();
        await fetchSchedules();
        onRefreshAssets(); // refresh main items
      } catch (err) {
        console.error(err);
        alert("Error saving schedule case.");
      }
    } else {
      if (formSelectedAssets.length === 0) {
        alert("Please select at least one tool.");
        return;
      }
      if (relaySteps.length === 0) {
        alert("Please add at least one relay step.");
        return;
      }

      const payloads: any[] = [];
      const timestamp = Date.now().toString().slice(-4);
      
      formSelectedAssets.forEach((assetCode, assetIdx) => {
        const selectedAsset = assets.find(a => a.assetCode === assetCode);
        const model = selectedAsset ? selectedAsset.model : 'Unknown';
        
        relaySteps.forEach((step, stepIdx) => {
          const cleanedAsset = assetCode.replace(/[^a-zA-Z0-9]/g, '');
          const id = `SCH-2026-${timestamp}-${assetIdx}-${stepIdx}-${cleanedAsset}`;
          payloads.push({
            id,
            equipmentCode: assetCode,
            model,
            sequenceOrder: stepIdx,
            stage: step.stage,
            destination: step.destination,
            startDate: step.startDate,
            endDate: step.endDate,
            status: 'Scheduled',
            userEmail: formUserEmail,
            pmEmail: formPmEmail,
            notes: formNotes,
            projectCode: formProjectCode,
            handoverPic: undefined,
            handoverPhoto: undefined,
            checklistVerified: undefined
          });
        });
      });

      try {
        const res = await fetch(`${API_BASE}/create-bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloads)
        });
        if (!res.ok) throw new Error("Failed to save schedules");
        
        handleCloseModal();
        await fetchSchedules();
        onRefreshAssets(); // refresh main items
      } catch (err) {
        console.error(err);
        alert("Error saving schedule cases.");
      }
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!isAdmin) return;
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const res = await fetch(`${API_BASE}/delete/${caseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete schedule");
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error deleting scheduled case.");
    }
  };

  const handleMoveStage = async (sc: ScheduledCase, nextStage: 'active_rental' | 'calibration' | 'ongoing') => {
    if (!isAdmin) return;
    
    if (nextStage === 'ongoing') {
      const payload: ScheduledCase = {
        ...sc,
        stage: 'ongoing',
        handoverPic: undefined,
        handoverPhoto: undefined,
        checklistVerified: undefined
      };
      
      try {
        const res = await fetch(`${API_BASE}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to update card stage");
        await fetchSchedules();
        onRefreshAssets();
      } catch (err) {
        console.error(err);
        alert("Failed to update card stage.");
      }
    } else {
      // Open edit modal with target stage to enforce entering checkout photo/checklist details
      setEditingCase(sc);
      setFormEquipmentCode(sc.equipmentCode);
      setFormStage(nextStage);
      setFormDestination(sc.destination);
      setFormProjectCode(sc.projectCode || '');
      setFormStartDate(sc.startDate);
      setFormEndDate(sc.endDate);
      setFormUserEmail(sc.userEmail);
      setFormPmEmail(sc.pmEmail);
      setFormNotes(sc.notes || '');
      setFormStatus(sc.status);
      setFormHandoverPic(sc.handoverPic || '');
      setFormHandoverPhoto(sc.handoverPhoto || '');
      setFormChecklistVerified(sc.checklistVerified || false);
      setIsModalOpen(true);
    }
  };

  // Conflict detection check (two schedules for same asset overlap)
  const isConflict = (sc: ScheduledCase) => {
    return schedules.some(other => {
      if (other.id === sc.id || other.equipmentCode !== sc.equipmentCode) return false;
      const startA = new Date(sc.startDate).getTime();
      const endA = new Date(sc.endDate).getTime();
      const startB = new Date(other.startDate).getTime();
      const endB = new Date(other.endDate).getTime();
      return startA <= endB && startB <= endA;
    });
  };

  // Kanban view helper columns
  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'active_rental': return '📢 Active';
      case 'calibration': return '🔬 Calibration';
      case 'ongoing': return '🚚 On Going';
      default: return stage;
    }
  };

  const renderKanban = () => {
    const columns: ('active_rental' | 'calibration' | 'ongoing')[] = 
      ['active_rental', 'calibration', 'ongoing'];

    return (
      <div className="kanban-board">
        {columns.map(col => {
          const colSchedules = schedules.filter(s => s.stage === col);
          return (
            <div key={col} className="kanban-column">
              <div className="kanban-column-header">
                <h3>{getStageTitle(col)}</h3>
                <span className="kanban-count-badge">{colSchedules.length}</span>
              </div>
              <div 
                className="kanban-column-body"
                onDragOver={(e) => {
                  if (isAdmin) {
                    e.preventDefault();
                    e.currentTarget.classList.add("drag-over");
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("drag-over");
                }}
                onDrop={(e) => {
                  if (isAdmin) {
                    e.preventDefault();
                    e.currentTarget.classList.remove("drag-over");
                    const cardId = e.dataTransfer.getData("text/plain");
                    const card = schedules.find(s => s.id === cardId);
                    if (card && card.stage !== col) {
                      handleMoveStage(card, col);
                    }
                  }
                }}
              >
                {colSchedules.length > 0 ? (
                  colSchedules.map(sc => {
                    const hasConflict = isConflict(sc);
                    return (
                      <div 
                        key={sc.id} 
                        draggable={isAdmin}
                        onDragStart={(e) => {
                          if (isAdmin) {
                            e.dataTransfer.setData("text/plain", sc.id);
                            e.currentTarget.classList.add("dragging");
                          }
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.classList.remove("dragging");
                        }}
                        className={`kanban-card ${sc.status.toLowerCase()} ${hasConflict ? 'conflict-warning' : ''}`}
                      >
                        <div className="card-top">
                          <span className="card-id">{sc.id}</span>
                          {hasConflict && <span className="warning-pill">⚠️ Overlap</span>}
                          {isAdmin && (
                            <div className="card-edit-actions">
                              <button onClick={() => openEditModal(sc)} title="Edit">✏️</button>
                              <button onClick={() => handleDelete(sc.id)} title="Delete">🗑️</button>
                            </div>
                          )}
                        </div>
                        <h4 className="card-title">{sc.model} ({sc.equipmentCode})</h4>
                        <div className="card-meta">
                          {sc.projectCode && <div>🏷️ <strong>Project Code:</strong> {sc.projectCode}</div>}
                          <div>📍 <strong>Destination:</strong> {sc.destination}</div>
                          <div>📅 <strong>Schedule:</strong> {sc.startDate} to {sc.endDate}</div>
                          <div>👤 {sc.userEmail}</div>
                        </div>
                        {sc.notes && <div className="card-notes">{sc.notes}</div>}

                        {(sc.handoverPic || sc.handoverPhoto || sc.checklistVerified) && (
                          <div className="card-handover-info" style={{ marginTop: '8px', padding: '6px', backgroundColor: 'var(--f-bg-secondary)', borderRadius: '4px', border: '1px solid var(--f-border)', fontSize: '11px' }}>
                            {sc.handoverPic && <div style={{ color: 'var(--f-text-primary)' }}>👤 <strong>PIC:</strong> {sc.handoverPic}</div>}
                            {sc.handoverPhoto && <div style={{ color: 'var(--f-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>📷 <strong>Photo:</strong> <span style={{ textDecoration: 'underline', color: 'var(--f-link)', cursor: 'pointer' }}>{sc.handoverPhoto}</span></div>}
                            {sc.checklistVerified && <div style={{ color: 'var(--f-success)', fontWeight: '600', marginTop: '2px' }}>✅ Checklist Verified</div>}
                          </div>
                        )}
                        
                        {isAdmin && (
                          <div className="card-stage-selectors">
                            <label>Move to: </label>
                            <select 
                              value={sc.stage} 
                              onChange={(e) => handleMoveStage(sc, e.target.value as any)}
                              className="f-input-small"
                            >
                              <option value="active_rental">Active</option>
                              <option value="calibration">Calibration</option>
                              <option value="ongoing">On Going</option>
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-column-placeholder">No items in this stage.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGantt = () => {
    // Generate dates for July 2026 (visualized Gantt Timeline)
    const year = 2026;
    const monthIdx = 6; // July is 6th index
    const daysInMonth = 31;
    const datesArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Group schedules by equipment code
    const uniqueAssets = Array.from(new Set(schedules.map(s => s.equipmentCode)));

    return (
      <div className="gantt-container f-card">
        <div className="gantt-timeline-header">
          <div className="gantt-asset-col-header">Instrument / Asset</div>
          <div className="gantt-days-scroll-wrapper">
            <div className="gantt-days-header-grid">
              {datesArray.map(d => (
                <div key={d} className="gantt-day-header-cell">
                  <div className="day-number">{d}</div>
                  <div className="day-month-short">Jul</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gantt-timeline-rows">
          {uniqueAssets.length > 0 ? (
            uniqueAssets.map(code => {
              const assetSchedules = schedules.filter(s => s.equipmentCode === code);
              const assetModel = assetSchedules[0]?.model || 'Unknown';
              return (
                <div key={code} className="gantt-row">
                  <div className="gantt-asset-col">
                    <div className="asset-title">{assetModel}</div>
                    <div className="asset-sub">{code}</div>
                  </div>
                  <div className="gantt-days-scroll-wrapper">
                    <div className="gantt-days-row-grid">
                      {datesArray.map(d => (
                        <div key={d} className="gantt-bg-cell" />
                      ))}
                      {/* Render scheduled block overlays */}
                      {assetSchedules.map(sc => {
                        const start = new Date(sc.startDate);
                        const end = new Date(sc.endDate);
                        
                        // Calculate Jul 2026 offsets
                        let startDay = start.getFullYear() === year && start.getMonth() === monthIdx ? start.getDate() : 1;
                        let endDay = end.getFullYear() === year && end.getMonth() === monthIdx ? end.getDate() : 31;
                        
                        // Prevent out of bounds July
                        if (start.getFullYear() < year || (start.getFullYear() === year && start.getMonth() < monthIdx)) startDay = 1;
                        if (end.getFullYear() > year || (end.getFullYear() === year && end.getMonth() > monthIdx)) endDay = 31;

                        const duration = endDay - startDay + 1;
                        const colStart = startDay;
                        const colSpan = duration;

                        const hasConflict = isConflict(sc);

                        return (
                          <div 
                            key={sc.id} 
                            onClick={() => openEditModal(sc)}
                            className={`gantt-schedule-bar ${sc.stage} ${hasConflict ? 'bar-conflict' : ''}`}
                            style={{
                              gridColumnStart: colStart,
                              gridColumnEnd: `span ${colSpan}`
                            }}
                            title={`${sc.id}: ${sc.destination} (${sc.startDate} to ${sc.endDate})`}
                          >
                            <span className="bar-label">{sc.destination}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--f-text-secondary)' }}>
              No active schedules registered. Click "Add Schedule Case" to create one.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="scheduling-tab-container f-fade-in">
      <div className="tab-control-header">
        <div className="tab-title-section">
          <h2>🗓️ Successive Tool scheduling & Routing</h2>
          <p className="tab-description">
            Schedule successive handovers, routing to calibration, and staging for future project sites.
          </p>
        </div>

        <div className="tab-actions">
          <div className="view-mode-toggles">
            <button 
              className={`f-button ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              📋 Kanban Board
            </button>
            <button 
              className={`f-button ${viewMode === 'gantt' ? 'active' : ''}`}
              onClick={() => setViewMode('gantt')}
            >
              📅 Gantt Timeline
            </button>
          </div>
          {isAdmin && (
            <button 
              onClick={openCreateModal}
              className="f-button f-button-primary btn-add-schedule"
            >
              ➕ Add Schedule Case
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading tool schedules...</div>
      ) : (
        viewMode === 'kanban' ? renderKanban() : renderGantt()
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="f-card modal-content">
            <div className="modal-header">
              <h3>{editingCase ? '✏️ Edit Scheduling Case' : '➕ Register New Scheduling Case'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-scrollable-body">
                {editingCase ? (
                  // EDIT MODE
                  <>
                    <div className="f-form-group">
                      <label className="f-label">Select Equipment</label>
                      <select 
                        className="f-input"
                        value={formEquipmentCode} 
                        onChange={(e) => setFormEquipmentCode(e.target.value)}
                        required
                      >
                        {assets.map(a => (
                          <option key={a.assetCode} value={a.assetCode}>
                            {a.model} - {a.assetCode} ({a.serialNumber})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Pipeline Stage</label>
                        <select 
                          className="f-input"
                          value={formStage} 
                          onChange={(e) => setFormStage(e.target.value as any)}
                        >
                          <option value="active_rental">Active Rental</option>
                          <option value="calibration">Calibration Lab</option>
                          <option value="ongoing">On Going</option>
                        </select>
                      </div>
                      
                      <div className="f-form-group">
                        <label className="f-label">Case Status</label>
                        <select 
                          className="f-input"
                          value={formStatus} 
                          onChange={(e) => setFormStatus(e.target.value as any)}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="In_Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Delayed">Delayed</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Destination (Project/Lab)</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formDestination}
                          onChange={(e) => setFormDestination(e.target.value)}
                          required
                          placeholder="e.g. Samsung Austin Site or Fluke Cal Yard"
                        />
                      </div>
                      <div className="f-form-group">
                        <label className="f-label">Project Code</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formProjectCode}
                          onChange={(e) => setFormProjectCode(e.target.value)}
                          placeholder="e.g. SEC-A1"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Start Date</label>
                        <input 
                          type="date" 
                          className="f-input"
                          value={formStartDate}
                          onChange={(e) => setFormStartDate(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="f-form-group">
                        <label className="f-label">End Date</label>
                        <input 
                          type="date" 
                          className="f-input"
                          value={formEndDate}
                          onChange={(e) => setFormEndDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Renter / Lab Specialist Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formUserEmail}
                          onChange={(e) => setFormUserEmail(e.target.value)}
                          required
                          placeholder="user@ge.com"
                        />
                      </div>
                      
                      <div className="f-form-group">
                        <label className="f-label">Approver PM Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formPmEmail}
                          onChange={(e) => setFormPmEmail(e.target.value)}
                          required
                          placeholder="pm@ge.com"
                        />
                      </div>
                    </div>

                    {/* Handover / Calibration Data Enforcement Section */}
                    {(formStage === 'active_rental' || formStage === 'calibration') && (
                      <div className="handover-enforcement-section f-card" style={{ padding: '12px', marginBottom: '15px', backgroundColor: 'var(--f-bg-secondary)', border: '1px solid var(--f-border)', borderRadius: '4px' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--f-text-primary)', fontWeight: 600 }}>
                          📋 {formStage === 'calibration' ? 'Calibration Record' : 'Handover Record'} Required Fields
                        </h4>
                        <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <div className="f-form-group" style={{ flex: 1 }}>
                            <label className="f-label" style={{ fontSize: '11px', color: 'var(--f-text-secondary)' }}>{formStage === 'calibration' ? 'Calibration Specialist' : 'Handover PIC Name'}</label>
                            <input 
                              type="text" 
                              className="f-input"
                              value={formHandoverPic}
                              onChange={(e) => setFormHandoverPic(e.target.value)}
                              required
                              placeholder="e.g. John Doe"
                            />
                          </div>
                          <div className="f-form-group" style={{ flex: 1 }}>
                            <label className="f-label" style={{ fontSize: '11px', color: 'var(--f-text-secondary)' }}>{formStage === 'calibration' ? 'Certificate Photo / ID' : 'Handover Photo File/Path'}</label>
                            <input 
                              type="text" 
                              className="f-input"
                              value={formHandoverPhoto}
                              onChange={(e) => setFormHandoverPhoto(e.target.value)}
                              required
                              placeholder="e.g. inspection-photo-01.png"
                            />
                          </div>
                        </div>
                        <div className="f-form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                          <input 
                            type="checkbox"
                            id="checklistVerified"
                            checked={formChecklistVerified}
                            onChange={(e) => setFormChecklistVerified(e.target.checked)}
                            required
                            style={{ cursor: 'pointer' }}
                          />
                          <label htmlFor="checklistVerified" className="f-label" style={{ margin: 0, cursor: 'pointer', fontSize: '11px', color: 'var(--f-text-primary)' }}>
                            {formStage === 'calibration' 
                              ? 'Confirm calibration standard verified & sticker attached' 
                              : 'Confirm physical inspection complete & safety checklist verified'}
                          </label>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // CREATE MODE
                  <>
                    <div className="f-form-group">
                      <label className="f-label">Select Equipment (Select Multiple)</label>
                      <div className="asset-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--f-border)', padding: '8px', borderRadius: '4px' }}>
                        {assets.map(a => {
                          const isChecked = formSelectedAssets.includes(a.assetCode);
                          return (
                            <label key={a.assetCode} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: 'var(--f-text-primary)' }}>
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormSelectedAssets([...formSelectedAssets, a.assetCode]);
                                  } else {
                                    setFormSelectedAssets(formSelectedAssets.filter(code => code !== a.assetCode));
                                  }
                                }}
                              />
                              <span>{a.model} - {a.assetCode}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">Project Name</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formDestination}
                          onChange={(e) => {
                            setFormDestination(e.target.value);
                            // Auto-populate first step destination if empty
                            if (relaySteps.length === 1 && relaySteps[0].destination === '') {
                              const updated = [...relaySteps];
                              updated[0].destination = e.target.value;
                              setRelaySteps(updated);
                            }
                          }}
                          required
                          placeholder="e.g. Samsung Austin Site"
                        />
                      </div>
                      <div className="f-form-group">
                        <label className="f-label">Project Code</label>
                        <input 
                          type="text" 
                          className="f-input"
                          value={formProjectCode}
                          onChange={(e) => setFormProjectCode(e.target.value)}
                          required
                          placeholder="e.g. SEC-A1"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="f-form-group">
                        <label className="f-label">User Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formUserEmail}
                          onChange={(e) => setFormUserEmail(e.target.value)}
                          required
                          placeholder="user@ge.com"
                        />
                      </div>
                      <div className="f-form-group">
                        <label className="f-label">PM Email</label>
                        <input 
                          type="email" 
                          className="f-input"
                          value={formPmEmail}
                          onChange={(e) => setFormPmEmail(e.target.value)}
                          required
                          placeholder="pm@ge.com"
                        />
                      </div>
                    </div>

                    {/* Relay Schedules */}
                    <div className="relay-schedules-section" style={{ marginTop: '16px', borderTop: '1px solid var(--f-border)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--f-text-primary)', fontWeight: 600 }}>🔄 Relay Scheduling Flow</h4>
                        <button 
                          type="button" 
                          className="f-button" 
                          style={{ padding: '4px 8px', fontSize: '11px', minHeight: 'auto', height: '24px' }}
                          onClick={() => setRelaySteps([...relaySteps, { stage: 'active_rental', destination: '', startDate: '', endDate: '' }])}
                        >
                          ➕ Add Relay Step
                        </button>
                      </div>

                      {relaySteps.map((step, index) => (
                        <div key={index} className="relay-step-card" style={{ padding: '12px', border: '1px solid var(--f-border)', borderRadius: '4px', marginBottom: '10px', backgroundColor: 'var(--f-bg-secondary)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '12px', color: 'var(--f-text-primary)' }}>Schedule {index + 1}</strong>
                            {relaySteps.length > 1 && (
                              <button 
                                type="button" 
                                style={{ background: 'transparent', border: 'none', color: 'var(--f-error)', cursor: 'pointer', fontSize: '11px' }}
                                onClick={() => setRelaySteps(relaySteps.filter((_, i) => i !== index))}
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                            <div className="f-form-group" style={{ flex: 1, marginBottom: 0 }}>
                              <label className="f-label" style={{ fontSize: '11px' }}>Case Name / Stage Name</label>
                              <input 
                                type="text" 
                                className="f-input"
                                style={{ padding: '6px 10px', fontSize: '13px' }}
                                value={step.destination}
                                onChange={(e) => {
                                  const updated = [...relaySteps];
                                  updated[index].destination = e.target.value;
                                  setRelaySteps(updated);
                                }}
                                required
                                placeholder="ex) Calibration, Site B, ect..."
                              />
                            </div>
                            <div className="f-form-group" style={{ flex: 1, marginBottom: 0 }}>
                              <label className="f-label" style={{ fontSize: '11px' }}>Stage Target</label>
                              <select 
                                className="f-input"
                                style={{ padding: '6px 10px', fontSize: '13px' }}
                                value={step.stage}
                                onChange={(e) => {
                                  const updated = [...relaySteps];
                                  updated[index].stage = e.target.value as any;
                                  setRelaySteps(updated);
                                }}
                              >
                                <option value="active_rental">Active Rental</option>
                                <option value="calibration">Calibration Lab</option>
                                <option value="ongoing">On Going</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row" style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                            <div className="f-form-group" style={{ flex: 1, marginBottom: 0 }}>
                              <label className="f-label" style={{ fontSize: '11px' }}>Start Date</label>
                              <input 
                                type="date" 
                                className="f-input"
                                style={{ padding: '6px 10px', fontSize: '13px' }}
                                value={step.startDate}
                                onChange={(e) => {
                                  const updated = [...relaySteps];
                                  updated[index].startDate = e.target.value;
                                  setRelaySteps(updated);
                                }}
                                required
                              />
                            </div>
                            <div className="f-form-group" style={{ flex: 1, marginBottom: 0 }}>
                              <label className="f-label" style={{ fontSize: '11px' }}>Return Date (Planned)</label>
                              <input 
                                type="date" 
                                className="f-input"
                                style={{ padding: '6px 10px', fontSize: '13px' }}
                                value={step.endDate}
                                onChange={(e) => {
                                  const updated = [...relaySteps];
                                  updated[index].endDate = e.target.value;
                                  setRelaySteps(updated);
                                }}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="f-form-group" style={{ marginTop: '15px' }}>
                  <label className="f-label">Notes & Routing Instructions</label>
                  <textarea 
                    className="f-input"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Special instructions for handover calibration or delivery..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="f-button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="f-button f-button-primary">
                  {editingCase ? 'Save Changes' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
