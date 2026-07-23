const ExpenseItem = (props) => {
  return (
    <div className="flex justify-between items-center bg-white border border-gray-100 shadow-sm rounded-xl p-4 my-2 transition hover:shadow-md">
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
        {/* Modern hover cross button to trigger deletion */}
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
