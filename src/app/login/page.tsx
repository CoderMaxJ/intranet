"use client";
import { Encryptor } from "@/security";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoadingSpinner from "../../component/LoadSpinner/spinner";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLogged, setLog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isloading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLogged) {
            router.push("/WorkforceMonitoring");
        }
    }, [isLogged, router]);

    async function login() {
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
                const data = await response.json();

                const  {token,user_id,user_privilege,user_name,name,position,account_id,account_id_list} = data;
                localStorage.setItem("token", Encryptor(token));
                localStorage.setItem("user_id", Encryptor(user_id.toString()));
                localStorage.setItem("user_privilege", Encryptor(user_privilege.toString()));
                localStorage.setItem("user_name", Encryptor(user_name.toString()));
                localStorage.setItem("name", name);
                localStorage.setItem("position", position);
                localStorage.setItem("account_id", Encryptor(account_id.toString()));
                localStorage.setItem("status", "login"),
                    localStorage.setItem("account_id_list", Encryptor(account_id_list.toString()));
                localStorage.setItem("active_tab", "1");
                setLog(true);
            } else if (response.status === 401) {
                const message = await response.json();
                setError(message.warning);
                setTimeout(() => {
                    setError("");
                }, 2000);
                setLoading(false);
            } else if(response.status === 403) {
                const message = await response.json();
                setError(message.warning);
                setTimeout(() => {
                    setError("");
                }, 2000);
                setLoading(false);
            }
        } catch {
        }
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        login();
    };

    return (
        <div className="main-div">
            {isloading != true ? (
                <div className="login-div">
                    <div>
                        <img
                            className="login-logo"
                            src="/img/soslogo.webp"
                            alt="Staff Outsourcing Logo"
                        />
                    </div>
                    <form className="username" onSubmit={handleSubmit}>
                        {error && <div className="error-message1">{error}</div>}
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
                            <button type="submit" className="button-login mb-5">
                                <span className="view">Log in</span>
                            </button>
                        </div>
                    </form>
                    <div className="ecomialogo-footer d-flex flex-column align-items-center">

                        <label className="poweredby-label" htmlFor="poweredby"><span className="view">powered by</span></label>
                        <img
                            className="ecomialogo"
                            src="/img/poweredbyecomia.webp"
                            alt="Staff Outsourcing Logo"
                        />
                    </div>
                </div>
            ) : (<LoadingSpinner />)}
        </div>
    );
}
