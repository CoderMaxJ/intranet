"use client";
import { Encryptor, Decryptor } from "@/security";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from "../Dashboard/dashboard";
import AddEmp from "../component/AddEmployee";
import { useEffect, useState } from "react";
import Header from "../component/Header";
import { ToastContainer, toast } from 'react-toastify';
import LoadingSpinner from "../component/LoadSpinner/spinner";
import { IdentifyUser } from "../user_identifier";


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
}

export default function CreateUD() {

  const [empData, setEmpData] = useState({});
  const [currentMode, setCurrentMode] = useState("");
  const [employees, setEmployees] = useState<Information[]>([]);
  const [hide, hidden] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentSearchTerm, setDepartmentSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [targetID, setTargetID] = useState<number | null>(null); // Employee ID to delete
  const [total, setTotal] = useState(0);
  const [listener, setListener] = useState(false);
  const [user_privilege, setUserPrivilege] = useState([""]);



  const token = localStorage.getItem("token");

  useEffect(() => {
    GetEmployee(currentPage);
    setTimeout(() => {
      setListener(false);
    }, 2000)
  }, [listener]);

  async function GetEmployee(page: number) {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/employee/list/${Decryptor(user_id || "")}/?page=${page}`,
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
      console.log(data);
      setEmployees(data.data); // Set employee data
      setTotalPages(data.num_pages); // Set total pages
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
      alert("An error occurred while deleting the employee.");
    }
  }


  const user_hash_privilege = localStorage.getItem("user_privilege");

  if (user_hash_privilege) {
    const array_privilege = IdentifyUser(user_hash_privilege);
    array_privilege.forEach((data) => {
      user_privilege.push(data);
    })
  }


  const id = localStorage.getItem("user_id");

  const search = (e: any) => {
    e.preventDefault();
    async function SearchData(name: string) {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/employee/${Decryptor(id || "")}/${name}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || '')}`
        }
      })
      if (response.status == 200) {
        const data = await response.json();
        setEmployees(data.data);
      } else {
        console.log("error ");
      }
    }
    if (searchTerm !== "") {
      SearchData(searchTerm);
    } else {
      GetEmployee(currentPage);
    }

    console.log(searchTerm);
  }

  const handleData = (data: any) => {
    setCurrentMode("edit");

    let { empno, fname, mname, lname, dateofbirth, contactno, address, position, gender, maritalstatus, acctid } = data;
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
      acctid
    };
    setEmpData(currentData);
  };

  const closeModal = () => {
    hidden(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update the current page
    GetEmployee(page); // Fetch data for the new page
  };

  const test = async (e: any) => {
    e.preventDefault();

    search(e);
  }

  const handleResetPassword = (empno: number, fname: string) => {

    async function resetPassword() {
      const data = { empno: empno }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/reset/password/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`
        },
        body: JSON.stringify(data)
      })
      if (response.status === 204) {
        successToast("Password has been reset");
      } else {
        const warning = await response.json();
        errorToast(warning.warning);
        console.log("error");
      }
    }
    const response = confirm(`Are you sure you want to reset the password of ? ${fname}`);
    if (response) {
      resetPassword();
    }

  }

  return (
    <div className="crud-maindiv" style={{ backgroundColor: "#e7e7e7", display: "flex" }}>
      <div className="db-employee">
        <Dashboard />
      </div>
      <div className="main-divv"><Header title="MANAGE EMPLOYEE" /></div>
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
      <div className="manageemployee-division">
        <div >
          <div>
            <header
              className="crud-header"

            >
              <div className="search-employee w-100 d-flex" style={{ marginTop: "30px" }}>
                <div className="searchbar-containerr">
                  <input
                    className="searchbar"
                    id="search-employee"
                    style={{
                      backgroundColor: "#f0f0f0",
                    }}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={test}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    className="bi-search"
                    viewBox="-7 0 30 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </div>

                {user_privilege.includes("manage_users") && (
                  <div className="manageemployee-button">
                    <button
                      type="button"
                      className=" btn btn-success btn-sm d-flex align-items-center ms-4"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      style={{
                        borderRadius: "4px",
                        fontWeight: "500",
                        padding: '10px',
                        whiteSpace: 'nowrap',
                        backgroundColor: '#0ebb39',
                        border: 'none',
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >{user_privilege.includes("manage_users")}{

                      }
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
                      Add Employee
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
          >
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content px-4">
                <AddEmp empData={empData} mode={currentMode} isClose={() => setCurrentMode("create")} onButtonClick={() => setListener(true)} />
              </div>
            </div>
          </div>
        </div>
        <div className="managereport" style={{ maxHeight: "670px", position: 'absolute' }}>
          <table
            className="table table-striped table-hover table-bordered"
            id="table-employee"
            style={{ marginLeft: "15px", marginRight: "40px", width: "81vw", marginTop: '40px' }}
          >
            <thead>

              <tr>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Employee No.</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>First Name</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Middle Name</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Last Name</th>
                {user_privilege.includes("manage_users") && (<th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff", }}>Address</th>)}
                {user_privilege.includes("manage_users") && (<th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Marital Status</th>)}
                {user_privilege.includes("manage_users") && (<th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Date of Birth</th>)}
                {user_privilege.includes("manage_users") && (<th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Gender</th>)}
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Position</th>
                {user_privilege.includes("manage_users") && (<th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Contact No.</th>)}
                {user_privilege.includes("update_breaktool_account") && (<th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Username</th>)}
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="manage-tbody table-data" >
              {employees?.length ? (
                employees.map((info, index) => (
                  <tr key={info.empno}>
                    <td>{info.empno}</td>
                    <td>{info.fname}</td>
                    <td>{info.mname}</td>
                    <td>{info.lname}</td>
                    {user_privilege.includes("manage_users") && (<td>{info.address}</td>)}
                    {user_privilege.includes("manage_users") && (<td>{info.maritalstatus}</td>)}
                    {user_privilege.includes("manage_users") && (<td>{new Date(info.dateofbirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>)}
                    {user_privilege.includes("manage_users") && (<td>{info.gender}</td>)}
                    <td>{info.position}</td>
                    {user_privilege.includes("update_breaktool_account") && (<td>{info.un}</td>)}
                    {user_privilege.includes("manage_users") && (<td>{info.contactno}</td>)}
                    {user_privilege.includes("update_breaktool_account") && (
                      <td>
                        <button
                          className="ms-4"
                          type="button"
                          onClick={() => handleResetPassword(info.empno, info.fname)}
                          style={{ border: "none", backgroundColor: "transparent" }}
                        >
                          <img src="img/reset.png" alt="" height={25} width={25} />
                        </button>
                      </td>
                    )}


                    {user_privilege.includes("manage_users") && (<td>
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        data-bs-whatever="@mdo"
                        type="button"
                        className="edit-button"
                        onClick={(e) => handleData(info)}
                        style={{ cursor: "pointer" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                      </button>
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        type="button"
                        className="delete-button"
                        onClick={() => setTargetID(info.empno)}
                        style={{ cursor: "pointer" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      </button>
                    </td>
                    )}
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
        <div className="manageemployee-div" style={{ display: "flex", justifyContent: "flex-end", width: "88.8vw" }}>
          <div className="employee-total">
            <p>Total: <span>{total}</span></p>
          </div>
          <div className="employee-pagination">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {/* {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))} */}
                 <li className="page-item">
                  <span className="page-link" style={{whiteSpace:'nowrap'}}>
                   Page {currentPage} of {totalPages}
                  </span>
                </li>

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}