// components/BillPaymentDashboard.js
import React, { useState, useEffect } from 'react';
import { getBillpaymentdata } from '@/lib/apis'; // Adjusted path
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

const BillPaymentDashboard = () => {
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
      const result = await getBillpaymentdata();
      console.log('Fetched Bill Payment Data:', result); // Debug: Check the raw data
      setData(result);
      applyFilter(result, filter, startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch bill payment data:', error);
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
        const dateAdded = new Date(item.date_added);
        return dateAdded >= startDate && dateAdded <= endDate;
      });
    } else {
      // Apply predefined filter (Daily, Weekly, Monthly)
      switch (filterType) {
        case 'Daily':
          filtered = filtered.filter(item => {
            const dateAdded = new Date(item.date_added);
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
          filtered = filtered.filter(item => new Date(item.date_added) >= weekAgo);
          break;
        case 'Monthly':
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(item => new Date(item.date_added) >= monthAgo);
          break;
        default:
          break;
      }
    }

    // If no data matches the filter, fall back to showing all data
    if (filtered.length === 0) {
      filtered = [...data];
    }

    console.log('Filtered Bill Payment Data:', filtered); // Debug: Check the filtered data
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
          (filteredData.filter(item => item.transaction_status.toLowerCase() === 'success').length /
            totalTransactions) *
          100
        ).toFixed(2)
      : 0;
  const totalCommission = filteredData.reduce((sum, item) => sum + parseFloat(item.commission || 0), 0);
  const totalTds = filteredData.reduce((sum, item) => sum + parseFloat(item.tds || 0), 0);
  const totalRefunded = filteredData.reduce((sum, item) => sum + parseFloat(item.refunded || 0), 0);

  // Prepare data for charts
  const dates = [...new Set(filteredData.map(item => new Date(item.date_added).toLocaleDateString()))].sort();
  const amountTrend = dates.map(date =>
    filteredData
      .filter(item => new Date(item.date_added).toLocaleDateString() === date)
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
  );
  const successRateTrend = dates.map(date =>
    filteredData
      .filter(item => new Date(item.date_added).toLocaleDateString() === date)
      .reduce((count, item) => count + (item.transaction_status.toLowerCase() === 'success' ? 1 : 0), 0)
  );
  const commissionTrend = dates.map(date =>
    filteredData
      .filter(item => new Date(item.date_added).toLocaleDateString() === date)
      .reduce((sum, item) => sum + parseFloat(item.commission || 0), 0)
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
    const operator = item.operator_name;
    if (!acc[operator]) {
      acc[operator] = { amount: 0, commission: 0 };
    }
    acc[operator].amount += parseFloat(item.amount || 0);
    acc[operator].commission += parseFloat(item.commission || 0);
    return acc;
  }, {});

  const topOperators = Object.entries(operators)
    .map(([name, { amount, commission }]) => ({ name, amount, commission }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Export data as CSV
  const exportData = () => {
    const csv = [
      [
        'Reference ID',
        'Transaction ID',
        'Operator Name',
        'Customer Number',
        'Amount',
        'Commission',
        'TDS',
        'Refunded',
        'Transaction Status',
        'Date Added',
      ],
      ...filteredData.map(item => [
        item.reference_id,
        item.transaction_id,
        item.operator_name,
        item.customer_number,
        item.amount,
        item.commission,
        item.tds,
        item.refunded,
        item.transaction_status,
        new Date(item.date_added).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bill_payment_transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Bill Payment Dashboard</h1>

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
              <h3 className="text-lg font-semibold">Total TDS</h3>
              <p className="text-2xl">₹{totalTds.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Refunded</h3>
              <p className="text-2xl">₹{totalRefunded.toFixed(2)}</p>
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
                  {operator.name}: ₹{operator.amount.toFixed(2)} (Comm: ₹{operator.commission.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default BillPaymentDashboard;