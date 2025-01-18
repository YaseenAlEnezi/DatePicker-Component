import React from "react";

export const Modal = ({ children, onClose, isOpen }) => {
  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50`}
        onClick={onClose}
      ></div>
      <div className="fixed bottom-0 left-0 right-0 transform z-50">
        {children}
      </div>
    </>
  );
};
