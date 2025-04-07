"use client";
import { useState } from "react";
import "/public/asset/css/updateps.css";
import { Decryptor } from "@/security";

export default function Updatepassword() {
  const [currentpassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(false);
  const [focus, setFocus] = useState(false);

  // Check if passwords match
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
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
    if (password != confirmPassword) {
      setMessage("Password Mismatch");
    }
    async function changePassword() {
      const newAccount = {
        empno: Decryptor(empno || ""),
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
          setMessage(message.res);
          setCurrentPassword("");
          setPassword("");
          setConfirmPassword("");
          setSuccess(true);
          setTimeout(() => {
            setMessage("");
            document.getElementById("btn-close")?.click();
          }, 2000);
        } else {
          const res = await response.json();
          setMessage(res.res);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    if (passwordStrength === true && passwordsMatch) {
      changePassword();
    }
  };
  const clearInputs = () => {
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  const validate = () => {
    const isValidPassword = (password: string) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    };
    const result = isValidPassword(password);
    setPasswordStrength(result);
  };

  return (
    <div>
      <div
        className="modal fade"
        id="updatePasswordModal"
        tabIndex={-1}
        aria-labelledby="updatePasswordModalLabel"
        aria-hidden="true"
        style={{ zIndex: 10000 }}
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ marginTop: "250px" }}>
            <div className="modal-header">
              <img
                src="/img/Sos.png"
                alt="Staff Outsourcing Logo"
                className="modal-title"
                id="updatePasswordModalLabel"
                style={{ height: "50px" }}
              />
              <button
                type="button"
                id="btn-close"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={clearInputs}
                aria-label="Close"
                style={{ marginTop: "-45px" }}
              />
            </div>
            {success ? (
              <div>
                <center>
                  <p style={{ color: "green", fontSize: "15px" }}>{message}</p>
                </center>
              </div>
            ) : (
              <div>
                <center>
                  <p style={{ color: "#FF3131", fontSize: "15px" }}>{message}</p>
                </center>
              </div>
            )}
            <div className="modal-body p-4" style={{ display: 'block' }}>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // 💡 This centers all child items horizontally
                    gap: '20px',
                    transform: 'translateX(15px)'
                  }}
                >
                  {/* Current Password */}
                  <div className="currentpass">
                    <label htmlFor="currentpassword" className="updatepass-label" style={{ display: 'block' }}>
                      Current Password
                    </label>
                    <input
                      className="updatepassword-input"
                      type={showPassword3 ? 'text' : 'password'}
                      value={currentpassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                     <span onClick={() => setShowPassword3(!showPassword3)} className="newpass-eyetoggle">
                        {showPassword3 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                        </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                          <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                        </svg>)}
                      </span>
                  </div>

                  {/* New Password */}
                  <div className="newpass">
                    <div className="newpassword-eyetoggle">
                      <label htmlFor="password" className="updatepass-label" style={{ display: 'block' }}>
                        New Password{' '}
                        {password !== '' && (
                          <span
                            style={{
                              color: passwordStrength ? 'green' : 'red',
                              fontSize: '13px',
                              marginLeft: '10px',
                            }}
                          >
                            {passwordStrength ? 'Strong password' : 'Weak password'}
                          </span>
                        )}
                      </label>
                      <input
                        onFocus={() => setFocus(true)}
                        onKeyUp={validate}
                        className="updatepassword-input"
                        type={showPassword1 ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          border: passwordsMatch ? '1px solid green' : '1px solid #ccc',
                        }}
                      />
                      <span onClick={() => setShowPassword1(!showPassword1)} className="newpass-eyetoggle">
                        {showPassword1 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                        </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                          <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                        </svg>)}
                      </span>
                    </div>
                    {focus && (
                      <div style={{ textAlign: 'left', fontSize: '13px' }}>
                        <label
                          style={{
                            display: 'block',
                            color: password.length >= 8 ? 'green' : 'grey',
                          }}
                        >
                          ✔ 8 to 20 characters
                        </label>
                        <label
                          style={{
                            display: 'block',
                            color: passwordStrength ? 'green' : 'grey',
                          }}
                        >
                          Letters, numbers, and special characters
                        </label>
                      </div>
                    )}
                  </div>
                  {/* Confirm Password */}
                  <div className="confirmpass">
                    <label htmlFor="confirmpassword" className="updatepass-label" style={{ display: 'block' }}>
                      Confirm Password
                    </label>
                    <div>
                      <input
                        className="updatepassword-input"
                        onFocus={() => setFocus(false)}
                        type={showPassword2 ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          border: passwordsMatch ? '1px solid green' : '1px solid #ccc',
                        }}
                      />
                      <span onClick={() => setShowPassword2(!showPassword2)} className="newpass-eyetoggle">
                        {showPassword2 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                        </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                          <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                        </svg>)}
                      </span>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div>
                    <button type="submit" className="update-pass btn btn-success">
                      Update Password
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