import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsTab from './AnalyticsTab';

const mockAnalyticsData = {
  rentals_by_project: [
    { name: 'Wind Turbine Dev', count: 12 },
  ],
  calibration_status: [
    { name: 'Safe', value: 22, color: '#10B981' },
    { name: 'Expired', value: 2, color: '#D1110A' },
  ]
};

describe('AnalyticsTab Component', () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/reports/analytics')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAnalyticsData)
        } as Response);
      }
      return Promise.resolve({ ok: false } as Response);
    });
  });

  it('renders loading state first, then fetches data and renders charts', async () => {
    render(<AnalyticsTab />);

    expect(screen.getByText(/loading analytics/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Analytics & Compliance Reports')).toBeInTheDocument();
    });

    expect(screen.getByText('Rentals by Project')).toBeInTheDocument();
    expect(screen.getByText('Calibration Compliance Status')).toBeInTheDocument();
  });
});
