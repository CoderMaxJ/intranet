"use client";
import { Encryptor, Decryptor } from "@/security";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLogged, setLog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                setLog(true);
            }
        }
    }, []);

    useEffect(() => {

        if (isLogged) {
            setTimeout(() => {
                router.push("/WorkforceMonitoring");
            }
                , 1000);

        }
       
    }, [isLogged, router]);

    const successToast = (msg: string) => toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    async function login() {
        setLoading(true);
        const credentials = { username: username, password: password };
        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/intranet/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });
            if (response.status === 200) {
                const res = await response.json();
                localStorage.setItem("token", Encryptor(res.token));
                localStorage.setItem("user_id", Encryptor(res.user_id.toString()));
                localStorage.setItem("user_privilege", Encryptor(res.user_privilege.toString()));
                localStorage.setItem("user_name", Encryptor(res.user_name.toString()));
                localStorage.setItem("name", res.name);
                localStorage.setItem("position", res.position);
                localStorage.setItem("status", "login")
                localStorage.setItem("active_tab", "1");
                successToast("Login Successful");
                setLog(true);
                setLoading(true);
            } else if (response.status === 403) {
                const message = await response.json();
                setError(message.warning);
                localStorage.clear();
            } else if (response.status === 401) {
                const message = await response.json();
                setError(message.warning);
            }
            else {
                const res = await response.json();

                setError("Invalid Credentials");
            }
        } catch {
            setError("Invalid Credentials");
        }
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        login();
    };

    if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

    return (
        <div className="main-div">
            <ToastContainer />
            <div className="login-div">
                <div>
                    <img
                        className="login-logo"
                        src="/img/Bluesos.png"
                        alt="Staff Outsourcing Logo"
                    />
                </div>
                <form className="username" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="inp-lab">
                        <label htmlFor="username"><span className="view">Username</span></label>
                        <input
                            className="form-control"
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputpassword">
                        <label htmlFor="password"><span className="view">Password</span></label>
                        <div className="inputfields">
                            <input
                                id="password"
                                className="form-control"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="eyetoggle">
                                {showPassword ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
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
                    <div>
                        <button type="submit" className="button-login mb-4
            ">
                            <span className="view">Login</span>
                        </button>

                    </div>
                </form>
                <div className="ecomialogo-footer d-flex flex-column align-items-center">

                    <label className="poweredby-label" htmlFor="poweredby"><span className="view">powered by</span></label>
                    <img
                        className="ecomialogo"
                        src="/img/eComialogo.png"
                        alt="Staff Outsourcing Logo"
                    />
                </div>
            </div>
        </div>

    );

}
