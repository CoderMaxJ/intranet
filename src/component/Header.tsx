"use client";
import "@/app/style/updateps.css";
import Image from "next/image";

interface HeaderProps {
  title: string;
  text?: string;
  currentPage: string;
}

export default function Header({ title, currentPage }: HeaderProps) {

 return (
  <div className="header-container">
    <div className="header-text-container text-white py-3 d-flex justify-content-between px-4 flex-wrap gap-2">
      <div>
        <h1 className="text-start fw-bold mb-0">{title}</h1>
      </div>

      {currentPage === "workforce monitoring" && (
        <div className="legends d-flex align-items-center gap-2 flex-wrap">
          <div>
            <span className="legend-pill firstbreak">
              <Image src="/svg/coffee.svg" alt="1st break" height={16} width={16} className="me-1 mb-1" />
              1st Break
            </span>
          </div>
          <div>
            <span className="legend-pill secondbreak">
              <Image src="/svg/secondbreak.svg" alt="2nd break" height={16} width={16} className="me-1 mb-1" />
              2nd Break
            </span>
          </div>
          <div>
            <span className="legend-pill lunchbreak">
              <Image src="/svg/plate-eating.svg" alt="lunch" height={16} width={16} className="me-1 mb-1" />
              Lunch
            </span>
          </div>
          <div>
            <span className="legend-pill overbreak">
              <Image src="/svg/pending.svg" alt="over break" height={16} width={16} className="me-1 mb-1" />
              Over Break
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
