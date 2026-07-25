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
        <div className="bg-slate-900 text-white rounded-2xl p-6 text-center mb-6 shadow-md">
          <span className="text-xl font-bold uppercase tracking-wider text-yellow-300 block mb-1">
            Total Amount Spent
          </span>
          <h2 className="text-3xl font-black">₹{totalExpense}</h2>
        </div>
        {/* 📊 Visual Category Breakdown Pie Chart Card */}
        {expenses.length > 0 && (
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 text-left mb-4">
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
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #f3f4f6",
                    }}
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

export default TrackerPage;
