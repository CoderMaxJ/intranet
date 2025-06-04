import React, { useEffect, useState } from "react";
import { Decryptor } from "@/security";
import { tr } from "date-fns/locale";

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
        [key: string]: any;
    };
    acctid: number;
    created_at: string;
    aprroved_at: string;
    declined_at: string;
    approved_by: number;
    acctname:string;
    reason_for_disapproved: string;
}
interface RejectedTableProps {
  data: RequestItem | null;
  onView: (item: RequestItem) => void;
}



export default function RejectedTable({ onView }: RejectedTableProps) {
  const [showSample, setShowSample] = useState(true);
  const [rejectedRequest, setRejectedRequest] = useState<RequestItem[]>([]);
  const token = Decryptor(localStorage.getItem("token") || "");
  const user_id = localStorage.getItem("user_id");
  const [current_page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [total, setTotal] = useState(0);


  async function fetchRejectedRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/rejected/requests/list/${Decryptor(user_id || "")}/?page=${current_page}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setTotal(data.total);
      setTotalPages(data.num_pages);
      setRejectedRequest(data.data);
      setCurrentPage(data.current_page);
    }
  }

  useEffect(() => {
    fetchRejectedRequest();
  }, [])

  useEffect(() => {
    fetchRejectedRequest();
  }, [current_page])
  const handleChangePage = (page: number) => {
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
          <th>Rejected By</th>
          <th className="actions-th">Action</th>
        </tr>
      </thead>
      <tbody>
      
        {rejectedRequest?.map((request: any, index: any) => (
          <tr key={index}>
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
                <img src="/svg/View.svg" alt="view" className="eye-view" />
              </button>
            </td>
          </tr>
        
        ))}
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
