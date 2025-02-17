"use client";
import { useState, useEffect } from "react";
import { Encryptor, Decryptor } from "@/security";
import Generatereport from "../Generatereport/Daterange";
import Dashboard from "../Dashboard/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

interface BreaksReport {
    name: string;
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
    logoff: string;
}

export default function Daterange() {
    const [data, setData] = useState<BreaksReport[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [start, setStart] = useState("2025-01-01");
    const [end, setEnd] = useState("2025-03-30");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
        console.log(event.target.value.toLowerCase());
    };
    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(""); // Reset error before making request
                const account_id = localStorage.getItem("user_id");
                const token = localStorage.getItem("token");

                // Replace with your desired endpoint and date range or pass in parameters
   
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND}/monitoring/report/${Decryptor(account_id || "")}/${start}/${end}/`,
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

                setData(result.data);
            } catch (e) {
                setError("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ backgroundColor: '#e7e7e7' }}>

            <div className="container">
                <div className="viewdashboard">
                    <div className="dashboard-view"><Dashboard /></div>
                    <Generatereport />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {data.length > 0 ? (
                    <div style={{ height: '99vh', marginLeft: '80px', width: '79vw' }}>

                        <div>
                            <header style={{
                                backgroundImage: "url('/img/Breaktool.png')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                padding: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                                color: 'white',
                                marginLeft: '-78px',
                                width: '88.5vw'
                            }}>
                                <div >
                                    <form className="input-daterange">
                                        <div className="start">
                                            <label
                                                htmlFor="from"
                                                className="formlabel"
                                            >From:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={start}
                                                onChange={(e) => setStart(e.target.value)} />
                                        </div>

                                        <div className="end">
                                            <label
                                                htmlFor="to"
                                                className="formlabel"
                                            >To:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={end}
                                                onChange={(e) => setEnd(e.target.value)}
                                            />
                                        </div>
                                        <div className="report-button">
                                            <button
                                                type="submit"
                                                className="report-button btn btn-success"
                                            >Go</button>
                                        </div>
                                    </form>
                                </div>

                                <div className="search-div">
                                    <input
                                        className="search-input"
                                        id="search-employee"
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        style={{
                                            padding: '8px 60px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            width: '25vw',
                                            position: 'relative'
                                        }}

                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        fill="currentColor"
                                        className="bi-search"
                                        viewBox="-7 0 30 16"
                                        style={{ color: '#595b5c' }}
                                    >
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                    </svg>

                                </div>

                                <a
                                    href="#"
                                    className="viewreports text-primary text-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#reportModal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16" style={{ marginRight: '10px', }}>
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                    </svg>
                                    Generate  Reports
                                </a>
                            </header>
                        </div>
                        <div style={{ overflowY: 'auto', height: '890px', marginRight: '-105px', marginLeft: '-79px' }}>
                            <table className="table table-striped table-bordered" style={{ position: 'sticky', top: 0, zIndex: 1, width: '87.9vw' }}>
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Name</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Login</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkin1</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkout1</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Ob1</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Lunchin</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Lunchout</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Ob3</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkin2</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Brkout2</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Ob2</th>
                                        <th style={{ backgroundColor: '#4391f7', color: '#ffffff' }}>Logout</th>
                                    </tr>
                                </thead>

                                <tbody className="table-data">
                                    {data
                                        .filter((report) => report.name.toLowerCase().includes(searchTerm) || report.login.toLowerCase().includes(searchTerm))
                                        .map((report, index) => (
                                            <tr key={index}>
                                                <td>{report.name}</td>
                                                <td>{report.login}</td>
                                                <td>{report.brkin1}</td>
                                                <td>{report.brkout1}</td>
                                                <td>{report.ob1}</td>
                                                <td>{report.lunchin}</td>
                                                <td>{report.lunchout}</td>
                                                <td>{report.ob3}</td>
                                                <td>{report.brkin2}</td>
                                                <td>{report.brkout2}</td>
                                                <td>{report.ob2}</td>
                                                <td>{report.logoff}</td>
                                            </tr>

                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p>No data to display</p>
                )}
            </div>
        </div>
    );
}
