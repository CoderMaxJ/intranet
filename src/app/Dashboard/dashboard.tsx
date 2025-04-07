"use client";
import Logout from "../Logout/logout";
import Updatepassword from "../Updatepassword/updatepassword";
import { use, useEffect, useState } from "react";
import { IdentifyUser } from "../user_identifier";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Decryptor } from "@/security";


export default function Dashboard() {
    const [user_privilege, setUserPrivilege] = useState([""]);
    const [accordionIconn, setAccordionIconn] = useState(true);
    const [logout, setLogout] = useState(false);
    const [upload, setUpload] = useState(false);
    const [profile, setProfile] = useState(null)
    const [open, setOpen] = useState(false);
    const [navWidth, setNavWidth] = useState("217px");
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
    const [cameraHover, setCameraHover] = useState (true);
    const [accountsMenu, setAccountsMenu] = useState(true);
    const [manageMenu, setManageMenu] = useState(true);


    useEffect(() => {
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfile(savedImage);
        }
    }, []);

    const token = localStorage.getItem("token");
    useEffect(() => {

        if (!token) {
            router.push("/")
        }
    })

    const router = useRouter();
    const user_hash_privilege = localStorage.getItem("user_privilege");
    if (user_hash_privilege) {
        const array_privilege = IdentifyUser(user_hash_privilege);
        array_privilege.forEach((data) => {
            user_privilege.push(data);
        })
    }
    const profileImg = localStorage.getItem("profileImage")
    const handleLogout = () => {
        localStorage.clear();

        if (profileImg) {
            localStorage.setItem("profileImage", profileImg)
        }
        router.push("/")
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

    const toggleMinimizeMaximize = () => {
        const isMinimized = localStorage.getItem("sidebarMinimized") === "true";

        if (isMinimized) {
            setNavWidth("217px");
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
            localStorage.setItem("sidebarMinimized", "false");
            document.getElementById("dashboard-menu")?.classList.add("is-minimize");
        } else {
            setNavWidth("60px");
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
            localStorage.setItem("sidebarMinimized", "true");
            document.getElementById("dashboard-menu")?.classList.remove("is-minimize");
        }
    };
    // Apply the stored state when the component loads
    useEffect(() => {
        const isMinimized = localStorage.getItem("sidebarMinimized") === "true";
        if (isMinimized) {
            setNavWidth("60px");
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
        }
    }, []);

    return (
        <>
            <Updatepassword />
            <Logout />
            <div className="db "
                style={{
                    width: navWidth,
                }}
            >
                {/*  */}
                <div style={{ marginBottom: "30px", marginLeft: '40px', transform: 'translateY(-10px)', overflow: 'hidden' }}>
                    {showImage === true && (
                        <div style={{ display: 'grid', alignItems: 'center' }}>
                            <img src="/img/whitesos.png" height={100} />
                            <label htmlFor="poweredby" className="db-poweredby">powered by</label>
                            <img src="/img/eComiaWhiteLogo.png" height={27} style={{ justifyContent: 'center', transform: 'translateY(-26px) translateX(5px)' }} />
                        </div>
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ marginBottom: '-10px', paddingLeft: '10px' }} className="generate">
                        <button id="dashboard" className={`nav-font ${navWidth === '217px' ? 'hide-icon-name' : 'show-icon-name'}`} onClick={() => routerPush("/WorkforceMonitoring")} style={{ border: "none", background: "transparent", color: '#ffffff' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-grid" viewBox="0 0 16 16" style={{ marginRight: '24px' }}>
                                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
                            </svg>
                            {showDashboard === true && (<label className="dash" htmlFor="dashboardd">Dashboard</label>)}
                        </button>
                    </div>
                    <div className="generate text-dark">
                        <a className="nav-font " onClick={() => routerPush("/Reports")} style={{ color: '#ffffff' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-graph-up"
                                viewBox="0 0 16 16"
                                style={{ marginRight: '24px' }}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"
                                />
                            </svg>
                            {showReports === true && (
                                <label htmlFor="label">Reports</label>
                            )}
                        </a>
                    </div>
                    <div className="accordion-item accordion" style={{ overflow: 'hidden' }}>
                        <div style={{ marginTop: '5px' }}>
                            <div className="manage-menu d-flex justify-content-between align-items-center"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseOne"
                                aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseOne"
                                onClick={(e) => setAccordionIconn(!accordionIconn)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '2px',
                                    color: '#000000',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '19px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" fill="currentColor" className="bi bi-person-gear text-light" viewBox="0 0 16 16" style={{ marginLeft: '-2px' }}>
                                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                                    </svg>
                                    <span className="manage-label" style={{ opacity: navWidth === '217px' ? 1 : 0, width: navWidth === '217px' ? 'auto' : 0, overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 0.2s ease, width 0.2s ease', fontFamily: 'roboto' }}>
                                        Manage
                                    </span>
                                </div>

                                <div>
                                    {showIcon === true && (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-chevron-up ${accordionIconn ? "rotate-acc-icon" : ""}`} viewBox="0 0 16 16" style={{ color: '#ffffff' }}>
                                        <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
                                    </svg>)}
                                </div>
                            </div>


                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne" style={{ marginTop: "-20px" }}>
                                <div className="undermanage-hover accordion-body">
                                    <div>
                                        {user_privilege.includes("manage_users") && (
                                            <a className={`nav-font ${navWidth === '217px' ? 'hide-icon-name' : 'show-icon-name'}`}
                                                onClick={() => routerPush("/ManageAccount")}
                                                style={{
                                                    width: navWidth === '217px' ? '100%' : '2vw',
                                                    marginLeft: '6px',
                                                    color: '#ffffff',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    marginTop: '12px',
                                                    padding: '10px',
                                                    borderRadius: '2px',
                                                    cursor: 'pointer',
                                                    transform: 'translateX(-20px)'
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" fill="white" className="accountss-icon bi bi-person-circle" viewBox="0 0 16 16" style={{ marginRight: '21px', minWidth: '20px', minHeight: '20px', maxWidth: '20px', maxHeight: '20px' }}>
                                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                                </svg>
                                                {showAccounts === true && (
                                                    <label className="acc-label" htmlFor="label">Accounts</label>
                                                )}
                                            </a>
                                        )}
                                    </div>
                                    <div className="undermanage-hover">
                                        <a className={`nav-font ${navWidth === '217px' ? 'hide-icon-name' : 'show-icon-name'}`}
                                            onClick={() => routerPush("/ManageEmployee")}
                                            style={{
                                                borderRadius: "2px", width: navWidth === '217px' ? '100%' : '2vw', marginLeft: "-15px", color: '#ffffff', textDecoration: 'none', padding: '10px', marginBottom: '-13px', marginTop: '5px', display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                            }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="employee-icon bi bi-people" viewBox="0 0 16 16" style={{ marginRight: '21px', minWidth: '20px', minHeight: '20px', maxHeight: '20px', maxWidth: '20px' }}>
                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                            </svg>
                                            {showEmployee === true && (
                                                <label className="emp-label" htmlFor="employee">Employee</label>
                                            )}
                                        </a>
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
                                    <div className="accordion-body user-updatepassword-button"
                                    >
                                        <div id="dashboard" className={`nav-font ${navWidth === '217px' ? 'hide-icon-name' : 'show-icon-name'}`} data-bs-toggle="modal" data-bs-target="#updatePasswordModal"
                                            style={{
                                                textDecoration: 'none',
                                                whiteSpace: 'nowrap',
                                                width: '126%',

                                                cursor: 'pointer',

                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-shield-lock" viewBox="0 0 16 16" style={{ marginRight: '24px' }}>
                                                <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                                                <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415" />
                                            </svg>
                                            {showUpdatepassword === true && (
                                                <label className="nav-font" htmlFor="updatepassword">Update password</label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
                <div >
                </div>
                <div
                    className="logout-hover"
                    onClick={() => setLogout(true)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    style={{ marginTop: '5px', cursor: 'pointer' }}
                >
                    <div
                        id="dashboard"
                        className={`nav-font d-flex ${navWidth === '217px' ? 'hide-icon-name' : 'show-icon-name'}`}
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "#ffffff",
                            alignItems: "center"
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="currentColor"
                            className="bi bi-box-arrow-right"
                            viewBox="0 0 16 16"
                            style={{ marginRight: "23px" }}
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                            />
                            <path
                                fillRule="evenodd"
                                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                            />
                        </svg>
                        {showLogout === true && (
                            <span className="logoutbutton">Log Out</span>
                        )}
                    </div>
                </div>

                <hr className="border-white border-2 " />
                <div className="upload-prof">
                    <button
                        onClick={toggleMinimizeMaximize}
                        className="arrow-btn btn"
                    >
                        <span
                            className={`transition-icon ${arrowIcon ? 'rotate-left' : 'rotate-right'}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
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
                            <div className="profile-div">
                                <div className="dot-div">
                                    <svg onClick={toggleinput}  xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-camera-fill text-light" viewBox="0 0 16 16">
                                        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
                                    </svg>
                                </div>
                                {upload === true && (
                                    <div>
                                        <input className="input-image" type="file" accept="image/*" onChange={handleImageUpload} />
                                    </div>
                                )}
                                <div className="profile-circle">
                                    {profile ? (
                                        <img onClick={openClose} className="profile-picture" src={profile} alt="" height={70} width={70} />
                                    ) : (<p className="username-label-profile">{localStorage.getItem("name")?.charAt(0)}</p>)}
                                </div>
                                <div className="online"></div>
                            </div>
                        )}
                        {profile != null && showProfileLabel === true && (
                            <div>
                                <p className="name">{localStorage.getItem("name")}</p>
                                <p className="name">{localStorage.getItem("position")}</p>
                            </div>
                        )}
                    </center>
                </div>
            </div>
        </>
    );
}
