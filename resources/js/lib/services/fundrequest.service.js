import axios from 'axios';

// Define the base URL based on the environment
const BASE_URL = import.meta.env.VITE_APP_SERVER === "PRODUCTION" 
    ? "https://uat.nikatby.in/admin/public" 
    : "http://127.0.0.1:8000";

// Ensure cookies are sent with requests (for session-based authentication)
axios.defaults.withCredentials = true;

// Recharge APIs
export const FundRequestStatus = async (id, status) => {
    const response = await axios.put(`${BASE_URL}/api/fund-requests/${id}/status`,{status});
    return response;
};
export const FundRequestData = async (id) => {
    const response = await axios.get(`/api/fund-requests`);
    console.log(response);
    

    return response.data.fund_requests;
};