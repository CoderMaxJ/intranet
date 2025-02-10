import { useEffect, useState } from "react";


interface AddEmployeeData {
  empno: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  dateofbirth: string;
  maritalstatus: string;
  gender: string;
  contactno: string;
  address: string;
}

export default function AddEmp({ empData, mode }: { empData: any; mode: any }) {
  const currentData = empData;
  const [position, setPosition] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");


  useEffect(() => {
    const currentData2 = currentData;
    console.log(empData)
    if (empData.maritalstatus !== "") {

      setMaritalStatus(empData.maritalstatus);
    }

    if (empData.gender !== "") {
      setGender(empData.gender);
    }

    if (empData.position !== "") {
      setPosition(empData.position);
    }
  }, [empData]);

  function FormInput({
    id,
    label,
    type,
    classType,
    value,
  }: {
    id: string;
    label: string;
    type: string;
    classType: string;
    value: string;
  }) {
    const [inputValue, setInputValue] = useState(value);

    return (
      <div className={`mb-3 ${classType}`}>
        <label htmlFor={id} className="form-label">
          {label}
        </label>
        <input
          type={type}
          name={id}
          className="form-control"
          id={id}
          defaultValue={inputValue ? inputValue : ""}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    );
  }

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   async function getAddEmployeeData() {
  //     try {
  //       const account_id = await localStorage.getItem("account_id");

  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_BACKEND}/create/employee/`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }

  //       const data = await response.json();
  //       setData((prevData) => [...prevData, data]); 

  //       setEmpNo("");
  //       setFname("");
  //       setMname("");
  //       setLname("");
  //       setPosition("");
  //       setDob("");
  //       setMaritalStatus("");
  //       setGender("");
  //       setContactNo("");
  //       setAddress("");
  //       setUsername("");
  //       setPassword("");
  //     } catch (error) {
  //       console.error("Error fetching employee data:", error);
  //     }
  //   }

  //   getAddEmployeeData();
  // }, []);

  const undoSelect=(value:any,mode:any)=>{
    console.log("===================",value)
    console.log()
    if(value && mode == 'edit'){
      setMaritalStatus(value);
      
    }
  }

  const handleSelect=(value:any,mode:any)=>{
    console.log("===================",value)
    if(value && mode == 'edit'){
      setGender(value);
      
    }


  }

  const handleSelectPosition=(value:any,mode:any)=>{
    console.log("===================",value)
    if(value && mode == 'edit'){
      setPosition(value);
      
    }

  return (
    <div>
      <form className="row">
        <FormInput
          id="fname"
          type="text"
          label="First Name"
          classType={"col-md-4"}
          value={currentData.fname}
        />
        <FormInput
          id="mname"
          type="text"
          label="Middle Name"
          classType={"col-md-4"}
          value={currentData.mname}
        />
        <FormInput
          id="lname"
          type="text"
          label="Last Name"
          classType={"col-md-4"}
          value={currentData.lname}
        />
        <FormInput
          id="dob"
          type="date"
          label="Date of Birth"
          classType={"col-md-3"}
          value={currentData.dateofbirth}
        />
        <div className="col-md-2 mb-3">
          <label htmlFor="gender" className="form-label">
            Martital Status
          </label>
          <select
            value={maritalStatus}
            id="gender"
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => undoSelect(e.target.value,mode)}
          >
            <option value="0"></option>
            <option value="Maried1">Maried</option>
            <option value="Single">Single</option>
            <option value="Separated">Separated</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            value={gender}
            id="gender"
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => handleSelect(e.target.value,mode)}
          >
            <option value="0"></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <FormInput
          id="contact"
          type="number"
          label="Contact No"
          classType={"col-md-5"}
          value={currentData.contactno}
        />
        <FormInput
          id="address"
          type="text"
          label="Address"
          classType={"col-md-6"}
          value={currentData.address}
        />
        <div className="col-md-6 mb-3">
          <label htmlFor="position" className="form-label">
           Position
          </label>
          <select
            value={position}
            id="position"
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => handleSelectPosition(e.target.value,mode)}
          >
            <option value="0"></option>
            <option value="Manager">Chief Executive Officer</option>
            <option value="Account Manager">Account Manager</option>
            <option value="Human Resources Manager">Human Resources Manager</option>
            <option value="Administrative Assistant">Administrative Assistant</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Accountant">Accountant</option>
            <option value="Call Center Agent">Call Center Agent</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Data Analyst">Data Entry</option>
            <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
            <option value="IT Support Specialist">IT Support Specialist</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Registered Nurse">Registered Nurse</option>
          </select>
        </div>
        {/* <FormInput
          id="position"
          type="text"
          label="Position"
          classType={"col-md-6"}
          value={currentData.position}
        /> */}

        <div
          className="col-md-12"
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            gap: "50px",
            marginBottom: "30px",
            marginTop: "30px",
          }}
        >
          <button type="submit" className="btn btn-danger">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {mode == "edit" ? "Edit" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
}