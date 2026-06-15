import type { Meta, StoryObj } from '@storybook/react';
import AnalyticsTab from './AnalyticsTab';

// Mock window.fetch for Storybook demonstration
const mockAnalyticsData = {
  rentals_by_project: [
    { name: 'Wind Turbine Dev', count: 12 },
    { name: 'Grid Modernization', count: 8 },
    { name: 'Solar Array Sub', count: 4 },
  ],
  calibration_status: [
    { name: 'Safe', value: 22, color: '#10B981' },
    { name: 'Expired', value: 2, color: '#D1110A' },
  ]
};

if (typeof window !== 'undefined') {
  window.fetch = (url: RequestInfo | URL) => {
    const urlString = url.toString();
    if (urlString.includes('/api/reports/analytics')) {
      return Promise.resolve(new Response(JSON.stringify(mockAnalyticsData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    return Promise.resolve(new Response('', { status: 404 }));
  };
}

const meta: Meta<typeof AnalyticsTab> = {
  title: 'Components/AnalyticsTab',
  component: AnalyticsTab,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AnalyticsTab>;

export const Default: Story = {};
