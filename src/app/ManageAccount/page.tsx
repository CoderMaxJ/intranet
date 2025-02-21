"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import { useRouter } from "next/navigation";
import SuccessMessage from "../component/SuccessModal/success";
import { ToastContainer,toast } from "react-toastify";



interface DepartmentProps {
    acctid: number;
    acctname: string;
    status: number;
    manager: string;
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


  const successToast = (msg:string) => toast.success(msg, {
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

    const formShow = () => {
        setShowForm(true);
    };

    const formClose = () => {
        setShowForm(false);
    };

    const handleManagerChange = (acctid: number, empno: number) => {
        setSelectedManagerIDs(prevState => ({
            ...prevState,
            [acctid]: empno
        }));
    };

    return (
        <div className="container-fluid vh-50 d-flex">
            <ToastContainer/>
            <div className="manageaccount-dashboard">
                <Dashboard />
            </div>
            
            <div className="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
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

            {/* Save Confirmation Modal */}
            <div className="modal fade" id="saveModal" aria-labelledby="saveModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="saveModalLabel">Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to save changes?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={() => handleCreateManager(targetID)} type="button" data-bs-dismiss="modal" className="btn btn-success">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="manage-department" style={{maxHeight:'890px', overflowY:'auto'}}>
                <div>

                    <div className="manageaccounts-bg">
                        <div className="employee-header">
                            <header>
                                <h1 >MANAGE ACCOUNTS</h1>
                                <div className="add-account d-flex align-items-center rounded px-3 py-1">
                                    <button
                                        className="addhover fs-6 btn-sm fw-light text-dark mb-0 border  rounded btn text-white p-1"
                                        onClick={formShow}
                                    >
                                        <i className="add-icon bi bi-plus-circle text-white"></i>  Add account
                                    </button>
                                </div>
                            </header>
                        </div>

                        {showform && (
                            <>
                                {/* Background Overlay */}
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
                                            top:  "25%",
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
                                                    width: '300px',  // Adjust the width to your preference
                                                    fontSize: '16px', // Adjust font size for better clarity
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

                        <div className="ms-3 mt-4 vw-100">

                            <table className="manage-table table table-light table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th className="px-1">Account ID</th>
                                        <th className="px-1">Account Name</th>
                                        <th className="px-1">Status</th>
                                        <th className="px-1">Manager/Supervisor</th>
                                        <th className="px-5 ">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {department.map((instance) => (
                                        <tr key={instance.acctid}>
                                            <td >{instance.acctid}</td>
                                            <td>{instance.acctname}</td>
                                            <td>{instance.status === 1 ? "Active" : "Not Active"}</td>
                                            {
                                                instance.manager && instance.manager.fname ? (
                                                    <td>
                                                        <select
                                                            className="form-select w-100 p-1"
                                                            value={selectedManagerIDs[instance.acctid] || ""}
                                                            onChange={(e) => handleManagerChange(instance.acctid, Number(e.target.value))}
                                                        >
                                                            <option value="">{`${instance.manager.fname} ${instance.manager.lname}`}</option>
                                                            {manager.map((manager) => (
                                                                <option key={manager.empno} value={manager.empno}>
                                                                    {manager.fname + " " + manager.lname}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>

                                                ) : (
                                                    <td>
                                                        <select
                                                            className="form-select w-100 p-1"
                                                            value={selectedManagerIDs[instance.acctid] || ""}
                                                            onChange={(e) => handleManagerChange(instance.acctid, Number(e.target.value))}
                                                        >
                                                            <option value="">Unassigned</option>
                                                            {manager.map((manager) => (
                                                                <option key={manager.empno} value={manager.empno}>
                                                                    {manager.fname + " " + manager.lname}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                )
                                            }

                                            <td>
                                                <div className="actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setTargetID(instance.acctid); }}
                                                        className="accounts-edit" data-bs-toggle="modal" data-bs-target="#saveModal"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" className="manageaccount-edit bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}