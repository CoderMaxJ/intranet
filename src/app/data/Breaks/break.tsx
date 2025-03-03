"use client";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect,useCallback } from "react";
import "../../style/breaks.css";
import Header from "@/app/component/Header";
import { Decryptor } from "@/security";


interface BreakData {
  name: string;
  start: string;
  end: string;
  duration: number; // Duration in seconds
  breaktype: string;
}


function BreakDataTable() {
  const [breaks, setBreaks] = useState<BreakData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev);
  };

  // Fetch break data from the server
  const fetchBreakData = useCallback(async (forceUpdate = false) => {
    try {
      setLoadingPage(true);
      const account_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/break/list/${Decryptor(account_id || "")}/?since=${forceUpdate ? "" : localStorage.getItem("lastUpdated") || ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Decryptor(token || "")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setBreaks((prevBreaks) => {
        const updatedBreaksMap = new Map(prevBreaks.map((item) => [item.name, item]));

        data.data.forEach((item: BreakData) => {
          updatedBreaksMap.set(item.name, item); // Update existing or add new
        });
        console.log('updatedBreaksMap');
        return Array.from(updatedBreaksMap.values());
      });
      console.log("===========",forceUpdate)
      if (data.data.length > 0 || forceUpdate || localStorage.getItem("lastUpdated") == "") {
        localStorage.setItem("lastUpdated", new Date().toISOString()); // Update timestamp
        console.log("===========",forceUpdate)
      }
    } catch (error) {
      console.error("Failed to fetch break data:", error);
    } finally {
      setLoadingPage(false);
    }
  }, []);
  
const status = localStorage.getItem("status");
  // Fetch data initially and set up polling
  useEffect(() => {
    if (status != "login") return;

    fetchBreakData(); // Initial fetch
    const intervalId = setInterval(fetchBreakData, 1000); // Poll every 1 second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Format time for display
  const formatTime = (time: number) => {
    const isNegative = time < 0;
    const absoluteTime = Math.abs(time);
    const hours = Math.floor(absoluteTime / 3600);
    const minutes = Math.floor((absoluteTime % 3600) / 60);
    const seconds = absoluteTime % 60;

    return `${isNegative ? "" : ""}${String(hours).padStart(2, "0")}:${String(Math.abs(minutes)).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter breaks based on search query
  const filteredBreaks = breaks.filter(
    (breakItem) =>
      breakItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakItem.breaktype.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workforce">
      <div className={fullscreen ? "breaks-div fullscreen" : "breaks-div"}>
        <div>
          <div className="searchbar-wrapper">
            <div className="d-flex align-items-center">
              <h4
                className="agent-header"
                style={{
                  marginRight: "10px",
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: "bold",
                  fontSize: "23px",
                }}
              >
                Agent Breaks Monitoring Dashboard
              </h4>
              <button
                style={{ border: "none", background: "none" }}
                onClick={toggleFullscreen}
                title={fullscreen ? "Compress" : "Fullscreen"}
              >
                {fullscreen ? (
                  <i className="bi bi-fullscreen-exit fw-bold"></i>
                ) : (
                  <i className="bi bi-fullscreen fw-bold"></i>
                )}
              </button>
            </div>
            <div className="searchbar-container">
              <input
                className="searchbar"
                style={{
                  backgroundColor: "#f0f0f0",
                  fontFamily: "'Raleway', sans-serif",
                  marginBottom: "3px",
                }}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                className="bi-search"
                viewBox="-7 0 30 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
            <div
              style={{
                fontWeight: "bold",
                width: "460px",
              }}
            >
              <span
                className="legends"
                style={{
                  padding: "10px",
                  fontFamily: "'Raleway', sans-serif",
                  backgroundColor: "#b5e48c",
                  marginLeft: "90px",
                }}
              >
                Lunch
              </span>
              <span
                style={{
                  padding: "10px",
                  color: "red",
                  fontFamily: "'Raleway', sans-serif",
                  backgroundColor: "#ffdccc",
                  textAlign: "center",
                  marginLeft: "2px",
                }}
              >
                Over Break
              </span>
              <span
                style={{
                  padding: "10px",
                  fontFamily: "'Raleway', sans-serif",
                  backgroundColor: "#FFEDA6",
                  textAlign: "center",
                  marginLeft: "2px",
                }}
              >
                1st Break
              </span>
              <span
                style={{
                  padding: "10px",
                  fontFamily: "'Raleway', sans-serif",
                  backgroundColor: "#FAD5A5",
                  textAlign: "center",
                  marginLeft: "2px",
                }}
              >
                2nd Break
              </span>
            </div>
          </div>

          <div>
            <table className="table table-bordered" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Name</th>
                  <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Start</th>
                  <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>End</th>
                  <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Duration</th>
                  <th style={{ backgroundColor: "#4CBDFF", fontFamily: "'Raleway', sans-serif" }}>Type</th>
                </tr>
              </thead>
              <tbody>
              {filteredBreaks.map((instance) => (
                  <tr 
                  style={{
                    backgroundColor: 
                      instance.duration
                        ? instance.breaktype === "First Break"
                          ? "#FFEDA6"
                          : instance.breaktype === "Second Break"
                          ? "			#FAD5A5"
                          : instance.breaktype === "Lunch"
                          ? "#b5e48c"
                          : ""
                        : ""
                  }}
                   key={instance.name}>
                    <td style={{backgroundColor:"inherit"}} 
                        className={instance.duration < 300 ? "blink-background" : ""} >
                        {instance.name}
                    </td>

                    <td style={{backgroundColor:"inherit"}}  className={instance.duration < 300 ? "blink-background" : ""} >{instance.start}</td>
                    <td style={{backgroundColor:"inherit"}}  className={instance.duration < 300 ? "blink-background" : ""} >{instance.end}</td>
                 
                    <td style={{backgroundColor:"inherit", color: instance.duration < 0 ? "#be1243 ": "", fontWeight: instance.duration < 0 ? "bold": ""}}   className={instance.duration < 300 ? "blink-background" : ""} 
                     
                    >
                    {formatTime(instance.duration)}
                    </td>
                    <td style={{backgroundColor:"inherit"}}  className={instance.duration < 300 ? "blink-background" : ""} >{instance.breaktype}</td>
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