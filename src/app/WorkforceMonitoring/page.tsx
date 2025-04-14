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
      <div id="dashboard-menu" className="d-flex ">
        <Dashboard />
      </div>
      <div className="workforce-div flex-grow d-flex flex-column gap-4 ">
        <Header title="WORKFORCE MONITORING" text="Connecting Teams, Empowering Innovation" />
        <div>
          <BreakDataTable />
        </div>
        <div>
          <LogsDataTable />
        </div>
      </div>
    </div>
  );
}
