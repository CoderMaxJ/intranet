"use client";
import BreakDataTable from "../data/Breaks/break";
import LogsDataTable from "../data/Logs/logs";
import Dashboard from "../Dashboard/dashboard";
import Header from "../component/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Decryptor } from "@/security";

export default function MainDashboard() {
// alert(Decryptor(localStorage.getItem("user_id") || ""))
  return (
    <div style={{ display: "flex", height: "100vh", width: '100vw', backgroundColor: "#e7e7e7" }}>
   
      <div>
        <Dashboard />
      </div>
    
      <div style={{ flex: 1, backgroundColor: "#e7e7e7", width:'50vw' }}>
        <Header title="WORKFORCE MONITORING" text="Connecting Teams, Empowering Innovation"/>
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
