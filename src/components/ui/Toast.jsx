import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "@/features/toast/toastSlice";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

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

  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          bgColor: "bg-white",
          borderColor: "border-l-4 border-green-500",
          iconColor: "text-green-500",
          textColor: "text-gray-800"
        };
      case "error":
        return {
          icon: XCircle,
          bgColor: "bg-white",
          borderColor: "border-l-4 border-red-500",
          iconColor: "text-red-500",
          textColor: "text-gray-800"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgColor: "bg-white",
          borderColor: "border-l-4 border-yellow-500",
          iconColor: "text-yellow-500",
          textColor: "text-gray-800"
        };
      default:
        return {
          icon: Info,
          bgColor: "bg-white",
          borderColor: "border-l-4 border-blue-500",
          iconColor: "text-blue-500",
          textColor: "text-gray-800"
        };
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 min-w-[320px] max-w-md">
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);
        const Icon = config.icon;
        
        return (
          <div
            key={toast.id}
            className={`${config.bgColor} ${config.borderColor} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
          >
            <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} />
            <div className="flex-1">
              <p className={`${config.textColor} text-sm font-medium leading-relaxed`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;