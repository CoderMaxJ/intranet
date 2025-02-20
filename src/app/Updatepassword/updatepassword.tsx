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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message,setMessage]=useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShoww = () => {
    setShowPassword1((prev) => !prev);
  };

  const toggleShowww = () => {
    setShowPassword2((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess(false);
      return;
    } else {
      if (currentpassword == confirmPassword || currentpassword == password) {
        setError("New password must not the same to current password.");
        setSuccess(false);
        return;
      }
    }

    async function changePassword() {
      const id = localStorage.getItem("user_id");

      const newAccount = {
        empno: Decryptor(id || ""),
        oldpassword: currentpassword,
        newpassword: password,
        password2: confirmPassword,
      };

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
          console.log(response)
          setMessage(message.res);
          setCurrentPassword("");
          setPassword("");
          setConfirmPassword("");
          setSuccess(true);
          setTimeout(()=>{
           setMessage("");
          },2000)
         
        } else {
          const res = await response.json();
          setMessage(res.res);
          setSuccess(false);
        }
      } catch {
        setError("An error occurred. Please try again.");
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
  return (
    <div>
      {/* Link to open modal */}
      <div className="updatepassword-hvr" data-bs-toggle="modal" data-bs-target="#updatePasswordModal"
        style={{
          textDecoration: 'none',
          color: hovered ? 'white' : '#000000',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Update Password
      </div>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="updatePasswordModal"
        tabIndex={-1}
        aria-labelledby="updatePasswordModalLabel"
        aria-hidden="true"

      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" >
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
                    {error}
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
                      id="currentpassword"
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
                  <label htmlFor="password">New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="updatepassword-input"
                      id="password"
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
                      id="confirmpassword"
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
