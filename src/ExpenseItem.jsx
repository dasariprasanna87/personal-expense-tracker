// ⚙️ Destructure incoming props directly to clean up object paths (item, onDelete)
const ExpenseItem = ({ item, onDelete }) => {
  // If the object isn't available yet, return a safe fallback to prevent page breaks
  if (!item) return null;

  return (
    <div
      className={`flex justify-between items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-xl shadow-sm mb-3 transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md origin-center overflow-hidden
        ${
          item.isDeleting
            ? "opacity-0 scale-90 max-h-0 py-0 my-0 border-0 mb-0 pointer-events-none"
            : "opacity-100 scale-100 max-h-24"
        }`}
    >
      <div>
        {/* 📝 Title Text: Links to item.title and shifts color dynamically */}
        <h4 className="font-bold text-gray-800 dark:text-white text-lg transition-colors">
          {item.title}
        </h4>
        {/* 🏷️ Category Text: Links to item.category and dims softly in dark mode */}
        <span className="text-xs text-gray-400 dark:text-slate-400 font-medium transition-colors">
          Category: {item.category}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* 💰 Amount Display: Links to item.amount */}
        <span className="text-xl font-black text-red-600 dark:text-red-400 transition-colors">
          ₹{item.amount}
        </span>
        {/* ❌ Delete Button Control: Correctly targets item.id */}
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-300 hover:text-red-500 font-bold transition text-sm px-2 py-1 rounded cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
