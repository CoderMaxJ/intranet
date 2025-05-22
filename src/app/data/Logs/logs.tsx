"use client";
import { useState, useEffect, useRef } from "react";
import { Decryptor } from "@/security";
import { useRouter } from "next/navigation";

interface Logs {
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
	logoff: string;
}

function LogsDataTable() {
	const [data, setData] = useState<Logs[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState("");
	const token = localStorage.getItem("token");
	const [latestUpdate, setLatestUpdate] = useState("");
	const logData = useRef<Logs[]>([]); // Ref to store logs data

	const router = useRouter();
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(e.target.value.toUpperCase());
		setFilter(e.target.value.toLowerCase());
	};

	const filteredRows = data.filter((row) =>
		Object.values(row)
			.join(" ")
			.toUpperCase()
			.toLowerCase()
			.includes(filter)
	);

	const fetchLogs = async () => {

		try {
			const account_id = await localStorage.getItem("user_id");
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND}/logs/${Decryptor(account_id || "")}/?last_update=${latestUpdate || ""}`,
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
				const storedData = localStorage.getItem("logsData");
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					setData(parsedData);
					logData.current = parsedData;
				}
				return;
			}
			if (!response.ok || response.status === 404 || response.status === 401 || response.status === 403) {

				localStorage.clear();
				router.push("/");
				return;
			}
			const fetchedData = await response.json();
			localStorage.setItem("total-logs", fetchedData.total);
			setLatestUpdate(fetchedData.latest_update);
			const storedData = localStorage.getItem("logsData");
			const storedLogs = storedData ? JSON.parse(storedData) : [];
			const updatedLogs = fetchedData.data.map((newLog: Logs) => {
				const existingLog = storedLogs.find((log: Logs) => log.name === newLog.name);
				return existingLog ? { ...newLog } : newLog;
			});

			setData(updatedLogs);
			logData.current = updatedLogs;
			localStorage.setItem("logsData", JSON.stringify(updatedLogs));
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
		const intervalId = setInterval(fetchLogs, 1000);
		return () => clearInterval(intervalId); // Cleanup interval
	}, [latestUpdate]);

	return (
		<div className="logs-wrapper px-4">
			<div className="logs-maindiv px-3 py-3">
				<div className="agentheader-container d-flex flex-wrap flex-direction-row align-items-center py-3 px-3">
					<div className="align-items-center col-5">
						<h3 className="logs-headername">
							Agent Logs Today
							<span className="text-muted small ms-2">
								({localStorage.getItem("total-logs") || 0})
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
							onChange={handleSearchChange}
						/>
					</div>
					</div>
				</div>
				<div className="table-responsive logs-container" >
					<table className="tablogs table table-hover table-bordered table-striped">
						<thead>
							<tr>
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
						<tbody style={{ overflowY: "auto" }}>
							{filteredRows.map((logs) => (
								<tr key={logs.name}>
									<td>{logs.name}</td>
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
	);
}

export default LogsDataTable;