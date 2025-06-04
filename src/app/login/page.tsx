"use client";
import { Encryptor, Decryptor } from "@/security";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, toast } from 'react-toastify';


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLogged, setLog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

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
                                {showPassword ? (<img src="/svg/eye.svg" alt="eye-crossed" className="gray-icon"
                                    height={16} />
                                ) : (<img src="/svg/eye-crossed.svg" alt="eye-crossed" className="gray-icon"
                                    height={16} />
                                )}
                            </span>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="button-login mb-4">
                            <span className="view">Log in</span>
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
