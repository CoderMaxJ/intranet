import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import { set } from "date-fns";

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
  acctid: number;
  un:string;
  role_id:number;
  is_dayshift:boolean
}

interface AddEmpProps {
  empData: AddEmployeeData;
  mode: string;
  isClose: () => void;
}

export default function AddEmp({ empData, mode }: AddEmpProps) {


  const [formData, setFormData] = useState<AddEmployeeData>(empData);
  const [roles, setRoles] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<{ acctid: number, acctname: string, status: number }[]>([]);
  const [selectedAccount, SetSelectedAccount] = useState("");
  const [breaktool_user,setBreaktoolUser]=useState("");
  const [generatedNumber,setGeneratedNumber]=useState(Number);
  const [is_dayshift,setIsDayShift]=useState(0);

  useEffect(() => {
    if (empData) {
      setFormData(empData);
    }

  }, [empData]);

  // console.log(formData)

 
  const generateRandomNumber = () => {
    const min = 1000; 
    const max = 9999; 
    const random = Math.floor(Math.random() * (max - min + 4)) + min;
    setGeneratedNumber(random);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    // Handle checkbox separately
    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: isChecked ? 1 : 0, // Convert boolean to 1 or 0
      }));
      return;
    }
  
    // Handle other inputs
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    // Automatically update breaktool_user and un when first name or last name changes
    if (name === "fname") {
      const initials = getInitials(value);
      setBreaktoolUser(initials);
      setFormData((prev) => ({
        ...prev,
        un: `${initials}.${prev.lname || ""}`.trim(),
      }));
    }
  
    if (name === "lname") {
      setFormData((prev) => ({
        ...prev,
        un: `${breaktool_user}.${value}`.trim(),
      }));
    }
  };
  
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
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
          Authorization: `Bearer ${Decryptor(token || "")}`,
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
          Authorization: `Bearer ${Decryptor(token || "")}`,
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



  async function Create() {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/employee/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        alert("Created successfully!")
        clearInputs();
        // Close the form after successful submission
      }
    } catch (e) {
      console.error(e);
      alert(e);
    }

  }



  async function Update() {
    const empno = empData.empno;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/employee/update/${empno}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`,
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
    if (mode === 'edit') {
      Update();
    } else {
      Create();
    }


  };

console.log("8888888888888888888888888888888888", formData)
  const clearInputs=()=>{
    setFormData({
      empno: "",
      fname: "",
      mname: "",
      lname: "",
      position: "",
      dateofbirth: "",
      maritalstatus: "",
      gender: "",
      contactno: "",
      address: "",
      acctid: 0,
      un: "",
      role_id:0,
      is_dayshift:0
    });
  
    // Reset the username state
    setBreaktoolUser("");
  
    // Optionally reset selected account
    SetSelectedAccount("");
    mode="create"

  }
  return (
    <div>

      <form className="row" onSubmit={handleSubmitForm} >
        <div className="col-md-4 mb-3">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              marginTop: '-1px'
            
            }
          }
          onClick={clearInputs}
          >
          </button>
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
            placeholder="Juan"
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
            placeholder="Montenegro"
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
            placeholder="Dela Cruz"
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
            placeholder="+63 02 6645 9723"
          />
        </div>
        <div className="col-md-4 mb-3">
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
            placeholder="Zapatera, Cebu City"
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
            
        <div className="col-md-3 mb-3">
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
        <div className="col-md-2 mt-3  d-flex justify-content-center align-items-center">
          <label htmlFor="is_dayshift" className="form-label">
            Day Shift
            <span className="ms-2">  
            <input
             style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px", // Rounded edges
              border: "1px solid #ccc",
              cursor: "pointer",
              marginLeft:"10px",
            }}
            type="checkbox"
            name="is_dayshift"
            className="form-check-input "
            id="is_dayshift"
            value={formData.is_dayshift}
            checked={formData.is_dayshift===1}
            onChange={handleInputChange}
          /></span>
          </label>
        
       
        </div>
      
        <div className="col-md-4 mb-3">
          <label htmlFor="address" className="form-label">
            Generated username for Breaktool account
          </label>
          <input
          
            readOnly
            disabled={true}
            type="text"
            name="un"
            className="form-control"
            id="un"
            value={`${breaktool_user}${formData.lname ? `.${formData.lname}` : ""}`}
            onChange={handleInputChange}
            placeholder='e.g. "J.Sopeta" '
          />
        </div>
         
        <div className="col-md-6 mb-1  w-50">
            <div className="mb-3">
              <label htmlFor="">Privileges</label>
            </div>
            <input
            
            value={formData.role_id}
              type="checkbox"
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px", // Rounded edges
                border: "1px solid #ccc",
                cursor: "pointer",
                marginLeft:"10px",
              }}
            />
            <label style={{marginLeft:"7px"}} htmlFor="">Manage Employee</label>
            
            <input
              name="role_id"
              value={formData.role_id}
              type="checkbox"
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px", // Rounded edges
                border: "1px solid #ccc",
                cursor: "pointer",
                marginLeft:"10px",
              }}
            />
          <label style={{marginLeft:"7px"}} htmlFor="">View Workforce Monitoring</label>
        </div>
        <div
          className="col-md-12"
          style={{
            marginBottom: "30px",
            marginTop: "30px",
          }}
        >
          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-primary"
            >
              {mode === "edit" ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={clearInputs}
            >
              Clear
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
