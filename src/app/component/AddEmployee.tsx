import { Decryptor } from "@/security";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

interface Schedule {
  shiftstart: string;
  shiftend: string;
}
interface AddEmployeeData {
  empno: number;
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
  acctname: string;
  isdayshift: number;
  un: string;
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
    empno: empData.empno ?? 0,
    fname: empData.fname || "",
    mname: empData.mname || "",
    lname: empData.lname || "",
    position: empData.position || "",
    dateofbirth: empData.dateofbirth || "",
    maritalstatus: empData.maritalstatus || "None",
    gender: empData.gender || "",
    contactno: empData.contactno || "",
    address: empData.address || "",
    acctid: empData.acctid || 0,
    role_id: empData.role_id || 0,
    status: empData.status,
    acctname: empData.acctname,
    isdayshift: empData.isdayshift ?? 0,
    schedule: empData.schedule || { shiftstart: "", shiftend: "" },
    un: empData.un || ""
  });

  const token = localStorage.getItem("token");
  interface Position {
    position: string;
  }
  const [roles, setRoles] = useState<Position[]>([]);
  const [accounts, setAccounts] = useState<{ acctid: number, acctname: string, status: number }[]>([]);
  const [selectedAccount, SetSelectedAccount] = useState("");
  const [breaktool_user, setBreaktoolUser] = useState("");
  const [privileges, setPrivileges] = useState<PrivilegesType[]>([]);
  const [isEditSchedule, setIsEditSchedule] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [keyword, setKey] = useState("");
  const [role_keyword, setRoleKeyword] = useState("");
  const [isPositionFocused, setIsPositionFocused] = useState(false);
  const [isAccountFocused, setIsAccountFocused] = useState(false);
  const [highlightedRoleIndex, setHighlightedRoleIndex] = useState(-1);
  const [highlightedAccountIndex, setHighlightedAccountIndex] = useState(-1);




  let user_priviledge = Decryptor(localStorage.getItem("user_privilege") || "");


  const array_privilege = user_priviledge.split(",")

  useEffect(() => {
    if (array_privilege.includes("manage_users")) {
      setEditable(true);
    }
  }, [])

  useEffect(() => {
    fetchPrivileges();
  }, [])

  useEffect(() => {
    if (empData) {
      setFormData({
        empno: empData.empno ?? 0,
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
        acctname: empData.acctname || "",
        schedule: empData.schedule || { shiftstart: "", shiftend: "" },
        un: empData.un || "",
        isdayshift: empData.isdayshift ?? 0

      });
      const matchedAccount = accounts.find(acc => acc.acctid === empData.acctid);
      if (matchedAccount) {
        SetSelectedAccount(matchedAccount.acctname);
      }
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

      }
    }
    catch (e) {
      console.error(e)
    }
  }
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/roles/?key=${role_keyword}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setRoles(data.data);
      }

    } catch (e) {
      console.error(e);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/search/accounts/?key=${keyword || ""}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setAccounts(data.data);

      }
    } catch (e) {
      console.error(e);
    }
  };

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
        setTimeout(() => {
          btnClose?.click();
          clearInputs();
        }, 100);
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
        setTimeout(() => {
          btnClose?.click();
        }, 100);
      } else {
        const message = await response.json();
        errorToast(message.warning);
      }
    } catch (e) {
      console.error(e);
    }
  }
  const formDataWithToken = {
    ...formData,
    token: Decryptor(token || ""),
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
      empno: 0,
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
      acctname: "",
      schedule: { shiftend: "", shiftstart: "" },
      isdayshift: 0,
      un: "",
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
  const handleInputChanges = () => {
    setFormData(prev => ({
      ...prev,
      position: ''
    }));
    setRoleKeyword('');
  }

  const handleInputChanges2 = () => {
    setFormData(prev => ({
      ...prev,
      acctname: ''
    }));
    setKey('');
  }
  return (
    <div>
      <div className="addemployee-form">
        <form onSubmit={handleSubmitForm}>

          {/* Close Button */}
          <div className="modal-header">
            <h5 className="modal-title text-light">{mode === "edit" ? "Update Employee Information" : "Add Employee"}</h5>
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
            <h6>Personal Information</h6>
            <div className=" col-md-4 add-rows mt-2 ">
              <label htmlFor="fname" className="form-label">First Name <span className="text-danger">*</span></label>
              <input
                disabled={!isEditable && mode == "edit" ? true : false}
                required type="text" name="fname" className="form-control" id="fname"
                value={formData.fname} onChange={handleInputChange} placeholder="Juan"
              />
            </div>
            <div className=" col-md-4 add-rows mt-2">
              <label htmlFor="mname" className="form-label">Middle Name </label>
              <input
                disabled={!isEditable && mode == "edit" ? true : false}
                type="text" name="mname" className="form-control" id="mname"
                value={formData.mname} onChange={handleInputChange} placeholder="Montenegro"
              />
            </div>
            <div className=" col-md-4 add-rows mt-2">
              <label htmlFor="lname" className="form-label">Last Name <span className="text-danger">*</span></label>
              <input
                disabled={!isEditable && mode == "edit" ? true : false}
                required type="text" name="lname" className="form-control" id="lname"
                value={formData.lname} onChange={handleInputChange} placeholder="Dela Cruz"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="row px-4 first-row">
            <div className=" col-md-4 add-rows mt-2">
              <label htmlFor="dateofbirth" className="form-label">Date of Birth <span className="text-danger">*</span></label>
              <input
                disabled={!isEditable && mode == "edit" ? true : false}
                required
                type="date" name="dateofbirth" className="form-control date-with-icon" id="dateofbirth"
                value={formData.dateofbirth} onChange={handleInputChange} max="2018-12-31"
              />
            </div>
            <div className=" col-md-4 add-rows mt-2">
              <label htmlFor="gender" className="form-label">Gender <span className="text-danger">*</span></label>
              <select
                disabled={!isEditable && mode == "edit" ? true : false}
                required
                name="gender" className="form-select" id="gender"
                value={formData.gender} onChange={handleInputChange}
              >
                <option value="">-- SELECT --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className=" col-md-4 add-rows mt-2">
              <label htmlFor="maritalstatus" className="form-label">Marital Status <span className="text-danger">*</span></label>
              <select
                required
                disabled={!isEditable && mode == "edit" ? true : false}
                name="maritalstatus" className="form-select" id="maritalstatus"
                value={formData.maritalstatus} onChange={handleInputChange}
              >
                <option value="">-- SELECT --</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

          </div>

          {/* Row 3 */}
          <div className="row px-4">
            <h6>Address Line</h6>
            <div className=" col-md-4 add-rows mt-2">
              <label htmlFor="contactno" className="form-label">Contact No</label>
              <input
                disabled={!isEditable && mode == "edit" ? true : false}
                type="number" name="contactno" className="form-control" id="contactno"
                value={formData.contactno} onChange={handleInputChange} placeholder="+63 92 6645 9723"
              />
            </div>
            <div className=" col-md-8 add-rows mt-2">
              <label htmlFor="address" className="form-label">Address <span className="text-danger"></span></label>
              <input
                disabled={!isEditable && mode == "edit" ? true : false}
                type="text" name="address" className="form-control" id="address"
                value={formData.address} onChange={handleInputChange} placeholder="Zapatera, Cebu City"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="row px-4 d-flex">
            <h6>Account Details</h6>
            <div className=" col-md-4 add-rows mt-2 position-relative">
              <label htmlFor="position" className="form-label">
                Position<span className="text-danger">*</span>
              </label>
              <input
                disabled={!user_priviledge.includes("manage_users") ? true : false}
                required
                type="text"
                className="form-control"
                placeholder={mode != 'edit' ? "Position" : ""}
                value={formData.position || role_keyword}
                onChange={(e) => {
                  setRoleKeyword(e.target.value);
                  fetchRoles();
                  setHighlightedRoleIndex(-1); // reset index

                  if (e.target.value === "") {
                    setFormData(prev => ({
                      ...prev,
                      acctid: 0,
                      acctname: ""
                    }));
                  }
                }}

                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    setHighlightedRoleIndex(prev => Math.min(prev + 1, roles.length - 1));
                  } else if (e.key === "ArrowUp") {
                    setHighlightedRoleIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === "Enter" && highlightedRoleIndex >= 0) {
                    const selected = roles[highlightedRoleIndex];
                    setRoleKeyword(selected.position);
                    setFormData(prev => ({ ...prev, position: selected.position }));
                    setRoles([]);
                    setIsPositionFocused(false);
                  }
                }}
                onFocus={() => setIsPositionFocused(true)}
                onBlur={() => setTimeout(() => setIsPositionFocused(false), 150)}

              />
              {(formData.position != "" && mode === 'edit') && user_priviledge.includes("manage_users") && (<button className="btn-x-position" type="button" onClick={handleInputChanges}>x</button>)}
              {isPositionFocused && roles.length > 0 && (
                <ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {roles.map((p, index) => (
                    <li
                      key={index}
                      className={`list-group-item list-group-item-action ${highlightedRoleIndex === index ? "active" : ""}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setRoleKeyword(p.position);
                        setFormData(prev => ({ ...prev, position: p.position }));
                        setRoles([]);
                        setIsPositionFocused(false); // Also hide after selecting
                      }}
                    >
                      {p.position}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className=" col-md-4 add-rows mt-2 position-relative">
              <label htmlFor="acctid" className="form-label">
                Account
                <span className="text-danger">*</span>
              </label>

              <input
                disabled={!user_priviledge.includes("manage_users") ? true : false}
                required
                type="text"
                name="acctname"
                className="form-control"
                value={formData.acctname || keyword}
                placeholder={mode !== 'edit' ? "Account" : ""}
                onChange={(e) => {
                  // Always update the keyword when typing
                  setKey(e.target.value);
                  fetchAccounts();
                  setHighlightedAccountIndex(-1);
                  // Clear the selected account if user is deleting
                  if (e.target.value === "") {
                    setFormData(prev => ({
                      ...prev,
                      acctname: ""
                    }));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    setHighlightedAccountIndex(prev => Math.min(prev + 1, accounts.length - 1));
                  } else if (e.key === "ArrowUp") {
                    setHighlightedAccountIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === "Enter" && highlightedAccountIndex >= 0) {
                    const selected = accounts[highlightedAccountIndex];
                    setKey(selected.acctname);
                    setFormData(prev => ({
                      ...prev,
                      acctid: selected.acctid,
                      acctname: selected.acctname
                    }));
                    setAccounts([]);
                    setIsAccountFocused(false);
                  }
                }}
                onKeyUp={fetchAccounts}
                onFocus={() => {
                  setIsAccountFocused(true);
                  setIsPositionFocused(false); // ⬅️ This hides the position list when switching to account
                }}
                onBlur={() => setTimeout(() => setIsAccountFocused(false), 150)}
              />
              {(formData.acctname != "" && mode === 'edit') && user_priviledge.includes("manage_users") && (<button className="btn-x-position" type="button" onClick={handleInputChanges2}> x</button>)}
              {isAccountFocused && keyword && accounts.length > 0 && (
                <ul className="list-group position-absolute w-100 z-3"
                  style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {accounts.map((acc, index) => (
                    <li
                      key={acc.acctid}
                      className={`list-group-item list-group-item-action ${highlightedAccountIndex === index ? "active" : ""}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAccounts([]);
                        setKey(acc.acctname);  // This sets the visible input text
                        setFormData(prev => ({
                          ...prev,
                          acctid: acc.acctid,
                          acctname: acc.acctname
                        }));
                      }}
                    >
                      {acc.acctname}
                    </li>
                  ))}
                </ul>
              )}

            </div>


          </div>
          {mode === "edit" && (
            <div className="col-md-4 add-rows mt-3 create-timein px-4">
              <label className="form-label">
                Assign Privileges <span className="text-danger">*</span>
              </label>
              <select
                disabled={!isEditable}
                name="role_id"
                className="form-select form-select--assignprivileges"
                value={formData.role_id}
                onChange={handleInputChange}
              >
                <option value="">Select privilege</option>
                {privileges.map((role, index) => (
                  <option key={index} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4">
            {mode != 'edit' && (
              <div>
                <h6 className="form-section-label schedule-detials px-4">Schedule Details</h6>
              </div>

            )}
            <div className="d-flex flex-wrap schedule--addemployee px-4 gap-2">

              {mode !== "edit" && (
                <div className="col-md-4 add-rows mt-2">
                  <>
                    <label htmlFor="shiftstart" className="form-label">
                      Time In<span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      name="shiftstart"
                      id="shiftstart"
                      className="form-controll"
                      inputMode="numeric"
                      value={formData.schedule.shiftstart}
                      onChange={handleInputChange}
                    />
                  </>
                </div>
              )}

              {mode !== "edit" && (
                <div className="col-md-4 add-rows mt-2 create-timein">
                  <label htmlFor="shiftend" className="form-label">
                    Time Out <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    name="shiftend"
                    id="shiftend"
                    className="form-controll-timeout"
                    inputMode="numeric"
                    value={formData.schedule.shiftend}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Row 5: Editable Time Controls */}
          <div>
            {mode === "edit" && (
              <h6 className="form-section-label schedule-detials px-4">Schedule Details</h6>
            )}
          </div>

          <div className="align-items-center justify-content-center mt-4">
            {mode === "edit" && (
              <div className="d-flex flex-wrap schedule-details gap-4 px-4">
                <div className="add-rows mb-4">
                  <label htmlFor="shiftstart" className="form-label form-label-ti mb-2">Time In</label>
                  <input
                    type="time"
                    name="shiftstart"
                    className="form-control-ti"
                    id="shiftstart"
                    autoComplete="off"
                    inputMode="numeric"
                    value={formData.schedule.shiftstart}
                    onChange={handleInputChange}
                    disabled={
                      !!formData.schedule.shiftstart &&
                      !!formData.schedule.shiftend &&
                      !isEditSchedule
                    }
                    required

                    step={1}
                  />
                </div>

                <div className="add-rows update-timeout mb-4">
                  <label htmlFor="shiftend" className="form-label form-label-timeout1 mb-2">Time Out</label>
                  <input
                    type="time"
                    name="shiftend"
                    className="form-controll-timeout1"
                    id="shiftend"
                    autoComplete="off"
                    inputMode="numeric"
                    value={formData.schedule.shiftend}
                    onChange={handleInputChange}
                    disabled={
                      !!formData.schedule.shiftstart &&
                      !!formData.schedule.shiftend &&
                      !isEditSchedule
                    }
                    required
                    step={1}
                  />
                </div>

                <div className="add-rows d-flex align-items-center edit-timein-out me-4">
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

                <div className="col-md-2 add-rows mt-2 update-status">
                  <label className="form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    disabled={!isEditable && mode === "edit"}
                    className="form-select form-select--status"
                    name="status"
                    value={formData.status === 1 ? 1 : 0}
                    onChange={handleInputChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

              </div>

            )}
          </div>

          <div className="modal-footer mt-4 col-12 d-flex justify-content-end gap-3" style={{ background: "#e7e7e7" }}>
            <button
              type="button"
              data-bs-dismiss="modal"
              className="btn btn-danger"
              onClick={clearInputs}
            >
              <span className="view">Cancel</span>
            </button>
            <button type="submit" className="btn btn-primary view">
              {mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </form >
      </div >
    </div>
  );

}  