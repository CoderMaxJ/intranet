// "use client";
import { Decryptor } from "@/security";
import { useRouter } from "next/navigation";
import { ToastContainer,toast } from "react-toastify";

export default function Logout() {
const router = useRouter();

const token = localStorage.getItem("token");
const user_id = localStorage.getItem("user_id");

const  logout = async ()=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/logout/`,{
        method: "POST",
        headers:{
            "Content-type":"application/json",
            // "Authorization":`Bearer ${Decryptor(token || "")}`
        },
        body:JSON.stringify({user_id:Decryptor(user_id || "")})

    });

    if(response.status === 200){
            localStorage.clear();
          successToast("Logout Successfully");
            localStorage.clear();
            window.location.reload();    
    }
}

 const successToast = (msg: string) => toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  
return (
    <div>    
        <div
        className="modal fade"
       id="logoutModal"  aria-labelledby="exampleModalLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content modal-xl" style={{minWidth:'500px'}}>
                <div className="modal-header">
                    <h5 className="modal-title text-light">Confirm Logout</h5>
                    <button type="button" className="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p className="logout-confirmation">Are you sure you want to log out?</p>
                </div>
                <div className="modal-footer">
                <button type="button" className=" btn btn-secondary" data-bs-dismiss="modal"><span className="view">Cancel</span></button>
                    <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={logout}
                    >
                    <span className="view">Logout</span>
                    </button>
                </div>
                </div>
            </div>
        </div>    
    </div>
);
}
