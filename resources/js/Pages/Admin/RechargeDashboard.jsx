import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, DollarSign, Phone, Zap, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { OperatorList, Recharge_Transaction } from '@/lib/apis';

const RechargeDashboard = () => {
  const [operators, setOperators] = useState([]);
  const [rechargeTransaction, setRechargeTransaction] = useState([]);
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
      const operatorResponse = await OperatorList();
      console.log('Fetched Operators:', operatorResponse.data.data);
      setOperators(operatorResponse.data.data);

      const transactionResponse = await Recharge_Transaction();
      console.log('Fetched Recharge Transactions:', transactionResponse.data.data);
      const formattedData = transactionResponse.data.data.map(item => ({
        ...item,
        created_at: new Date(item.created_at),
      }));
      setRechargeTransaction(formattedData);
      applyFilter(formattedData, filter, startDate, endDate);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data, filterType, start, end) => {
    let filtered = [...data];
    const now = new Date();

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => {
        const dateAdded = new Date(item.created_at);
        return dateAdded >= startDate && dateAdded <= endDate;
      });
      console.log('Date Range Filter Applied:', { startDate, endDate, filtered });
    } else {
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
      console.log(`${filterType} Filter Applied:`, filtered);
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setStartDate('');
    setEndDate('');
    applyFilter(rechargeTransaction, newFilter, '', '');
  };

  const handleDateFilter = () => {
    if (startDate && endDate) {
      applyFilter(rechargeTransaction, '', startDate, endDate);
    }
  };

  // Calculate metrics
  const today = new Date().toISOString().split('T')[0];
  const totalRecharge = filteredData.length > 0 ? filteredData.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0) : 0;

  const yesterdayTotalRecharge = rechargeTransaction
    .filter((transaction) => transaction.created_at < new Date(today))
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);

  const comparisonRate = yesterdayTotalRecharge
    ? ((totalRecharge - yesterdayTotalRecharge) / yesterdayTotalRecharge) * 100
    : 0;

  const rechargeTransactionTillYesterday = rechargeTransaction.filter((transaction) => transaction.created_at < new Date(today));
  const totalAvgTicket = filteredData.length > 0 ? totalRecharge / filteredData.length : 0;
  const totalAvgTicketTillYesterday = rechargeTransactionTillYesterday.length > 0 ? yesterdayTotalRecharge / rechargeTransactionTillYesterday.length : 0;

  const comparisonRateAvg = totalAvgTicketTillYesterday
    ? ((totalAvgTicket - totalAvgTicketTillYesterday) / totalAvgTicketTillYesterday) * 100
    : 0;

  const totalSuccessfulTransaction = filteredData.length > 0 ? filteredData.filter((transaction) => transaction.status === 'success').length : 0;
  const totalSuccessfulTransactionTillYesterday = rechargeTransactionTillYesterday.length > 0 ? rechargeTransactionTillYesterday.filter((transaction) => transaction.status === 'success').length : 0;

  const successRateTillToday = filteredData.length > 0 ? (totalSuccessfulTransaction / filteredData.length) * 100 : 0;
  const successRateTillYesterday = rechargeTransactionTillYesterday.length > 0 ? (totalSuccessfulTransactionTillYesterday / rechargeTransactionTillYesterday.length) * 100 : 0;

  const comparisonRateSuccess = (successRateTillToday - successRateTillYesterday).toFixed(2);

  const processTransactionData = () => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    const dates = [...new Set(filteredData.map(tx => {
      const date = new Date(tx.created_at);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }))].sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));

    const chartData = dates.map(date => {
      const dateTransactions = filteredData.filter(tx => 
        new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) === date
      );

      const totalAmount = dateTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0) || 0;
      const successCount = dateTransactions.filter(tx => tx.status === 'success').length || 0;
      const totalCount = dateTransactions.length || 0;
      const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;
      const avgTicket = totalCount > 0 ? totalAmount / totalCount : 0;

      return {
        date,
        totalAmount,
        successRate,
        avgTicket,
      };
    });

    console.log('Chart Data:', chartData);
    return chartData;
  };

  const chartData = processTransactionData();

  // Top Operators data for export
  const topOperatorsData = operators.map(operator => {
    const totalAmount = filteredData
      .filter((transaction) => String(transaction.operator) === String(operator.operator_id))
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0) || 0;
    return {
      operator_name: operator.operator_name,
      total_amount: totalAmount,
    };
  });

  // Export data as CSV with headings below the data
  const exportData = () => {
    // Summary Metrics Section
    const summaryDataRows = [
      ['Total Recharges', totalRecharge, yesterdayTotalRecharge, comparisonRate.toFixed(2)],
      ['Total Revenue', totalRecharge, yesterdayTotalRecharge, comparisonRate.toFixed(2)],
      ['Avg Ticket Size', totalAvgTicket.toFixed(2), totalAvgTicketTillYesterday.toFixed(2), comparisonRateAvg.toFixed(2)],
      ['Success Rate', successRateTillToday.toFixed(2), successRateTillYesterday.toFixed(2), comparisonRateSuccess],
    ];

    const summaryHeader = ['Metric', 'Value (₹)', 'Yesterday Value (₹)', 'Comparison (%)'];

    // Top Operators Section
    const topOperatorsRows = topOperatorsData.map(operator => [
      operator.operator_name,
      operator.total_amount,
    ]);

    const topOperatorsHeader = ['Operator Name', 'Total Amount (₹)'];

    // Combine sections with headings below the data
    const csv = [
      ['Summary Metrics'],
      ...summaryDataRows,
      summaryHeader,
      [''],
      ['Top Operators'],
      ...topOperatorsRows,
      topOperatorsHeader,
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recharge_dashboard_summary.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recharge Dashboard</h1>
        <div className="flex items-center gap-3">
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
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={exportData}
          >
            Export Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-md">
                  <Phone className="h-6 w-6" />
                </div>
                <span
                  className={`text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center ${
                    String(comparisonRate).includes('-') ? 'text-white bg-red-500' : 'text-white bg-green-500'
                  }`}
                >
                  {String(comparisonRate).includes('-') ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  )}
                  {comparisonRate.toFixed(2)}%
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-500">Total Recharges</h3>
              <p className="text-3xl font-bold">₹{totalRecharge.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">
                vs. till yesterday (₹{yesterdayTotalRecharge.toLocaleString()} recharges)
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-md">
                  <DollarSign className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  5.2%
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold">₹{totalRecharge.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">
                vs. last period (₹{yesterdayTotalRecharge.toLocaleString()})
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-md">
                  <BarChart className="h-6 w-6" />
                </div>
                <span
                  className={`text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center ${
                    String(comparisonRateAvg).includes('-') ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
                  }`}
                >
                  {String(comparisonRateAvg).includes('-') ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  )}
                  {comparisonRateAvg.toFixed(2)}%
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-500">Avg Ticket Size</h3>
              <p className="text-3xl font-bold">₹{totalAvgTicket.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">
                vs. last period (₹{totalAvgTicketTillYesterday.toFixed(2)})
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-md">
                  <Zap className="h-6 w-6" />
                </div>
                <span
                  className={`text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center ${
                    String(comparisonRateSuccess).includes('-') ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
                  }`}
                >
                  {String(comparisonRateSuccess).includes('-') ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  )}
                  {comparisonRateSuccess}%
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-500">Success Rate</h3>
              <p className="text-3xl font-bold">{successRateTillToday.toFixed(2)}%</p>
              <p className="text-sm text-gray-500 mt-2">
                vs. last period ({successRateTillYesterday.toFixed(2)}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-8 border rounded-lg p-4 bg-white shadow">
                <h2 className="text-lg font-semibold mb-4">Recharge Amount Trend</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalAmount"
                        stroke="#0088FE"
                        strokeWidth={2}
                        name="Total Recharge Amount"
                        dot={{ strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mb-8 border rounded-lg p-4 bg-white shadow">
                <h2 className="text-lg font-semibold mb-4">Success Rate by Day</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                      <Legend />
                      <Bar
                        dataKey="successRate"
                        fill="#00C49F"
                        name="Success Rate (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white shadow">
                <h2 className="text-lg font-semibold mb-4">Average Ticket Size</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="avgTicket"
                        stroke="#FF8042"
                        strokeWidth={2}
                        name="Average Ticket Size"
                        dot={{ strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Top Operators</h3>
                <select className="border border-gray-300 rounded-md text-sm p-2">
                  <option value="volume">By Volume</option>
                  <option value="revenue" selected>By Revenue</option>
                </select>
              </div>
              <div className="space-y-4">
                {operators &&
                  operators.map((operator) => {
                    const totalAmount = filteredData
                      .filter((transaction) => String(transaction.operator) === String(operator.operator_id))
                      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0) || 0;

                    return (
                      <div key={operator.id || operator.operator_id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                            <span className="font-medium">
                              {operator.operator_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{operator.operator_name}</p>
                          </div>
                        </div>
                        <p className="font-bold">₹{totalAmount.toLocaleString()}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    [...filteredData]
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((transaction) => (
                        <tr key={transaction.referenceid}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.referenceid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.canumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.operator}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{parseFloat(transaction.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(transaction.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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

export default RechargeDashboard;