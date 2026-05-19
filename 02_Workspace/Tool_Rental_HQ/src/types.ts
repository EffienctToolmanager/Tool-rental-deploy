export type Asset = {
  assetCode: string;
  brand: string;
  model: string;
  zone: string;
  rack: string;
  currentLocation: string;
  calDate: string;
  status: 'Available' | 'Rented';
}

export type Rental = {
  caseId: string;
  assetCode: string;
  model: string;
  user: string;
  projectCode: string;
  expectedReturn: string;
}
