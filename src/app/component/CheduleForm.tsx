function MultiSelect() {
    return (
        <div className="modal fade" id="open-modal-schedule" tabIndex="-1" aria-labelledby="open-modal-schedule" aria-hidden="true">
            <div 
                className="modal-dialog" 
                style={{ width: '60%', height: '75%', maxWidth: 'none' }}
            >
                <div 
                    className="modal-content" 
                    style={{ height: '100%' }}
                >
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Create Schedule</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ overflowY: 'auto' }}>
                        <label className="fs-6" htmlFor="">Effectivity date</label>
                        <div className="mb-3 d-flex align-items-center justify-content-space-between">
                           <label htmlFor="">Time In</label> 
                           <input type="Time" className="form-control w-25 mb-2 mt-2" id="exampleFormControlInput1" placeholder="time" />
                            <label htmlFor="">Time Out</label>
                            <input type="Time" className="form-control w-25" id="exampleFormControlInput1" placeholder="time" />
                            
                        </div>
                        <form>
                            <div className="mb-3">
                      
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Send message</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MultiSelect;
