// src/CustomToast.js
import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const CustomToast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center max-w-xs w-full bg-${
        type === "success" ? "green-500" : "red-500"
      } text-white px-4 py-3 rounded shadow-lg transition transform ${
        type === "success"
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
    >
      <div className="flex-shrink-0">
        {type === "success" ? (
          <FaCheckCircle className="w-6 h-6" />
        ) : (
          <FaExclamationCircle className="w-6 h-6" />
        )}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm">success</p>
      </div>
      <button onClick={onClose} className="ml-4 text-white focus:outline-none">
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CustomToast;
