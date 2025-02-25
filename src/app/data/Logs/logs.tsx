"use client";
import { useState, useEffect } from "react";
import { Decryptor } from "@/security";
import { tr } from "date-fns/locale";

interface Logs {
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

function LogsDataTable() {
  const [data, setData] = useState<Logs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] =useState("");
  const token = localStorage.getItem("token");


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toUpperCase());
    setFilter(e.target.value.toLowerCase());
  };

  const filteredRows = data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toUpperCase()
      .toLowerCase()
      .includes(filter)
  );

  const fetchLogs = async () => {
    try {
      const account_id = await localStorage.getItem("user_id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/logs/${Decryptor(account_id || "")}/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Decryptor(token || "")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(); 

    const intervalId = setInterval(fetchLogs, 5000);

    return () => clearInterval(intervalId); 
  }, []);

  if (loading)

    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          transition: "opacity 0.3s ease",
          opacity: 1,
          zIndex: 9999,
        }}
      >
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="logs-wrapper" style={{ backgroundColor: "#e7e7e7" }}>
      <div className="logs-maindiv">
        <div className="logs-table" style={{ display: "flex" }}>
          <h3
            className="logs-headername"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: "bold",
              fontSize: "23px",
            }}
          >
            Agent Logs Today
          </h3>
          <div className="searchbarlogs" style={{display:'flex', alignItems:"center"}}>
            <input
              id="myInput"
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={handleSearchChange}
            />
            <svg
              style={{
                marginLeft: "350px",
                marginTop: "1px",
                display: "flex",
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi-search"
              viewBox="-7 0 30 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <button
              type="submit"
              className="btn btn btn-primary"
              style={{
                height: "41px",
                fontFamily: "'Raleway', sans-serif",
                borderRadius: "4px",
                marginBottom: "2px",
           
                marginLeft: "3px",
                marginTop: "4px",
                color: "white",
              }}
            >
              Go
            </button>
          </div>
         
        </div>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Name</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Login</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>First Break</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Breakout</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Over Break</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Lunch In</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Lunch Out</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Over Break</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Second Break</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Breakout</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Over Break</th>
              <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Log Out</th>
            </tr>
          </thead>
          <tbody>
              {filteredRows.map((logs)=>(
                <tr key={logs.name}>
                 <td>{logs.name}</td>
                 <td>{logs.login}</td>
                 <td>{logs.brkin1}</td>
                 <td>{logs.brkout1}</td>
                 <td style={{color:"red", fontWeight:"bold"}}>{logs.ob1}</td>
                 <td>{logs.lunchin}</td>
                 <td>{logs.lunchout}</td>
                 <td style={{color:"red", fontWeight:"bold"}}>{logs.ob3}</td>
                 <td>{logs.brkin2}</td>
                 <td>{logs.brkout2}</td>
                 <td style={{color:"red", fontWeight:"bold"}}>{logs.ob2}</td>
                 <td>{logs.logoff}</td>
               </tr>
              ))}    
          </tbody>
        </table>
      </div>
      </div> 
  );
}

export default LogsDataTable;