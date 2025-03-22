// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// const DMT1Dashboard = () => {
//   const [transactions, setTransactions] = useState([
//     {
//       ackno: 'TXN001',
//       utr: 'UTR1234567890',
//       txn_status: 1,
//       remitter: 'Jane Smith',
//       benename: 'John Doe',
//       customercharge: '40.00',
//       gst: '6.10',
//       tds: '1.57',
//       netcommission: '29.83',
//       paysprint_share: '2.5',
//       txn_amount: '4000',
//       balance: 2135786.5,
//       remarks: 'Successful Transaction',
//     },
//     // Additional transactions can be added here
//   ]);

//   const totalTransactions = transactions.length;
//   const totalAmount = transactions.reduce((acc, txn) => acc + parseFloat(txn.txn_amount), 0);
//   const totalCommission = transactions.reduce((acc, txn) => acc + parseFloat(txn.netcommission), 0);
//   const totalCustomerCharge = transactions.reduce((acc, txn) => acc + parseFloat(txn.customercharge), 0);
//   const totalGST = transactions.reduce((acc, txn) => acc + parseFloat(txn.gst), 0);
//   const totalTDS = transactions.reduce((acc, txn) => acc + parseFloat(txn.tds), 0);
//   const totalPaysprintShare = transactions.reduce((acc, txn) => acc + parseFloat(txn.paysprint_share), 0);

//   const profitGrowthData = [
//     { month: 'Jan', profit: 10000 },
//     { month: 'Feb', profit: 12000 },
//     { month: 'Mar', profit: 18000 },
//     { month: 'Apr', profit: 15000 },
//     { month: 'May', profit: 20000 },
//   ];

//   return (
//     <div className="p-6 max-w-7xl mx-auto text-gray-800">
//       <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Admin Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <Card className="bg-blue-100 p-4 rounded-lg shadow">
//           <CardContent>
//             <h2 className="text-lg font-semibold text-blue-900">Total Transactions</h2>
//             <p className="text-2xl font-bold mt-2">{totalTransactions}</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-green-100 p-4 rounded-lg shadow">
//           <CardContent>
//             <h2 className="text-lg font-semibold text-green-900">Total Amount</h2>
//             <p className="text-2xl font-bold mt-2">₹ {totalAmount.toFixed(2)}</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-yellow-100 p-4 rounded-lg shadow">
//           <CardContent>
//             <h2 className="text-lg font-semibold text-yellow-900">Net Commission</h2>
//             <p className="text-2xl font-bold mt-2">₹ {totalCommission.toFixed(2)}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Financial Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <Card className="bg-indigo-100 p-4 rounded-lg shadow">
//           <CardContent>
//             <h2 className="text-lg font-semibold text-indigo-900">Customer Charges</h2>
//             <p className="text-2xl font-bold mt-2">₹ {totalCustomerCharge.toFixed(2)}</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-red-100 p-4 rounded-lg shadow">
//           <CardContent>
//             <h2 className="text-lg font-semibold text-red-900">GST Collected</h2>
//             <p className="text-2xl font-bold mt-2">₹ {totalGST.toFixed(2)}</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-purple-100 p-4 rounded-lg shadow">
//           <CardContent>
//             <h2 className="text-lg font-semibold text-purple-900">Paysprint Share</h2>
//             <p className="text-2xl font-bold mt-2">₹ {totalPaysprintShare.toFixed(2)}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Graphical Representation */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Profit Growth</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={profitGrowthData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="profit" fill="#4ade80" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Commission Over Time</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={profitGrowthData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="profit" stroke="#60a5fa" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Transaction Table */}
//       <div className="overflow-x-auto bg-white rounded-lg p-4 shadow">
//         <Table>
//           <TableCaption className="text-sm text-gray-500">Showing latest transactions</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Remitter</TableHead>
//               <TableHead>Beneficiary</TableHead>
//               <TableHead>Amount (₹)</TableHead>
//               <TableHead>Commission (₹)</TableHead>
//               <TableHead>GST (₹)</TableHead>
//               <TableHead>TDS (₹)</TableHead>
//               <TableHead>Share (₹)</TableHead>
//               <TableHead>Balance (₹)</TableHead>
//               <TableHead>Remarks</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {transactions.map((txn, index) => (
//               <TableRow key={index}>
//                 <TableCell>{txn.remitter}</TableCell>
//                 <TableCell>{txn.benename}</TableCell>
//                 <TableCell>{txn.txn_amount}</TableCell>
//                 <TableCell>{txn.netcommission}</TableCell>
//                 <TableCell>{txn.gst}</TableCell>
//                 <TableCell>{txn.tds}</TableCell>
//                 <TableCell>{txn.paysprint_share}</TableCell>
//                 <TableCell>{txn.balance.toFixed(2)}</TableCell>
//                 <TableCell>{txn.remarks}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default DMT1Dashboard;""
