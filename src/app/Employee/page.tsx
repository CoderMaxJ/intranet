"use client";
import Dashboard from "../Dashboard/page";
import AddEmp from "../../component/AddEmployee";
import { useEffect, useState, useMemo } from "react";
import Header from "../../component/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Decryptor } from "@/security";
import debounce from 'lodash.debounce';
import { useRouter } from "next/navigation";
import { getUserToken } from "@/services/UserToken/authUserToken";
import { getUserPrivilege } from "@/services/UserPrivileges/userPrivileges";

interface Schedule {
  shiftstart: string;
  shiftend: string;
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
  schedule: Schedule,
  acctname: string;
}

export default function CreateUD() {
  const [currentMode, setCurrentMode] = useState("");
  const [employees, setEmployees] = useState<Information[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resetPasswordTargetID, setResetPasswordTargetID] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [listener, setListener] = useState(false);
  const [empData, setEmpData] = useState<Information>({
    empno: 0,
    fname: "",
    mname: "",
    lname: "",
    position: "",
    dateofbirth: "",
    maritalstatus: "None",
    gender: "",
    contactno: "",
    address: "",
    acctid: 0,
    role_id: 0,
    status: 1,
    acctname: "",
    schedule: {
      shiftstart: "",
      shiftend: ""
    },
    isdayshift: 0,
    un: ""
  });
  const router = useRouter();
  const token = getUserToken();
  const userPrivilege = getUserPrivilege();

  useEffect(() => {
    GetEmployee(currentPage);
  }, [listener]);

  async function GetEmployee(page: number) {
    const user_id = localStorage.getItem("user_id");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/employee/list/${Decryptor(user_id || "")}/?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  }

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

  const id = localStorage.getItem("user_id");
  const debouncedSearch = useMemo(() => {
    return debounce(async (value: string) => {
      if (value.trim() === "") {
        GetEmployee(currentPage);
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
          setEmployees(data.data);
        } else {
          console.error("Error fetching search results");
        }
      }
    }, 300);
  }, [currentPage, id, token]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch])

  const handleData = (data: any) => {
    setCurrentMode("edit");
    let { empno, fname, mname, lname, dateofbirth, contactno, address, position, gender, maritalstatus, acctid, role_id, isdayshift, status, schedule, acctname, un, } = data;
    let currentData = {
      empno,
      fname,
      mname,
      lname,
      dateofbirth,
      contactno,
      address,
      position,
      gender,
      maritalstatus,
      acctid,
      role_id,
      isdayshift,
      status,
      schedule,
      acctname,
      un
    };
    setEmpData(currentData);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    GetEmployee(page);
  };

  const handleResetPassword = (empno: number) => {
    setResetPasswordTargetID(empno);
  };

  const TriggerReset = () => {
    resetPassword(Number(resetPasswordTargetID));
  }

  const resetPassword = async (empno: number) => {
    const data = { empno: empno };
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/reset/password/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (response.status === 204) {
      successToast("Password has been reset");
    } else {
      const warning = await response.json();
      errorToast(warning.warning);
    }
  };

  return (
    <div className="crud-maindiv">
      <div className="modal fade" id="resetPasswordModal" aria-labelledby="resetPasswordModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content modal-content--width" >
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-light" id="resetPasswordModalLabel">Confirmation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to reset the password?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={TriggerReset}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="db-employee">
        <Dashboard />
        <ToastContainer />
      </div>
      <div className="main-divv">
        <Header title="MANAGE EMPLOYEE" currentPage="" />
        <div className="px-4">
          <div className="manageemployee-division px-4">
            <div>
              <div className="employee-header-container">
                <header>
                  <div className=" employee-head w-100 d-flex justify-content-between flex-wrap py-2 px-4 gap-1">
                    <div className="searchbar-container py-1">
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
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                      </svg>
                    </div>
                    {userPrivilege.includes("manage_users") && (
                      <div className=" py-1">

                        <button
                          type="button"
                          className="addhover"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
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
                          <span className="view">Add Employee</span>
                        </button>
                      </div>
                    )}
                  </div>
                </header>
              </div>
              <div
                className="modal fade"
                id="exampleModal"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
              >
                <div className="modal-dialog modal-xl" role="document">
                  <div className="modal-content">
                    <AddEmp empData={empData} mode={currentMode} isClose={() => setCurrentMode("create")} onButtonClick={() => setListener(true)} />
                  </div>
                </div>
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
                    <th scope="col" >Username</th>
                    <th scope="col" >First Name</th>
                    <th scope="col" >Last Name</th>
                    {userPrivilege.includes("manage_users") && (<th scope="col" >Date of Birth</th>)}
                    {userPrivilege.includes("manage_users") && (<th scope="col" >Gender</th>)}
                    {userPrivilege.includes("manage_users") && (<th scope="col" >Contact No.</th>)}
                    {(userPrivilege.includes("manage_users") || userPrivilege.includes("update_breaktool_account")) && (<th scope="col" >Account</th>)}
                    <th scope="col" >Position</th>
                    <th scope="col" >Actions</th>
                  </tr>
                </thead>
                <tbody className="manage-tbody table-data">
                  {employees?.length ? (
                    employees.map((info, index) => (
                      <tr key={info.empno}>
                        <td className="empno-data-column">{info.empno}</td>
                        <td>{info.un}</td>
                        <td>{info.fname}</td>
                        <td>{info.lname}</td>
                        {userPrivilege.includes("manage_users") && (<td>{new Date(info.dateofbirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>)}
                        {userPrivilege.includes("manage_users") && (<td>{info.gender}</td>)}
                        {userPrivilege.includes("manage_users") && (<td>{info.contactno}</td>)}
                        {(userPrivilege.includes("manage_users") || userPrivilege.includes("update_breaktool_account")) && (<td>{info.acctname || "Unassigned"}</td>)}
                        <td>{info.position}</td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {userPrivilege.includes("update_breaktool_account") && (
                              <button
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#resetPasswordModal"
                                style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                                onClick={() => handleResetPassword(info.empno)}
                              >
                                <img src="/svg/reset.svg" className="actions-button" height={16} width={16} />
                              </button>
                            )}
                            {(userPrivilege.includes("manage_users") || userPrivilege.includes("view_multiple_accounts") || userPrivilege.includes("update_breaktool_account")) && (
                              <button
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                type="button"
                                className="edit-button ms-3"
                                onClick={() => handleData(info)}
                                style={{ cursor: "pointer", border: "none", backgroundColor: "transparent" }}
                              >
                                <img src="/svg/pencil.svg" className="actions-button" height={16} width={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center view">
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
