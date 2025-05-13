import React, { useEffect, useState } from "react";
import { Decryptor } from "@/security";
import { tr } from "date-fns/locale";

interface RequestItem {
  name: string;
  reason?: string;
  acctid: string;
  created_at: string;
  approved_by: string;
  reason_for_disapproved:string;
}
interface RejectedTableProps {
  data: RequestItem[];
  onView: (item: RequestItem) => void;
}


interface Accounts {
  acctname: string;
  acctid: number;
}

export default function RejectedTable({ onView }: RejectedTableProps) {
  const [showSample, setShowSample] = useState(true);
  const [rejectedRequest, setRejectedRequest] = useState<RequestItem[]>([]);
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const token = Decryptor(localStorage.getItem("token") || "");
  const user_id = localStorage.getItem("user_id");
  const [activeTab, setActiveTab] = useState("pending");


  async function getAccounts() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/list/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
    if (!response.ok) {
      console.error("Faild to fetch accounts")
      return;
    }

    const data = await response.json();
    console.log("Fetched accounts:", data);
    setAccounts(data.data);
  };

  async function fetchRejectedRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/rejected/requests/list/${Decryptor(user_id || "")}/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })

    if (response.status === 200) {
      const data = await response.json();
      setRejectedRequest(data.data);
    }
  }

  useEffect(() => {
    fetchRejectedRequest();
    getAccounts();
  }, [])

  return (
    <table className="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Reason</th>
          <th>Department</th>
          <th>Date Filed</th>
          <th>Rejected By</th>
          <th className="actions-th">Action</th>
        </tr>
      </thead>
      <tbody>
        {rejectedRequest?.length > 0? rejectedRequest.map(((request: any, index: any) => (
          <tr key={index}>
            <td>{request.name}</td>
            <td>{request.reason_for_disapproved?.slice(0, 10) + "..." || "-"}</td>
            <td>{accounts.find((acc) => String(acc.acctid) === String(request.acctid))?.acctname || ""}</td>
            <td>{request.created_at}</td>
            <td>{request.approved_by}</td>
            <td>
              <button
                className="btn-outline-primary"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#rejecteddrawer"
                aria-controls="shiftdrawer"
                style={{ marginRight: "20px" }}
                onClick={() => onView(request)}
              >
                <img src="/svg/View.svg" alt="view" className="eye-view" />
              </button>
            </td>
          </tr>
        ))):(
          <tr>
            <td>
                <p>No rejected request at this time</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
