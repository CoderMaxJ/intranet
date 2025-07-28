"use client";
import { useEffect, useState, useMemo, useCallback, useRef} from "react";
import { Decryptor} from "@/security";
import debounce from 'lodash.debounce';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { getUserToken } from "@/services/UserToken/authUserToken";
import Image from "next/image";

interface Schedule {
     shiftstart: string;
     shiftend: string;
}

interface Account {
     acctname: string
     acctid: number
}

interface Information {
     empno: number;
     gender: string;
     fname: string;
     lname: string;
     mname: string;
     maritalstatus: string;
     dateofbirth: string;
     address: string;
     contactno: string;
     position: string;
     acctid: number;
     un: string;
     role_id: number;
     isdayshift: number;
     status: number;
     schedule: Schedule;
     acctname: string;
}

export default function Reassignment() {
     const [employee, setEmployee] = useState<Information[]>([])
     const [timeIn, setTimeIn] = useState("");
     const [timeOut, setTimeOut] = useState("");
     const [searchQuery, setSearchQuery] = useState("");
     const [account, setAccount] = useState<Account[]>([]);
     const [allEmployees, ] = useState<Information[]>([]);
     const [, setFilteredEmployees] = useState<Information[]>([]);
     const [selectedEmployees, setSelectedEmployees] = useState<Information[]>([]);
     const [searchQueryLeft, setSearchQueryLeft] = useState("");
     const [filterText, setFilterText] = useState("");
     const [showModal, setShowModal] = useState(false);

     const router = useRouter();
     const token = getUserToken();
     const reassignmentCloseRef = useRef<HTMLButtonElement>(null);
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
     const user_id = localStorage.getItem("user_id");
     const getAccountName = (acctid: number): string => {
          if (acctid === undefined || acctid === null) {
               return '';
          }
          const accountInfo = account.find(acc => acc.acctid === acctid);
          return accountInfo ? accountInfo.acctname : "Unassigned";
     };

     useEffect(() => {
          if (!showModal) {
               const timer = setTimeout(() => setShowModal(false), 200);
               return () => clearTimeout(timer);
          }
     }, [showModal]);

     const handleSetSchedule = async () => {
          if (!timeIn || !timeOut) {
               errorToast("Please set both Time In and Time Out before assigning schedule.");
               return;
          }
          if (selectedEmployees.length === 0) {
               errorToast("Please select at least one employee.");
               return;
          }
          const employee_numbers = selectedEmployees.map(emp => emp.empno);
          try {
               const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bulk/create/schedule/`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                         empno: employee_numbers,
                         timein: timeIn,
                         timeout: timeOut
                    })
               });
               if (response.ok) {
                    const data = await response.json();
                    successToast(data.message || "Schedule successfully set for selected employees!");
                    setSelectedEmployees([]);
                    setTimeIn("");
                    setTimeOut("");
               } else {
                    const text = await response.text();
                    try {
                         const errorData = JSON.parse(text);
                         errorToast(`Failed to set schedule: ${errorData.message || "Unknown error"}`);
                    } catch {
                         console.warn("Server response is not JSON:", text);
                         errorToast("Failed to set schedule: Server error or wrong endpoint.");
                    }
               }
          } catch (error) {
               console.warn("Error setting schedule", error);
               errorToast("An error occurred while setting schedule.");
          }
     };

     const HandleSelectAll = () => {
          setSelectedEmployees(prev => {
               if (prev.length === employee.length) {
                    return [];
               }
               return [...employee];
          });
     };

     const handleSearchEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setSearchQuery(value);
          const filtered = allEmployees.filter(emp =>
          (`${emp.fname} ${emp.lname}`.toLowerCase().includes(value.toLowerCase()) ||
               getAccountName(emp.acctid).toLowerCase().includes(value.toLowerCase()))
           );
          setFilteredEmployees(filtered);
     };
     const getAccount = useCallback(async () => {
          const url = `${process.env.NEXT_PUBLIC_BACKEND}/account/list/option/${Decryptor(user_id || "")}/`;
          const response = await fetch(url, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
               }
          });
          if (response.ok) {
               const data = await response.json();
               setAccount(data.data);
          } else {
               if (!token) {
                    router.push("/");
               }
          }
     }, [token, user_id, router]);

        useEffect(() => {
          getAccount();
     }, [getAccount]);

     const id = localStorage.getItem("user_id");
        const filterbyAccount = useCallback(async () => {
          if (searchQueryLeft === "") {
               setSearchQueryLeft("");
          }
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/employee/schedule/account/?user_id=${Decryptor(id || "")}&name=${searchQueryLeft}&account_id=${filterText}`, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
               }
          });
          if (response.status === 200) {
               const data = await response.json();
               setEmployee(data.data);
          } else {
               console.warn("error");
               if (!token) {
                    router.push("/");
               }
          }
       }, [searchQueryLeft, filterText, id, token, router])

          useEffect(() => {
          if (filterText != "") {
               filterbyAccount();
          }
     }, [filterText, filterbyAccount]);

     const debouncedSearch = useMemo(() => {
          return debounce(async (value: string) => {
               if (value.trim() === "") {
                    setEmployee([]);
               } else {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/employee/${Decryptor(id || "")}/${value}/`, {
                         method: "GET",
                         headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`
                         }
                    });
                    if (response.ok) {
                         const data = await response.json();
                         setEmployee(data.data);
                    } else {
                         console.warn("Error fetching search results");
                    }
               }
          }, 300);
      }, [id, token]);

     useEffect(() => {
          return () => {
               debouncedSearch.cancel();
          };
     }, [debouncedSearch])

     const handleEmployeeClick = (employee: Information) => {
          setSelectedEmployees(prev => {
               const alreadyExists = prev.some(emp => emp.empno === employee.empno);
               return alreadyExists ? prev : [...prev, employee];
          });
     }

     const handleRemoveClick = (empno: number) => {
          setSelectedEmployees(prev => prev.filter(emp => emp.empno !== empno));
     };

     return (
          <div>
               <ToastContainer />
               <div
                    className="modal fade"
                    id="reassignment"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
               >
                    <div className="modal-dialog modal-xl">
                         <div className="modal-content">
                              <div className="modal-header text-light">
                                   <h1 className="modal-title fs-5">Update Employee Schedule Assignment</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  ref={reassignmentCloseRef}></button>
                              </div>
                              <div className="modal-body">
                                   <div>
                                        <div>
                                             <label htmlFor="effectivitydate" className="effectivitydate fw-bold mb-3 fs-6">Schedule</label>
                                        </div>
                                        <div className="effectivity-date d-flex flex-wrap mb-1 align-items-end">
                                             <div className="d-flex gap-3">
                                                  <div className="input-group mb-3  time-icon-group">
                                                       <span className="input-group-text" id="basic-addon1">From</span>
                                                       <input
                                                            type="time"
                                                            value={timeIn}
                                                            className="form-control"
                                                            onChange={(e) => setTimeIn(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="input-group mb-3  time-icon-group">
                                                       <span className="input-group-text" id="basic-addon1">To</span>
                                                       <input
                                                            type="time"
                                                            value={timeOut}
                                                            className="form-control form-control--to"
                                                            onChange={(e) => setTimeOut(e.target.value)}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="input-group mb-3">
                                             <span className="input-group-text" id="basic-addon1">Account</span>
                                             <select
                                                  id="suggestedAccounts"
                                                  className="form-select form-select--adjustwidth"
                                                  onChange={(e) => setFilterText(e.target.value)}
                                                  value={filterText}
                                             >
                                                  <option value="" disabled hidden>Select Account</option>
                                                  {account.map(acc => (
                                                       <option key={acc.acctid} value={acc.acctid}>
                                                            {acc.acctname}
                                                       </option>
                                                  ))}
                                             </select>
                                        </div>
                                   </div>
                                   <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                                        <div className="d-flex flex-column align-items-start" style={{ flex: 1 }}>
                                             <h6 className="assign-employees">
                                                  Assign Employees <span>({employee?.length - selectedEmployees.length})</span>
                                             </h6>
                                             <div className="d-flex justity-content-center flex-wrap gap-2 w-100">
                                                  <div className="flex-grow-1"><input
                                                       className="form-control mb-2"
                                                       type="text"
                                                       placeholder="Search available..."
                                                       value={searchQueryLeft}
                                                       onChange={(e) => { setSearchQueryLeft(e.target.value); debouncedSearch(e.target.value) }}
                                                  />
                                                  </div>
                                                  <button
                                                       type="button"
                                                       className="selectall mb-2"
                                                       onClick={HandleSelectAll}
                                                  >
                                                       Select All
                                                  </button>
                                             </div>
                                             <div className="list-group w-100">
                                                  <div>
                                                       {Array.isArray(employee) && employee
                                                            .filter(emp => !selectedEmployees.some(sel => sel.empno === emp.empno))
                                                            .map(emp => (
                                                                 <div
                                                                      key={emp.empno}
                                                                      className="list-group-item d-flex justify-content-between align-items-center"
                                                                      style={{
                                                                           border: "1px solid #f0f0f0",
                                                                           borderRadius: "8px",
                                                                           marginBottom: "8px",
                                                                           padding: "12px 16px",
                                                                           backgroundColor: "#fafafa",
                                                                           cursor: "pointer",
                                                                      }}
                                                                      onClick={() => handleEmployeeClick(emp)}
                                                                 >
                                                                      <div className="d-flex justify-content-between displayed-data"><span>{emp.fname} {emp.lname}</span></div>
                                                                      <div className="d-flex justify-content-between displayed-data ms-auto me-3"> <small className="text-muted">
                                                                           {emp.schedule && emp.schedule.shiftstart && emp.schedule.shiftend
                                                                                ? `${emp.schedule.shiftstart} - ${emp.schedule.shiftend}`
                                                                                : "No schedule set"}
                                                                      </small></div>
                                                                      <div className="d-flex justify-content-between displayed-data"><small className="text-muted">{getAccountName(emp.acctid)}</small>
                                                                      </div>
                                                                 </div>
                                                            ))}
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center flex-column line" style={{ marginTop: "30px", fontSize: "24px" }}>
                                             <Image src="/svg/lr-arrow.svg" alt="arrow"  height={16} width={16}/>
                                             <div className="vertical-line"></div>
                                        </div>
                                        <div className="d-flex flex-column  align-items-start" style={{ flex: 1 }}>
                                             <div className="d-flex align-items-center  gap-4">
                                                  <h6 className="selected-emp">Selected Employees <span>({selectedEmployees?.length})</span></h6>
                                             </div>
                                             <div className="d-flex flex-wrap justify-content-center gap-2 w-100">
                                                  <div className="flex-grow-1">
                                                       <input
                                                            className="form-control mb-2"
                                                            type="text"
                                                            placeholder="Search selected..."
                                                            value={searchQuery}
                                                            onChange={handleSearchEmployee}
                                                       />
                                                  </div>
                                                  <button type="button" className="clearall mb-2" onClick={() => setSelectedEmployees([])} >Clear All</button>
                                             </div>
                                             <div className=" list-group w-100">
                                                  {Array.isArray(selectedEmployees) && selectedEmployees.filter(Boolean)
                                                       .filter(emp =>
                                                            `${emp.fname} ${emp.lname}`.toLowerCase().includes(searchQuery.toLowerCase())
                                                       ).map(emp => (
                                                            <div
                                                                 key={emp.empno}
                                                                 className="list-group-item d-flex justify-content-between align-items-center"
                                                                 style={{
                                                                      border: "1px solid #f0f0f0",
                                                                      borderRadius: "8px",
                                                                      marginBottom: "8px",
                                                                      padding: "12px 16px",
                                                                      backgroundColor: "#e6f7ff",
                                                                      cursor: "pointer",
                                                                 }}
                                                            >
                                                                 <div className="d-flex justify-content-between displayed-data"><span>{emp.fname} {emp.lname}</span></div>
                                                                 <div className="d-flex ms-auto me-3 justify-content-between displayed-data"><small className="text-muted ">{getAccountName(emp.acctid)}</small>
                                                                 </div>
                                                                 <button
                                                                      className="x-button btn btn-sm btn-danger"
                                                                      onClick={() => {
                                                                           handleRemoveClick(emp.empno)
                                                                      }}
                                                                      style={{ padding: '2px 6px', fontSize: '10px', lineHeight: 1 }}
                                                                 >
                                                                      <label htmlFor="" className="x">X</label>
                                                                 </button>
                                                            </div>
                                                       ))}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              {showModal && (
                                   <div
                                        className={`modal fade slide-from-top ${showModal ? 'show d-block' : ''}`}
                                        id="saveModal"
                                        tabIndex={-1}
                                        aria-labelledby="saveModalLabel"
                                        style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
                                   >
                                        <div className="modal-dialog" style={{ minWidth: '500px' }}>
                                             <div className="modal-content">
                                                  <div className="modal-header">
                                                       <h1 className="modal-title fs-5 text-light" id="saveModalLabel">Confirmation</h1>
                                                       <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                                                  </div>
                                                  <div className="modal-body">
                                                       <p className="view">Are you sure you want to save changes?</p>
                                                  </div>
                                                  <div className="modal-footer">
                                                       <button type="button" className="btn btn-secondary " onClick={() => setShowModal(false)}>Close</button>
                                                       <button type="button" className="btn btn-primary" onClick={() => {
                                                            handleSetSchedule();
                                                            setShowModal(false);
                                                            reassignmentCloseRef.current?.click();
                                                       }}>
                                                            Save changes
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              )}
                              <div className="d-flex justify-content-end modal-footer" >
                                   <div className="d-flex gap-3" >
                                        <button type="button" className="btn btn-secondary cancel-btn" data-bs-dismiss="modal">
                                             <span className="cancel">Cancel</span>
                                        </button>
                                        <button
                                             type="button"
                                             className="btn btn-primary clearall d-flex align-items-center"
                                             onClick={() => {
                                                  setShowModal(true);
                                             }}>
                                             Reschedule
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div >
          </div>
     );
}

