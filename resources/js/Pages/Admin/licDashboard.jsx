import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { startOfWeek, startOfMonth, format, parseISO } from "date-fns"; // Import date-fns utilities

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { getlicdata } from "@/lib/apis";

const Licdashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [groupedData, setGroupedData] = useState([]); // Store grouped data for charts
  const [timeRange, setTimeRange] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const licData = await getlicdata();
        console.log("Fetched LIC Data:", licData);
        setData(licData);
        setFilteredData(licData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch LIC data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and group data based on date range and time period
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Step 1: Filter by date range
    let filtered = data;
    if (startDate && endDate) {
      filtered = data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    // Step 2: Group data by time range
    let grouped = [];
    if (timeRange === "daily") {
      // Group by day
      const groupedByDay = {};
      filtered.forEach((item) => {
        const date = parseISO(item.created_at);
        const dayKey = format(date, "yyyy-MM-dd"); // Format as YYYY-MM-DD
        if (!groupedByDay[dayKey]) {
          groupedByDay[dayKey] = {
            date: dayKey,
            amount: 0,
            comm: 0,
            tds: 0,
            status: [],
          };
        }
        groupedByDay[dayKey].amount += parseFloat(item.amount || 0);
        groupedByDay[dayKey].comm += parseFloat(item.comm || 0);
        groupedByDay[dayKey].tds += parseFloat(item.tds || 0);
        groupedByDay[dayKey].status.push(item.status);
      });
      grouped = Object.entries(groupedByDay)
        .map(([date, values]) => ({
          date,
          amount: values.amount,
          comm: values.comm,
          tds: values.tds,
          successRate:
            (values.status.filter((s) => s === "1").length / values.status.length) * 100,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (timeRange === "weekly") {
      // Group by week
      const groupedByWeek = {};
      filtered.forEach((item) => {
        const date = parseISO(item.created_at);
        const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
        const weekKey = format(weekStart, "yyyy-MM-dd");
        if (!groupedByWeek[weekKey]) {
          groupedByWeek[weekKey] = {
            date: weekKey,
            amount: 0,
            comm: 0,
            tds: 0,
            status: [],
          };
        }
        groupedByWeek[weekKey].amount += parseFloat(item.amount || 0);
        groupedByWeek[weekKey].comm += parseFloat(item.comm || 0);
        groupedByWeek[weekKey].tds += parseFloat(item.tds || 0);
        groupedByWeek[weekKey].status.push(item.status);
      });
      grouped = Object.entries(groupedByWeek)
        .map(([date, values]) => ({
          date,
          amount: values.amount,
          comm: values.comm,
          tds: values.tds,
          successRate:
            (values.status.filter((s) => s === "1").length / values.status.length) * 100,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (timeRange === "monthly") {
      // Group by month
      const groupedByMonth = {};
      filtered.forEach((item) => {
        const date = parseISO(item.created_at);
        const monthStart = startOfMonth(date);
        const monthKey = format(monthStart, "yyyy-MM");
        if (!groupedByMonth[monthKey]) {
          groupedByMonth[monthKey] = {
            date: monthKey,
            amount: 0,
            comm: 0,
            tds: 0,
            status: [],
          };
        }
        groupedByMonth[monthKey].amount += parseFloat(item.amount || 0);
        groupedByMonth[monthKey].comm += parseFloat(item.comm || 0);
        groupedByMonth[monthKey].tds += parseFloat(item.tds || 0);
        groupedByMonth[monthKey].status.push(item.status);
      });
      grouped = Object.entries(groupedByMonth)
        .map(([date, values]) => ({
          date,
          amount: values.amount,
          comm: values.comm,
          tds: values.tds,
          successRate:
            (values.status.filter((s) => s === "1").length / values.status.length) * 100,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredData(filtered);
    setGroupedData(grouped);
  }, [data, startDate, endDate, timeRange]);

  // Calculate summary metrics
  const totalPolicies = filteredData.length;
  const totalPremium = filteredData.reduce((sum, item) => {
    const amount = parseFloat(item.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const avgPolicyValue = totalPremium / totalPolicies || 0;
  const successRate = (
    (filteredData.filter((item) => item.status === "1").length / totalPolicies) * 100
  ).toFixed(2);
  const totalCommission = filteredData
    .reduce((sum, item) => {
      const comm = parseFloat(item.comm);
      return sum + (isNaN(comm) ? 0 : comm);
    }, 0)
    .toFixed(2);
  const totalTDS = filteredData
    .reduce((sum, item) => {
      const tds = parseFloat(item.tds);
      return sum + (isNaN(tds) ? 0 : tds);
    }, 0)
    .toFixed(2);

  // Prepare data for charts using grouped data
  const chartLabels = groupedData.map((item) => item.date);

  const premiumData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Premium Amount",
        data: groupedData.map((item) => item.amount),
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

  const successRateData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Success Rate (%)",
        data: groupedData.map((item) => item.successRate),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const commissionData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Commission Amount",
        data: groupedData.map((item) => item.comm),
        borderColor: "#FF9800",
        fill: false,
      },
    ],
  };

  // Calculate top insurers
  const insurers = {};
  filteredData.forEach((item) => {
    if (!item.operatorname) return;
    if (!insurers[item.operatorname]) {
      insurers[item.operatorname] = { premium: 0, comm: 0 };
    }
    const amount = parseFloat(item.amount);
    const comm = parseFloat(item.comm);
    insurers[item.operatorname].premium += isNaN(amount) ? 0 : amount;
    insurers[item.operatorname].comm += isNaN(comm) ? 0 : comm;
  });

  const sortedInsurers = Object.entries(insurers)
    .map(([name, { premium, comm }]) => ({ name, premium, comm }))
    .sort((a, b) => b.premium - a.premium);

  // Export data as CSV
  const exportData = () => {
    const csv = filteredData
      .map(
        (row) =>
          `${row.id},${row.amount},${row.comm},${row.tds},${row.created_at},${row.status},${row.operatorname}`
      )
      .join("\n");
    const csvFile = new Blob(
      [`id,amount,comm,tds,created_at,status,operatorname\n${csv}`],
      { type: "text/csv" }
    );
    const downloadLink = document.createElement("a");
    downloadLink.download = "lic_data.csv";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">LIC Dashboard</h1>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button
            onClick={exportData}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-sm text-gray-500">Total Policies</h3>
          <p className="text-xl font-semibold text-gray-800">{totalPolicies}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-sm text-gray-500">Total Premium</h3>
          <p className="text-xl font-semibold text-gray-800">₹{totalPremium}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-sm text-gray-500">Avg. Policy Value</h3>
          <p className="text-xl font-semibold text-gray-800">
            ₹{avgPolicyValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-sm text-gray-500">Success Rate</h3>
          <p className="text-xl font-semibold text-gray-800">{successRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-sm text-gray-500">Total Commission</h3>
          <p className="text-xl font-semibold text-gray-800">
            ₹{totalCommission}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-sm text-gray-500">Total TDS</h3>
          <p className="text-xl font-semibold text-gray-800">₹{totalTDS}</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500 mb-2">Premium Amount Trend</h3>
          <Line data={premiumData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500 mb-2">Success Rate by Period</h3>
          <Bar
            data={successRateData}
            options={{ scales: { y: { beginAtZero: true, max: 100 } } }}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500 mb-2">Commission Trend</h3>
          <Line data={commissionData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
      </div>

      {/* Top Insurers */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm text-gray-500 mb-2">Top Insurers by Premium</h3>
        <ul>
          {sortedInsurers.map((insurer, index) => (
            <li
              key={index}
              className="py-2 border-b last:border-b-0 text-gray-800"
            >
              {insurer.name}: ₹{insurer.premium} (Comm: ₹{insurer.comm.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Licdashboard;