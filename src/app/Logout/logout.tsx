"useclient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
 
  return (
    <div>
      <button
        className="nav-font"
     
         data-bs-target="modal"
        style={{boxShadow:'none', outline:'none', background:'none', border:'none', color:'#000000'}}
      >
        Log Out
      </button>
    </div>
  );
}
