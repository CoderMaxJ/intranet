"use client";
import { Tooltip } from 'bootstrap';
import Logout from "../Logout/logout";
import Updatepassword from "../Updatepassword/updatepassword";
import { use, useEffect, useState } from "react";
import { IdentifyUser } from "../user_identifier";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Decryptor } from "@/security";

declare global {
    interface Window {
        bootstrap: any;
    }
}

export default function Dashboard() {
    const router = useRouter();
    const [user_privilege, setUserPrivilege] = useState([""]);
    const [accordionIconn, setAccordionIconn] = useState(false);
    const [logout, setLogout] = useState(false);
    const [upload, setUpload] = useState(false);
    const [profile, setProfile] = useState(null)
    const [open, setOpen] = useState(false);
    const [navWidth, setNavWidth] = useState(false);
    const [showDashboard, setShowDashboard] = useState(true);
    const [showReports, setShowReports] = useState(true);
    const [showManage, setShowManage] = useState(true);
    const [showUpdatepassword, setShowUpdatepassword] = useState(true);
    const [showLogout, setShowLogout] = useState(true);
    const [showImage, setShowImage] = useState(true);
    const [showIcon, setShowIcon] = useState(true);
    const [arrowIcon, setArrowIcon] = useState(true);
    const [showProfile, setShowProfile] = useState(true);
    const [showAccounts, setShowAccounts] = useState(true);
    const [showEmployee, setShowEmployee] = useState(true);
    const [showProfileLabel, setShowProfileLabel] = useState(true);
    const [showPoweredby, setShowPoweredby] = useState(true);
    const [showEcomia, setShowEcomia] = useState(true);
    const [cameraHover, setCameraHover] = useState(true);
    const [accountsMenu, setAccountsMenu] = useState(true);
    const [manageMenu, setManageMenu] = useState(true);
    const [activeMenu, setActiveMenu] = useState("");
    const [activeNav, setActiveNav] = useState("");
    const [shiftAdjustment, setShiftAdjustment] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [isAccountManager, setIsAccountManager] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isSupervisor, setIsSupervisor] = useState(false);

    useEffect(() => {
        const storedTab = localStorage.getItem("active_tab") || "1";
        setActiveNav(storedTab);
        setShowEmployee(true);
    }, []);

    useEffect(() => {
        if (["4", "5", "6"].includes(activeNav)) {
            setActiveMenu("manage");
            setAccordionIconn(true);
        }
    }, [activeNav]);

    const navigateTo = (path: string, tabId: string) => {
        setActiveNav(tabId);
        localStorage.setItem("active_tab", tabId);
        router.push(path);

        if (["4", "5", "6"].includes(tabId)) {
            setActiveMenu("manage");
            setAccordionIconn(true);
        } else {
            setActiveMenu("");
            setAccordionIconn(false);
        }
    };

    const handleSetActiveMenu = (menuName: string) => {
        setActiveMenu(menuName);
    };

    useEffect(() => {
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfile(savedImage);
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/");
        } else {
            setToken(storedToken);
        }
    }, []);

    const user_hash_privilege = localStorage.getItem("user_privilege");
    useEffect(() => {
        if (user_hash_privilege) {
            console.log("Role: Superadmin", user_hash_privilege);
            const array_privilege = IdentifyUser(user_hash_privilege);
            const allPrivileges = [
                "manage_users",
                "view_reports",
                "create_account",
                "view_workforce",
                "update_breaktool_account",
                "view_multiple_accounts"
            ];
            const user_privilege = [...array_privilege];

            const hasOnlyAccountManager =
                array_privilege.length === 2 &&
                array_privilege.includes("view_workforce") &&
                array_privilege.includes("update_breaktool_account");

            const hasOnlySupervisor =
                array_privilege.includes("view_reports") &&
                array_privilege.includes("view_multiple_accounts");

            const isSuperAdmin =
                allPrivileges.every(priv => array_privilege.includes(priv));



            if (hasOnlyAccountManager) {
                setIsAccountManager(true);
                console.log("Role: account_manager");
            }
            if (isSuperAdmin) {
                setIsSuperAdmin(true);
                console.log("Role: superadmin");
            }
            if (hasOnlySupervisor) {
                setIsSupervisor(true);
                console.log("Role: supervisor");
            }
        }
    }, []);

    const profileImg = localStorage.getItem("profileImage")
    const user_id = localStorage.getItem("user_id");
    const handleLogout = () => {
        const deleteToken = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/logout/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Decryptor(token || "")}`,
                },
                body: JSON.stringify({ user_id: Decryptor(user_id || "") }),
            });
            if (response.status === 200) {
                localStorage.clear();

                router.push("/")
            } else {
                console.error("Logout failed");
            }
        }
        deleteToken();

        if (profileImg) {
            localStorage.setItem("profileImage", profileImg)
        }
    }
    const toggleinput = () => {
        if (upload == false) {
            setUpload(true)
        } else {
            setUpload(false);
        }
    }
    const handleImageUpload = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                localStorage.setItem("profileImage", base64String);
                setProfile(base64String);
                setUpload(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const getTooltipProps = (label: string) => {
        return !navWidth
            ? {
                "data-bs-toggle": "tooltip",
                "data-bs-placement": "right",
                title: label,
            }
            : {};
    };


    const openClose = () => {
        if (open == false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }

    const routerPush = (path: string) => {
        router.push(path);
    }

    useEffect(() => {
        const isMinimized = localStorage.getItem("sidebarMinimized") === "true";
        if (!isMinimized) {
            setNavWidth(true);
            setShowDashboard(true);
            setShowUpdatepassword(true);
            setShowImage(true);
            setShowReports(true);
            setShowManage(true);
            setShowLogout(true);
            setShowIcon(true);
            setArrowIcon(true);
            setShowProfile(true);
            setShowAccounts(true);
            setShowEmployee(true);
            setShowProfileLabel(true);
            setShowEcomia(true);
            setShowPoweredby(true);
            setShiftAdjustment(true);
            localStorage.setItem("sidebarMinimized", "false");
            document.getElementById("dashboard-menu")?.classList.add("is-minimize");
        } else {
            setNavWidth(false);
            setShowDashboard(false);
            setShowUpdatepassword(false);
            setShowImage(false);
            setShowReports(false);
            setShowManage(false);
            setShowLogout(false);
            setShowIcon(false);
            setArrowIcon(false);
            setShowProfile(false);
            setShowAccounts(false);
            setShowEmployee(false);
            setShowProfileLabel(false);
            setShowEcomia(false);
            setShowPoweredby(false);
            setShiftAdjustment(false);
            localStorage.setItem("sidebarMinimized", "true");
            document.getElementById("dashboard-menu")?.classList.remove("is-minimize");
        }
    }, []);

    const toggleMinimizeMaximize = () => {
        const isMinimized = localStorage.getItem("sidebarMinimized") === "true";
        if (isMinimized) {
            setNavWidth(true);
            setShowDashboard(true);
            setShowUpdatepassword(true);
            setShowImage(true);
            setShowReports(true);
            setShowManage(true);
            setShowLogout(true);
            setShowIcon(true);
            setArrowIcon(true);
            setShowProfile(true);
            setShowAccounts(true);
            setShowEmployee(true);
            setShowProfileLabel(true);
            setShowEcomia(true);
            setShowPoweredby(true);
            setShiftAdjustment(true);
            localStorage.setItem("sidebarMinimized", "false");
            document.getElementById("dashboard-menu")?.classList.add("is-minimize");
        } else {
            setNavWidth(false);
            setShowDashboard(false);
            setShowUpdatepassword(false);
            setShowImage(false);
            setShowReports(false);
            setShowManage(false);
            setShowLogout(false);
            setShowIcon(false);
            setArrowIcon(false);
            setShowProfile(false);
            setShowAccounts(false);
            setShowEmployee(false);
            setShowProfileLabel(false);
            setShowEcomia(false);
            setShowPoweredby(false);
            setShiftAdjustment(false);
            localStorage.setItem("sidebarMinimized", "true");
            document.getElementById("dashboard-menu")?.classList.remove("is-minimize");
        }
    };

    return (
        <>
            <Updatepassword />
            <Logout />
            <div className="db "
            >
                <div className="navigation-division">
                    {showImage === true && (
                        <div className="justify-content-center" style={{ display: 'grid', alignItems: 'center' }}>
                            <img src="/img/sooos.png" height={60} />
                        </div>
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div
                        className={`generate ${activeNav === "1" ? "active-tab" : "hover-enabled"}`}
                        onClick={() => navigateTo("/WorkforceMonitoring", "1")}
                        style={{ backgroundColor: activeNav === "1" ? "#0a85ed" : "" }}
                    >
                        <button id="dashboard" className={`nav-font ${navWidth ? 'hide-icon-name' : 'show-icon-name'}`}
                        >
                            <img
                                src="/svg/dashboard.svg"
                                alt="dashboard"
                                className="dashboard-img"
                                height={20}
                                style={{
                                    filter: localStorage.getItem("active_tab") === "1" ? "brightness(0) invert(1)" : "",
                                }}
                            />
                            {showDashboard && (
                                <label
                                    className="dash"
                                    htmlFor="dashboardd"
                                    style={{
                                        color: localStorage.getItem("active_tab") === "1" ? "#ffffff" : "",
                                    }}
                                >
                                    Dashboard
                                </label>
                            )}
                        </button>
                    </div>
                    <div
                        className={`generate ${activeNav === "2" ? "active-tab" : "hover-enabled"}`}
                        onClick={() => navigateTo("/Reports", "2")}
                        style={{
                            backgroundColor: activeNav === "2" ? "#0a85ed" : "",
                        }}
                    >
                        <a className="nav-font" style={{ color: localStorage.getItem("active_tab") === "2" ? "#ffffff" : "" }}>
                            <img
                                src="/svg/reports.svg"
                                alt="reports"
                                className="reports-img"
                                height={20}
                                style={{
                                    filter: localStorage.getItem("active_tab") === "2" ? "brightness(0) invert(1)" : "",
                                }}
                            />
                            {showReports && (
                                <label htmlFor="label" className="reps" style={{ color: localStorage.getItem("active_tab") === "2" ? "#ffffff" : "" }}>
                                    Reports
                                </label>
                            )}
                        </a>
                    </div>
                    <div>
                        <div className={`generate ${activeNav === "3" ? "active-tab" : "hover-unable"}`}
                            onClick={() => navigateTo("/Schedule", "3")}
                            style={{ backgroundColor: localStorage.getItem("active_tab") === "3" ? "#0a85ed" : "" }}>

                            <a className="nav-font " style={{ color: localStorage.getItem("active_tab") === "3" ? "#ffffff" : "" }}>
                                <img src="/svg/schedule.svg" alt="schedule" className="schedule-img" height={20} style={{
                                    filter: localStorage.getItem("active_tab") === "3" ? "brightness(0) invert(1)" : "",
                                }} />
                                {showReports === true && (
                                    <label htmlFor="label" className="sched" style={{ color: localStorage.getItem("active_tab") === "3" ? "#ffffff" : "" }}>
                                        Schedule
                                    </label>
                                )}
                            </a>
                        </div>
                    </div>
                    <div className="accordion-item accordion" >
                        <div className="manage-div">
                            <div className={`manage-menus d-flex justify-content-between align-items-center ${["4", "5", "6"].includes(activeNav) ? "active-tab" : "hover-unable"}`}

                                onClick={() => {
                                    const isOpen = activeMenu === "manage";
                                    if (isOpen) {
                                        setActiveMenu("");
                                        setAccordionIconn(false);
                                    } else {
                                        setActiveMenu("manage");
                                        setAccordionIconn(true);
                                    }
                                }}
                                style={{ cursor: "pointer" }}>
                                <div className="manage-nav">
                                    <img src="/svg/manage.svg" alt="manage" className="manage-img" height={20} />
                                    <span className="manage-label" style={{
                                        opacity: navWidth ? 1 : 0,
                                        width: navWidth ? 'auto' : 0,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        transition: 'opacity 0.2s ease, width 0.2s ease'
                                    }}>
                                        Manage
                                    </span>
                                </div>
                                <div
                                >
                                    {showIcon && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            className={`arrow-accordion bi bi-chevron-up text-dark ${accordionIconn ? "" : "rotate-acc-icon"}`}

                                            viewBox="0 0 16 16"
                                            style={{ color: '#ffffff' }}
                                        >
                                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div
                                id="panelsStayOpen-collapseOne"
                                className={`collapse ${activeMenu === "manage" ? "show" : ""}`}

                                aria-labelledby="panelsStayOpen-headingOne"
                                style={isAccountManager ? {} : { marginTop: "-25px" }}
                            >
                                <div className="undermanage-hover">
                                    {isSuperAdmin && (
                                        <div className="manage-anchor">

                                            <a
                                                className="nav-font"
                                                onClick={() => navigateTo("/ManageAccount", "4")}
                                                style={{
                                                    backgroundColor: localStorage.getItem("active_tab") === "4" ? "#0a85ed" : "",
                                                    color: localStorage.getItem("active_tab") === "4" ? "white" : "",
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    className={`circle-indicator ${activeNav === "4" ? "active" : ""}`}
                                                >
                                                    <circle
                                                        cx="9"
                                                        cy="9"
                                                        r="7"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        fill="none"
                                                    />
                                                </svg>
                                                {showAccounts && (
                                                    <label
                                                        className="acc-label"
                                                        htmlFor="label"
                                                        style={{ color: localStorage.getItem("active_tab") === "4" ? "white" : "" }}
                                                    >
                                                        Accounts
                                                    </label>
                                                )}
                                            </a>
                                        </div>
                                    )}
                                    <div className="undermanage-hover">
                                        <div className="employee-anchor">
                                            <a
                                                className="nav-font"
                                                onClick={() => navigateTo("/ManageEmployee", "5")}
                                                style={{
                                                    backgroundColor: localStorage.getItem("active_tab") === "5" ? "#0a85ed" : "",
                                                    color: localStorage.getItem("active_tab") === "5" ? "white" : "",
                                                    margin: (isAccountManager || isSupervisor) ? "25px 0 15px 0" : "0"
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    className={`circle-indicator ${activeNav === "5" ? "active" : ""}`}
                                                >
                                                    <circle
                                                        cx="9"
                                                        cy="9"
                                                        r="7"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        fill="none"
                                                    />
                                                </svg>
                                                {showEmployee && (
                                                    <label
                                                        className="emp-label"
                                                        htmlFor="employee"
                                                        style={{ color: localStorage.getItem("active_tab") === "5" ? "white" : "" }}
                                                    >
                                                        Employee
                                                    </label>
                                                )}
                                            </a>
                                        </div>
                                        <div className="employee-anchor">
                                            <a
                                                className="nav-font"
                                                onClick={() => navigateTo("/ShiftAdjustment", "6")}
                                                style={{
                                                    backgroundColor: localStorage.getItem("active_tab") === "6" ? "#0a85ed" : "",
                                                    color: localStorage.getItem("active_tab") === "6" ? "white" : "",
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    className={`circle-indicator ${activeNav === "6" ? "active" : ""}`}
                                                >
                                                    <circle
                                                        cx="9"
                                                        cy="9"
                                                        r="7"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        fill="none"
                                                    />
                                                </svg>
                                                {shiftAdjustment && (
                                                    <label
                                                        className="emp-label"
                                                        htmlFor="employee"
                                                        style={{ color: localStorage.getItem("active_tab") === "6" ? "white" : "" }}
                                                    >
                                                        Adjustment
                                                    </label>
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="manage-menu accordion-item">
                            <div
                                style={{
                                    borderRadius: '2px',
                                }}
                            >
                                <div
                                    className="prof-hover d-flex justify-content-between"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOnee"
                                    aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseOnee"
                                    style={{ color: '#ffffff' }}
                                >
                                    <div>
                                    </div>
                                </div>
                                <div
                                >
                                </div>
                                <div className="updatepassword-hover">
                                    <div className="accordion-body"
                                    >
                                        <div id="dashboard" className={`nav-fontt ${navWidth ? 'hide-icon-name' : 'show-icon-name'}`} data-bs-toggle="modal" data-bs-target="#updatePasswordModal"
                                        >
                                            <img src="/svg/updatepassword.svg" alt="updatepassword" className="updatepassword-img" height={20} />
                                            {showUpdatepassword === true && (
                                                <span className="updatep">Update password</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="logout-hover"
                                    data-bs-toggle="modal"
                                    data-bs-target="#logoutModal"
                                >
                                    <div
                                        id="dashboard"
                                        className={`nav-fonttt d-flex ${navWidth ? 'hide-icon-name' : 'show-icon-name'}`}
                                    >
                                        <img src="/svg/logout.svg" alt="logout" className="logout-img" height={20} />
                                        {showLogout === true && (
                                            <span className="logoutbutton">Log Out</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
                <div >
                    <hr className="border-dark border-2 " />
                    <div className="upload-prof">
                        <button
                            onClick={toggleMinimizeMaximize}
                            className="arrow-btn btn bg-primary"
                        >
                            <span
                                className={`transition-icon ${arrowIcon ? 'rotate-left' : 'rotate-right'}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    fill="white"
                                    className="arrow-img bi bi-chevron-left"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                                    />
                                </svg>
                            </span>
                        </button>
                        {open && (
                            <img
                                onClick={() => setOpen(false)}
                                src={profile}
                                alt="Enlarged Profile"
                                className=""
                                height={200}
                                width={200}
                                style={{ borderRadius: "50%", marginTop: "150px" }}
                            />
                        )}
                        <center>
                            {open === false && showProfile === true && (
                                <div className="profile-div position-relative">
                                    {/* <div className="dot-div position-absolute">
                                        <svg onClick={toggleinput} xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-camera-fill text-light" viewBox="0 0 16 16">
                                            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
                                        </svg>
                                    </div> */}
                                    {/* {upload === true && (
                                        <div>
                                            <input className="input-image" type="file" accept="image/*" onChange={handleImageUpload} />
                                        </div>
                                    )} */}
                                    <div className="profile-circle">
                                        {profile ? (
                                            <img onClick={openClose} className="profile-picture" src={profile} alt="" height={70} width={70} />
                                        ) : (<p className="username-label-profile">{localStorage.getItem("name")?.charAt(0)}</p>)}
                                    </div>
                                </div>
                            )}
                        </center>
                    </div>
                </div>
                <div className="ecomia-footer">
                    <div>{showEcomia === true && (<label htmlFor="poweredby" className="db-poweredby">powered by</label>)}</div>
                    <div>{showPoweredby === true && (<img src="/img/eComialogo.png" className="ecomia-db-logo" height={20} />)}</div>
                </div>
            </div>
        </>
    );
}
