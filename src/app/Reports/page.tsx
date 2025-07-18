"use client";
import { useState, useEffect, useCallback } from "react";
import { Decryptor } from "@/security";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Dashboard from "../../component/Dashboard/page";
import Header from "../../component/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { getUserToken } from "@/services/UserToken/authUserToken";

interface BreaksReport {
    name: string;
    shiftdate: string;
    login: string;
    brkin1: string;
    brkout1: string;
    ob1: string;
    lunchin: string;
    lunchout: string;
    ob3: string;
    brkin2: string;
    brkout2: string;
    ob2: string;
    personalbreak: string;
    logoff: string;
}

export default function Reports() {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth());
    const [originalData, setOriginalData] = useState<BreaksReport[]>([]);
    const [data, setData] = useState<BreaksReport[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [, setSuccess] = useState(true);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [checker, setChecker] = useState(true);
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const router = useRouter();
    const token = getUserToken();
    const account_id = localStorage.getItem("user_id") || "";

    const errorToast = (msg: string) => toast.error(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const getCredentials = () => {
        return {
            account_id: localStorage.getItem("user_id") || "",
            token : token || "",
        };
    };
    const fetchReportData = async (account_id: string) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND}/download/report/${Decryptor(account_id)}/${start}/${end}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        if (!response.ok) 
            throw new Error("Failed to fetch data");
        return await response.json();
    };

    const filterReportData = (data: BreaksReport[], searchTerm: string) =>
        data.filter((report) =>
            report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.login.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const convertToCSV = (data: BreaksReport[]) => {
        const headers = [
            "Name", "Shift Date", "Login", "First Break", "Breakout", "Over Break",
            "Lunch In", "Lunch Out", "Over Break", "Second Break", "Breakout",
            "Over Break", "Personal Break", "Log Out",
        ];

        const rows = data.map((row) =>
            [
                row.name, row.shiftdate, row.login || "", row.brkin1 || "", row.brkout1 || "",
                row.ob1 || "", row.lunchin || "", row.lunchout || "", row.ob3 || "",
                row.brkin2 || "", row.brkout2 || "", row.ob2 || "", row.personalbreak, row.logoff || "",
            ].map((value) => `${value}`).join(",")
        );

        return [headers.join(","), ...rows].join("\n");
    };

    const downloadCSV = (csvContent: string, fileName: string) => {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleGenerateAndDownloadCSV = async () => {
        try {
            setError("");
            const { account_id } = getCredentials();
            let result = { data };

            if (start !== "" || end !== "") {
                result = await fetchReportData(account_id);
            }

            if (!result.data.length) {
                errorToast("No data available for the selected date range!");
                return;
            }

            const filteredData = filterReportData(result.data, searchTerm);
            setData(filteredData);
            setSuccess(true);

            const csv = convertToCSV(filteredData);
            const fileName = `report_${start || "all"}_${end || "all"}.csv`;
            downloadCSV(csv, fileName);

            setOriginalData(result.data);
            setData(result.data);
        } catch {
            errorToast("Unable to download reports!");
        }
    };

    const handleView = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setError("");    
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/download/report/${Decryptor(account_id || "")}/${start}/${end}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                
                throw new Error("Failed to fetch data");
            }

            const result = await response.json();
            if (start != "" || end != "") {
                setData(result.data);
            } else {
                setData(originalData);
            }
        } catch {
            errorToast("No logs available for the selected date range!");
        }
    };
    const fetchData = useCallback(async () => {
        try {
            setError("");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/monitoring/report/${Decryptor(account_id || "")}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const result = await response.json();
            if (!result.data.length) {
                return;
            }
            if (response.status == 200) {
                setData(result.data);
                setChecker(false);
            } else if (response.status == 401) {
                alert("Session expired, please login again.");
                localStorage.clear();
                router.push("/");
            }
        } catch {
            setError("An error occurred while fetching data.");
            if (!token) {
                router.push("/");
            }
        }
    }, [router, token, account_id]);

    useEffect(() => {
        if (checker) {
            fetchData();
        }
    }, [checker, fetchData])

    return (
        <div style={{ backgroundColor: '#e7e7e7' }}>
            <ToastContainer />
            <div className="d-flex" >
                <Dashboard />
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="flex-fill reports-division">
                    <div className="reportheader"><Header title="DAILY REPORTS" currentPage="" /></div>
                    <div className="px-4">
                        <div className="background-report">
                            <div className="px-4 pt-4" style={{ display: 'flex' }}>
                                <header style={{
                                    backgroundImage: "url('/img/Breaktool.png')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    position: 'sticky',
                                    paddingTop: '10px',
                                    padding: '15px',
                                    color: 'white',
                                    width: '100%'
                                }}>
                                    {error && <p style={{ color: "red", textAlign: 'center' }}>{error}</p>}
                                    <form onSubmit={handleView}>
                                        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 text-center justify-content-between">
                                            <div className="report-input">
                                                <input
                                                    className="form-control form-control--searchreport"
                                                    id="search-employee"
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchTerm}
                                                    onChange={handleSearch}
                                                />
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                                </svg>
                                            </div>
                                            <div className="d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-lg-end gap-3">
                                                <div className="d-flex align-items-center input-group has-calendar-icon" style={{ maxWidth: '220px' }}>
                                                    <span className="input-group-text">From</span>
                                                    <input
                                                        id="id-start"
                                                        type="date"
                                                        className="form-control"
                                                        required
                                                        onChange={(e) => setStart(e.target.value)}
                                                        value={start}
                                                        style={{ color: '#000000' }}
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center input-group has-calendar-icon" style={{ maxWidth: '220px' }}>
                                                    <span className="input-group-text">To</span>
                                                    <input
                                                        id="id-end"
                                                        type="date"
                                                        className="form-control"
                                                        required
                                                        onChange={(e) => setEnd(e.target.value)}
                                                        value={end}
                                                        style={{ color: '#000000' }}
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <button
                                                        type="submit"
                                                        className="daterange-button"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <button
                                                        type="button"
                                                        className="download"
                                                        onClick={handleGenerateAndDownloadCSV}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                                        </svg>
                                                        <label htmlFor="downloaf" className="align-items-center">Download</label>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </header>
                            </div>
                            <div className="mx-4 table-responsive reports-container">
                                <table className="tabreport table table-striped table-bordered">
                                    <thead>
                                        <tr className="report-header">
                                            <th>Name</th>
                                            <th>Shift Date</th>
                                            <th>Login</th>
                                            <th>1st Break In</th>
                                            <th>Break Out</th>
                                            <th>Over Break</th>
                                            <th>Lunch In</th>
                                            <th>Lunch Out</th>
                                            <th>Over Break</th>
                                            <th>2nd Break In</th>
                                            <th>Break Out</th>
                                            <th>Over Break</th>
                                            <th>Personal Break</th>
                                            <th>Logout</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-data">
                                        {data
                                            .filter((report) => {
                                                if (!searchTerm) {
                                                    return true;
                                                }
                                                const lowerSearch = searchTerm.toLowerCase();
                                                return (
                                                    report.name.toLowerCase().includes(lowerSearch)
                                                );
                                            })
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((report, index) => (
                                                <tr key={index} className="report-data">
                                                    <td>{report.name}</td>
                                                    <td>{report.shiftdate}</td>
                                                    <td>{report.login}</td>
                                                    <td>{report.brkin1}</td>
                                                    <td>{report.brkout1}</td>
                                                    <td className={report.ob1 ? "overbreak-red" : ""}>{report.ob1}</td>
                                                    <td>{report.lunchin}</td>
                                                    <td>{report.lunchout}</td>
                                                    <td className={report.ob3 ? "overbreak-red" : ""}>{report.ob3}</td>
                                                    <td>{report.brkin2}</td>
                                                    <td>{report.brkout2}</td>
                                                    <td className={report.ob2 ? "overbreak-red" : ""}>{report.ob2}</td>
                                                    <td>{report.personalbreak}</td>
                                                    <td>{report.logoff}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
