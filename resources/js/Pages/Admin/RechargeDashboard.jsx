import React, { useState } from 'react';
import { useEffect } from 'react';
import { ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { 
  Calendar, 
  DollarSign, 
  Phone, 
  Zap, 
  ArrowDown, 
  ArrowUp, 
  Filter 
} from 'lucide-react';
import { OperatorList,Recharge_Transaction  } from '@/lib/apis';
import { transform } from 'framer-motion';



const RechargeDashboard = () => {
  // This would be fetched from your API/backend
  const stats = {
    totalRecharges: 3429,
    totalRevenue: 687500,
    avgTicketSize: 205.45,
    successRate: 96.7,
    yesterdayRecharges: 126,
    comparisonRate: 8.4
  };

  const [Operators,setOperators]=useState();
  const [rechargeTransaction,setRechargeTransaction]=useState([]);
  




  const totalRecharge = (rechargeTransaction && rechargeTransaction.length > 0) 
  ? rechargeTransaction?.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0) 
  : 0;
  console.log(totalRecharge);
  
  const today= new Date().toISOString().split("T")[0];




  const yesterdayTotalRecharge = rechargeTransaction
  .filter((transaction) => transaction.created_at < today) 
  .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

// Calculate Comparison Rate (percentage change from yesterday)
const comparisonRate = yesterdayTotalRecharge
  ? ((totalRecharge - yesterdayTotalRecharge) / yesterdayTotalRecharge) * 100
  : 0;

const rechargeTransactionTillYesterday= rechargeTransaction.filter((transaction)=>transaction.created_at < today)

const totalAvgTicket = (rechargeTransaction && rechargeTransaction.length > 0) ? totalRecharge / rechargeTransaction.length:0;
const totalAvgTickettillyesterday = (rechargeTransaction && rechargeTransaction.length > 0) ? yesterdayTotalRecharge / rechargeTransactionTillYesterday.length:0;

const comparisonRateAvg = yesterdayTotalRecharge
  ? ((totalAvgTicket - totalAvgTickettillyesterday) / totalAvgTickettillyesterday) * 100
  : 0;

const totalSuccessfullTransaction= (rechargeTransaction && rechargeTransaction.length > 0) ? rechargeTransaction.filter((transaction)=> transaction.status==='success').length:0;
console.log(totalSuccessfullTransaction)
const totalSuccessfullTransactiontillyesterday= (rechargeTransactionTillYesterday && rechargeTransactionTillYesterday.length > 0) ? rechargeTransactionTillYesterday.filter((transaction)=> transaction.status==='success').length:0;
console.log(totalSuccessfullTransactiontillyesterday);

const successratetilltoday= (totalSuccessfullTransaction/rechargeTransaction.length)%100;
const successratetillyesterday= (totalSuccessfullTransactiontillyesterday/rechargeTransactionTillYesterday.length)%100;

const comparisonRateSuccess = (successratetilltoday - successratetillyesterday).toFixed(2);


  useEffect(()=>{
    
    async function fetchOperators() {
      try {
        const response = await OperatorList();
        console.log(response.data.data);
        setOperators(response.data.data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    }

    fetchOperators();
    
    async function fetchRecharge_Transaction() {
      try {
        const response = await Recharge_Transaction();
        console.log(response.data.data);
        setRechargeTransaction(response.data.data);

        // setOperators(response.data.data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    }

    fetchRecharge_Transaction();
  },[])

  const processTransactionData = () => {
    // Ensure rechargeTransaction exists
    if (!rechargeTransaction || rechargeTransaction.length === 0) {
      return [];
    }
    
    // Get unique dates
    const dates = [...new Set(rechargeTransaction.map(tx => tx.created_at))].sort();
    
    // Create data points for each date
    const chartData = (dates ?? []).map(date => {  // Ensure dates is always an array
      if (!rechargeTransaction || !Array.isArray(rechargeTransaction)) {
        console.error("rechargeTransaction is undefined or not an array");
        return { date: date.split("T")[0], totalAmount: 0, successRate: 0, avgTicket: 0 };
      }
    
      // Extract only the date part (YYYY-MM-DD)
      const formattedDate = date.split("T")[0]; 
    
      // Filter transactions for this date
      const dateTransactions = rechargeTransaction.filter(tx => 
        tx.created_at?.split("T")[0] === formattedDate
      );
    
      // Ensure dateTransactions is always an array
      const totalAmount = dateTransactions?.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0) || 0;
      const successCount = dateTransactions?.filter(tx => tx.status === 'success')?.length || 0;
      const totalCount = dateTransactions?.length || 0;
      const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;
      const avgTicket = totalCount > 0 ? totalAmount / totalCount : 0;
    
      return {
        date: formattedDate,
        totalAmount,
        successRate,
        avgTicket
      };
    });
    return chartData;
  }
    
  
  const chartData = processTransactionData();
  
  // Safety check - if no data yet, show a message
  if (chartData.length === 0) {
    return <div className="text-center p-8">Waiting for transaction data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recharge Dashboard</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
            <Calendar className="h-4 w-4" />
            <span>Last 30 Days</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-md">
              <Phone className="h-6 w-6" />
            </div>
            <span
  className={`text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center ${
    String(comparisonRate).includes("-") ? "text-white bg-red-500" : "text-white bg-green-500"
  }`}
>
  {String(comparisonRate).includes("-") ? (
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
            vs. till yesterday (₹{yesterdayTotalRecharge} recharges)
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
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">
            vs. last period (₹652,300)
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-md">
              <BarChart className="h-6 w-6" />
            </div>
            <span
  className={`text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center ${
    String(comparisonRateAvg).includes("-")
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100"
  }`}
>
  {String(comparisonRateAvg).includes("-") ? (
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
            vs. last period (₹{totalAvgTickettillyesterday.toFixed(2)})
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-md">
              <Zap className="h-6 w-6" />
            </div>
            <span
  className={`text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center ${
    String(comparisonRateSuccess).includes("-")
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100"
  }`}
>
  {String(comparisonRateSuccess).includes("-") ? (
    <ArrowDown className="h-3 w-3 mr-1" />
  ) : (
    <ArrowUp className="h-3 w-3 mr-1" />
  )}
  {comparisonRateSuccess}%
</span>

          </div>
          <h3 className="text-lg font-medium text-gray-500">Success Rate</h3>
          <p className="text-3xl font-bold">{successratetilltoday.toFixed(2)}%</p>
          <p className="text-sm text-gray-500 mt-2">
            vs. last period ({successratetillyesterday.toFixed(2)}%)
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     <div>

   
     {/* Total Recharge Amount Chart */}

     <div className="mb-8 border rounded-lg p-4 bg-white shadow">
        <h2 className="text-lg font-semibold mb-4">Recharge Amount Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
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
      
      {/* Success Rate Chart */}
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
      
      {/* Average Ticket Chart */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <h2 className="text-lg font-semibold mb-4">Average Ticket Size</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
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
          {Operators &&
  Operators.map((Operator) => {
    // Ensure totalAmount is always a number
    const totalAmount = rechargeTransaction
      ?.filter((transaction) => String(transaction.operator) === String(Operator.operator_id))
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;

    return (
      <div key={Operator.id || Operator.operator_id} className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Circle with First Letter */}
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
            <span className="font-medium">
              {Operator.operator_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            {/* Operator Name */}
            <p className="font-medium">{Operator.operator_name}</p>
          </div>
        </div>
        {/* Display Total Amount */}
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
                  Reference  ID
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
         
              { rechargeTransaction &&  [...rechargeTransaction].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map((transaction)=>{
                return(
                   <tr>
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
   ₹{transaction.amount}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
  <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      transaction.status === 'success' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}
  >
    ₹{transaction.status}
  </span>
</td>

 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
   {new Date(transaction.created_at).toISOString().split('T')[0]}
 </td>
</tr>
                )
              })
              
               
             
}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RechargeDashboard;