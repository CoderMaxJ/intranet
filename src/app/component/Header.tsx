"use client";
import "/public/asset/css/updateps.css";

interface HeaderProps {
  title: string;
  text?: string;
}

export default function Header({ title, text }: HeaderProps) {
  return (
    <div className="header-container ">
      <div className="header-text-container text-white py-3">
        <h1 className=" text-center fw-bold mb-0">{title}</h1>
        {text ? <h4 className=" text-center mb-0">{text}</h4> : ""}
      </div>
    </div>
  );
}
