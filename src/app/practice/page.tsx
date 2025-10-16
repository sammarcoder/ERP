// 'use client'
// import { eventNames } from 'process'
// import React, { useEffect, useState } from 'react'
// import { email } from 'zod'

// const page = () => {
//     const [data, setData] = useState()

//     useEffect(() => {

//     })
//     const change = (event) => {
//         // const {name, value} = event.target
//         // const Name = name
//         const Value = event.target.value
//         // const newValue = name
//         setData(Value)
//         console.log(newValue)
//         // alert(newVlaue1)
//     }
//     return (
//         <div>
//             {/* <select name='name' onChange={change}>
//                 <option value={1}>1</option>
//                 <option value={2}>2</option>
//             </select> */}
//             <form onChange={change} className=''>
//                 <select>
//                     <option value={1}>1</option>
//                     <option value={2}>2</option>
//                 </select>
//                 <input name='name' onChange={change} value={data} />
//                 <input name='input2' onChange={change} value={data} />
//                 <button value={12}>click</button>
//                 <p value={12}>{data}</p>

//             </form>

//         </div>
//     )
// }

// export default page;

















// Use FormData 

// 'use client'
// import React from 'react'
// import { object } from 'zod'

// const page = () => {

//     const handleSubmit = (event) => {
//         event.preventDefault()
//         const formData = new FormData(event.target)
//         console.log(formData.get('userName'))
//         console.log(formData.get('checki'))
//         const data = Object.fromEntries(formData.entries())
//         console.log(data)
//     }
//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input type='text' name='userName' />
//                 <input type='radio' name='checki' />
//                 <button>ccc</button>
//             </form>

//         </div>
//     )
// }

// export default page




// User Server 


// import React from 'react'

// const page = (formData) => {
//     'use server'
//     const handleSubmit = () =>{

//     }

//   return (
//         <div>

//         </div>
//     )
//     }

//     export default page















// export default function Form() {
//   // Create state object manually
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     country: ''
//   });

//   // Update state on each input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value  // Dynamic key update
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form data:', formData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input 
//         name="username"
//         value={formData.username}
//         onChange={handleChange}
//       />
//       <input 
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//       />
//       <button type="submit">Submit</button>
//     </form>
//   );
// }






























// 'use client';
// import { useState } from 'react';

// export default function ProfessionalForm() {
//   const [errors, setErrors] = useState({});

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Get all data at once using FormData
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());

//     // Validation
//     const newErrors = {};
//     if (!data.username) newErrors.username = 'Required';
//     if (!data.email) newErrors.email = 'Required';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     console.log('Valid data:', data);

//     // Send to API
//     fetch('/api/submit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <input 
//           name="username"
//           placeholder="Username"
//           className="border p-2 rounded"
//         />
//         {errors.username && <span className="text-red-500">{errors.username}</span>}
//       </div>

//       <div>
//         <input 
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="border p-2 rounded"
//         />
//         {errors.email && <span className="text-red-500">{errors.email}</span>}
//       </div>

//       <select name="country" className="border p-2 rounded">
//         <option value="">Select Country</option>
//         <option value="usa">USA</option>
//         <option value="uk">UK</option>
//       </select>

//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//         Submit
//       </button>
//     </form>
//   );
// }























// import React from 'react'
// import ClassFilter from '../../components/ClassFilter'
// const page = () => {
//   return (
//     <div>
//       <ClassFilter/>
//     </div>
//   )
// }

// export default page





// 'use client'
// import React, { useState } from 'react'
// // let count = 2
// const page = () => {
//   const [count, setCount] = useState(1);
//   const increment = () => {
//   setCount(count+1)
// }
//   return (
//     <>
//     <select >
//       <option value={1}>1</option>
//     </select>
//       <div>this is pratice page</div>
//       <p>{count}</p>
//       <button onClick={increment}>click</button>
//     </>
//   )
// }

// export default page





























































'use client'
import React, { useState } from 'react'
// let count = 2
const page = () => {
  const [count, setCount] = useState(1);
  const increment = () => {
  setCount(count+1)
}
  return (
    <>
    <select >
      <option value={1}>1</option>
    </select>
      <div>this is pratice page</div>
      <p>{count}</p>
      <button onClick={increment}>click</button>
    </>
  )
}

export default page








