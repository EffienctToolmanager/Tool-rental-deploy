import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend as ReLegend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import './AnalyticsTab.css';

interface AnalyticsData {
  rentals_by_project: { name: string, count: number }[];
  calibration_status: { name: string, value: number, color: string }[];
}

const API_BASE = "/api";

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
      <div className="analytics-header">
        <h2 className="analytics-title">Analytics & Compliance Reports</h2>
        <button 
          className="f-button f-button-primary" 
          onClick={triggerDownload}
          disabled={isExporting}
        >
          {isExporting ? 'Generating...' : '📥 Download Monthly Report (CSV)'}
        </button>
      </div>

      <div className="analytics-charts-grid">
        {/* Project Utilization Bar Chart */}
        <div className="f-card analytics-card">
          <h3 className="analytics-card-title">Rentals by Project</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data.rentals_by_project}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ReTooltip />
              <ReLegend />
              <Bar dataKey="count" fill="var(--f-primary)" radius={[4, 4, 0, 0]} name="Rental Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Donut Chart */}
        <div className="f-card analytics-card">
          <h3 className="analytics-card-title">Calibration Compliance Status</h3>
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
                {data.calibration_status.map((entry, index) => {
                  // Map compliance colors to design tokens if matched
                  let cellColor = entry.color;
                  if (entry.name === 'Safe') cellColor = 'var(--f-success)';
                  if (entry.name === 'Expired') cellColor = 'var(--f-error)';
                  return <Cell key={`cell-${index}`} fill={cellColor} />;
                })}
              </Pie>
              <ReTooltip />
              <ReLegend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="f-card kpi-card-primary">
          <div className="kpi-card-label">Total Projects</div>
          <div className="kpi-card-value">{data.rentals_by_project.length}</div>
        </div>
        <div className="f-card kpi-card-success">
          <div className="kpi-card-label">Compliance Rate</div>
          <div className="kpi-card-value">
            {Math.round((data.calibration_status.find(s => s.name === 'Safe')?.value || 0) / 
            data.calibration_status.reduce((a, b) => a + b.value, 0) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
