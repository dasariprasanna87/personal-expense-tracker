import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  // Automatically trigger the closer callback function after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer to prevent memory glitches
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce flex items-center gap-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl border border-slate-800 dark:border-slate-200 transition-all max-w-sm">
      <span className="text-sm">{type === "success" ? "✅" : "⚠️"}</span>
      <p className="text-xs font-bold tracking-wide uppercase">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-white dark:hover:text-black font-bold text-xs p-0.5 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
