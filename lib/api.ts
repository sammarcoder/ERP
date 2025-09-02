// import axios from 'axios';
// import { EndPoints } from '../constants/api'


// // const data={
// //     "name": "John Doe"
// // }

// export const api = async (data: any) => {
//     return axios.post(EndPoints.POST, data,
//         {
//             headers: { "Content-Type": "application/json" },
//         }
//     )
// }




// import axios from "axios";
// import { EndPoints } from "../constants/api";

// export const api = async (data: any) => {
//   return axios.post(EndPoints.POST, data, {
//     headers: { "Content-Type": "application/json" }
//   });
// };










import { EndPoints } from "../constants/api";
export async function api(data: any) {
  return fetch(EndPoints.POST, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}
