"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import "/public/asset/css/updateps.css";

interface HeaderProps {
  title: string;
  text: string;
}

export default function Header({ title, text }: HeaderProps) {

  return (
    <div className="header-container " style={{ position:'relative'}}>
      <div className="header-image-container">
        <img
        src="/img/Breaktool.png"
        style={{
          transform: "translateX(30px)",
          margin:'auto',
          width: "96.5%",
          borderRadius:'4px',
          height: "11vh",
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)"
        }}
        />
      </div>
      <div className="header-text-container">
        <h1 className="headerbreaktool fw-bolder mb-0">{title}</h1>
        {text ? <h4 className="headerdown  mb-0">{text}</h4> :""}
      </div>
    </div>
  );
}