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