import React, { useEffect, useState } from 'react';
import TableStructureCommision from '@/Layouts/tableStructureCommision';

// Assuming there's an API to fetch CMS data (replace with your actual API)
// import { CmsList } from '@/lib/apis'; // Hypothetical API import

export default function BusService() {
  // const [data, setData] = useState([]); // Initialize as empty array to avoid errors

  // Define dynamic columns
const columns = [
    { key: 'id', label: 'id' }, // Swapped order: ID first (assumed unique identifier)
    { key: 'name', label: 'name' }, // Assuming 'airtel' is the name field
  ];

const data = [
    { id: 1, name: "Red Bus" },
    { id: 2, name: "BusBud" },
    { id: 3, name: "EaseMyTrip" },
    { id: 3, name: "Nuego" },
    { id: 3, name: "Abhi Bus" },
  ];

  // useEffect(() => {
  //   async function fetchCmsData() {
  //     try {
  //       const response = await CmsList(); // Fetch CMS data (replace with actual API)
  //       setData(response.data.data || []); // Set data or empty array if no data
  //     } catch (error) {
  //       console.error("Error fetching CMS data:", error);
  //       setData([]); // Fallback to empty array on error
  //     }
  //   }
  //   fetchCmsData();
  // }, []); // Empty dependency array to fetch once on mount

  return (
    <div className='max-w-full bg-gray-100 mt-6'>
      <div className='bg-gray-700 flex justify-between p-4'>
        <h3 className='text-white font-bold'>Airtel Commission</h3>
      </div>

      {/* Pass Columns & Data */}
      <TableStructureCommision columns={columns} data={data} />
    </div>
  );
}