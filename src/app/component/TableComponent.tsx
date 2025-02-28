// import { useEffect, useState } from "react";

// interface TableComponents {
//   data: any;
//   filter: string;
// }

// export default function TableComponents(data: any, filter: string) {
//   const [empData, setEmpData] = useState(data.data);

//   useEffect(() => {
//     // console.log("report", data);
//   }, [empData, filter]);
  

//   const formatTime = (time: number) => {
//     const hours = Math.floor(time / 3600);
//     const minutes = Math.floor((time % 3600) / 60);
//     const seconds = time % 60;

//     const period = hours >= 12 ? "PM" : "AM";
//     const adjustedHours = hours % 12 || 12;

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//       2,
//       "0"
//     )}:${String(seconds).padStart(2, "0")}`;
//   };
//   return (
//     <>
//       {/* ADD ID AT THE TBODY*/}
//       <tbody id="report">
//         {empData.map((instance: any, _i: any) => {
//           const isVisible = instance.name.toUpperCase().includes(filter);
//           return (
//             <tr
              
//               key={_i}
//             >
//               <td>{instance.name}</td>
//               <td>{instance.login}</td>
//               <td>{instance.brkin1}</td>
//               <td>{instance.brkout1}</td>
//               <td>{instance.ob1}</td>
//               <td>{instance.lunchin}</td>
//               <td>{instance.lunchout}</td>
//               <td>{instance.ob3}</td>
//               <td>{instance.brkin2}</td>
//               <td>{instance.brkout2}</td>
//               <td>{instance.ob2}</td>
//               <td>{instance.logoff}</td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </>
//   );
// }
