import type { Meta, StoryObj } from '@storybook/react';
import RentalForm from './RentalForm';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
  {
    toolCode: 'EQ-001',
    brand: 'GE',
    model: 'Multimeter 90',
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
  },
  {
    toolCode: 'EQ-002',
    brand: 'Fluke',
    model: 'Clamp Meter 376',
    rack: '1',
    currentLocation: 'Warehouse',
    calDate: '2026-04-15',
    status: 'Available',
    specSummary: {
      equipmentType: 'Clamp Meter',
      measurementRange: '1000A AC/DC',
      accuracy: '2%',
      voltageRating: '1000V',
      currentRating: '1000A',
      safetyCategory: 'CAT IV',
      connectivity: 'Bluetooth',
      powerSource: 'Battery',
      calibrationCycle: '12 Months',
      keyFeatures: ['iFlex probe', 'Inrush measurement'],
      typicalUse: 'Current measurement'
    }
  }
];

const meta: Meta<typeof RentalForm> = {
  title: 'Components/RentalForm',
  component: RentalForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof RentalForm>;

export const Default: Story = {
  args: {
    assets: mockAssets,
    selectedToolCodes: ['EQ-001'],
    setSelectedToolCodes: () => {},
    onSuccess: () => alert('Rental processed successfully!'),
  },
};

export const BulkRental: Story = {
  args: {
    assets: mockAssets,
    selectedToolCodes: ['EQ-001', 'EQ-002'],
    setSelectedToolCodes: () => {},
    onSuccess: () => alert('Bulk rental processed successfully!'),
  },
};
