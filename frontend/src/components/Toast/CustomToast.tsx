import { CheckCircle, X } from '@mui/icons-material';
import React, { useRef } from 'react';
import { FaUndoAlt } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import { ToastContext, ToastProps } from '../../context/ToastContext';

const CustomToast = ({ message, type, undoAction, closeToast }: ToastProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <IoAlertCircleOutline className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <IoIosInformationCircleOutline className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="flex items-center gap-3">
      {getIcon()} <p className="flex-1 text-white">{message}</p>
      {undoAction && (
        <button
          onClick={() => {
            undoAction();
            closeToast?.();
          }}
          className="bg-blue-400 text-white px-3 py-1 rounded-md hover:bg-blue-800
                     transition duration-200 ease-in-out"
        >
          <span className="flex items-center gap-2">
            <FaUndoAlt className="w-4 h-4" />
            Undo
          </span>
        </button>
      )}
    </div>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastId = useRef<string | null>(null);

  const showToast = (props: ToastProps) => {
    // Ensure the previous toast closes before showing a new one
    if (toastId.current && toast.isActive(toastId.current)) {
      toast.dismiss(toastId.current); // Close the existing toast if active
    }

    // Display the new toast and update the toastId
    toastId.current = toast(({ closeToast }) => <CustomToast {...props} closeToast={closeToast} />, {
      position: 'top-center',
      autoClose: props.duration,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      className: 'font-medievalsharp',
    }) as string;
  };
  return (
    <ToastContext.Provider value={{ showToast, toastId }}>
      {children}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Zoom}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
