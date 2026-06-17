import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RentalForm from './RentalForm';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
  {
    toolCode: 'EQ-001',
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

describe('RentalForm Component', () => {
  it('renders form fields correctly', () => {
    const setSelectedToolCodes = vi.fn();
    const onSuccess = vi.fn();

    render(
      <RentalForm 
        assets={mockAssets}
        selectedToolCodes={['EQ-001']}
        setSelectedToolCodes={setSelectedToolCodes}
        onSuccess={onSuccess}
      />
    );

    expect(screen.getByPlaceholderText(/search serial or model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/requester email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pm email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expected return date/i)).toBeInTheDocument();
  });

  it('updates form inputs correctly', () => {
    const setSelectedToolCodes = vi.fn();
    const onSuccess = vi.fn();

    render(
      <RentalForm 
        assets={mockAssets}
        selectedToolCodes={['EQ-001']}
        setSelectedToolCodes={setSelectedToolCodes}
        onSuccess={onSuccess}
      />
    );

    const projectNameInput = screen.getByLabelText(/project name/i) as HTMLInputElement;
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } });
    expect(projectNameInput.value).toBe('Test Project');
  });
});
