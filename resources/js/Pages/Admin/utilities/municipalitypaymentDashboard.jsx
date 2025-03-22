// components/MunicipalityDashboard.js
import React, { useState, useEffect } from 'react';
import { getMunicipalitydata } from '@/lib/apis';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MunicipalityDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('Daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getMunicipalitydata();
      console.log(result)
      setData(result);
      applyFilter(result, filter, startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch municipality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data, filterType, start, end) => {
    let filtered = [...data];
    const now = new Date();

    // Apply date range filter if provided
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      filtered = filtered.filter(item => {
        const createdAt = new Date(item.created_at);
        return createdAt >= startDate && createdAt <= endDate;
      });
    } else {
      // Apply predefined filter (Daily, Weekly, Monthly)
      switch (filterType) {
        case 'Daily':
          filtered = filtered.filter(item => {
            const createdAt = new Date(item.created_at);
            return (
              createdAt.getDate() === now.getDate() &&
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            );
          });
          break;
        case 'Weekly':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          filtered = filtered.filter(item => new Date(item.created_at) >= weekAgo);
          break;
        case 'Monthly':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          filtered = filtered.filter(item => new Date(item.created_at) >= monthAgo);
          break;
        default:
          break;
      }
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setStartDate('');
    setEndDate('');
    applyFilter(data, newFilter, '', '');
  };

  const handleDateFilter = () => {
    if (startDate && endDate) {
      applyFilter(data, '', startDate, endDate);
    }
  };

  // Calculate metrics
  const totalTransactions = filteredData.length;
  const totalAmount = filteredData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const avgAmount = totalTransactions ? (totalAmount / totalTransactions).toFixed(2) : 0;
  const successRate =
    totalTransactions > 0
      ? (
          (filteredData.filter(item => item.status === 'SUCCESS').length / totalTransactions) * 100
        ).toFixed(2)
      : 0;
  const totalCommission = filteredData.reduce((sum, item) => sum + parseFloat(item.comm || 0), 0);
  const totalTds = filteredData.reduce((sum, item) => sum + parseFloat(item.tds || 0), 0);

  // Prepare data for charts
  const dates = [...new Set(filteredData.map(item => new Date(item.created_at).toLocaleDateString()))].sort();
  const amountTrend = dates.map(date =>
    filteredData
      .filter(item => new Date(item.created_at).toLocaleDateString() === date)
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
  );
  const successRateTrend = dates.map(date =>
    filteredData
      .filter(item => new Date(item.created_at).toLocaleDateString() === date)
      .reduce((count, item) => count + (item.status === 'SUCCESS' ? 1 : 0), 0)
  );
  const commissionTrend = dates.map(date =>
    filteredData
      .filter(item => new Date(item.created_at).toLocaleDateString() === date)
      .reduce((sum, item) => sum + parseFloat(item.comm || 0), 0)
  );

  const amountChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Amount',
        data: amountTrend,
        borderColor: 'green',
        fill: false,
      },
    ],
  };

  const successRateChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Success Rate (%)',
        data: successRateTrend,
        borderColor: 'green',
        fill: false,
      },
    ],
  };

  const commissionChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Commission',
        data: commissionTrend,
        borderColor: 'orange',
        fill: false,
      },
    ],
  };

  // Top operators by amount
  const operators = filteredData.reduce((acc, item) => {
    const operator = item.operatorname;
    if (!acc[operator]) {
      acc[operator] = { amount: 0, comm: 0 };
    }
    acc[operator].amount += parseFloat(item.amount || 0);
    acc[operator].comm += parseFloat(item.comm || 0);
    return acc;
  }, {});

  const topOperators = Object.entries(operators)
    .map(([name, { amount, comm }]) => ({ name, amount, comm }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Export data as CSV
  const exportData = () => {
    const csv = [
      ['Txn ID', 'Operator Name', 'CA Number', 'Amount', 'Commission', 'TDS', 'Status', 'Refunded', 'Date Added'],
      ...filteredData.map(item => [
        item.txnid,
        item.operatorname,
        item.canumber,
        item.amount,
        item.comm,
        item.tds,
        item.status,
        item.refunded,
        new Date(item.created_at).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'municipality_transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Municipality Dashboard</h1>

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <select
            className="p-2 border rounded"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <input
            type="date"
            className="p-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="dd-mm-yyyy"
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="dd-mm-yyyy"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleDateFilter}
            disabled={!startDate || !endDate}
          >
            Apply Date Filter
          </button>
        </div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={exportData}
        >
          Export Data
        </button>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Transactions</h3>
              <p className="text-2xl">{totalTransactions}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Amount</h3>
              <p className="text-2xl">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Avg. Amount</h3>
              <p className="text-2xl">₹{avgAmount}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className= "text-lg font-semibold">Success Rate</h3>
              <p className="text-2xl">{successRate}%</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Commission</h3>
              <p className="text-2xl">₹{totalCommission.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total TDS</h3>
              <p className="text-2xl">₹{totalTds.toFixed(2)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Amount Trend</h3>
              <Line data={amountChartData} />
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Success Rate by Period</h3>
              <Line data={successRateChartData} />
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Commission Trend</h3>
              <Line data={commissionChartData} />
            </div>
          </div>

          {/* Top Operators */}
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Top Operators by Amount</h3>
            <ul>
              {topOperators.map((operator, index) => (
                <li key={index} className="py-2 border-b">
                  {operator.name}: ₹{operator.amount.toFixed(2)} (Comm: ₹{operator.comm.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default MunicipalityDashboard;