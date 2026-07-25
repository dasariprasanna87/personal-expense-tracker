const ExpenseItem = (props) => {
  return (
    <div
      className={`flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md origin-center overflow-hidden
        ${
          props.isDeleting
            ? "opacity-0 scale-90 max-h-0 py-0 my-0 border-0 mb-0 pointer-events-none"
            : "opacity-100 scale-100 max-h-24"
        }`}
    >
      <div>
        <h4 className="font-bold text-gray-800 text-lg">{props.title}</h4>
        <span className="text-xs text-gray-400 font-medium">
          Category: {props.category}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-extrabold text-red-600">
          ₹{props.amount}
        </span>
        <button
          onClick={() => props.onDelete(props.id)}
          className="text-gray-300 hover:text-red-500 font-bold transition text-sm px-2 py-1 rounded cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
