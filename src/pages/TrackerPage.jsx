import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

import ExpenseItem from "../ExpenseItem";

const TrackerPage = () => {
  // 1. Core State: Checks local storage first. If empty, starts with a clean empty array [].
  const [expenses, setExpenses] = useState(() => {
    const localData = localStorage.getItem("savedExpenses");
    return localData ? JSON.parse(localData) : [];
  });

  const totalExpense = expenses
    ? expenses.reduce((sum, item) => sum + item.amount, 0)
    : 0;

  // 📊 CHART DATA PIPELINE: Groups and sums amounts by category for the Pie Chart
  const chartData = expenses.reduce((acc, item) => {
    // Check if this category already exists in our summary list
    const existingCategory = acc.find((c) => c.name === item.category);
    if (existingCategory) {
      existingCategory.value += item.amount; // Add to existing total
    } else {
      acc.push({ name: item.category, value: item.amount }); // Create new category row
    }
    return acc;
  }, []);

  // Pre-defined modern colors for our pie slices (Food, Travel, Bills, Entertainment)
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

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
      id: Date.now(),
      title: inputTitle,
      amount: parseFloat(inputAmount),
      category: inputCategory,
    };

    setExpenses([...expenses, newExpense]);
    setInputAmount("");
    setInputTitle("");
  };

  const handleDeleteExpense = (idToDelete) => {
    // 1. Mark the targeted item as "isDeleting: true" inside our state array
    setExpenses(
      expenses.map((item) =>
        item.id === idToDelete ? { ...item, isDeleting: true } : item,
      ),
    );

    // 2. Wait 300 milliseconds for the Tailwind animation transition to finish executing
    setTimeout(() => {
      // 3. Officially filter it out of the array state once it's completely hidden
      setExpenses((prevExpenses) =>
        prevExpenses.filter((item) => item.id !== idToDelete),
      );
    }, 300);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all expenses?")) {
      setExpenses([]);
      localStorage.removeItem("savedExpenses");
    }
  };

  return (
    // 🔲 REMOVED min-h-screen/bg-gray-50 from outer container wrapper so the App.jsx layout background shows through naturally
    <div className="py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center mb-6 transition-colors">
          Personal Expense Tracker
        </h1>

        {/* 💰 Total Expense Banner Card */}
        <div className="bg-slate-900 dark:bg-slate-900 border dark:border-slate-800 text-white rounded-2xl p-6 text-center mb-6 shadow-md transition-colors">
          <span className="text-xl font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Total Amount Spent
          </span>
          <h2 className="text-3xl font-black">₹{totalExpense}</h2>
        </div>

        {/* 📊 Visual Category Breakdown Pie Chart Card */}
        {expenses.length > 0 && (
          <div className="bg-white border border-gray-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl p-6 mb-6 transition-colors">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 text-left mb-4 transition-colors">
              Category Breakdown
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  {/* 🔧 Dynamic Tooltip: Styled to adapt seamlessly to dark mode frameworks */}
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "var(--color-bg-card, #fff)",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border-card, #f3f4f6)",
                      color: "var(--color-text-card, #000)",
                    }}
                    itemStyle={{ color: "inherit" }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 🛠️ Modern Input Entry Form Card */}
        <form
          onSubmit={handleAddExpense}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-6 transition-colors"
        >
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">
              Expense Title
            </label>
            <input
              type="text"
              placeholder="e.g., Dinner, Groceries"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1 transition-colors">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="150"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1 transition-colors">
                Category
              </label>
              <select
                value={inputCategory}
                onChange={(e) => setInputCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm cursor-pointer"
              >
                <option value="Food" className="dark:bg-slate-800">
                  Food
                </option>
                <option value="Travel" className="dark:bg-slate-800">
                  Travel
                </option>
                <option value="Bills" className="dark:bg-slate-800">
                  Bills
                </option>
                <option value="Entertainment" className="dark:bg-slate-800">
                  Entertainment
                </option>
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 transition-colors">
              Transaction History
            </h3>
            {expenses.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold uppercase text-red-500 hover:text-red-700 transition cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Map through expenses list */}
          <div className="space-y-2">
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                item={expense}
                onDelete={handleDeleteExpense}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
