export default function Drawer() {
    return (
        <div>
            <div className="offcanvas offcanvas-end" tabIndex={-1} id="shiftdrawer" aria-labelledby="ShiftRightLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title fw-bold" id="ShiftRightLabel">Shift Adjustment Information</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
           
                <div className="offcanvas-body">
                    <h5 className="fw-bold">User Information</h5>
                    <div className="mb-5 d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold">Name</p>
                            <p className="mb-0 fw-semibold">John Doe</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold">Department</p>
                            <p className="mb-0 fw-semibold">Ecomia</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-semibold">Date Filed</p>
                            <p className="mb-0 fw-semibold">Jan 26, 2025</p>
                        </div>
                    </div>
                    <hr/>
                    <div></div>
                    <div className="d-flex justify-content-between">
                        <h5 className="fw-bold">Summary</h5>
                        <div className="mb-2">
                            <span className="breaks  me-2">1st Break</span>
                            <span className="in-out bg-success">In</span>
                        </div>
                    </div>
<hr />
                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label">Initial Time</label>
                            <input type="time" className="form-control" />
                        </div>
                        <div className="col">
                            <label className="form-label">Assign Time</label>
                            <input type="time" className="form-control" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Reason</label>
                        <p className="form-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
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
