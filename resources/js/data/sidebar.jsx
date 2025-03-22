
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
    // {
    //   id: "cms-airtel",
    //   title: "CMS-Airtel",
    //   path: "/admin/cms-airtel",
    //   icon: <Antenna/>,
    //   permissions: ["admin"],
    
    // },
    // {
    //   id: "bus-booking",
    //   title: "Bus Booking",
    //   path: "/admin/bus-booking",
    //   icon: <Bus/>,
    //   permissions: ["admin"],
    // },
   
    {
      id: "lic",
      title: "LIC",
      path: "/admin/lic",
      icon: <Code/>,
      permissions: ["admin"],
    },
    // {
    //   id: "dmt-bank-1",
    //   title: "DMT Bank 1",
    //   path: "/admin/dmt-bank-1",
    //   icon: <Building/>,
    //   permissions: ["admin"],
    // },
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
      subMenu: [
        {
          id: "utilities-billpayments",
          title: "Bill Payments",
          path: "/admin/utilities/bill-payment",
          permissions: ["admin"],
        },
        // {
        //   id: "utilities-insurancepayments",
        //   title: "Insurance Payment",
        //   path: "/admin/utilities/insurance-payment",
        //   permissions: ["admin"],
        // }
        // ,
        {
          id: "utilities-fastagrecharge",
          title: "Fastag Recharge",
          path: "/admin/utilities/fastag-recharge",
          permissions: ["admin"],
        }
        ,
        {
          id: "utilities-lpgbooking",
          title: "LPG Booking and Payment",
          path: "/admin/utilities/lpg-booking",
          permissions: ["admin"],
        },
        {
          id: "utilities-municipalitypayment",
          title: "Municipality Payment",
          path: "/admin/utilities/municipality-payment",
          permissions: ["admin"],
        }

      ]
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
    },
    {
      id: "memberdetails",
      title: "Member Details",
      path: "/admin/members",
      icon: <CalendarRange  />,
      permissions: ["admin"],
    }
  ];