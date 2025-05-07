import React, { useEffect, useState } from "react";
import { Decryptor } from "@/security";
import { data } from "react-router-dom";
import { tr } from "date-fns/locale";

interface ApprovedRequest {
  name: string;
  reason: string;
  acctid: string | number;
  created_at: string;
  approved_by: string;
}

interface ApprovedTableProps {
  onView: (item: ApprovedRequest) => void;
}

export default function ApprovedTable({ onView }: ApprovedTableProps) {
  const [showSample, setShowSample] = useState(true);
  const [approvedRequest, setApproveRequest] = useState<ApprovedRequest[]>([]);
  

  const handleDeleteSample = () => {
    setShowSample(false);

  };
  const token = Decryptor(localStorage.getItem("token") || "")
  const user_id = localStorage.getItem("user_id");
  async function fetchApprovedRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/approved/requests/list/${Decryptor(user_id || "")}/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      setApproveRequest(data.data);
    }
  }
  useEffect(() => {
    fetchApprovedRequest();
  }, [])

  return (
    <table className="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Reason</th>
          <th>Department</th>
          <th>Date Filed</th>
          <th>Approved By</th>
          <th className="actions-th">Action</th>
        </tr>
      </thead>
      <tbody>
        {approvedRequest?.map((request: any, index: any) => (
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
                style={{ marginRight: "20px" }}
                onClick={() => onView(request)} // Add this
              >
                <img src="/svg/View.svg" alt="view" className="eye-view" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
