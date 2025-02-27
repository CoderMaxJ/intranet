"useclient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
 
  return (
    <div>

<div className="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteModalLabel">Confirmation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this employee?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-target="modal"
            
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="block hover:bg-gray-100"
         data-bs-target="modal"
        style={{boxShadow:'none', outline:'none', background:'none', border:'none', color:'#ffffff'}}
      >
        Log Out
      </button>
    </div>
  );
}
