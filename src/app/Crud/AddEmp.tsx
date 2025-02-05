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
  console.log(empData);
  const [empNo, setEmpNo] = useState(currentData?.empNo || "");
  const [fname, setFname] = useState(currentData?.fname || "");
  const [mname, setMname] = useState(currentData?.mname || "");
  const [lname, setLname] = useState(currentData?.lname || "");
  const [position, setPosition] = useState(
    currentData?.position || ""
  );
  const [dob, setDob] = useState(currentData?.dateofbirth || "");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [contactNo, setContactNo] = useState(
    currentData?.contactno || ""
  );
  const [address, setAddress] = useState(currentData?.address || "");
  const [username, setUsername] = useState(currentData?.username || "");
  const [password, setPassword] = useState(currentData?.password || "");

  useEffect(() => {
    const currentData2 = currentData;
    if (empData.maritalStatus !== "") {
      setMaritalStatus(empData.maritalStatus);
    }

    if (empData.gender !== "") {
      setGender(empData.gender);
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
  //   const timer = setTimeout(async () => {
  //     async function getLogs() {
  //       try {
  //         const account_id = await localStorage.getItem("account_id");
  //         const response = await fetch(`http://localhost:8000/employees`,
  //           {
  //             method: "GET",
  //             headers: {
  //               "Content-type": "application/json",
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }

  //         const data = await response.json();

  //       }
  //     )

  // }, []);


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
            onChange={(e) => setMaritalStatus(e.target.value)}
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
            onChange={(e) => setGender(e.target.value)}
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
        <FormInput
          id="position"
          type="text"
          label="Position"
          classType={"col-md-6"}
          value={currentData.position}
        />

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
