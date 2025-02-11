import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";

const token = localStorage.getItem("token");

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
  acctid:number;
}

interface AddEmpProps {
  empData: AddEmployeeData;
  mode: string;
  isClose: () => void;
}

export default function AddEmp({ empData, mode}: AddEmpProps) {


  const [formData, setFormData] = useState<AddEmployeeData>(empData);
  const [roles, setRoles] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<{acctid:number,acctname:string, status:number}[]>([]);
  const [selectedAccount,SetSelectedAccount]=useState("");

  useEffect(() => {
    if(empData){
      setFormData(empData);
    }
    
  }, [empData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    SetSelectedAccount(e.target.value);
  };


  const fetchRoles = async () => {

    const cachedRoles = localStorage.getItem("roles");
    if (cachedRoles) {
      setRoles(JSON.parse(cachedRoles));
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/roles/list/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token)}`,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setRoles(data.data);
        localStorage.setItem("roles", JSON.stringify(data.data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAccounts = async () => {

    const cachedRoles = localStorage.getItem("accounts");
    if (cachedRoles) {
      setRoles(JSON.parse(cachedRoles));
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/list/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token)}`,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setAccounts(data.data);
        console.log(accounts)
        localStorage.setItem("Accounts", JSON.stringify(data.data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  
  useEffect(() => {
    fetchRoles();
    fetchAccounts();
  }, []);



async function Create(){
  console.log("=================================",formData)
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/employee/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Decryptor(token)}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 201) {
      alert("Created successfully!")
     // Close the form after successful submission
    }
  } catch (e) {
    console.error(e);
    alert(e);
  }

}



async function Update(){
  
  const empno = empData.empno;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/employee/update/${empno}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Decryptor(token)}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 200) {
      alert("Updated successfully!")

    }
  } catch (e) {
    console.error(e);
    alert(e);
  }

}


  const handleSubmitForm = async (e: React.FormEvent) => {
  
    e.preventDefault();
    if(mode === 'edit'){
      Update();
    }else{
      Create();
    }
    
 
  };

const closeModal=()=>{

}
  return (
    <div>
     
      <form className="row" onSubmit={handleSubmitForm}>
        <div className="col-md-4 mb-3">
          <label htmlFor="fname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            name="fname"
            className="form-control"
            id="fname"
            value={formData.fname}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="mname" className="form-label">
            Middle Name
          </label>
          <input
            type="text"
            name="mname"
            className="form-control"
            id="mname"
            value={formData.mname}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="lname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            name="lname"
            className="form-control"
            id="lname"
            value={formData.lname}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="dateofbirth" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateofbirth"
            className="form-control"
            id="dateofbirth"
            value={formData.dateofbirth}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="maritalstatus" className="form-label">
            Marital Status
          </label>
          <select
            name="maritalstatus"
            value={formData.maritalstatus}
            id="maritalstatus"
            className="form-select"
            onChange={handleInputChange}
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
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
            name="gender"
            value={formData.gender}
            id="gender"
            className="form-select"
            onChange={handleInputChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="col-md-5 mb-3">
          <label htmlFor="contactno" className="form-label">
            Contact No
          </label>
          <input
            type="number"
            name="contactno"
            className="form-control"
            id="contactno"
            value={formData.contactno}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-5 mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            name="address"
            className="form-control"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="position" className="form-label">
            Position
          </label>
          <select
            name="position"
            value={formData.position}
            id="position"
            className="form-select"
            onChange={handleInputChange}
          >
            <option value="">Select a position</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="position" className="form-label">
            Account
          </label>
          <select
            name="acctid"
            value={selectedAccount}
            id="acctid"
            className="form-select"
            onChange={handleInputChange}
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.acctid} value={account.acctid}>
                {account.acctname}
              </option>
            ))}
          </select>
        </div>

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
          <button type="button" onClick={closeModal} className="btn btn-danger">
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            {mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}