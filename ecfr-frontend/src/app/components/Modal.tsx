'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionContent: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, sectionContent }) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === 'modal-background') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-background"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-2xl"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="max-h-[70vh] overflow-y-auto">{sectionContent}</div>
      </div>
    </div>
  );
};

export default Modal;
