"useclient";
import Logout from "../Logout/logout";
import Updatepassword from "../Updatepassword/updatepassword";
import Viewreports from "../Viewreports/page";
import { useState } from "react";
import { IdentifyUser } from "../user_identifier";
import { useRouter } from "next/navigation";


export default function Dashboard() {
  const privilege = localStorage.getItem("privilege");
  const [user_privilege, setUserPrivilege] = useState([""]);

  const user_hash_privilege = localStorage.getItem("user_privilege");
  


const router = useRouter();
  if(user_hash_privilege){
      const array_privilege = IdentifyUser(user_hash_privilege);
      array_privilege.forEach((data)=>{
        user_privilege.push(data);
      })
  }


  const handleReport = () => {
  };

  return (
    <div
      className="db"
      style={{
        backgroundColor: "#ffffff",
        width: "213px",
        height: "100vh",
        padding: "10px",
        marginLeft: "-10px"
      }}
    >
      <div style={{ marginBottom: "40px", marginTop: '15px' }}>
        <img src="/img/Sos.png" height={43} />
      </div>
      <div>
        <div style={{ marginLeft: '15px' }}>

          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-grid" viewBox="0 0 16 16" style={{ marginRight: "20px", marginLeft: "5px" }}>
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
          </svg>
          Dashboard

        </div>

        {user_privilege.includes("manage_users") && (
          <div>

            <div className="admin">
              {/* <div className="accordion" id="accordionExample"> */}
              <div className="accordion-item d-flex w-100 " data-bs-toggle="collapse" data-bs-target="#collapseThree1" style={{ padding: "10px" }}>

                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-gear" viewBox="0 0 16 16" style={{ marginRight: "20px" }}>
                  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                </svg>
                <h2 className="accordion-header" id="headingThree1">

                  <button
                    className="accordion-button collapsed"
                    type="button"

                    aria-expanded="true"
                    aria-controls="collapseThree1"
                    style={{ marginBottom: "-5px" }}
                  >
                    Manage
                  </button>
                </h2>
              </div>
            </div>
            <div
              id="collapseThree1"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree1"
              data-bs-parent="#accordionExample"
            >
              <div
                className="drop accordion-body"
                style={{
                  marginTop: "20px",
                }}
              >
                <ul className="list-unstyled" >
                  <li  onClick={()=>router.push("/ManageDepartment")} style={{ marginTop: "5px", marginLeft: '55px', cursor:"pointer" }}>
                    <a  className="text-dark" style={{ textDecoration: 'none' }}>
                      Accounts
                    </a>
                    </li>

                    <li onClick={()=>router.push("/Crud")} style={{cursor:"pointer", textAlign:"center"}}>
                      <a className="text-dark" style={{ textDecoration: 'none' }}>
                        Manage Employee
                      </a>
                    
                  </li>
                
                </ul>
                <a />
              </div>
            </div>
          </div>
        )}
        <div className="admin">
          {/* <div className="accordion" id="accordionExample"> */}
          <div className="accordion-item d-flex w-100 " data-bs-toggle="collapse" data-bs-target="#collapseThree" style={{ padding: "10px" }}>

          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
</svg>
            <h2 className="accordion-header" id="headingThree">

              <button
                className="accordion-button collapsed"
                type="button"

                aria-expanded="true"
                aria-controls="collapseThree"
                style={{ marginBottom: "-10px" }}
              >
                Users
              </button>
            </h2>
          </div>
        </div>
        
        <div
          id="collapseThree"
          className="accordion-collapse collapse"
          aria-labelledby="headingThree"
          data-bs-parent="#accordionExample"
        >
          <div
            className="drop accordion-body"
            style={{
              marginTop: "20px",
            }}
          >
            <ul className="list-unstyled" >
              <li style={{ marginTop: "5px", marginLeft: '55px' }}>
                <Updatepassword />
              </li>
            </ul>
            <a />
          </div>
        </div>
      </div>
      {/* aria-pressed="false" onClick={handleReport}> */}

      <div className="generate text-dark">
        <a href="/Viewreports">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-graph-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"
            />
          </svg>
          Reports
        </a>
      </div>
      <div className="dashboard" >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-box-arrow-right"
          viewBox="0 0 16 16"
          style={{ marginRight: '20px' }}
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

  );
}
