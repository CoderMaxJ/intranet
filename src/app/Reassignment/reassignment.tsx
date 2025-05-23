import { useEffect, useState, useMemo, useCallback, use } from "react";
import { Decryptor, Encryptor } from "@/security";
import debounce from 'lodash.debounce';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- ADD this
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

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
     schedule: Schedule
}

export default function () {
     const [employee, setEmployee] = useState<Information[]>([])
     const [timeIn, setTimeIn] = useState("");
     const [timeOut, setTimeOut] = useState("");
     const [searchQuery, setSearchQuery] = useState("");
     const [account, setAccount] = useState<Account[]>([]);
     const [allEmployees, setAllEmployees] = useState<Information[]>([]);
     const [filteredEmployees, setFilteredEmployees] = useState<Information[]>([]);
     const [selectedEmployees, setSelectedEmployees] = useState<Information[]>([]);
     const [searchQueryLeft, setSearchQueryLeft] = useState("");
     const [filterText, setFilterText] = useState("");

     const router = useRouter();

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

     const getAccountName = (acctid: number): string => {
          if (acctid === undefined || acctid === null) {
               return '';
          }
          const accountInfo = account.find(acc => acc.acctid === acctid);
          return accountInfo ? accountInfo.acctname : "Unassigned";
     };



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
          const token = localStorage.getItem("token");
          const decryptedToken = Decryptor(token || "");

          try {
               const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bulk/create/schedule/`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${decryptedToken}`
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
                         console.error("Server response is not JSON:", text);
                         errorToast("Failed to set schedule: Server error or wrong endpoint.");
                    }
               }
          } catch (error) {
               console.error("Error setting schedule", error);
               errorToast("An error occurred while setting schedule.");
          }
     };

     const HandleSelectAll = () => {
          setSelectedEmployees(prev => {
               const newSelection = employee.filter(
                    emp => !prev.some(selected => selected.empno === emp.empno)
               );
               return [...prev, ...newSelection];
          });
     };

     const handleSearchEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setSearchQuery(value);

          if (value.trim() === "") {
               setFilteredEmployees(allEmployees); 
          } else {
               const filtered = allEmployees.filter(emp =>
               (`${emp.fname} ${emp.lname}`.toLowerCase().includes(value.toLowerCase()) ||
                    getAccountName(emp.acctid).toLowerCase().includes(value.toLowerCase()))
               );
               setFilteredEmployees(filtered);
          }
     };

     const token = localStorage.getItem("token");
     const getAccount = async () => {
          const token = localStorage.getItem("token");
          const url = `${process.env.NEXT_PUBLIC_BACKEND}/account/list/`;
          const response = await fetch(url, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Decryptor(token || "")}`
               }
          });
          if (response.ok) {
               const data = await response.json();
               setAccount(data.data);
          } else {
               if(!token){
                router.push("/");
               }
          }
     };

     useEffect(() => {
          getAccount(); 
     }, []);

     const id = localStorage.getItem("user_id");
     const decryptedToken = Decryptor(token || '');
     useEffect(() => {
          if (filterText != "") {
               filterbyAccount();
          }
     }, [filterText])

     const filterbyAccount = async () => {
          if (searchQueryLeft === "") {
               setSearchQueryLeft("");
          }
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/employee/schedule/account/?user_id=${Decryptor(id || "")}&name=${searchQueryLeft}&account_id=${filterText}`, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${decryptedToken}`
               }
          });
          if (response.status === 200) {
               const data = await response.json();
               setEmployee(data.data);
          } else {
               console.error("error");
               if(!token){
                router.push("/");
            }
          }
     }

     const debouncedSearch = useMemo(() => {
          return debounce(async (value: string) => {
               if (value.trim() === "") {
                    setEmployee([]);
               } else {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/employee/${Decryptor(id || "")}/${value}/`, {
                         method: "GET",
                         headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${decryptedToken}`
                         }
                    });
                    if (response.ok) {
                         const data = await response.json();
                         console.log(data);
                         setEmployee(data.data);
                    } else {
                         console.error("Error fetching search results");
                    }
               }
          }, 300);
     }, []);

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
               <div
                    className="modal fade"
                    id="reassignment"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
               >
                    <div className="modal-dialog modal-xl">
                         <div className="modal-content">
                              <div className="modal-header text-light">
                                   <h1 className="modal-title fs-5">Update Employee Schedule Assignment</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                   <div>
                                        <div>
                                             <label htmlFor="effectivitydate" className="effectivitydate fw-bold mb-3 fs-6">Schedule</label>
                                        </div>

                                        <div className="effectivity-date d-flex flex-wrap mb-1 align-items-end">
                                             <div className="d-flex gap-4">
                                                  <div className="input-group mb-3  time-icon-group" style={{ minWidth: "200px" }}>
                                                       <span className="input-group-text" id="basic-addon1">From</span>
                                                       <input
                                                            type="time"
                                                            value={timeIn}
                                                            className="form-control"
                                                            onChange={(e) => setTimeIn(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="input-group mb-3  time-icon-group" style={{ minWidth: "180px" }}>
                                                       <span className="input-group-text" id="basic-addon1">To</span>
                                                       <input
                                                            type="time"
                                                            value={timeOut}
                                                            className="form-control"
                                                            onChange={(e) => setTimeOut(e.target.value)}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="input-group mb-3" style={{ minWidth: "400px" }}>
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
                                             <h6 className="assign-employees">Assign Employees <span>({employee?.length})</span></h6>
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
                                                       className="selectall"
                                                       onClick={HandleSelectAll}
                                                  >
                                                       Select All
                                                  </button>
                                             </div>
                                             <div className="list-group w-100">
                                                  <div>
                                                       {Array.isArray(employee) && employee.map(emp => (
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
                                                                 <div className="d-flex justify-content-between displayed-data"><small className="text-muted">{getAccountName(emp.acctid)}</small>
                                                                 </div>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center flex-column line" style={{ marginTop: "30px", fontSize: "24px" }}>
                                             <img src="/svg/lr-arrow.svg" alt="arrow" />
                                             <div className="vertical-line"></div>
                                        </div>
                                        <div className="d-flex flex-column  align-items-start" style={{ flex: 1 }}>
                                             <div className="d-flex align-items-center  gap-4 w-75 ">
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
                                                  <button type="button" className="clearall" onClick={(e) => setSelectedEmployees([])} >Clear All</button>
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
                                                                 <div className="d-flex justify-content-between displayed-data"><small className="text-muted">{getAccountName(emp.acctid)}</small>
                                                                 </div>
                                                                 <button
                                                                      className="x-button btn btn-sm btn-danger"
                                                                      onClick={(e) => {
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
                              {/* Add Schedule Button */}
                              <div className="d-flex justify-content-end modal-footer" >
                                   <div className="d-flex gap-3" >
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                             <span className="cancel">Cancel</span>
                                        </button>

                                        <button
                                             type="button"
                                             className="btn btn-primary clearall d-flex align-items-center"
                                             onClick={handleSetSchedule}>
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

