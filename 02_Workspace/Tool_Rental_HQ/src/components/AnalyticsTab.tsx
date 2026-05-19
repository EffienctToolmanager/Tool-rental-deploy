import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend as ReLegend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

interface AnalyticsData {
  rentals_by_project: { name: string, count: number }[];
  calibration_status: { name: string, value: number, color: string }[];
}

const API_BASE = "http://localhost:8000/api";

const AnalyticsTab: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/analytics`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Export logic
  const triggerDownload = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${API_BASE}/reports/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AssetFlow_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!data) return <div style={{ padding: '20px' }}>Loading analytics...</div>;

  return (
    <div className="f-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px' }}>Analytics & Compliance Reports</h2>
        <button 
          className="f-button f-button-primary" 
          onClick={triggerDownload}
          disabled={isExporting}
        >
          {isExporting ? 'Generating...' : '📥 Download Monthly Report (CSV)'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Project Utilization Bar Chart */}
        <div className="f-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '20px' }}>Rentals by Project</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data.rentals_by_project}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ReTooltip />
              <ReLegend />
              <Bar dataKey="count" fill="#5B5FC7" radius={[4, 4, 0, 0]} name="Rental Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Donut Chart */}
        <div className="f-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '20px' }}>Calibration Compliance Status</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={data.calibration_status}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.calibration_status.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ReTooltip />
              <ReLegend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '24px' }}>
        <div className="f-card" style={{ textAlign: 'center', borderTop: '4px solid #5B5FC7' }}>
          <div style={{ fontSize: '12px', color: 'var(--f-text-secondary)' }}>Total Projects</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.rentals_by_project.length}</div>
        </div>
        <div className="f-card" style={{ textAlign: 'center', borderTop: '4px solid #4CAF50' }}>
          <div style={{ fontSize: '12px', color: 'var(--f-text-secondary)' }}>Compliance Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {Math.round((data.calibration_status.find(s => s.name === 'Safe')?.value || 0) / 
            data.calibration_status.reduce((a, b) => a + b.value, 0) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
