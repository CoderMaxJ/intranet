"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AddEmp from "./AddEmp";
import { useState } from "react";

export default function CreateUD() {
  const [empData, setEmpData] = useState({});
  const [currentMode, setCurrentMode] = useState("");
  const [employees, setEmployees] = useState([
    {
      Empno: "20251",
      fname: "John Cel",
      mname: "Labajo",
      lname: "Rio",
      username: "John",
      password: "Ipsumlorem",
      position: "Developer",
      contactno: "09893776467",
    },
    {
      Empno: "20252",
      fname: "Johnsen",
      mname: "Alquizola",
      lname: "Sopeta",
      username: "Bombastic",
      password: "Ipsumlorem2",
      position: "Developer",
      contactno: "09893776467",
    },
    {
      Empno: "20253",
      fname: "Gilbert",
      mname: "Nonchalant",
      lname: "Fuentes",
      username: "Gilberto",
      password: "Ipsumlorem1",
      position: "Developer",
      contactno: "09893776467",
    },
  ]);

  const handleData = (data: any) => {
    setCurrentMode("edit");
    let currentData = {
      Empno: "212",
      fname: "john",
      mname: "sopeta",
      lname: "alquizola",
      dateofbirth: "july 31, 2000",
      contactno: "09318481376",
      address: "barili",
      position: "developer",
      gender: "Male",
      maritalstatus: "Single",
    };
    setEmpData(currentData);
  };

  const handleDelete = (Empno: any) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.Empno !== Empno)
    );
  };

  return (
    <div className="crud-maindiv" style={{ backgroundColor: "#e7e7e7" }}>
      <div>
        <div>
          <div>
            <header className="crud-header">
              <button
                type="button"
                className="add"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#ffffff"
                  className="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                  style={{
                    marginLeft: "2px",
                    marginRight: "5px",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
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
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <h1>Employee Registration Form</h1>
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginBottom: "70px",
                  }}
                >
                  <label htmlFor="emp-info" style={{ marginBottom: "-25px" }}>
                    {" "}
                    Please fill in the information requested below in order to
                    complete the employee registration. Thank You!
                  </label>
                </div>
                <AddEmp empData={empData} mode={currentMode} />
              </div>
            </div>
          </div>
        </div>

        <table
          className="table table-striped table-hover"
          style={{ marginLeft: "40px", marginRight: "40px", width: "96vw" }}
        >
          <thead>
            <tr>
              <th scope="col"  style={{backgroundColor:'#008f2b', color:'#ffffff'}}>#</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>Employee No.</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>First Name</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>Middle Name</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>Last Name</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>User Name</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>Password</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>Position</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>Contact No.</th>
              <th scope="col" style={{backgroundColor:'#008f2b', color:'#ffffff'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee.Empno}>
                <th scope="row">{index + 1}</th>
                <td>{employee.Empno}</td>
                <td>{employee.fname}</td>
                <td>{employee.mname}</td>
                <td>{employee.lname}</td>
                <td>{employee.username}</td>
                <td>{employee.password}</td>
                <td>{employee.position}</td>
                <td>{employee.contactno}</td>
                <td>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-bs-whatever="@mdo"
                    onClick={(e) => handleData(employee)}
                    className="edit-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(employee.Empno)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-trash3-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
