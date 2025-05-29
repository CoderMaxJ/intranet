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
  current_page: number;
}

interface ApproveProps {
  onView: (item: ApprovedRequest) => void;
  current_page: number;
  total: number;
}

interface Accounts {
  acctid: number;
  acctname: string;

}

export default function ApproveTable({ onView }: ApproveProps) {

  const [showSample, setShowSample] = useState(true);
  const [approvedRequest, setApproveRequest] = useState<ApprovedRequest[]>([]);
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [current_page, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [total, setTotal] = useState(0);


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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/approved/requests/list/${Decryptor(user_id || "")}/?page=${current_page}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      setApproveRequest(data.data);
      setTotalPage(data.num_pages);
      setTotal(data.total);

    }
  }

  useEffect(() => {
    fetchApprovedRequest();
  }, [current_page])


  const changePage = (page: number) => {
    setCurrentPage(page);
  }
  return (
    <div>
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
                <td>{accounts.find((acc) => acc.acctid === request.acctid)?.acctname || ""}</td>
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
                    onClick={() => onView(request)} 
                  >
                    <img src="/svg/View.svg" alt="view" className="eye-view" />
                  </button>
                </td>
              </tr>
            ))) : (
            <tr>
              <td colSpan={6} className="text-center">
             No approved shift adjustment requests at this time
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-end align-items-center gap-3">
        <div className="adjustment-total">
          <p><i className="bi bi-people-fill"></i><span> Total:  {total}</span></p>
        </div>
        <div>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${current_page === 1 ? "disabled" : ""}`} > <button className="page-link" onClick={() => changePage(current_page - 1)}>
                <i className="bi bi-caret-left"></i>
              </button></li>
              <li className="page-item"><span className="page-link" style={{ whiteSpace: 'nowrap' }}>
                {current_page} of {totalPage}
              </span></li>
              <li className={`page-item ${current_page === totalPage ? "disabled" : ""}`}><button className="page-link" onClick={() => changePage(current_page + 1)}>
                <i className="bi bi-caret-right"></i>
              </button></li>
            </ul>
          </nav>
        </div>
      </div>

    </div>
  );
}

