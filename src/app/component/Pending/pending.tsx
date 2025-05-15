import { useState, useEffect } from "react";
import { Decryptor } from "@/security";
import { ToastContainer, toast } from "react-toastify";
import "../../../../public/asset/css/drawer.css"

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
}

interface Account {
    acctid: number;
    acctname: string;
}
interface PendingProps {
    data?: RequestDetails | null;
    onSave?: (updatedData: RequestDetails["logs"]) => void;
    onDeclineComplete?: () => void;
    onApproveComplete?: (requestid: number) => void;
}

export default function Pending({ data, onSave, onDeclineComplete, onApproveComplete }: PendingProps) {
    const [buildData, setBuildData] = useState<RequestDetails["logs"] | null>(null);
    const [combinedData, setCombinedData] = useState({})
    const [declineReason, setDeclineReason] = useState("");
    const [status, setStatus] = useState(0);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [visible, setVisible] = useState<boolean>(!!data);
    const [declineVisible, setDeclineVisible] = useState(false);

    console.log(data);

    useEffect(() => {
        if (buildData) {
            setCombinedData({
                requestid: data?.requestid,
                empno: data?.empno,
                name: data?.name,
                shiftdate: data?.shiftdate,
                reason: declineReason,
                status: data?.status,
                logs: buildData,
                acctid: '',
                created_at: data?.created_at,
                aprroved_at: '',
                declined_at: '',
                approved_by: Decryptor(localStorage.getItem("user_id") || ""),
            });
        }

    }, [buildData, status, declineReason]);

    useEffect(() => {

    }, [combinedData])

    useEffect(() => {
        if (data?.logs) {
            setBuildData(JSON.parse(JSON.stringify(data.logs)));
        }
    }, [data]);

    const handleDecline = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/reject/request/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Decryptor(token || "")}`
            },
            body: JSON.stringify(combinedData)
        });

        if (response.status === 200) {
            toast.success("Request declined.", {
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setVisible(false);
            setDeclineVisible(false);
            setDeclineReason("");

            if (typeof onDeclineComplete === "function") {
                onDeclineComplete();
            }
        } else {
            toast.error("Failed to decline request.", {
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const getAccounts = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/list/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Decryptor(token || "")}`
            }
        });
        const result = await response.json();
        setAccounts(result.data);
    };

    useEffect(() => {
        getAccounts();
    }, []);

    const handleChange = (section: string, field: string, value: string) => {
        setBuildData(prev => {
            if (!prev) return prev;

            const updated = { ...prev };

            if (section === "login" || section === "logout") {
                updated[section] = {
                    ...updated[section],
                    record: value
                };
            }
            // Handle other sections with record objects
            else if (section === "break1" || section === "break2" || section === "lunch") {
                updated[section] = {
                    ...updated[section],
                    record: {
                        ...updated[section]?.record,
                        [field]: value
                    }
                };
            }

            return updated;
        });
    };
    const token = localStorage.getItem("token");
    const approvedRequest = async (payload: any) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/approve/request/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Decryptor(token || "")}`
            },
            body: JSON.stringify(payload),
        })
        if (response.status === 200) {
            successToast("Request approved successfully.");
            if (typeof onApproveComplete === "function" && data?.requestid) {
                onApproveComplete(data.requestid);
            }

        } else {
            errorToast("Failed to approve request.");
        }
    }
    const handleApply = () => {
        const updatedStatus = 1;
        setStatus(updatedStatus);
        const payload = {
            requestid: data?.requestid,
            empno: data?.empno,
            name: data?.name,
            shiftdate: data?.shiftdate,
            reason: data?.reason,
            status: updatedStatus,
            logs: buildData,
            acctid: data?.acctid,
            created_at: data?.created_at,
            aprroved_at: new Date().toISOString(),
            declined_at: null,
            approved_by: Decryptor(localStorage.getItem("user_id") || "")
        };
        approvedRequest(payload);
        setVisible(false);

    };

    const successToast = (msg: string) => toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const errorToast = (msg: string) => toast.error(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });


    return (
        <div>
            <ToastContainer />
            <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
                id="shiftdrawer"
                aria-labelledby="ShiftRightLabel"
                style={{ width: "480px" }}
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title fw-bold text-light" id="ShiftRightLabel">
                        Shift Adjustment Information
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    <div>
                        <div className="d-flex flex-column">
                            <div className="d-flex justify-content-between">
                                <p className="drawer-label">Name</p>
                                <p className="drawer-label">{data?.name}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="drawer-label">Date Filed</p>
                                <p className="drawer-label">{data?.created_at}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="drawer-label">Department</p>
                                <p className="drawer-label">{accounts.find(acc => acc.acctid === data?.acctid)?.acctname || "-"}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="drawer-label">Request ID</p>
                                <p className="drawer-label">{data?.requestid}</p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-1 mt-2">
                        <h5 className="form-label fs-5 text-dark">Summary</h5>
                    </div>
                    <div>
                        <div><label htmlFor="requesteddate" className="drawer-label mb-1">Requested Date</label></div>
                        <div><input className="form-control form-control--requesteddate mb-3" type="date" readOnly value={data?.shiftdate || ""} disabled={true} /></div>
                    </div>

                    <div className="justify-content-between">
                        <div className="d-flex justify-content-around align-items-center mb-2 w-100">
                            <div>
                                <label className="drawer-label col-4 justify-content-start drawer-label--attendance" style={{ transform: "translateX(-6px)" }}>Attendance</label>
                            </div>
                            <div>
                                <label className="drawer-labell col-4 justify-content-start">Requested Time</label>
                            </div>
                            <div>
                                <label className="drawer-label1 col-4 justify-content-start">Recorded Time</label>
                            </div>
                            <div>

                            </div>
                        </div>

                        {/* Login */}
                        {data?.logs?.login?.in && (

                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container">
                                    <span className="login-label fw-semibold">Login</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.login?.in || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        onChange={(e) => handleChange("login", "", e.target.value)}
                                        value={buildData?.login?.record || ""}
                                        disabled={true} readOnly
                                        className="input-time-field"
                                    />
                                </div>

                            </div>
                        )}
                        {data?.logs?.break1?.in && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container2">
                                    <span className="break1-label fw-semibold">1st Break - In</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.break1?.in || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        onChange={(e) => handleChange("break1", "in", e.target.value)}
                                        value={buildData?.break1?.record?.in || ""}
                                        disabled={true} readOnly
                                        className="input-time-field"
                                    />
                                </div>
                            </div>
                        )}
                        {data?.logs?.break1?.out && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container2">
                                    <span className="break11-label fw-semibold">1st Break - Out</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.break1?.out || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        onChange={(e) => handleChange("break1", "out", e.target.value)}
                                        value={buildData?.break1?.record?.out || ""}
                                        className="input-time-field"
                                    />
                                </div>
                            </div>
                        )}
                        {/* Lunch - In */}
                        {data?.logs?.lunch?.in && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container3">
                                    <span className="lunch-in-label fw-semibold">Lunch - In</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.lunch?.in || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        onChange={(e) => handleChange("lunch", "in", e.target.value)}
                                        value={buildData?.lunch?.record?.in || ""}
                                        className="input-time-field"
                                    />
                                </div>
                            </div>
                        )}
                        {/* Lunch - Out */}
                        {data?.logs?.lunch?.out && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container3">
                                    <span className="lunch-in-label fw-semibold">Lunch - Out</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.lunch?.out || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        onChange={(e) => handleChange("lunch", "out", e.target.value)}
                                        value={buildData?.lunch?.record?.out || ""}
                                        className="input-time-field"
                                    />
                                </div>
                            </div>
                        )}
                        {/* Break 2 - In */}
                        {data?.logs?.break2?.in && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container4">
                                    <span className="break2-label fw-semibold">2nd Break - In</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.break2?.in || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        onChange={(e) => handleChange("break2", "in", e.target.value)}
                                        value={buildData?.break2?.record?.in || ""}
                                        className="input-time-field"
                                    />
                                </div>
                            </div>
                        )}
                        {/* Break 2 - Out */}
                        {data?.logs?.break2?.out && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container4">
                                    <span className="break22-label fw-semibold">2nd Break - Out</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.break2?.out || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        onChange={(e) => handleChange("break2", "out", e.target.value)}
                                        value={buildData?.break2?.record?.out || ""}
                                        className="input-time-field"
                                    />
                                </div>
                            </div>
                        )}

                        {data?.logs?.logout?.out && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container5">
                                    <span className="logout-label fw-semibold">Logout</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.logout?.out || ""}
                                        className="input-time-field"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        onChange={(e) => handleChange("logout", "", e.target.value)}
                                        value={buildData?.logout?.record || ""}
                                        className="input-time-field"
                                        readOnly
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="drawer-label fs-5 mt-1">Reason</label>
                        <p className="reason">{data?.reason}</p>
                    </div>
                </div>

                <div className="modal-footer gap-4 shift-footer" style={{ padding: '20px' }}>
                    <div>
                        <button onClick={handleApply} className="custom-btn approve-btn">
                            Approve
                        </button>

                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn text-danger fw-bold"
                            data-bs-toggle="modal"
                            data-bs-target="#declineModal"
                        >
                            <span className="view">Decline</span>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className="modal fade"
                id="declineModal"
                tabIndex={-1}
                aria-labelledby="declineModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-light" id="declineModalLabel">Decline Shift Adjustment</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="decline-reason" className="form-label">Reason for Decline</label>
                                <textarea
                                    id="decline-reason"
                                    className="form-control"
                                    rows={5}
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                <span className="view">Cancel</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={handleDecline}
                            >
                                <span className="view">Submit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
