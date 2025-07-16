"use client";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect, useRef } from "react";
import "../../style/breaks.css";
import { Decryptor } from "@/security";
import { useRouter } from "next/navigation"
import { getUserToken } from "@/services/UserToken/authUserToken";
import { getUserPrivilege } from "@/services/UserPrivileges/userPrivileges";

interface BreakData {
  name: string;
  acctname: string;
  start: string;
  end: string;
  duration: number;
  breaktype: string;
  overbreak: number;
}

interface Logs {
  name: string;
  acctname: string;
  login: string;
  brkin1: string;
  brkout1: string;
  ob1: string;
  lunchin: string;
  lunchout: string;
  ob3: string;
  brkin2: string;
  brkout2: string;
  ob2: string;
  logoff: string;
}

function BreakDataTable() {
  const [breaks, setBreaks] = useState<BreakData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const breaksRef = useRef<BreakData[]>([]);
  const [data, setData] = useState<Logs[]>([]);
  const [filter, setFilter] = useState("");
  
  const isRenderRef = useRef(false);

  const token = getUserToken();

  const filteredRows = data?.filter(
    (rows) =>
      rows.name.toLowerCase().includes(filter.toLowerCase())
  );

  const router = useRouter();
  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev);
  };

  useEffect(() => {
  fetchBreakData();
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      isRenderRef.current = false;
     
    } else if (document.visibilityState === 'visible') {
       isRenderRef.current = true
       setTimeout(()=>{
        isRenderRef.current = false;
       },3000)
      
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);

const user_id = localStorage.getItem("user_id");
  const fetchBreakData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/break/list/${Decryptor(user_id || "")}/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(response.status == 401 || response.status === 404){
        alert('Session Expired!')
        localStorage.clear();
        router.push('/');
      }

       const data = await response.json();
      setData(data.log_data);
      const updatedBreaks = (data?.data || []).map((newBreak: BreakData) => ({
        ...newBreak,
        duration: newBreak.duration > 0 ? newBreak.duration : -newBreak.overbreak, 
      }));
      setBreaks(updatedBreaks);
      breaksRef.current = updatedBreaks;
    } catch (error) {
      console.error("Failed to fetch break data:", error);
    }
  };


  useEffect(() => {
    const countdownIntervalId = setInterval(() => {
      setBreaks((prevBreaks) => {
        const updatedBreaks = prevBreaks.map((breakItem) => ({
          ...breakItem,
          duration: breakItem.duration - 1,
        }));
        breaksRef.current = updatedBreaks;
        return updatedBreaks;
      });
    }, 1000);
    return () => clearInterval(countdownIntervalId);
  }, []);


  const status = localStorage.getItem("status");
  const account_id = Decryptor(localStorage.getItem("account_id") || "");
  const account_id_list = Decryptor(localStorage.getItem("account_id_list") || "");
  const array_account_id = account_id_list?.split(',')
 
  const userPrivilege = getUserPrivilege();
 
  async function updateChecker() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/listener/?render=${isRenderRef.current}&user_id=${Decryptor(user_id || "")}&account_id=${account_id}`,{
      method: "GET",
      headers: {
        "Content-type": "application/json"
      }
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data?.account_id === Number(account_id)) {
        fetchBreakData();
      } else if (data.account_id != "NO UPDATE" && array_account_id.includes(data.account_id?.toString())) {
        fetchBreakData();
      } else if (data?.status == "NEW UPDATE" && userPrivilege.includes("manage_users")) {
        fetchBreakData();
      }
    }else if(response.status === 401 || response.status === 404){
      localStorage.clear();
      router.push("/");
    }
  }

  useEffect(() => {
    if (status !== "login") return;
    const fetchIntervalId = setInterval(updateChecker, 3000);
    return () => clearInterval(fetchIntervalId);
  }, []);

  const formatTime = (time: number) => {
    const isNegative = time < 0;
    const absoluteTime = Math.abs(time);
    const hours = Math.floor(absoluteTime / 3600);
    const minutes = Math.floor((absoluteTime % 3600) / 60);
    const seconds = absoluteTime % 60;

    return `${isNegative ? "" : ""}${String(hours).padStart(2, "0")}:${String(
      Math.abs(minutes)
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLogSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredBreaks = breaks.filter(
    (breakItem) =>
      breakItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakItem.breaktype.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workforce px-4">
      <div className={fullscreen ? "breaks-div fullscreen px-4" : "breaks-div px-3"}>
        <div className="d-flex flex-column monitoring-container">
          <div className="breaksheader d-flex flex-wrap align-items-center justify-content-between px-3 gap-2">
            <div className="d-flex align-items-center col-5">
              <h4 className="agent-header mb-0">
                Dashboard
                <span className="text-light small ms-2">({breaks?.length})</span>
              </h4>
            </div>
            <div className="flex-grow-1 d-flex">
              <div className="searchbar-container d-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input
                  className="form-control form-control--search"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="d-flex align-items-center ms-md-3">
              <button
                style={{ border: "none", background: "none" }}
                onClick={toggleFullscreen}
                title={fullscreen ? "Compress" : "Fullscreen"}
              >
                {fullscreen ? (
                  <div className="compress d-flex align-items-center gap-2">
                    <img src="/svg/compress.svg" alt="fullscreen" className="icon-circlee" height={30} />
                    <span className="text-light fw-semibold">Compress</span>
                  </div>
                ) : (
                  <div className="fullscreen d-flex align-items-center gap-2">
                    <img src="/svg/fullscreen.svg" alt="fullscreen" className="icon-circle" height={30} />
                    <span className="text-light fw-semibold">Full screen</span>
                  </div>
                )}
              </button>
            </div>
          </div>
          <div className="table-responsive breaks-table">
            <table className="tabbreaks table table-bordered" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  {userPrivilege.includes("manage_users") && <th>Account</th>}
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredBreaks
                  .sort((a, b) => {
                    if (a.duration < 300 && b.duration >= 300) return -1;
                    if (a.duration >= 300 && b.duration < 300) return 1;
                    const breakOrder = {
                      "First Break": 1,
                      "Second Break": 2,
                      "Lunch": 3
                    };
                    return breakOrder[a.breaktype as keyof typeof breakOrder] - breakOrder[b.breaktype as keyof typeof breakOrder];
                  })
                  .map((instance) => (
                    <tr
                      style={{
                        backgroundColor:
                          instance.duration
                            ? instance.breaktype === "First Break"
                              ? "#ffffb7"
                              : instance.breaktype === "Second Break"
                                ? "#FFEDA6"
                                : instance.breaktype === "Lunch"
                                  ? "#A9E4FF"
                                  : ""
                            : "",
                      }}
                      key={instance.name}
                    >
                      <td style={{ backgroundColor: "inherit" }} className={instance.duration < 300 ? "blink-background" : ""}>
                        {instance.name}
                      </td>
                      {userPrivilege.includes("manage_users") && <td style={{ backgroundColor: "inherit" }} className={instance.duration < 300 ? "blink-background" : ""}>{instance.acctname}</td>}
                      <td style={{ backgroundColor: "inherit" }} className={instance.duration < 300 ? "blink-background" : ""}>
                        {instance.start}
                      </td>
                      <td style={{ backgroundColor: "inherit" }} className={instance.duration < 300 ? "blink-background" : ""}>
                        {instance.end}
                      </td>
                      <td
                        style={{
                          backgroundColor: "inherit",
                          color: instance.duration < 0 ? "#be1243 " : "",
                          fontWeight: instance.duration < 0 ? "bold" : "",
                        }}
                        className={instance.duration < 300 ? "blink-background" : ""}
                      >
                        {formatTime(instance.duration)}
                      </td>
                      <td style={{ backgroundColor: "inherit" }} className={instance.duration < 300 ? "blink-background" : ""}>
                        {instance.breaktype}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="logs-wrapper mt-4">
        <div className="logs-maindiv px-3">
          <div className="agentheader-container gap-2 d-flex flex-wrap flex-direction-row align-items-center">
            <div className="align-items-center col-5 py-3">
              <h3 className="logs-headername text-light px-3">
                Logs Today
                <span className="text-light small ms-2">
                  ({data?.length})
                </span>
              </h3>
            </div>
            <div className="agentslog-search d-flex align-items-center">
              <div
                className="searchbar-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input
                  className="form-control form-control--search"
                  type="text"
                  placeholder="Search..."
                  value={filter}
                  onChange={handleLogSearchChange}
                />
              </div>
            </div>
          </div>
          <div className="table-responsive logs-container" >
            <table className="tablogs table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  {userPrivilege.includes("manage_users") && <th>Account</th>}
                  <th>Login</th>
                  <th>First Break</th>
                  <th>Breakout</th>
                  <th>Over Break</th>
                  <th>Lunch In</th>
                  <th>Lunch Out</th>
                  <th>Over Break</th>
                  <th>Second Break</th>
                  <th>Breakout</th>
                  <th>Over Break</th>
                  <th>Log Out</th>
                </tr>
              </thead>
              <tbody style={{ overflowY: "auto" }}>
                {filteredRows?.map((logs) => (
                  <tr key={logs.name}>
                    <td>{logs.name}</td>
                    {userPrivilege.includes("manage_users") && <td>{logs.acctname}</td>}
                    <td>{logs.login}</td>
                    <td>{logs.brkin1}</td>
                    <td>{logs.brkout1}</td>
                    <td style={{ color: "red", fontWeight: "bold" }}>{logs.ob1}</td>
                    <td>{logs.lunchin}</td>
                    <td>{logs.lunchout}</td>
                    <td style={{ color: "red", fontWeight: "bold" }}>{logs.ob3}</td>
                    <td>{logs.brkin2}</td>
                    <td>{logs.brkout2}</td>
                    <td style={{ color: "red", fontWeight: "bold" }}>{logs.ob2}</td>
                    <td>{logs.logoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreakDataTable;
