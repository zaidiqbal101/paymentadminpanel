import axios from 'axios';




//recharge api

 export const OperatorList=async()=>{
    const operatorList = await axios.post('/admin/recharge');
    return operatorList;
  }

 export const Recharge_Transaction = async()=>{
    const response = await axios.post('/admin/recharge/transaction');
    return response;
  }
 export const fetchAllRechargeCommission= async()=>{
  const response = await axios.post('/admin/recharge/commission');
  console.log(response.data );
  
  return response;
}

  export const fetchRateData = async (id) => {
    try {
      const response = await fetch(`/api/commission-rate/${id}`);
      const rateInfo = await response.json();
      setRateData((prev) => ({
        ...prev,
        [id]: { rate: rateInfo.rate, type: rateInfo.type },
      }));
    } catch (error) {
      console.error("Error fetching rate data:", error);
    }
  };
 
  
  export const updateRechargeCommission = async (operatorId, updatedData) => {
    try {
      const response = await axios.put(`/admin/update-commission-recharge/${operatorId}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating commission:", error.response?.data || error.message);
      throw error;
    }
  };


//cms airtel api

export const fetchAllCMSAirtel= async()=>{
  const response = await axios.post('/admin/cms-airtel-fetch');
  console.log(response.data );
  return response;
}


//utility api

  export const utilityList= async()=>{
    const response = await axios.post('/admin/utility/commission');
    console.log(response.data );
    
    return response;
  }
  
  export const UpdateUtilityCommission = async (operatorId, updatedData) => {
    try {
      const response = await axios.put(`/admin/update-commission-utility/${operatorId}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating commission:", error.response?.data || error.message);
      throw error;
    }}


//gas and fastag api

  export const gasfastagList= async()=>{
      const response = await axios.post('/admin/gasfastag/commission');
      console.log(response.data );
      
      return response;
    }
    
  export const UpdategasfastagCommission = async (id, updatedData) => {
    try {
      const response = await axios.put(`/admin/update-commission-gasfastag/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating commission:", error.response?.data || error.message);
      throw error;
    }}
  


//cms api    

  export const CmsList= async()=>{
      const response = await axios.post('/admin/cms/commission');
      console.log(response.data );
      
      return response;
    }
    
  export const UpdateCMSCommission = async (agentID, updatedData) => {
    try {
      const response = await axios.put(`/admin/update-commission-cms/${agentID}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating commission:", error.response?.data || error.message);
      throw error;
    }
  };


  //dmt api

  // Fetch DMT Bank 1 Commission
export const Bank1List = async () => {
  const response = await axios.post('/admin/dmt-bank1/commission');
  console.log(response.data);
  return response;
};

// Fetch DMT Bank 2 Commission
export const Bank2List = async () => {
  const response = await axios.post('/admin/dmt-bank2/commission');
  console.log(response.data);
  return response;
};

// Update Bank Commission (shared for both)
export const UpdateBankCommission = async (id, updatedData) => {
  try {
    const response = await axios.put(`/admin/update-commission-bank/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating commission:", error.response?.data || error.message);
    throw error;
  }
};




///beneficiary 

export const beneficiarylist1 = async()=>{

const response = await axios.post('/admin/beneficiary1');
return response.data.data;

}
export const beneficiarylist2 = async()=>{

const response = await axios.post('/admin/beneficiary2');
return response.data.data;

}



//get all permission
export const getPermissions= async()=>{

  const response = await axios.post('/admin/permissions');
  return response.data.data;

}

export async function addPermission(permissionData) {
  try {
    console.log('Sending add permission data:', permissionData); // Debug log
    const res = await axios.post('/admin/addnew/permission', permissionData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Add permission response:', res.data); // Debug log
    return res.data;
  } catch (error) {
    console.error('Error adding permission:', error.response?.data || error.message);
    throw error;
  }
}

export async function updatePermission(id, updatedFields) {
  try {
    console.log('Sending update permission data:', { id, updatedFields }); // Debug log
    const res = await axios.post(`/admin/update/permission/${id}`, updatedFields, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Update permission response:', res.data); // Debug log
    return res.data;
  } catch (error) {
    console.error('Error updating permission:', error.response?.data || error.message);
    throw error;
  }
}

export async function deletePermission(id) {
  try {
    console.log('Sending delete permission request for id:', id); // Debug log
    const res = await axios.post(`/admin/delete/permission/${id}`);
    console.log('Delete permission response:', res.data); // Debug log
    return res.data;
  } catch (error) {
    console.error('Error deleting permission:', error.response?.data || error.message);
    throw error;
  }
}
export async function getRoles() {
  try {
    const res = await axios.post('/admin/roles');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}

export async function addRole(roleData) {
  try {
    console.log('Sending add role data to API:', roleData);
    const res = await axios.post('/admin/addnew/role', roleData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Add role API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error adding role:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateRole(id, updatedFields) {
  try {
    console.log('Sending update role data to API:', { id, updatedFields });
    const res = await axios.post(`/admin/update/role/${id}`, updatedFields, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Update role API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating role:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteRole(id) {
  try {
    console.log('Sending delete role request for id:', id);
    const res = await axios.post(`/admin/delete/role/${id}`);
    console.log('Delete role API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error deleting role:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateRolePermissions(roleId, permissionIds) {
  try {
    console.log('Sending update role permissions data:', { roleId, permissionIds });
    const res = await axios.post(`/admin/role/${roleId}/permissions`, { permissions: permissionIds }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Update role permissions API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating role permissions:', error.response?.data || error.message);
    throw error;
  }
}


//dmt banks
export async function getdmtbank2data() {
  try {
    const res = await axios.post('/admin/dmt-bank-2/fetchdata');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}

export async function getlicdata(){
  try {
    const res = await axios.post('/admin/licdata');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}
export async function getMunicipalitydata(){
  try {
    const res = await axios.post('/admin/utilities/municipality-payment-data');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}
export async function getBillpaymentdata(){
  try {
    const res = await axios.post('/admin/utilities/bill-payment-data');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}
export async function getLPGdata(){
  try {
    const res = await axios.post('/admin/utilities/lpg-booking-data');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}
export async function getInsurancedata(){
  try {
    const res = await axios.post('/admin/utilities/insurance-payment-data');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}
export async function getFastagdata(){
  try {
    const res = await axios.post('/admin/utilities/fastag-recharge-data');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
}

//members details

export const getAllMembers = async () => {
  try {
      const response = await axios.post('/admin/member/fetchdetails');
      return response.data;
  } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
  }
};

export const addMember = async (memberData) => {
  try {
      const response = await axios.post('/admin/member/add', memberData);
      return response.data;
  } catch (error) {
      console.error('Error adding member:', error);
      throw error;
  }
};

export const deleteMember = async (id, userType) => {
  try {
      const response = await axios.delete(`/admin/member/delete/${id}`, {
          data: { user_type: userType }, // Pass user_type in the request body
      });
      return response.data;
  } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
  }
};
export const getCommissions = async (userId) => {
  try {
      const response = await axios.get(`/admin/commissions/${userId}`);
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch commissions');
  }
};

// Update commissions for a user
export const updateCommissions = async (userId, commissions) => {
  try {
      const response = await axios.post(`/admin/commissions/${userId}`, commissions);
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update commissions');
  }
};