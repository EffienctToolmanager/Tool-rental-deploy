import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryTable from './InventoryTable';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
  {
    toolCode: 'EQ-001',
    brand: 'GE',
    model: 'Multimeter 90',
    zone: 'CCP01',
    rack: 'A1',
    serialNumber: 'SN-001',
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
    const setSelectedToolCodes = vi.fn();
    const onNavigateToCheckout = vi.fn();

    render(
      <InventoryTable 
        assets={mockAssets}
        selectedToolCodes={[]}
        setSelectedToolCodes={setSelectedToolCodes}
        onNavigateToCheckout={onNavigateToCheckout}
      />
    );

    expect(screen.getByText('Master Asset Inventory')).toBeInTheDocument();
    expect(screen.getByText('EQ-001')).toBeInTheDocument();
    expect(screen.getByText('GE')).toBeInTheDocument();
    expect(screen.getByText('SN-001')).toBeInTheDocument();
    expect(screen.getByText('CCP01')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('shows selection bar when assets are selected', () => {
    const setSelectedToolCodes = vi.fn();
    const onNavigateToCheckout = vi.fn();

    render(
      <InventoryTable 
        assets={mockAssets}
        selectedToolCodes={['EQ-001']}
        setSelectedToolCodes={setSelectedToolCodes}
        onNavigateToCheckout={onNavigateToCheckout}
      />
    );

    expect(screen.getByText(/planned rental assets selected/i)).toBeInTheDocument();
    expect(screen.getByText('Go to Smart Checkout ➜')).toBeInTheDocument();
  });

  it('filters assets by search keyword', async () => {
    const setSelectedToolCodes = vi.fn();
    const onNavigateToCheckout = vi.fn();
    
    const doubleAssets: Asset[] = [
      ...mockAssets,
      {
        toolCode: 'EQ-002',
        brand: 'Fluke',
        model: '87V',
        zone: 'CCP02',
        rack: 'B1',
        serialNumber: 'SN-FLK87V-999',
        currentLocation: 'Field Site',
        calDate: '2026-09-01',
        status: 'Available'
      }
    ];

    render(
      <InventoryTable 
        assets={doubleAssets}
        selectedToolCodes={[]}
        setSelectedToolCodes={setSelectedToolCodes}
        onNavigateToCheckout={onNavigateToCheckout}
      />
    );

    // Initial render shows both
    expect(screen.getByText('EQ-001')).toBeInTheDocument();
    expect(screen.getByText('EQ-002')).toBeInTheDocument();

    // Type Fluke in search input
    const searchInput = screen.getByPlaceholderText(/search by model/i);
    fireEvent.change(searchInput, { target: { value: 'Fluke' } });

    // Should only show EQ-002
    expect(screen.queryByText('EQ-001')).not.toBeInTheDocument();
    expect(screen.getByText('EQ-002')).toBeInTheDocument();
  });
});

