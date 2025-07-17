"use client";
import { Encryptor } from "@/security";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../component/LoadSpinner/spinner";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLogged, setLog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isloading, setLoading] = useState(false);
    const [errorTimeoutId, setErrorTimeoutId] = useState<NodeJS.Timeout | null>(null);

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
            const res = await response.json();
            if (response.status === 200) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("token", Encryptor(res.token));
                    localStorage.setItem("user_id", Encryptor(res.user_id.toString()));
                    localStorage.setItem("user_privilege", Encryptor(res.user_privilege.toString()));
                    localStorage.setItem("user_name", Encryptor(res.user_name.toString()));
                    localStorage.setItem("name", res.name);
                    localStorage.setItem("position", res.position);
                    localStorage.setItem("account_id", Encryptor(res.account_id.toString()));
                    localStorage.setItem("status", "login");
                    localStorage.setItem("account_id_list", Encryptor(res.account_id_list.toString()));
                    localStorage.setItem("active_tab", "1");
                }
                setLog(true);
            } else if (response.status === 401 || response.status === 403) {
                if (errorTimeoutId) {
                    clearTimeout(errorTimeoutId);
                }
                setError(res.warning);
                const timeout = setTimeout(() => {
                    setError("");
                    setErrorTimeoutId(null);
                }, 2000);

                setErrorTimeoutId(timeout);
                setLoading(false);
            }

        } catch {
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        login();
    };

    return (
        <div className="main-div">
            {!isloading ? (
                <div className="login-div">
                    <div>
                        <Image
                            className="login-logo"
                            src="/img/soslogo.webp"
                            alt="Staff Outsourcing Logo"
                            height={16}
                            width={200}
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
                                    {showPassword ? (<Image src="/svg/eye.svg" alt="eye-crossed" className="gray-icon"
                                        height={16} width={16} />
                                    ) : (<Image src="/svg/eye-crossed.svg" alt="eye-crossed" className="gray-icon"
                                        height={16} width={16} />
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
                        <Image
                            className="ecomialogo"
                            src="/img/poweredbyecomia.webp"
                            alt="Staff Outsourcing Logo"
                            height={25}
                            width={100}
                        />
                    </div>
                </div>
            ) : (<LoadingSpinner />)}
        </div>
    );
}
