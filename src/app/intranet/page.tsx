"use client";
import BreakDataTable from "../data/breaks";
import LogsDataTable from "../data/logs";
import Dashboard from "../Dashboard/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MainDashboard() {
  return (
    <div style={{ display: "flex", height: "100vh", width: '100vw', backgroundColor: "#e7e7e7" }}>
   
      <div style={{ width: "250px",  height: "100vh" }}>
        <Dashboard />
      </div>

    
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#e7e7e7", width:'50vw' }}>
        <div>
          <BreakDataTable />
        </div>
        <div style={{ marginTop: "-10px"}}> 
          <LogsDataTable />
        </div>
      </div>
    </div>
  );
}
