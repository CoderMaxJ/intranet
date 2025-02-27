"use client";
import Logout from "../Logout/logout";
import Updatepassword from "../Updatepassword/updatepassword";
import { use, useEffect, useState } from "react";
import { IdentifyUser } from "../user_identifier";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



export default function Dashboard() {
  const privilege = localStorage.getItem("privilege");
  const [user_privilege, setUserPrivilege] = useState([""]);
  const [accordionIcon, setAccordionIcon] = useState(true);
  const [accordionIconn, setAccordionIconn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [hovered, setHovered] = useState(false);


  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShoww = () => {
    setShowPassword1((prev) => !prev);
  };

  const toggleShowww = () => {
    setShowPassword2((prev) => !prev);
  };
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      router.push("/")
    }
  })

  const router = useRouter();
  const user_hash_privilege = localStorage.getItem("user_privilege");
  if (user_hash_privilege) {
    const array_privilege = IdentifyUser(user_hash_privilege);
    array_privilege.forEach((data) => {
      user_privilege.push(data);
    })
  }

  const handleLogout = ()=>{
    localStorage.clear();
    router.push("/")
  }

  return (
    <>
    {logout && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={()=>setLogout(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={()=>setLogout(false)}
             
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
       
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    <div
      className="db "

      style={{
        width: "217px",
        height: "100%",
        padding: "10px",
      }}
    >

<Updatepassword />
      <div style={{ marginBottom: "40px", marginTop: '15px' }}>
        <img src="/img/Sos.png" height={45} />
      </div>



      <div className="accordion"  >
        <div style={{ marginBottom: '-10px', paddingLeft: '5px' }} className="generate">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-grid" viewBox="0 0 16 16" style={{ marginRight: "21px", marginLeft: "5px", marginBottom: '5px' }}>
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
          </svg>
          <button onClick={() => router.push("/WorkforceMonitoring")} style={{ border: "none", background: "transparent", color: '#ffffff' }}>
            Dashboard
          </button>
        </div>
        <div className="generate text-dark">
          <a onClick={() => router.push("/Reports")} style={{ color: '#ffffff' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-graph-up"
              viewBox="0 0 16 16"
              style={{ marginRight: '24px' }}
            >
              <path
                fillRule="evenodd"
                d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"
              />
            </svg>
            Reports
          </a>
        </div>

        <div className=" accordion-item">
          <div style={{ marginTop: '5px' }}>
            <div className="manage-menu d-flex justify-content-between"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
              onClick={(e) => setAccordionIconn(!accordionIconn)}
              style={{
                position: "relative",
                padding: '10px',
                borderRadius: '2px',
                color: '#ffffff',
              }}
            >  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" fill="currentColor" className="bi bi-person-gear" viewBox="0 0 16 16" style={{ marginRight: "18px", marginLeft: '-3px' }}>
                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
              </svg>
              <span style={{ marginLeft: '-55px' }}>Manage</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-chevron-up ${accordionIconn ? "rotate-acc-icon" : ""}`} viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
              </svg>
            </div>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne" style={{ marginTop: "-20px" }}>
              <div className="undermanage-hover accordion-body">
                {user_privilege.includes("manage_users") && (

                  <a onClick={() => router.push("/ManageAccount")} style={{ color: '#ffffff', textDecoration: 'none', display: 'block', marginTop: '12px', padding: '10px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16" style={{ marginRight: '21px' }}>
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    </svg>
                     Accounts
                  </a>
                )}
                <a onClick={() => router.push("/ManageEmployee")} style={{ color: '#ffffff', textDecoration: 'none', display: 'block', padding: '10px', marginBottom: '-13px', marginTop: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16" style={{ marginRight: '21px' }}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  </svg> Employee
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>

          <div className="manage-menu accordion-item">
            <div
              style={{
                borderRadius: '2px',
                marginTop: '10px',
              }}
              className="menu-item"
            >
              <div
                className="prof-hover d-flex justify-content-between"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOnee"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOnee"
                style={{ color: '#ffffff' }}
                onClick={(e) => setAccordionIcon(!accordionIcon)}
              >
                <div>
                </div>
              </div>
              <div
                style={{ marginTop: "-7px" }}
              >
                <div className="accordion-body user-updatepassword-button"
                >
                  <div className="updatepassword-hvr" data-bs-toggle="modal" data-bs-target="#updatePasswordModal"
                    style={{
                      textDecoration: 'none',
                      color: hovered ? 'black' : '#ffffff',
                      backgroundColor: hovered ? '#ffffff' : '',
                      padding: '10px',
                      whiteSpace: 'nowrap',
                      borderRadius: '2px',
                      width: '10.3vw',
                      marginTop: '-14px',
                      transform: 'translateX(-20px)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" style={{ marginRight: '19px' }}>
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>   Update Password
                  </div>

                </div>
                
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div className="dashboard" style={{ marginTop: '-11px', transform: 'translateX(-5px)', width: '10.3vw' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-box-arrow-right"
          viewBox="0 0 16 16"
          style={{ marginRight: '23px', marginLeft: '2px' }}
        >
          <path
            fillRule="evenodd"
            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
          />
          <path
            fillRule="evenodd"
            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
          />
        </svg>
        <Logout />
      </div>
    </div>
    </>
   

  );

}
