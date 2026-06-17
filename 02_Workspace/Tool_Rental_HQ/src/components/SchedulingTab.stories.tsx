import type { Meta, StoryObj } from '@storybook/react';
import { SchedulingTab } from './SchedulingTab';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
  {
    toolCode: 'FLK-87V-01',
    brand: 'Fluke',
    model: '87V',
    rack: 'A1',
    currentLocation: 'Warehouse',
    calDate: '2026-12-31',
    status: 'Available',
    Current_Status: 'Available',
    serialNumber: 'SN-FLK87V-0001'
  },
  {
    toolCode: 'FLK-1738-01',
    brand: 'Fluke',
    model: '1738',
    rack: 'B1',
    currentLocation: 'Warehouse',
    calDate: '2026-12-31',
    status: 'Available',
    Current_Status: 'Available',
    serialNumber: 'SN-FLK1738-0001'
  }
];

const mockSchedules = [
  {
    id: 'SCH-202606-0001',
    toolCode: 'FLK-87V-01',
    model: '87V',
    sequenceOrder: 0,
    stage: 'active_rental',
    destination: 'Project Site A',
    startDate: '2026-06-10',
    endDate: '2026-06-30',
    status: 'In_Progress',
    userEmail: 'pm@ge.com',
    pmEmail: 'pm@ge.com',
    notes: 'Current active checkout'
  },
  {
    id: 'SCH-202606-0002',
    toolCode: 'FLK-87V-01',
    model: '87V',
    sequenceOrder: 1,
    stage: 'calibration',
    destination: 'Fluke Cal Lab',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    status: 'Scheduled',
    userEmail: 'cal-specialist@ge.com',
    pmEmail: 'pm@ge.com',
    notes: 'Annual calibration checkup'
  }
];

// Mock fetch globally for Storybook environment
if (typeof window !== 'undefined') {
  window.fetch = window.fetch || (() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: mockSchedules })
  })) as any;
}

const meta: Meta<typeof SchedulingTab> = {
  title: 'Components/SchedulingTab',
  component: SchedulingTab,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SchedulingTab>;

export const ReaderMode: Story = {
  args: {
    assets: mockAssets,
    isAdmin: false,
    onRefreshAssets: () => {},
  },
};

export const AdminMode: Story = {
  args: {
    assets: mockAssets,
    isAdmin: true,
    onRefreshAssets: () => {},
  },
};
