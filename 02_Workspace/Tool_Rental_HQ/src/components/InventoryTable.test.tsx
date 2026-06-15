import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryTable from './InventoryTable';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
  {
    assetCode: 'EQ-001',
    brand: 'GE',
    model: 'Multimeter 90',
    zone: 'A',
    rack: '3',
    currentLocation: 'Warehouse',
    calDate: '2026-08-01',
    status: 'Available',
    specSummary: {
      equipmentType: 'Multimeter',
      measurementRange: '1000V',
      accuracy: '0.05%',
      voltageRating: '1000V',
      currentRating: '10A',
      safetyCategory: 'CAT III',
      connectivity: 'USB',
      powerSource: 'Battery',
      calibrationCycle: '12 Months',
      keyFeatures: ['True RMS', 'Data Logging'],
      typicalUse: 'Electrical testing'
    }
  }
];

describe('InventoryTable Component', () => {
  it('renders table headers and assets correctly', () => {
    const setSelectedAssetCodes = vi.fn();
    const onNavigateToCheckout = vi.fn();

    render(
      <InventoryTable 
        assets={mockAssets}
        selectedAssetCodes={[]}
        setSelectedAssetCodes={setSelectedAssetCodes}
        onNavigateToCheckout={onNavigateToCheckout}
      />
    );

    expect(screen.getByText('Master Asset Inventory')).toBeInTheDocument();
    expect(screen.getByText('EQ-001')).toBeInTheDocument();
    expect(screen.getByText('GE')).toBeInTheDocument();
  });

  it('shows selection bar when assets are selected', () => {
    const setSelectedAssetCodes = vi.fn();
    const onNavigateToCheckout = vi.fn();

    render(
      <InventoryTable 
        assets={mockAssets}
        selectedAssetCodes={['EQ-001']}
        setSelectedAssetCodes={setSelectedAssetCodes}
        onNavigateToCheckout={onNavigateToCheckout}
      />
    );

    expect(screen.getByText(/planned rental assets selected/i)).toBeInTheDocument();
    expect(screen.getByText('Go to Smart Checkout ➜')).toBeInTheDocument();
  });
});
