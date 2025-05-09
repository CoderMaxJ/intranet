"use client";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import Header from "../component/Header";
import Pending from "../component/Pending/pending";
import ApproveTable from "../component/ApproveTable/ApproveTable";
import ApprovedData from "../component/ApprovedData/ApprovedData";
import RejectedData from "../component/RejectedData/RejectedData";
import RejectedTable from "../component/Rejected/RejectedTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Decryptor } from "@/security";

interface RequestDetails {
  requestid: number;
  empno: number;
  name: string;
  shiftdate: string;
  reason: string;
  status: number;
  logs: Object;
  acctid: number;
  created_at: string;
  aprroved_at: string;
  declined_at: string;
}

interface Account {
  acctname: string
  acctid: number
}

export default function ShiftAdjustment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [details, setShiftData] = useState<RequestDetails | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [approve, setApprove] = useState("");
  const [account, setAccount] = useState<Account[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [activeTab, setActiveTab] = useState("pending");

  const handleTabChange = (value: "pending" | "approved" | "rejected") => {
    setFilter(value);
    setActiveTab(value);
  };

  const filteredData = data.filter((item) => {
    if (filter === "pending") return item.status === 0;
    if (filter === "approved") return item.status === 1;
    if (filter === "rejected") return item.status === 2;
    return true;
  });

  useEffect(() => {
    fetchShiftAdjustmentData();
  }, []);

  const handleApproved = (e: any) => {
    setApprove(e.target.value);
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND}/account/list/`
  async function getAccount() {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${Decryptor(token || "")}`
      }
    });

    if (!response.ok) {
      console.log("error");
    }
    const data = await response.json();
    setAccount(data.data);
  }

  useEffect(() => {
    getAccount();
  }, [])

  const handleDeleteRequest = async (requestid: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/requests/${requestid}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Decryptor(token || "")}`,
          },
        }
      );

      if (response.ok) {
        fetchShiftAdjustmentData();
      } else {
        console.error("Deletion failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const handleApproveRequest = async (decryptedId: string) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/approve/requests/${decryptedId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Decryptor(token || "")}`,
      }
    });

    if (response.ok) {
      fetchShiftAdjustmentData();
    } else {
    }
  };

  const handleRejectRequest = async (empno: number, acctid: number) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/myrequest/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Decryptor(token || "")}`,
      }
    });

    if (response.ok) {
      fetchShiftAdjustmentData();
    }
  };

  const fetchShiftAdjustmentData = async () => {
    console.log("Fetching pending data...");
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    try {
      const decryptedId = Decryptor(user_id || "");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/view/scrub/requests/${decryptedId}/`,
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

        console.log(data)
        setShiftData(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch data:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching shift adjustment data:", error);
    }
  };

  const handleViewClick = (item: RequestDetails) => {
    setShiftData(item);
    setActiveTab(filter);
  };

  return (
    <div className="d-flex">
      <div>
        <Dashboard />
      </div>
      <div className="shiftadjustment-container flex-grow-1">
        <Header title="ADJUSTMENT" />
        <div className="shift-background p-4 px-4">
          <div className="d-flex gap-5">
            <button
              type="button"
              className={`form-label form-label--shiftadjustment-header ${filter === "pending" ? "active" : ""}`}
              onClick={() => handleTabChange("pending")}
            >
              Pending
            </button>
            <button
              type="button"
              className={`form-label form-label--shiftadjustment-header ${filter === "approved" ? "active" : ""}`}
              onClick={() => handleTabChange("approved")}
            >
              Approved
            </button>
            <button
              type="button"
              className={`form-label form-label--shiftadjustment-header ${filter === "rejected" ? "active" : ""}`}
              onClick={() => handleTabChange("rejected")}
            >
              Rejected/Cancelled
            </button>
          </div>

          <div className="shiftadjustment-table">
            {filter === "pending" && (
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Reason</th>
                    <th>Department</th>
                    <th>Date Filed</th>
                    <th className="actions-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.requestid || `${item.name}-${item.shiftdate}`}>
                        <td>{item.name || "-"}</td>
                        <td>{item.reason?.slice(0, 10) + "..." || "-"}</td>
                        <td> {account.find((acc) => acc.acctid === item.acctid)?.acctname || "-"}</td>
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
                        No shift data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {filter === "approved" && (
              <>
                <ApproveTable onView={handleViewClick} />
                <ApprovedData data={details} />
              </>
            )}
            {filter === "rejected" && (
              <>
                <RejectedTable
                  data={filteredData.filter(item => item.status === 2)} // 👈 this is critical
                  onView={handleViewClick}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {activeTab === "pending" && (
        <Pending data={details} onDeclineComplete={fetchShiftAdjustmentData} activeTab={activeTab} />)}
      {activeTab === "rejected" && (
        <RejectedData
          data={details}
          onDeclineComplete={fetchShiftAdjustmentData}
        />
      )}
    </div>
  );
}
