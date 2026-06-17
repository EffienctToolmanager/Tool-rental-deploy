import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SchedulingTab } from './SchedulingTab';
import { type Asset } from '../types';

const mockAssets: Asset[] = [
  {
    toolCode: 'FLK-87V-01',
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
    });
    expect(screen.getAllByText(/Project Site A/)[0]).toBeInTheDocument();
  });

  it('toggles Pending Approval Only filter state', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={false} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    const pendingOnlyBtn = screen.getByText(/Pending Approval Only/i);
    expect(pendingOnlyBtn).toBeInTheDocument();

    // Toggle filter on
    fireEvent.click(pendingOnlyBtn);
    // Since SCH-202606-0001 is In_Progress, it should be filtered out
    await waitFor(() => {
      expect(screen.queryByText('SCH-202606-0001')).not.toBeInTheDocument();
    });

    // Toggle filter off
    fireEvent.click(pendingOnlyBtn);
    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
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

  it('renders conditional handover fields and checklist verified options in modal', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={true} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    const editBtn = screen.getByTitle('Edit');
    fireEvent.click(editBtn);

    // active_rental is selected, so should show "Handover Record Required Fields"
    expect(screen.getByText(/Handover Record Required Fields/i)).toBeInTheDocument();
    expect(screen.getByText(/Handover PIC Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Handover Photo/i)).toBeInTheDocument();
  });

  it('prompts the edit modal with target stage when an outbound stage change is requested from calibration on card', async () => {
    const onRefresh = vi.fn();
    const mockCalSchedules = [
      {
        id: 'SCH-202606-0002',
        toolCode: 'FLK-87V-01',
        model: '87V',
        sequenceOrder: 0,
        stage: 'calibration',
        destination: 'Calibration Lab',
        startDate: '2026-06-10',
        endDate: '2026-06-30',
        status: 'In_Progress',
        userEmail: 'pm@ge.com',
        pmEmail: 'pm@ge.com',
        notes: 'Calibrating unit'
      }
    ];

    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/list')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockCalSchedules })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success' })
      });
    }));

    render(<SchedulingTab assets={mockAssets} isAdmin={true} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0002')).toBeInTheDocument();
    });

    const moveSelect = screen.getByRole('combobox');
    fireEvent.change(moveSelect, { target: { value: 'active_rental' } });

    // Should prompt edit modal
    await waitFor(() => {
      expect(screen.getByText(/Edit Scheduling Case/i)).toBeInTheDocument();
    });
    // And should show Handover Record Required Fields (because it is outbound to active_rental)
    expect(screen.getByText(/Handover Record Required Fields/i)).toBeInTheDocument();
    expect(screen.getByText(/Handover PIC Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Handover Photo/i)).toBeInTheDocument();
  });

  it('instantly transitions to ongoing stage when requested (no validation modal)', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={true} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    const fetchSpy = vi.spyOn(global, 'fetch');
    const moveSelect = screen.getByRole('combobox');
    fireEvent.change(moveSelect, { target: { value: 'ongoing' } });

    // For ongoing stage, it should update directly and not show modal
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/update'), expect.objectContaining({
        method: 'PUT'
      }));
    });
    expect(screen.queryByText(/Edit Scheduling Case/i)).not.toBeInTheDocument();
  });

  it('supports bulk select, project code, and relay scheduling in create modal', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={true} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    const addBtn = screen.getByText(/Add Schedule Case/i);
    fireEvent.click(addBtn);

    expect(screen.getByText(/Register New Scheduling Case/i)).toBeInTheDocument();
    
    // Check elements for bulk selection and project code
    expect(screen.getByText(/Select Equipment \(Select Multiple\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Code/i)).toBeInTheDocument();
    expect(screen.getByText(/🔄 Relay Scheduling Flow/i)).toBeInTheDocument();
    
    // Verify first schedule step card is rendered
    expect(screen.getByText(/Schedule 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Project Name/i)[0]).toBeInTheDocument();
  });

  it('filters schedules based on search term', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={false} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search schedules.../i);
    fireEvent.change(searchInput, { target: { value: 'Non-existent-term' } });

    // The schedule card should be filtered out
    expect(screen.queryByText('SCH-202606-0001')).not.toBeInTheDocument();

    // Clear search term
    fireEvent.change(searchInput, { target: { value: 'Project Site A' } });
    expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
  });

  it('supports selecting cards and showing bulk actions panel', async () => {
    const onRefresh = vi.fn();
    render(<SchedulingTab assets={mockAssets} isAdmin={true} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0001')).toBeInTheDocument();
    });

    // Bulk actions panel should not be visible when no cards are selected
    expect(screen.queryByText(/Selected 1 tool cards/i)).not.toBeInTheDocument();

    // Find and click the checkbox on the card
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Bulk actions panel should now be visible
    expect(screen.getByText(/Selected 1 tool cards/i)).toBeInTheDocument();

    // Click "Deselect All"
    const deselectBtn = screen.getByText(/Deselect All/i);
    fireEvent.click(deselectBtn);
    expect(checkbox).not.toBeChecked();
    expect(screen.queryByText(/Selected 1 tool cards/i)).not.toBeInTheDocument();
  });

  it('renders handover fields when a calibration step status is changed to Completed (to be cleared) in edit modal', async () => {
    const onRefresh = vi.fn();
    const mockCalSchedules = [
      {
        id: 'SCH-202606-0003',
        toolCode: 'FLK-87V-01',
        model: '87V',
        sequenceOrder: 0,
        stage: 'calibration',
        destination: 'Calibration Lab',
        startDate: '2026-06-10',
        endDate: '2026-06-30',
        status: 'In_Progress',
        userEmail: 'pm@ge.com',
        pmEmail: 'pm@ge.com',
        notes: 'Calibrating'
      }
    ];

    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/list')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockCalSchedules })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success' })
      });
    }));

    render(<SchedulingTab assets={mockAssets} isAdmin={true} onRefreshAssets={onRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('SCH-202606-0003')).toBeInTheDocument();
    });

    const editBtn = screen.getByTitle('Edit');
    fireEvent.click(editBtn);

    // Initial stage is calibration and status is In_Progress. Handover fields should NOT be shown yet.
    expect(screen.queryByText(/Handover Record Required Fields/i)).not.toBeInTheDocument();

    // Change status to Completed
    const comboboxes = screen.getAllByRole('combobox');
    const statusSelect = comboboxes.find(select => select.querySelector('option[value="Completed"]'));
    if (!statusSelect) throw new Error("Could not find status select");
    fireEvent.change(statusSelect, { target: { value: 'Completed' } });

    // Now handover fields should be shown
    await waitFor(() => {
      expect(screen.getByText(/Handover Record Required Fields/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Handover PIC Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Handover Photo/i)).toBeInTheDocument();
  });
});

