export default function Drawer() {
    return (
        <div>
            <div className="offcanvas offcanvas-end" tabIndex={-1} id="shiftdrawer" aria-labelledby="ShiftRightLabel" style={{ width: '700px' }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title fw-bold text-light" id="ShiftRightLabel">Shift Adjustment Information</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body">
                    <h5 className="form-label fw-bold fs-4 text-dark">User Information</h5>
                    <div className="mb-5 d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold fs-5">Name</p>
                            <p className="mb-0 fw-semibold fs-5">John Doe</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold fs-5">Department</p>
                            <p className="mb-0 fw-semibold fs-5">Ecomia</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold fs-5">Date Filed</p>
                            <p className="mb-0 fw-semibold fs-5">Jan 26, 2025</p>
                        </div>
                    </div>


                    <hr />
                    <div></div>
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="form-label fw-bold fs-4 text-dark">Summary</h5>
                    </div>

                    <div className="justify-content-between">
                        <div className="d-flex form-label justify-content-evenly mb-3">
                            <div><label htmlFor="attendance">Attendance</label></div>
                            <div><label htmlFor="attendance">Initial Time</label></div>
                            <div><label htmlFor="attendance">Assigned Time</label></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div><button type="button" className="checkbutton"><img src="/svg/checked-success.svg" alt="success" /></button></div>
                            <div><span className="break-label break-in">1st Break - In</span></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div><button type="button" className="checkbutton"><img src="/svg/checked-success.svg" alt="success" /></button></div>
                            <div><span className="break-label break-out">1st Break - Out</span></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div><button type="button" className="checkbutton"><img src="/svg/checked-success.svg" alt="success" /></button></div>
                            <div><span className="break-label lunch-in">Lunch - In</span></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div><button type="button" className="checkbutton"><img src="/svg/checked-success.svg" alt="success" /></button></div>
                            <div><span className="break-label logout">Logout</span></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><input type="time" className="form-control" /></div>
                            <div><button type="button" className="closebtn"><img src="/svg/wrong-danger.svg" alt="close" /></button></div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold fs-4 text-dark">Reason</label>
                        <p className="form-text fs-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
                <hr />
                <div className="modal-footer gap-4 mb-3">
                    <div><button type="button" className="btn btn-primary">Apply</button></div>
                    <div><button type="button" className="btn text-danger fw-bold">Decline</button></div>
                </div>
            </div>
            <div />
        </div>
    );
}
