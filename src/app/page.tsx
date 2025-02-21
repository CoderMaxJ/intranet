"use client"
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./login/page";
import { ToastContainer,toast } from "react-toastify";

export default function Page() {

  return (
   
      <div>
         <Login/>
      <ToastContainer/>
     
      </div>
    );

}