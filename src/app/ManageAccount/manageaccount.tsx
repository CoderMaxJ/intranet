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
    //
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
        if (!accountName.trim()) {
            errorToast("Account name is required.");
            return;
        }
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
                            <h1 className="modal-title fs-5 text-light" id="deleteModalLabel" style={{minWidth:'500px'}}>Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close text-light"></button>
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
                    <div className="modal-content" style={{minWidth:'500px'}}>
                        <div className="modal-header" >
                            <h1 className="modal-title fs-5 text-light" >Create Account</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{ display: "flex", flexDirection: "column" }}>
                            <form onSubmit={handleSubmit} className="add-account-form">
                                <div className="account-div">
                                    <div className="create-div d-flex align-items-center">
                                        <input
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            type="text"
                                            className="form-control p-2 px-3 ml-3"
                                            placeholder="Account Name"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button
                                        className="closebutton btn btn-white btn-sm"
                                        data-bs-dismiss="modal"
                                        type="button"
                                    >
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
                        <div className="modal-content"  style={{minWidth:'500px'}}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5 text-light" id="saveModalLabel">Confirmation</h1>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to save changes?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button onClick={() => handleCreateManager(targetID)} type="button" className="btn btn-success">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="manage-department">
                <div className="manageaccounts-header"><Header title="MANAGE ACCOUNTS" /></div>
                <div className="accounts-margin px-4">
                    <div className="manageaccounts-bg">

                        <div className="employee-header">
                            <div
                                className="acc-head d-flex justify-content-between px-4 gap-3"
                            >
                                <div className="search-division"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
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
                                        opacity: showform ? 1 : 0,
                                    }}
                                    onClick={formClose}
                                ></div>
                            </>
                        )}

                        <div className="accounta-table-div table-responsive accounts-table px-4" style={{ position: 'relative' }}>
                            <table className="manage-table table table-light table-hover table-striped border ">
                                <thead>
                                    <tr>
                                        <th className="px-1">Account ID</th>
                                        <th className="px-1">Account Name</th>
                                        <th className="px-1">Status</th>
                                        <th className="th-manager px-1">Manager/Supervisor</th>
                                        <th className="th-action border border">Actions</th>
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
                                                    <div className="manage-account-form" >
                                                        <form>
                                                            {instance.manager.map((manager: any, index: any) => (
                                                                <div
                                                                    key={index}
                                                                    style={{ position: "relative", display: "inline-block", margin: "8px" }}
                                                                >
                                                                    <button className="emp-plus"
                                                                        type="button"

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