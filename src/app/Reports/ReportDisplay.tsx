"use client";
import { useState, useEffect } from "react";
import { Encryptor, Decryptor } from "@/security";
import Dashboard from "../Dashboard/dashboard";
import Header from "../component/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

export default function Daterange() {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth());
    const [originalData, setOriginalData] = useState<BreaksReport[]>([]);
    const [data, setData] = useState<BreaksReport[]>([]);
    const [dataToDownload, setDataToDownload] = useState<BreaksReport[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(true);
    const [buttonFilter, setButtonFilter] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [checker, setChecker] = useState(true);
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    useEffect(() => {
        if (checker) {
            fetchData();
        }
    }, [data])
    // 
    const handleGenerateAndDownloadCSV = async () => {
        try {
            setError("");
            const account_id = localStorage.getItem("user_id");
            const token = localStorage.getItem("token");
            let result;
            if (start === "" && end === "") {
                result = { data: data };
            } else {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND}/download/report/${Decryptor(account_id || "")}/${start}/${end}/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Decryptor(token || "")}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                result = await response.json();
            }
            if (!result.data.length) {
                return;
            }
            const filteredData = result.data.filter((report: any) =>
                report.name.toLowerCase().includes(searchTerm) || report.login.toLowerCase().includes(searchTerm)
            );
            setData(filteredData);
            setSuccess(true);
            const csvContent = [
                [
                    "Name",
                    "Shift Date",
                    "Login",
                    "First Break",
                    "Breakout",
                    "Over Break",
                    "Lunch In",
                    "Lunch Out",
                    "Over Break",
                    "Second Break",
                    "Breakout",
                    "Over Break",
                    "Personal Break",
                    "Log Out",
                ],
                ...filteredData.map((row: BreaksReport) =>
                    [
                        row.name,
                        row.shiftdate,
                        row.login || "",
                        row.brkin1 || "",
                        row.brkout1 || "",
                        row.ob1 || "",
                        row.lunchin || "",
                        row.lunchout || "",
                        row.ob3 || "",
                        row.brkin2 || "",
                        row.brkout2 || "",
                        row.ob2 || "",
                        row.personalbreak,
                        row.logoff || "",
                    ]
                        .map((value) => `${value}`)
                        .join(",")
                ),
            ].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `report_${start || "all"}_${end || "all"}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setOriginalData(result.data);
            setData(result.data);
        } catch (e) {
            setError("An error occurred while fetching data.");
        }
    };
    const handleView = async () => {
        try {
            setError("");
            const account_id = localStorage.getItem("user_id");
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/download/report/${Decryptor(account_id || "")}/${start}/${end}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Decryptor(token || "")}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const result = await response.json();
            if (!result.data.length) {
                alert("No data available for the selected date range.");
                return;
            }
            if (start != "" || end != "") {
                setData(result.data);
            } else {
                setData(originalData);
            }
        } catch (e) {
            alert("No data found in this given date range!")
        }
    };
    const fetchData = async () => {
        try {
            setError("");
            const account_id = localStorage.getItem("user_id");
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/monitoring/report/${Decryptor(account_id || "")}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Decryptor(token || "")}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const result = await response.json();
            if (!result.data.length) {
                alert("No data available for the selected date range.");
                return;
            }
            if (response.status == 200) {
                setData(result.data);
                setChecker(false);
            }
        } catch (e) {
            setError("An error occurred while fetching data.");
        }
    };

    return (
        <div style={{ backgroundColor: '#e7e7e7' }}>
            <div className="d-flex db-reports1" style={{ height: "100%", position: "absolute", width: '100%' }} >
                <Dashboard />
                {error && <div className="alert alert-danger">{error}</div>}
                {data.length > 0 ? (
                    <div className="main-divv px-4">
                        <div className="reportheader"><Header title="DAILY REPORTS" /></div>
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
                                    <form>
                                        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 text-center justify-content-between">
                                            {/* Date Range Section */}
                                            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="id-start" className="form-label mb-0 me-2">From:</label>
                                                    <input
                                                        required
                                                        type="date"
                                                        className="form-control"
                                                        onChange={(e) => setStart(e.target.value)}
                                                        value={start}
                                                        style={{ color: '#000000' }}
                                                    />
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="id-end" className="form-label mb-0 me-2">To:</label>
                                                    <input
                                                        required
                                                        type="date"
                                                        className="form-control"
                                                        onChange={(e) => setEnd(e.target.value)}
                                                        value={end}
                                                        style={{ color: '#000000' }}
                                                    />
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <button
                                                        type="button"
                                                        className="daterange-button"
                                                        onClick={handleView}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Search Input */}
                                            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                                                <input
                                                    className="form-control"
                                                    id="search-employee"
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchTerm}
                                                    onChange={handleSearch}
                                                    style={{
                                                        padding: '8px 12px 8px 60px', 
                                                        borderRadius: '5px',
                                                        border: '1px solid #ccc',
                                                        backgroundColor: '#f0f0f0',
                                                        color: '#000',
                                                        width: '100%',
                                                        fontSize: '14px',
                                                        boxSizing: 'border-box',
                                                    }}
                                                />
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
                                            </div>

                                            <button
                                                type="button"
                                                className="download"
                                                onClick={handleGenerateAndDownloadCSV}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px', // space between icon and label
                                                  }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                                </svg>
                                                <label htmlFor="downloaf" className="align-items-center">Download</label>
                                            </button>
                                        </div>
                                    </form>
                                </header>
                            </div>
                            <div className="mx-4" style={{ overflowY: 'auto', height: '700px' }}>
                                <table className="tabreport table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr className="report-header">
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Name</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Shift Date</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Login</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkin1</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkout1</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>OB</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Lunchin</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Lunchout</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>OB</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkin2</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkout2</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>OB</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Personal Break</th>
                                            <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Logout</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-data">
                                        {data
                                            .filter((report) => {
                                                if (!searchTerm) return true;
                                                return report.name.toLowerCase().includes(searchTerm) || report.login.toLowerCase().includes(searchTerm)
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
                ) : (
                    <p>No data to display</p>
                )}
            </div>
        </div>
    );
}