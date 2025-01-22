"use client";
import BreakDataTable from "../data/breaks";
import LogsDataTable from "../data/logs";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
 
    return (
      <div>
        <div>
          <BreakDataTable />
          <LogsDataTable />
        </div>
      </div>
    );
  

}
