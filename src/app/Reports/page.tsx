import Daterange from "./ReportDisplay";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Reports",
  description: "Monitoring System",
};

export default function Page () {
    return (
            <Daterange/>
    );
}