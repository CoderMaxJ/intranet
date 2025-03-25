"use client";
import { useState, useEffect, useRef } from "react";
import { Decryptor } from "@/security";
import { useRouter } from "next/navigation";

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
  const [filter, setFilter] = useState("");
  const token = localStorage.getItem("token");
  const [latestUpdate, setLatestUpdate] = useState("");
  const logData = useRef<Logs[]>([]); // Ref to store logs data

  const router = useRouter();
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
        `${process.env.NEXT_PUBLIC_BACKEND}/logs/${Decryptor(account_id || "")}/?last_update=${latestUpdate || ""}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Decryptor(token || "")}`,
          },
        }
      );

      if (response.status === 204) {
        const message = await response.text();
        // No new data, use data from local storage
        const storedData = localStorage.getItem("logsData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setData(parsedData);
          logData.current = parsedData;
        }

        return;
      }
      if(!response.ok || response.status === 404 || response.status === 401 || response.status === 403 ){
       return;
      }      
      const fetchedData = await response.json();
      setLatestUpdate(fetchedData.latest_update);
      // Merge fetched data with the current state
      const storedData = localStorage.getItem("logsData");
      const storedLogs = storedData ? JSON.parse(storedData) : [];
      const updatedLogs = fetchedData.data.map((newLog: Logs) => {
        const existingLog = storedLogs.find((log: Logs) => log.name === newLog.name);
        return existingLog ? { ...newLog } : newLog;
      });

      setData(updatedLogs);
      logData.current = updatedLogs;
      // Store the new data in local storage
      localStorage.setItem("logsData", JSON.stringify(updatedLogs));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const intervalId = setInterval(fetchLogs, 1000);
    return () => clearInterval(intervalId); // Cleanup interval
  }, [latestUpdate]); 

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
        <div className="logs-table" style={{ display: "flex"}}>
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
          <div
            className="searchbar-container1"
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              alignContent: "center",
            }}
          >
            <input
              className="searchbarr"
              style={{
                justifyContent:'space-between',
                backgroundColor: "#f0f0f0",
                fontFamily: "'Raleway', sans-serif",
                marginBottom: "3px",
                // paddingRight: "30px",
                // position: "absolute",
              }}
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={handleSearchChange}
            />
           
            <div
            className="adjust-icon"
              style={{
                position: "absolute",
                right: "10px",
                pointerEvents: "none",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                className="logs-icon bi-search"
                viewBox="-7 0 30 16"
                style={{ cursor: "pointer", position: "absolute", transform: "translateY(-23px) translateX(-390px)", margin: "0 auto" }}
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
          </div>
          <div className="logs-total d-flex">
          <span
                style={{
                  padding: "3px",
                  fontFamily: "'Raleway', sans-serif",
                  backgroundColor: "#b3efb2",
                  textAlign: "center", 
                  fontWeight: "bold",    
                  paddingTop:'7px',        
                }}
              >
                <i className=" bi bi-people-fill" style={{padding:'4px'}}></i>
                Total: 100
              </span>
          </div>
        </div>
        <div className="logs-tablee table-responsive">
          <table className="tablogs table table-bordered table-striped">
            <thead style={{ position: "sticky", top: 0 }}>
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
            <tbody style={{ overflowY: "auto" }}>
              {filteredRows.map((logs) => (
                <tr key={logs.name}>
                  <td>{logs.name}</td>
                  <td>{logs.login}</td>
                  <td>{logs.brkin1}</td>
                  <td>{logs.brkout1}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>{logs.ob1}</td>
                  <td>{logs.lunchin}</td>
                  <td>{logs.lunchout}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>{logs.ob3}</td>
                  <td>{logs.brkin2}</td>
                  <td>{logs.brkout2}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>{logs.ob2}</td>
                  <td>{logs.logoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LogsDataTable;