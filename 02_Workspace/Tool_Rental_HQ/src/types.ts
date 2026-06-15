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
  assetCode: string;
  brand: string;
  model: string;
  zone: string;
  rack: string;
  currentLocation: string;
  calDate: string;
  status: 'Available' | 'Rented';
  Current_Status?: 'Available' | 'Rented';
  Brand?: string;
  Asset_Model?: string;
  Asset_Code?: string;
  Location_Zone?: string;
  Location_Rack?: string;
  Current_Location?: string;
  Calibration_Date?: string;
  serialNumber?: string;
  Serial_Number?: string;
  datasheetUrl?: string;
  specSummary?: SpecSummary;
}

export type Rental = {
  caseId: string;
  assetCode: string;
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


