import React, { useState, useEffect, useRef } from 'react';
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
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ScheduledCase | null>(null);

  // Search and multi-select states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  
  // Bulk update verification modal state
  const [isBulkTransitionModalOpen, setIsBulkTransitionModalOpen] = useState(false);
  const [bulkTargetStage, setBulkTargetStage] = useState<'active_rental' | 'calibration' | 'ongoing'>('active_rental');
  const [bulkHandoverPic, setBulkHandoverPic] = useState('');
  const [bulkHandoverPhoto, setBulkHandoverPhoto] = useState('');
  const [bulkChecklistVerified, setBulkChecklistVerified] = useState(false);

  // Calibration Cleared Modal state
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [activeClearSchedule, setActiveClearSchedule] = useState<ScheduledCase | null>(null);
  const [clearCalDate, setClearCalDate] = useState(new Date().toISOString().split('T')[0]);
  const [clearFile, setClearFile] = useState<File | null>(null);
  const [clearImageFile, setClearImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Inline Add Case state
  const [inlineAddOption, setInlineAddOption] = useState<'calibration' | 'other_project'>('other_project');
  const [inlineAddDestination, setInlineAddDestination] = useState('');
  const [activeAddingToolCode, setActiveAddingToolCode] = useState<string | null>(null);

  // Form states
  const [formSelectedAssets, setFormSelectedAssets] = useState<string[]>([]);
  const [formProjectCode, setFormProjectCode] = useState('');
  const [relaySteps, setRelaySteps] = useState<Array<{
    option: 'calibration' | 'other_project';
    destination: string;
  }>>([
    { option: 'other_project', destination: '' }
  ]);

  const [formToolCode, setFormToolCode] = useState('');
  const [formStage, setFormStage] = useState<'active_rental' | 'calibration' | 'ongoing'>('active_rental');
  const [formDestination, setFormDestination] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formPmEmail, setFormPmEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState<'Scheduled' | 'Pending_Approval' | 'In_Progress' | 'Completed' | 'Delayed'>('Scheduled');
  const [formHandoverPic, setFormHandoverPic] = useState('');
  const [formHandoverPhoto, setFormHandoverPhoto] = useState('');
  const [formChecklistVerified, setFormChecklistVerified] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [bulkPhotoFile, setBulkPhotoFile] = useState<File | null>(null);

  const isOutboundFromCalibration = !!editingCase && editingCase.stage === 'calibration' && (formStage === 'active_rental' || formStage === 'ongoing' || formStatus === 'Completed');
  const isNormalHandover = !!editingCase && editingCase.stage !== 'calibration' && formStage === 'active_rental';
  const showHandoverFields = !!editingCase && (isOutboundFromCalibration || isNormalHandover);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/list`);
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const dataObj = await res.json();
      const updatedSchedules = dataObj.data || [];
      setSchedules(updatedSchedules);
      // Clean up selected card IDs that may no longer exist
      setSelectedCardIds(prev => prev.filter(id => updatedSchedules.some((s: ScheduledCase) => s.id === id)));
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
    setFormUserEmail('');
    setFormPmEmail('');
    setFormNotes('');
    setFormStatus('Scheduled');
    setFormHandoverPic('');
    setFormHandoverPhoto('');
    setFormChecklistVerified(false);
    setRelaySteps([
      { option: 'other_project', destination: '' }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (sc: ScheduledCase) => {
    if (!isAdmin) return;
    setEditingCase(sc);
    setFormToolCode(sc.toolCode);
    setFormStage(sc.stage);
    setFormDestination(sc.destination);
    setFormProjectCode(sc.projectCode || '');
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
    setPhotoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingCase) {
      const selectedAsset = assets.find(a => a.toolCode === formToolCode);
      const model = selectedAsset ? selectedAsset.model : 'Unknown';

      const isOutboundFromCalibration = editingCase.stage === 'calibration' && (formStage === 'active_rental' || formStage === 'ongoing' || formStatus === 'Completed');
      const isNormalHandover = editingCase.stage !== 'calibration' && formStage === 'active_rental';
      const showHandoverFields = isOutboundFromCalibration || isNormalHandover;

      if (showHandoverFields) {
        if (!formHandoverPic || !formHandoverPic.trim()) {
          alert("Error: Handover PIC Name (인수 확인자) is required.");
          return;
        }
        if (!photoFile && !formHandoverPhoto) {
          alert("Error: Handover Photo (인수 확인 사진) is required. Please upload an image file.");
          return;
        }
        if (!formChecklistVerified) {
          alert("Error: You must check the checklist box to verify physical inspection and safety checklist.");
          return;
        }
      }

      let photoUrl = formHandoverPhoto;
      if (showHandoverFields && photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("filename", photoFile.name);
        try {
          const uploadRes = await fetch(`/api/sharepoint/upload?filename=${encodeURIComponent(photoFile.name)}`, {
            method: 'POST',
            body: formData
          });
          if (uploadRes.ok) {
            photoUrl = photoFile.name;
          }
        } catch (err) {
          console.error("Photo upload failed:", err);
        }
      }

      const payload = {
        id: editingCase.id,
        toolCode: formToolCode,
        model,
        sequenceOrder: editingCase.sequenceOrder,
        stage: formStage,
        destination: formDestination,
        startDate: '',
        endDate: '',
        status: formStatus,
        userEmail: formUserEmail,
        pmEmail: formPmEmail,
        notes: formNotes,
        projectCode: formProjectCode,
        handoverPic: showHandoverFields ? formHandoverPic : undefined,
        handoverPhoto: showHandoverFields ? photoUrl : undefined,
        checklistVerified: showHandoverFields ? formChecklistVerified : undefined
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
      
      formSelectedAssets.forEach((toolCode, assetIdx) => {
        const selectedAsset = assets.find(a => a.toolCode === toolCode);
        const model = selectedAsset ? selectedAsset.model : 'Unknown';
        
        const currentLoc = selectedAsset ? (selectedAsset.currentLocation || selectedAsset.Current_Location || '') : '';
        const currentStat = selectedAsset ? (selectedAsset.status || selectedAsset.Current_Status || '') : '';
        
        const isWarehouse = currentLoc === 'Warehouse' || currentLoc === '';
        const isAvailable = currentStat === 'Available';
        
        relaySteps.forEach((step, stepIdx) => {
          const cleanedAsset = toolCode.replace(/[^a-zA-Z0-9]/g, '');
          const id = `SCH-2026-${timestamp}-${assetIdx}-${stepIdx}-${cleanedAsset}`;
          
          let stage: 'active_rental' | 'calibration' | 'ongoing' = 'active_rental';
          let destination = step.destination;
          
          if (step.option === 'calibration') {
            destination = step.destination || 'Calibration Lab';
          }

          if (!isWarehouse) {
            stage = 'active_rental';
          } else {
            if (!isAvailable) {
              stage = 'ongoing';
            } else {
              if (step.option === 'calibration') {
                stage = 'calibration';
              } else {
                stage = 'active_rental';
              }
            }
          }

          payloads.push({
            id,
            toolCode: toolCode,
            model,
            sequenceOrder: stepIdx,
            stage,
            destination,
            startDate: '',
            endDate: '',
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

  const handleBulkMoveTrigger = (targetStage: 'active_rental' | 'calibration' | 'ongoing') => {
    const selectedSchedules = schedules.filter(s => selectedCardIds.includes(s.id));
    const anyFromCalibration = selectedSchedules.some(s => s.stage === 'calibration');
    const isOutbound = anyFromCalibration && (targetStage === 'active_rental' || targetStage === 'ongoing');
    const isNormalHandover = !anyFromCalibration && targetStage === 'active_rental';
    const requiresHandover = isOutbound || isNormalHandover;

    if (requiresHandover) {
      setBulkTargetStage(targetStage);
      setBulkHandoverPic('');
      setBulkHandoverPhoto('');
      setBulkChecklistVerified(false);
      setBulkPhotoFile(null);
      setIsBulkTransitionModalOpen(true);
    } else {
      executeBulkMove(targetStage);
    }
  };

  const executeBulkMove = async (
    targetStage: 'active_rental' | 'calibration' | 'ongoing',
    handoverPic?: string,
    handoverPhoto?: string,
    checklistVerified?: boolean
  ) => {
    const selectedSchedules = schedules.filter(s => selectedCardIds.includes(s.id));
    const anyFromCalibration = selectedSchedules.some(s => s.stage === 'calibration');
    const isOutbound = anyFromCalibration && (targetStage === 'active_rental' || targetStage === 'ongoing');
    const isNormalHandover = !anyFromCalibration && targetStage === 'active_rental';
    const requiresHandover = isOutbound || isNormalHandover;

    let photoUrl = handoverPhoto;
    if (requiresHandover && bulkPhotoFile) {
      const formData = new FormData();
      formData.append("file", bulkPhotoFile);
      formData.append("filename", bulkPhotoFile.name);
      try {
        const uploadRes = await fetch(`/api/sharepoint/upload?filename=${encodeURIComponent(bulkPhotoFile.name)}`, {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          photoUrl = bulkPhotoFile.name;
        }
      } catch (err) {
        console.error("Bulk photo upload failed:", err);
      }
    }

    const payloads = selectedSchedules.map(s => {
      const isCardOutbound = s.stage === 'calibration' && (targetStage === 'active_rental' || targetStage === 'ongoing');
      const isCardNormalHandover = s.stage !== 'calibration' && targetStage === 'active_rental';
      const cardRequiresHandover = isCardOutbound || isCardNormalHandover;

      return {
        ...s,
        stage: targetStage,
        status: targetStage === 'ongoing' ? 'Scheduled' : 'In_Progress',
        handoverPic: cardRequiresHandover ? handoverPic : undefined,
        handoverPhoto: cardRequiresHandover ? photoUrl : undefined,
        checklistVerified: cardRequiresHandover ? checklistVerified : undefined
      };
    });

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/update-bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads)
      });
      if (!res.ok) throw new Error("Bulk update failed");
      
      setSelectedCardIds([]);
      setIsBulkTransitionModalOpen(false);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error performing bulk stage move.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRelease = async () => {
    if (!confirm(`Are you sure you want to release ${selectedCardIds.length} tools? This will delete their active schedule workflows and return them to Available status.`)) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/delete-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCardIds)
      });
      if (!res.ok) throw new Error("Bulk release failed");
      
      setSelectedCardIds([]);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error releasing scheduled tools.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveStage = async (sc: ScheduledCase, nextStage: 'active_rental' | 'calibration' | 'ongoing') => {
    if (!isAdmin) return;
    
    const isOutboundFromCalibration = sc.stage === 'calibration' && (nextStage === 'active_rental' || nextStage === 'ongoing');
    const isNormalHandover = sc.stage !== 'calibration' && nextStage === 'active_rental';
    const isOutbound = isOutboundFromCalibration || isNormalHandover;

    if (!isOutbound) {
      const payload: ScheduledCase = {
        ...sc,
        stage: nextStage,
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
      setFormToolCode(sc.toolCode);
      setFormStage(nextStage);
      setFormDestination(sc.destination);
      setFormProjectCode(sc.projectCode || '');
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

  // Sequence-based Conflict Detection Check
  const isConflict = (sc: ScheduledCase) => {
    if (sc.status === 'Completed') return false;
    const sameToolSchedules = schedules.filter(other => 
      other.toolCode === sc.toolCode && 
      other.status !== 'Completed'
    );
    
    // Conflict 1: More than one schedule in progress, pending, or delayed for this tool
    const activeStatuses = ['In_Progress', 'Pending_Approval', 'Delayed'];
    const activeCount = sameToolSchedules.filter(s => activeStatuses.includes(s.status)).length;
    if (activeCount > 1) return true;
    
    // Conflict 2: More than one schedule in the same stage
    const sameStageCount = sameToolSchedules.filter(s => s.stage === sc.stage).length;
    if (sameStageCount > 1) return true;

    // Conflict 3: Duplicate sequence orders
    const seqOrders = sameToolSchedules.map(s => s.sequenceOrder);
    const hasDuplicateSeq = seqOrders.some((val, i) => seqOrders.indexOf(val) !== i);
    if (hasDuplicateSeq) return true;
    
    return false;
  };

  // Inline Add Case Handler
  const handleInlineAddCase = async (e: React.FormEvent, toolCode: string) => {
    e.preventDefault();
    if (!isAdmin) return;

    const selectedAsset = assets.find(a => a.toolCode === toolCode);
    const model = selectedAsset ? selectedAsset.model : 'Unknown';

    let stage: 'active_rental' | 'calibration' | 'ongoing' = 'active_rental';
    let destination = '';

    if (inlineAddOption === 'calibration') {
      destination = 'Calibration Lab';
    } else {
      if (!inlineAddDestination.trim()) {
        alert("Please enter a project name.");
        return;
      }
      destination = inlineAddDestination;
    }

    const currentLoc = selectedAsset ? (selectedAsset.currentLocation || selectedAsset.Current_Location || '') : '';
    const currentStat = selectedAsset ? (selectedAsset.status || selectedAsset.Current_Status || '') : '';
    
    const isWarehouse = currentLoc === 'Warehouse' || currentLoc === '';
    const isAvailable = currentStat === 'Available';

    if (isWarehouse) {
      if (isAvailable) {
        stage = 'active_rental';
      } else {
        stage = 'ongoing';
      }
    } else {
      stage = 'active_rental';
    }

    // Find the next sequenceOrder for this asset
    const assetSchedules = schedules.filter(s => s.toolCode === toolCode);
    const nextSeq = assetSchedules.length > 0 
      ? Math.max(...assetSchedules.map(s => s.sequenceOrder)) + 1 
      : 0;

    const timestamp = Date.now().toString().slice(-4);
    const cleanedAsset = toolCode.replace(/[^a-zA-Z0-9]/g, '');
    const id = `SCH-2026-${timestamp}-${nextSeq}-${cleanedAsset}`;

    const newCase = {
      id,
      toolCode: toolCode,
      model,
      sequenceOrder: nextSeq,
      stage,
      destination,
      startDate: '',
      endDate: '',
      status: 'Scheduled',
      userEmail: formUserEmail || 'admin@ge.com',
      pmEmail: formPmEmail || 'pm@ge.com',
      notes: inlineAddOption === 'calibration' ? 'Scheduled calibration step' : 'Added from Scheduler card'
    };

    try {
      const res = await fetch(`${API_BASE}/create-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([newCase])
      });
      if (!res.ok) throw new Error("Failed to add expected case");
      
      setInlineAddDestination('');
      setActiveAddingToolCode(null);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err) {
      console.error(err);
      alert("Error adding case.");
    }
  };

  // Calibration Cleared Submission Handler
  const handleClearCalibration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClearSchedule || !clearFile || !clearImageFile) {
      alert("Please select both a PDF report file and a Photo/Image file.");
      return;
    }

    const formData = new FormData();
    formData.append("schedule_id", activeClearSchedule.id);
    formData.append("calibration_date", clearCalDate);
    formData.append("pdf_file", clearFile);
    formData.append("image_file", clearImageFile);

    try {
      setIsLoading(true);
      const res = await fetch("/api/sharepoint/calibration/clear", {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit calibration files");
      }
      
      setClearModalOpen(false);
      setActiveClearSchedule(null);
      setClearFile(null);
      setClearImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
      
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error clearing calibration: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRental = async (scheduleId: string) => {
    if (!isAdmin) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/sharepoint/schedule/approve/${scheduleId}`, {
        method: 'POST'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to approve rental");
      }
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error approving rental request: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRental = async (scheduleId: string) => {
    if (!isAdmin) return;
    const schedule = schedules.find(s => s.id === scheduleId);
    const reason = window.prompt(
      `Reject reason for ${schedule?.movementType || 'checkout'} request (${schedule?.toolCode || scheduleId}).\nThis message will be sent to the requester by Email and Teams.`,
      ''
    );
    if (reason === null) return;
    if (!reason.trim()) {
      alert('Reject reason is required.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/sharepoint/schedule/reject/${scheduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to reject request");
      }
      const result = await res.json();
      alert(`❌ Request rejected.\nEmail/Teams message queued for: ${result.notification?.email || 'requester'}\nReason: ${reason.trim()}`);
      setSelectedCardIds(prev => prev.filter(id => id !== scheduleId));
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error rejecting request: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all currently visible active schedules based on filters/search
  const getVisibleActiveSchedules = () => {
    const schedulesByAsset: Record<string, ScheduledCase[]> = {};
    schedules.forEach(s => {
      if (!schedulesByAsset[s.toolCode]) {
        schedulesByAsset[s.toolCode] = [];
      }
      schedulesByAsset[s.toolCode].push(s);
    });

    const visibleList: ScheduledCase[] = [];
    Object.keys(schedulesByAsset).forEach(code => {
      const assetScheds = schedulesByAsset[code];
      const activeSched = assetScheds.find(s => s.status !== 'Completed');
      if (!activeSched) return;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const asset = assets.find(a => a.toolCode === code);
        const model = asset ? asset.model : '';
        const matches = 
          (code || '').toLowerCase().includes(term) ||
          (model || '').toLowerCase().includes(term) ||
          (activeSched.destination || '').toLowerCase().includes(term) ||
          (activeSched.projectCode || '').toLowerCase().includes(term) ||
          (activeSched.userEmail || '').toLowerCase().includes(term) ||
          (activeSched.pmEmail || '').toLowerCase().includes(term) ||
          (activeSched.notes || '').toLowerCase().includes(term) ||
          (activeSched.caseId || '').toLowerCase().includes(term) ||
          (activeSched.status || '').toLowerCase().includes(term) ||
          activeSched.id.toLowerCase().includes(term);
        
        if (!matches) return;
      }
      visibleList.push(activeSched);
    });
    return visibleList;
  };

  const handleSelectAll = (stage?: 'active_rental' | 'calibration' | 'ongoing') => {
    const visibleSchedules = getVisibleActiveSchedules().filter(s => !stage || s.stage === stage);
    const visibleIds = visibleSchedules.map(s => s.id);
    if (visibleIds.length === 0) return;
    
    // If all visible ones are already selected, deselect them (선택취소)
    const allVisibleSelected = visibleIds.every(id => selectedCardIds.includes(id));
    
    if (allVisibleSelected) {
      // Remove all visible ids from selection
      setSelectedCardIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Add all visible ids to selection (avoiding duplicates)
      setSelectedCardIds(prev => {
        const next = [...prev];
        visibleIds.forEach(id => {
          if (!next.includes(id)) {
            next.push(id);
          }
        });
        return next;
      });
    }
  };

  const getSelectedPendingIds = () => selectedCardIds.filter(id => {
    const card = schedules.find(s => s.id === id);
    return card && card.status === 'Pending_Approval';
  });

  const handleBulkApproveRentals = async () => {
    if (!isAdmin) return;
    const pendingIds = getSelectedPendingIds();

    if (pendingIds.length === 0) {
      alert("No pending approval cards selected.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/approve-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pendingIds)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to bulk approve rentals");
      }
      const result = await res.json();
      alert(`✅ Bulk approved ${result.count} rental requests successfully!`);
      setSelectedCardIds([]);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error bulk approving rentals: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRejectRentals = async () => {
    if (!isAdmin) return;
    const pendingIds = getSelectedPendingIds();

    if (pendingIds.length === 0) {
      alert("No pending approval cards selected.");
      return;
    }

    const reason = window.prompt(
      `Reject reason for ${pendingIds.length} selected pending request(s).\nThis message will be sent to each requester by Email and Teams.`,
      ''
    );
    if (reason === null) return;
    if (!reason.trim()) {
      alert('Reject reason is required.');
      return;
    }

    try {
      setIsLoading(true);
      const responses = await Promise.all(pendingIds.map(id => fetch(`${API_BASE}/reject/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() })
      })));
      const failed = responses.filter(res => !res.ok);
      if (failed.length > 0) {
        throw new Error(`${failed.length} reject request(s) failed`);
      }
      alert(`❌ Bulk rejected ${pendingIds.length} pending request(s).\nEmail/Teams reason queued: ${reason.trim()}`);
      setSelectedCardIds([]);
      await fetchSchedules();
      onRefreshAssets();
    } catch (err: any) {
      console.error(err);
      alert(`Error bulk rejecting rentals: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
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

    // Group schedules by asset
    const schedulesByAsset: Record<string, ScheduledCase[]> = {};
    schedules.forEach(s => {
      if (!schedulesByAsset[s.toolCode]) {
        schedulesByAsset[s.toolCode] = [];
      }
      schedulesByAsset[s.toolCode].push(s);
    });

    // Sort schedules by sequenceOrder for each asset
    Object.keys(schedulesByAsset).forEach(code => {
      schedulesByAsset[code].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    });

    return (
      <div className="kanban-board">
        {columns.map(col => {
          // Filter assets whose ACTIVE schedule (first non-completed schedule) is in this stage
          const colAssets = Object.keys(schedulesByAsset).filter(code => {
            const assetScheds = schedulesByAsset[code];
            const activeSched = assetScheds.find(s => s.status !== 'Completed');
            if (!activeSched) return false;
            if (activeSched.stage !== col) return false;
            
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const asset = assets.find(a => a.toolCode === code);
            const model = asset ? asset.model : '';
            
            return (
              (code || '').toLowerCase().includes(term) ||
              (model || '').toLowerCase().includes(term) ||
              (activeSched.destination || '').toLowerCase().includes(term) ||
              (activeSched.projectCode || '').toLowerCase().includes(term) ||
              (activeSched.userEmail || '').toLowerCase().includes(term) ||
              (activeSched.pmEmail || '').toLowerCase().includes(term) ||
              (activeSched.notes || '').toLowerCase().includes(term) ||
              (activeSched.caseId || '').toLowerCase().includes(term) ||
              (activeSched.status || '').toLowerCase().includes(term) ||
              activeSched.id.toLowerCase().includes(term)
            );
          });

          return (
            <div key={col} className={`kanban-column ${col}`}>
              <div className="kanban-column-header">
                <h3>{getStageTitle(col)}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  {isAdmin && colAssets.length > 0 && (
                    <button
                      type="button"
                      className="f-button"
                      onClick={() => handleSelectAll(col)}
                      style={{ padding: '3px 7px', fontSize: '11px', minHeight: 'auto', height: '24px' }}
                    >
                      {colAssets
                        .map(code => schedulesByAsset[code].find(s => s.status !== 'Completed')?.id)
                        .filter(Boolean)
                        .every(id => selectedCardIds.includes(id as string)) ? 'Clear All' : 'Select All'}
                    </button>
                  )}
                  <span className="kanban-count-badge">{colAssets.length}</span>
                </div>
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
                    const activeSchedId = e.dataTransfer.getData("text/plain");
                    const card = schedules.find(s => s.id === activeSchedId);
                    if (card && card.status === 'Pending_Approval') {
                      alert('Approval Pending cards are locked. Approve first, then move.');
                      return;
                    }
                    if (card && card.stage !== col) {
                      handleMoveStage(card, col);
                    }
                  }
                }}
              >
                {colAssets.length > 0 ? (
                  colAssets.map(code => {
                    const assetScheds = schedulesByAsset[code];
                    const activeSched = assetScheds.find(s => s.status !== 'Completed')!;
                    const hasConflict = isConflict(activeSched);
                    const isSelected = selectedCardIds.includes(activeSched.id);
                    const asset = assets.find(a => a.toolCode === code);
                    const serial = asset ? asset.serialNumber : 'Unknown';

                    return (
                      <div 
                        key={code} 
                        draggable={isAdmin && activeSched.status !== 'Pending_Approval'}
                        onDragStart={(e) => {
                          if (isAdmin) {
                            e.dataTransfer.setData("text/plain", activeSched.id);
                            e.currentTarget.classList.add("dragging");
                          }
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.classList.remove("dragging");
                        }}
                        className={`kanban-card ${activeSched.stage} ${activeSched.status.toLowerCase()} ${hasConflict ? 'conflict-warning' : ''}`}
                        style={{ padding: '16px', borderRadius: '12px' }}
                      >
                        <div className="card-top">
                          {isAdmin && (
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              style={{ marginRight: '8px', cursor: 'pointer', transform: 'scale(1.15)', accentColor: 'var(--f-primary)' }}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCardIds([...selectedCardIds, activeSched.id]);
                                } else {
                                  setSelectedCardIds(selectedCardIds.filter(id => id !== activeSched.id));
                                }
                              }}
                            />
                          )}
                          <span className="card-id" style={{ flex: 1 }}>{activeSched.id}</span>
                          {hasConflict && <span className="warning-pill" style={{ marginRight: '8px' }}>⚠️ Overlap</span>}
                          {isAdmin && (
                            <div className="card-edit-actions">
                              <button onClick={() => openEditModal(activeSched)} title="Edit">✏️</button>
                              <button onClick={() => handleDelete(activeSched.id)} title="Delete Active Case">🗑️</button>
                            </div>
                          )}
                        </div>

                        <h4 className="card-title" style={{ marginTop: '8px', fontSize: '15px' }}>{activeSched.model}</h4>
                        <div style={{ fontSize: '11px', color: 'var(--f-text-muted)', marginBottom: '8px' }}>Code: {code} | SN: {serial}</div>
                        
                        <div className="card-meta" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', padding: '8px', borderRadius: '6px' }}>
                          {activeSched.projectCode && <div>🏷️ <strong>Project Code:</strong> {activeSched.projectCode}</div>}
                          <div>📍 <strong>Current Destination:</strong> {activeSched.destination}</div>
                          {activeSched.movementType && <div>🔄 <strong>Request Type:</strong> {activeSched.movementType}</div>}
                          {activeSched.requestedEndDate && <div>📅 <strong>Requested Return Date:</strong> {activeSched.requestedEndDate}</div>}
                          <div>👤 <strong>Renter/User:</strong> {activeSched.userEmail}</div>
                          {activeSched.notes && <div style={{ fontStyle: 'italic', marginTop: '4px' }}>📝 {activeSched.notes}</div>}
                          {activeSched.handoverPhoto && (
                            <div style={{ marginTop: '4px' }}>
                              📷 <strong>{activeSched.status === 'Pending_Approval' ? 'Submitted Photo:' : 'Saved Photo:'}</strong> {activeSched.handoverPhoto}
                              {activeSched.handoverPhotoWebUrl && (
                                <a
                                  href={activeSched.handoverPhotoWebUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="f-button"
                                  style={{ display: 'inline-block', marginLeft: '6px', padding: '2px 6px', fontSize: '10.5px', minHeight: 'auto', height: '22px', lineHeight: '16px' }}
                                >
                                  Open Photo
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status / Approval UI */}
                        {activeSched.status === 'Pending_Approval' && (
                          <div style={{ marginTop: '8px' }}>
                            <span className="warning-pill" style={{ display: 'inline-block', backgroundColor: '#FFE082', color: '#E65100', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
                              ⏳ Pending Approval
                            </span>
                            {isAdmin && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                                <button 
                                  onClick={() => handleApproveRental(activeSched.id)}
                                  className="f-button"
                                  style={{ 
                                    width: '100%', 
                                    padding: '4px', 
                                    fontSize: '11.5px', 
                                    minHeight: 'auto', 
                                    height: '28px', 
                                    backgroundColor: '#2E7D32', 
                                    color: 'white', 
                                    border: 'none',
                                    fontWeight: '600',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✔️ Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectRental(activeSched.id)}
                                  className="f-button"
                                  style={{ 
                                    width: '100%', 
                                    padding: '4px', 
                                    fontSize: '11.5px', 
                                    minHeight: 'auto', 
                                    height: '28px', 
                                    backgroundColor: '#C62828', 
                                    color: 'white', 
                                    border: 'none',
                                    fontWeight: '600',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✖️ Reject
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Stage Selector Dropdown */}
                        {isAdmin && activeSched.status !== 'Pending_Approval' && (
                          <div className="card-stage-selectors" style={{ marginTop: '8px', borderTop: '1px solid var(--f-border)', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                            <label style={{ fontWeight: 500, color: 'var(--f-text-secondary)' }}>Move to:</label>
                            <select 
                              aria-label={`Change stage for ${activeSched.model}`}
                              value={activeSched.stage} 
                              onChange={(e) => handleMoveStage(activeSched, e.target.value as any)}
                              className="f-input"
                              style={{ width: '130px', padding: '2px 4px', fontSize: '11px', height: '24px', minHeight: 'auto' }}
                            >
                              <option value="active_rental">Active Rental</option>
                              <option value="calibration">Calibration Lab</option>
                              <option value="ongoing">On Going</option>
                            </select>
                          </div>
                        )}

                        {/* Expected lineup sequence list */}
                        <div className="lineup-list" style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--f-border)' }}>
                          <div style={{ fontWeight: 600, fontSize: '11.5px', color: 'var(--f-text-secondary)', marginBottom: '6px' }}>📋 EXPECTED LINEUP</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {assetScheds.map((s, idx) => {
                              const icon = s.stage === 'active_rental' ? '📢' : s.stage === 'calibration' ? '🔬' : '🚚';
                              const label = s.stage === 'active_rental' ? 'Active' : s.stage === 'calibration' ? 'Calibration' : 'On Going';
                              return (
                                <div key={s.id} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center', 
                                  fontSize: '11.5px', 
                                  padding: '4px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: s.status === 'Completed' 
                                    ? 'var(--f-bg-th)' 
                                    : s.status === 'In_Progress' 
                                      ? 'var(--f-primary-light)' 
                                      : 'transparent',
                                  borderLeft: s.status === 'In_Progress' 
                                    ? '3px solid var(--f-primary)' 
                                    : 'none',
                                  color: s.status === 'Completed' ? 'var(--f-text-muted)' : 'var(--f-text-primary)',
                                  fontWeight: s.status === 'In_Progress' ? 'bold' : 'normal'
                                }}>
                                  <span style={{ textDecoration: s.status === 'Completed' ? 'line-through' : 'none' }}>
                                    Case {idx + 1}: {icon} {s.destination} ({label})
                                  </span>
                                  {isAdmin && s.status !== 'Completed' && (
                                    <button 
                                      onClick={() => handleDelete(s.id)} 
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--f-error)', padding: '0 2px' }}
                                      title="Delete Step"
                                    >
                                      &times;
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Inline Add Expected Case Form */}
                        {activeAddingToolCode === code ? (
                          <form onSubmit={(e) => handleInlineAddCase(e, code)} style={{ marginTop: '12px', padding: '8px', border: '1px solid var(--f-primary)', borderRadius: '6px', backgroundColor: 'var(--f-bg-white)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '6px' }}>
                              <select 
                                value={inlineAddOption}
                                onChange={(e) => setInlineAddOption(e.target.value as any)}
                                className="f-input"
                                style={{ padding: '4px 6px', fontSize: '11px', height: '26px' }}
                              >
                                <option value="calibration">1. Calibration</option>
                                <option value="other_project">2. Other Project</option>
                              </select>
                              {inlineAddOption === 'other_project' && (
                                <input 
                                  type="text" 
                                  placeholder="Project Name" 
                                  value={inlineAddDestination}
                                  onChange={(e) => setInlineAddDestination(e.target.value)}
                                  className="f-input"
                                  style={{ padding: '4px 6px', fontSize: '11px', height: '26px' }}
                                  required
                                />
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button type="button" onClick={() => setActiveAddingToolCode(null)} className="f-button" style={{ padding: '2px 6px', fontSize: '10px', minHeight: 'auto', height: '22px' }}>Cancel</button>
                              <button type="submit" className="f-button f-button-primary" style={{ padding: '2px 6px', fontSize: '10px', minHeight: 'auto', height: '22px' }}>Confirm</button>
                            </div>
                          </form>
                        ) : (
                          isAdmin && (
                            <button 
                              onClick={() => {
                                setActiveAddingToolCode(code);
                                setInlineAddOption('other_project');
                                setInlineAddDestination('');
                              }}
                              className="f-button"
                              style={{ width: '100%', marginTop: '10px', padding: '4px', fontSize: '11.5px', minHeight: 'auto', height: '26px', border: '1px dashed var(--f-border)' }}
                            >
                              ➕ Add Case Step
                            </button>
                          )
                        )}

                        {/* Cleared Button for Calibration Step */}
                        {(activeSched.stage === 'calibration' || (activeSched.destination && (activeSched.destination.toLowerCase().includes('calibration') || activeSched.destination.toLowerCase().includes('cal') || activeSched.destination.toLowerCase().includes('검교정')))) && isAdmin && (
                          <button 
                            onClick={() => {
                              setActiveClearSchedule(activeSched);
                              setClearCalDate(new Date().toISOString().split('T')[0]);
                              setClearFile(null);
                              setClearModalOpen(true);
                            }}
                            className="f-button"
                            style={{ 
                              width: '100%', 
                              marginTop: '8px', 
                              padding: '6px', 
                              fontSize: '12px', 
                              minHeight: 'auto', 
                              height: '32px', 
                              backgroundColor: '#2E7D32', 
                              color: 'white', 
                              border: 'none',
                              fontWeight: '600',
                              borderRadius: '6px'
                            }}
                          >
                            🔬 Cleared (Upload PDF)
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-column-placeholder">No assets in this stage.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="scheduling-tab-container f-fade-in">
      <div className="tab-control-header">
        <div className="tab-title-section">
          <h2>🗓️ Tool Scheduling</h2>
        </div>

        <div className="tab-actions scheduler-toolbar">
          {/* Keyword Search Input */}
          <div className="search-box-container scheduler-search-box" style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="f-input search-input" 
              style={{ paddingLeft: '32px' }}
              placeholder="🔍 Search schedules..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--f-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                &times;
              </button>
            )}
          </div>

          <div className="scheduler-filter-controls">
            {isAdmin && (
              <>
                <button 
                  type="button"
                  className="f-button scheduler-action-btn scheduler-reject-btn"
                  onClick={handleBulkRejectRentals}
                  disabled={getSelectedPendingIds().length === 0}
                >
                  Reject Selected
                </button>
                <button 
                  type="button"
                  className="f-button scheduler-action-btn scheduler-approve-btn"
                  onClick={handleBulkApproveRentals}
                  disabled={getSelectedPendingIds().length === 0}
                >
                  Approve Selected
                </button>
              </>
            )}
          </div>
          {isAdmin && (
            <button 
              onClick={openCreateModal}
              className="f-button f-button-primary btn-add-schedule scheduler-action-btn"
            >
              Add Schedule Case
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {isAdmin && selectedCardIds.length > 0 && (
        <div className="bulk-actions-bar f-fade-in" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 94, 96, 0.06)',
          border: '1px dashed var(--f-primary)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 600, color: 'var(--f-text-primary)', fontSize: '14px' }}>
              Selected {selectedCardIds.length} tool cards
            </span>
            <button 
              className="f-button" 
              style={{ padding: '4px 8px', fontSize: '12px', minHeight: 'auto', height: '26px' }}
              onClick={() => setSelectedCardIds([])}
            >
              Deselect All
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="f-button"
              style={{ backgroundColor: '#2E7D32', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={() => handleBulkMoveTrigger('active_rental')}
            >
              📢 Move to Active
            </button>
            <button 
              className="f-button"
              style={{ backgroundColor: '#EF6C00', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={() => handleBulkMoveTrigger('calibration')}
            >
              🔬 Move to Calibration
            </button>
            <button 
              className="f-button"
              style={{ backgroundColor: '#1565C0', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={() => handleBulkMoveTrigger('ongoing')}
            >
              🚚 Move to On Going
            </button>
            <button 
              className="f-button"
              style={{ backgroundColor: '#D32F2F', color: 'white', minHeight: 'auto', padding: '6px 12px', fontSize: '12px', height: '32px' }}
              onClick={handleBulkRelease}
            >
              🔓 Release Tools (Delete)
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading tool schedules...</div>
      ) : (
        renderKanban()
      )}

      {/* BULK TRANSITION VERIFICATION MODAL */}
      {isBulkTransitionModalOpen && (
        <div className="modal-overlay">
          <div className="f-card modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>📋 Bulk Handover Verification</h3>
              <button className="modal-close" onClick={() => setIsBulkTransitionModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              executeBulkMove(bulkTargetStage, bulkHandoverPic, bulkHandoverPhoto, bulkChecklistVerified);
            }}>
              <div className="modal-scrollable-body" style={{ padding: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--f-text-secondary)', marginBottom: '16px' }}>
                  You are transitioning <strong>{selectedCardIds.length}</strong> items to <strong>Active Rental</strong> in bulk.
                </p>
                
                <div className="f-form-group">
                  <label className="f-label">Handover PIC Name</label>
                  <input 
                    type="text" 
                    className="f-input"
                    value={bulkHandoverPic}
                    onChange={(e) => setBulkHandoverPic(e.target.value)}
                    required
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div className="f-form-group">
                  <label className="f-label">Upload Handover Photo (Required)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="f-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setBulkPhotoFile(file);
                        setBulkHandoverPhoto(file.name);
                      }
                    }}
                    required={!bulkHandoverPhoto}
                    style={{ padding: '4px' }}
                  />
                  {bulkHandoverPhoto && (
                    <div style={{ fontSize: '11px', color: 'var(--f-success)', marginTop: '4px' }}>
                      ✓ Selected: {bulkHandoverPhoto}
                    </div>
                  )}
                </div>
                
                <div className="f-form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <input 
                    type="checkbox"
                    id="bulkChecklistVerified"
                    checked={bulkChecklistVerified}
                    onChange={(e) => setBulkChecklistVerified(e.target.checked)}
                    required
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="bulkChecklistVerified" className="f-label" style={{ margin: 0, cursor: 'pointer', fontSize: '12px', color: 'var(--f-text-primary)' }}>
                    Confirm physical inspection complete & safety checklist verified
                  </label>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="f-button" onClick={() => setIsBulkTransitionModalOpen(false)}>Cancel</button>
                <button type="submit" className="f-button f-button-primary">Confirm & Transition</button>
              </div>
            </form>
          </div>
        </div>
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
                        value={formToolCode} 
                        onChange={(e) => setFormToolCode(e.target.value)}
                        required
                      >
                        {assets.map(a => (
                          <option key={a.toolCode} value={a.toolCode}>
                            ({a.model} _ {a.serialNumber || 'N/A'})
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
                          <option value="Pending_Approval">Pending Approval</option>
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
                    {showHandoverFields && (
                      <div className="handover-enforcement-section f-card" style={{ padding: '12px', marginBottom: '15px', backgroundColor: 'var(--f-bg-secondary)', border: '1px solid var(--f-border)', borderRadius: '4px' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--f-text-primary)', fontWeight: 600 }}>
                          📋 Handover Record Required Fields
                        </h4>
                        <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <div className="f-form-group" style={{ flex: 1 }}>
                            <label className="f-label" style={{ fontSize: '11px', color: 'var(--f-text-secondary)' }}>Handover PIC Name</label>
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
                            <label className="f-label" style={{ fontSize: '11px', color: 'var(--f-text-secondary)' }}>Upload Handover Photo (Required)</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              className="f-input"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setPhotoFile(file);
                                  setFormHandoverPhoto(file.name);
                                }
                              }}
                              required={!formHandoverPhoto}
                              style={{ padding: '4px' }}
                            />
                            {formHandoverPhoto && (
                              <div style={{ fontSize: '11px', color: 'var(--f-success)', marginTop: '4px' }}>
                                ✓ Selected: {formHandoverPhoto}
                              </div>
                            )}
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
                            Confirm physical inspection complete & safety checklist verified
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
                          const isChecked = formSelectedAssets.includes(a.toolCode);
                          return (
                            <label key={a.toolCode} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: 'var(--f-text-primary)' }}>
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormSelectedAssets([...formSelectedAssets, a.toolCode]);
                                  } else {
                                    setFormSelectedAssets(formSelectedAssets.filter(code => code !== a.toolCode));
                                  }
                                }}
                              />
                              <span>({a.model} _ {a.serialNumber || 'N/A'})</span>
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
                          onClick={() => setRelaySteps([...relaySteps, { option: 'other_project', destination: '' }])}
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
                              <label className="f-label" style={{ fontSize: '11px' }}>Option</label>
                              <select 
                                className="f-input"
                                style={{ padding: '6px 10px', fontSize: '13px' }}
                                value={step.option}
                                onChange={(e) => {
                                  const updated = [...relaySteps];
                                  const val = e.target.value as 'calibration' | 'other_project';
                                  updated[index].option = val;
                                  if (val === 'calibration') {
                                    updated[index].destination = 'Calibration Lab';
                                  } else {
                                    updated[index].destination = '';
                                  }
                                  setRelaySteps(updated);
                                }}
                              >
                                <option value="calibration">1. Calibration</option>
                                <option value="other_project">2. Other Project</option>
                              </select>
                            </div>
                            {step.option === 'other_project' && (
                              <div className="f-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="f-label" style={{ fontSize: '11px' }}>Project Name</label>
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
                                  placeholder="Enter project name..."
                                />
                              </div>
                            )}
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

      {/* CALIBRATION CLEARED (PDF UPLOAD) MODAL */}
      {clearModalOpen && activeClearSchedule && (
        <div className="modal-overlay">
          <div className="f-card modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>🔬 Submit Calibration Certificate & Photo</h3>
              <button className="modal-close" onClick={() => { setClearModalOpen(false); setActiveClearSchedule(null); setClearFile(null); setClearImageFile(null); }}>&times;</button>
            </div>
            
            <form onSubmit={handleClearCalibration}>
              <div className="modal-scrollable-body" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--f-bg-secondary)', borderRadius: '6px', border: '1px solid var(--f-border)', fontSize: '13px' }}>
                  <strong>Asset:</strong> {activeClearSchedule.model} ({activeClearSchedule.toolCode})<br />
                  <strong>Current Destination:</strong> {activeClearSchedule.destination}
                </div>

                <div className="f-form-group">
                  <label className="f-label">Calibration Date</label>
                  <input 
                    type="date"
                    className="f-input"
                    value={clearCalDate}
                    onChange={(e) => setClearCalDate(e.target.value)}
                    required
                  />
                </div>

                <div className="f-form-group">
                  <label className="f-label">Upload Certificate (PDF Only)</label>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="f-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setClearFile(e.target.files[0]);
                      }
                    }}
                    required
                  />
                </div>

                <div className="f-form-group" style={{ marginTop: '12px' }}>
                  <label className="f-label">Upload Calibration Photo (Image Only)</label>
                  <input 
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    className="f-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setClearImageFile(e.target.files[0]);
                      }
                    }}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="f-button" onClick={() => { setClearModalOpen(false); setActiveClearSchedule(null); setClearFile(null); setClearImageFile(null); }}>Cancel</button>
                <button type="submit" className="f-button f-button-primary" style={{ backgroundColor: 'var(--f-success)', borderColor: 'var(--f-success)' }}>
                  Submit & Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
