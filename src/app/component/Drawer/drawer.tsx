import { useState, useEffect } from "react";
import { Decryptor } from "@/security";
import { ToastContainer,toast } from "react-toastify";
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
}

interface DrawerProps {
    data?: RequestDetails | null;
    onSave?: (updatedData: RequestDetails["logs"]) => void;
}

export default function Drawer({ data, onSave }: DrawerProps) {
    const [buildData, setBuildData] = useState<RequestDetails["logs"] | null>(null);
    const [combinedData,setCombinedData]=useState({})
    const [status,setStatus]=useState(1);
    useEffect(() => {
        if (buildData) {
            setCombinedData({
                requestid: data?.requestid,
                empno: data?.requestid,
                name: data?.name,
                shiftdate: data?.shiftdate,
                reason: data?.reason,
                status:1,
                logs: buildData,
                acctid: data?.acctid,
                created_at: data?.created_at,
                aprroved_at: data?.aprroved_at,
                declined_at: data?.declined_at
            });
        }
    }, [buildData]);
    
    useEffect(() => {
        if (data?.logs) {
            setBuildData(JSON.parse(JSON.stringify(data.logs)));
        }
    }, [data]);

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
    const approvedRequest = async ()=>{
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/approve/request/`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${Decryptor(token || "")}`
            },
            body:JSON.stringify(combinedData),
        })
        if (response.status === 200){
            successToast("Changes have been applied")
        }else{
            errorToast("")
        }
    }
    const handleApply = () => {
        approvedRequest();
      console.log(combinedData)
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
            <ToastContainer/>
            <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
                id="shiftdrawer"
                aria-labelledby="ShiftRightLabel"
                style={{ width: "700px" }}
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
                    <div className="mb-5 d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold fs-5">Name</p>
                            <p className="mb-0 fw-semibold fs-5">{data?.name}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold fs-5">Department</p>
                            <p className="mb-0 fw-semibold fs-5">{data?.acctid}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold fs-5">Date Filed</p>
                            <p className="mb-0 fw-semibold fs-5">{data?.created_at}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold fs-5">Request ID</p>
                            <p className="mb-0 fw-semibold fs-5">{data?.requestid}</p>
                        </div>
                    </div>

                    <hr />
                    <div></div>
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="form-label fw-bold fs-4 text-dark">Summary</h5>
                    </div>

                    <div className="justify-content-between">
                        <div className="d-flex form-label justify-content-evenly mb-3">
                            <div>
                                <label htmlFor="attendance">Attendance</label>
                            </div>
                            <div>
                                <label htmlFor="attendance">Initial Time</label>
                            </div>
                            <div>
                                <label htmlFor="attendance">Assigned Time</label>
                            </div>
                        </div>

                        {/* Login */}
                        {data?.logs?.login?.in && (
                              <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                  <span className="break-label break-in">Login</span>
                              </div>
                              <div>
                                  <input
                                      type="time"
                                      disabled={true}
                                      readOnly
                                      value={data?.logs?.login?.in || ""}
                                      className="form-control"
                                  />
                              </div>
                              <div>
                                  <input
                                      type="time"
                                      onChange={(e) => handleChange("login", "", e.target.value)}
                                      value={buildData?.login?.record || ""}
                                      className="form-control"
                                  />
                              </div>
                              <div>
                                  <button type="button" className="closebtn">
                                      <img src="/svg/wrong-danger.svg" alt="close" />
                                  </button>
                              </div>
                          </div>
                        )}
                      
                        {data?.logs?.break1?.in && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="break-label break-in">1st Break - In</span>
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={true}
                                    readOnly
                                    value={data?.logs?.break1?.in || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={!data?.logs?.break1?.in}
                                    onChange={(e) => handleChange("break1", "in", e.target.value)}
                                    value={buildData?.break1?.record?.in || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <button type="button" className="closebtn">
                                    <img src="/svg/wrong-danger.svg" alt="close" />
                                </button>
                            </div>
                            
                        </div>
                    )}
                        {/* Break 1 - Out */}
                        {data?.logs?.break1?.out && (
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <span className="break-label break-out">1st Break - Out</span>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={true}
                                        readOnly
                                        value={data?.logs?.break1?.out || ""}
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        disabled={!data?.logs?.break1?.out}
                                        onChange={(e) => handleChange("break1", "out", e.target.value)}
                                        value={buildData?.break1?.record?.out || ""}
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <button type="button" className="closebtn">
                                        <img src="/svg/wrong-danger.svg" alt="close" />
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Lunch - In */}
                        {data?.logs?.lunch?.in && (

                      
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="break-label lunch-in">Lunch - In</span>
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={true}
                                    readOnly
                                    value={data?.logs?.lunch?.in || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={!data?.logs?.lunch?.in}
                                    onChange={(e) => handleChange("lunch", "in", e.target.value)}
                                    value={buildData?.lunch?.record?.in || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <button type="button" className="closebtn">
                                    <img src="/svg/wrong-danger.svg" alt="close" />
                                </button>
                            </div>
                        </div>
                    )}
                        {/* Lunch - Out */}

                    {data?.logs?.lunch?.out && (

                   
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="break-label lunch-in">Lunch - Out</span>
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={true}
                                    readOnly
                                    value={data?.logs?.lunch?.out || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={!data?.logs?.lunch?.out}
                                    onChange={(e) => handleChange("lunch", "out", e.target.value)}
                                    value={buildData?.lunch?.record?.out || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <button type="button" className="closebtn">
                                    <img src="/svg/wrong-danger.svg" alt="close" />
                                </button>
                            </div>
                        </div>
                    )}
                        {/* Break 2 - In */}
                    {data?.logs?.break2?.in && (

                    
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="break-label break-in">2nd Break - In</span>
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={true}
                                    readOnly
                                    value={data?.logs?.break2?.in || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={!data?.logs?.break2?.in}
                                    onChange={(e) => handleChange("break2", "in", e.target.value)}
                                    value={buildData?.break2?.record?.in || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <button type="button" className="closebtn">
                                    <img src="/svg/wrong-danger.svg" alt="close" />
                                </button>
                            </div>
                        </div>
                    )}
                        {/* Break 2 - Out */}
                    {data?.logs?.break2?.out && (

                
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="break-label break-out">2nd Break - Out</span>
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={true}
                                    readOnly
                                    value={data?.logs?.break2?.out || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={!data?.logs?.break2?.out}
                                    onChange={(e) => handleChange("break2", "out", e.target.value)}
                                    value={buildData?.break2?.record?.out || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <button type="button" className="closebtn">
                                    <img src="/svg/wrong-danger.svg" alt="close" />
                                </button>
                            </div>
                        </div>
                        )}

                        {data?.logs?.logout?.out && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="break-label logout">Logout</span>
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={true}
                                    readOnly
                                    value={data?.logs?.logout?.out || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <input
                                    type="time"
                                    disabled={!data?.logs?.logout?.out}
                                    onChange={(e) => handleChange("logout", "", e.target.value)}
                                    value={buildData?.logout?.record || ""}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <button type="button" className="closebtn">
                                    <img src="/svg/wrong-danger.svg" alt="close" />
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                
                    <div className="mb-3">
                        <label className="form-label fw-bold fs-4 text-dark">Reason</label>
                        <p className="form-text fs-5">{data?.reason}</p>
                    </div>
                </div>

                <hr />
                <div className="modal-footer gap-4 mb-3">
                    <div>
                        <button 
                            type="button" 
                            onClick={handleApply}
                            className="btn btn-primary"
                        >
                            Apply
                        </button>
                    </div>
                    <div>
                        <button type="button" className="btn text-danger fw-bold">
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}