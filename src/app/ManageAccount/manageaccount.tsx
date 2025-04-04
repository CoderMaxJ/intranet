"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import { useRouter } from "next/navigation";
import Header from "../component/Header";
import { ToastContainer, toast } from "react-toastify";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface DepartmentProps {
    acctid: number;
    acctname: string;
    status: number;
    manager: string;
    empno: number;
}
interface ManagerProps {
    empno: number;
    fname: string;
    lname: string;
}

export default function ManageDepartment() {
    const [token, setToken] = useState("");
    const [department, setDepartment] = useState<DepartmentProps[]>([]);
    const [manager, setManager] = useState<ManagerProps[]>([]);
    const [showform, setShowForm] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [selectedManagerIDs, setSelectedManagerIDs] = useState<{ [key: number]: number }>({});
    const [targetID, setTargetID] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [showDropDown, setShowDropdown] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [add, setAdd] = useState(false);
    const [filter, setFilter] = useState('');

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const filteredRows = department.filter((dept) => {
        const managerNames = Array.isArray(dept.manager)
            ? dept.manager.map((m: any) => `${m.fname} ${m.lname}`).join(" ")
            : dept.manager;

        const searchString = `${dept.acctid} ${dept.acctname} ${dept.status === 1 ? "Active" : "Not Active"} ${managerNames}`.toLowerCase();
        return searchString.includes(filter.toLowerCase());
    });

    const router = useRouter();
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(Decryptor(storedToken));
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchAccountList();
            fetchManagerList();
        }
    }, [token]);

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

    const fetchAccountList = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/list/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setDepartment(data.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchManagerList = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/manager/list/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setManager(data.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        createAccount();
        setAccountName("");
    };

    const createAccount = async () => {
        try {
            const requestBody = {
                acctname: accountName,
                acctid: selectedManagerIDs[0],
                status: 1
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/create/account/project/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (response.status === 201) {
                successToast("Account created successfully.");
                setShowForm(false);
                fetchAccountList();
            }
        } catch (e) {
            console.error(e);
        }
    };
    const handleCreateManager = (acctid: number) => {
        setOpenDropdownId(0);
        CreateManager(acctid);
    };
    const CreateManager = async (acctid: number) => {
        const selectedManagerID = selectedManagerIDs[acctid];
        const request_data = {
            empno: selectedManagerID,
            acctid: acctid
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/create/account/manager/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(request_data)
            });
            if (response.status === 201) {
                successToast("Manager Assigned.")
                fetchAccountList();
                setShowModal(false);
            } else {
                const error = await response.json();
                errorToast(error.warning);
            }
        } catch (e) {
            console.error(e);
        }
    };
    const deleteAccount = async (empno: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/account/delete/${empno}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            if (response.status === 204) {
                successToast("Account deleted successfully.")
                fetchAccountList();
            }
        } catch (e) {
            console.error(e);
        }
    };
    const removeManager = async (empno: number, acctid: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/remove/manager/${empno}/${acctid}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

        })
        if (response.status === 204) {
            successToast("Manager successfully remove.")
            fetchAccountList();
        } else {
            const error = await response.json();
            errorToast(error.warning);
        }
    }

    const formShow = () => {
        setShowForm(true);
    };
    const formClose = () => {
        setShowForm(false);
    };
    const handleManagerChange = (acctid: number, empno: number) => {
        setShowModal(true);
        setTargetID(acctid);
        setSelectedManagerIDs(prevState => ({
            ...prevState,
            [acctid]: empno
        }));
    };
    const handleShowDropdown = (acctid: number) => {
        setOpenDropdownId(openDropdownId === acctid ? null : acctid);
    };

    return (
        <div className="manageaccounts-div d-flex">
            <ToastContainer />
            <div className="manageaccount-dashboard">
                <Dashboard />
            </div>
            <div className="modal fade " id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
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
                            <button onClick={() => deleteAccount(targetID)} type="button" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="addAccountModal" aria-labelledby="addAccountModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Create Account</h1>
                        </div>
                        <div className="modal-body" style={{ display: "flex", flexDirection: "column" }}>
                            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                                <div style={{ backgroundColor: "#ffffff", width: "100%" }}>
                                    <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                        <input
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            type="text"
                                            className="form-control p-2 px-3 ml-3"
                                            placeholder="Account Name"
                                            style={{
                                                width: "100%",
                                                fontSize: "16px",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button className="closebutton btn btn-secondary btn-sm" data-bs-dismiss="modal" type="button">
                                        Close
                                    </button>
                                    <button className="btn btn-success btn-sm" type="submit">
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal show d-block" id="saveModal" aria-labelledby="saveModalLabel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="saveModalLabel">Confirmation</h1>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to save changes?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Close</button>
                                <button onClick={() => handleCreateManager(targetID)} type="button" className="btn btn-success">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="manage-department">
                <div className="manageaccounts-header"  style={{paddingLeft:'1rem', paddingRight:'1rem'}}><Header title="MANAGE ACCOUNTS" /></div>
                <div className=""  style={{paddingLeft:'1rem', paddingRight:'1rem'}}>
                    <div className="manageaccounts-bg">

                        <div className="employee-header">
                            <div
                                className="acc-head gap-3 d-flex justify-content-center py-2"
                                style={{ width: "100%" }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        maxWidth: "400px",
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                        style={{
                                            position: "absolute",
                                            left: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            pointerEvents: "none",
                                            color: "#888",
                                        }}
                                    >
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                    </svg>

                                    <input
                                        type="text"
                                        id="myInput"
                                        className="searchbar3"
                                        placeholder="Search..."
                                        value={filter}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <button
                                    className="addhover"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addAccountModal"
                                    style={{ justifyContent: 'flex-end' }}
                                >
                                    {/*  */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="#ffffff"
                                        className="bi bi-plus-circle-fill me-2 "
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                                    </svg>
                                    <label htmlFor="">Add Account</label>
                                </button>
                            </div>
                        </div>


                        {showform && (
                            <>
                                <div
                                    className="background-overlay"
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        opacity: showform ? 1 : 0,
                                        transition: 'opacity 4.3s ease',
                                    }}
                                    onClick={formClose}
                                ></div>
                            </>
                        )}
                        <div className="table-responsive accounts-table px-4" style={{ position: 'relative' }}>
                            <table className="manage-table table table-light table-hover table-striped border ">
                                <thead style={{ position: 'sticky', transform: 'translatey(-12px)', zIndex: 10 }}>
                                    <tr>
                                        <th style={{ color: '#ffffff', padding: '15px', width: '200px' }} className="px-1">Account ID</th>
                                        <th style={{ color: '#ffffff', padding: '15px', width: '200px' }} className="px-1">Account Name</th>
                                        <th style={{ color: '#ffffff', padding: '15px', width: '200px' }} className="px-1">Status</th>
                                        <th style={{ color: '#ffffff', padding: '15px', width: '50%' }} className="px-1">Manager/Supervisor</th>
                                        <th className="border border" style={{ color: '#ffffff', width: '100px' }} >Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    {filteredRows.map((instance) => (
                                        <tr key={instance.acctid}>
                                            <td >{instance.acctid}</td>
                                            <td >{instance.acctname}</td>
                                            <td >{instance.status === 1 ? "Active" : "Not Active"}</td>
                                            <td>
                                                {instance.manager && instance.manager.length > 0 ? (
                                                    <div style={{ display: 'flex', justifyContent: "flex-start", alignItems: "center", gap: '15px', flexWrap: 'wrap', margin: "0px", padding: "0px", height: "40px" }} >
                                                        <form>
                                                            {instance.manager.map((manager: any, index: any) => (
                                                                <div
                                                                    key={index}
                                                                    style={{ position: "relative", display: "inline-block", margin: "8px" }}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: "-8px",
                                                                            right: "-8px",
                                                                            backgroundColor: "#FAA0A0",
                                                                            color: "red",
                                                                            border: "none",
                                                                            borderRadius: "50%",
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            fontSize: "14px",
                                                                            cursor: "pointer",
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}
                                                                        onClick={() => removeManager(manager.empno, instance.acctid)}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                    <div
                                                                        className="rounded d-flex justify-content-center align-items-center"
                                                                        style={{
                                                                            backgroundColor: "#9fedba",
                                                                            height: "30px",
                                                                            padding: "0 10px",
                                                                            borderRadius: "5px",
                                                                        }}
                                                                    >
                                                                        <p className="m-0 text-center">
                                                                            {manager.fname} {manager.lname}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </form>
                                                        <div>
                                                            {openDropdownId === instance.acctid && (
                                                                <div>
                                                                    <select
                                                                        className="form-select w-100 p-1"
                                                                        value={selectedManagerIDs[instance.acctid] || ""}
                                                                        onChange={(e) => handleManagerChange(instance.acctid, Number(e.target.value))}
                                                                    >
                                                                        <option value="">Unassigned</option>
                                                                        {manager.map((manager) => (
                                                                            <option key={manager.empno} value={manager.empno}>
                                                                                {manager.fname} {manager.lname}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <select
                                                        className="form-select w-20 p-1"
                                                        style={{ width: "130px" }}
                                                        value={selectedManagerIDs[instance.acctid] || ""}
                                                        onChange={(e) => handleManagerChange(instance.acctid, Number(e.target.value))}
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {manager.map((manager) => (
                                                            <option key={manager.empno} value={manager.empno}>
                                                                {manager.fname} {manager.lname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                            <td >
                                                <div className="actions">
                                                    <button
                                                        onClick={() => handleShowDropdown(instance.acctid)}
                                                        type="button"
                                                        className="accounts-edit"
                                                        style={{ cursor: "pointer" }}
                                                        title={add ? "" : "Add"}
                                                    >
                                                        <i className="bi bi-plus-square"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => { setTargetID(instance.acctid); }}
                                                        type="button" className="accounts-button" data-bs-toggle="modal" data-bs-target="#deleteModal"
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}