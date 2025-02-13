// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "/public/asset/css/updateps.css";
// import Image from "next/image";

// export default function Updatepassword() {
//   return (
//     <div>
//       {/* Link to open modal */}
//       <a href="#" className="text-dark" data-bs-toggle="modal" data-bs-target="#createPasswordModal">
//        Create Account
//       </a>

//       {/* Bootstrap Modal */}
//       <div
//         className="modal fade"
//         id="createPasswordModal"
//         tabIndex={-1}
//         aria-labelledby="createPasswordModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
//           <div className="modal-content">
//             <div className="modal-header">
//               <img
//                 src="/img/Sos.png"
//                 alt="Staff Outsourcing Logo"
//                 className="modal-title"
//                 id="createPasswordModal"
//                 style={{ height: "50px", marginLeft: "60px" }}
//               />
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//                 style={{marginTop:'-45px'}}
//               ></button>
//             </div>

//             <div className="modal-body" style={{ marginLeft: "35px" }}>
//               <form>
//                 <div className="updatepass-label">
//                   <label htmlFor="password">Username</label>
//                   <div style={{ position: "relative" }}>
//                     <input
//                       className="updatepassword-input"
//                       id="password"
//                       type="password"
//                       required
//                     />
//                     <button type="button" className="ps-button"></button>
//                   </div>
//                 </div>

//                 <div className="updatepass-label">
//                   <label htmlFor="confirmpassword">Password</label>
//                   <div style={{ position: "relative" }}>
//                     <input
//                       className="updatepassword-input"
//                       id="confirmpassword"
//                       type="password"
//                       required
//                     />
//                     <button type="button" className="cnfrm-button"></button>
//                   </div>
//                 </div>

//                 <div className="button-div" style={{ display: "block" }}>
//                   <div>
//                     <button type="submit" className="btn btn-success">
//                       Create Account
//                     </button>
//                   </div>
//                   <div>

//                   </div>
//                 </div>
//               </form>
//             </div>

//             <div className="modal-footer"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }