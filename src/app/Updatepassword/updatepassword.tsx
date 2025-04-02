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
                    transform:'translateX(15px)'
                  }}
                >
                  {/* Current Password */}
                  <div style={{ width: '100%', maxWidth: '400px', textAlign: 'start' }}>
                    <label htmlFor="currentpassword" className="updatepass-label" style={{ display: 'block' }}>
                      Current Password
                    </label>
                    <input
                      className="updatepassword-input"
                      type={showPassword ? 'text' : 'password'}
                      value={currentpassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* New Password */}
                  <div style={{ width: '100%', maxWidth: '400px', textAlign: 'start' }}>
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
                  <div style={{ width: '100%', maxWidth: '400px', textAlign: 'start' }}>
                    <label htmlFor="confirmpassword" className="updatepass-label" style={{ display: 'block' }}>
                      Confirm Password
                    </label>
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
                  </div>
                  {/* Submit Button */}
                  <div>
                    <button type="submit" className="btn btn-success">
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