"use client";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/page";
import Header from "../component/Header";
import Pending from "../component/Pending/page";
import ApproveTable from "../component/ApproveTable/page";
import ApprovedData from "../component/ApprovedData/page";
import RejectedData from "../component/RejectedData/page";
import RejectedTable from "../component/Rejected/RejectedTable";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-toastify/dist/ReactToastify.css";
import { Decryptor } from "@/security";
import { useRouter } from "next/navigation";




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


export default function ShiftAdjustment() {
  const [currentPage, setCurrentPages] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [data, setData] = useState<RequestDetails[]>([]);
  const [totalData, setTotalData] = useState();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedData, setSelectedData] = useState<RequestDetails| null>(null);
  
  const router = useRouter();
  useEffect(() => {
    if (activeTab === "pending") {
      fetchShiftAdjustmentData();
    }
  }, [activeTab,currentPage]);

   const token = localStorage.getItem("token");

  const fetchShiftAdjustmentData = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const decryptedId = Decryptor(user_id || "");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/view/scrub/requests/${decryptedId}/?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Decryptor(token || "")}`,
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setData(data.data);
        setTotalPages(data.num_pages);
        setTotalData(data.total);
      } else {
        if(!token){
            router.push("/");
        }
      }
    } catch (error) {
      console.error("Error fetching shift adjustment data:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPages(page);
  };
  const handleViewClick = (item: RequestDetails) => {
    setSelectedData(item);
  };

  return (
    <div className="d-flex">
      <div>
        <Dashboard />
      </div>
      <div className="shiftadjustment-container flex-grow-1">
        <Header title="ADJUSTMENT" currentPage=""/>
        <div className="px-4 py-4">
        <div className="shift-background p-4 ">
          <div className="d-flex gap-5">
            <div className="d-flex gap-5">
              <button
                type="button"
                className={`form-label form-label--shiftadjustment-header ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
              <button
                type="button"
                className={`form-label form-label--shiftadjustment-header ${activeTab === "approved" ? "active" : ""}`}
                onClick={() => setActiveTab("approved")}
              >
                Approved
              </button>
              <button
                type="button"
                className={`form-label form-label--shiftadjustment-header ${activeTab === "rejected" ? "active" : ""}`}
                onClick={() => setActiveTab("rejected")}
              >
                Declined
              </button>
            </div>
          </div>
          <div className="shiftadjustment-table table-responsive">
            {activeTab === "pending" && (
              <div>
                <table className="adjustment-table table table-striped table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Reason</th>
                      <th>Department</th>
                      <th>Date Filed</th>
                      <th className="actions-th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      data?.map((item) => (
                        <tr key={item.requestid || `${item.name}-${item.shiftdate}`}>
                          <td>{item.name || "-"}</td>
                          <td>{item.reason?.slice(0,40) + "..." || "-"}</td>
                          <td> {item.acctname|| "Unassigned"}</td>
                          <td>{item.created_at || "-"}</td>
                          <td>
                            <div className="d-flex gap-4 actions">
                              <div>
                                <button
                                  className="btn-sm btn-outline-primary"
                                  type="button"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#shiftdrawer"
                                  aria-controls="shiftdrawer"
                                  onClick={() => handleViewClick(item)}
                                >
                                  <img src="/svg/View.svg" alt="view" className="eye-view" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No pending shift adjustment requests at this time
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "approved" && (
              <>
                <ApproveTable onView={handleViewClick} data={selectedData}  />
                <ApprovedData data={selectedData} />
              </>
            )}
            {activeTab === "rejected" && (
              <>
                <RejectedTable
                  data={selectedData}
                  onView={handleViewClick}
                />
              </>
            )}
          </div>
          {activeTab !== 'rejected' && activeTab !== 'approved' && (
            <div className="d-flex justify-content-end align-items-center gap-3">
              <div className="adjustment-total">
                <p><i className="bi bi-people-fill"></i><span> Total: {totalData}</span></p>
              </div>
              <div>
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} > <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                      <i className="bi bi-caret-left"></i>
                    </button></li>
                    <li className="page-item"><span className="page-link" style={{ whiteSpace: 'nowrap' }}>
                      {currentPage} of {totalPages}
                    </span></li>
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                      <i className="bi bi-caret-right"></i>
                    </button></li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
      {activeTab === "pending" && (
        <Pending
          data={selectedData}
          onApproveComplete={fetchShiftAdjustmentData}
        />
      )}

      {activeTab === "rejected" && (
        <RejectedData
          data={selectedData}
          onDeclineComplete={fetchShiftAdjustmentData}
        />
      )}

      {activeTab === "rejected" && (
        <RejectedData data={selectedData} onDeclineComplete={fetchShiftAdjustmentData} />
      )}
    </div>
    </div>
  );
}