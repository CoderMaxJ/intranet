import React, { useEffect, useState } from "react";
import { Decryptor } from "@/security";
import { data } from "react-router-dom";
import { tr } from "date-fns/locale";
export default function ApprovedTable() {
    const [showSample, setShowSample] = useState(true);
    const [approvedRequest,setApproveRequest]=useState();

    const handleDeleteSample = () => {
        setShowSample(false);
        
    };
    const  token = Decryptor(localStorage.getItem("token")|| "")
    const user_id = localStorage.getItem("user_id");
    async function fetchApprovedRequest(){
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/approved/requests/list/${Decryptor(user_id || "")}/`,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      });

      if(response.status === 200){
        const data = await response.json();
        setApproveRequest(data.data);
      }
    }
    useEffect(()=>{
    fetchApprovedRequest();
    },[])
    
    return (
        <table className="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Reason</th>
                    <th>Department</th>
                    <th>Date Filed</th>
                    <th>Approved By</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
               {approvedRequest?.map((request:any,index:any)=>(
                <tr key={index}>
                    <td>{request.name}</td>
                    <td>{request.reason?.slice(0, 10) + "..." || "-"}</td>
                    <td>{request.acctid}</td>
                    <td>{request.created_at}</td>
                    <td>{request.approved_by}</td>
                    <td>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#shiftdrawer"
                                aria-controls="shiftdrawer"
                                style={{marginRight:"20px"}}
                            >
                                View
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                type="button"
                                onClick={handleDeleteSample}
                            >
                                Delete
                            </button>
                        </td>
                </tr>
               ))}
            </tbody>
        </table>
    );
}
