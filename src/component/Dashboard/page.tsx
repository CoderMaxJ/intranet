"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logout from "../Logout/logout";
import Password from "../Updatepassword/updatepassword";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { getUserPrivilege } from "@/services/UserPrivileges/userPrivileges";

declare global {
    interface Window {
        bootstrap: unknown;
    }
}

export default function Dashboard() {
    const [accordionIconn, setAccordionIconn] = useState(false);
    const [profile,] = useState(null)
    const [open, setOpen] = useState(false);
    const [navWidth, setNavWidth] = useState(false);
    const [showDashboard, setShowDashboard] = useState(true);
    const [showReports, setShowReports] = useState(true);
    const [, setShowManage] = useState(true);
    const [showUpdatepassword, setShowUpdatepassword] = useState(true);
    const [showLogout, setShowLogout] = useState(true);
    const [showImage, setShowImage] = useState(true);
    const [showIcon, setShowIcon] = useState(true);
    const [arrowIcon, setArrowIcon] = useState(true);
    const [showProfile, setShowProfile] = useState(true);
    const [showAccounts, setShowAccounts] = useState(true);
    const [showEmployee, setShowEmployee] = useState(true);
    const [, setShowProfileLabel] = useState(true);
    const [showPoweredby, setShowPoweredby] = useState(true);
    const [showEcomia, setShowEcomia] = useState(true);
    const [activeMenu, setActiveMenu] = useState("");
    const [activeNav, setActiveNav] = useState("");
    const [shiftAdjustment, setShiftAdjustment] = useState(true);

    const router = useRouter();
    const user_privilege = getUserPrivilege();

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

    const openClose = () => {
        setOpen(prev => !prev);
    };

    const applySidebarState = (isMinimized: boolean) => {
        const visible = !isMinimized;
        setNavWidth(visible);
        setShowDashboard(visible);
        setShowUpdatepassword(visible);
        setShowImage(visible);
        setShowReports(visible);
        setShowManage(visible);
        setShowLogout(visible);
        setShowIcon(visible);
        setArrowIcon(visible);
        setShowProfile(visible);
        setShowAccounts(visible);
        setShowEmployee(visible);
        setShowProfileLabel?.(visible);
        setShowEcomia(visible);
        setShowPoweredby(visible);
        setShiftAdjustment(visible);
        localStorage.setItem("sidebarMinimized", isMinimized.toString());

        const menu = document.getElementById("dashboard-menu");
        if (visible) menu?.classList.add("is-minimize");
        else menu?.classList.remove("is-minimize");
    };

    useEffect(() => {
            const isMinimized = localStorage.getItem("sidebarMinimized") === "true";
            applySidebarState(isMinimized);
    }, []);

    const toggleMinimizeMaximize = () => {
        const isMinimized = localStorage.getItem("sidebarMinimized") === "true";
        applySidebarState(!isMinimized);
    };

    return (
        <div>
            <Password />
            <Logout />
            <div
                className="db"
            >
                <div className="navigation-division">
                    {showImage === true && (
                        <div className="justify-content-center" style={{ display: 'grid', alignItems: 'center' }}>
                            <Image src="/img/Sos.png" alt="sos logo" height={50} width={200} />
                            <hr />
                        </div>
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div
                        className={`generate ${activeNav === "1" ? "active-tab" : "hover-enabled"}`}
                        onClick={() => navigateTo("/WorkforceMonitoring", "1")}
                        style={{ backgroundColor: activeNav === "1" ? "#0a85ed" : "" }}
                    >
                        <button id="dashboard" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Tooltip on right" className={`nav-font ${navWidth ? 'hide-icon-name' : 'show-icon-name'}`}
                        >
                            <Image
                                src="/svg/dashboard.svg"
                                alt="dashboard"
                                className="dashboard-img mb-1"
                                height={17}
                                width={17}
                                style={{
                                    filter: activeNav === "1" ? "brightness(0) invert(1)" : ""
                                    ,
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
                    {(user_privilege.includes("manage_users") || user_privilege.includes("view_multiple_accounts") || user_privilege.includes("update_breaktool_account")) && (
                        <div>
                            <div
                                className={`generate ${activeNav === "2" ? "active-tab" : "hover-enabled"}`}
                                onClick={() => navigateTo("/Reports", "2")}
                                style={{
                                    backgroundColor: activeNav === "2" ? "#0a85ed" : "",
                                }}
                            >

                                <a className="nav-font" style={{ color: localStorage.getItem("active_tab") === "2" ? "#ffffff" : "" }}>
                                    <Image
                                        src="/svg/reports.svg"
                                        alt="reports"
                                        className="reports-img mb-1"
                                        height={17}
                                        width={17}
                                        style={{
                                            filter: activeNav === "2" ? "brightness(0) invert(1)" : ""
                                        }}
                                    />
                                    {showReports && (
                                        <label htmlFor="label" className="reps" style={{ color: activeNav === "2" ? "#ffffff" : "" }}
                                        >
                                            Reports
                                        </label>
                                    )}
                                </a>
                            </div>
                            <div>
                                <div className={`generate ${activeNav === "3" ? "active-tab" : "hover-unable"}`}
                                    onClick={() => navigateTo("/Schedule", "3")}
                                    style={{ backgroundColor: activeNav === "3" ? "#0a85ed" : "" }}>

                                    <a className="nav-font" style={{ color: localStorage.getItem("active_tab") === "3" ? "#ffffff" : "" }}>
                                        <Image src="/svg/schedule.svg" alt="schedule" className="schedule-img mb-1" height={17} width={17} style={{
                                            filter: activeNav === "3" ? "brightness(0) invert(1)" : ""
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
                                    <div className={`manage-menus d-flex justify-content-between align-items-center ${["4", "5", "6"].includes(activeNav) ? "active-tab" : "hover-unable"} ${navWidth ? "" : "minimized-border"}`}

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
                                            <Image src="/svg/manage.svg" alt="manage" className="manage-img mb-1" height={18} width={18} />
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
                                    >
                                        <div className="undermanage-hover">
                                            {user_privilege.includes("manage_users") && (


                                                <div className="manage-anchor">
                                                    <a
                                                        className="nav-font"
                                                        onClick={() => navigateTo("/Account", "4")}
                                                        style={{
                                                            backgroundColor: activeNav === "4" ? "#0a85ed" : "",
                                                            color: activeNav === "4" ? "#ffffff" : "",
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
                                                                style={{ color: activeNav === "4" ? "#ffffff" : "" }}
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
                                                        onClick={() => navigateTo("/Employee", "5")}
                                                        style={{
                                                            backgroundColor: activeNav === "5" ? "#0a85ed" : "",
                                                            color: activeNav === "5" ? "#ffffff" : "",
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
                                                            backgroundColor: activeNav === "6" ? "#0a85ed" : "",
                                                            color: activeNav === "6" ? "#ffffff" : "",
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
                        </div>
                    )}
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
                                            <Image src="/svg/updatepassword.svg" alt="updatepassword" className="updatepassword-img mb-1" height={17} width={17} />
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
                                        <Image src="/svg/logout.svg" alt="logout" className="logout-img mb-1" height={17} width={17} />
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
                    <hr />
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
                                    width="20"
                                    height="20"
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
                        <center>
                            {open === false && showProfile === true && (
                                <div className="profile-div position-relative">
                                    <div className="profile-circle">
                                        {profile ? (
                                            <Image onClick={openClose} className="profile-picture" src={profile} alt="profile" height={70} width={70} />
                                        ) : (<p className="username-label-profile">{localStorage.getItem("name")?.charAt(0)}</p>)}
                                    </div>
                                </div>
                            )}
                        </center>
                    </div>
                </div>
                <div className="ecomia-footer">
                    <div>{showEcomia === true && (<label htmlFor="poweredby" className="db-poweredby">powered by</label>)}</div>
                    <div>{showPoweredby === true && (<Image src="/img/eComialogo.png" alt="ecomia logo" className="ecomia-db-logo" height={25} width={72} />)}</div>
                </div>
            </div>
        </div>
    );
}
