import { useEffect, useState, useMemo, use } from "react";
import { Decryptor, Encryptor } from "@/security";
import debounce from 'lodash.debounce';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- ADD this

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
        const token = localStorage.getItem("token"); // Move inside
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
            <div className="modal fade" id="reassignment" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Update Employee Schedule Assignment</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div><label htmlFor="effectivitydate" className="fw-bold">Effectivity Date</label></div>
                            <div>
                                <label htmlFor="timein">From:</label>
                                <input type="time" value={timeIn} className="timein" onChange={(e) => setTimeIn(e.target.value)} />
                                <label htmlFor="timeout">To:</label>
                                <input type="time" value={timeOut} className="timeout" onChange={(e) => setTimeOut(e.target.value)} />
                            </div>

                            <div><label htmlFor="assignemployees" className="fw-bold">Assign Employees</label></div>
                            <div className="container text-center">
                            <div className="flex-wrap justify-content-between row align-items-start">
                                <div className="col d-flex justify-content-center align-items-center">
                                    <input
                                        className="searchbar"
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleSearchEmployee}
                                    />
                                </div>
                                <div className="col d-flex justify-content-center align-items-center">
                                    Arrow
                                </div>
                                <div className="col d-flex justify-content-center align-items-center">
                                    <input
                                        className="searchbar"
                                        type="text"
                                        placeholder="Search employees (API)..."
                                        value={searchQueryAPI}
                                        onChange={handleSearchAPI}
                                    />
                                </div>
                                </div>
                            </div>

                            <div className="list-group mt-3 w-100">
                                {searchQueryAPI.trim() !== "" ? (
                                    employee.length > 0 ? (
                                        employee.map((emp) => (
                                            <div
                                                key={emp.empno}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                                style={{ border: "1px solid #f0f0f0", borderRadius: "8px", marginBottom: "8px", padding: "12px 16px", backgroundColor: "#fafafa" }}
                                            >
                                                <span>{emp.fname} {emp.lname}</span>
                                                <span className="text-muted">{getAccountName(emp.acctid)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No employees found in API search.</p>
                                    )
                                ) : (
                                    filteredEmployees.length > 0 ? (
                                        filteredEmployees.map((emp) => (
                                            <div
                                                key={emp.empno}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                                style={{ border: "1px solid #f0f0f0", borderRadius: "8px", marginBottom: "8px", padding: "12px 16px", backgroundColor: "#fafafa" }}
                                            >
                                                <span>{emp.fname} {emp.lname}</span>
                                                <span className="text-muted">{getAccountName(emp.acctid)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No employees found.</p>
                                    )
                                )}
                            </div>
                      
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary d-flex align-items-center"
                                data-bs-toggle="modal"
                                data-bs-target="#reassignment"
                                onClick={resetEmployeeList} // <<< ADD THIS
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
                                Add Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}