"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "/public/asset/css/updateps.css";
import Link from "next/link";
import Image from "next/image";
import Daterange from "../Generatereport/Daterange";

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

  // const triggerLogout = () => {
  //   router.push("/");
  //   localStorage.clear();
  // };

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

        // console.log(response);

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
          // console.log("Token saved:", token.access);
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
    <div>
      <div>
        <img
          src="/img/Breaktool.png"
          style={{
            marginTop: "-20px",
            width: "90vw",
            height: "15vh",
            marginBottom: "-10px",
            marginLeft: "-61px",
            display: 'relative',
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)"
          }}
        />
        <h1 className="headerbreaktool">WORKFORCE MONITORING</h1>
        <h4 className="headerdown">Connecting Teams, Empowering Innovation</h4>
      </div>
      <Daterange />
    </div>
  );
}
