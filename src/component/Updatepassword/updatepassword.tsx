"use client";
import { useState, useEffect} from "react";
import { Decryptor } from "@/security";
import Image from "next/image";
import "@/app/style/updateps.css";

export default function Password() {
  const [currentpassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);
  const [currentPass, setCurrentPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(false);
  const [, setIsSamePassword] = useState(false);
  const [focus, setFocus] = useState(false);
  const [empno, setEmpno] = useState<string | null>(null);

  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
    useEffect(() => {
      setEmpno(localStorage.getItem("user_id"));
    },[]);

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
      if (currentpassword === password) {
        setIsSamePassword(true);
        setMessage("The new password must be different from the current one.");
        return;
      } else {
        setIsSamePassword(false);
      }

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
          }, 1000);
        } else {
          const res = await response.json();
          setMessage(res.res);
        }
      } catch (error) {
        console.warn("Error:", error);
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
        style={{ zIndex: 10000 }}
      >
        <div className="modal-dialog" style={{ minWidth: '450px' }}>
          <div className="modal-content" style={{ marginTop: "250px" }}>
            <div className="modal-header mb-3">
              <h1 className="modal-title fs-5 text-light" id="exampleModalToggleLabel">Reset Password</h1>
              <button
                type="button"
                id="btn-close"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={clearInputs}
                aria-label="Close"
              />
            </div>
            {message && (
              <div>
                <center>
                  <p
                    className={`${success ? "success-message" : "errorr-message"
                      } message-visible`}
                  >
                    {message}
                  </p>
                </center>
              </div>
            )}
            <div className="modal-body p-4" style={{ display: 'block' }}>
              <form onSubmit={handleSubmit} className="gap">
                <div className="passwords-inputs"
                >
                  <div className="gap-3">
                    <div className="currentpass" style={{ position: 'relative', width: '100%' }}>
                      <label htmlFor="currentpassword" className="updatepass-label" style={{ display: 'block' }}>
                        Current Password
                      </label>
                      <input
                        className="form-control updatepassword-input"
                        type={currentPass ? 'text' : 'password'}
                        value={currentpassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        style={{ width: '100%', paddingRight: '40px' }}
                      />
                      <span onClick={() => setCurrentPass(!currentPass)} className="newpass-eyetogglee" style={{
                        position: 'absolute',
                        right: '10px',
                        top: '65%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 2,
                        color: '#555'
                      }}>
                        {currentPass ? (<Image src="/svg/eye.svg" alt="eye-crossed" className="gray-icon"
                          height={16} width={16}/>) : (<Image src="/svg/eye-crossed.svg" alt="eye-crossed" className="gray-icon"
                            height={16} width={16}/>)}
                      </span>
                    </div>
                    <div className="password-field mt-3">
                      <label htmlFor="password" className="updatepass-label d-block">
                        New Password{" "}
                        {password !== '' && (
                          <span className="password-strength" style={{ color: passwordStrength ? 'green' : 'red' }}>
                            {passwordStrength ? 'Strong password' : 'Weak password'}
                          </span>
                        )}
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          id="password"
                          type={newPassword ? 'text' : 'password'}
                          className="form-control form-control--password-input"
                          value={password}
                          onFocus={() => setFocus(true)}
                          onKeyUp={validate}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span onClick={() => setNewPassword (!newPassword)} className="newpass-eyetoggleee" style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          zIndex: 2,
                          color: '#555'
                        }}>
                          {newPassword ? (<Image src="/svg/eye.svg" alt="eye-crossed" className="gray-icon"
                            height={16} width={16}/>) : (<Image src="/svg/eye-crossed.svg" alt="eye-crossed" className="gray-icon"
                              height={16} width={16}/>)}
                        </span>
                      </div>
                      {focus && (
                        <div className="password-hint mt-2">
                          <div><label style={{ color: password.length >= 8 ? 'green' : 'grey' }}>✔ Must be 8 to 20 characters in length and include</label></div>
                          <div><label style={{ color: passwordStrength ? 'green' : 'grey' }}>uppercase letter, lowercase letter, numbers, and special characters</label></div>
                        </div>
                      )}
                    </div>
                    <div className="confirmpass mt-3" style={{ position: 'relative', width: '100%' }}>
                      <label htmlFor="confirmpassword" className="updatepass-label" style={{ display: 'block' }}>
                        Confirm Password
                      </label>
                      <div>
                        <input
                          className="form-control updatepassword-input"
                          onFocus={() => setFocus(false)}
                          type={confirmPass ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '40px',
                            border: passwordsMatch ? '1px solid green' : '1px solid #ccc',
                          }}
                        />
                        <span onClick={() => setConfirmPass(!confirmPass)} className="newpass-eyetoggle" style={{
                          position: 'absolute',
                          right: '10px',
                          top: '65%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          zIndex: 2,
                          color: '#555'
                        }}>
                          {confirmPass ? (<Image src="/svg/eye.svg" alt="eye-crossed" className="gray-icon"
                            height={16} width={16}/>) : (<Image src="/svg/eye-crossed.svg" alt="eye-crossed" className="gray-icon"
                              height={16} width={16}/>)}
                        </span>
                      </div>
                    </div>
                    <div className="upd mt-3">
                      <button type="submit" className="update-pass mt-3">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
