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

interface ApproveProps {
  onView: (item: ApprovedRequest) => void;
}

interface Accounts {
  acctid: number;
  acctname: string;
}

export default function ApproveTable({ onView }: ApproveProps) {
  const [showSample, setShowSample] = useState(true);
  const [approvedRequest, setApproveRequest] = useState<ApprovedRequest[]>([]);
  const [accounts, setAccounts] = useState<Accounts[]>([]);

  const handleDeleteSample = () => {
    setShowSample(false);

  };

  async function getAccounts() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/list/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAccounts(result.data || []);
      } else {
        console.error("Failed to fetch accounts");
      }
    } catch (error) {
      console.error("Error fetching accounts", error);
    }
  }

    useEffect(() => {
      getAccounts();
      fetchApprovedRequest();
    }, [])

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
          {approvedRequest?.length > 0 ? (
            approvedRequest.map((request: any, index: any) => (
            <tr key={index}>
              <td>{request.name}</td>
              <td>{request.reason?.slice(0, 10) + "..." || "-"}</td>
              <td>{accounts.find((acc)=>acc.acctid === request.acctid)?.acctname || ""}</td>
              <td>{request.created_at}</td>
              <td>{request.approved_by}</td>
              <td>
                <button
                  className="btn-outline-primary"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#approveddrawer"
                  aria-controls="approveddrawer"
                  style={{ marginRight: "20px" }}
                  onClick={() => onView(request)} // Add this
                >
                  <img src="/svg/View.svg" alt="view" className="eye-view" />
                </button>
              </td>
            </tr>
          ))):(
          <tr>
           <td><center>No pending shift adjustment requests at this time</center></td>
          </tr>
          )}
        </tbody>
      </table>
    );
  }

