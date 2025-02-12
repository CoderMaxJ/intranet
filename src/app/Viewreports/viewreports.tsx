"use client";
import { useState, useEffect } from "react";
import { Encryptor, Decryptor } from "@/security";
import Generatereport from "../Generatereport/Daterange";
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
    logout: string;
}

export default function Daterange() {
    const [data, setData] = useState<BreaksReport[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
        console.log(event.target.value.toLowerCase());
    };
    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(""); // Reset error before making request
                const account_id = localStorage.getItem("account_id");
                const token = localStorage.getItem("token");

                // Replace with your desired endpoint and date range or pass in parameters
                const start = "2025-01-01";  // Example start date
                const end = "2025-01-31";    // Example end date
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND}/monitoring/report/${account_id}/${start}/${end}/`,
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

                <Generatereport />
                {error && <div className="alert alert-danger">{error}</div>}
                {data.length > 0 ? (
                    <div className="table-responsive" style={{ height: '100vh', margin: '0 -290px', marginRight: "-290px", marginLeft: '-280px' }}>
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
                                color: 'white'
                            }}>

                                <input
                                    className="search-input"
                                    id="search-employee"
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        marginRight: '20px',
                                        marginLeft: '620px',
                                        width: '30vw'
                                    }}
                                />

                                <a
                                    href="#"
                                    className="viewreports text-primary text-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#reportModal"
                                >
                                    Generate  Reports
                                </a>

                                <div>
                                    <button className="viewback" onClick={() => window.history.back()}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            className="bi bi-reply-fill"
                                            viewBox="0 0 16 16"
                                            style={{ marginBottom: '5px' }}
                                        >
                                            <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
                                        </svg>{" "}
                                        Back
                                    </button>
                                </div>

                            </header>
                        </div>
                        <table className="table table-striped table-border">
                            <thead>
                                <tr >
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
                            <tbody>

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
                                            <td>{report.logout}</td>
                                        </tr>

                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No data to display</p>
                )}
            </div>
        </div>
    );
}
