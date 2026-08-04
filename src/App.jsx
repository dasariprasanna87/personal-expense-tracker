import { useState, useEffect, useContext } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import TrackerPage from "./pages/TrackerPage";
import DirectoryPage from "./pages/DirectoryPage";
// 📥 Import the Context hooks
import { DashboardContext } from "./context/DashboardContext";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("savedTheme");
    return savedTheme === "dark";
  });

  // ☁️ Tap directly into the global cloud to read data instantly!
  const { team } = useContext(DashboardContext);

  useEffect(() => {
    const rootElement = document.documentElement;
    if (darkMode) {
      rootElement.classList.add("dark");
      localStorage.setItem("savedTheme", "dark");
    } else {
      rootElement.classList.remove("dark");
      localStorage.setItem("savedTheme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-300">
        <nav className="bg-white border-b border-gray-100 dark:bg-slate-900 dark:border-slate-800 p-4 shadow-sm rounded-b-xl transition-colors duration-300">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <span className="font-bold text-blue-600 dark:text-yellow-300 text-xl transition-colors">
              My Dashboard App
            </span>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-yellow-300 transition-colors"
              >
                💰 Expenses
              </Link>

              <Link
                to="/directory"
                className="text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-yellow-300 transition-colors flex items-center gap-1.5"
              >
                👥 Employees
                <span className="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-bold transition-all">
                  {team.length} {/* Loaded globally */}
                </span>
              </Link>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 transition active:scale-95 cursor-pointer font-semibold shadow-sm"
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
          </div>
        </nav>

        <div className="py-6">
          <Routes>
            <Route path="/" element={<TrackerPage />} />
            {/* 🛑 NOTICE: No more prop drilling! DirectoryPage loads its own data now */}
            <Route path="/directory" element={<DirectoryPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
