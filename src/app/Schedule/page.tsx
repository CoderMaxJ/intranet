"use client";
import Dashboard from "../../component/Dashboard/page";
import Reassignment from "../../component/Reassignment/reassignment";
import { useEffect, useState, useMemo, useCallback } from "react";
import Header from "../../component/Header";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Decryptor } from "@/security";
import debounce from 'lodash.debounce';
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    acctname: string;
}

export default function CreateUD() {
    const [employees, setEmployees] = useState<Information[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [listener, setListener] = useState(false);
    const router = useRouter();
    const token = localStorage.getItem("token");
    
        const GetEmployee = useCallback(async (page: number) => {
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
        if(response.status == 401){
            alert('Session Expired!')
            localStorage.clear();
            router.push('/');
        }
        if (response.ok) {
            const data = await response.json();
            setEmployees(data.data);
            setTotalPages(data.num_pages);
            setTotal(data.total);
        }
    },[router ]);

      useEffect(() => {
        GetEmployee(currentPage);
        setTimeout(() => {
            setListener(false);
        }, 2000);
    }, [listener, GetEmployee, currentPage]);
    
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
                    setEmployees(data.data);
                } else {
                    console.warn("Error fetching search results");
                }
            }
        }, 300);
    }, [currentPage, id, token, GetEmployee ]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        GetEmployee(page);
    };

    return (
        <div className="crud-maindiv">
            <div>
                <Reassignment />
            </div>
            <div className="db-employee">
                <Dashboard />
            </div>
            <div className="main-divv">
                <Header title="MANAGE SCHEDULE" currentPage="" />
                <div className="px-4">
                    <div className="manageemployee-division px-4">
                        <div>
                            <div>
                                <header>
                                    <div className="manageemployee-button w-100 d-flex flex-wrap">
                                        <div className="time d-flex gap-1 flex-wrap px-3">
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
                                                        <Image
                                                            src="/svg/update.svg"
                                                            alt="update"
                                                            style={{
                                                                marginRight: '5px',
                                                                filter: 'brightness(100) contrast(2.5)',
                                                                display: 'inline-block',
                                                            }}
                                                            height={16}
                                                            width={16}
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
                            >
                            </div>
                        </div>
                        <div className="emp-table" style={{ position: 'relative', height: 'auto' }}>

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
                                                <td>{(info.acctname || "Unassigned")}</td>
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
            </div>
        </div>
    );
}