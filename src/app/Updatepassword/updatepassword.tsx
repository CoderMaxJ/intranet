"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "/public/asset/css/updateps.css";
import Image from "next/image";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
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
        setError("New password must not match the current password.");
        setSuccess(false);
        return;
      }
    }

    async function forgotpass(token: string) {
      const id = localStorage.getItem("account_id");

      const newAccount = {
        empno: id,
        oldpassword: currentpassword,
        newpassword: password,
        password2: confirmPassword,
      };



      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/change/password/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(newAccount),
          }
        );

        

        if (response.status === 200) {
          setError("Password updated successfully!");
          setSuccess(true);
          setTimeout(() => router.push("/intranet"));
        } else {
          const res = await response.json();
          setError(res.message || "Unable to changepassword");
          setSuccess(false);
        }
      } catch {
        setError("An error occurred. Please try again.");
      }
    }

    async function getToken() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/token/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ un: "J.Rio", password: "default000" }),
          }
        );

        if (response.ok) {
          const token = await response.json();
          localStorage.setItem("token", token.access);
      
          forgotpass(token.access);
        } else {
 
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    const existingToken = localStorage.getItem("token");

    if (existingToken) {

    } else {

      getToken();
    }
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

  return (
    <div>
      {/* Link to open modal */}
      <a href="#" className="text-dark" data-bs-toggle="modal" data-bs-target="#updatePasswordModal">
        Update Password
      </a>

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
                style={{height:'50px', marginLeft:'60px'}}
              ></img>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close" 
                style={{marginTop:'-45px'}}
              ></button>
            </div>

            <div className="modal-body" style={{ marginLeft: "35px" }}>
              {error && (
                <div className={success ? "success-message" : "error-message"}>
                  {error}
                </div>
              )}

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

                <div className="updatepass-label">
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      style={{ marginTop: "15px" }}
                    >
                      <i
                        className="bi bi-reply-fill"
                        style={{ marginRight: "5px", fontSize: "16px" }}
                      ></i>
                      Back
                    </button>
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
