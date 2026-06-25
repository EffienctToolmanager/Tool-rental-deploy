import type { Meta, StoryObj } from '@storybook/react';
import InventoryTable from './InventoryTable';
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
    calDate: '2026-04-15', // calibration expired / warning
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

const meta: Meta<typeof InventoryTable> = {
  title: 'Components/InventoryTable',
  component: InventoryTable,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof InventoryTable>;

export const Default: Story = {
  args: {
    assets: mockAssets,
    selectedToolCodes: [],
    setSelectedToolCodes: () => {},
    onNavigateToCheckout: () => alert('Navigating to checkout...'),
  },
};

export const WithSelections: Story = {
  args: {
    assets: mockAssets,
    selectedToolCodes: ['EQ-001'],
    setSelectedToolCodes: () => {},
    onNavigateToCheckout: () => alert('Navigating to checkout...'),
  },
};
