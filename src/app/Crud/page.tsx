"use client";
import { Encryptor,Decryptor } from "@/security";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AddEmp from "../component/AddEmp";
import { useEffect, useState } from "react";


interface Information {
  empno:number;
  gender:string;
  fname: string;
  lname:string;
  mname:string;
  maritalstatus:string;
  dateofbirth:string;
  address:string;
  contactno:string;
  position:string;

}

export default function CreateUD() {
  const [success,setSuccess]=useState(false);
  const [empData, setEmpData] = useState({});
  const [currentMode, setCurrentMode] = useState("");
  const [employees, setEmployees] = useState<Information[]>([]);


  useEffect(()=>{
    if(employees){
      
    }
    if(!success){
      GetEmployee();
    }
  },[employees]);



  async function GetEmployee() {
    const token = localStorage.getItem("token")
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/employee/list/`,{
      method :"GET",
      headers:{
        "Content-Type":"apllication/json",
        Authorization: `Bearer ${Decryptor(token)}`
      }
    })

    if(response.ok){
      const data = await response.json();
      console.log(data)
      setEmployees(data.data);
      setSuccess(true);
    }


    


  }

  const handleData = (data: any) => {
    console.log("data",data);
    setCurrentMode("edit");
    let {empno,fname,mname,lname,dateofbirth,contactno,address,position,gender,maritalstatus} = data;
    let currentData = {
      empno,fname,mname,lname,dateofbirth,contactno,address,position,gender,maritalstatus
    };
    console.log("current data: ", currentData);
    
    setEmpData(currentData);
  };

  const handleDelete = (Empno: any) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.empno !== Empno)
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
              <button
                onClick={() => window.history.back()}
                type="button"
                className="gobackbutton btn-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-reply-fill"
                  viewBox="0 0 16 16"
                  style={{marginBottom:'5px'}}
                >
                  <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
                </svg>{" "}
                Back
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
                  {/* <label htmlFor="emp-info" style={{ marginBottom: "-25px" }}>
                    {" "}
                    Please fill in the information requested below in order to
                    complete the employee registration. Thank You!
                  </label> */}
                </div>
                <AddEmp empData={empData} mode={currentMode}/> 
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
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Employee No.</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>First Name</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Middle Name</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Last Name</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Address</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Marital Status</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Date of Birth</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Gender</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Position</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Contact No.</th>
              <th scope="col" style={{backgroundColor:'#096dca', color:'#ffffff'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
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
                   onClick={(e)=>handleData(info)}
                    style={{ cursor: "pointer" }}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg> Update
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    
                    style={{ cursor: "pointer" }}
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
</svg> Delete
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
      </div>
    </div>
  );
}
