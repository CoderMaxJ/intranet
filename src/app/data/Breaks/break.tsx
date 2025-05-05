"use client";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect, useRef, use } from "react";
import "../../style/breaks.css";
import { Decryptor, Encryptor } from "@/security";
import { useRouter } from "next/navigation"

interface BreakData {
  name: string;
  start: string;
  end: string;
  duration: number;
  breaktype: string;
  overbreak: number; // Add overbreak duration to the interface
}

function BreakDataTable() {
  const [breaks, setBreaks] = useState<BreakData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null);
  const breaksRef = useRef<BreakData[]>([]);

  const router = useRouter();
  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev);
  };

  const user_id = localStorage.getItem("user_id");
  const deleteToken = async ()=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: Decryptor(user_id || "") }),
      });
    if (response.status === 200) {
      localStorage.clear();
      router.push("/")
      return;
    } else {
      return null;
    }
  }
 
  const fetchBreakData = async () => {
    try {
      const account_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/break/list/${Decryptor(account_id || "")}/?last_update=${latestUpdate || ""}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Decryptor(token || "")}`,
          },
        }
      );

      if (response.status === 204) {
        const message = await response.text();
        // No new data, use data from local storage
        const storedData = localStorage.getItem("breakData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setBreaks(parsedData);
          breaksRef.current = parsedData;
        }
        return;
      }

      if ( response.status === 404 || response.status === 403) {
        deleteToken();
        localStorage.clear();
        router.push("/");
        return;
      }

      const data = await response.json();
      localStorage.setItem("total-on-breaks", data.total);
      // Merge fetched data with the current countdown state
      const storedData = localStorage.getItem("breakData");
      const storedBreaks = storedData ? JSON.parse(storedData) : [];
      const updatedBreaks = data.data.map((newBreak: BreakData) => ({
        ...newBreak,
        duration: newBreak.duration > 0 ? newBreak.duration : -newBreak.overbreak, // Always use fresh duration
      }));
      setBreaks(updatedBreaks);
      breaksRef.current = updatedBreaks;
      setLatestUpdate(data.latest_update);
      // Store the new data in local storage
      localStorage.setItem("breakData", JSON.stringify(updatedBreaks));
    } catch (error) {
      console.error("Failed to fetch break data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const udpateTimeStamp = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/updatetimestamp/`, {
              method: "POST",
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${Decryptor(token || "")}`
              }
            })
            if (response.status === 200) {

            } else {
              console.error("error");
            }
          } catch (e) {

            console.error(e);
          }
        }
        udpateTimeStamp();
        setTimeout(() => {
          udpateTimeStamp();
        }, 2000)
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const countdownIntervalId = setInterval(() => {
      setBreaks((prevBreaks) => {
        const updatedBreaks = prevBreaks.map((breakItem) => ({
          ...breakItem,
          duration: breakItem.duration - 1,
        }));
        breaksRef.current = updatedBreaks; // Update the ref
        localStorage.setItem("breakData", JSON.stringify(updatedBreaks));
        return updatedBreaks;
      });
    }, 1000);

    return () => clearInterval(countdownIntervalId);
  }, []);

  const status = localStorage.getItem("status");

  useEffect(() => {
    if (status !== "login") return;
    fetchBreakData();
    const fetchIntervalId = setInterval(fetchBreakData, 1000);

    return () => clearInterval(fetchIntervalId);
  }, [latestUpdate]);

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

  const filteredBreaks = breaks.filter(
    (breakItem) =>
      breakItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakItem.breaktype.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workforce px-4">
      <div className={fullscreen ? "breaks-div fullscreen px-4" : "breaks-div p-3"}>
        <div className="d-flex flex-column">
          <div className="breaksheader d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-3">
            <div className="d-flex align-items-center">
              <h4
                className="agent-header"
              >
                Agent Breaks Monitoring Dashboard
              </h4>
              <button
                style={{ border: "none", background: "none" }}
                onClick={toggleFullscreen}
                title={fullscreen ? "Compress" : "Fullscreen"}
              >
                {fullscreen ? (
                  <i className="bi bi-fullscreen-exit fw-bold text-dark"></i>
                ) : (
                  <i className="bi bi-fullscreen fw-bold text-dark"></i>
                )}
              </button>
            </div>
            <div
              className="searchbar-container"
            >
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
            <div
            >
              <div className="legends">
                <span className="firstbreak">
                  1st Break
                </span>
                <span className="secondbreak">
                  2nd Break
                </span>
                <span className="lunchbreak">
                  Lunch
                </span>
                <span className="overbreak">
                  Over Break
                </span>
                <span className="totalbreak">
                  <i className="alarm bi bi-alarm"></i>
                  Total: <span>{localStorage.getItem("total-on-breaks") || 0}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="table-responsive breaks-table">
            <table className="tabbreaks table table-bordered" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredBreaks
                  .sort((a, b) => {
                    // First, sort by duration (less than 300 first)
                    if (a.duration < 300 && b.duration >= 300) return -1;
                    if (a.duration >= 300 && b.duration < 300) return 1;
                    // Then, sort by break type (First Break, Second Break, Lunch)
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
    </div>
  );
}

export default BreakDataTable;