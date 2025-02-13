"use client";
import { Encryptor, Decryptor } from "@/security";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "/public/asset/css/login.css";
import Image from "next/image";



export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogged, setLog] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== "undefined" ) {
      const token = localStorage.getItem("token");
      if (token) {
        setLog(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLogged) {
      router.push("/intranet");
    }
  }, [isLogged, router]);


  async function login() {
    const credentials = { username, password };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/intranet/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`,
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        const res = await response.json();
        console.log("asdsdsd")
       console.log(res.user_privilege);
        localStorage.setItem("user_id", Encryptor(res.user_id.toString()));
        localStorage.setItem("user_privilege", Encryptor(res.user_privilege.toString()));
        localStorage.setItem("user_name", Encryptor(res.user_name.toString()));
        setLog(true);
      } else {
        const res = await response.json();
        setError(res.message || "Login failed. Please try again.");
        setError("Invalid Credentials");
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
        body: JSON.stringify({ un: username, password }),
      });

      if (response.ok) {
        const token = await response.json();
        localStorage.setItem("token", Encryptor(token.access));
        localStorage.setItem("refresh_token", Encryptor(token.access));
        login();
      } else {
        console.log("sdsd")
        setError("Invalid Credentials");
        setError("Invalid Credentials");
     
      }
    } catch (error) {
      setError("Error fetching token");
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    getToken();
  };

  return (
    <div className="main-div">
      <div className="login-div">
        <img
          src="/img/Sos.png"
          alt="Staff Outsourcing Logo"
          height={70}
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
