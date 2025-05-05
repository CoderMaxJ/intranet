import React, { useState } from "react";

export default function RejectedTable({ data, onView, onDelete }: any) {
    const [showSample, setShowSample] = useState(true);

    const handleDeleteSample = () => {
        setShowSample(false);
        onDelete?.("REQ001"); // Pass ID if needed
    };

    return (
        <table className="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Reason</th>
                    <th>Department</th>
                    <th>Date Filed</th>
                    <th>Rejected By</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {showSample && (
                    <tr key="REQ001">
                        <td>John Doe</td>
                        <td>Medical Le...</td>
                        <td>HR</td>
                        <td>2025-05-01</td>
                        <td>Jane Smith</td>
                        <td>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#shiftdrawer"
                                aria-controls="shiftdrawer"
                                style={{marginRight:"20px"}}
                            >
                                View
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                type="button"
                                onClick={handleDeleteSample}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                )}
                {/* {data.length > 0 ? (
          data.map((item: any) => (
            <tr key={item.requestid}>
              <td>{item.name}</td>
              <td>{item.reason?.slice(0, 10) + "..."}</td>
              <td>{item.acctid}</td>
              <td>{item.created_at}</td>
              <td>{item.declined_at || "N/A"}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => onView(item)}
                >
                  View
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">No rejected entries.</td>
          </tr>
        )} */}
            </tbody>
        </table>
    );
}
