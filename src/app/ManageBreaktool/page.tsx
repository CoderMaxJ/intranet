"use client"
import "bootstrap/"
import Dashboard from "../Dashboard/dashboard"
import Header from "../component/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
export default function ManageBreaktool(){
    return (
        <div>
            <div className="d-flex  align-items-center">
                <div>
                    <Dashboard/>
                </div>
                <div className="vh-100 w-100 border border">
                <div className="px-5">
                    <Header title="Manage breaktool account" text="s"/>
                </div>
                <div className="">

                </div>
         
              
                </div>
            </div>
        </div>
    )
}