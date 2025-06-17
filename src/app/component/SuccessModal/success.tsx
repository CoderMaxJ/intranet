"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";

interface SuccessMessageProps {
    message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
    const [showModal, setShowModal] = useState(true);
    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            closeModal();
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {showModal && (
                <div className="modal fade show" id="successModal" aria-labelledby="successModalLabel" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="successModalLabel">Success</h1>
                                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>{message}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}