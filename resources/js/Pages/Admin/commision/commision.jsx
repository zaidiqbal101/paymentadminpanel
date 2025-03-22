// import React ,{useState,useEffect}from 'react';

// import { services } from '../../data/services';
// import Recharge from './commision/recharge';


// export default function Commision() {
//   const [currentComponent,setCurrentComponent]=useState(<Recharge/>);
//   return (
//     <div className='max-w-full'>

//     <div className='flex justify-evenly'>
//       {services.map((value,index)=>(
//         <span onClick={()=>setCurrentComponent(value.component)} key={index} className={`${value.bg_color}  px-10 rounded-full border-2 border-greay-500 font-medium text-gray-700`}>{value.title}</span>
        
//       ))
//     }
//     </div>

//   <div className="mt-6">
//         {currentComponent} 
//       </div>
//     </div>
//   )
// }
