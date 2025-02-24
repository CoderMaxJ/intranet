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
          marginTop: "-20px",
          width: "89vw",
          height: "13vh",
          marginBottom: "-10px",
          marginLeft: "-51px",
          display: 'relative',
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)"
        }}
        />
      </div>
      <div className="header-text-container">
        <h1 className="headerbreaktool fw-bolde">{title}</h1>
        <h4 className="headerdown  p-2 fw-bolder">{text}</h4>
      </div>
    </div>
  );
}