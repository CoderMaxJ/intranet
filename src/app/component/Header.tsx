"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "/public/asset/css/updateps.css";

interface HeaderProps {
  title: string;
  text: string;
}

export default function Header({ title, text }: HeaderProps) {

  return (
    <div className="header-container " style={{marginBottom:"10px"}}>
      <div className="header-image-container">
        <img
        src="/img/Breaktool.png"
        style={{
          marginLeft:'1px',
          width: "100%",
          height: "11vh",
          marginBottom: "0px",
       
          display: 'relative',
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)"
        }}
        />
      </div>
      <div className="header-text-container">
        <h1 className="headerbreaktool fw-bolder">{title}</h1>
        <h4 className="headerdown  p-2">{text}</h4>
      </div>
    </div>
  );
}