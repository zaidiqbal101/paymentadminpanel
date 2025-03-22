import React, { useState, useEffect } from 'react';
import { getdmtbank2data } from '@/lib/apis';
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

const DMTBank2Dashboard = () => {
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
      const result = await getdmtbank2data();
      console.log('Fetched DMT Bank 2 Data:', result); // Debug: Check the raw data
      // Ensure created_at is parsed as a Date object
      const formattedData = result.map(item => ({
        ...item,
        created_at: new Date(item.created_at),
      }));
      setData(formattedData);
      applyFilter(formattedData, filter, startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch DMT Bank 2 data:', error);
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
      // Ensure endDate includes the full day
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => {
        const dateAdded = new Date(item.created_at);
        return dateAdded >= startDate && dateAdded <= endDate;
      });
      console.log('Date Range Filter Applied:', { startDate, endDate, filtered }); // Debug
    } else {
      // Apply predefined filter (Daily, Weekly, Monthly)
      switch (filterType) {
        case 'Daily':
          filtered = filtered.filter(item => {
            const dateAdded = new Date(item.created_at);
            return (
              dateAdded.getDate() === now.getDate() &&
              dateAdded.getMonth() === now.getMonth() &&
              dateAdded.getFullYear() === now.getFullYear()
            );
          });
          break;
        case 'Weekly':
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          filtered = filtered.filter(item => {
            const dateAdded = new Date(item.created_at);
            return dateAdded >= weekAgo;
          });
          break;
        case 'Monthly':
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(item => {
            const dateAdded = new Date(item.created_at);
            return dateAdded >= monthAgo;
          });
          break;
        default:
          break;
      }
      console.log(`${filterType} Filter Applied:`, filtered); // Debug
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
  const totalAmount = filteredData.reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);
  const avgAmount = totalTransactions ? (totalAmount / totalTransactions).toFixed(2) : 0;
  const successRate =
    totalTransactions > 0
      ? (
          (filteredData.filter(txn => txn.stateresp === 'SUCCESS').length /
            totalTransactions) *
          100
        ).toFixed(2)
      : 0;
  const totalCommission = filteredData.reduce((acc, txn) => acc + parseFloat(txn.netcommission || 0), 0);
  const totalCustomerCharge = filteredData.reduce((acc, txn) => acc + parseFloat(txn.customercharge || 0), 0);
  const totalGST = filteredData.reduce((acc, txn) => acc + parseFloat(txn.gst || 0), 0);
  const totalTDS = filteredData.reduce((acc, txn) => acc + parseFloat(txn.tds || 0), 0);

  // Prepare data for charts
  const dates = [...new Set(filteredData.map(item => {
    const date = new Date(item.created_at);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }))].sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));

  const amountTrend = dates.map(date => {
    const dailyAmount = filteredData
      .filter(item => new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) === date)
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    return dailyAmount;
  });

  const successRateTrend = dates.map(date => {
    const dailySuccess = filteredData
      .filter(item => new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) === date)
      .reduce((count, item) => count + (item.stateresp === 'SUCCESS' ? 1 : 0), 0);
    const dailyTotal = filteredData.filter(item => new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) === date).length;
    return dailyTotal > 0 ? (dailySuccess / dailyTotal) * 100 : 0;
  });

  const commissionTrend = dates.map(date => {
    const dailyCommission = filteredData
      .filter(item => new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) === date)
      .reduce((sum, item) => sum + parseFloat(item.netcommission || 0), 0);
    return dailyCommission;
  });

  console.log('Chart Data:', { dates, amountTrend, successRateTrend, commissionTrend }); // Debug: Check chart data

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

  // Top remitters by amount
  const remitters = filteredData.reduce((acc, item) => {
    const remitter = item.remitter;
    if (!acc[remitter]) {
      acc[remitter] = { amount: 0, commission: 0 };
    }
    acc[remitter].amount += parseFloat(item.amount || 0);
    acc[remitter].commission += parseFloat(item.netcommission || 0);
    return acc;
  }, {});

  const topRemitters = Object.entries(remitters)
    .map(([name, { amount, commission }]) => ({ name, amount, commission }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Export data as CSV
  const exportData = () => {
    const csv = [
      ['Remitter', 'Beneficiary', 'Amount', 'Commission', 'Customer Charge', 'GST', 'TDS', 'State Response', 'Date'],
      ...filteredData.map(item => [
        item.remitter,
        item.benename,
        item.amount,
        item.netcommission,
        item.customercharge,
        item.gst,
        item.tds,
        item.stateresp,
        new Date(item.created_at).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dmt_bank2_transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">DMT Bank 2 Dashboard</h1>

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
              <h3 className="text-lg font-semibold">Success Rate</h3>
              <p className="text-2xl">{successRate}%</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Commission</h3>
              <p className="text-2xl">₹{totalCommission.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Customer Charge</h3>
              <p className="text-2xl">₹{totalCustomerCharge.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total GST</h3>
              <p className="text-2xl">₹{totalGST.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total TDS</h3>
              <p className="text-2xl">₹{totalTDS.toFixed(2)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Amount Trend</h3>
              {dates.length > 0 ? <Line data={amountChartData} /> : <p>No data available for this period.</p>}
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Success Rate by Period</h3>
              {dates.length > 0 ? <Line data={successRateChartData} /> : <p>No data available for this period.</p>}
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Commission Trend</h3>
              {dates.length > 0 ? <Line data={commissionChartData} /> : <p>No data available for this period.</p>}
            </div>
          </div>

          {/* Top Remitters */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Top Remitters by Amount</h3>
            <ul>
              {topRemitters.map((remitter, index) => (
                <li key={index} className="py-2 border-b">
                  {remitter.name}: ₹{remitter.amount.toFixed(2)} (Comm: ₹{remitter.commission.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>

          {/* Transaction Table */}
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3 border">Remitter</th>
                    <th className="p-3 border">Beneficiary</th>
                    <th className="p-3 border">Amount (₹)</th>
                    <th className="p-3 border">Commission (₹)</th>
                    <th className="p-3 border">Customer Charge (₹)</th>
                    <th className="p-3 border">GST (₹)</th>
                    <th className="p-3 border">TDS (₹)</th>
                    <th className="p-3 border">State Response</th>
                    <th className="p-3 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((txn, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 border">{txn.remitter}</td>
                        <td className="p-3 border">{txn.benename}</td>
                        <td className="p-3 border">₹{parseFloat(txn.amount).toFixed(2)}</td>
                        <td className="p-3 border">₹{parseFloat(txn.netcommission).toFixed(2)}</td>
                        <td className="p-3 border">₹{parseFloat(txn.customercharge).toFixed(2)}</td>
                        <td className="p-3 border">₹{parseFloat(txn.gst).toFixed(2)}</td>
                        <td className="p-3 border">₹{parseFloat(txn.tds).toFixed(2)}</td>
                        <td className="p-3 border">{txn.stateresp}</td>
                        <td className="p-3 border">{new Date(txn.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-3 text-center">
                        No transactions found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DMTBank2Dashboard;