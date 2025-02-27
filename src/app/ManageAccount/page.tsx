"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import { useRouter } from "next/navigation";
import Header from "../component/Header";
import SuccessMessage from "../component/SuccessModal/success";
import { ToastContainer, toast } from "react-toastify";

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
            console.log(e);
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
            console.log(e);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        createAccount();
    };

    const createAccount = async () => {
        try {
            const requestBody = {
                acctname: accountName,
                acctid: selectedManagerIDs[0], // Default to the first manager if none selected
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
                fetchAccountList(); // Refresh account list
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleCreateManager = (acctid: number) => {
        setOpenDropdownId(0);
        CreateManager(acctid);
    };

    const CreateManager = async (acctid: number) => {
        console.log(acctid)
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
            console.log(e);
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
            console.log(e);
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
        setTargetID(acctid); // Ensure targetID is updated
        setSelectedManagerIDs(prevState => ({
            ...prevState,
            [acctid]: empno
        }));
    };
    const handleShowDropdown = (acctid: number) => {
        setOpenDropdownId(openDropdownId === acctid ? null : acctid); // Toggle dropdown for the clicked row
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
                <div className="manageaccounts-header"><Header title="MANAGE ACCOUNTS" /></div>
                <div>
                    <div className="manageaccounts-bg">
                        <div className="employee-header">
                            <button
                                className="addhover"
                                onClick={formShow}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="#ffffff"
                                    className="bi bi-plus-circle-fill me-2"
                                    viewBox="0 0 16 16"
                                    style={{ marginBottom: "2px" }}
                                >
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                                </svg>  Add Account
                            </button>
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
                                        zIndex: 9998,
                                        opacity: showform ? 1 : 0,
                                        transition: 'opacity 4.3s ease',
                                    }}
                                    onClick={formClose}
                                ></div>


                                <form onSubmit={handleSubmit}>
                                    <div
                                        className="ms-3 w-40 mt-2 p-3 border border rounded position-absolute"
                                        style={{
                                            top: "25%",
                                            left: "50%",
                                            transform: showform ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)',
                                            transition: 'transform 3.5s ease, top 3.5s ease',
                                            zIndex: 9999,
                                            backgroundColor: '#ffffff',
                                        }}
                                    >
                                        <button
                                            onClick={formClose}
                                            type="button"
                                            className="btn-close position-absolute fs-6"
                                            style={{ top: '10px', right: '10px' }}
                                            aria-label="Close"
                                        ></button>

                                        <div className="d-flex align-items-center gap-3 mt-5">
                                            <input
                                                value={accountName}
                                                onChange={(e) => setAccountName(e.target.value)}
                                                type="text"
                                                className="form-control p-2 px-3 ml-3"
                                                placeholder="Account Name"
                                                style={{
                                                    width: '300px',  
                                                    fontSize: '16px', 
                                                }}
                                            />
                                            <button className="btn btn-success btn-sm" type="submit">
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}
                        <div className="accounts-table">
                            <table className="manage-table table table-light table-hover table-striped border">
                                <thead style={{ tableLayout: "fixed", display: 'table', width: "100%" }}>
                                    <tr>
                                        <th style={{ width: "200px", color: '#ffffff', padding:'15px' }} className="px-1">Account ID</th>
                                        <th style={{ width: "200px", color: '#ffffff', padding:'15px' }} className="px-1">Account Name</th>
                                        <th style={{ width: "200px", color: '#ffffff', padding:'15px' }} className="px-1">Status</th>
                                        <th style={{ width: "200px", color: '#ffffff', padding:'15px' }} className="px-1">Manager/Supervisor</th>
                                        <th style={{ width: "120px", color: '#ffffff', padding:'15px' }} className="px-1"></th>
                                        <th style={{ width: "200px", color: '#ffffff', padding:'15px' }} className="px-1"></th>
                                        <th className="border border" style={{ marginLeft: "15vw", color: '#ffffff' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ display: 'block', maxHeight: '720px', overflowY: 'scroll' }}>

                                    {department.map((instance) => (
                                        <tr key={instance.acctid} style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                                            <td style={{ width: "200px" }}>{instance.acctid}</td>
                                            <td style={{ width: "200px" }}>{instance.acctname}</td>
                                            <td style={{ width: "200px" }}>{instance.status === 1 ? "Active" : "Not Active"}</td>
                                            <td>
                                                {/* Display managers */}
                                                {instance.manager && instance.manager.length > 0 ? (
                                                    // If managers are assigned, display them in a flex container
                                                    <div style={{ display: 'flex', justifyContent: "flex-start", alignItems: "center", gap: '15px', flexWrap: 'wrap', margin: "0px", padding: "0px", height: "40px" }} >
                                                        <form>
                                                            {instance.manager.map((manager, index) => (

                                                                <div
                                                                    key={index}
                                                                    style={{ position: "relative", display: "inline-block", margin: "8px" }} // Wrapper for positioning
                                                                >
                                                                    {/* Small "x" button */}

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
                                                                    {/* Manager name div */}
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
                                                    // If no managers are assigned, show a dropdown
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
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        onClick={() => handleShowDropdown(instance.acctid)}
                                                        type="button"
                                                        className="accounts-edit"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <i className="bi bi-plus-square"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => { setTargetID(instance.acctid); }}
                                                        type="button" className="accounts-button" data-bs-toggle="modal" data-bs-target="#deleteModal"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" className="manageaccount-delete bi bi-trash3-fill" viewBox="0 0 16 16">
                                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                        </svg>
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