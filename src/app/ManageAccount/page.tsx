import ManageDepartment from "./manageaccount";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Accounts",
    description: "Monitoring System",
};

export default function Page() {
    return (
        <ManageDepartment />
    );
}