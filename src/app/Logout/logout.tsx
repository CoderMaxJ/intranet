// "use client";

import { useRouter } from "next/navigation";

export default function Logout() {
const router = useRouter();
const handleLogout = () => {
    localStorage.clear();
    router.push("/")
}
return (
    <div>    
        <div
        className="modal fade"
       id="exampleModal"  aria-labelledby="exampleModalLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Confirm Logout</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to log out?</p>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={handleLogout}
                    >
                    Logout
                    </button>
                </div>
                </div>
            </div>
        </div>    
    </div>
);
}
