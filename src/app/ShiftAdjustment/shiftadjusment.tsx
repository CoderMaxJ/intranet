"use client";

import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import Header from "../component/Header";
import Drawer from "../component/Drawer/drawer";
import Approve from "../component/Approve/approve";
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

export default function ShiftAdjustment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [details, setShiftData] = useState<RequestDetails | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [approve, setApprove] = useState("");
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

const handleTabChange = (value: "pending" | "approved" | "rejected") => {
  setFilter(value);
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

  const handleApproved = (e:any) => {
    setApprove(e.target.value);
  };

  const fetchShiftAdjustmentData = async () => {
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
        console.log("Shift Adjustment Data:", data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch data:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching shift adjustment data:", error);
    }
  };

  //   const filteredData = shiftData.filter((item) =>
  //     item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  const handleViewClick = (item: RequestDetails) => {
    setShiftData(item);
  };
  return (
    <div className="d-flex">
      <div>
        <Dashboard />
      </div>

      <div className="shiftadjustment-container flex-grow-1">
        <Header title="MANAGE SHIFT ADJUSTMENT" />

        <div className="shift-background p-4 px-4">
          <div className="d-flex gap-5 ">
            <div><button type="button" className="form-label form-label--shiftadjustment-header">Pending</button></div>
            <div><button type="button" className="form-label form-label--shiftadjustment-header" onClick={handleApproved} value={approve}>Approved</button></div>
            <div><button type="button" className="form-label form-label--shiftadjustment-header">Rejected/Cancelled</button></div>
          </div>

          <div className="shiftadjustment-table">
            <table className="table table-striped table-hover table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reason</th>
                  <th>Department</th>
                  <th>Date Filed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => {
                    const emptyStatusCount = Object.values(item.logs).filter(
                      (log) => log?.status === "" || log?.status === 0
                    ).length;

                    return (
                      <tr key={item.requestid || `${item.name}-${item.shiftdate}`}>
                        <td>{item.name || "-"}</td>
                        <td>{item.reason?.slice(0, 10) + "..." || "-"}</td>
                        <td>{item.acctid || "-"}</td>

                        {/* <td>{emptyStatusCount}</td> */}
                        <td>{item.created_at || "-"}</td>
                        <td>
                          <button

                            className="btn btn-sm btn-outline-primary"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#shiftdrawer"
                            aria-controls="shiftdrawer"
                            onClick={() => handleViewClick(item)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No shift data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Drawer data={details} />
    </div>
  );
}
