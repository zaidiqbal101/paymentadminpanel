import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Wallet, CreditCard } from 'lucide-react';
import { balanceApi } from '@/lib/apis';

const Navbar = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [creditBalance, setCreditBalance] = useState(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingCredit, setIsLoadingCredit] = useState(true);

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setIsLoadingWallet(true);
        const result = await balanceApi.getWalletBalance();
        console.log(result)
        
        if (result.success) {
          setWalletBalance(result.balance);
        } else {
          setWalletBalance('Error');
          console.error('Wallet Balance Error:', result.message);
        }
      } catch (error) {
        setWalletBalance('Error');
        console.error('Wallet Balance Fetch Error:', error);
      } finally {
        setIsLoadingWallet(false);
      }
    };

    fetchWalletBalance();
  }, []);

  // Fetch credit balance
  useEffect(() => {
    const fetchCreditBalance = async () => {
      try {
        setIsLoadingCredit(true);
        const result = await balanceApi.getCreditBalance();
        console.log(result)
        
        if (result.success) {
          setCreditBalance(result.balance);
        } else {
          setCreditBalance('Error');
          console.error('Credit Balance Error:', result.message);
        }
      } catch (error) {
        setCreditBalance('Error');
        console.error('Credit Balance Fetch Error:', error);
      } finally {
        setIsLoadingCredit(false);
      }
    };

    fetchCreditBalance();
  }, []);

  // Helper function to format balance
  const formatBalance = (balance) => {
    if (balance === null || balance === 'Error') return 'N/A';
    return `₹${Number(balance).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
    
    <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
      </div>
      
       <div className="flex items-center gap-4">
         {/* Credit Balance */}
         <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs text-gray-600">Credit Balance</p>
            <p className={`text-sm font-semibold ${isLoadingCredit ? 'text-gray-400' : 'text-blue-700'}`}>
              {isLoadingCredit ? 'Loading...' : formatBalance(creditBalance)}
            </p>
          </div>
        </div>
      
        {/* Wallet Balance */}
      
        <div className="flex items-center gap-2 bg-green-50 p-2 rounded-md">
          <Wallet className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-xs text-gray-600">Wallet Balance</p>
            <p className={`text-sm font-semibold ${isLoadingWallet ? 'text-gray-400' : 'text-green-700'}`}>
              {isLoadingWallet ? 'Loading...' : formatBalance(walletBalance)}
            </p>
          </div>
        </div>

       
        
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">3</span>
        </button>
        
        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 rounded-full p-2">
            <User className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;