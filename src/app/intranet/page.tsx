"use client";
import BreakDataTable from "../data/breaks";
import LogsDataTable from "../data/logs";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
 
    return (
      <div>
        <div style={{backgroundColor:'#e7e7e7', paddingBottom:'20px'}}>
          <BreakDataTable />
          <LogsDataTable />
        </div>
      </div>
    );
  

}
