
import {ChartPie,Phone,Antenna,Bus,Cog,Building,Code,Drill,CalendarRange  }  from 'lucide-react';
export const sidebarRoutes = [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/",
      permissions: ["admin"],
    },
    {
      id: "recharge",
      title: "Recharge",
      icon: <ChartPie/>,
      path: "/admin/recharge/dashboard",
      permissions: ["admin"],
      
    },
    {
      id: "cms-airtel",
      title: "CMS-Airtel",
      path: "/admin/cms-airtel",
      icon: <Antenna/>,
      permissions: ["admin"],
      subMenu: [
        {
          id: "cms-airtel-transactions",
          title: "Transactions",
          path: "/admin/cms-airtel/transactions",
          permissions: ["admin"],
        },
        {
          id: "cms-airtel-operators",
          title: "Operators",
          path: "/admin/cms-airtel/operators",
          permissions: ["admin"],
        }
      ]
    },
    {
      id: "bus-booking",
      title: "Bus Booking",
      path: "/admin/bus-booking",
      icon: <Bus/>,
      permissions: ["admin"],
    },
   
    {
      id: "api",
      title: "API",
      path: "/admin/api",
      icon: <Code/>,
      permissions: ["admin"],
    },
    {
      id: "dmt-bank-1",
      title: "DMT Bank 1",
      path: "/admin/dmt-bank-1",
      icon: <Building/>,
      permissions: ["admin"],
    },
    {
      id: "dmt-bank-2",
      title: "DMT Bank 2",
      path: "/admin/dmt-bank-2",
      icon: <Building/>,
      permissions: ["admin"],
    },
    {
      id: "utilities",
      title: "Utilities",
      path: "/admin/utilities",
      icon: <Drill />,
      permissions: ["admin"],
    },
    {
      id: "role&permission",
      title: "Roles & Permission",
      path: "/admin/displaypermissions",
      icon: <Cog />,
      permissions: ["admin"],
      subMenu: [
        {
          id: "roles",
          title: "Roles",
          icon: <Cog />,
          path: "/admin/displayroles",
          permissions: ["admin"],
        },
        {
          id: "permissions",
          title: "Permissions",
          icon: <Phone />,
          path: "/admin/displaypermissions",
          permissions: ["admin"],
        }
      ]
    },
    {
      id: "commision",
      title: "Commission",
      path: "/admin/commission",
      icon: <CalendarRange  />,
      permissions: ["admin"],
    }
  ];