import React from "react";
import { IoClose } from "react-icons/io5";
import Button from "../button/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  loading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="relative">
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-10 rounded-md shadow-lg relative">
            <IoClose
              onClick={onClose}
              className="text-[2rem] absolute top-0 right-0 cursor-pointer"
            />

            <h2 className="text-lg font-bold text-bright-green">{message}</h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={onClose}
                className="bg-black border border-bright-green text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>

              <Button
                text="Confirm"
                type="danger"
                loading={loading}
                className="lg:text-sm"
                onClick={onConfirm}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
