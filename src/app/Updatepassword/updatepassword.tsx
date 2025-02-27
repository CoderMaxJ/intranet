"use client";
import { useState } from "react";
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
  const [focus,setFocus]=useState(false);


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

      {/* Link to open modal */}
      
      <div
        className="modal fade"
        id="updatePasswordModal"
        tabIndex={-1}
        aria-labelledby="updatePasswordModalLabel"
        aria-hidden="true"
        style={{zIndex:99999}}

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
                  </div>
                </div>

                <div className="updatepass-label1">
                  <label htmlFor="password">New Password {password != "" && (<span style={{color: passwordStrength === true ? "green":"red",fontSize:"13px",marginLeft:"80px"}}>{passwordStrength === true ? "Strong password": "Weak password"}</span>)}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      onFocus={()=>setFocus(true)}
                      onKeyUp={validate}
                      className="updatepassword-input1"
                      type={showPassword1 ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                   
                    {focus === true && (
                      <div>
                           <label htmlFor="" style={{fontSize:"13px",color: passwordStrength === true ? "green":"grey"}}> 
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg>
                            </label> <label htmlFor="" style={{fontSize:"13px",marginTop:"-45px",color: passwordStrength === true ? "green":"gray"}}>8 to 20 characters </label><br />
                           <label  htmlFor="" style={{fontSize:"13px",marginBottom:"10px" , color:passwordStrength === true ? "green":""}}> Letters,numbers, and special characters</label>
                      </div>
        
                    )}
         
                  </div>
              
                </div>

                <div className="updatepass-label">
                  <label htmlFor="confirmpassword">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="updatepassword-input"
                      onFocus={()=>setFocus(false)}
                      type={showPassword2 ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
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
