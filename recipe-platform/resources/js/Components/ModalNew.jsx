import React, { useEffect } from "react";

const ModalNew = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleClickOutside = (e) => {
        if (e.target.id === "modal-background") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            id="modal-background"
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={handleClickOutside}
        >
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-8 rounded shadow-lg z-10 w-full max-w-md">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
};

export default ModalNew;
