// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Decryptor } from "@/security";
// import { useRouter } from "next/navigation";

// interface Logs {
// 	name: string;
// 	login: string;
// 	brkin1: string;
// 	brkout1: string;
// 	ob1: string;
// 	lunchin: string;
// 	lunchout: string;
// 	ob3: string;
// 	brkin2: string;
// 	brkout2: string;
// 	ob2: string;
// 	logoff: string;
// }

// function LogsDataTable() {
	

// 	const router = useRouter();
// 	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		setFilter(e.target.value.toUpperCase());
// 		setFilter(e.target.value.toLowerCase());
// 	};

// 	const filteredRows = data.filter((row) =>
// 		Object.values(row)
// 			.join(" ")
// 			.toUpperCase()
// 			.toLowerCase()
// 			.includes(filter)
// 	);

// 	const fetchLogs = async () => {

// 		try {
// 			const account_id = await localStorage.getItem("user_id");
// 			const response = await fetch(
// 				`${process.env.NEXT_PUBLIC_BACKEND}/logs/${Decryptor(account_id || "")}/?last_update=${latestUpdate || ""}`,
// 				{
// 					method: "GET",
// 					headers: {
// 						"Content-type": "application/json",
// 						Authorization: `Bearer ${Decryptor(token || "")}`,
// 					},
// 				}
// 			);

// 			if (response.status === 204) {
// 				const message = await response.text();
// 				const storedData = localStorage.getItem("logsData");
// 				if (storedData) {
// 					const parsedData = JSON.parse(storedData);
// 					setData(parsedData);
// 					logData.current = parsedData;
// 				}
// 				return;
// 			}
// 			if (!response.ok || response.status === 404 || response.status === 401 || response.status === 403) {

// 				localStorage.clear();
// 				router.push("/");
// 				return;
// 			}
// 			const fetchedData = await response.json();
// 			localStorage.setItem("total-logs", fetchedData.total);
// 			setLatestUpdate(fetchedData.latest_update);
// 			const storedData = localStorage.getItem("logsData");
// 			const storedLogs = storedData ? JSON.parse(storedData) : [];
// 			const updatedLogs = fetchedData.data.map((newLog: Logs) => {
// 				const existingLog = storedLogs.find((log: Logs) => log.name === newLog.name);
// 				return existingLog ? { ...newLog } : newLog;
// 			});

// 			setData(updatedLogs);
// 			logData.current = updatedLogs;
// 			localStorage.setItem("logsData", JSON.stringify(updatedLogs));
// 		} catch (err: any) {
// 			setError(err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchLogs();
// 		const intervalId = setInterval(fetchLogs, 1000);
// 		return () => clearInterval(intervalId); // Cleanup interval
// 	}, [latestUpdate]);

// 	return (
// 		<div>

// 		</div>
// 	);
// }

// export default LogsDataTable;