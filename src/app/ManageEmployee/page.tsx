import CreateUD from "./manageemployee";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Employee",
    description: "Monitoring System",
};

export default function Page() {
    return(
        <CreateUD/>
    );
}