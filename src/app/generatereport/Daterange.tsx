"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface BreaksReport {
  name: string;
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
  logout: string;
}

export default function Daterange() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(true);
  const [data, setData] = useState<BreaksReport[]>([]);
  const [filteredData, setFilteredData] = useState<BreaksReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getData = async () => {
    try {
      const account_id = localStorage.getItem("account_id");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/monitoring/report/${account_id}/${start}/${end}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result.data);
      setFilteredData(result.data);
      setSuccess(false);
    } catch (e) {
      setError("An error occurred while fetching data.");
    }
  };

  useEffect(() => {
    console.log(filteredData);
    setFilteredData(filteredData);
    if (filteredData) {
      console.log("report");
    }
  }, [filteredData, data]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`${e.target.value}`);
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (start === "" || end === "") {
      setError("Please fill in both date fields");
      return;
    }
    getData();
  };

  // Function to determine if a row should be highlighted
  const highlightRow = (row: BreaksReport) => {
    // Example condition: Highlight rows where the "brkin1" is empty (you can change this condition)
    return row.brkin1 === "";
  };

  return (
    <div className={success ? "gen-maindiv" : "gen-maindiv generate-page"}>
      {success ? (
        <form onSubmit={handleSubmit}>
          <div className="settings-page">
            <h4 className="generate-header">Daily Reports</h4>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="settingspage-wrapper">
              <div className="date-start">
                <label htmlFor="id-start" className="from">
                  From:
                </label>
                <input
                  type="date"
                  onChange={(e) => setStart(e.target.value)}
                  value={start}
                />
              </div>
              <div className="date-end">
                <label htmlFor="id-end">To:</label>
                <input
                  type="date"
                  onChange={(e) => setEnd(e.target.value)}
                  value={end}
                />
              </div>
              <div className="genrep-btn">
                <button type="submit">Generate Report</button>
              </div>
              <div className="back-btn" onClick={() => history.back()}>
                <button type="button" style={{backgroundColor:'#008DCC'}}>
                <i className="bi bi-reply-fill"></i> Back 
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div style={{ marginLeft: "60px", marginRight: "60px" }}>
          <header
            className="tab-header"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div
                    className="search-container"
                    style={{ position: "relative" }}
                  >
                    <input
                      className="form-control search-input"
                      style={{
                        backgroundColor: "#f0f0f0",
                        paddingLeft: "40px",
                      }}
                      type="text"
                      placeholder="Search by Name"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <i
                      className="fas fa-search search-icon"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "15px",
                        transform: "translateY(-50%)",
                        color: "#888",
                      }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {filteredData.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No results found
            </p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead>
                <tr className="tr-header">
                  <th>Name</th>
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
              <tbody>
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className={highlightRow(row) ? "highlight-row" : ""}
                  >
                    <td>{row.name}</td>
                    <td>{row.login}</td>
                    <td>{row.brkin1}</td>
                    <td>{row.brkout1}</td>
                    <td>{row.ob1}</td>
                    <td>{row.lunchin}</td>
                    <td>{row.lunchout}</td>
                    <td>{row.ob3}</td>
                    <td>{row.brkin2}</td>
                    <td>{row.brkout2}</td>
                    <td>{row.ob2}</td>
                    <td>{row.logout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
