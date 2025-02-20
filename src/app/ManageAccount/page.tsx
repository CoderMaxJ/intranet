"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Decryptor } from "@/security";
import { useEffect, useState } from "react";
import Dashboard from "../Dashboard/dashboard";
import { useRouter } from "next/navigation";
import SuccessMessage from "../component/SuccessModal/success";



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
                alert("Account Created!");
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
                alert("Manager Assigned!");
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
                    alert("Account Deleted!");
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
            <div> 
                <Dashboard/>
            </div>


            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
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
            <div className="modal fade" id="saveModal" tabIndex="-1" aria-labelledby="saveModalLabel" aria-hidden="true">
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
                            <button onClick={() => handleCreateManager(targetID)} type="button" data-bs-dismiss="modal"  className="btn btn-success">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="manage-department">
                <div>
                    <div className="w-50 ">
                        <center><h1>Manage Account</h1></center>
                    </div>

                    <div className="d-flex align-items-center rounded px-3 py-1">
                        <button
                            className="fs-6 btn-sm fw-light text-dark mb-0 border  rounded btn btn-success text-white p-1"
                            onClick={formShow}
                        >
                            Add account <i className="bi bi-plus-circle text-white ms-2 fs-6"></i>
                        </button>
                    </div>
                    {showform && (
                        <form onSubmit={handleSubmit}>
                            <div className="ms-3 w-50 mt-2 p-3 border border rounded position-relative">
                                <button
                                    onClick={formClose}
                                    type="button"
                                    className="btn-close position-absolute fs-6"
                                    style={{ top: "10px", right: "10px" }}
                                    aria-label="Close"
                                ></button>
                                <div className="d-flex align-items-center gap-3 mt-5">
                                    <input
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        type="text"
                                        className="form-control p-2 px-3 ml-3"
                                        placeholder="Account Name"
                                    />
                                    <button className="btn btn-success btn-sm" type="submit">
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="ms-3 mt-4 vw-100">
                        <table className="table table-light w-50 table-hover">
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
                                        <td>{instance.acctid}</td>
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
                                            <button
                                                onClick={() => { setTargetID(instance.acctid); }}
                                                type="button" className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal"
                                            >
                                                Delete
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setTargetID(instance.acctid); }}
                                                className="btn btn-success btn-sm ms-3" data-bs-toggle="modal" data-bs-target="#saveModal"
                                                style={{ cursor: "pointer" }}
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}