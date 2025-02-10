"use client";
import { useState } from "react";
import { Encryptor,Decryptor } from "@/security";
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

  const handleGenerateAndDownloadCSV = async () => {
    try {
      setError("");
      const account_id = localStorage.getItem("account_id");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/monitoring/report/${account_id}/${start}/${end}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
           Authorization: `Bearer ${Decryptor(token)}`
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      if (!result.data.length) {
        alert("No data available for the selected date range.");
        return;
      }

      setData(result.data);
      setSuccess(true);

      const csvContent = [
        [
          "Name",
          "Login",
          "First Break",
          "Breakout",
          "Over Break",
          "Lunch In",
          "Lunch Out",
          "Over Break",
          "Second Break",
          "Breakout",
          "Over Break",
          "Log Out",
        ],
        ...result.data.map((row: BreaksReport) =>
          [
            row.name,
            row.login,
            row.brkin1 || "",
            row.brkout1 || "",
            row.ob1 || "",
            row.lunchin || "",
            row.lunchout || "",
            row.ob3 || "",
            row.brkin2 || "",
            row.brkout2 || "",
            row.ob2 || "",
            row.logout || "",
          ]
            .map((value) => `${value}`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${start}_${end}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      setError("An error occurred while fetching data.");
    }
  };

  return (

  
    <div>
      <div>
        <a
          href="#"
          className="text-primary text-dark"
          data-bs-toggle="modal"
          data-bs-target="#reportModal"
        >
          Reports
        </a>
      </div>

      <div
        className="modal fade"
        id="reportModal"
        tabIndex={-1}
        aria-labelledby="reportModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="reportModalLabel"
                style={{ marginLeft: "100px"}}
              >
                Daily Reports
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {error && <p style={{ color: "red", textAlign:'center' }}>{error}</p>}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (start && end) handleGenerateAndDownloadCSV();
                  else setError("Please fill in both date fields");
                }}
              >
                <div className="mb-3">
                  <label
                    htmlFor="id-start"
                    className="form-label"
                    style={{ marginLeft: "30px" }}
                  >
                    From:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) => setStart(e.target.value)}
                    value={start}
                    style={{ marginLeft: "30px", width: "15vw" }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="id-end"
                    className="form-label"
                    style={{ marginLeft: "30px" }}
                  >
                    To:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) => setEnd(e.target.value)}
                    value={end}
                    style={{ marginLeft: "30px", width: "15vw" }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ marginLeft: "30px", width: "15vw" }}
                >
                  Generate Report
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  style={{
                    display: "block",
                    marginLeft: "30px",
                    marginTop: "10px",
                    width: "15vw",
                  }}
                >
                 <i className="bi bi-reply-fill" style={{marginRight:'5px'}}></i>
                  Back
                </button>
              </form>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
