"use client"
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import { access } from "fs";

interface DepartmentProps {
    acctid:number,
    acctname:string,
    status:number

}

interface ManagerProps {
    empno: number;
    fname: string;
    lname: string;
  }

export default function ManageDepartment(){
    const [token,setToken]=useState("");
    const [department, setDepartment] = useState<DepartmentProps[]>([]);
    const [manager, setManager] = useState<ManagerProps[]>([]);
    const [showform,setShowForm]=useState(false);


useEffect(()=>{
    const storedToken = localStorage.getItem("token")
    if(storedToken){
        setToken(Decryptor(storedToken));
    }
},[])

useEffect(()=>{
    if(token){
      fetchAccountList(); 
      fetchManagerList();
    }
},[token])
    const fetchAccountList = async ()=>{
        
        try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/list/`,{
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            }
        })
        if(response.status === 200){
            const data = await response.json()
            setDepartment(data.data);
            console.log(department);
        }
      }
      catch(e){
        console.log(e);
      }
        
    } 

    const fetchManagerList = async ()=>{
        
        try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/manager/list/`,{
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            }
        })
        if(response.status === 200){
            const data = await response.json()
            setManager(data.data);
            
        }
      }
      catch(e){
        console.log(e);
      }
        
    } 

    const formShow=()=>{
        setShowForm(true);
    }
    return (
        <div className="container-fluid vh-100">
            <div>
                <center><h3 className="py-2">Manage Department</h3></center>
            </div>
            <div className="d-flex align-items-center   rounded  px-3 py-1 ">
                <button className="fs-5 fw-light text-dark mb-0 border border-1 rounded bg-success text-white p-1"
                onClick={formShow}
                >
                    Add Department <i className="bi bi-plus-circle text-white ms-2 fs-5"></i>
                </button>
            </div>
            {showform && (
                     <div className="ms-3 mt-2 p-3 d-flex align-items-center gap-3 border border rounded">
            
                     <div >
                         <input type="text" 
                             className="form-control p-2 px-3 ml-3"
                             placeholder="Account Name" 
                                 />
                     </div>
                 
                     <div className="ml-3 w-50">
                         <select className="form-select w-50">
                             <option value="">Select Manager</option>
                             {manager.map((manager)=>(
                                 <option key={manager.empno} value={manager.empno}> {manager.fname + " "+manager.lname}</option>
                             ))}
                         </select>
                     </div>
                 
                 </div>
            )}
       
            <div className="ms-3 mt-4">
            <table className="table table-light w-50  table-hover">
                <thead>
                    <tr>
                        <th className="px-1">Account ID</th>
                        <th className="px-1">Account Name</th>
                        <th className="px-1">Status</th>
                        <th className="px-1">Manager/Supervisor</th>
                        <th className="px-1">Action</th>
                    </tr>
                </thead>
                <tbody>
                {department.map((instance) => (
                    <tr key={instance.acctid}>
                        <td>{instance.acctid}</td>
                        <td>{instance.acctname}</td>
                        <td>{instance.status === 1 ? "Active" : "Not Active"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}