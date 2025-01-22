"use client";
// index.js or App.js
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import Router from "next/router";
import Header from "../component/Header";

interface BreakData {
  name: string;
  start: string;
  end: string;
  duration: number;
  breaktype: string;
}

function BreakDataTable() {
  const [breaks, setBreaks] = useState<BreakData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [durationtime, setDurationTime] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function getBreakData() {
      try {
        const account_id = await localStorage.getItem("account_id");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/break/list/${account_id}/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const adjustedData = data.data.map((item: BreakData) => {
          let duration = parseInt(item.duration.toString(), 10) || 0;
          if (item.breaktype === "lunch") {
            duration -= 3600;
          } else if (item.breaktype === "break") {
            duration -= 900;
          }

          const formattedStart = formatTime(parseInt(item.start, 10) || 0);
          const formattedEnd = formatTime(parseInt(item.end, 10) || 0);

          return {
            ...item,
            duration,
            formattedStart,
            formattedEnd,
          };
        });
        setBreaks(adjustedData);
      } catch (error) {
        console.error("Failed to fetch break data:", error);
      }
    }

    getBreakData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreaks((prevBreaks) =>
        prevBreaks.map((item) => ({
          ...item,
          duration: item.duration > 0 ? item.duration - 1 : 0,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const formatTime2 = (time: { start: string; end: string; type: string }) => {
    const currentTimestamp = new Date().getTime();
    const startParts = time.start.split(":");
    const endParts = time.end.split(":");

    const startInSeconds =
      parseInt(startParts[0], 10) * 3600 +
      parseInt(startParts[1], 10) * 60 +
      parseInt(startParts[2], 10);
    const endInSeconds =
      parseInt(endParts[0], 10) * 3600 +
      parseInt(endParts[1], 10) * 60 +
      parseInt(endParts[2], 10);

    const currentSeconds = Math.floor(
      (currentTimestamp - new Date().setHours(0, 0, 0, 0)) / 1000
    );
    const remainingSeconds = endInSeconds - currentSeconds;

    const minutes = Math.floor(Math.abs(remainingSeconds) / 60);
    const seconds = Math.abs(remainingSeconds) % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    if (remainingSeconds <= 300) {
      return `<span class="blink">${formattedTime}</span>`;
    }

    return formattedTime;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBreaks = breaks.filter(
    (breakItem) =>
      breakItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakItem.breaktype.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const start = () => {
      console.log("Loading new page");
      setLoadingPage(true);
    };

    const end = () => {
      console.log("Loaded new page!");
      setLoadingPage(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <div className="workforce">
      <Header />
      <div className={fullscreen ? "breaks-div fullscreen" : "breaks-div"}>
        <div>
          <div className="searchbar-wrapper">
            <div className="d-flex align-items-center">
              <h4 className="agent-header" style={{ marginRight: "10px" }}>
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
                style={{ backgroundColor: "#f0f0f0" }}
                type="text"
                placeholder="Search by name"
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
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  height: "42px",
                  borderRadius: "4px",
                  marginBottom: "5px",
                  marginLeft: "3px",
                  marginTop: "5px",
                  color: "white",
                }}
              >
                Go
              </button>
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
                  backgroundColor: "#A9E4FF",
                  marginLeft: "100px",
                }}
              >
                Lunch
              </span>
              <span
                style={{
                  padding: "10px",
                  color: "red",
                  backgroundColor: "#EDEDED",
                  textAlign: "center",
                  marginLeft: "2px",
                }}
              >
                Over Break
              </span>
              <span
                style={{
                  padding: "10px",
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
                  backgroundColor: "#FBDD64",
                  textAlign: "center",
                  marginLeft: "2px",
                }}
              >
                2nd Break
              </span>
            </div>
          </div>

          <div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#4CBDFF" }}>Name</th>
                  <th style={{ backgroundColor: "#4CBDFF" }}>Start</th>
                  <th style={{ backgroundColor: "#4CBDFF" }}>End</th>
                  <th style={{ backgroundColor: "#4CBDFF" }}>Duration</th>
                  <th style={{ backgroundColor: "#4CBDFF" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredBreaks
                  .map((instance) => {
                    const formattedTime = formatTime2(instance);

                    const currentTimestamp = new Date().getTime();
                    const endParts = instance.end.split(":");
                    const endInSeconds =
                      parseInt(endParts[0], 10) * 3600 +
                      parseInt(endParts[1], 10) * 60 +
                      parseInt(endParts[2], 10);

                    const currentSeconds = Math.floor(
                      (currentTimestamp - new Date().setHours(0, 0, 0, 0)) /
                        1000
                    );
                    const remainingSeconds = endInSeconds - currentSeconds;

                    return {
                      ...instance,
                      formattedTime,
                      remainingSeconds,
                      isElapsed: remainingSeconds < 0,
                    };
                  })
                  .sort((a, b) => {
                    if (a.isElapsed && !b.isElapsed) return -1;
                    if (!a.isElapsed && b.isElapsed) return 1;
                    return 0;
                  })
                  .map((instance) => (
                    <tr
                      key={instance.name}
                      style={{
                        backgroundColor: "white",
                      }}
                    >
                      <td className="blink">{instance.name}</td>
                      <td className="blink">{instance.start}</td>
                      <td className="blink">{instance.end}</td>
                      <td
                        className="blink"
                        dangerouslySetInnerHTML={{
                          __html: instance.formattedTime,
                        }}
                      ></td>
                      <td className="blink">{instance.breaktype}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "center" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BreakDataTable;
