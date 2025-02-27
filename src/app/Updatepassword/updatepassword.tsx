"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "/public/asset/css/updateps.css";
import Image from "next/image";
import { Decryptor } from "@/security";


  

export default function Updatepassword() {
  const [openProfile, setOpenProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [openNotification, setOpenNotification] = useState(false);
  const [drawerState, setDrawerState] = useState(false);
  const [currentpassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [message,setMessage]=useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [passwordStrength,setPasswordStrength]=useState(Boolean);


  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShoww = () => {
    setShowPassword1((prev) => !prev);
  };

  const toggleShowww = () => {
    setShowPassword2((prev) => !prev);
  };

  const empno = localStorage.getItem("user_id"); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    async function changePassword() {
      const id = localStorage.getItem("user_id");

      const newAccount = {
        empno: Decryptor(empno || ""),
        oldpassword: currentpassword,
        newpassword: password,
        password2: confirmPassword,
      };
const btnClose = document.getElementById("btn-close");
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/change/password/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Decryptor(token || "")}`,
            },
            body: JSON.stringify(newAccount),
          }
        );


        if (response.status === 200) {
        
          const message = await response.json();
          setMessage(message.res);
          console.log(response)
          setMessage(message.res);
          setCurrentPassword("");
          setPassword("");
          setConfirmPassword("");
          setSuccess(true);
          setTimeout(()=>{
           setMessage("");
           btnClose?.click();
          },2000)
         
        } else {
          const res = await response.json();
          console.log(res.res)
          setMessage(res.res);
        }
      } catch {
        
      }
    }


    changePassword()
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const togglePassword = () => {
    setShowPassword1((prevState) => !prevState);
  };

  const togglePasswordV = () => {
    setShowPassword2((prevState) => !prevState);
  };

  const clearInputs=()=>{
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  }

  const validate = () =>{
    function isValidPassword(password:string) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
  }
  const result = isValidPassword(password);
  if(result === true){
    setPasswordStrength(true);
  }else{
    setPasswordStrength(false);
  }
  console.log(result);
  }

  return (
    <div>
      <div data-bs-toggle="modal" data-bs-target="#updatePasswordModal"
        style={{
          textDecoration: 'none',
          color: hovered ? 'black' : '#ffffff',
          backgroundColor: hovered ? '#ffffff':'',
          padding:'10px',
          whiteSpace:'nowrap',
          borderRadius:'2px',
          width:'10.3vw',
          marginTop:'-14px',
          transform:'translateX(-20px)',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" style={{marginRight:'19px'}}>
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>   Update Password
      </div>
      <div
        className="modal fade"
        id="updatePasswordModal"
        tabIndex={-1}
        aria-labelledby="updatePasswordModalLabel"
        aria-hidden="true"

      >
        <div className="modal-dialog">
          <div className="modal-content">
  
            <div className="modal-header">
              <img
                src="/img/Sos.png"
                alt="Staff Outsourcing Logo"
                className="modal-title"
                id="updatePasswordModalLabel"
                style={{ height: '50px', marginLeft: '60px' }}
              ></img>
              <button
                type="button"
                id = "btn-close"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={clearInputs}
                aria-label="Close"
                style={{ marginTop: '-45px' }}
              ></button>
 
            </div>

            {success ? (
              <div>
                <p style={{ color: 'green' ,fontSize:"15px"}}>
                    {message}
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: '#FF3131',fontSize:"15px" }}>
                    {message}
                </p>
              </div>
            ) }
            <div className="modal-body" style={{ marginLeft: "35px" }}>
            <label style={{fontSize:"13px"}}>
  Password must be at least 8 characters and include:
  <ul>
    <li style={{color:"red"}}>One lowercase letter</li>
    <li style={{color:"red"}}>One uppercase letter</li>
    <li style={{color:"red"}}>One number</li>
    <li style={{color:"red"}}>One special character (@$!%*?&)</li>
  </ul>
</label>
              <form onSubmit={handleSubmit}>
                <div className="updatepass-label">
                  <label htmlFor="currentpassword">Current Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="updatepassword-input"
                      type={showPassword ? "text" : "password"}
                      value={currentpassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    {currentpassword && (
                      <button
                        type="button"
                        onClick={toggleShow}
                        className="cp-button"
                      ></button>
                    )}
                  </div>
                </div>

                <div className="updatepass-label1">
                  <label htmlFor="password">New Password {password != "" && (<span style={{color: passwordStrength === true ? "green":"red",fontSize:"13px",marginLeft:"80px"}}>{passwordStrength === true ? "Strong password": "Weak password"}</span>)}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      onKeyUp={validate}
                      className="updatepassword-input"
                      type={showPassword1 ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {password && (
                      <button
                        type="button"
                        onClick={toggleShoww}
                        className="ps-button"
                      ></button>
                    )}
                  </div>
                </div>

                <div className="updatepass-label">
                  <label htmlFor="confirmpassword">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="updatepassword-input"
 
                      type={showPassword2 ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {confirmPassword && (
                      <button
                        type="button"
                        onClick={toggleShowww}
                        className="cnfrm-button"
                      ></button>
                    )}
                  </div>
                </div>

                <div className="button-div" style={{ display: "block" }}>
                  <div>
                    {" "}
                    <button type="submit" className="btn btn-success">
                      Update Password
                    </button>
                  </div>
                  <div>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
