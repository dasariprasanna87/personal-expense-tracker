import React from "react";

// 🎨 Theme Style Map Configuration
const CATEGORY_STYLES = {
  Food: {
    icon: "🍔",
    colorClass:
      "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
  },
  Travel: {
    icon: "✈️",
    colorClass:
      "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
  },
  Bills: {
    icon: "💡",
    colorClass:
      "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
  },
  Entertainment: {
    icon: "🎬",
    colorClass:
      "text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40",
  },
};

const ExpenseItem = ({ item, onDelete }) => {
  if (!item) return null;

  // 🔍 Safely grab the styles for the current category, or use Food as a fallback
  const config = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Food;

  return (
    <div
      className={`flex justify-between items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-xl shadow-sm mb-3 transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md origin-center overflow-hidden
        ${
          item.isDeleting
            ? "opacity-0 scale-90 max-h-0 py-0 my-0 border-0 mb-0 pointer-events-none"
            : "opacity-100 scale-100 max-h-24"
        }`}
    >
      {/* Left side: Icon and Text Details */}
      <div className="flex items-center gap-3.5">
        {/* 🌟 Dynamic Visual Badge Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border text-lg font-bold shrink-0 shadow-xs transition-colors ${config.colorClass}`}
        >
          {config.icon}
        </div>

        <div>
          <h4 className="font-bold text-gray-800 dark:text-white text-base transition-colors leading-tight mb-0.5">
            {item.title}
          </h4>
          <span className="text-xs text-gray-400 dark:text-slate-400 font-medium transition-colors">
            {item.category}
          </span>
        </div>
      </div>

      {/* Right side: Cost Amount and Actions */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-black text-slate-800 dark:text-slate-100 transition-colors">
          ₹{item.amount}
        </span>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-300 hover:text-red-500 font-bold transition text-sm p-1 rounded cursor-pointer active:scale-90"
          title="Delete Transaction"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
