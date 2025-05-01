import { da } from "date-fns/locale";
import { useState,useEffect } from "react";

interface RequestDetails {
requestid:number;
empno:number;
name:string;
shiftdate:string;
reason:string;
status:number;
logs: {
    login?: {
        in?: string;
        out?: string;
        record:string;
    };
    [key: string]: any; // Optional: To allow additional properties
};
acctid:number;
created_at:string;
aprroved_at:string;
declined_at:string;
}

interface DrawerProps {
    data?: RequestDetails | null;
}
export default function Drawer({data}:DrawerProps) {
  
console.log(data);
    return (
        <div>
            <h1></h1>
            <div className="offcanvas offcanvas-end" tabIndex={-1} id="shiftdrawer" aria-labelledby="ShiftRightLabel" style={{ width: '700px' }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title fw-bold text-light" id="ShiftRightLabel">Shift Adjustment Information</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
                            <div><label htmlFor="attendance">Attendance</label></div>
                            <div><label htmlFor="attendance">Initial Time</label></div>
                            <div><label htmlFor="attendance">Assigned Time</label></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div><span className="break-label break-in">Login</span></div>
                            <div><input type="time"  disabled={true} readOnly value={ data?.logs?.login?.in || ""}  className="form-control" /></div>
                            <div><input type="time" onChange={() => {}} value={data?.logs?.login?.in || ""}  className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            
                            <div><span className="break-label break-in">1st Break - In</span></div>
                            <div><input type="time" disabled={true} readOnly value={data?.logs?.break1?.in || ""}  className="form-control" /></div>
                            <div><input type="time" disabled={data?.logs?.break1?.in === "" ? true:false} onChange={() => {}} value={data?.logs?.break1?.record || ""} className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            
                            <div><span className="break-label break-out">1st Break - Out</span></div>
                            <div><input type="time" disabled={true} readOnly value={data?.logs?.break1?.out || ""}  className="form-control" /></div>
                            <div><input type="time" disabled={data?.logs?.break1?.out === "" ? true:false} onChange={() => {}} value={data?.logs?.break1?.record || ""} className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            
                            <div><span className="break-label lunch-in">Lunch - In</span></div>
                            <div><input type="time" disabled={true} readOnly value={data?.logs?.lunch?.in || ""}  className="form-control" /></div>
                            <div><input type="time" disabled={data?.logs?.lunch?.in === "" ? true:false} onChange={() => {}} value={data?.logs?.lunch?.record || ""} className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            
                            <div><span className="break-label lunch-in">Lunch - Out</span></div>
                            <div><input type="time" disabled={true} readOnly value={data?.logs?.lunch?.out || ""}  className="form-control" /></div>
                            <div><input type="time" disabled={data?.logs?.lunch?.out=== "" ? true:false} onChange={() => {}}  value={data?.logs?.lunch?.record || ""} className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            
                            <div><span className="break-label break-in">2st Break - In</span></div>
                            <div><input type="time" disabled={true} readOnly value={data?.logs?.break2?.in || ""}  className="form-control" /></div>
                            <div><input type="time" disabled={data?.logs?.break2?.in === "" ? true:false} onChange={() => {}} value={data?.logs?.break2?.record || ""} className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            
                            <div><span className="break-label break-out">2st Break - Out</span></div>
                            <div><input type="time" disabled={true} readOnly value={data?.logs?.break2?.out || ""}  className="form-control" /></div>
                            <div><input type="time" disabled={data?.logs?.break2?.out === "" ? true:false} onChange={() => {}} value={data?.logs?.break2?.record || ""} className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            
                            <div><span className="break-label logout">Logout</span></div>
                            <div><input type="time" disabled={true} readOnly value={data?.logs?.logout?.out || ""} className="form-control" /></div>
                            <div><input type="time" disabled={data?.logs?.logout?.out === "" ? true:false} onChange={() => {}} value={data?.logs?.logout?.record || ""} className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold fs-4 text-dark">Reason</label>
                        <p className="form-text fs-5">{data?.reason}</p>
                    </div>
                </div>
                <hr />
                <div className="modal-footer gap-4 mb-3">
                    <div><button type="button" className="btn btn-primary">Apply</button></div>
                    <div><button type="button" className="btn text-danger fw-bold">Decline</button></div>
                </div>
            </div>
            <div />
        </div>
    );
}
