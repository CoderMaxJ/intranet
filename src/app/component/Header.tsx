"use client";
import "/public/asset/css/updateps.css";

interface HeaderProps {
  title: string;
  text?: string;
  currentPage: string;
}

export default function Header({ title, currentPage }: HeaderProps) {

  return (
    <div className="header-container ">
      <div className="header-text-container text-white py-3 d-flex justify-content-between px-4">
        <div>
          <h1 className=" text-start fw-bold mb-0">{title}</h1>
        </div>
        {currentPage === "workforce monitoring" && (
          <div className="legends align-items-center gap-2">
            <div>
              <span className="firstbreak">
                <img src="/svg/coffee.svg" alt="firstbreak" className="me-1" height={16} />
                1st Break
              </span>
            </div>
            <div>
              <span className="secondbreak">
                <img src="/svg/secondbreak.svg" alt="secondbreak"  className="me-1" height={16} />
                2nd Break
              </span>
            </div>
            <div>
              <span className="lunchbreak">
                <img src="/svg/plate-eating.svg" alt="lunch" className="me-1" height={16} />
                Lunch
              </span>
            </div>
            <div>
              <span className="overbreak">
                <img src="/svg/pending.svg" alt="overbreak" className="me-1" height={16} />
                Over Break
              </span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
