// "use client";
// import "bootstrap/dist/css/bootstrap.min.css";
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { Decryptor } from "@/security";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";


// interface DepartmentProps {
//     acctid: number;
//     acctname: string;
//     status: number;
//     manager: string;
// }

// interface ManagerProps {
//     empno: number;
//     fname: string;
//     lname: string;
// }

// export default function ManageDepartment() {
//     const [token, setToken] = useState("");
//     const [department, setDepartment] = useState<DepartmentProps[]>([]);
//     const [manager, setManager] = useState<ManagerProps[]>([]);
//     const [showform, setShowForm] = useState(false);
//     const [accountName, setAccountName] = useState("");
//     const [formVisible, setFormVisible] = useState(true);
//     const [selectedManagerIDs, setSelectedManagerIDs] = useState<{ [key: number]: number }>({});
//     const [targetID, setTargetID] = useState<number>(0);


//     const router = useRouter();
//     useEffect(() => {
//         const storedToken = localStorage.getItem("token");
//         if (storedToken) {
//             setToken(Decryptor(storedToken));
//         }
//     }, []);

//     useEffect(() => {
//         if (token) {
//             fetchAccountList();
//             fetchManagerList();
//         }
//     }, [token]);

//     const fetchAccountList = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/list/`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             if (response.status === 200) {
//                 const data = await response.json();
//                 setDepartment(data.data);
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const fetchManagerList = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/manager/list/`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             if (response.status === 200) {
//                 const data = await response.json();
//                 setManager(data.data);
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const handleSubmit = (e: any) => {
//         e.preventDefault();
//         createAccount();
//     };

//     const createAccount = async () => {
//         try {
//             const requestBody = {
//                 acctname: accountName,
//                 acctid: selectedManagerIDs[0], // Default to the first manager if none selected
//                 status: 1
//             };
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/create/account/project/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(requestBody),
//             });
//             if (response.status === 201) {
//                 alert("Account Created!");
//                 setShowForm(false);
//                 fetchAccountList(); // Refresh account list
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const handleCreateManager = (acctid: number) => {
//         CreateManager(acctid);
//     };

//     const CreateManager = async (acctid: number) => {
//         const selectedManagerID = selectedManagerIDs[acctid];
//         const request_data = {
//             empno: selectedManagerID,
//             acctid: acctid
//         };
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/create/account/manager/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify(request_data)
//             });
//             if (response.status === 201) {
//                 alert("Manager Assigned!");
//                 fetchAccountList();
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const formShow = () => {
//         setShowForm(true);
//     };

//     const formClose = () => {
//         setShowForm(false);
//     };

//     const handleManagerChange = (acctid: number, empno: number) => {
//         setSelectedManagerIDs(prevState => ({
//             ...prevState,
//             [acctid]: empno
//         }));
//     };

    

//     return (
//         <div>
//             <div>
          
//           <form onSubmit={handleSubmit}>
//             <div
//               className="ms-3 w-50 mt-2 p-3 border border rounded position-absolute"
//               style={{
//                 top: "10px",
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 zIndex: 9999,
//                 backgroundColor: '#ffffff',
//               }}
//             >
//               <button
//                 onClick={formClose}
//                 type="button"
//                 className="btn-close position-absolute fs-6"
//                 style={{ top: "10px", right: "10px" }}
//                 aria-label="Close"
//               ></button>
              
//               <div className="d-flex align-items-center gap-3 mt-5">
//                 <input
//                   value={accountName}
//                   onChange={(e) => setAccountName(e.target.value)}
//                   type="text"
//                   className="form-control p-2 px-3 ml-3"
//                   placeholder="Account Name"
//                 />
//                 <button className="btn btn-success btn-sm" type="submit">
//                   Create
//                 </button>
//               </div>
//             </div>
//           </form>
              
//             </div>
//       </div>


//     );
// }