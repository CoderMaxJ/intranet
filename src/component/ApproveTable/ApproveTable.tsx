"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Decryptor } from "@/security";
import Image from "next/image";
import { getUserToken } from "@/services/UserToken/authUserToken";

interface RequestDetails {
  requestid: number;
  empno: number;
  name: string;
  shiftdate: string;
  reason: string;
  status: number;
  logs: {
    login?: {
      in?: string;
      out?: string;
      record: string;
    };
    break1?: {
      in?: string;
      out?: string;
      record: {
        in: string;
        out: string;
      };
    };
    break2?: {
      in?: string;
      out?: string;
      record: {
        in: string;
        out: string;
      };
    };
    lunch?: {
      in?: string;
      out?: string;
      record: {
        in: string;
        out: string;
      };
    };
    logout?: {
      in?: string;
      out?: string;
      record: string;
    };
    [key: string]: unknown;
  };
  acctid: number;
  created_at: string;
  aprroved_at: string;
  declined_at: string;
  approved_by: number;
  acctname: string;
  reason_for_disapproved: string;
}

interface ApproveProps {
  onView: (item: RequestDetails) => void;
  data:RequestDetails | null;
}

interface Accounts {
  acctid: number;
  acctname: string;
}

export default function ApproveTable({ onView, data }: ApproveProps) {
  console.log(data)
  const [approvedRequest, setApproveRequest] = useState<RequestDetails[]>([]);
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [current_page, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [total, setTotal] = useState(0);

let token = "";
let user_id = "";

if (typeof window !== "undefined") {
  token = Decryptor(localStorage.getItem("token") || "");
  user_id = localStorage.getItem("user_id") || "";
}
  const getAccounts = useCallback(async () => {
  const token = getUserToken();
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
  },[token]);

  useEffect(() => {
    getAccounts();
  },[getAccounts]);

  const fetchApprovedRequest = useCallback(async () =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/approved/requests/list/${Decryptor(user_id || "")}/?page=${current_page}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      const responseData = await response.json();
      const {data,num_pages,total} = responseData;
      setApproveRequest(data);
      setTotalPage(num_pages);
      setTotal(total);
    }
  },[token, current_page]);

  useEffect(() => {
    fetchApprovedRequest();
  }, [fetchApprovedRequest, current_page]);

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
            <th className="actions-th">Status</th>
          </tr>
        </thead>
        <tbody>
          {approvedRequest?.length > 0 ? (
            approvedRequest.map((request: RequestDetails) => (
              <tr key={request.requestid}>
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
                    <Image src="/svg/View.svg" alt="view" className="eye-view" height={16} width={16} />
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
