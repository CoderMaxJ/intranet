// import { useState, useEffect } from "react";
// import { Decryptor } from "@/security";

// interface BreakData {
//   name: string;
//   start: string;
//   end: string;
//   duration: number;
//   breaktype: string;
// }

// const useBreaksData = () => {
//   const [breaks, setBreaks] = useState<BreakData[]>([]);

//   useEffect(() => {
//     const userId = localStorage.getItem("user_id") || "";
//     if (!userId) return; // Avoid making a request if no user ID is found

//     const url = `${process.env.NEXT_PUBLIC_BACKEND}/optimize/data/${Decryptor(userId)}/`;
//     const eventSource = new EventSource(url);

//     console.log("EventSource connected to:", url); // Log the URL

//     eventSource.onmessage = (event) => {
//       try {
//         console.log("Raw event data:", event.data); // Log the raw event data
//         const data = JSON.parse(event.data);
//         console.log("Parsed data:", data); // Log the parsed data
//         setBreaks(data.data || []); // Ensure it updates properly
//       } catch (error) {
//         console.error("Error parsing SSE data:", error);
//       }
//     };

//     eventSource.onerror = (error) => {
//       console.error("EventSource error:", error);
//       eventSource.close();
//     };

//     return () => {
//       console.log("Closing EventSource connection"); // Log when the connection is closed
//       eventSource.close(); // Cleanup when component unmounts
//     };
//   }, []);

//   return breaks; // Return the breaks data for use in components
// };

// export default useBreaksData;