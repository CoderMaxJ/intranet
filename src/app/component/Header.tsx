"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "/public/asset/css/updateps.css";
import Link from "next/link";
import Image from "next/image";
import Daterange from "../generatereport/Daterange";




export default function Header() {
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

  

  const triggerLogout = () => {
    router.push("/");
    localStorage.clear();
  };

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

      console.log(newAccount);

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

        console.log(response);

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ un: "J.Rio", password: "default000" }),
        });

        if (response.ok) {
          const token = await response.json();
          localStorage.setItem("token", token.access);
          console.log("Token saved:", token.access);
          forgotpass(token.access);
        } else {
          console.log("Invalid credentials");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    const existingToken = localStorage.getItem("token");

    if (existingToken) {
      console.log("Token exists, proceeding with login");
    } else {
      console.log("No token found, fetching a new one");
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
    <header className="header">
      <div className="left-section">
      <h2 style={{marginRight:'70vw'}}>Dashboard</h2>
    <div>
     
        {/* <Image
          style={{ marginTop: "-5px", justifyContent: 'center', alignItems:'center', marginRight: "630px", marginLeft:'600px' }}
          src="/img/Sos.png"
          alt="Logo"
          className="logo"
          height={100}
          width={100}
        /> */}
    </div>
    <div>
      <button 
        className="create-update-delete"
      >
        <a href="/crud"> <i className="bi bi-person-fill-add" style={{color:'#000000', fontSize:'30px'}}></i></a>
      </button>
    </div>
      </div> 

     


      {/* Profile Dropdown */}
      <div
        className="dropdown relative"
        style={{ marginLeft: "108rem", marginTop: "-3.7rem", display: "flex" }}
      >
        <button
          className="dropbtn"
          id="dropdownMenuButton1"
          onClick={() => setOpenProfile((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </button>

        {openProfile && (
          <div
            className="dropdown-content absolute bg-white border rounded-lg shadow-lg"
            style={{ marginTop: "64px", marginRight: "40px" }}
          >
            {/* Account Link */}
            <Link
              href="#"
              className="block px-4 py-2 hover:bg-gray-100"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              onClick={() => setActiveTab("account")}
            >
              Account
            </Link>

            {/* Reports Link */}
            <Link
              href="#"
              className="block px-4 py-2 hover:bg-gray-100"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </Link>

            {/* Logout Link */}
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={triggerLogout}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>

      {/* Offcanvas Drawer (Single for Account & Reports) */}
      <div
        className="offcanvas offcanvas-end"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            {activeTab === "account" ? "Account" : "Reports"}
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div>
          {activeTab === "account" ? (
            <div className="updatepass-div">
              <div className="login-division">
                <Image
                  style={{ marginLeft: 45, marginBottom: 30, height: "60px" }}
                  className="updatepass-logo"
                  src="/img/Sos.png"
                  alt="Staff Outsourcing Logo"
                  height={200}
                  width={290}
                />
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className={success ? "success-message" : "error-message"}>
                      {error}
                    </div>
                  )}
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
                      {currentpassword && <button onClick={toggleShow} className="cp-button"></button>}
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
                      {password && <button onClick={toggleShoww} className="ps-button"></button>}
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
                      {confirmPassword && <button onClick={toggleShowww} className="cnfrm-button"></button>}
                    </div>
                  </div>
                  <div className="button-div">
                    <button type="submit">Update Account</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <Daterange/>
          )}
        </div>
      </div>
    </header>
  );
}