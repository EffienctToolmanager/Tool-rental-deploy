export type SpecSummary = {
  equipmentType: string;
  measurementRange: string;
  accuracy: string;
  voltageRating: string;
  currentRating: string;
  safetyCategory: string;
  connectivity: string;
  powerSource: string;
  calibrationCycle: string;
  keyFeatures: string[];
  typicalUse: string;
}

export type Asset = {
  toolCode: string;
  brand: string;
  model: string;
  rack: string;
  currentLocation: string;
  calDate: string;
  status: 'Available' | 'Rented' | 'Calibration' | 'Reserved';
  Current_Status?: 'Available' | 'Rented' | 'Calibration' | 'Reserved';
  Brand?: string;
  Asset_Model?: string;
  Tool_Code?: string;
  Location_Rack?: string;
  Current_Location?: string;
  Calibration_Date?: string;
  serialNumber?: string;
  Serial_Number?: string;
  datasheetUrl?: string;
  specSummary?: SpecSummary;
  caseId?: string;
  projectName?: string;
  projectCode?: string;
  userEmail?: string;
  pmEmail?: string;
  expectedReturnDate?: string;
}

export type Rental = {
  caseId: string;
  toolCode: string;
  model: string;
  user: string;
  projectCode: string;
  expectedReturn: string;
  projectName?: string;
  expectedReturnDate?: string;
  userEmail?: string;
  pmEmail?: string;
  id?: string;
}

export type ScheduledCase = {
  id: string;
  toolCode: string;
  model: string;
  sequenceOrder: number;
  stage: 'active_rental' | 'calibration' | 'ongoing';
  destination: string;
  startDate?: string;
  endDate?: string;
  status: 'Scheduled' | 'In_Progress' | 'Completed' | 'Delayed' | 'Pending_Approval';
  userEmail: string;
  pmEmail: string;
  notes?: string;
  projectCode?: string;
  handoverPic?: string;
  handoverPhoto?: string;
  handoverPhotoWebUrl?: string;
  movementType?: 'checkout' | 'return' | 'extension' | 'schedule';
  requestedEndDate?: string;
  rejectReason?: string;
  checklistVerified?: boolean;
  caseId?: string;
  displayCaseId?: string;
}


