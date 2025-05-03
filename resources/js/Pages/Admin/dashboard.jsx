import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, ChevronLeft, ChevronRight, PlusCircle, MinusCircle, Users, CreditCard, AlertCircle, TrendingUp, ShoppingBag, Database } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card,CardContent } from "@/components/ui/card"
import DatePicker from "react-datepicker";
import { beneficiarylist1 ,beneficiarylist2,Recharge_Transaction} from '@/lib/apis';


const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState('2021.06');
  const [dateRange, setDateRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
 const  [beneficary1,setBeneficary1]= useState([]);
 const  [beneficary2,setBeneficary2]= useState([]);
 const  [recharge,setRecharge]= useState([]);

 const totalRechargeAmount = recharge?.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0) || 0;


// State for calculated values
const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
const [dailyIncrease, setDailyIncrease] = useState(0);
const [weeklyIncrease, setWeeklyIncrease] = useState(0);

// Calculate percentages dynamically
useEffect(() => {
  // Total Beneficiaries
  const total = (beneficary1?.length || 0) + (beneficary2?.length || 0);
  setTotalBeneficiaries(total);

  // Daily Increase
  const today = new Date(); // Current system date
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Dynamically calculate yesterday

  const todayCount = (beneficary1?.filter(b => b && new Date(b.created_at).toDateString() === today.toDateString())?.length || 0) +
                    (beneficary2?.filter(b => b && new Date(b.created_at).toDateString() === today.toDateString())?.length || 0);
  const yesterdayCount = (beneficary1?.filter(b => b && new Date(b.created_at).toDateString() === yesterday.toDateString())?.length || 0) +
                        (beneficary2?.filter(b => b && new Date(b.created_at).toDateString() === yesterday.toDateString())?.length || 0);

  const daily = yesterdayCount === 0 ? (todayCount > 0 ? 100 : 0) : ((todayCount - yesterdayCount) / yesterdayCount) * 100;
  setDailyIncrease(Math.round(daily));

  // Weekly Comparison
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Start of this week (Monday)
  startOfThisWeek.setHours(0, 0, 0, 0); // Set to start of day

  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setDate(startOfThisWeek.getDate() - 1); // End of last week (Sunday)
  endOfLastWeek.setHours(23, 59, 59, 999); // Set to end of day

  const startOfLastWeek = new Date(endOfLastWeek);
  startOfLastWeek.setDate(endOfLastWeek.getDate() - 6); // Start of last week (Monday)
  startOfLastWeek.setHours(0, 0, 0, 0); // Set to start of day

  const thisWeekCount = (beneficary1?.filter(b => b && new Date(b.created_at) >= startOfThisWeek && new Date(b.created_at) <= today)?.length || 0) +
                       (beneficary2?.filter(b => b && new Date(b.created_at) >= startOfThisWeek && new Date(b.created_at) <= today)?.length || 0);
  const lastWeekCount = (beneficary1?.filter(b => b && new Date(b.created_at) >= startOfLastWeek && new Date(b.created_at) <= endOfLastWeek)?.length || 0) +
                       (beneficary2?.filter(b => b && new Date(b.created_at) >= startOfLastWeek && new Date(b.created_at) <= endOfLastWeek)?.length || 0);

  const weekly = lastWeekCount === 0 ? (thisWeekCount > 0 ? 100 : 0) : ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
  setWeeklyIncrease(Math.round(weekly));
}, [beneficary1, beneficary2]);

useEffect(()=>{
   async function fetchbeneficiarydata1(){
    try{
    const data= await beneficiarylist1()
  setBeneficary1(data)
    }
    catch(error){
      console.error(error)
    }
   }
   async function fetchbeneficiarydata2(){
    try{
    const data= await beneficiarylist2()
     setBeneficary2(data)
    }
    catch(error){
      console.error(error)
    }
   }
   fetchbeneficiarydata1();
   fetchbeneficiarydata2();

 },[])

 useEffect(()=>{
  async function fetchrechargedata(){
    try{
    const response= await Recharge_Transaction()
    setRecharge(response.data.data);
    }
    catch(error){
      console.error(error)
    }
   }
   fetchrechargedata();
 },[])
 
const walletData = {
    totalBalance: 39990,
    credited: 7800,
    debited: 4250,
    totalRecharge: 12340,
    commissionReceived: 2300,
    debitedFromRecharge: 11450,
    creditedToWallet: 3850
  };
  
  const userStats = {
    remittersAdded: 14,
    merchantsRegistered: 12,
    activeUsers: 98
  };
  
  const transactionData = [
    { month: '01/01', recharge: 1200, payment: 750, commission: 240 },
    { month: '01/08', recharge: 850, payment: 630, commission: 180 },
    { month: '01/15', recharge: 1400, payment: 900, commission: 320 },
    { month: '01/22', recharge: 980, payment: 720, commission: 210 },
    { month: '01/29', recharge: 1100, payment: 800, commission: 260 },
    { month: '02/05', recharge: 1350, payment: 830, commission: 290 },
    { month: '02/12', recharge: 1500, payment: 950, commission: 340 },
    { month: '02/19', recharge: 1200, payment: 880, commission: 310 }
  ];
  
  const merchantData = [
    { name: 'Merchant A', revenue: 8040616, transactions: 345 },
    { name: 'Merchant B', revenue: 6254103, transactions: 287 },
    { name: 'Merchant C', revenue: 4598721, transactions: 213 },
    { name: 'Merchant D', revenue: 7123548, transactions: 320 },
    { name: 'Merchant E', revenue: 5364812, transactions: 250 }
  ];
  
  const transactionTypes = [
    { type: 'Mobile Recharge', count: `${recharge.length}`, value: `${totalRechargeAmount}`},
    { type: 'LIC Payment', count: 120, value: 240000 },
    { type: 'Bus Booking', count: 210, value: 185000 },
    { type: 'DTH Recharge', count: 180, value: 65000 },
    { type: 'Bus Booking', count: 130, value: 120000 }
  ];
  const utilitiesData = [
    { name: "Insurance Payment", amount: 12000 },
    { name: "FASTag Payment", amount: 8000 },
    { name: "LPG Booking", amount: 5000 },
    { name: "Municipality Booking", amount: 7000 },
  ];

  const summaryData = [
    { label: "Total Wallet Balance", value: "₹50,000" },
    { label: "Total Transactions", value: "1,200" },
    { label: "Total Commission", value: "₹5,000" },
    { label: "Other Metric", value: "XYZ" },
  ];
  
  const bookingData = {
    busTotalBookings: 130,
    busRevenue: 120000,
    busCommission: 9600
  };
  
  const recentTransactions = [
    { id: 1, type: 'Credit', amount: 1250, date: '2025-03-09', description: 'Commission' },
    { id: 2, type: 'Debit', amount: 3200, date: '2025-03-08', description: 'Recharge' },
    { id: 3, type: 'Credit', amount: 5000, date: '2025-03-07', description: 'Wallet Load' },
    { id: 4, type: 'Debit', amount: 1800, date: '2025-03-06', description: 'LIC Payment' }
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const calendarData = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, null, null, null]
  ];
  
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const colors=['bg-violet-500' ,'bg-green-500','bg-yellow-500','bg-blue-500']

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className=" mx-auto p-4">
      <div className="bg-white p-4 rounded-lg mb-6 shadow">
      <div className="flex justify-between items-center">
        {summaryData.map((item, index) => (
          <Card key={index} className={`p-4 text-center ${colors[index % colors.length]} `}>
            <CardContent>
              <h3 className="text-lg font-semibold">{item.label}</h3>
              <p className="text-xl font-bold text-primary">{item.value}</p>
            </CardContent>
          </Card>

        ))}
      </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        

          {/* Wallet Balance Card */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-600">Current Balance</h3>
              <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs">+6%</div>
            </div>
            <div className="mt-2 flex items-end">
              <span className="text-2xl font-bold text-gray-800">{walletData.totalBalance.toLocaleString()}</span>
              <span className="ml-1 text-gray-600">₹</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">+10.4% vs last week</div>
          </div>
          
          {/* Added Users */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-600">Users Added</h3>
              <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs">+2%</div>
            </div>
            <div className="mt-2 flex items-end">
              <span className="text-2xl font-bold text-gray-800">{userStats.remittersAdded}</span>
              <span className="ml-1 text-gray-600">Users</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">+3.4% vs last week</div>
          </div>
          
          {/* Beneficiaries */}
          <div className="bg-white p-4 rounded-lg shadow w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-sm text-gray-600">Beneficiaries Added</h3>
        <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs">
          {`+${dailyIncrease}%`}
        </div>
      </div>
      <div className="mt-2 flex items-end">
        <span className="text-2xl font-bold text-gray-800">{totalBeneficiaries}</span>
        <span className="ml-1 text-gray-600">accounts</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {`+${weeklyIncrease}% vs last week`}
      </div>
    </div>
          
          {/* Commissions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-600">Commission Earned</h3>
              <div className="bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs">-3%</div>
            </div>
            <div className="mt-2 flex items-end">
              <span className="text-2xl font-bold text-gray-800">{walletData.commissionReceived.toLocaleString()}</span>
              <span className="ml-1 text-gray-600">₹</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">-2.1% vs last week</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Calendar */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Sales Calendar</h3>
              <div className="flex items-center">
                <button className="p-1"><ChevronLeft size={16} /></button>
                <span className="mx-2">{currentMonth}</span>
                <button className="p-1"><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">{day}</div>
              ))}
              {calendarData.flat().map((day, i) => (
                <div key={i} className={`text-center py-1 text-sm rounded-full ${
                  day === 15 ? 'bg-green-500 text-white' : 
                  day === 22 ? 'bg-blue-500 text-white' : 
                  day ? 'hover:bg-gray-100 cursor-pointer' : ''
                }`}>
                  {day || ''}
                </div>
              ))}
            </div>
          </div>
          
          {/* Transactions Graph */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Transaction Results</h3>
              <div className="text-xs text-blue-600">View More &gt;</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="recharge" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="payment" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Merchant Analysis */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Merchant Analysis</h3>
              <div className="text-xs text-blue-600">View More &gt;</div>
            </div>
            <div className="space-y-4">
              {merchantData.slice(0, 3).map((merchant, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{merchant.name}</span>
                    <span className="font-medium">₹ {merchant.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(merchant.revenue / 10000000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Transaction Types */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Transaction Types</h3>
              <div className="text-xs text-blue-600">View More &gt;</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart 
                layout="vertical" 
                data={transactionTypes.slice(0, 4)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#60A5FA" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Wallet Summary */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Wallet Summary</h3>
              <div className="text-xs text-blue-600">View More &gt;</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <PlusCircle size={16} className="text-green-600" />
                  </div>
                  <span className="text-sm">Credited Amount</span>
                </div>
                <span className="font-medium text-green-600">₹ {walletData.credited.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <MinusCircle size={16} className="text-red-600" />
                  </div>
                  <span className="text-sm">Debited Amount</span>
                </div>
                <span className="font-medium text-red-600">₹ {walletData.debited.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm">Commission Earned</span>
                </div>
                <span className="font-medium text-blue-600">₹ {walletData.commissionReceived.toLocaleString()}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Balance</span>
                  <span className="text-lg font-bold text-gray-800">₹ {walletData.totalBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bus Booking Stats */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Bus Booking Statistics</h3>
              <div className="text-xs text-blue-600">View More &gt;</div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag size={16} className="text-purple-500 mr-2" />
                  <span className="text-sm">Total Bookings</span>
                </div>
                <span className="font-medium">{bookingData.busTotalBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm">Total Revenue</span>
                </div>
                <span className="font-medium">₹ {bookingData.busRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp size={16} className="text-green-500 mr-2" />
                  <span className="text-sm">Commission Earned</span>
                </div>
                <span className="font-medium">₹ {bookingData.busCommission.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Recent Transactions</h3>
              <div className="text-xs text-blue-600">View More &gt;</div>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      {tx.type === 'Credit' ? (
                        <PlusCircle size={16} className="text-green-500 mr-2" />
                      ) : (
                        <MinusCircle size={16} className="text-red-500 mr-2" />
                      )}
                      <span className="text-sm font-medium">{tx.description}</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-6">{tx.date}</div>
                  </div>
                  <span className={`font-medium ${tx.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'Credit' ? '+' : '-'} ₹ {tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Registered Users Stats */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">User Statistics</h3>
              <div className="text-xs text-blue-600">View More &gt;</div>
            </div>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Remitters', value: userStats.remittersAdded, fill: '#4F46E5' },
                      { name: 'Beneficiaries', value: userStats.beneficiariesAdded, fill: '#10B981' },
                      { name: 'Merchants', value: userStats.merchantsRegistered, fill: '#F59E0B' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">Remitters</span>
                </div>
                <span className="font-medium">{userStats.remittersAdded}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Beneficiaries</span>
                </div>
                <span className="font-medium">{userStats.beneficiariesAdded}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">Merchants</span>
                </div>
                <span className="font-medium">{userStats.merchantsRegistered}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;