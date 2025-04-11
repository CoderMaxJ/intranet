import ManageDepartment from "./manageaccount";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Accounts",
    description: "Monitoring System",
};
export default function Page() {
    return (
        <ManageDepartment />
    );
}