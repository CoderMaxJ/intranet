"use client";
import BreakDataTable from "../data/Breaks/break";
import Dashboard from "../Dashboard/page";
import Header from "../../component/Header";

import { useState } from "react";

export default function MainDashboard() {
  const [pageTitle, setPageTitle] = useState("workforce monitoring");
  return (
    <div className="d-flex main-page">
      <div id="dashboard-menu" className="d-flex ">
        <Dashboard/>
      </div>
      <div className="workforce-div flex-grow d-flex flex-column gap-4 ">
        <Header title="WORKFORCE MONITORING" currentPage={pageTitle}/>
        <div>
          <BreakDataTable/>
        </div>
      </div>
    </div>
  );
}
