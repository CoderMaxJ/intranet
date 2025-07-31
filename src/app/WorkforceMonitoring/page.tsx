"use client";
import BreakDataTable from "../data/Breaks/break";
import Dashboard from "../../component/Dashboard/page";
import Header from "../../component/Header";
import { useState,useEffect } from "react";

export default function MainDashboard() {
  const [pageTitle] = useState("workforce monitoring");

  useEffect(()=>{
       document.addEventListener('contextmenu', (e) => e.preventDefault()); // 
          document.addEventListener("keydown", (event) => {
    
               if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
                 event.preventDefault();
                 
               }
             
               if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
               event.preventDefault();
               }
               if(event.key === "F12"){
                    event.preventDefault()
               }
               if ((event.ctrlKey && event.shiftKey && event.key === 'I') || 
                    (event.ctrlKey && event.shiftKey && event.key === 'J')) {
                    event.preventDefault(); 
               }
             });
  })
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
