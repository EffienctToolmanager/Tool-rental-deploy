import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActiveRentals from './ActiveRentals';
import { type Rental } from '../types';

const mockRentals: Rental[] = [
  {
    caseId: 'CASE-001',
    toolCode: 'EQ-001',
    model: 'Multimeter 90',
    user: 'renter@ge.com',
    projectCode: 'PRJ-101',
    expectedReturn: '2026-07-15',
    projectName: 'Wind Turbine Dev',
    expectedReturnDate: '2026-07-15',
    userEmail: 'renter@ge.com',
    pmEmail: 'pm@ge.com',
    id: '1'
  }
];

describe('ActiveRentals Component', () => {
  it('renders active rentals case monitor correctly', () => {
    const onRefresh = vi.fn();

    render(
      <ActiveRentals 
        rentals={mockRentals}
        onRefresh={onRefresh}
      />
    );

    expect(screen.getByText('Active Rentals Monitor')).toBeInTheDocument();
    expect(screen.getByText('CASE-001')).toBeInTheDocument();
    expect(screen.getAllByText('Wind Turbine Dev')[0]).toBeInTheDocument();
  });

  it('filters rentals when searching', () => {
    const onRefresh = vi.fn();

    render(
      <ActiveRentals 
        rentals={mockRentals}
        onRefresh={onRefresh}
      />
    );

    const filterInput = screen.getByPlaceholderText(/Search by project/i);
    fireEvent.change(filterInput, { target: { value: 'Nonexistent' } });
    
    expect(screen.queryByText('CASE-001')).not.toBeInTheDocument();
  });
});
