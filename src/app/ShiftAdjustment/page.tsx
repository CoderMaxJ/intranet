import CreateUD from "./shiftadjusment";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shift Adjustment",
    description: "Monitoring System",
};

export default function Page() {
    return(
        <CreateUD/>
    );
}