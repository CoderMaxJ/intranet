import { Decryptor } from "@/security";
import { da, ms } from "date-fns/locale";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

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
  role_id: number;
  is_dayshift: number
}

interface AddEmpProps {
  empData: AddEmployeeData;
  mode: string;
  isClose: () => void;
  onButtonClick: (action: string) => void;
}

interface PrivilegesType {
  name: string,
  id: number
}
export default function AddEmp({ empData, mode, isClose, onButtonClick }: AddEmpProps) {

  const [formData, setFormData] = useState<AddEmployeeData>({
    empno: empData.empno || "",
    fname: empData.fname || "",
    mname: empData.mname || "",
    lname: empData.lname || "",
    position: empData.position || "",
    dateofbirth: empData.dateofbirth || "",
    maritalstatus: empData.maritalstatus || "",
    gender: empData.gender || "",
    contactno: empData.contactno || "",
    address: empData.address || "",
    acctid: empData.acctid || 0,
    role_id: empData.role_id || 0,
    is_dayshift: empData.is_dayshift || 0,
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<{ acctid: number, acctname: string, status: number }[]>([]);
  const [selectedAccount, SetSelectedAccount] = useState("");
  const [breaktool_user, setBreaktoolUser] = useState("");
  const [privileges, setPrivileges] = useState<PrivilegesType[]>([]);
 



  useEffect(() => {
    if (empData) {
      setFormData({
        empno: empData.empno || "",
        fname: empData.fname || "",
        mname: empData.mname || "",
        lname: empData.lname || "",
        position: empData.position || "",
        dateofbirth: empData.dateofbirth || "",
        maritalstatus: empData.maritalstatus || "",
        gender: empData.gender || "",
        contactno: empData.contactno || "",
        address: empData.address || "",
        acctid: empData.acctid || 0,
        role_id: empData.role_id || 0,
        is_dayshift: empData.is_dayshift || 0,
      });
    }
  }, [empData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" && name === "dateofbirth" ? null : value,
    }));

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: isChecked ? 1 : 0,
      }));
      return;
    }
    console.log(formData)
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "acctid") {
      SetSelectedAccount(value)
    }
    if (name === "role_id") {
      setFormData((prev) => ({
        ...prev,
        role_id: Number(value),
      }));
    }


 
  
  }


  const fetchPrivileges = async () => {
    try {
      const respose = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/role/list/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`
        }
      })
      if (respose.status === 200) {
        const data = await respose.json();
        setPrivileges(data.data);

      } else {
        console.log("Error while fetching privileges");
      }
    }
    catch (e) {
      console.error(e)
    }
  }

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
    fetchPrivileges();
  }, []);

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

  const btnClose = document.getElementById("buttonclose");
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
        successToast("Created successfully!");
        btnClose?.click();
        clearInputs();

      } else {
        errorToast("Unable to create employee!")
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
        successToast("Updated successfully!");
        btnClose?.click();
      } else {
        errorToast("Unable to update records!")
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {

    e.preventDefault();
    onButtonClick("clicked");
    if (mode === 'edit') {
      await Update();
    } else {
      await Create();
    }
  };

  const clearInputs = () => {
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
      role_id: 0,
      is_dayshift: 0
    });
    isClose();

    setBreaktoolUser("");

    SetSelectedAccount("");
    mode = "create"
  }

  return (
    <div>
      <form className="row" onSubmit={handleSubmitForm} >
        <div className="col-md-4 mb-3">
          <button
            id="buttonclose"
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
            required
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
            required
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
            required
            type="date"
            name="dateofbirth"
            className="form-control"
            id="dateofbirth"
            value={formData.dateofbirth}
            onChange={handleInputChange}
            max="2015-12-31"
          />
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="maritalstatus" className="form-label">
            Marital Status
          </label>
          <select
            required
            name="maritalstatus"
            value={formData.maritalstatus}
            id="maritalstatus"
            className="form-select"
            onChange={handleInputChange}
          > <option value="">-- SELECT --</option>
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
            required
            name="gender"
            value={formData.gender}
            id="gender"
            className="form-select"
            onChange={handleInputChange}
          > 
            <option value="">-- SELECT --</option>
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
            required
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
            required
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
            required
            name="acctid"
            value={formData.acctid}
            id="acctid"
            className="form-select"
            onChange={handleInputChange}
          >
            <option value="">Select Account</option>
            {accounts.map((account, index) => (
              <option key={index} value={account.acctid}> {account.acctname} </option>
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
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                type="checkbox"
                name="is_dayshift"
                className="form-check-input "
                id="is_dayshift"
                value={formData.is_dayshift}
                checked={formData.is_dayshift === 1}
                onChange={handleInputChange}
              /></span>
          </label>
        </div>
  
        {mode === "edit" && (
          <div className="col-md-4 mb-1">
            <div className="mb-3">
              <label htmlFor="">Assign Privileges</label>
            </div>
            <select name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
              id=""
              className="form-select"
            >
              <option value="">Select privilege</option>
              {privileges.map((role, index) => (
                <option key={index} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        )}
        <div
          className="col-md-12"
          style={{
            marginBottom: "30px",
            marginTop: "30px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
            <button
              type="button"
              data-bs-dismiss="modal"
              className="btn btn-danger"
              onClick={clearInputs}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
