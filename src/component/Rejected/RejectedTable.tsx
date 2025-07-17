"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Decryptor } from "@/security";
import { getUserToken } from "@/services/UserToken/authUserToken";
import Image from "next/image";

interface RequestItem {
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

interface RejectedTableProps {
  data: RequestItem | null;
  onView: (item: RequestItem) => void;
}

export default function RejectedTable({ onView }: RejectedTableProps) {
  const [rejectedRequest, setRejectedRequest] = useState<RequestItem[]>([]);
  const user_id = localStorage.getItem("user_id");
  const [current_page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [total, setTotal] = useState(0);

  const token = getUserToken();
const fetchRejectedRequest = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/rejected/requests/list/${Decryptor(user_id || "")}/?page=${current_page}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })

    if (response.status === 200) {
      const data = await response.json();
      setTotal(data.total);
      setTotalPages(data.num_pages);
      setRejectedRequest(data.data);
      setCurrentPage(data.current_page);
    }
  }, [user_id, token, current_page]);

   useEffect(() => {
    fetchRejectedRequest();
  }, [current_page, fetchRejectedRequest])

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  }
  return (
    <div>
      <table className="table table-striped table-hover table-bordered table-responsive rejected-table-data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reason</th>
            <th>Department</th>
            <th>Date Filed</th>
            <th>Rejected By</th>
            <th className="actions-th">Status</th>
          </tr>
        </thead>
        <tbody>
          {rejectedRequest.length > 0 ? (
            rejectedRequest?.map((request: RequestItem) => (
              <tr key={request.requestid}>
                <td>{request.name}</td>
                <td>{request.reason_for_disapproved?.slice(0, 10) + "..." || "-"}</td>
                <td>{request.acctname || "Unassigned"}</td>
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
                    <Image src="/svg/View.svg" alt="view" className="eye-view" height={16} width={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No declined shift adjustment requests at this time
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-end align-items-center gap-3">
        <div className="adjustment-total">
          <p><i className="bi bi-people-fill"></i><span> Total: {total} </span></p>
        </div>
        <div>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${current_page === 1 ? "disabled" : ""}`} > <button className="page-link" onClick={() => handleChangePage(current_page - 1)}>
                <i className="bi bi-caret-left"></i>
              </button></li>
              <li className="page-item"><span className="page-link" style={{ whiteSpace: 'nowrap' }}>
                {current_page} of {totalPages}
              </span></li>
              <li className={`page-item ${current_page === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => handleChangePage(current_page + 1)}>
                <i className="bi bi-caret-right"></i>
              </button></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
