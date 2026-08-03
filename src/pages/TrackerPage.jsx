// ⚙️ Step 1: Add useMemo to your React imports at the very top
import { useState, useEffect, useMemo } from "react";
import Toast from "../Tost";
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
  const [expenses, setExpenses] = useState(() => {
    const localData = localStorage.getItem("savedExpenses");
    return localData ? JSON.parse(localData) : [];
  });
  const [toastMessage, setToastMessage] = useState("");
  // 1. Add a new state for the budget limit (defaulting to ₹10,000)
  const [budgetLimit, setBudgetLimit] = useState(() => {
    const savedBudget = localStorage.getItem("savedBudget");
    return savedBudget ? parseFloat(savedBudget) : 10000;
  });
  // 2. Automatically persist budget changes to local storage
  useEffect(() => {
    localStorage.setItem("savedBudget", budgetLimit.toString());
  }, [budgetLimit]);
  const totalExpense = expenses
    ? expenses.reduce((sum, item) => sum + item.amount, 0)
    : 0;

  // 3. Calculate percentage spent
  const percentSpent = budgetLimit > 0 ? (totalExpense / budgetLimit) * 100 : 0;
  const isOverBudget = totalExpense > budgetLimit;
  // 🚀 Step 2: Wrap your Chart Data pipeline inside useMemo
  const chartData = useMemo(() => {
    // This console log will help you prove that your optimization works!
    console.log("📊 Chart data recalculated!");

    return expenses.reduce((acc, item) => {
      const existingCategory = acc.find((c) => c.name === item.category);
      if (existingCategory) {
        existingCategory.value += item.amount;
      } else {
        acc.push({ name: item.category, value: item.amount });
      }
      return acc;
    }, []);
  }, [expenses]); // 👈 Dependency Array: Only re-run if the 'expenses' array changes!

  // Pre-defined modern colors for our pie slices
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  // Form Tracking States
  const [inputTitle, setInputTitle] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputCategory, setInputCategory] = useState("Food");
  // ⚠️ Track expense form validation errors
  const [errors, setErrors] = useState({ title: false, amount: false });

  // AUTOMATIC SAVE
  useEffect(() => {
    localStorage.setItem("savedExpenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();

    // ⚙️ 1. Evaluate form parameters dynamically (.trim() handles empty spaces)
    const isTitleInvalid = !inputTitle.trim();
    const parsedAmount = parseFloat(inputAmount);
    const isAmountInvalid =
      !inputAmount || isNaN(parsedAmount) || parsedAmount <= 0;

    const newErrors = {
      title: isTitleInvalid,
      amount: isAmountInvalid,
    };

    setErrors(newErrors);

    // 🛑 2. Block submission if any required field fails verification
    if (newErrors.title || newErrors.amount) return;

    const newExpense = {
      id: Date.now(),
      title: inputTitle,
      amount: parsedAmount,
      category: inputCategory,
    };

    setExpenses([...expenses, newExpense]);
    setInputAmount("");
    setInputTitle("");
    setErrors({ title: false, amount: false }); // Reset error state explicitly
    setToastMessage("Expense added successfully!"); // 🌟 TRIGGER THE ALERTS HERE!
  };

  const handleDeleteExpense = (idToDelete) => {
    setExpenses(
      expenses.map((item) =>
        item.id === idToDelete ? { ...item, isDeleting: true } : item,
      ),
    );

    setTimeout(() => {
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
    // Keep your existing return JSX exactly the same as it was!
    <div className="py-6 px-4 sm:px-6 lg:px-8 font-sans">
      {/* ... rest of your JSX remains unchanged ... */}
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center mb-6 transition-colors">
          Personal Expense Tracker
        </h1>
        {/* 🎯 Budget Goal Configuration & Progress Tracking Card */}
        <div className="bg-white border border-gray-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl p-5 mb-6 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Monthly Budget Target
              </h3>
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                {isOverBudget
                  ? "⚠️ You have exceeded your limit!"
                  : "💪 You are safely within your limit"}
              </span>
            </div>

            {/* Inline Input to change budget on the fly */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors">
              <span className="text-sm font-bold text-gray-500">₹</span>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) =>
                  setBudgetLimit(parseFloat(e.target.value) || 0)
                }
                className="w-16 bg-transparent text-sm font-black text-gray-800 dark:text-white focus:outline-none"
                placeholder="Set target"
              />
            </div>
          </div>

          {/* 📊 Modern Dynamic Progress Bar Tracker */}
          <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden transition-colors">
            <div
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                percentSpent >= 100
                  ? "bg-red-500"
                  : percentSpent >= 85
                    ? "bg-amber-500"
                    : "bg-blue-600 dark:bg-blue-500"
              }`}
            />
          </div>

          {/* Data Labels Footer Row */}
          <div className="flex justify-between items-center mt-2.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">
            <span>{Math.round(percentSpent)}% Utilized</span>
            <span>Limit: ₹{budgetLimit}</span>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-900 border dark:border-slate-800 text-white rounded-2xl p-6 text-center mb-6 shadow-md transition-colors">
          <span className="text-xl font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Total Amount Spent
          </span>
          <h2 className="text-3xl font-black">₹{totalExpense}</h2>
        </div>

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
          {/* Expense Title Field Box */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">
              Expense Title
            </label>
            <input
              type="text"
              placeholder="e.g., Dinner, Groceries"
              value={inputTitle}
              onChange={(e) => {
                setInputTitle(e.target.value);
                if (errors.title)
                  setErrors((prev) => ({ ...prev, title: false })); // Clear red border instantly on type
              }}
              className={`w-full px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 text-sm transition-all border shadow-sm placeholder-gray-400 dark:placeholder-gray-500
        ${
          errors.title
            ? "border-red-500 focus:ring-red-500/20"
            : "border-gray-200 dark:border-slate-700 focus:ring-blue-500"
        }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1 animate-fade-in">
                ⚠️ Expense title is required.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Amount Input Field Box */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1 transition-colors">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="150"
                value={inputAmount}
                onChange={(e) => {
                  setInputAmount(e.target.value);
                  if (errors.amount)
                    setErrors((prev) => ({ ...prev, amount: false })); // Clear red border instantly on type
                }}
                className={`w-full px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 text-sm transition-all border shadow-sm placeholder-gray-400 dark:placeholder-gray-500
          ${
            errors.amount
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-200 dark:border-slate-700 focus:ring-blue-500"
          }`}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1 animate-fade-in">
                  ⚠️ Enter an amount &gt; 0.
                </p>
              )}
            </div>

            {/* Category Selector Field Box */}
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
      {/* 🔔 FLOATING ALERT INJECTION NODE */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
};

export default TrackerPage;
