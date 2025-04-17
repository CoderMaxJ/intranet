import CreateUD from "./schedule";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Schedule",
    description: "Monitoring System",
};

export default function Page() {
    return(
        <CreateUD/>
    );
}