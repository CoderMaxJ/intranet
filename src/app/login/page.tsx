"use client";

import { useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "/public/asset/css/login.css";
import Image from "next/image";
import { redirect } from 'next/navigation'



export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState<string>("");
  const [isLogged,setLog] = useState(false)



useEffect(() => {
  const storedToken = localStorage.getItem("token");
  setToken(storedToken ?? "");
  
  if(isLogged){
    redirect("/intranet")
  }
  
  // If storedToken is null, fallback to an empty string
}, [isLogged]);

useEffect(()=>{
setToken(localStorage.getItem("token") ?? "")
},[token])
  async function login() {
    const credentials = { username: username, password: password };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/intranet/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(credentials),
        }
      );

      if (response.status === 200) {
        const res = await response.json();
        localStorage.setItem("account_id", res.account_id);
       
     setLog(true);
        
      } else {
        const res = await response.json();
        setError(res.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Invalid Credentials");
    }
  }

  async function getToken() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ un: username, password: password }),
      });

      if (response.ok) {
        const token = await response.json();
        localStorage.setItem("token", token.access);
      
          login();

      } else {
       
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      setError("Error fetching token");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    getToken();
  };

  return (
    <div className="main-div">
      <div className="login-div">
        <Image
          style={{ height: "75px" }}
          src="/img/Sos.png"
          alt="Staff Outsourcing Logo"
          height={100}
          width={100}
        />
        <form className="username" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="inp-lab">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <div style={{ position: "relative", display: "flex" }}>
              <input
                id="password"
                type={password ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <button type="submit" className="button-login">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}