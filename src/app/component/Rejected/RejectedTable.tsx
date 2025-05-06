import React, { useEffect, useState } from "react";
import { Decryptor } from "@/security";
import { tr } from "date-fns/locale";

interface RequestItem {
  name: string;
  reason?: string;
  acctid: string;
  created_at: string;
  approved_by: string;
}

export default function RejectedTable({ data, onView, onDelete }: any) {
    const [showSample, setShowSample] = useState(true);
    const [rejectedRequest,setRejectedRequest]=useState<RequestItem[]>([]);

     const  token = Decryptor(localStorage.getItem("token")|| "");
     const user_id = localStorage.getItem("user_id");
    async function fetchRejectedRequest(){
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/rejected/requests/list/${Decryptor(user_id || "")}/`,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
          "Authorization": `Bearer ${token}`
        },
      })

      if(response.status === 200){
        const data = await response.json();
        setRejectedRequest(data.data);
      }
    }

    useEffect(()=>{
      fetchRejectedRequest();
    },[])

    return (
        <table className="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Reason</th>
                    <th>Department</th>
                    <th>Date Filed</th>
                    <th>Rejected By</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                  {rejectedRequest?.map((request:any,index:any)=>(
                    <tr key={index}>
                      <td>{request.name}</td>
                      <td>{request.reason?.slice(0, 10) + "..." || "-"}</td>
                      <td>{request.acctid}</td>
                      <td>{request.created_at}</td>
                      <td>{request.approved_by}</td>
                      <td>
                            <button
                                className="btn-outline-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#shiftdrawer"
                                aria-controls="shiftdrawer"
                                style={{marginRight:"20px"}}
                            >
                               <img src="/svg/View.svg" alt="view"  className="eye-view"/>
                            </button>
                            <button
                                className="btn-sm btn-outline-danger"
                                type="button"
                            >
                               <img src="/svg/Delete.svg" alt="delete" />
                            </button>
                        </td>
                    </tr>
                  ))}
            </tbody>
        </table>
    );
}
