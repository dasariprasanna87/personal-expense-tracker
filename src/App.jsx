import { useState, useEffect } from "react";
import ExpenseItem from "./ExpenseItem";

const App = () => {
  // 1. Core State: Checks local storage first. If empty, starts with a clean empty array [].
  const [expenses, setExpenses] = useState(() => {
    const localData = localStorage.getItem("savedExpenses");
    return localData ? JSON.parse(localData) : [];
  });

  const totalExpense = expenses
    ? expenses.reduce((sum, item) => sum + item.amount, 0)
    : 0;

  // 2. Form Tracking States
  const [inputTitle, setInputTitle] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputCategory, setInputCategory] = useState("Food");

  // 💾 AUTOMATIC SAVE: Runs every single time the 'expenses' state array changes!
  useEffect(() => {
    localStorage.setItem("savedExpenses", JSON.stringify(expenses));
  }, [expenses]);

  // 3. Form Submission Handler
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!inputTitle || !inputAmount) return;

    const newExpense = {
      id: Date.now(), // 🔥 FIXED: Added () to execute and get the unique numeric ID!
      title: inputTitle,
      amount: parseFloat(inputAmount),
      category: inputCategory,
    };

    setExpenses([...expenses, newExpense]);
    setInputAmount("");
    setInputTitle("");
  };

  const handleDeleteExpense = (idToDelete) => {
    setExpenses(expenses.filter((item) => item.id !== idToDelete));
  };
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all expenses?")) {
      setExpenses([]);
      localStorage.removeItem("savedExpenses");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
          Personal Expense Tracker
        </h1>

        {/* 💰 Total Expense Banner Card - Moved into the layout container grid */}
        <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-sm text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80 block mb-1">
            Total Amount Spent
          </span>
          <h2 className="text-3xl font-black">₹{totalExpense}</h2>
        </div>

        {/* 🛠️ Modern Input Entry Form Card */}
        <form
          onSubmit={handleAddExpense}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6"
        >
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Expense Title
            </label>
            <input
              type="text"
              placeholder="e.g., Dinner, Groceries"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="150"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Category
              </label>
              <select
                value={inputCategory}
                onChange={(e) => setInputCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
          >
            Add New Expense
          </button>
        </form>

        {/* 📋 Dynamic Display Output List Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Transaction History
            </h3>
            {/* Only show the clear button if there are active expenses to delete */}
            {expenses.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold uppercase text-red-500 hover:text-red-700 transition cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
          {expenses &&
            expenses.map((item) => (
              <ExpenseItem
                key={item.id}
                id={item.id}
                title={item.title}
                amount={item.amount}
                category={item.category}
                onDelete={handleDeleteExpense}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
