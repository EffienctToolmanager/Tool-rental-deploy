import type { Meta, StoryObj } from '@storybook/react';
import ActiveRentals from './ActiveRentals';
import { type Rental } from '../types';

const mockRentals: Rental[] = [
  {
    caseId: 'CASE-001',
    assetCode: 'EQ-001',
    model: 'Multimeter 90',
    user: 'renter@ge.com',
    projectCode: 'PRJ-101',
    expectedReturn: '2026-07-15',
    projectName: 'Wind Turbine Dev',
    expectedReturnDate: '2026-07-15',
    userEmail: 'renter@ge.com',
    pmEmail: 'pm@ge.com',
    id: '1'
  },
  {
    caseId: 'CASE-002',
    assetCode: 'EQ-002',
    model: 'Clamp Meter 376',
    user: 'renter@ge.com',
    projectCode: 'PRJ-102',
    expectedReturn: '2026-05-10', // Overdue since current year is 2026 (or mock today dates)
    projectName: 'Grid Modernization',
    expectedReturnDate: '2026-05-10',
    userEmail: 'renter@ge.com',
    pmEmail: 'pm@ge.com',
    id: '2'
  }
];

const meta: Meta<typeof ActiveRentals> = {
  title: 'Components/ActiveRentals',
  component: ActiveRentals,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ActiveRentals>;

export const Default: Story = {
  args: {
    rentals: mockRentals,
    onRefresh: () => alert('Refresh clicked'),
  },
};

export const Empty: Story = {
  args: {
    rentals: [],
    onRefresh: () => {},
  },
};
