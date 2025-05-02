import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const token = localStorage.getItem("token");
interface Schedule {
  shiftstart: string;
  shiftend: string;
}
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
  status: number
  schedule: Schedule;
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
    status: empData.status,
    schedule: empData.schedule || { shiftstart: "", shiftend: "" }
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<{ acctid: number, acctname: string, status: number }[]>([]);
  const [selectedAccount, SetSelectedAccount] = useState("");
  const [breaktool_user, setBreaktoolUser] = useState("");
  const [privileges, setPrivileges] = useState<PrivilegesType[]>([]);
  const [isEditSchedule, setIsEditSchedule] = useState(false);


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
        status: empData.status,
        schedule: empData.schedule || { shiftstart: "", shiftend: "" }

      });
    }
  }, [empData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "shiftstart" || name === "shiftend") {
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [name]: value
        }
      }));
      return;
    }
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
    if (name === "status") {
      setFormData((prev) => (
        {
          ...prev,
          status: Number(value)
        }
      ))
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
        body: JSON.stringify(formDataWithToken),
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
        body: JSON.stringify(formDataWithToken),
      });

      if (response.status === 200) {
        setIsEditSchedule(false);
        successToast("Updated successfully!");
        btnClose?.click();
      } else {
        errorToast("Unable to update records!")
      }
    } catch (e) {
      console.error(e);
    }
  }
  const formDataWithToken = {
    ...formData,
    token: Decryptor(localStorage.getItem("token") || ""),
    user_priviledge: Decryptor(localStorage.getItem("user_privilege") || ""),
    user_id: Decryptor(localStorage.getItem("user_id") || "")

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
      status: 1,
      schedule: { shiftend: "", shiftstart: "" }
    });
    isClose();

    setBreaktoolUser("");

    SetSelectedAccount("");
    mode = "create"
  }

  const toggleChangeSchedule = () => {
    if (isEditSchedule) {
      setIsEditSchedule(false);
    } else {
      setIsEditSchedule(true);
    }
  }
  return (
    <div>
      <div className="addemployee-form">
        <form onSubmit={handleSubmitForm}>

          {/* Close Button */}
          <div className="modal-header">
            <h5 className="modal-title text-light">Add Employee</h5>
            <button
              id="buttonclose"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
             
              onClick={clearInputs}
            >
            </button>
          </div>

          {/* Row 1 */}
          <div className="row px-4">
            <div className="col-md-4">
              <label htmlFor="fname" className="form-label">First Name</label>
              <input
                required type="text" name="fname" className="form-control" id="fname"
                value={formData.fname} onChange={handleInputChange} placeholder="Juan"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="mname" className="form-label">Middle Name</label>
              <input
                type="text" name="mname" className="form-control" id="mname"
                value={formData.mname} onChange={handleInputChange} placeholder="Montenegro"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="lname" className="form-label">Last Name</label>
              <input
                required type="text" name="lname" className="form-control" id="lname"
                value={formData.lname} onChange={handleInputChange} placeholder="Dela Cruz"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="row px-4">
            <div className="col-md-4">
              <label htmlFor="dateofbirth" className="form-label">Date of Birth</label>
              <input
                required type="date" name="dateofbirth" className="form-control" id="dateofbirth"
                value={formData.dateofbirth} onChange={handleInputChange} max="2015-12-31"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="maritalstatus" className="form-label">Marital Status</label>
              <select
                required name="maritalstatus" className="form-select" id="maritalstatus"
                value={formData.maritalstatus} onChange={handleInputChange}
              >
                <option value="">-- SELECT --</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                required name="gender" className="form-select" id="gender"
                value={formData.gender} onChange={handleInputChange}
              >
                <option value="">-- SELECT --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="row px-4">
            <div className="col-md-4">
              <label htmlFor="contactno" className="form-label">Contact No</label>
              <input
                type="number" name="contactno" className="form-control" id="contactno"
                value={formData.contactno} onChange={handleInputChange} placeholder="+63 92 6645 9723"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                required type="text" name="address" className="form-control" id="address"
                value={formData.address} onChange={handleInputChange} placeholder="Zapatera, Cebu City"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="acctid" className="form-label">Account</label>
              <select
                required name="acctid" className="form-select" id="acctid"
                value={formData.acctid} onChange={handleInputChange}
              >
                <option value="">Select Account</option>
                {accounts.map((account, index) => (
                  <option key={index} value={account.acctid}>{account.acctname}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="row px-4">
            <div className="col-md-4">
              <label htmlFor="position" className="form-label">Position</label>
              <select
                required name="position" className="form-select" id="position"
                value={formData.position} onChange={handleInputChange}
              >
                <option value="">Select a position</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              {mode === "edit" ? (
                <>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select" name="status"
                    value={formData.status === 1 ? 1 : 0}
                    onChange={handleInputChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </>
              ) : (
                <>
                  <label htmlFor="shiftstart" className="form-label">Time In</label>
                  <input
                    required type="time" name="shiftstart" className="form-controll" id="shiftstart"
                    autoComplete="off" inputMode="numeric"
                    value={formData.schedule.shiftstart} onChange={handleInputChange}
                  />
                </>
              )}
            </div>

            <div className="col-md-4">
              {mode === "edit" ? (
                <>
                  <label className="form-label">Assign Privileges</label>
                  <select
                    name="role_id" className="form-select"
                    value={formData.role_id} onChange={handleInputChange}
                  >
                    <option value="">Select privilege</option>
                    {privileges.map((role, index) => (
                      <option key={index} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label htmlFor="shiftend" className="form-label">Time Out</label>
                  <input
                    required type="time" name="shiftend" className="form-controll-timeout" id="shiftend"
                    autoComplete="off" inputMode="numeric"
                    value={formData.schedule.shiftend} onChange={handleInputChange}
                  />
                </>
              )}
            </div>
          </div>

          {/* Row 5: Editable Time Controls */}
          {mode === "edit" && (
            <div className="row align-items-end">
              <div className="col-md-4">
                <label htmlFor="shiftstart" className="form-label-ti mb-1">Time In</label>
                <input
                  required type="time" name="shiftstart" className="form-control-ti" id="shiftstart"
                  autoComplete="off" inputMode="numeric"
                  value={formData.schedule.shiftstart} onChange={handleInputChange}
                  disabled={formData.schedule.shiftstart && formData.schedule.shiftend && !isEditSchedule}
               
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="shiftend" className="form-label-timeout1 mb-1">Time Out</label>
                <input
                  required type="time" name="shiftend" className="form-controll-timeout1" id="shiftend"
                  autoComplete="off" inputMode="numeric"
                  value={formData.schedule.shiftend} onChange={handleInputChange}
                  disabled={formData.schedule.shiftstart && formData.schedule.shiftend && !isEditSchedule}
                />
              </div>
              <div className="col-md-4 d-flex align-items-center">
                {formData.schedule.shiftstart && formData.schedule.shiftend && (
                  <button
                    className="edit-schedule-btn btn btn-secondary btn-sm mt-3"
                    type="button"
                    onClick={toggleChangeSchedule}
                  >
                    <i className="bi bi-pen sm"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </form >
        <div className="modal-footer mt-4 col-12 d-flex justify-content-end gap-3" style={{ background: "#e7e7e7" }}>
          <button
            type="button"
            data-bs-dismiss="modal"
            className="btn btn-danger"
            onClick={clearInputs}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </div >
    </div>
  );


}  