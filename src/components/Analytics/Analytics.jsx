import { useState, useEffect } from "react";
import { getAnalytics } from "../../services/adminService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import './Analytics.css';

export default function AnalyticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAnalytics();
        // Convert to array of objects for chart
        setStats([
          { name: "Total Users", value: data.total_users },
          { name: "Staff", value: data.total_staff },
          { name: "Customers", value: data.total_customers },
          { name: "Venues", value: data.total_venues }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  return (
    <main className="analytics-page">
      <h1>Admin Analytics</h1>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={stats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#445"/>
            <XAxis dataKey="name" stroke="#cfd8ff" />
            <YAxis stroke="#cfd8ff" />
            <Tooltip />
            <Bar dataKey="value" fill="#e63946" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
