// "use client";
// import Dashboard from "../Dashboard/dashboard";
// import AddEmp from "../component/AddEmployee";
// import { useEffect, useState } from "react";
// import Header from "../component/Header";
// import { ToastContainer, toast } from 'react-toastify';
// import { IdentifyUser } from "../user_identifier";
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { Decryptor } from "@/security";

// interface Information {
//   empno: number;
//   gender: string;
//   fname: string;
//   lname: string;
//   mname: string;
//   maritalstatus: string;
//   dateofbirth: string;
//   address: string;
//   contactno: string;
//   position: string;
//   acctid: number;
//   un: string;
//   role_id: number;
//   isdayshift: number;
//   status: number;
// }

// export default function EditEmployeeOnly() {
//   const [empData, setEmpData] = useState({});
//   const [currentMode, setCurrentMode] = useState("edit");
//   const [employees, setEmployees] = useState<Information[]>([]);
//   const [user_privilege, setUserPrivilege] = useState([""]);

//   const token = localStorage.getItem("token");
//   const id = localStorage.getItem("user_id");

//   useEffect(() => {
//     GetEmployee();
//   }, []);

//   async function GetEmployee() {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND}/employee/list/${Decryptor(id || "")}/`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Decryptor(token || "")}`,
//         },
//       }
//     );
//     if (response.ok) {
//       const data = await response.json();
//       setEmployees(data.data);
//     }
//   }

//   const handleData = (data: any) => {
//     setCurrentMode("edit");
//     setEmpData(data);
//   };

//   if (localStorage.getItem("user_privilege")) {
//     const array_privilege = IdentifyUser(localStorage.getItem("user_privilege")!);
//     array_privilege.forEach(data => user_privilege.push(data));
//   }

//   return (
//     <div className="crud-maindiv" style={{ backgroundColor: "#e7e7e7", display: "flex" }}>
//       <div className="db-employee">
//         <Dashboard />
//       </div>
//       <div className="main-divv">
//         <Header title="MANAGE EMPLOYEE" />
//         <div className="manageemployee-division px-4">
//           <div className="table-responsive emp-table">
//             <table className="tabemp table table-striped table-hover table-bordered">
//               <thead>
//                 <tr>
//                   <th>Employee No.</th>
//                   <th>First Name</th>
//                   <th>Last Name</th>
//                   <th>Position</th>
//                   <th>Username</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.map((info) => (
//                   <tr key={info.empno}>
//                     <td>{info.empno}</td>
//                     <td>{info.fname}</td>
//                     <td>{info.lname}</td>
//                     <td>{info.position}</td>
//                     <td>{info.un}</td>
//                     <td>
//                       {user_privilege.includes("manage_users") && (
//                         <button
//                           data-bs-toggle="modal"
//                           data-bs-target="#editModal"
//                           type="button"
//                           className="edit-button btn btn-sm btn-outline-primary"
//                           onClick={() => handleData(info)}
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <div
//         className="modal fade"
//         id="editModal"
//         role="dialog"
//         aria-labelledby="exampleModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-lg" role="document">
//           <div className="modal-content px-4 flex-wrap">
//             <AddEmp
//               empData={empData}
//               mode={currentMode}
//               isClose={() => setCurrentMode("edit")}
//               onButtonClick={() => GetEmployee()}
//             />
//           </div>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// }