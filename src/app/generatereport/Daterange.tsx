"use client";
import { useState } from "react";
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
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(true);
  const [data, setData] = useState<BreaksReport[]>([]);

  const handleGenerateAndDownloadCSV = async () => {
    try {
      setError("");
      const account_id = localStorage.getItem("account_id");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/monitoring/report/${account_id}/${start}/${end}/`,
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
        alert("No data available for the selected date range.");
        return;
      }

      setData(result.data);
      setSuccess(true); // Update this to true after success
      
    
      const csvContent = [
        [
          "Name", "Login", "First Break", "Breakout", "Over Break",
          "Lunch In", "Lunch Out", "Over Break", "Second Break",
          "Breakout", "Over Break", "Log Out"
        ],
        ...result.data.map((row: BreaksReport) => [
          row.name,
          row.login,
          row.brkin1 || "",
          row.brkout1 || "",
          row.ob1 || "",
          row.lunchin || "",
          row.lunchout || "",
          row.ob3 || "",
          row.brkin2 || "",
          row.brkout2 || "",
          row.ob2 || "",
          row.logout || ""
        ].map(value => `${value}`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${start}_${end}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      setError("An error occurred while fetching data.");
    }
  };

  return (
    <div className={success ? "gen-maindiv" : "gen-maindiv generate-page"}>
      <form onSubmit={(e) => { e.preventDefault(); if (start && end) handleGenerateAndDownloadCSV(); else setError("Please fill in both date fields"); }}>
        <div className="settings-page">
          <h4 className="generate-header" style={{ fontFamily: "'Raleway', sans-serif"}}>Daily Logs</h4>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="settingspage-wrapper">
            <div className="date-start">
              <label htmlFor="id-start">From:</label>
              <input type="date" onChange={(e) => setStart(e.target.value)} value={start} />
            </div>
            <div className="date-end">
              <label htmlFor="id-end">To:</label>
              <input type="date" onChange={(e) => setEnd(e.target.value)} value={end} />
            </div>
            <button type="submit" className="btngen btn-success mb-3" style={{backgroundColor:'#0f9b45', color:'white', outline:'none', border: 'none'}}>Generate Report</button>
          </div>
          {/* <div>
            <button type="button" onClick={() => window.history.back()} className="back">
            <i className="bi bi-arrow-fill"></i> Back
            </button>
          </div> */}
        </div>
      </form>
    </div>
  );
}
