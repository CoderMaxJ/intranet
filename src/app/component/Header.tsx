"use client";
import { useState } from "react";
import "/public/asset/css/updateps.css";

interface HeaderProps {
  title: string;
  text?: string;
}

export default function Header({ title, text }: HeaderProps) {
  const [showDashboard, setShowDashboard] = useState("");
  return (
    <div className="header-container ">
      <div className="header-text-container text-white py-3 d-flex justify-content-between px-4">
        <div>
          <h1 className=" text-start fw-bold mb-0">{title}</h1>
        </div>
         <div className="legends align-items-center">
          <span className="firstbreak">
            1st Break
          </span>
          <span className="secondbreak">
            2nd Break
          </span>
          <span className="lunchbreak">
            Lunch
          </span>
          <span className="overbreak">
            Over Break
          </span>
        </div> 
      </div>
    </div>
  );
}
