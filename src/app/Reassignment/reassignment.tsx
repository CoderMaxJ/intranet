import { useEffect, useState, useMemo, useCallback } from "react";
import { Decryptor, Encryptor } from "@/security";
import debounce from 'lodash.debounce';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- ADD this
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
     const [searchQueryAPI, setSearchQueryAPI] = useState(""); // <-- New search query state for API search
     const [account, setAccount] = useState<Account[]>([]);
     const [allEmployees, setAllEmployees] = useState<Information[]>([]);
     const [filteredEmployees, setFilteredEmployees] = useState<Information[]>([]);
     const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

     const [localEmployees, setLocalEmployees] = useState([]);
     const [searchQueryLeft, setSearchQueryLeft] = useState("");
     const [filterText, setFilterText] = useState(""); // <-- ADD THIS
     const debouncedSetFilterText = useMemo(() => debounce(setFilterText, 300), [setFilterText]);


     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setFilterText(e.target.value);
     };

     const handleSearchAvailableEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setSearchQueryLeft(value);
     };

     // const handleCheckboxChange = (empno) => {
     //      setSelectedEmployees((prevSelected) =>
     //           prevSelected.includes(empno)
     //                ? prevSelected.filter(id => id !== empno) // Uncheck
     //                : [...prevSelected, empno] // Check
     //      );
     // };

     function customDebounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
          let timeout: ReturnType<typeof setTimeout>;

          return (...args: Parameters<T>) => {
               clearTimeout(timeout);
               timeout = setTimeout(() => func(...args), delay);
          };
     }
     
     const handleEmployeeClick = (empno: number) => {
          setSelectedEmployees((prevSelected) =>
            prevSelected.includes(empno) ? prevSelected.filter(id => id !== empno) : [...prevSelected, empno]   
          );
        };
        
     useEffect(() => {
          if (!timeIn || !timeOut) return;
          if (selectedEmployees.length === 0) return;

          // Update local employees immediately when timeIn/timeOut changes
          setAllEmployees(prev =>
               prev.map(emp =>
                    selectedEmployees.includes(emp.empno)
                         ? { ...emp, schedule: { shiftstart: timeIn, shiftend: timeOut } }
                         : emp
               )
          );

          setFilteredEmployees(prev =>
               prev.map(emp =>
                    selectedEmployees.includes(emp.empno)
                         ? { ...emp, schedule: { shiftstart: timeIn, shiftend: timeOut } }
                         : emp
               )
          );
     }, [timeIn, timeOut, selectedEmployees]);
     const create = async () => {
          const data = {
               empno: EmpNoList,
               timein: timeIn,
               timeout: timeOut
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bulk/create/schedule/`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Decryptor(token || "")}`,
               },
               body: JSON.stringify(data),
          });
     }

     const handleSetSchedule = async () => {
          if (!timeIn || !timeOut) {
               toast.error("Please set both Time In and Time Out before assigning schedule.");
               return;
          }
          if (selectedEmployees.length === 0) {
               toast.error("Please select at least one employee.");
               return;
          }

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
                         empno: selectedEmployees,   // <-- must be empno not employees
                         timein: timeIn,              // <-- must be timein not shiftstart
                         timeout: timeOut             // <-- must be timeout not shiftend
                    })
               });

               if (response.ok) {
                    const data = await response.json();
                    toast.success(data.message || "Schedule successfully set for selected employees!");

                    // Update local state immediately
                    setAllEmployees(prev =>
                         prev.map(emp =>
                              selectedEmployees.includes(emp.empno)
                                   ? { ...emp, schedule: { shiftstart: timeIn, shiftend: timeOut } }
                                   : emp
                         )
                    );

                    setFilteredEmployees(prev =>
                         prev.map(emp =>
                              selectedEmployees.includes(emp.empno)
                                   ? { ...emp, schedule: { shiftstart: timeIn, shiftend: timeOut } }
                                   : emp
                         )
                    );

                    setSelectedEmployees([]);
                    setTimeIn("");
                    setTimeOut("");
               } else {
                    const text = await response.text();
                    try {
                         const errorData = JSON.parse(text);
                         toast.error(`Failed to set schedule: ${errorData.message || "Unknown error"}`);
                    } catch {
                         console.error("Server response is not JSON:", text);
                         toast.error("Failed to set schedule: Server error or wrong endpoint.");
                    }
               }
          } catch (error) {
               console.error("Error setting schedule", error);
               toast.error("An error occurred while setting schedule.");
          }
     };




     const handleSearchEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setSearchQuery(value);

          if (value.trim() === "") {
               setFilteredEmployees(allEmployees); // Show all if empty search
          } else {
               const filtered = allEmployees.filter(emp =>
               (`${emp.fname} ${emp.lname}`.toLowerCase().includes(value.toLowerCase()) ||
                    getAccountName(emp.acctid).toLowerCase().includes(value.toLowerCase()))
               );
               setFilteredEmployees(filtered);
          }
     };
     const handleSearchAPI = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setSearchQueryAPI(value);
          debouncedSearch(value); // Call the debounced API search
     };

     useEffect(() => {
          getAccount();
     }, []);

     const getAccountName = (acctid: number): string => {
          if (acctid === undefined || acctid === null) {
               return '';
          }
          const accountInfo = account.find(acc => acc.acctid === acctid);
          return accountInfo ? accountInfo.acctname : "Unassigned";
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
               console.error("Failed to fetch accounts");
          }
     };
     const resetEmployeeList = () => {
          setFilteredEmployees(allEmployees);
          setSearchQuery(""); // Also clear search input if you want
     };
     const fetchAllEmployees = async () => {
          const token = localStorage.getItem("token");
          const userId = localStorage.getItem("user_id");
          const decryptedToken = Decryptor(token || '');

          let allData: Information[] = [];
          let currentPage = 1;
          let totalPages = 1; // We'll update this after first fetch

          while (currentPage <= totalPages) {
               const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/employee/list/${Decryptor(userId || "")}/?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${decryptedToken}`
                    }
               });
               if (response.ok) {
                    const data = await response.json();
                    allData = [...allData, ...data.data];  // Merge data into one array
                    totalPages = data.num_pages;           // Update total pages from backend
                    currentPage++;                         // Go to next page
               } else {
                    console.error("Failed to fetch employees at page", currentPage);
                    break;
               }
          }
          setAllEmployees(allData);        // Save full employee list
          setFilteredEmployees(allData);   // Also show full list initially
     };
     useEffect(() => {
          fetchAllEmployees(); // Fetch all employees from database
          getAccount();        // Fetch all account names
     }, []);

     const id = localStorage.getItem("user_id");
     const debouncedSearch = useMemo(() => {
          const token = localStorage.getItem("token");
          const decryptedToken = Decryptor(token || '');
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
                         setEmployee(data.data);
                    } else {
                         console.error("Error fetching search results");
                    }
               }
          }, 300);
     }, []);
     // Optional cleanup to prevent memory leaks

     useEffect(() => {
          return () => {
               debouncedSearch.cancel();
          };
     }, [debouncedSearch])

     return (
          <div>
               <div
                    className="modal fade"
                    id="reassignment"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
               >
                    <div className="modal-dialog modal-lg">
                         <div className="modal-content">
                              <div className="modal-header text-light">
                                   <h1 className="modal-title fs-5">Update Employee Schedule Assignment</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>

                              <div className="modal-body">
                                   <div>
                                        <div>
                                             <label htmlFor="effectivitydate" className="fw-bold">Effectivity Date</label>
                                        </div>

                                        <div className="d-flex gap-5 mb-4 align-items-end">
                                             <div className="d-flex gap-4">

                                                  <div className="d-flex flex-column">
                                                       <label htmlFor="timein">From</label>
                                                       <input
                                                            type="time"
                                                            value={timeIn}
                                                            className="form-control"
                                                            onChange={(e) => setTimeIn(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="d-flex flex-column">
                                                       <label htmlFor="timeout">To</label>
                                                       <input
                                                            type="time"
                                                            value={timeOut}
                                                            className="form-control"
                                                            onChange={(e) => setTimeOut(e.target.value)}
                                                       />
                                                  </div>
                                             </div>


                                             <div className="flex-column d-flex">
                                                  <label htmlFor="suggestedAccounts">Account</label>
                                                  <select
                                                       id="suggestedAccounts"
                                                       className="form-select"
                                                       onChange={(e) => setFilterText(e.target.value)}
                                                       value={filterText}
                                                  >
                                                       <option value="" disabled hidden>Select Account</option>
                                                       {account.map(acc => (
                                                            <option key={acc.acctid} value={acc.acctname}>
                                                                 {acc.acctname}
                                                            </option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="d-flex flex-wrap justify-content-between align-items-start gap-5">

                                        {/* Left Side: Unselected Employees */}
                                        <div className="d-flex flex-column align-items-start" style={{ flex: 1 }}>
                                             <h6>Assign Employees</h6>

                                             {/* LEFT SIDE SEARCH */}
                                             <input
                                                  className="form-control mb-2"
                                                  type="text"
                                                  placeholder="Search available..."
                                                  value={searchQueryLeft}
                                                  onChange={handleSearchAvailableEmployee}
                                             />

                                             <div className="list-group w-100">
                                                  <div>
                                                       {filteredEmployees
                                                            .filter(emp =>
                                                                 !selectedEmployees.includes(emp.empno) &&
                                                                 (`${emp.fname} ${emp.lname}`.toLowerCase().includes(searchQueryLeft.toLowerCase()) ||
                                                                      getAccountName(emp.acctid).toLowerCase().includes(searchQueryLeft.toLowerCase()))
                                                            )
                                                            .filter(emp =>
                                                                 getAccountName(emp.acctid).toLowerCase().includes(filterText.toLowerCase())
                                                            )
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
                                                                      onClick={() => handleEmployeeClick(emp.empno)}
                                                                 >
                                                                      <div className="d-flex flex-column">
                                                                           <span>{emp.fname} {emp.lname}</span>
                                                                           <small className="text-muted">{getAccountName(emp.acctid)}</small>
                                                                      </div>
                                                                 </div>
                                                            ))}
                                                  </div>

                                             </div>

                                        </div>

                                        {/* Arrow */}
                                        <div className="d-flex justify-content-center align-items-start" style={{ marginTop: "30px", fontSize: "24px" }}>
                                             <img src="/svg/lr-arrow.svg" alt="arrow" />

                                        </div>

                                        {/* Right Side: Selected Employees */}
                                        <div className="d-flex flex-column align-items-start" style={{ flex: 1 }}>
                                             <h6>Selected Employees</h6>

                                             {/* RIGHT SIDE SEARCH */}
                                             <input
                                                  className="form-control mb-2"
                                                  type="text"
                                                  placeholder="Search selected..."
                                                  value={searchQuery}
                                                  onChange={handleSearchEmployee}
                                             />

<div className="list-group w-100">
  {filteredEmployees
    .filter(emp =>
      selectedEmployees.includes(emp.empno) &&
      (`${emp.fname} ${emp.lname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getAccountName(emp.acctid).toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(emp =>
      getAccountName(emp.acctid).toLowerCase().includes(filterText.toLowerCase())
    )
    .map(emp => (
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
        onClick={() => handleEmployeeClick(emp.empno)}
      >
        <div className="d-flex flex-column">
          <span>{emp.fname} {emp.lname}</span>
          <small className="text-muted">{getAccountName(emp.acctid)}</small>
        </div>
      </div>
    ))}
</div>

                                        </div>
                                   </div>

                                   {/* Add Schedule Button */}
                                   <div className="d-flex justify-content-end mt-4 modal-footer">
                                        <button
                                             type="button"
                                             className="btn btn-primary d-flex align-items-center"
                                             onClick={handleSetSchedule}
                                        >
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="#ffffff"
                                                  className="bi bi-plus-circle-fill me-2"
                                                  viewBox="0 0 16 16"
                                             >
                                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                                             </svg>
                                             Reschedule Employees
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}