"use client";
import { useState, useEffect } from "react";
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
    reason_for_disapproved: string;
    acctname: string;
}

interface Account {
    acctid: number;
    acctname: string;
}
interface RejectedDataProps {
    data?: RequestDetails | null;
    onSave?: (updatedData: RequestDetails["logs"]) => void;
    onDeclineComplete: () => void;
}

function RejectedData({ data, onSave, onDeclineComplete }: RejectedDataProps) {
    const [buildData, setBuildData] = useState<RequestDetails["logs"] | null>(null);
    const [combinedData, setCombinedData] = useState({})

    return (
        <div>
            <ToastContainer />
            <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
                id="rejecteddrawer"
                aria-labelledby="rejectedRightLabel"
                style={{ width: "465px" }}
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
                                <p className="drawer-label">{data?.acctname}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="drawer-label">Request ID</p>
                                <p className="drawer-label">{data?.requestid}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="drawer-label">Status</p>
                                <p className="drawer-label" style={{ color: data?.status === 0 ? "red" : "" }}>{data?.status === 1 ? "Approved" : "Declined"}</p>
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
                                <label className="drawer-label col-4 justify-content-start drawer-label--attendance" >Attendance</label>
                            </div>
                            <div>
                                <label className="drawer-label1 col-4 justify-content-start">Recorded Time</label>
                            </div>
                            <div>
                                <label className="drawer-labell col-4 justify-content-start">Requested Time</label>
                            </div>
                            <div>
                            </div>
                        </div>
                        {data?.logs?.login?.in && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container">
                                    <span className="login-label fw-semibold">Login</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        value={buildData?.login?.record || ""}
                                        disabled={true} readOnly
                                        className="input-time-field"
                                    />
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
                                        value={buildData?.break1?.record?.in || ""}
                                        disabled={true} readOnly
                                        className="input-time-field"
                                    />
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
                                        disabled={true} readOnly
                                        value={buildData?.break1?.record?.out || ""}
                                        className="input-time-field"
                                    />
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
                            </div>
                        )}
                        {data?.logs?.lunch?.in && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container3">
                                    <span className="lunch-in-label fw-semibold">Lunch - In</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        value={buildData?.lunch?.record?.in || ""}
                                        className="input-time-field"
                                    />
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
                            </div>
                        )}
                        {data?.logs?.lunch?.out && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container3">
                                    <span className="lunch-in-label fw-semibold">Lunch - Out</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        value={buildData?.lunch?.record?.out || ""}
                                        className="input-time-field"
                                    />
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
                            </div>
                        )}
                        {data?.logs?.break2?.in && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container4">
                                    <span className="break2-label fw-semibold">2nd Break - In</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        value={buildData?.break2?.record?.in || ""}
                                        className="input-time-field"
                                    />
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
                            </div>
                        )}
                        {data?.logs?.break2?.out && (
                            <div className="d-flex justify-content-around align-items-center mb-2">
                                <div className="label-container4">
                                    <span className="break22-label fw-semibold">2nd Break - Out</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true} readOnly
                                        value={buildData?.break2?.record?.out || ""}
                                        className="input-time-field"
                                    />
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
                                        value={buildData?.logout?.record || ""}
                                        className="input-time-field"
                                        readOnly
                                        disabled={true}
                                    />
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
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="drawer-label fs-5 mt-1">Reason</label>
                        <p className="reason">{data?.reason_for_disapproved}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RejectedData;
