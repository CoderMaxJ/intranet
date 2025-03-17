import BreakDataTable from "../data/Breaks/break";
import LogsDataTable from "../data/Logs/logs";
import Dashboard from "../Dashboard/dashboard";
import Header from "../component/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Workforce Monitoring",
  description: "Monitoring System",
};


export default function MainDashboard() {
  return (
    <div className="d-flex main-page">
      <div>
        <Dashboard />
      </div>
      <div className="w-100 d-flex flex-column gap-4 px-4">
        <Header title="WORKFORCE MONITORING" text="Connecting Teams, Empowering Innovation" />
        <div>
          <BreakDataTable />
        </div>
        <div style={{ marginTop: "-10px" }}>
          <LogsDataTable />
        </div>
      </div>
    </div>
  );
}
