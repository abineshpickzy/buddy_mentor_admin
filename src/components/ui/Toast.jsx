import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "@/features/toast/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.toast);

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  const getToastStyles = (type) => {
    const baseStyles = "px-4 py-3 rounded shadow-lg text-white mb-2 transition-all z-100";
    switch (type) {
      case "success":
        return `${baseStyles} bg-green-500`;
      case "error":
        return `${baseStyles} bg-red-500`;
      case "warning":
        return `${baseStyles} bg-yellow-500`;
      default:
        return `${baseStyles} bg-blue-500`;
    }
  };

  return (
    <div className="fixed top-[100px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={getToastStyles(toast.type)}>
          <div className="flex justify-between items-center">
            <span>{toast.message}</span>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;