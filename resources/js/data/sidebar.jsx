import { 
  HandCoins, BatteryCharging, ShieldCheck, Banknote, CreditCard, 
  Drill, CalendarRange, Cog, Users, Phone, GlobeLock 
} from 'lucide-react';

console.log(import.meta.env.VITE_APP_SERVER);
const BASE_URL = import.meta.env.VITE_APP_SERVER === "PRODUCTION" 
  ? "https://uat.nikatby.in/admin/public" 
  : "http://127.0.0.1:8000";

console.log(BASE_URL);

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
    icon: <BatteryCharging />,
    path: `${BASE_URL}/admin/recharge/dashboard`,
    permissions: ["admin"],
  },
  {
    id: "lic",
    title: "LIC",
    path: `${BASE_URL}/admin/lic`,
    icon: <ShieldCheck />,
    permissions: ["admin"],
  },
  {
    id: "dmt-bank-2",
    title: "DMT Bank 2",
    path: `${BASE_URL}/admin/dmt-bank-2`,
    icon: <Banknote />,
    permissions: ["admin"],
  },
  {
    id: "utilities",
    title: "Utilities",
    path: `${BASE_URL}/admin/utilities`,
    icon: <Drill />,
    permissions: ["admin"],
    subMenu: [
      {
        id: "utilities-billpayments",
        title: "Bill Payments",
        path: `${BASE_URL}/admin/utilities/bill-payment`,
        permissions: ["admin"],
      },
      {
        id: "utilities-fastagrecharge",
        title: "Fastag Recharge",
        path: `${BASE_URL}/admin/utilities/fastag-recharge`,
        permissions: ["admin"],
      },
      {
        id: "utilities-lpgbooking",
        title: "LPG Booking and Payment",
        path: `${BASE_URL}/admin/utilities/lpg-booking`,
        permissions: ["admin"],
      },
      {
        id: "utilities-municipalitypayment",
        title: "Municipality Payment",
        path: `${BASE_URL}/admin/utilities/municipality-payment`,
        permissions: ["admin"],
      },
    ],
  },
  {
    id: "role&permission",
    title: "Roles & Permission",
    path: `${BASE_URL}/admin/displaypermissions`,
    icon: <Cog />,
    permissions: ["admin"],
    subMenu: [
      {
        id: "roles",
        title: "Roles",
        icon: <Cog />,
        path: `${BASE_URL}/admin/displayroles`,
        permissions: ["admin"],
      },
      {
        id: "permissions",
        title: "Permissions",
        icon: <Phone />,
        path: `${BASE_URL}/admin/displaypermissions`,
        permissions: ["admin"],
      },
    ],
  },
  {
    id: "commision",
    title: "Commission",
    path: `${BASE_URL}/admin/commission`,
    icon: <Users />,
    permissions: ["admin"],
  },
  {
    id: "memberdetails",
    title: "Member Details",
    path: `${BASE_URL}/admin/members`,
    icon: <Users />,
    permissions: ["admin"],
  },
  {
    id: "bankdetails",
    title: "Bank Details",
    path: `${BASE_URL}/admin/bank`,
    icon: <CreditCard />,
    permissions: ["admin"],
  },
  {
    id: "fundrequest",
    title: "Fund Request",
    path: `${BASE_URL}/admin/fund/request`,
    icon: <HandCoins />,
    permissions: ["admin"],
  },
  {
    id: "ip-whitelisting",
    title: "IP Whitelisting",
    path: `${BASE_URL}/admin/ip-whitelisting`,
    icon: <GlobeLock />,
    permissions: ["admin"],
  },
];
