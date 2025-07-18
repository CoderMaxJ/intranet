import "bootstrap/dist/css/bootstrap.min.css";

interface UpdateModalConfirmationProps {
    onConfirm: () => void;
    onClose: () => void;
}

export default function UpdateModalConfirmation({ onConfirm, onClose }: UpdateModalConfirmationProps) {
    return (
        <div>
            <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Update
            </button>
            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to update?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={onConfirm}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}