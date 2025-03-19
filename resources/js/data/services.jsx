
import {ChartPie,Phone,Antenna,Bus,Cog,Building,Code,Drill,CalendarRange  }  from 'lucide-react';
import CMS from '@/Pages/Admin/commision/cms';
import BusService from '@/Pages/Admin/commision/bus';
import Dmtbank1 from '@/Pages/Admin/commision/dmtbank1';
import Dmtbank2 from '@/Pages/Admin/commision/dmtbank2';
import Recharge from '@/Pages/Admin/commision/recharge';
import Utilities from '@/Pages/Admin/commision/utilities';

export const services = [
  // const colors= ['-500','green-500','violet-500','red-500','yellow-500','blue-500'];


    {
      id: "recharge",
      title: "Recharge",
      icon: <ChartPie/>,
      bg_color:'bg-orange-200',
      component: <Recharge/>,
      permissions: ["admin"],
      
    },
    {
      id: "CMS",
      title: "CMS",
      component: <CMS/>,
      icon: <Antenna/>,
      bg_color:'bg-green-200',
      permissions: ["admin"],
      subMenu: [
        {
          id: "1",
          title: "Airtel",
          path: "/admin/cms-airtel/transactions",
          permissions: ["admin"],
        },
      ]   
    },
    {
      id: "bus-booking",
      title: "Bus",
      component: <BusService/>,
      bg_color:'bg-violet-200',
      icon: <Bus/>,
      permissions: ["admin"],
    },
   
    {
      id: "dmt-bank-1",
      title: "DMT Bank 1",
      component: <Dmtbank1/>,
      bg_color:'bg-blue-200',
      icon: <Building/>,
      permissions: ["admin"],
    },
    {
      id: "dmt-bank-2",
      title: "DMT Bank 2",
      component: <Dmtbank2/>,
      bg_color:'bg-yellow-200',
      icon: <Building/>,
      permissions: ["admin"],
    },
    {
      id: "utilities",
      title: "Utilities",
      component: <Utilities/>,
      bg_color:'bg-red-200',
      icon: <Drill />,
      permissions: ["admin"],
    }
    
  ];