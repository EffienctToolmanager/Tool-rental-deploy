import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SchedulingTab } from './SchedulingTab';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
  {
    assetCode: 'FLK-87V-01',
    brand: 'Fluke',
    model: '87V',
    zone: 'CCP01',
    rack: 'A1',
    currentLocation: 'Warehouse',
    calDate: '2026-12-31',
    status: 'Available',
    Current_Status: 'Available',
    serialNumber: 'SN-FLK87V-0001'
  }
];

const mockSchedules = [
  {
    id: 'SCH-202606-0001',
    equipmentCode: 'FLK-87V-01',
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
  }
];

describe('SchedulingTab Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/list')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockSchedules })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success' })
      });
    }));
  });

  it('renders the header and scheduled cards in Kanban view', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={false} onRefreshAssets={onRefresh} />);

    expect(screen.getByText(/Successive Tool scheduling & Routing/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/SCH-202606-0001/)).toBeInTheDocument();
      expect(screen.getByText(/Project Site A/)).toBeInTheDocument();
    });
  });

  it('toggles view mode between Kanban and Gantt', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={false} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    const ganttBtn = screen.getByText(/Gantt Timeline/i);
    fireEvent.click(ganttBtn);

    await waitFor(() => {
      expect(screen.getByText('Instrument / Asset')).toBeInTheDocument();
      expect(screen.getByText('87V')).toBeInTheDocument();
    });
  });

  it('respects RBAC - hides Add button and edit actions for non-admins', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={false} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Add Schedule Case/i)).not.toBeInTheDocument();
    expect(screen.queryByTitle('Edit')).not.toBeInTheDocument();
  });

  it('respects RBAC - shows Add button and triggers modal for admins', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={true} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    const addBtn = screen.getByText(/Add Schedule Case/i);
    expect(addBtn).toBeInTheDocument();

    fireEvent.click(addBtn);
    expect(screen.getByText(/Register New Scheduling Case/i)).toBeInTheDocument();
  });
});
