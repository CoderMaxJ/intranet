"use client";
import { Encryptor, Decryptor } from "@/security";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from "../Dashboard/dashboard";
import AddEmp from "../component/AddEmployee";
import { useEffect, useState } from "react";
import SuccessMessage from "../component/Successmessage";

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
}

export default function CreateUD() {
  const [success, setSuccess] = useState(false);
  const [empData, setEmpData] = useState({});
  const [currentMode, setCurrentMode] = useState("");
  const [employees, setEmployees] = useState<Information[]>([]);
  const [hide, hidden] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentSearchTerm, setDepartmentSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [isDelete, setIsDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1);
  const [targetID,setTargetID]=useState(0); // Total pages state
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!success) {
      GetEmployee(currentPage); // Fetch data for the current page
    }
  }, [currentPage, searchTerm, departmentSearchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleSearchDepartment = (event: any) => {
    setDepartmentSearch(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when filtering by department
  };

  async function GetEmployee(page: number) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/employee/list/?page=${page}&search=${searchTerm}&department=${departmentSearchTerm}`,
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
      setEmployees(data.data); 
      setTotalPages(data.num_pages); 
      setSuccess(true);
    }
  }

  const handleDelete = (empno: number) => {
  
    async function Delete() {
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

        if (response.status === 200) {
          alert("Deleted successfully!");
          GetEmployee(currentPage);

        }
      } catch (e) {
        console.error(e);
        alert(e);
      }
    }
    Delete();
    
  };

  const handleData = (data: any) => {
    console.log("data", data);
    setCurrentMode("edit");

    let { empno, fname, mname, lname, dateofbirth, contactno, address, position, gender, maritalstatus } = data;
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
    };
    console.log("current data: ", currentData);

    setEmpData(currentData);
  };

  const closeModal = () => {
    hidden(true);
  };

  // Pagination controls
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update the current page
    GetEmployee(page); // Fetch data for the new page
  };

  return (
    <div className="crud-maindiv" style={{ backgroundColor: "#e7e7e7", display: "flex" }}>
      <div className="db-employee">
        <Dashboard />
      </div>


      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteModalLabel">Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={() => handleDelete(targetID)} type="button" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
      <div>
       
        <div>
          
          <div>
            <header
              className="crud-header"
              style={{
                backgroundImage: "url('/img/Breaktool.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                position: "sticky",
                zIndex: 1,
                color: "white",
              }}
            >
              <div className="search-employee">
                <input
                  className="search-input"
                  id="search-employee"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{
                    padding: "8px 60px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    position: "relative",
                    marginLeft: "490px",
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  className="bi-search"
                  viewBox="-7 0 30 16"
                  style={{ color: "#595b5c", transform: "translateX(490px)", top: "7px" }}
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </div>
     
              <button
                type="button"
                className="add btn-success btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                style={{ marginRight: "10px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#ffffff"
                  className="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                  style={{ marginBottom: "5px", marginRight: "5px" }}
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                Add New Employee
              </button>
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
                <AddEmp empData={empData} mode={currentMode} />
              </div>
            </div>
          </div>
        </div>

        <div className="managereport" style={{ overflowY: "auto", maxHeight: "888px", position: "fixed" }}>
          <table
            className="table table-striped table-hover table-bordered"
            id="table-employee"
            style={{ marginLeft: "1px", marginRight: "40px", width: "88.8vw" }}
          >
            <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#266bc5" }}>
              <tr>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Employee No.</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>First Name</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Middle Name</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Last Name</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Address</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Marital Status</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Date of Birth</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Gender</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Position</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Contact No.</th>
                <th scope="col" style={{ backgroundColor: "#4391f7", color: "#ffffff" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="table-data">
              {employees?.length ? (
                employees.map((info, index) => (
                  <tr key={info.empno}>
                    <td>{info.empno}</td>
                    <td>{info.fname}</td>
                    <td>{info.mname}</td>
                    <td>{info.lname}</td>
                    <td>{info.address}</td>
                    <td>{info.maritalstatus}</td>
                    <td>{new Date(info.dateofbirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                    <td>{info.gender}</td>
                    <td>{info.position}</td>
                    <td>{info.contactno}</td>
                    <td>
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
                        data-bs-toggle="modal" data-bs-target="#deleteModal"
                        type="button"
                        className="delete-button"
                        onClick={() => {setTargetID(info.empno)}}
                        style={{ cursor: "pointer" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      </button>
                    </td>
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
              <div style={{display:"flex", justifyContent:"flex-end",width:"88.8vw",marginRight:"40px"}}>
                                   
          <nav className="border border" aria-label="Page navigation" style={{marginRight:"20px"}}>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        
              </div>
        </div>

        {/* Pagination Controls */}
      
      </div>
    </div>
  );
}