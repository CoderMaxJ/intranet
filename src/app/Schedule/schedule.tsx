"use client";
import Dashboard from "../Dashboard/dashboard";
import AddEmp from "../component/AddEmployee";
import Reassignment from "../Reassignment/reassignment";
import { useEffect, useState, useMemo } from "react";
import Header from "../component/Header";
import { ToastContainer, toast } from 'react-toastify';
import { IdentifyUser } from "../user_identifier";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Decryptor } from "@/security";
import debounce from 'lodash.debounce';

interface Schedule {
    shiftstart: string;
    shiftend: string;
    created_at: string;
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
}

interface Account {
    acctname: string
    acctid: number
}

export default function CreateUD() {
    const [empData, setEmpData] = useState({});
    const [currentMode, setCurrentMode] = useState("");
    const [employees, setEmployees] = useState<Information[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [targetID, setTargetID] = useState<number | null>(null);
    const [resetPasswordTargetID, setResetPasswordTargetID] = useState<number | null>(null);
    const [total, setTotal] = useState(0);
    const [listener, setListener] = useState(false);
    const [user_privilege, setUserPrivilege] = useState([""]);
    const [isresetPassword, setResetPassword] = useState(false);
    const [update, setUpdate] = useState(false);
    const [account, setAccount] = useState<Account[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    const [allSelected, setAllSelected] = useState(false);
    const [timeIn, setTimeIn] = useState("");
    const [timeOut, setTimeOut] = useState("");
    const EmpNoList: any = [];

    const token = localStorage.getItem("token");

    const toggleSelect = (empno: number) => {
        setSelectedEmployees(prev =>
            prev.includes(empno) ? prev.filter(id => id !== empno) : [...prev, empno]
        );
    };

    useEffect(() => {
        EmpNoList.push(...selectedEmployees);
    }, [EmpNoList])

    useEffect(() => {
        GetEmployee(currentPage);
        setTimeout(() => {
            setListener(false);
        }, 2000);
    }, [listener]);

    async function GetEmployee(page: number) {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND}/employee/list/schedule/${Decryptor(user_id || "")}/?page=${page}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Decryptor(token || "")}`,
                },
            }
        );
        if (response.ok) {
            const data = await response.json();
            setEmployees(data.data);
            setTotalPages(data.num_pages);
            setTotal(data.total);
        }
    }
    const url = `${process.env.NEXT_PUBLIC_BACKEND}/account/list/`
    async function getAccout() {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${Decryptor(token || "")}`
            }
        })
        if (!response.ok) {
            console.log("error")
        }
        const data = await response.json();
        setAccount(data.data)
    }

    useEffect(() => {
        getAccout();
    }, [])

    const getAccountName = (acctid: number): string => {
        if (acctid == undefined || acctid == null) {
            return '';
        }
        const accountInfo = account.find(acc => acc.acctid === acctid);
        return accountInfo ? accountInfo.acctname : "Unassigned"; // Return "N/A" if no account is found
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

    const handleDelete = async (empno: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/employee/delete/${empno}/`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Decryptor(token || "")}`,
                    },
                }
            );
            if (response.status === 204) {
                successToast("Deleted successfully.");
                GetEmployee(currentPage);
            } else {
                alert("Failed to delete employee.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const user_hash_privilege = localStorage.getItem("user_privilege");

    if (user_hash_privilege) {
        const array_privilege = IdentifyUser(user_hash_privilege);
        array_privilege.forEach((data) => {
            user_privilege.push(data);
        });
    }

    const id = localStorage.getItem("user_id");
    const debouncedSearch = useMemo(() => {
        return debounce(async (value: string) => {
            if (value.trim() === "") {
                GetEmployee(currentPage);
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/employee/schedule/${Decryptor(id || "")}/${value}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Decryptor(token || '')}`
                    }
                });

                if (response.ok) {
                      
                    const data = await response.json();
                    console.log(data.data);
                    setEmployees(data.data);
                } else {
                    console.error("Error fetching search results");
                }
            }
        }, 300); // 300ms debounce
    }, [currentPage, id, token]);

    // Optional cleanup to prevent memory leaks
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // useEffect(() => {
    //     return () => {
    //         debouncedSearch.cancel();
    //     };
    // }, [debouncedSearch])
    const handlePageChange = (page: number) => {
        setCurrentPage(page); // Update the current page
        GetEmployee(page); // Fetch data for the new page
    };

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

        if (response.status === 201) {
            const data = await response.json();
          

            successToast(data.message);
            GetEmployee(currentPage);
            setSelectedEmployees([]);
            setAllSelected(false);
        } else {
            const error = await response.json();
            errorToast(error.message);
        }
    }
    const CreateSchedule = () => {
        if (timeIn === "" || timeOut === "" || EmpNoList == 0) {
            return null;
        } else {
            create();
        }

    }

    return (

        <div className="crud-maindiv">
            <div>
                <Reassignment />
            </div>
            <div className="db-employee">
                <Dashboard />
            </div>
            <div className="main-divv">
                <Header title="MANAGE SCHEDULE" />
                <div className="px-4">
                    <div className="manageemployee-division">
                        <div>
                            <div>
                                <header>
                                    <div className="manageemployee-button w-100 d-flex flex-wrap">
                                        <div className="time d-flex gap-4 flex-wrap px-3">
                                            <div className="searchbar-container">
                                                <input
                                                    className="form-control form-control--search"
                                                    id="search-employee"
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        debouncedSearch(e.target.value);
                                                    }}
                                                />
                                                <svg
                                                    className="schedule-svg"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                                </svg>
                                            </div>
                                            
                                            <div className="updateschedule">
                                            <button
                                                type="button"
                                                className="d-flex align-items-center"
                                                data-bs-toggle="modal"
                                                data-bs-target="#reassignment"
                                            >
                                                <div>
                                                    <img
                                                        src="/svg/update.svg"
                                                        alt="update"
                                                        style={{
                                                            width: '15px',
                                                            height: '15px',
                                                            marginRight: '5px',
                                                            filter: 'brightness(100) contrast(2.5)',
                                                            display: 'inline-block',
                                                        }}
                                                    />
                                                </div>
                                                <div><span className="updateschedule-label">Update Schedule</span></div>
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </header>
                            </div>
                            <div
                                className="modal fade"
                                id="exampleModal"
                                role="dialog"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                            >
                            </div>
                        </div>
                        <div className="emp-table px-4" style={{ position: 'relative', height: 'auto' }}>

                            <table
                                className="tabemp table table-striped table-hover table-bordered"
                                id="table-employee"
                                style={{ margin: 'auto' }}
                            >
                                <thead>
                                    <tr>
                                        <th scope="col" >Employee No.</th>
                                        <th scope="col">Full Name</th>

                                        <th scope="col" >Account</th>
                                        <th scope="col" >Position</th>
                                        <th scope="col" >Time In</th>
                                        <th scope="col" >Time Out</th>
                                        <th scope="col">Schedule Type</th>
                                        <th>Last Modified</th>
                                    </tr>
                                </thead>
                                <tbody className="manage-tbody table-data">
                                    {employees?.length ? (
                                        employees.map((info: Information) => (
                                            <tr key={info.empno}>
                                                <td className="p">{info.empno}</td>
                                                <td>{`${info.fname} ${info.lname}`}</td>
                                                <td>{getAccountName(info.acctid)}</td>
                                                <td>{info.position}</td>
                                                <td>{info?.schedule?.shiftstart || "--"}</td>
                                                <td>{info?.schedule?.shiftend || "--"}</td>
                                                <td>{info.isdayshift === 0 ? "Night Shift" : "Morning Shift"}</td>
                                                <td>{info.schedule?.created_at}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={11} className="text-center">
                                                No employees found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {searchTerm == "" && (
                            <div className="manageemployee-div">
                                <div className="employee-total">
                                    <p><i className="bi bi-people-fill"></i><span> Total: {total}</span></p>
                                </div>
                                <div className="employee-pagination">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                    <i className="bi bi-caret-left"></i>
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <span className="page-link" style={{ whiteSpace: 'nowrap' }}>
                                                    {currentPage} of {totalPages}
                                                </span>
                                            </li>
                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                                    <i className="bi bi-caret-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ToastContainer />
                <div className="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="deleteModalLabel">Confirmation</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this employee?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        if (targetID !== null) {
                                            handleDelete(targetID);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}