import React from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex   items-center justify-center px-2 md:px-0 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-2xl h-fit overflow-y-auto   rounded-lg shadow-lg relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center pt-3">{title}</h2>
          <div className=" text-gray-700">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
